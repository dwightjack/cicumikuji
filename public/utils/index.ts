import * as R from 'remeda';
import { Caption, FrameItem } from '../types';

export function tap<T = unknown>(fn: (data: T) => void) {
  return (data: T) => {
    fn(data);
    return data;
  };
}

function datetime(timestamp: number) {
  const date = new Date(timestamp);
  return {
    datetime: date.toISOString(),
    formatted: new Intl.DateTimeFormat([]).format(date),
  };
}

export const sample = <T = unknown>(array: T[]) =>
  array[Math.floor(Math.random() * array.length)];

export function sampleUniq<T = unknown>(
  array: T[],
  compare: T,
  maxIteration = 10,
) {
  let item = sample(array);
  let count = 0;
  while (compare === item && count <= maxIteration) {
    item = sample(array);
    count++;
  }
  return item;
}

const caption = R.createPipe(
  R.prop<Caption, keyof Caption>('edges'),
  R.first(),
  R.pathOr(['node', 'text'], ''),
);

const parseEdge = ({ node }: any): FrameItem => ({
  src: R.pipe(node, R.prop('display_url')),
  caption: caption(node.edge_media_to_caption),
  ...datetime(node.taken_at_timestamp * 1000),
});

export const parseData = (data: any) =>
  R.pipe(
    data,
    ({ data }) => data?.user?.edge_owner_to_timeline_media?.edges ?? [],
    R.reject(({ node }) => !!node.is_video),
    R.map(parseEdge),
  );
