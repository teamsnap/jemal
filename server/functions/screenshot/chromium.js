const puppeteer = require('puppeteer-core');
const { getOptions } = require('./options');

async function getScreenshot(html) {
  const options = await getOptions();
  const browser = await puppeteer.launch(options);
  console.log(html)
  const page = await browser.newPage();
  await page.setContent(html, {
    waitUntil: 'networkidle0'
  });
  const file = await page.screenshot({ type: 'jpeg', fullPage: true });
  await browser.close();
  return file;
}

module.exports = { getScreenshot };
