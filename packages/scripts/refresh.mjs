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
const JSON_FILES_PATH = join(DATA_DIR, 'your_instagram_activity', 'content');

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
  const postRefs = db.collection('dwj');

  const { docs } = await postRefs
    // .where('local', '==', true)
    // .orderBy('timestamp', 'desc')
    .get();

  /** @type {import('./types.js').Post[]} */
  const posts = docs.map((doc) => doc.data()).filter(({ skip }) => !skip);

  // read the post json files
  /**
   * @type {import('./types.js').Entry[]}
   */
  const entries = (
    await Promise.all(
      readdirSync(JSON_FILES_PATH)
        .filter((filePath) => /^posts_.+\.json$/.test(filePath))
        .map(async (fileName) =>
          JSON.parse(
            await readFile(resolve(JSON_FILES_PATH, fileName), 'utf-8'),
          ),
        ),
    )
  )
    .flat()
    .flatMap(({ media }) => media);

  // const batch = db.batch();

  for (const entry of entries) {
    // here, upload the image

    const imageSrcPath = join(DATA_DIR, entry.uri);
    if (!existsSync(imageSrcPath)) {
      console.warn(`File ${imageSrcPath} not found`);
      continue;
    }
    const ext = extname(imageSrcPath);
    // const [uploadFile] = await bucket.upload(imageSrcPath, {
    //   destination: `posts/${entry.creation_timestamp}${ext}`,
    // });

    const newPost = {
      src: 'uploadFile.publicUrl()',
      id: entry.creation_timestamp,
      videoUrl: null,
      caption: Buffer.from(entry.title, 'latin1').toString('utf-8'),
      datetime: new Date(entry.creation_timestamp).toISOString(),
      timestamp: entry.creation_timestamp,
      local: true,
    };

    console.log(newPost);

    const docRef = postRefs.doc();
    batch.set(docRef, newPost);
  }

  batch.commit();
})();
