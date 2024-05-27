import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';

export interface Post {
  src: string;
  id: string;
  videoUrl: string | null;
  caption: string;
  datetime: string;
  timestamp: number;
  local?: boolean;
  skip?: string;
  originalSrc?: string;
  originalVideoUrl?: string;
}

initializeApp();

export const fetchPosts = onRequest(async (_req, res) => {
  const db = getFirestore();
  const { docs } = await db
    .collection('posts')
    .where('local', '==', true)
    .orderBy('timestamp', 'desc')
    .get();

  const posts = docs
    .map((doc) => doc.data() as Post)
    .filter(({ skip }: Post) => !skip);

  res.json({ posts });
});
