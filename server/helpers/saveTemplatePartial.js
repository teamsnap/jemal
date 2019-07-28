const fs = require('fs-extra');

const templatePath = './emails/templates-partials';

const saveTemplatePartial = async (file, folderPath, source) => {
  try {
    await fs.outputFile(
      `${templatePath}${folderPath}/${file
        .replace(/\s+/g, '-')
        .toLowerCase()}.mjml`,
      source
    );
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { saveTemplatePartial }