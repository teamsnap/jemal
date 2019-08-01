const puppeteer = require('puppeteer-core');
const { getOptions } = require('./options');

async function getScreenshot(html, bodyOptions) {
  const options = await getOptions();
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setContent(html, {
    waitUntil: 'networkidle0'
  });
  const file = await page.screenshot(bodyOptions);
  await browser.close();
  return file;
}

module.exports = { getScreenshot };
