const fs = require('fs-extra');

const downloadPartials = async (partials, templatePath) => {
  try {
    partials.forEach(async ({ title, mjmlSource, folderPath }) => {
      await fs.outputFile(
        `${templatePath}${folderPath}/${title
          .replace(/\s+/g, '-')
          .toLowerCase()}.mjml`,
        mjmlSource
      );
    });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = downloadPartials;
