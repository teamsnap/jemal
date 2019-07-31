const puppeteer = require('puppeteer-core');
const { getOptions } = require('./options');

async function getScreenshot(html, width = 400, height = 205) {
  const options = await getOptions();
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setContent(html, {
    waitUntil: 'networkidle0'
  });
  const file = await page.screenshot({
    type: 'jpeg',
    clip: { x: 0, y: 0, width: width, height: height }
  });
  await browser.close();
  return file;
}

module.exports = { getScreenshot };
