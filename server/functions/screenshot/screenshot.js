const { parse } = require('url');
const { getScreenshot } = require('./chromium');
const { getInt, getUrlFromPath, isValidUrl } = require('./validator');

module.exports = async function(req, res) {
  try {
    const { pathname = '/' } = parse(req.url);
    const { type = 'png', quality, fullPage } = req.query;
    const url = getUrlFromPath(pathname);
    const qual = getInt(quality);
    if (!isValidUrl(url)) {
      res.setHeader('Content-Type', 'text/html');
      res
        .status(400)
        .send(
          `<h1>Bad Request</h1><p>The url <em>${url}</em> is not valid.</p>`
        );
    } else {
      const file = await getScreenshot(url, type, qual, fullPage);
      res.setHeader('Content-Type', `image/${type}`);
      res.status(200).send(file);
    }
  } catch (e) {
    console.error(e.message);
    res.setHeader('Content-Type', 'text/html');
    res
      .status(500)
      .send('<h1>Unexpected Error</h1><p>Sorry, there was a problem</p>');
  }
};
