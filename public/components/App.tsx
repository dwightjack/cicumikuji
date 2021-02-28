import { setup } from 'goober';
import { createGlobalStyles } from 'goober/global';
import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { useFetch } from '../hooks/fetch';
import { useShake } from '../hooks/shake';
import { parseData, sampleUniq } from '../utils';
import { FrameItem } from '../types';
import { Frame } from './Frame/Frame';
import theme from '../shared/theme';
setup(h);

const GlobalStyles = createGlobalStyles`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    font-family: 'Yusei Magic', sans-serif;
    background: #fff;
    color: ${theme.color.text.primary};
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

  const reload = useCallback(() => {
    setNode((node) => sampleUniq(data, node));
  }, [data]);

  const [shakePermission, checkShakePermission] = useShake(reload);
  useEffect(fetcher, []);
  useEffect(reload, [data]);

  return (
    <main>
      <GlobalStyles />
      {node && shakePermission === null && (
        <button onClick={checkShakePermission}>grant permissions</button>
      )}
      {isLoading && <p>loading...</p>}
      {error && <p>Error: {error}</p>}
      {node && <Frame {...node} onClick={reload} />}
    </main>
  );
}
