export const generateUrl = (api, keywords, query) => {
  const result = `${api}?q=keywords:${keywords.join(',')} ${query}`;
  return result;
};

export const processResponseJson = json => {
  const processed = json;
  if (processed.results) {
    processed.results.forEach((meta, key) => {
      if (meta.package.keywords && meta.package.keywords.includes('owc-lit-element-2.x')) {
        processed.results[key].owcType = 'lit-element-2.x';
      }
    });
  }
  return processed;
};

export const handleMocks = (query, callback) => {
  let mock = false;
  switch (query) {
    case '::mock-single':
      mock = require('../mocks/single.js'); // eslint-disable-line
      break;
    case '::mocks':
      mock = require('../mocks/three.js'); // eslint-disable-line
      break;
    default:
      mock = false;
  }
  if (mock) {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(processResponseJson(mock.default), null, 2),
    });
    return true;
  }

  return false;
};
