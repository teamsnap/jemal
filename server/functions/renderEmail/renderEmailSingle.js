const mjml2html = require('mjml');
const fs = require('fs');
const { registerComponent } = require('mjml-core');
const { mjBulletProofButton } = require('../../components');
const downloadPartials = require('./downloadPartials');
const { resolve } = require('path');

registerComponent(mjBulletProofButton);

const renderEmail = async (source, partials) => {
  const tmp = '/tmp/emails';
  const templatePath = `${tmp}/templates-partials`;

  try {
    await downloadPartials(partials, templatePath);
    const data = await mjml2html(source, {
      filePath: '/tmp/',
      minify: true
    });

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = renderEmail;
