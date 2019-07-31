const fetch = require('node-fetch');
const { getScreenshot } = require('./chromium');

module.exports = async function(req, res) {
  try {
    const { body, headers } = req;
    const appUrl =
      headers['x-now-deployment-url'] === 'localhost:3000'
        ? `http://${req.headers['x-now-deployment-url']}`
        : `https://${req.headers['x-now-deployment-url']}`;

    const serverlessBody = JSON.stringify({
      mjmlSource: body.mjmlSource,
      partials: body.partials
    });

    const fetchEmail = await fetch(`${appUrl}/renderEmail`, {
      method: 'POST',
      body: serverlessBody,
      headers: { 'Content-Type': 'application/json' }
    });

    const emailRender = await fetchEmail.json();

    const file = await getScreenshot(emailRender.html);
    res.setHeader('Content-Type', `image/jpeg`);
    res.status(200).send(file);
  } catch (e) {
    console.error(e.message);
    res.setHeader('Content-Type', 'text/html');
    res
      .status(500)
      .send('<h1>Unexpected Error</h1><p>Sorry, there was a problem</p>');
  }
};
