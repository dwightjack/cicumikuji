/**
 * Download firestore DB to a static file (used for development)
 */
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { getPosts } from '../src/lib/db';
import { initialize } from './utils/firebase';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

(async () => {
  await initialize();
  const posts = await getPosts();
  await fs.writeFile(
    resolve(__dirname, '../../web/dev-db.json'),
    JSON.stringify({ posts }, null, 2),
    'utf8',
  );
})();
