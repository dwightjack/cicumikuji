import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import got from 'got';
import { pluck } from 'ramda';
import { parseEdges } from './utils';

admin.initializeApp();

const db = admin.firestore();

async function queryApi(after?: string) {
  const cfg = functions.config();
  const { body } = await got<any>(
    'https://instagram40.p.rapidapi.com/account-medias',
    {
      searchParams: {
        userid: cfg.INSTAGRAM_USER_ID,
        first: '50',
        after,
      },
      headers: {
        'x-rapidapi-key': cfg.RAPID_API_KEY,
        'x-rapidapi-host': 'instagram40.p.rapidapi.com',
      },
      responseType: 'json',
    },
  );
  return body;
}

async function getPosts() {
  const { docs } = await db
    .collection('posts')
    .orderBy('timestamp', 'desc')
    .get();

  return docs;
}

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

        // store new posts
        const postsRef = db.collection('posts');

        const batch = db.batch();

        for (const newPost of newPosts) {
          const ref = postsRef.doc(newPost.id);
          batch.set(ref, newPost);
        }
        await batch.commit();

        // save new query time
        console.log(`Stored!`);
      }
      console.log(`Query timestamp updated.`);
    } catch (error) {
      console.error(error);
    }
  });
