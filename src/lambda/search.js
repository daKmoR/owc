const https = require('https');

// const url = 'https://www.npmjs.com/search?q=keywords%3Aopen-wc';
// const url = 'https://api.npms.io/v2/search?q=keywords:open-wc';
const url = 'https://api.npms.io/v2/search?q=';

const processResponseJson = json => {
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

const handleMocks = (query, callback) => {
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

exports.handler = function handler(event, context, callback) {
  const query = event.queryStringParameters.q;
  if (handleMocks(query, callback)) {
    return;
  }

  const searchUrl = url + query;
  https
    .get(searchUrl, resp => {
      let data = '';
      resp.on('data', chunk => {
        data += chunk;
      });

      resp.on('end', () => {
        const jsonData = processResponseJson(JSON.parse(data));
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(processResponseJson(jsonData), null, 2),
        });
      });
    })
    .on('error', err => {
      console.log(`Error: ${err.message}`); // eslint-disable-line no-console
    });
};
