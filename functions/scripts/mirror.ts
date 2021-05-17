import * as admin from 'firebase-admin';
import { getCollection } from '../src/lib/db';
import { Storage } from '@google-cloud/storage';
import { uploadPostResource } from '../src/lib/storage';
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

  const bucket = storage.bucket(
    require('../cicumikuji-config.json').storage.bucket,
  );

  for (const doc of docs) {
    await uploadPostResource(doc, bucket);
    await uploadPostResource(doc, bucket, { type: 'mp4', field: 'videoUrl' });
  }
})();
