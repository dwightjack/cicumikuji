import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { pluck } from 'ramda';
import { parseEdges } from './utils';
import { queryInfo, queryPosts } from './lib/exporter';
import { createMailer } from './lib/mail';
import { getPosts, savePosts, getCollection, getLocalPosts } from './lib/db';
import { Storage } from '@google-cloud/storage';
import { uploadPostResource } from './lib/storage';

admin.initializeApp();

export const syncPosts = functions.pubsub
  .schedule('every 120 hours')
  .onRun(async () => {
    const mailer = createMailer();
    try {
      console.log('Refreshing data...');

      const { figures } = await queryInfo();

      const [storedPosts, { edges }] = await Promise.all([
        getPosts(),
        queryPosts(),
        ,
      ]);

      const diff = figures.posts - storedPosts.length;

      console.log(`Found ${diff} new posts.`);

      if (diff > 0) {
        // parse and ensure we don't insert duplicates
        const postIDs = pluck('id', storedPosts);
        const newPosts = parseEdges(edges.slice(0, diff)).filter(
          ({ id }) => !postIDs.includes(id),
        );

        console.log(`${newPosts.length} new posts to store...`);

        await savePosts(newPosts);

        mailer({
          subject: 'Cicumikuji sync completed',
          body: `Added ${newPosts.length} new posts.`,
        });

        console.log(`Stored!`);
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
