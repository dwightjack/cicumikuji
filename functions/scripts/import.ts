import * as admin from 'firebase-admin';
import { parseEdges } from '../src/utils';
import { savePosts, resetPosts } from '../src/lib/db';
import * as edges from './db.json';

var serviceAccount = require('../cicumikuji-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

(async () => {
  const parsed = parseEdges((edges as any[]).reverse());
  await resetPosts();
  await savePosts(parsed);
  console.log(`Import completed!`);
})();
