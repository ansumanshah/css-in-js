export { default as CSS_COMPLETIONS } from '../completions-css.json'
export { default as RN_COMPLETIONS } from '../completions-rn.json'

export const getBeginningWhitespace = (string: string) =>
  string.match(/^\s+/) !== null ? string.match(/^\s+/)[0] : ''

// return if the item ends with ; and such semi-colon the only one in the item
export const isCSS = (item: string) =>
  item.trim().endsWith(';') && (item.match(/;/g) || []).length == 1

// return if the item ends with , such comma is the only one which is not wrapped with quotes
export const isJS = (item: string) =>
  item.trim().endsWith(',') &&
  item.match(/(,)(?=(?:[^"']|("|')[^"']*("|'))*$)/g).length === 1

export const toHyphen = (prop: string) =>
  prop.replace(/([A-Z])/g, (char) => `-${char[0].toLowerCase()}`)

export const toCamel = (prop: string) =>
  prop.replace(/-(\w|$)/g, (dash, next) => next.toUpperCase())

export const toJS = (item: string) => {
  let [prop, val] = item.split(/:(.+)/, 2) // in case of bg-url, the value might contain colon :
  val = val.trim().slice(0, -1) // remove trailing semi-colon
  let wrappingQuotes = "'" // handle if the property already contains quotes
  if (!isNaN(+val)) {
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

export const toCSS = (item: string) => {
  let [prop, val] = item.split(/:(.+)/, 2)
  val = val.trim().slice(0, -1) // remove trailing comma
  return `${getBeginningWhitespace(prop)}${toHyphen(prop.trim())}: ${
    isNaN(+val.trim()) ? val.slice(1, -1) : Number(val)
  };`
}

export const firstCharsEqual = (str1: string, str2: string) =>
  str1[0].toLowerCase() === str2[0].toLowerCase()

export const lineEndsWithComma = (text: string) => /,\s*$/.test(text)

export const isPropertyValuePrefix = (prefix: string) =>
  prefix.trim().length > 0 && prefix.trim() !== ':'

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

type RegExpArray = RegExpExecArray | RegExpMatchArray

export function __guard__<T>(
  value: RegExpArray | null | undefined,
  transform: (value: RegExpArray) => T
) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined
}

export function isPropertyNamePrefix(prefix: string) {
  if (prefix == null) {
    return false
  }
  prefix = prefix.trim()
  return prefix.length > 0 && prefix.match(/^[a-zA-Z-]+$/)
}

export function getImportantPrefix(text: string) {
  return __guard__(importantPrefixPattern.exec(text), (x) => x[1])
}

export default function convert(s: string) {
  const lines = s.split('\n')
  return lines
    .map((item) => (isCSS(item) ? toJS(item) : isJS(item) ? toCSS(item) : item))
    .join('\n')
}
