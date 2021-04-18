import { exporter } from '../src/lib/exporter';

import { promises as fs } from 'fs';
import { join } from 'path';

const DEST_FILE = join(__dirname, './db.json');

(async () => {
  const posts = await exporter();
  await fs.writeFile(DEST_FILE, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`${posts.length} posts written to ${DEST_FILE}`);
})();
