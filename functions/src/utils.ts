import * as R from 'ramda';
import { Post } from './types';

/**
 * @param {Object} node
 */
const datetime = R.pipe(
  R.prop<string, number>('taken_at_timestamp'),
  R.multiply(1000),
  R.constructN(1, Date),
  R.applySpec({
    datetime: R.invoker(0, 'toISOString'),
    timestamp: R.invoker(0, 'getTime'),
  }),
);

const parseEdge = R.pipe<any, Post>(
  R.converge(R.mergeRight, [
    R.applySpec({
      id: R.prop<string, string>('id'),
      src: R.prop<string, string>('display_url'),
      video_url: R.propOr(null, 'video_url'),
      caption: R.pathOr('', [
        'edge_media_to_caption',
        'edges',
        0,
        'node',
        'text',
      ]),
    }),
    datetime,
  ]),
);

export const parseEdges = R.pipe<any[], any[], Post[]>(
  R.pluck('node'),
  R.map(parseEdge),
);
