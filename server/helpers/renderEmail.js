import webshot from 'webshot';
import mjml2html from 'mjml';
import fs from 'fs-extra';
import { promisify } from 'util';

// todo: refactor render email function to one function to be reused
const templatePath = './server/emails/';
const options = {};

export async function renderEmail(file, source) {
  try {
    await fs.outputFile(`${templatePath}/${file}`, source);
    const readEmail = await fs.readFile(`${templatePath}/${file}`, 'utf8');
    const data = await mjml2html(readEmail, options);

    const optionsScreeny = {
      siteType: 'html',
      screenSize: {
        width: 405,
        height: 250
      },
      shotSize: {
        width: 405,
        height: 250
      },
      defaultWhiteBackground: true
    };

    webshot(
      data.html,
      `${templatePath}screenshots/${file}.jpg`,
      optionsScreeny,
      err => {
        if (err) throw new Error(err);
      }
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function renderEmailLarge(file, source) {
  try {
    await fs.outputFile(`${templatePath}/${file}`, source);
    const readEmail = await fs.readFile(`${templatePath}/${file}`, 'utf8');
    const { html } = await mjml2html(readEmail, options);
    const screenPath = `${templatePath}screenshots/${file}-large.jpg`;
    const screenPathPublic = `${
      process.env.APP_URL
    }/emails/screenshots/${file}-large.jpg`;

    const optionsLarge = {
      siteType: 'html',
      screenSize: {
        width: 1440,
        height: 2000
      },
      shotSize: {
        width: 'all',
        height: 'all'
      },
      defaultWhiteBackground: true
    };

    const webshotPromise = async (html, screenPath, optionsLarge) =>
      new Promise((resolve, reject) => {
        webshot(
          html,
          screenPath,
          optionsLarge,
          e => (!e ? resolve(screenPathPublic) : reject(e))
        );
      });

    const finishedImage = await webshotPromise(html, screenPath, optionsLarge);

    return finishedImage;
  } catch (err) {
    throw new Error(err);
  }
}
