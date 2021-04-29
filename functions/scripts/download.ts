import { promises as fs } from 'fs';
import { resolve } from 'path';
import * as admin from 'firebase-admin';
import { getPosts } from '../src/lib/db';

var serviceAccount = require('../cicumikuji-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

(async () => {
  const posts = await getPosts();
  fs.writeFile(
    resolve(__dirname, '../../lib/dev-db.json'),
    JSON.stringify({ posts }, null, 2),
    'utf8',
  );
})();
