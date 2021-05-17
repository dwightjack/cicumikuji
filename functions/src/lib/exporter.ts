import * as functions from 'firebase-functions';
import axios from 'axios';

export async function queryApi(after?: string) {
  let cfg: Record<string, any>;
  if (process.env.FIREBASE_CONFIG) {
    cfg = functions.config();
  } else {
    cfg = require('../../cicumikuji-config.json');
  }

  try {
  } catch (err) {}

  const { data } = await axios.request({
    method: 'GET',
    url: 'https://instagram40.p.rapidapi.com/account-medias',
    params: {
      userid: cfg.instagram.user_id,
      first: '70',
      after: '',
    },
    headers: {
      'x-rapidapi-key': cfg.instagram.api_key,
      'x-rapidapi-host': 'instagram40.p.rapidapi.com',
    },
  });
  return data;
}

export async function exporter() {
  const { count, edges, page_info } = await queryApi();
  const posts = [...edges];
  let after = page_info.end_cursor;
  while (count > posts.length) {
    try {
      const response = await queryApi(after);
      after = response.page_info.end_cursor;
      console.log(`Query collected ${response.edges.length} posts`);
      posts.push(...response.edges);
      console.log(`Stored ${posts.length} posts out of ${count}`);
    } catch (err) {
      console.log(err);
    }
  }
  return posts;
}
