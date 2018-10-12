import fs from 'fs-extra';

const templatePath = './emails/templates-partials';

export async function saveTemplatePartial(file, folderPath, source) {
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
