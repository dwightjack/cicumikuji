const faunadb = require('faunadb');
const { parseEdges } = require('../netlify_functions/fetch-nodes/utils');
const edges = require('./db.json');

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});
const q = faunadb.query;

const parsed = parseEdges(edges.reverse());

faunaClient
  .query(
    q.Map(
      parsed,
      q.Lambda(
        'data',
        q.Create(q.Collection('posts'), { data: q.Var('data') }),
      ),
    ),
  )
  .then(() => console.log('inserted'))
  .catch((err) => console.error(err))
  .finally(() => process.exit());
