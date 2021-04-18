import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { pluck } from 'ramda';
import { parseEdges } from './utils';
import { queryApi } from './lib/exporter';
import { getPosts, savePosts } from './lib/db';

admin.initializeApp();

export const syncPosts = functions.pubsub
  .schedule('every 120 hours')
  .onRun(async () => {
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

        console.log(`Stored!`);
      }
    } catch (error) {
      console.error(error);
    }
  });

export const fetchPosts = functions.https.onRequest(async (_req, res) => {
  const posts = await getPosts();
  res.json({ posts });
});
