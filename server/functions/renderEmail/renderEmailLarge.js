const mjml2html = require('mjml');
const fs = require('fs-extra');

const downloadPartials = require('./downloadPartials');

// todo: refactor render email function to one function to be reused
const templatePath = './server/emails/';
const options = {};

const renderEmailLarge = async (file, source) => {
  try {
    await downloadPartials();
    await fs.outputFile(`${templatePath}/${file}`, source);
    const readEmail = await fs.readFile(`${templatePath}/${file}`, 'utf8');
    const { html } = await mjml2html(readEmail, options);
    const screenPath = `${templatePath}screenshots/${file}-large.jpg`;
    const screenPathPublic = `${
      process.env.APP_URL
    }/emails/screenshots/${file}-large.jpg`;

    // take screenshot from cloud function

    const finishedImage = '';

    return finishedImage;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = async function(req, res) {
  try {
    // const data = renderEmailLarge();
    const data = { test: 'test' };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(data);
  } catch (e) {
    console.error(e.message);
    res.setHeader('Content-Type', 'text/html');
    res
      .status(500)
      .send('<h1>Unexpected Error</h1><p>Sorry, there was a problem</p>');
  }
};
