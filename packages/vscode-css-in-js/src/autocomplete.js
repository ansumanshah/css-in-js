import vscode from 'vscode'
import {
  CSS_COMPLETIONS,
  RN_COMPLETIONS,
  firstCharsEqual,
  lineEndsWithComma,
  isPropertyValuePrefix,
  firstInlinePropertyNameWithColonPattern,
  inlinePropertyNameWithColonPattern,
  propertyNameWithColonPattern,
  propertyNamePrefixPattern,
  pseudoSelectorPrefixPattern,
  cssDocsURL,
  __guard__,
  isPropertyNamePrefix,
  toHyphen,
  getImportantPrefix
} from 'css-in-js-helpers'

module.exports = {
  properties: CSS_COMPLETIONS.properties,
  pseudoSelectors: CSS_COMPLETIONS.pseudoSelectors,
  rnProperties: RN_COMPLETIONS, // TODO: actually use this

  getPseudoSelectorPrefix (text) {
    return __guard__(text.match(pseudoSelectorPrefixPattern), x => x[0])
  },

  getPropertyNamePrefix (text) {
    return __guard__(propertyNamePrefixPattern.exec(text), x => x[0])
  },

  isCompletingPseudoSelector (text) {
    return this.getPseudoSelectorPrefix(text)
  },

  isCompletingValue (text) {
    if (
      text.length - text.replace(/:/g, '').length ===
      text.length - text.replace(/,/g, '').length
    ) {
      return false
    }
    return (
      inlinePropertyNameWithColonPattern.exec(text) ||
      firstInlinePropertyNameWithColonPattern.exec(text) ||
      propertyNameWithColonPattern.exec(text)
    )
  },

  isCompletingName (text) {
    const prefix = this.getPropertyNamePrefix(text)
    return isPropertyNamePrefix(prefix)
  },

  getPseudoSelectorCompletions (text) {
    const completions = []
    const prefix = this.getPseudoSelectorPrefix(text).replace("'", '')
    const colonsFromText = text.trim().match(/:?:/)[0] || ''

    if (!prefix) {
      return null
    }

    for (let pseudoSelector in this.pseudoSelectors) {
      const options = this.pseudoSelectors[pseudoSelector]
      if (firstCharsEqual(pseudoSelector, prefix)) {
        completions.push(
          this.buildPseudoSelectorCompletion(
            pseudoSelector,
            options,
            colonsFromText
          )
        )
      }
    }

    return completions
  },

  getPropertyValueCompletions (text) {
    const prefix = this.getPropertyNamePrefix(text)
    const property = text.substr(0, text.lastIndexOf(':')).trim()
    const styles = this.properties
    const values =
      styles[property] != null ? styles[property].values : undefined

    if (values === null) {
      return null
    }

    const addComma = !lineEndsWithComma(text)
    const completions = []
    let value

    if (isPropertyValuePrefix(prefix)) {
      for (value of Array.from(values)) {
        if (firstCharsEqual(value, prefix)) {
          completions.push(
            this.buildPropertyValueCompletion(property, value, addComma)
          )
        }
      }
    } else {
      for (value of Array.from(values)) {
        completions.push(
          this.buildPropertyValueCompletion(property, value, addComma)
        )
      }
    }

    if (getImportantPrefix(text)) {
      completions.push(
        this.vsCompletionItem(
          'important',
          'Forces this property to override any other declaration of the same property. Use with caution.',
          `${cssDocsURL}/Specificity#The_!important_exception`
        )
      )
    }

    return completions
  },

  getPropertyNameCompletions (text) {
    const prefix = this.getPropertyNamePrefix(text)
    const completions = []
    const styles = this.properties
    for (let property in styles) {
      const options = styles[property]
      if (!prefix || firstCharsEqual(property, prefix)) {
        completions.push(this.buildPropertyNameCompletion(property, options))
      }
    }
    return completions
  },

  buildPseudoSelectorCompletion (
    pseudoSelector,
    { description },
    colonsFromText
  ) {
    return this.vsCompletionItem(
      pseudoSelector,
      description,
      `${cssDocsURL}/${pseudoSelector}`,
      pseudoSelector.replace(colonsFromText, '')
    )
  },

  buildPropertyNameCompletion (propertyName, { description }) {
    return this.vsCompletionItem(
      propertyName,
      description,
      `${cssDocsURL}/${toHyphen(propertyName)}`,
      `${propertyName}: `
    )
  },

  buildPropertyValueCompletion (propertyName, value, addComma) {
    const text = `'${value}'${addComma ? ',' : ''}`
    const detail = `${value} value for the ${propertyName} property`
    return this.vsCompletionItem(
      value,
      detail,
      `${cssDocsURL}/${toHyphen(propertyName)}#Values`,
      text,
      'Value'
    )
  },

  vsCompletionItem (text, detail, documentation = '', insertedText = false, itemKind = 'Property') {
    const item = new vscode.CompletionItem(
      text,
      vscode.CompletionItemKind[itemKind]
    )
    item.detail = detail
    item.documentation = documentation
    item.insertText = insertedText
    return item
  }
}
