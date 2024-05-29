import { existsSync, readdirSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Storage } from '@google-cloud/storage';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const serviceAccountFile = resolve(
  __dirname,
  './cicumikuji-firebase-adminsdk.json',
);

const DATA_DIR = resolve(__dirname, './data');
const POSTS_FILE = join(
  DATA_DIR,
  'your_instagram_activity',
  'content',
  'posts_1.json',
);

async function initialize() {
  if (!existsSync(serviceAccountFile)) {
    throw new Error(`Service account file ${serviceAccountFile} not found.`);
  }
  /**
   * @type {import('firebase-admin').ServiceAccount}
   */
  const serviceAccount = JSON.parse(
    await readFile(serviceAccountFile, 'utf-8'),
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

(async () => {
  await initialize();

  const storage = new Storage({
    projectId: 'cicumikuji',
    keyFilename: serviceAccountFile,
  });
  const bucket = storage.bucket('cicumikuji.appspot.com');

  const db = getFirestore();
  const postRefs = db.collection('posts');

  const { docs } = await postRefs
    .where('local', '==', true)
    .orderBy('timestamp', 'desc')
    .get();

  /** @type {import('./types.js').Post[]} */
  const posts = docs.map((doc) => doc.data()).filter(({ skip }) => !skip);
  const timeStamps = posts.map((post) => post.timestamp);

  // read the post json files
  /**
   * @type {import('./types.js').Entry[]}
   */
  const entries = JSON.parse(await readFile(POSTS_FILE, 'utf-8'));

  const batch = db.batch();

  console.log(`Found ${entries.length} posts.`);

  try {
    for (const entry of entries) {
      const timestamp =
        (entry.creation_timestamp || entry.media.at(0)?.creation_timestamp) *
        1000;

      if (timeStamps.includes(timestamp)) {
        console.warn(
          `Matched a post already saved (datetime: ${new Date(
            timestamp,
          ).toISOString()})`,
        );
        continue;
      }
      /**
       * Extract the title:
       * - for images, it's in the first media object: entry.media[0].title
       * - for videos, it's in the root object: entry.title
       */
      // here, upload the image
      const title =
        entry.title || entry.media.map(({ title }) => title).filter(Boolean)[0];

      // only use the first photo from the set
      const src = entry.media
        .map(({ uri }) => uri)
        .filter((uri) => uri?.endsWith('.jpg'))[0];

      if (!src) {
        continue;
      }

      const imageSrcPath = join(DATA_DIR, src);
      if (!existsSync(imageSrcPath)) {
        console.warn(`File ${imageSrcPath} not found`);
        continue;
      }
      const ext = extname(imageSrcPath);
      const [uploadFile] = await bucket.upload(imageSrcPath, {
        destination: `post-${timestamp}${ext}`,
        public: true,
      });
      const docRef = postRefs.doc();

      const newPost = {
        src: uploadFile.publicUrl(),
        id: docRef.id,
        videoUrl: null,
        caption: Buffer.from(title, 'latin1').toString('utf-8'),
        datetime: new Date(timestamp).toISOString(),
        timestamp,
        local: true,
      };

      batch.set(docRef, newPost);
      console.log(
        `Pushed post: ${docRef.id} - ${new Date(timestamp).toISOString()}`,
      );
    }
  } catch (e) {
    console.warn(e);
  } finally {
    batch.commit();
  }
})();
