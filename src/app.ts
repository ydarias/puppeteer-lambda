import {APIGatewayProxyResult} from 'aws-lambda';
import {Browser} from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  let browser: Browser | undefined;

  try {
    const proxyURL = process.env.BRIGHT_DATA_PROXY;
    const username = `${process.env.BRIGHT_DATA_USERNAME}`;
    const password = `${process.env.BRIGHT_DATA_PASSWORD}`;
    const headless = process.env.HEADLESS !== 'false';

    console.log('creating browser ...');
    browser = await chromium.puppeteer.launch({
      args: ['--no-sandbox', `--proxy-server=${proxyURL}`],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless,
      ignoreHTTPSErrors: true,
    });

    console.log('creating a new page ...');
    const page = await browser.newPage();

    await page.authenticate({username, password});

    console.log('navigating to my blog ...');
    await page.goto('https://ydarias.github.io');

    const result = await page.title();

    console.log(`Title: ${result}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: result,
      }),
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'error',
      }),
    };
  } finally {
    if (browser) {
      console.log('Closing browser instance ...');
      await browser.close();
    }
  }
};
