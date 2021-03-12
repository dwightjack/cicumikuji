import { useState, useEffect, useCallback, useContext } from 'preact/hooks';
import { useFetch } from '../hooks/fetch';
import { useShake } from '../hooks/shake';
import { useFramePreloader } from '../hooks/preloader';
import { FrameItem } from '../types';
import { Frame } from './Frame/Frame';
import { ErrorLayer } from './ErrorLayer/ErrorLayer';
import { Loader } from './Loader/Loader';
import { theme, GlobalStyles } from '../shared/theme';
import { AppStateContext, selectors } from '../providers/appState';

export function App() {
  const [appState] = useContext(AppStateContext);
  const [node, setNode] = useState<FrameItem>(null);
  const frameLoader = useFramePreloader(5);
  const [data, fetcher] = useFetch<FrameItem[]>(`/api/fetch-posts`, {
    transform: (data) => data?.posts,
    initial: [],
  });

  const reload = useCallback(() => {
    frameLoader(data, node)
      .then((n) => setNode(n))
      .catch(console.error);
  }, [data, node]);

  const [shakePermission, checkShakePermission] = useShake(reload);

  useEffect(fetcher, []);
  useEffect(reload, [data]);

  return (
    <main class={theme}>
      <GlobalStyles />
      {node && shakePermission === null && (
        <button onClick={checkShakePermission}>grant permissions</button>
      )}
      {appState.loadQueue > 0 && <Loader />}
      {appState.error && <ErrorLayer message={appState.error} />}
      {node && selectors.isReady(appState) && (
        <Frame {...node} onClick={reload} />
      )}
    </main>
  );
}
