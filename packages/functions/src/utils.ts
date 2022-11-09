import R from 'ramda';
import { Post, Edge } from './types';

/**
 * @param {Object} node
 */
const datetime = R.pipe(
  R.pathOr(0, ['created_time', 'unix']),
  R.multiply(1000),
  R.constructN(1, Date),
  R.applySpec({
    datetime: R.invoker(0, 'toISOString'),
    timestamp: R.invoker(0, 'getTime'),
  }),
);

const parseEdge = R.pipe<Edge, Post>(
  R.converge(Object.assign, [
    R.applySpec({
      id: R.prop<string, string>('id'),
      src: R.path<string>(['images', 'original', 'high']),
      videoUrl: R.ifElse(
        R.propEq('type', 'video'),
        R.pathOr(null, ['videos', 'standard']),
        () => null,
      ),
      caption: R.propOr('', 'caption'),
    }),
    datetime,
    () => ({ local: false }),
  ]),
);

export const parseEdges = R.map(parseEdge);

export const camelCase = (str: string) =>
  str.replace(/[-_]([a-z])/g, (m) => m[1].toUpperCase());
