const path = require('path');
const fs = require('fs');
const docgen = require('react-docgen');

const paths = [
  'Libraries/StyleSheet/LayoutPropTypes.js',
  'Libraries/StyleSheet/TransformPropTypes.js',
  'Libraries/Components/View/ShadowPropTypesIOS.js',
  'Libraries/Components/View/ViewStylePropTypes.js',
  'Libraries/Text/TextStylePropTypes.js',
  'Libraries/Image/ImageStylePropTypes.js',
];

//Forked from
//https://github.com/facebook/react-native/blob/master/website/server/extractDocs.js#L508
const styleDocs = paths.reduce((docs, filepath) => {
  const props = docgen.parse(
    fs.readFileSync(path.resolve('node_modules/react-native', filepath)),
    findExportedObject,
    [docgen.handlers.propTypeHandler, docgen.handlers.propDocBlockHandler]
  ).props;

  // Remove deprecated transform props from docs
  if (filepath === 'Libraries/StyleSheet/TransformPropTypes.js') {
    [
      'rotation',
      'scaleX',
      'scaleY',
      'translateX',
      'translateY',
    ].forEach(function(key) {
      delete props[key];
    });
  }

  let newProps = {};
  const propType = path.basename(filepath).replace(path.extname(filepath), '');
  Object.keys(props).forEach(function(key) {
    newProps[key] = {
      type: getType(props[key].type),
      propType: getPropType(propType),
      values:
        props[key].type.name === 'enum' &&
        typeof props[key].type.value !== 'string'
          ? props[key].type.value.map(x => x.value.replace(/("|')/g, ''))
          : [],
      description:
        props[key].description === ''
          ? propType
          : props[key].description.replace(/`/g, "'"),
    };
  });
  return Object.assign(docs, newProps);
}, {});

fs.writeFile(
  path.resolve(__dirname, '../../completions-rn.json'),
  `${JSON.stringify(styleDocs, null, '  ')}\n`,
  error => (error ? console.log(error) : console.log('Done'))
);

function getType(type) {
  switch (type.name) {
    case 'union':
      return type.value.map(x => x.name).join(' | ');
    case 'custom':
      return '';
    default:
      return type.name;
  }
}

function getPropType(type) {
  switch (type) {
    case 'LayoutPropTypes':
      return 'layout-props';
    case 'TransformPropTypes':
      return 'transforms';
    case 'ShadowPropTypesIOS':
      return 'shadow-props';
    default:
      return type.toLowerCase();
  }
}

//Helpers
//https://github.com/facebook/react-native/blob/master/website/server/docgenHelpers.js#L180
function findExportedObject(ast, recast) {
  let objPath;
  recast.visit(ast, {
    visitAssignmentExpression: function(path) {
      if (!objPath && docgen.utils.isExportsOrModuleAssignment(path)) {
        objPath = docgen.utils.resolveToValue(path.get('right'));
      }
      return false;
    },
  });

  if (objPath) {
    // Hack: This is easier than replicating the default propType
    // handler.
    // This converts any expression, e.g. `foo` to an object expression of
    // the form `{propTypes: foo}`
    const b = recast.types.builders;
    const nt = recast.types.namedTypes;
    let obj = objPath.node;

    // Hack: This is converting calls like
    //
    //    Object.apply(Object.create(foo), { bar: 42 })
    //
    // to an AST representing an object literal:
    //
    //    { ...foo, bar: 42 }
    if (
      nt.CallExpression.check(obj) &&
      recast.print(obj.callee).code === 'Object.assign'
    ) {
      obj = objPath.node.arguments[1];
      let firstArg = objPath.node.arguments[0];
      if (recast.print(firstArg.callee).code === 'Object.create') {
        firstArg = firstArg.arguments[0];
      }
      obj.properties.unshift(b.spreadProperty(firstArg));
    }

    objPath.replace(
      b.objectExpression([b.property('init', b.literal('propTypes'), obj)])
    );
  }
  return objPath;
}
