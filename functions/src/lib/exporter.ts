import * as functions from 'firebase-functions';
import axios from 'axios';

function getConfig(): Record<string, any> {
  if (process.env.FIREBASE_CONFIG) {
    return functions.config();
  } else {
    return require('../../cicumikuji-config.json');
  }
}

async function queryApi(url: string, params = {}) {
  const cfg = getConfig();
  const { data } = await axios.request({
    method: 'GET',
    url,
    params,
    headers: {
      'x-rapidapi-key': cfg.instagram.api_key,
      'x-rapidapi-host': 'instagram85.p.rapidapi.com',
    },
  });

  if (data.code !== 200) {
    throw new Error(data.message || `Error ${data.code}`);
  }
  return data;
}

export async function queryInfo() {
  const { data } = await queryApi(
    'https://instagram85.p.rapidapi.com/account/nikkanchikuchiku/info',
  );
  return data;
}

export async function queryPosts(pageId: string = '') {
  const postParams: Record<string, any> = { by: 'username' };
  if (pageId) {
    postParams.pageId = pageId;
  }
  const { data: edges, meta } = await queryApi(
    'https://instagram85.p.rapidapi.com/account/nikkanchikuchiku',
    postParams,
  );
  return { edges, meta };
}

export async function exporter() {
  const { edges, meta } = await queryPosts();
  const info = await queryInfo();
  const posts = [...edges];
  let next = meta.has_next;
  let pageId = meta.next_page;
  while (next) {
    try {
      const response = await queryPosts(pageId);
      next = response.meta.has_next;
      pageId = response.meta.next_page;
      console.log(`Query collected ${response.edges.length} posts`);
      posts.push(...response.edges);
      console.log(`Stored ${posts.length} posts out of ${info.figures.posts}`);
    } catch (err) {
      console.log(err);
      return posts;
    }
  }
  return posts;
}
