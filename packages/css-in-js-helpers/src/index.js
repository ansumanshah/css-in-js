const getBeginningWhitespace = string =>
  string.match(/^\s+/) !== null ? string.match(/^\s+/)[0] : ''

const isCSS = item => (item.match(/;/g) || []).length === 1

const isJS = item => (item.match(/,/g) || []).length === 1

const toHyphen = prop =>
  prop.replace(/([A-Z])/g, char => `-${char[0].toLowerCase()}`)

const toCamel = prop =>
  prop.replace(/-(\w|$)/g, (dash, next) => next.toUpperCase())

const toJS = item => {
  const [prop, val] = item.split(':')
  return `${getBeginningWhitespace(prop)}${toCamel(
    prop.trim()
  )}: '${val.trim().replace(';', '')}',`
}

const toCSS = item => {
  const [prop, val] = item.split(':')
  return `${getBeginningWhitespace(prop)}${toHyphen(
    prop.trim()
  )}: ${val.trim().replace(/'|,/g, '')};`
}

export default function convert(s) {
  const lines = s.split('\n')
  return lines
    .map(item => (isCSS(item) ? toJS(item) : isJS(item) ? toCSS(item) : item))
    .join('\n')
}
export const firstCharsEqual = (str1, str2) => str1[0].toLowerCase() === str2[0].toLowerCase()
export const firstInlinePropertyNameWithColonPattern = /(?:{{|{)\s*(\S+)\s*:/
export const inlinePropertyNameWithColonPattern = /(?:,.+?)*,\s*(\S+)\s*:/
export const inlinePropertyStartWithColonPattern = /(?::.+?)*,\s*/
export const propertyNameWithColonPattern = /^\s*(\S+)\s*:/
export const propertyNamePrefixPattern = /[a-zA-Z]+[-a-zA-Z]*$/
export const pseudoSelectorPrefixPattern = /\':(:)?([a-z]+[a-z-]*)?(\')?$/
export const tagSelectorPrefixPattern = /(^|\s|,)([a-z]+)?$/
export const importantPrefixPattern = /(![a-z]+)$/
export const cssDocsURL = 'https://developer.mozilla.org/en-US/docs/Web/CSS'
export const rnDocsURL = 'https://facebook.github.io/react-native/docs'
