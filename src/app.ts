import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {Browser} from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

exports.handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  let browser: Browser | undefined;

  try {
    console.log('creating browser ...');
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: false,
      ignoreHTTPSErrors: true,
    });

    console.log('creating a new page ...');
    const page = await browser.newPage();

    console.log('navigating to Google ...');
    await page.goto('https://google.com');

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