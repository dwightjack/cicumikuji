/**
 * Import instagram API formatted posts into firebase db
 */
import { parseEdges } from '../src/utils';
import { savePosts, resetPosts } from '../src/lib/db';
import edges from './db.json';
import { initialize } from './utils/firebase';

(async () => {
  const parsed = parseEdges((edges as any[]).reverse());

  await initialize();
  await resetPosts();
  await savePosts(parsed);
  console.log(`Import completed!`);
})();
