import { createGlobalStyles } from 'goober/global';
import { useState, useEffect } from 'preact/hooks';
import { useFetch } from '../hooks/fetch';
import { parseData, FrameItem, sampleUniq } from '../utils';
import { Frame } from './Frame';

const GlobalStyles = createGlobalStyles`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    font-family: 'Yusei Magic', sans-serif;
    background: #fff;
  }
`;

const fetchOptions = {
  params: {
    query_hash: '472f257a40c653c64c666ce877d59d2b',
    variables: JSON.stringify({
      id: 13856716568,
      first: 50,
      after: '',
    }),
  },
  transform: parseData,
};

export function App() {
  const [node, setNode] = useState<FrameItem>(null);
  const { isLoading, error, fetcher, data } = useFetch<FrameItem[]>(
    'https://www.instagram.com/graphql/query/',
    fetchOptions,
    [],
  );
  useEffect(fetcher, []);
  useEffect(reload, [data]);

  function reload() {
    setNode((node) => {
      return sampleUniq(data, node);
    });
  }

  return (
    <main>
      <GlobalStyles />
      {isLoading && <p>loading...</p>}
      {error && <p>Error: {error}</p>}
      {node && <Frame {...node} onClick={reload} />}
    </main>
  );
}
