const mjml2html = require('mjml');
const fs = require('fs-extra');

// todo: refactor render email function to one function to be reused
const templatePath = './server/emails/';
const options = {};

const renderEmail = async (file, source) => {
  try {
    await fs.outputFile(`${templatePath}/${file}`, source);
    const readEmail = await fs.readFile(`${templatePath}/${file}`, 'utf8');
    const data = await mjml2html(readEmail, options);

    // const browser = await puppeteer.launch({
    //     args: chrome.args,
    //     executablePath: await chrome.executablePath,
    //     headless: chrome.headless,
    // });

    // const page = await browser.newPage();
    // await page.setContent(data.html)
    // const file = await page.screenshot({ type: 'jpg', path: `${templatePath}screenshots/${file}.jpg` });
    // await browser.close();

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const renderEmailLarge = async (file, source) => {
  try {
    await fs.outputFile(`${templatePath}/${file}`, source);
    const readEmail = await fs.readFile(`${templatePath}/${file}`, 'utf8');
    const { html } = await mjml2html(readEmail, options);
    const screenPath = `${templatePath}screenshots/${file}-large.jpg`;
    const screenPathPublic = `${
      process.env.APP_URL
    }/emails/screenshots/${file}-large.jpg`;

    // const optionsLarge = {
    //   siteType: 'html',
    //   screenSize: {
    //     width: 1440,
    //     height: 2000
    //   },
    //   shotSize: {
    //     width: 'all',
    //     height: 'all'
    //   },
    //   defaultWhiteBackground: true
    // };

    // const webshotPromise = async (html, screenPath, optionsLarge) =>
    //   new Promise((resolve, reject) => {
    //     resolve('test')
    //     // webshot(
    //     //   html,
    //     //   screenPath,
    //     //   optionsLarge,
    //     //   e => (!e ? resolve(screenPathPublic) : reject(e))
    //     // );
    //   });

    const finishedImage = await webshotPromise(html, screenPath, optionsLarge);

    return finishedImage;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { renderEmail, renderEmailLarge };
