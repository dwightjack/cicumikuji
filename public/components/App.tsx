import { useState, useEffect, useCallback } from 'preact/hooks';
import { useFetch } from '../hooks/fetch';
import { useShake } from '../hooks/shake';
import { useFramePreloader } from '../hooks/preloader';
import { FrameItem } from '../types';
import { Frame } from './Frame/Frame';
import { ErrorLayer } from './ErrorLayer/ErrorLayer';
import { Loader } from './Loader/Loader';
import { theme, GlobalStyles } from '../shared/theme';

export function App() {
  const [node, setNode] = useState<FrameItem>(null);
  const [loadedState, frameLoader] = useFramePreloader(5);
  const { isLoading, error, fetcher, data } = useFetch<FrameItem[]>(
    `/api/fetch-posts`,
    {
      transform: (data) => data?.posts,
      initial: [],
    },
  );

  const reload = useCallback(() => {
    frameLoader(data, node)
      .then((n) => setNode(n))
      .catch(console.error);
  }, [data, node]);

  const [shakePermission, checkShakePermission] = useShake(reload);

  useEffect(fetcher, []);
  useEffect(reload, [data]);

  const errorMessage =
    error || (loadedState === 'error' && 'Error loading images!');

  return (
    <main class={theme}>
      <GlobalStyles />
      {node && shakePermission === null && (
        <button onClick={checkShakePermission}>grant permissions</button>
      )}
      {(isLoading || loadedState === 'loading') && <Loader />}
      {errorMessage && <ErrorLayer message={errorMessage} />}
      {node && loadedState === 'loaded' && <Frame {...node} onClick={reload} />}
    </main>
  );
}
