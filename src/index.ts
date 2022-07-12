import {APIGatewayEvent, APIGatewayProxyCallback, Context} from 'aws-lambda';
import chromium from 'chrome-aws-lambda';
import {Browser} from 'puppeteer-core';

export const lambdaHandler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback,
): Promise<void> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: 'success',
    }),
  });

  // let browser: Browser | undefined;
  //
  // try {
  //   browser = await chromium.puppeteer.launch({
  //     args: chromium.args,
  //     defaultViewport: chromium.defaultViewport,
  //     executablePath: await chromium.executablePath,
  //     headless: chromium.headless,
  //     ignoreHTTPSErrors: true,
  //   });
  //
  //   const page = await browser.newPage();
  //
  //   await page.goto('https://google.com');
  //
  //   const result = await page.title();
  //
  //   console.log(`Title: ${result}`);
  //
  //   return callback(null, {
  //     statusCode: 200,
  //     body: JSON.stringify({
  //       message: result,
  //     }),
  //   });
  // } catch (e) {
  //   return callback(e as Error);
  // } finally {
  //   if (browser) {
  //     await browser.close();
  //   }
  // }
};
