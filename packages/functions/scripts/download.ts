/**
 * Download firestore DB to a static file (used for development)
 */
import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import * as url from 'node:url';
import { getPosts } from '../src/lib/db';
import { initialize } from './utils/firebase';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

(async () => {
  await initialize();
  const posts = await getPosts();
  fs.writeFile(
    resolve(__dirname, '../../web/dev-db.json'),
    JSON.stringify({ posts }, null, 2),
    'utf8',
  );
})();
