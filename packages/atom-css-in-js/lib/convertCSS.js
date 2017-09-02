'use babel';

import css from 'css';
import stringifyObject from 'stringify-object';

let toCamel = prop => {
  return prop
    .replace('.', '')
    .replace(/-(\w|$)/g, (dash, next) => next.toUpperCase());
};

let toUpperCamel = prop => {
  return prop
    .replace('.', '-')
    .replace(/-(\w|$)/g, (dash, next) => next.toUpperCase());
};

let getSnippet = snippet => {
  switch (atom.config.get('css-in-js.cssInJsOptions.snippet')) {
    case 'glamorous':
      return `const ${toUpperCamel(snippet.key)} = glamorous.div(${stringifyObject(
        snippet.style,
        {
          indent: '  ',
          singleQuotes: true,
        }
      )})`;
    case 'glamor':
      return `const ${toCamel(snippet.key)} = css(${stringifyObject(
        snippet.style,
        {
          indent: '  ',
          singleQuotes: true,
        }
      )})`;
  }
};
let toJS = (rules, options) => {
  let snippets = [];
  rules.forEach(rule => {
    if (rule.type === 'comment') return;
    else if (rule.type === 'rule') {
      var key, style = {};
      key = rule.selectors.join('-');
      rule.declarations.forEach(function(declaration) {
        style[toCamel(declaration.property)] = declaration.value;
      });
      snippets.push({ key, style });
    }
  });
  return snippets
    .map(snippet => {
      return getSnippet(snippet);
    })
    .join('\n\n');
};

export default function convert(s) {
  const ast = css.parse(s, {
    silent: atom.config.get('css-in-js.silenceErrors'),
  });
  if (ast.stylesheet && ast.stylesheet.rules) {
    return toJS(ast.stylesheet.rules, {});
  }
}
