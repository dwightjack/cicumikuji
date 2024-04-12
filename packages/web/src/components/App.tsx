import { useCallback, useEffect, useState } from 'preact/hooks';
import { useFetch } from '../hooks/fetch';
import { useFramePreloader } from '../hooks/preloader';
import { useShake } from '../hooks/shake';
import { useWakeLock } from '../hooks/wakeLock';
import { useAppState } from '../providers/appState';
import { useI18n } from '../providers/i18n';
import { AppRoot, GlobalStyles } from '../shared/theme';
import type { FrameItem } from '../types';
import { ErrorLayer } from './ErrorLayer/ErrorLayer';
import { Frame } from './Frame/Frame';
import { Loader } from './Loader/Loader';
// import { ServiceWorker } from './ServiceWorker/ServiceWorker';
import { Splash } from './Splash/Splash';

export function App() {
  const { $state, isReady, showSplash, isLoading, isBooted, setStatus } =
    useAppState();
  const [node, setNode] = useState<FrameItem | null>(null);
  const { locale } = useI18n();
  const frameLoader = useFramePreloader(5);
  const [data, fetcher] = useFetch<FrameItem[]>('/api/fetch-posts', {
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

  const { canShake, getShake, denyShake, bindShake } = useShake(reload);
  const enableWakeLock = useWakeLock();

  useEffect(fetcher, []);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    setStatus('splash');
  }, [data]);
  useEffect(() => {
    if (isBooted) {
      return bindShake();
    }
  }, [isBooted]);
  useEffect(() => {
    if (isBooted) {
      return enableWakeLock();
    }
  }, [isBooted]);

  return (
    <AppRoot>
      {/* {process.env.NODE_ENV === 'production' && <ServiceWorker />} */}
      {/* @ts-ignore */}
      <GlobalStyles />
      {isLoading && <Loader />}
      {$state.error && <ErrorLayer message={$state.error} />}
      {showSplash && (
        <Splash
          onDeny={denyShake}
          onGrant={getShake}
          onStart={reload}
          permission={canShake}
        />
      )}
      {node && isReady && <Frame {...node} onClick={reload} />}
    </AppRoot>
  );
}
