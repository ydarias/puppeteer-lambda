import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import chromium from 'chrome-aws-lambda';
import {Browser, Page} from 'puppeteer-core';

export const createBrowser = async (): Promise<Browser> => {
  console.log('creating browser ...');

  const proxyURL = process.env.BRIGHT_DATA_PROXY;
  const headless = process.env.HEADLESS !== 'false';
  const args = [...chromium.args, `--proxy-server=${proxyURL}`];

  return chromium.puppeteer.launch({
    headless,
    args,
    executablePath: await chromium.executablePath,
    ignoreHTTPSErrors: true,
    defaultViewport: await chromium.defaultViewport,
  });
};

export const loadPage = async (browser: Browser): Promise<Page> => {
  console.log('creating a new page ...');

  const username = `${process.env.BRIGHT_DATA_USERNAME}`;
  const password = `${process.env.BRIGHT_DATA_PASSWORD}`;

  const page = await browser.newPage();
  await page.authenticate({username, password});

  return page;
};

export const extractPageTitle = async (url: string): Promise<string> => {
  let browser: Browser | undefined;

  try {
    browser = await createBrowser();
    const page = await loadPage(browser);

    console.log(`Visiting page ${url}`);

    await page.goto(url);
    const result = await page.title();

    return result;
  } catch (e) {
    console.error(e);

    return '';
  } finally {
    if (browser) {
      console.log('Closing browser instance ...');
      await browser.close();
    }
  }
};

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const result = await extractPageTitle('https://ydarias.github.io');

  console.log(`Title: ${result}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: result,
    }),
  };
};
