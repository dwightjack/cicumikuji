import admin from 'firebase-admin';
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

/**
 * List only post with locally stored images
 */
export async function getLocalPosts() {
  const { docs } = await getDb()
    .collection('posts')
    .where('local', '==', true)
    .orderBy('timestamp', 'desc')
    .get();

  return docs
    .map((doc) => doc.data() as Post)
    .filter(({ skip }: Post) => !skip);
}

export function getCollection() {
  return getDb().collection('posts');
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

export async function batchExec(
  fn: (...args: any[]) => Promise<boolean>,
  resolve: (value?: unknown) => void,
) {
  const completed = await fn();

  if (completed) {
    resolve();
    return;
  }

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    batchExec(fn, resolve);
  });
}

export async function savePosts(posts: Post[], limit = 300) {
  const postsRef = getDb().collection('posts');

  if (posts.length <= limit) {
    await store(posts, postsRef);
    return;
  }

  const postStack = [...posts];

  const postBatchStore = async () => {
    const newPosts = postStack.splice(0, limit);
    await store(newPosts, postsRef);
    console.log(`Saved ${newPosts.length} posts...`);
    return postStack.length === 0;
  };

  return new Promise((resolve, reject) => {
    batchExec(postBatchStore, resolve).catch(reject);
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
