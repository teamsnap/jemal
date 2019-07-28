const puppeteer = require('puppeteer-core');
const { getOptions } = require('./options');

async function getScreenshot(url, type, quality, fullPage) {
  const options = await getOptions();
  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();
  await page.goto(url);
  const file = await page.screenshot({ type, quality, fullPage });
  await browser.close();
  return file;
}

module.exports = { getScreenshot };
