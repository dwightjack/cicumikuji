import {
  pageCache,
  staticResourceCache,
  imageCache,
  googleFontsCache,
} from 'workbox-recipes';

pageCache();
staticResourceCache();
imageCache();
googleFontsCache();

addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    //@ts-ignore
    skipWaiting();
  }
});
