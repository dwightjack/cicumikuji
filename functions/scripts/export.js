/**
 * @type {import('got').Got}
 */
const got = require('got');

async function queryApi(after) {
  const { body, statusCode } = await got(
    'https://instagram40.p.rapidapi.com/account-medias',
    {
      searchParams: {
        userid: process.env.INSTAGRAM_USER_ID,
        first: '80',
        after,
      },
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        'x-rapidapi-host': 'instagram40.p.rapidapi.com',
      },
      responseType: 'json',
    },
  );
  if (statusCode !== 200) {
    throw new Error(body.message);
  }
  return body;
}

const fs = require('fs');

(async () => {
  const { count, edges, page_info } = await queryApi();
  const posts = [...edges];
  let after = page_info.end_cursor;
  while (count > posts.length) {
    try {
      const response = await queryApi(after);
      after = response.page_info.end_cursor;
      console.log(`Query collected ${response.edges.length} posts`);
      posts.push(...response.edges);
      console.log({ count, posts: posts.length });
    } catch (err) {
      console.log(err);
    }
  }

  fs.writeFileSync(
    __dirname,
    './db.json',
    JSON.stringify(posts, null, 2),
    'utf8',
  );
})();
