const mjml2html = require('mjml');
const { registerComponent } = require('mjml-core');
const { mjBulletProofButton } = require('../../components');
const downloadPartials = require('./downloadPartials');

registerComponent(mjBulletProofButton);

const renderEmail = async (source, partials) => {
  const templatePath = './emails/templates-partials';

  try {
    await downloadPartials(partials, templatePath);
    const data = await mjml2html(source, { minify: true });

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = renderEmail;
