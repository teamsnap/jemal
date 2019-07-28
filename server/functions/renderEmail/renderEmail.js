const mjml2html = require('mjml');
const fs = require('fs-extra');
const { registerComponent } = require('mjml-core');
const { mjBulletProofButton } = require('../../components');

const downloadPartials = require('./downloadPartials');

// todo: refactor render email function to one function to be reused

registerComponent(mjBulletProofButton);

const renderEmail = async (source, partials) => {
  const templatePath = './emails/templates-partials';

  try {
    await downloadPartials(partials, templatePath);
    const data = await mjml2html(source);

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

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
