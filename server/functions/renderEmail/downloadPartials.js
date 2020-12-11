const fs = require('fs-extra');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const downloadPartials = async (partials, templatePath) => {
  try {
    await asyncForEach(partials, async ({ title, mjmlSource, folderPath }) => {
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
