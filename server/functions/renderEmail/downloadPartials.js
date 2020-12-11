const fs = require('fs-extra');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const downloadPartials = async (partials, templatePath) => {
  try {
    await asyncForEach(partials, async ({ title, mjmlSource, folderPath }) => {
      const file = `${templatePath}emails/templates-partials${folderPath}/${title
        .replace(/\s+/g, '-')
        .toLowerCase()}.mjml`;

      console.log(`outputting ${file}`);

      await fs.outputFile(file, mjmlSource);
    });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = downloadPartials;
