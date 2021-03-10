const admin = require('firebase-admin');
const { parseEdges } = require('../lib/utils');
const edges = require('./db.json');

admin.initializeApp();

const db = admin.firestore();

function importPosts(posts) {
  // store new posts
  const postsRef = db.collection('posts');

  const batch = db.batch();
  for (const post of posts) {
    const ref = postsRef.doc(post.id);
    batch.set(ref, post);
  }
  return batch.commit();
}

const parsed = parseEdges(edges.reverse());

(async () => {
  while (parsed.length) {
    await importPosts(parsed.splice(0, 200));
  }

  console.log('inserted');
})();
