import * as admin from 'firebase-admin';
import { Post } from '../types';

let $db: FirebaseFirestore.Firestore;
function getDb() {
  if (!$db) {
    $db = admin.firestore();
  }
  return $db;
}

export async function getPosts() {
  const { docs } = await getDb()
    .collection('posts')
    .orderBy('timestamp', 'desc')
    .get();

  return docs.map((doc) => doc.data() as Post);
}

async function store(
  posts: Post[],
  postRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
) {
  const batch = getDb().batch();

  for (const post of posts) {
    const ref = postRef.doc(post.id);
    batch.set(ref, post);
  }
  await batch.commit();
}

async function batchStore(
  posts: Post[],
  postRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  limit: number,
  resolve: (value?: unknown) => void,
) {
  if (posts.length === 0) {
    resolve();
    return;
  }

  const newPosts = posts.splice(0, limit);

  await store(newPosts, postRef);

  console.log(`Saved ${newPosts.length} posts...`);

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    batchStore(posts, postRef, limit, resolve);
  });
}

export async function savePosts(posts: Post[], limit = 300) {
  const postsRef = getDb().collection('posts');

  if (posts.length <= limit) {
    await store(posts, postsRef);
    return;
  }

  return new Promise((resolve, reject) => {
    batchStore(posts, postsRef, limit, resolve).catch(reject);
  });
}

export async function resetPosts(limit = 100) {
  const collectionRef = getDb().collection('posts');
  const query = collectionRef.orderBy('__name__').limit(limit);

  console.log(`Deleting all posts...`);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  resolve: (value?: unknown) => void,
) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    console.log(`All posts deleted!`);
    return;
  }

  // Delete documents in a batch
  const batch = getDb().batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  console.log(`Deleted ${batchSize} posts...`);

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}
