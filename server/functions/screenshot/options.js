const chrome = require('chrome-aws-lambda');

const isDev = process.env.VERCEL_REGION === 'dev1';

const exePath =
  process.platform === 'win32'
    ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function getOptions() {
  if (isDev) {
    return {
      args: [],
      executablePath: exePath,
      headless: true,
      defaultViewport: null
    };
  }

  return {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
    defaultViewport: null
  };
}

module.exports = { getOptions };
