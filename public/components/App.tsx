import { useState, useEffect, useCallback, useContext } from 'preact/hooks';
import { useFetch } from '../hooks/fetch';
import { useShake } from '../hooks/shake';
import { useFramePreloader } from '../hooks/preloader';
import { FrameItem } from '../types';
import { Frame } from './Frame/Frame';
import { ErrorLayer } from './ErrorLayer/ErrorLayer';
import { Splash } from './Splash/Splash';
import { Loader } from './Loader/Loader';
import { theme, GlobalStyles } from '../shared/theme';
import { AppStateContext } from '../providers/appState';

export function App() {
  const { $state, isReady, showSplash, isLoading, setStatus } = useContext(
    AppStateContext,
  );
  const [node, setNode] = useState<FrameItem>(null);
  const frameLoader = useFramePreloader(5);
  const [data, fetcher] = useFetch<FrameItem[]>(`/api/fetch-posts`, {
    transform: (data) => data?.posts,
    initial: [],
  });

  const reload = useCallback(() => {
    if ($state.status !== 'play') {
      setStatus('play');
    }
    frameLoader(data, node)
      .then((n) => setNode(n))
      .catch(console.error);
  }, [data, node]);

  const [shakePermission, checkShakePermission, deny] = useShake(reload);

  useEffect(fetcher, []);
  useEffect(() => {
    setStatus('splash');
  }, [data]);

  return (
    <main class={theme}>
      <GlobalStyles />
      {isLoading && <Loader />}
      {$state.error && <ErrorLayer message={$state.error} />}
      {showSplash && (
        <Splash
          onDeny={deny}
          onGrant={checkShakePermission}
          onStart={reload}
          permission={shakePermission}
        />
      )}
      {node && isReady && <Frame {...node} onClick={reload} />}
    </main>
  );
}
