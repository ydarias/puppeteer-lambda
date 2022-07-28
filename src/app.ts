import {SQSEvent} from 'aws-lambda';
import chromium from 'chrome-aws-lambda';
import {Browser, Page, Protocol} from 'puppeteer-core';
import {HandlerEvent} from './models';

export const createBrowser = async (): Promise<Browser> => {
  console.log('creating browser ...');

  const proxyURL = process.env.BRIGHT_DATA_PROXY;
  const headless = process.env.HEADLESS !== 'false';
  const args = [...chromium.args, `--proxy-server=${proxyURL}`];

  const executablePath = await chromium.executablePath;

  console.log(`executable path is ${executablePath}`);

  return chromium.puppeteer.launch({
    headless,
    args,
    executablePath,
    ignoreHTTPSErrors: true,
    defaultViewport: chromium.defaultViewport,
  });
};

export const loadPage = async (browser: Browser, cookies: Protocol.Network.CookieParam[] = []): Promise<Page> => {
  console.log('creating a new page ...');

  const username = `${process.env.BRIGHT_DATA_USERNAME}`;
  const password = `${process.env.BRIGHT_DATA_PASSWORD}`;

  const page = await browser.newPage();
  await page.authenticate({username, password});
  await page.setCookie(...cookies);

  return page;
};

export const extractPageTitle = async (url: string, cookies: Protocol.Network.CookieParam[] = []): Promise<string> => {
  let browser: Browser | undefined;

  try {
    browser = await createBrowser();
    const page = await loadPage(browser, cookies);

    console.log(`Visiting page ${url}`);

    await page.goto(url);
    const result = await page.title();

    return result;
  } catch (e) {
    console.error(e);

    return '';
  } finally {
    if (browser) {
      try {
        console.log('Closing browser instance ...');
        await browser.close();
      } catch (e) {
        console.error(e);
      }
    }
  }
};

export const handler = async (events: SQSEvent): Promise<void> => {
  const event = events.Records[0];

  const body: HandlerEvent = JSON.parse(event.body || '');

  console.log(`Body: ${JSON.stringify(body, null, 2)}`);

  const result = await extractPageTitle(body.url, body.cookies || []);

  console.log(`Title: ${result}`);
};
