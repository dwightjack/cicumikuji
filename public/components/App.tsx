import { setup } from 'goober';
import { createGlobalStyles } from 'goober/global';
import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { useFetch } from '../hooks/fetch';
import { useShake } from '../hooks/shake';
import { useImagePreloader } from '../hooks/preloader';
import { sampleUniq } from '../shared/utils';
import { FrameItem } from '../types';
import { Frame } from './Frame/Frame';
import { Loader } from './Loader/Loader';
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

export function App() {
  const [node, setNode] = useState<FrameItem>(null);
  const [imgLoaded, imgLoader] = useImagePreloader();
  const { isLoading, error, fetcher, data } = useFetch<FrameItem[]>(
    `/api/fetch-posts`,
    {},
    [],
  );

  const reload = useCallback(() => {
    setNode((node) => sampleUniq(data, node));
  }, [data]);

  const [shakePermission, checkShakePermission] = useShake(reload);

  useEffect(fetcher, []);
  useEffect(reload, [data]);
  useEffect(() => {
    if (node) {
      imgLoader(node?.src);
    }
  }, [node]);

  return (
    <main>
      <GlobalStyles />
      {node && shakePermission === null && (
        <button onClick={checkShakePermission}>grant permissions</button>
      )}
      {(isLoading || !imgLoaded) && <Loader />}
      {error && <p>Error: {error}</p>}
      {node && imgLoaded && <Frame {...node} onClick={reload} />}
    </main>
  );
}
