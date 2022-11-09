import { scrape } from '../src/lib/scrape';

(async () => {
  const result = await scrape();
  console.log(result);
})();
