// copied from https://github.com/atom/autocomplete-css
// Copyright (c) 2015 GitHub Inc.
const CSS_COMPLETIONS = require('../completions-css.json');
const RN_COMPLETIONS = require('../completions-rn.json');

const firstInlinePropertyNameWithColonPattern = /(?:{{|{)\s*(\S+)\s*:/; // example { display: }
const inlinePropertyNameWithColonPattern = /(?:,.+?)*,\s*(\S+)\s*:/; // example { display: block, float: left, color: } (match the last one)
const inlinePropertyStartWithColonPattern = /(?::.+?)*,\s*/; // example { display: block, float: left, co } (match the last one)
const propertyNameWithColonPattern = /^\s*(\S+)\s*:/; // display:
const propertyNamePrefixPattern = /[a-zA-Z]+[-a-zA-Z]*$/;
const pseudoSelectorPrefixPattern = /\':(:)?([a-z]+[a-z-]*)?(\')?$/;
const tagSelectorPrefixPattern = /(^|\s|,)([a-z]+)?$/;
const importantPrefixPattern = /(![a-z]+)$/;
const cssDocsURL = 'https://developer.mozilla.org/en-US/docs/Web/CSS';
const rnDocsURL = 'https://facebook.github.io/react-native/docs';

module.exports = {
  selector: '.source.js.jsx',
  disableForSelector: '.source.js.jsx .comment',
  properties: CSS_COMPLETIONS.properties,
  pseudoSelectors: CSS_COMPLETIONS.pseudoSelectors,
  rnProperties: RN_COMPLETIONS,

  // Tell autocomplete to fuzzy filter the results of getSuggestions(). We are
  // still filtering by the first character of the prefix in this provider for
  // efficiency.
  inclusionPriority: 1,
  suggestionPriority: 2,
  filterSuggestions: true,
  rnStyles: false,

  getSuggestions(request) {
    scopes = request.scopeDescriptor.getScopesArray();
    isJSX = hasScope(scopes, 'JSXAttrs');

    const pos = isJSX
      ? getStartingPosition(request, '{', '}')
      : getStartingPosition(request);
    if (pos == null) {
      // Exclude undefined
      return;
    }
    let completions = null;
    let line = request.editor.getTextInRange([[pos.row, 0], pos]);
    let regex = new RegExp(atom.config.get('css-in-js.cssRegEx'));
    if (!regex.test(line)) {
      return;
    }

    this.rnStyles =
      atom.config.get('css-in-js.rnStyles') && /StyleSheet\.create/.test(line);

    if (this.isCompletingPseudoSelector(request)) {
      completions = this.getPseudoSelectorCompletions(request);
    } else if (this.isCompletingValue(request)) {
      completions = this.getPropertyValueCompletions(request);
    } else {
      if (this.isCompletingName(request)) {
        completions = this.getPropertyNameCompletions(request);
      }
      // else if (this.isCompletingNameOrTag(request)) {
      //   completions = this.getPropertyNameCompletions(request).concat(
      //     this.getTagCompletions(request)
      //   );
      // }
    }
    return completions;
  },

  onDidInsertSuggestion({editor, suggestion}) {
    if (suggestion.type === 'property') {
      return setTimeout(this.triggerAutocomplete.bind(this, editor), 1);
    }
  },

  triggerAutocomplete(editor) {
    return atom.commands.dispatch(
      atom.views.getView(editor),
      'autocomplete-plus:activate',
      {activatedManually: false}
    );
  },

  isCompletingValue({scopeDescriptor, bufferPosition, prefix, editor}) {
    let line = editor.lineTextForBufferRow(bufferPosition.row);

    // TODO this is a QuickFIX write RegExp if possible
    if (
      line.length - line.replace(/:/g, '').length ===
      line.length - line.replace(/,/g, '').length
    ) {
      return false;
    }

    return (
      inlinePropertyNameWithColonPattern.exec(line) ||
      firstInlinePropertyNameWithColonPattern.exec(line) ||
      propertyNameWithColonPattern.exec(line)
    );
  },

  isCompletingPseudoSelector({editor, scopeDescriptor, bufferPosition}) {
    const prefix = this.getPseudoSelectorPrefix(editor, bufferPosition);
    return prefix;
  },

  isCompletingName({scopeDescriptor, bufferPosition, editor}) {
    const prefix = this.getPropertyNamePrefix(bufferPosition, editor);
    return this.isPropertyNamePrefix(prefix);
  },

  isPropertyValuePrefix(prefix) {
    prefix = prefix.trim();
    return prefix.length > 0 && prefix !== ':';
  },

  isPropertyNamePrefix(prefix) {
    if (prefix == null) {
      return false;
    }
    prefix = prefix.trim();
    return prefix.length > 0 && prefix.match(/^[a-zA-Z-]+$/);
  },

  getPreviousPropertyName(bufferPosition, editor) {
    let {row, column} = bufferPosition;
    while (row >= 0) {
      let line = editor.lineTextForBufferRow(row);
      if (row === bufferPosition.row) {
        line = line.substr(0, column);
      }
      let propertyName = __guard__(
        inlinePropertyNameWithColonPattern.exec(line),
        x => x[1]
      );
      if (propertyName == null) {
        propertyName = __guard__(
          firstInlinePropertyNameWithColonPattern.exec(line),
          x1 => x1[1]
        );
      }
      if (propertyName == null) {
        propertyName = __guard__(
          propertyNameWithColonPattern.exec(line),
          x2 => x2[1]
        );
      }
      if (propertyName) {
        return propertyName;
      }
      row--;
    }
  },

  getPropertyValueCompletions({
    bufferPosition,
    editor,
    prefix,
    scopeDescriptor,
  }) {
    let importantPrefix, value;
    const property = this.getPreviousPropertyName(bufferPosition, editor);
    const styles = this.rnStyles ? this.rnProperties : this.properties;
    const values =
      styles[property] != null ? styles[property].values : undefined;
    if (values == null) {
      return null;
    }

    const scopes = scopeDescriptor.getScopesArray();
    const addComma = !lineEndsWithComma(bufferPosition, editor);

    const completions = [];
    if (this.isPropertyValuePrefix(prefix)) {
      for (value of Array.from(values)) {
        if (firstCharsEqual(value, prefix)) {
          completions.push(
            this.buildPropertyValueCompletion(value, property, addComma)
          );
        }
      }
    } else {
      for (value of Array.from(values)) {
        completions.push(
          this.buildPropertyValueCompletion(value, property, addComma)
        );
      }
    }

    if ((importantPrefix = this.getImportantPrefix(editor, bufferPosition))) {
      // attention: règle dangereux
      completions.push({
        type: 'keyword',
        text: '!important',
        displayText: '!important',
        replacementPrefix: importantPrefix,
        description:
          'Forces this property to override any other declaration of the same property. Use with caution.',
        descriptionMoreURL: `${cssDocsURL}/Specificity#The_!important_exception`,
      });
    }

    return completions;
  },

  getImportantPrefix(editor, bufferPosition) {
    const line = editor.getTextInRange([
      [bufferPosition.row, 0],
      bufferPosition,
    ]);
    return __guard__(importantPrefixPattern.exec(line), x => x[1]);
  },

  buildPropertyValueCompletion(value, propertyName, addComma) {
    let text = "'" + value + "'";
    if (addComma) {
      text += ',';
    }

    return {
      type: 'value',
      text,
      displayText: value,
      description: `${value} value for the ${propertyName} property`,
      descriptionMoreURL: this.rnStyles
        ? `${rnDocsURL}/${this.rnProperties[propertyName].propType}.html#props`
        : `${cssDocsURL}/${toHyphen(propertyName)}#Values`,
    };
  },

  getPropertyNamePrefix(bufferPosition, editor) {
    const line = editor.getTextInRange([
      [bufferPosition.row, 0],
      bufferPosition,
    ]);
    return __guard__(propertyNamePrefixPattern.exec(line), x => x[0]);
  },

  getPropertyNameCompletions({
    bufferPosition,
    editor,
    scopeDescriptor,
    activatedManually,
  }) {
    // Don't autocomplete property names in SASS on root level
    const scopes = scopeDescriptor.getScopesArray();
    const line = editor.getTextInRange([
      [bufferPosition.row, 0],
      bufferPosition,
    ]);

    const prefix = this.getPropertyNamePrefix(bufferPosition, editor);
    if (!activatedManually && !prefix) {
      return [];
    }

    const completions = [];
    const styles = this.rnStyles ? this.rnProperties : this.properties;
    for (let property in styles) {
      const options = styles[property];
      if (!prefix || firstCharsEqual(property, prefix)) {
        completions.push(
          this.buildPropertyNameCompletion(property, prefix, options)
        );
      }
    }
    return completions;
  },

  buildPropertyNameCompletion(
    propertyName,
    prefix,
    {description, type, propType}
  ) {
    return {
      type: 'property',
      text: `${propertyName}: `,
      displayText: propertyName,
      replacementPrefix: prefix,
      rightLabel: type,
      description,
      descriptionMoreURL: this.rnStyles
        ? `${rnDocsURL}/${propType}.html#${propertyName.toLowerCase()}`
        : `${cssDocsURL}/${toHyphen(propertyName)}`,
    };
  },

  getPseudoSelectorPrefix(editor, bufferPosition) {
    const line = editor.getTextInRange([
      [bufferPosition.row, 0],
      bufferPosition,
    ]);
    return __guard__(line.match(pseudoSelectorPrefixPattern), x => x[0]);
  },

  getPseudoSelectorCompletions({bufferPosition, editor}) {
    let prefix = this.getPseudoSelectorPrefix(editor, bufferPosition);
    prefix = prefix.replace("'", '');
    if (!prefix) {
      return null;
    }

    const completions = [];
    for (let pseudoSelector in this.pseudoSelectors) {
      const options = this.pseudoSelectors[pseudoSelector];
      if (firstCharsEqual(pseudoSelector, prefix)) {
        completions.push(
          this.buildPseudoSelectorCompletion(pseudoSelector, prefix, options)
        );
      }
    }
    return completions;
  },

  buildPseudoSelectorCompletion(
    pseudoSelector,
    prefix,
    {argument, description}
  ) {
    const completion = {
      type: 'pseudo-selector',
      replacementPrefix: prefix,
      description,
      descriptionMoreURL: `${cssDocsURL}/${pseudoSelector}`,
    };

    if (argument != null) {
      completion.snippet = `${pseudoSelector}(\${1:${argument}})`;
    } else {
      completion.text = pseudoSelector;
    }
    return completion;
  },
};

const lineEndsWithComma = (bufferPosition, editor) => {
  const {row} = bufferPosition;
  const line = editor.lineTextForBufferRow(row);
  return /,\s*$/.test(line);
};

const toHyphen = prop =>
  prop.replace(/([A-Z])/g, char => `-${char[0].toLowerCase()}`);
const hyphentoCamel = prop =>
  prop.replace(/-(\w|$)/g, (dash, next) => next.toUpperCase());

const getStartingPosition = (request, beginChar = '(', endChar = ')') => {
  let pos = request.bufferPosition.copy();
  let depth = 0;
  while (pos.row >= 0) {
    const line = request.editor.lineTextForBufferRow(pos.row);
    if (pos.column === -1) {
      pos.column = line.length - 1;
    }
    while (pos.column >= 0) {
      switch (line[pos.column]) {
        case endChar:
          ++depth;
          break;
        case beginChar:
          if (--depth < 0) {
            return pos;
          }
          break;
      }
      --pos.column;
    }
    pos.column = -1;
    --pos.row;
  }
};

var hasScope = (scopesArray, scope) => scopesArray.indexOf(scope) !== -1;

var firstCharsEqual = (str1, str2) =>
  str1[0].toLowerCase() === str2[0].toLowerCase();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
