const https = require('https');

// const url = 'https://www.npmjs.com/search?q=keywords%3Aopen-wc';
// const url = 'https://api.npms.io/v2/search?q=keywords:open-wc';
const url = 'https://api.npms.io/v2/search?q=';

exports.handler = function(event, context, callback) {
  const searchUrl = url + event.queryStringParameters.q;

  https.get(searchUrl, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      const jsonData = JSON.parse(data);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(jsonData, null, 2),
      });
    });

  }).on('error', (err) => {
    console.log('Error: ' + err.message);
  });
}
