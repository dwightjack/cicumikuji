/**
 * Download firestore DB to a static file (used for development)
 */
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { getPosts } from '../src/lib/db';
import { initialize } from './utils/firebase';

(async () => {
  await initialize();
  const posts = await getPosts();
  fs.writeFile(
    resolve(__dirname, '../../web/dev-db.json'),
    JSON.stringify({ posts }, null, 2),
    'utf8',
  );
})();
