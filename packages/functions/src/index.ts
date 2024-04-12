import { Storage } from '@google-cloud/storage';
import { initializeApp } from 'firebase-admin/app';
import * as functions from 'firebase-functions';
import { getCollection, getLocalPosts, getPosts, savePosts } from './lib/db';
import { createMailer } from './lib/mail';
import { scrape } from './lib/scrape';
import { uploadPostResource } from './lib/storage';

initializeApp();

export const syncPosts = functions
  .runWith({ memory: '2GB' })
  .pubsub.schedule('every 72 hours')
  .onRun(async () => {
    const mailer = createMailer();
    try {
      console.log('Refreshing data...');

      const [storedPosts, { edges, count }] = await Promise.all([
        getPosts(),
        scrape(),
      ]);

      const diff = count - storedPosts.length;

      console.log(`Found ${diff} new posts.`);

      if (diff > 0) {
        // parse and ensure we don't insert duplicates
        const postIDs = storedPosts.map(({ id }) => id);
        const newPosts = edges
          .slice(0, diff)
          .filter(({ id }) => !postIDs.includes(id));

        console.log(`${newPosts.length} new posts to store...`);

        await savePosts(newPosts);

        mailer({
          subject: 'Cicumikuji sync completed',
          body: `Added ${newPosts.length} new posts.`,
        });

        console.log('Stored!');
      }
    } catch (error) {
      mailer({
        subject: 'Cicumikuji sync error!',
        body: `Error Message:\n${error}`,
      });
      console.error(error);
    }
  });

export const mirrorImages = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async () => {
    const storage = new Storage({
      projectId: 'cicumikuji',
    });
    const { docs } = await getCollection()
      .where('local', '==', false)
      .limit(5)
      .get();

    console.log(`Found ${docs.length} posts.`);

    if (docs.length === 0) {
      console.log('Nothing to process.');
      return;
    }
    const bucket = storage.bucket(functions.config().storage.bucket);

    for (const doc of docs) {
      await uploadPostResource(doc, bucket);
      await uploadPostResource(doc, bucket, { type: 'mp4', field: 'videoUrl' });
    }
  });

export const fetchPosts = functions.https.onRequest(async (_req, res) => {
  const posts = await getLocalPosts();
  res.json({ posts });
});
