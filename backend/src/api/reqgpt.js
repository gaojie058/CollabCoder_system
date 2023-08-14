const https = require('https');

const options = {
  hostname: 'api.openai.com',
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  }
};


const getResponseData = async (promptText) => {
  const data = {
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: promptText
    }]
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve(responseData);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(data));

    req.end();
  });
}

module.exports = getResponseData
