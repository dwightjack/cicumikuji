import { delay, HttpResponse, http } from 'msw';

function getDB() {
  try {
    return require('../../dev-db.json');
  } catch (err) {
    console.log(err);
    return {};
  }
}

export const handlers = [
  http.get('/api/fetch-posts', async () => {
    await delay();
    return HttpResponse.json(getDB());
  }),
];
