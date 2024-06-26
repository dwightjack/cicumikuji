import { styled } from 'goober';
import { useEffect } from 'preact/hooks';
import { useFramePreloader } from '../hooks/preloader';
import { useI18n } from '../providers/i18n';
import { POST_API_KEY } from '../shared/constants';
import { AppRoot, GlobalStyles } from '../shared/theme';
import { useFetch } from '../signals/fetch';
import { useShake } from '../signals/shake';
import type { FrameItem } from '../types';
import { Button } from './Button/Button';
import { ErrorLayer } from './ErrorLayer/ErrorLayer';
import { Frame } from './Frame/Frame';
import { Loader } from './Loader/Loader';
import { Splash } from './Splash/Splash';

import { useSignal, useSignalEffect } from '@preact/signals';
import { useAppState } from '../providers/appState';

export const Reloader = styled(Button)`
  position: absolute;
  inset-inline-end: 1rem;
  inset-block-end: 1rem;
  z-index: 3;
  inline-size: 3.5rem;
  aspect-ratio: 1;
  background-image: url('/assets/reload.png');
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center;
`;

export function App() {
  const node = useSignal<FrameItem | null>(null);
  const { isReady, isLoading, setStatus, appStatus, appBooted } = useAppState();
  const { locale, t } = useI18n();
  const frameLoader = useFramePreloader(5);
  const [data, fetcher] = useFetch<FrameItem[]>(
    POST_API_KEY,
    '/api/fetch-posts',
    {
      transform: (data) => data?.posts,
      initial: [],
    },
  );

  function reload() {
    if (appStatus.value !== 'play') {
      setStatus('play');
    }

    frameLoader(data.value, node.value)
      .then((n) => {
        node.value = n;
      })
      .catch(console.error);
  }

  const { canShake, getShake, denyShake, bindShake } = useShake(reload);

  useEffect(fetcher, []);
  useSignalEffect(() => {
    document.documentElement.lang = locale.value;
  });

  useSignalEffect(() => {
    if (appBooted.value === true) {
      return bindShake();
    }
  });
  useSignalEffect(() => {
    if (data.value && appStatus.value === 'boot') {
      setStatus('splash');
    }
  });

  return (
    <AppRoot>
      {/* @ts-ignore */}
      <GlobalStyles />
      {isLoading.value && <Loader />}
      <ErrorLayer />
      <Splash
        onDeny={denyShake}
        onGrant={getShake}
        onStart={reload}
        permission={canShake.value}
      />
      {node.value && isReady.value && <Frame {...node.value} />}
      <Reloader onClick={reload} aria-label={t('messages.reload')} />
    </AppRoot>
  );
}
