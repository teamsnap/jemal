const { getScreenshot } = require('./chromium');
const renderEmail = require('../renderEmail/renderEmailSingle');

module.exports = async function(req, res) {
  try {
    const { body } = req;
    const html = await renderEmail(body.mjmlSource, body.partials);

    const file = await getScreenshot(html.html);
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
