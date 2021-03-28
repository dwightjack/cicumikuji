import { useState, useEffect, useCallback } from 'preact/hooks';
import { useFetch } from '../hooks/fetch';
import { useShake } from '../hooks/shake';
import { useFramePreloader } from '../hooks/preloader';
import { useWakeLock } from '../hooks/wakeLock';
import { FrameItem } from '../types';
import { Frame } from './Frame/Frame';
import { ErrorLayer } from './ErrorLayer/ErrorLayer';
import { Splash } from './Splash/Splash';
import { Loader } from './Loader/Loader';
import { AppRoot, GlobalStyles } from '../shared/theme';
import { useAppState } from '../providers/appState';
import { useI18n } from '../providers/i18n';

export function App() {
  const {
    $state,
    isReady,
    showSplash,
    isLoading,
    isBooted,
    setStatus,
  } = useAppState();
  const [node, setNode] = useState<FrameItem>(null);
  const { locale } = useI18n();
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

  const { canShake, getShake, denyShake, bindShake } = useShake(reload);
  const enableWakeLock = useWakeLock();

  useEffect(fetcher, []);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    setStatus('splash');
  }, [data]);
  useEffect(() => isBooted && bindShake(), [isBooted]);
  useEffect(() => isBooted && enableWakeLock(), [isBooted]);

  return (
    <AppRoot>
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
