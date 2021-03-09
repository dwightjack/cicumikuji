const admin = require('firebase-admin');
const { parseEdges } = require('../src/utils');
const edges = require('./db.json');

admin.initializeApp();

const db = admin.firestore();

const parsed = parseEdges(edges.reverse());

// store new posts
const postsRef = db.collection('posts');

const batch = db.batch();

for (const newPost of newPosts) {
  const ref = postsRef.doc(newPost.id);
  batch.set(ref, newPost);
}
batch
  .commit()
  .then(() => console.log('inserted'))
  .catch((err) => console.error(err))
  .finally(() => process.exit());
