import { getCollection } from '../src/lib/db';
import { Storage } from '@google-cloud/storage';
import { uploadPostResource } from '../src/lib/storage';
import { initialize, serviceAccountFile } from './utils/firebase';
import config from '../cicumikuji-config.json';

(async () => {
  await initialize();
  const storage = new Storage({
    projectId: 'cicumikuji',
    keyFilename: serviceAccountFile,
  });
  const { docs } = await getCollection()
    .where('local', '==', false)
    .limit(2)
    .get();

  console.log(`Found ${docs.length} posts.`);

  const bucket = storage.bucket(config.storage.bucket);

  for (const doc of docs) {
    await uploadPostResource(doc, bucket);
    await uploadPostResource(doc, bucket, { type: 'mp4', field: 'videoUrl' });
  }
})();
