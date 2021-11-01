import { promises as fs } from 'fs';
import { resolve } from 'path';
import { getPosts } from '../src/lib/db';
import { initialize } from './utils/firebase';

(async () => {
  await initialize();
  const posts = await getPosts();
  fs.writeFile(
    resolve(process.cwd(), '../dev-db.json'),
    JSON.stringify({ posts }, null, 2),
    'utf8',
  );
})();
