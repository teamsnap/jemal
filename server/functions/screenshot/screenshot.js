const fetch = require('node-fetch');
const { getScreenshot } = require('./chromium');

module.exports = async function (req, res) {
  try {
    const { body, headers, hostname } = req;
    const appUrl =
      hostname === 'localhost'
        ? `http://localhost:3000`
        : `https://ts-mar-email.now.sh`;

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

    const file = await getScreenshot(emailRender.html, body.options);
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
