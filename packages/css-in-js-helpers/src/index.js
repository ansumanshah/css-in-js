const CSS_COMPLETIONS = require('../completions-css.json')
const RN_COMPLETIONS = require('../completions-rn.json')

const getBeginningWhitespace = string =>
  string.match(/^\s+/) !== null ? string.match(/^\s+/)[0] : ''

// return if the item ends with ; and such semi-colon the only one in the item
const isCSS = item =>
  item.trim().endsWith(';') && (item.match(/;/g) || []).length == 1

// return if the item ends with , such comma is the only one which is not wrapped with quotes
const isJS = item =>
  item.trim().endsWith(',') &&
  item.match(/(,)(?=(?:[^"']|("|')[^"']*("|'))*$)/g).length === 1

const toHyphen = prop =>
  prop.replace(/([A-Z])/g, char => `-${char[0].toLowerCase()}`)

const toCamel = prop =>
  prop.replace(/-(\w|$)/g, (dash, next) => next.toUpperCase())

const toJS = item => {
  let [prop, val] = item.split(/:(.+)/, 2) // in case of bg-url, the value might contain colon :
  val = val.trim().slice(0, -1) // remove trailing semi-colon
  let wrappingQuotes = "'" // handle if the property already contains quotes
  if (!isNaN(val)) {
    wrappingQuotes = ''
  } else if (val.includes("'") && val.includes('"')) {
    return item
  } else if (val.includes("'")) {
    wrappingQuotes = '"'
  }
  return `${getBeginningWhitespace(prop)}${toCamel(
    prop.trim()
  )}: ${wrappingQuotes}${val}${wrappingQuotes},`
}

const toCSS = item => {
  let [prop, val] = item.split(/:(.+)/, 2)
  val = val.trim().slice(0, -1) // remove trailing comma
  return `${getBeginningWhitespace(prop)}${toHyphen(prop.trim())}: ${isNaN(val.trim()) ? val.slice(1, -1) : Number(val)
    };`
}

const firstCharsEqual = (str1, str2) => str1[0].toLowerCase() === str2[0].toLowerCase()

const lineEndsWithComma = text => /,\s*$/.test(text)

const isPropertyValuePrefix = prefix => prefix.trim().length > 0 && prefix.trim() !== ':'

const firstInlinePropertyNameWithColonPattern = /(?:{{|{)\s*(\S+)\s*:/

const inlinePropertyNameWithColonPattern = /(?:,.+?)*,\s*(\S+)\s*:/

const inlinePropertyStartWithColonPattern = /(?::.+?)*,\s*/

const propertyNameWithColonPattern = /^\s*(\S+)\s*:/

const propertyNamePrefixPattern = /[a-zA-Z]+[-a-zA-Z]*$/

const pseudoSelectorPrefixPattern = /\':(:)?([a-z]+[a-z-]*)?(\')?$/

const tagSelectorPrefixPattern = /(^|\s|,)([a-z]+)?$/

const importantPrefixPattern = /(![a-z]+)$/

const cssDocsURL = 'https://developer.mozilla.org/en-US/docs/Web/CSS'

const rnDocsURL = 'https://facebook.github.io/react-native/docs'

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined
}

function isPropertyNamePrefix(prefix) {
  if (prefix == null) {
    return false
  }
  prefix = prefix.trim()
  return prefix.length > 0 && prefix.match(/^[a-zA-Z-]+$/)
}

function getImportantPrefix(text) {
  return __guard__(importantPrefixPattern.exec(text), x => x[1])
}

export default function convert(s) {
  const lines = s.split('\n')
  return lines
    .map(item => (isCSS(item) ? toJS(item) : isJS(item) ? toCSS(item) : item))
    .join('\n')
}

export {
  CSS_COMPLETIONS,
  RN_COMPLETIONS,
  firstCharsEqual,
  lineEndsWithComma,
  isPropertyValuePrefix,
  firstInlinePropertyNameWithColonPattern,
  inlinePropertyNameWithColonPattern,
  inlinePropertyStartWithColonPattern,
  propertyNameWithColonPattern,
  propertyNamePrefixPattern,
  pseudoSelectorPrefixPattern,
  tagSelectorPrefixPattern,
  importantPrefixPattern,
  cssDocsURL,
  rnDocsURL,
  __guard__,
  isPropertyNamePrefix,
  toHyphen,
  getImportantPrefix
}