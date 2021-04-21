import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getCollection } from '../src/lib/db';
import { Storage } from '@google-cloud/storage';
import { uploadPostImage } from '../src/lib/storage';

var serviceAccount = require('../cicumikuji-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

(async () => {
  const storage = new Storage({
    projectId: 'cicumikuji',
    keyFilename: require.resolve('../cicumikuji-firebase-adminsdk.json'),
  });
  const { docs } = await getCollection()
    .where('local', '==', false)
    .limit(2)
    .get();

  console.log(`Found ${docs.length} posts.`);

  const bucket = storage.bucket(functions.config().storage.bucket);

  for (const doc of docs) {
    await uploadPostImage(doc, bucket);
  }
})();
