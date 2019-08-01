const renderEmail = require('./renderEmailSingle');

module.exports = async function(req, res) {
  try {
    const { body } = req;
    const html = await renderEmail(body.mjmlSource, body.partials);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(html);
  } catch (e) {
    console.error(e.message);
    res.setHeader('Content-Type', 'text/html');
    res
      .status(500)
      .send('<h1>Unexpected Error</h1><p>Sorry, there was a problem</p>');
  }
};
