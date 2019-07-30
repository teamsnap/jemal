const mjml2html = require('mjml');
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

module.exports = renderEmail;
