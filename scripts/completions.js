// copied from https://github.com/atom/autocomplete-css
// Copyright (c) 2015 GitHub Inc.

const path = require('path');
const fs = require('fs');
const request = require('request');
const fetchDocs = require('./fetchDocs');

const PropertiesURL =
  'https://raw.githubusercontent.com/adobe/brackets/master/src/extensions/default/CSSCodeHints/CSSProperties.json';

const propertiesPromise = new Promise(resolve =>
  request({json: true, url: PropertiesURL}, (error, response, properties) => {
    if (error != null) {
      console.error(error.message);
      resolve(null);
    }
    if (response.statusCode !== 200) {
      console.error(
        `Request for CSSProperties.json failed: ${response.statusCode}`
      );
      resolve(null);
    }
    return resolve(properties);
  })
);

const propertyDescriptionsPromise = fetchDocs();

Promise.all([propertiesPromise, propertyDescriptionsPromise]).then(values => {
  const properties = {};
  const propertiesRaw = values[0];
  const propertyDescriptions = values[1];
  const sortedPropertyNames = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'css/sorted-property-names.json'))
  );
  for (var propertyName of Array.from(sortedPropertyNames)) {
    let metadata;
    if (!(metadata = propertiesRaw[propertyName])) {
      continue;
    }
    metadata.description = propertyDescriptions[propertyName];
    properties[propertyName] = metadata; // Converting only propertyName to camelcase
    if (propertyDescriptions[propertyName] == null) {
      console.warn(`No description for property ${propertyName}`);
    }
  }

  for (propertyName in propertiesRaw) {
    if (!sortedPropertyNames.includes(propertyName)) {
      console.warn(
        `Ignoring ${propertyName}; not in sorted-property-names.json`
      );
    }
  }

  const tags = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'css/html-tags.json'))
  );
  const pseudoSelectors = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'css/pseudo-selectors.json'))
  );

  const completions = {tags, properties, pseudoSelectors};
  return fs.writeFileSync(
    path.join(__dirname, '../completions.json'), //root folder
    `${JSON.stringify(completions, null, '  ')}\n`
  );
});
