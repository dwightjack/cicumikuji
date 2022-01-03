import * as functions from 'firebase-functions';
import chromium from 'chrome-aws-lambda';

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
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/accounts/login/');

  await page.waitForSelector('[type=submit]', {
    visible: true,
  });
  console.log(`Logging in...`);

  await page.type('[name=username]', cfg.instagram.login);
  await page.type('[type="password"]', cfg.instagram.password);

  await page.click('[type=submit]');
  await page.waitForSelector('[placeholder=Search]', { visible: true });
  await page.goto('https://www.instagram.com/nikkanchikuchiku/feed/');
  await page.waitForSelector('img', {
    visible: true,
  });
  console.log(`Logged in!`);

  // get total posts
  const [countHandler] = await page.$x(`//header//span[contains(., 'posts')]`);
  const count = await countHandler.evaluate((node) => {
    return node.parentElement?.textContent?.match(/\d+/)?.[0] || '0';
  });

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
