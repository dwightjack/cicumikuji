import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { pluck } from 'ramda';
import { parseEdges } from './utils';
import { queryApi } from './lib/exporter';
import { createMailer } from './lib/mail';
import { getPosts, savePosts, getCollection } from './lib/db';
import got, { GotStream } from 'got';
import * as stream from 'stream';
import { promisify } from 'util';
import { Storage } from '@google-cloud/storage';

admin.initializeApp();

const pipeline = promisify(stream.pipeline);

export const syncPosts = functions.pubsub
  .schedule('every 120 hours')
  .onRun(async () => {
    const mailer = createMailer();
    try {
      console.log('Refreshing data...');

      const [storedPosts, { count, edges }] = await Promise.all([
        getPosts(),
        queryApi(),
      ]);

      const diff = count - storedPosts.length;

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
  .schedule('every 2 hours')
  .onRun(async () => {
    const { docs } = await getCollection()
      .where('local', '!=', true)
      .limit(2)
      .get();

    const images = docs.map((doc) => {
      const id = doc.get('id') as string;
      const src = doc.get('src') as string;

      try {
        await pipeline(got.stream(src) as GotStream);

      }
    });
  });

export const fetchPosts = functions.https.onRequest(async (_req, res) => {
  const posts = await getPosts();
  res.json({ posts });
});
