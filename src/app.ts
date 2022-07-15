import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {Browser} from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import proxyChain from 'proxy-chain';
import {LinkedinProxy} from './linkedinProxy';

exports.handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  let browser: Browser | undefined;

  try {
    console.log('configuring the proxy URL ...');
    console.log(`Process is ${JSON.stringify(process, null, 4)}`);
    console.log(`ENV is ${JSON.stringify(process.env, null, 4)}`);
    const proxyURL = process.env.BRIGHT_DATA_PROXY || '';
    console.log(`Using proxy ${proxyURL}`);
    const localizedProxyURL = LinkedinProxy.getFor(proxyURL);
    const intermediateProxy = await proxyChain.anonymizeProxy(localizedProxyURL);

    console.log('creating browser ...');
    browser = await chromium.puppeteer.launch({
      args: ['--no-sandbox', `--proxy-server=${intermediateProxy}`],
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
