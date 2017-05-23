'use babel';

let isCSS = item => {
  return (item.match(/;/g) || []).length === 1;
};

let toCamel = prop => {
  return prop.replace(/-(\w|$)/g, (dash, next) => next.toUpperCase());
};

let toJS = item => {
  let [prop, val] = item.split(':');
  let whiteSpace = prop.indexOf(prop.trim()) + 1;
  return (
    Array(whiteSpace).join(' ') +
    toCamel(prop.trim()) +
    ": '" +
    val.trim().replace(';', '') +
    "',"
  );
};

let isJS = item => {
  return (item.match(/,/g) || []).length === 1;
};

let toHyphen = prop => {
  return prop.replace(/([A-Z])/g, char => `-${char[0].toLowerCase()}`);
};

let toCSS = item => {
  let [prop, val] = item.split(':');
  let whiteSpace = prop.indexOf(prop.trim()) + 1;
  return (
    Array(whiteSpace).join(' ') +
    toHyphen(prop.trim()) +
    ': ' +
    val.trim().replace(/'|,/g, '') +
    ';'
  );
};

export default function convert(s) {
  let lines = s.split('\n');
  return lines
    .map(item => {
      if (isCSS(item)) {
        return toJS(item);
      } else if (isJS(item)) {
        return toCSS(item);
      } else {
        return item;
      }
    })
    .join('\n');
}
