import * as functions from 'firebase-functions';
import chromium from 'chrome-aws-lambda';
import { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const puppeteerExtra = addExtra(chromium.puppeteer as any);
puppeteerExtra.use(StealthPlugin());
async function getConfig(): Promise<Record<string, any>> {
  if (process.env.FIREBASE_CONFIG) {
    return functions.config();
  } else {
    //@ts-ignore
    return await import('../../cicumikuji-config.json');
  }
}

export async function scrape() {
  const cfg = await getConfig();
  const browser = await puppeteerExtra.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/accounts/login/');

  await page.waitForSelector('[type=submit]', {
    timeout: 60000,
  });
  console.log(`Logging in...`);

  await page.type('[name=username]', cfg.instagram.login);
  await page.type('[type="password"]', cfg.instagram.password);

  await page.click('[type=submit]');
  await page.waitForSelector('[placeholder=Search]', { timeout: 60000 });
  await page.goto('https://www.instagram.com/nikkanchikuchiku/feed/');
  await page.waitForSelector('img', {
    timeout: 60000,
  });
  console.log(`Logged in!`);

  // get total posts
  const count = await page.$$eval(`header li`, (nodes: Element[]) => {
    let text = '0';
    for (const node of nodes) {
      const [, match] = node.textContent?.match(/([\d,]+)\s+posts/) || [];
      if (match) {
        text = match.replace(/[^\d]+/g, '');
      }
    }
    return text;
  });

  console.log(count);

  const posts = await page.$$('article a[href^="/p/"]');
  console.log(`Scraping ${posts.length} posts...`);
  const edges = [];
  for (const post of posts) {
    await post.click();
    await page.waitForSelector('[role="dialog"] img', {
      visible: true,
    });
    const postData = await page.evaluate(() => {
      const container = document.querySelector('[role="dialog"]');
      const src = container?.querySelector('img')?.getAttribute('src') ?? '';
      const videoUrl =
        container?.querySelector('video')?.getAttribute('src') || null;
      const caption =
        container?.querySelector('h2')?.nextElementSibling?.textContent ?? '';
      const datetime = container
        ?.querySelector('h2')
        ?.parentElement?.querySelector('time')
        ?.getAttribute('datetime');

      return {
        src,
        caption,
        datetime: datetime || '',
        timestamp: datetime ? new Date(datetime).getTime() : Date.now(),
        videoUrl,
        id: '',
        local: false,
      };
    });
    postData.id = page.url().replace(/^.+\/([^/]+)\/?/, '$1');
    edges.push(postData);
    await page.keyboard.press('Escape');
  }

  await browser.close();

  return {
    edges,
    count: parseInt(count, 10),
  };
}
