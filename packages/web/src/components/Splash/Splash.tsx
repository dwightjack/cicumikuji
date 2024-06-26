import { useEffect, useRef } from 'preact/hooks';
import { useWakeLock } from '../../hooks/wakeLock';
import { useAppState } from '../../providers/appState';
import { useI18n } from '../../providers/i18n';
import type { ShakePermission } from '../../signals/shake';
import { Button } from '../Button/Button';
import { LangSelect } from '../LangSelect/LangSelect';
import { ButtonGroup, Container, Footer, Title } from './Splash.styles';

export interface SplashProps {
  onGrant: () => void;
  onStart: () => void;
  onDeny: () => void;
  permission: ShakePermission;
}

export function Splash({ onGrant, onDeny, permission, onStart }: SplashProps) {
  const { t } = useI18n();
  const { appBooted, appStatus } = useAppState();
  const enableWakeLock = useWakeLock();
  const lockRef = useRef<() => void>();

  async function start() {
    onStart();
    appBooted.value = true;
    // WakeLock on iOS (using nosleep.js), must be initialized during a user interaction
    lockRef.current = await enableWakeLock();
  }

  useEffect(() => {
    () => lockRef.current?.();
  }, []);

  if (appStatus.value !== 'splash') {
    return null;
  }

  return (
    <Container>
      <Title>{t('messages.title')}</Title>
      {permission === null && (
        <>
          <p>{t('messages.activate_shake')}</p>
          <ButtonGroup>
            <Button type="button" onClick={onGrant}>
              {t('messages.enable')}
            </Button>
            <Button type="button" onClick={onDeny}>
              {t('messages.disable')}
            </Button>
          </ButtonGroup>
        </>
      )}
      {permission === 'granted' && <p>{t('messages.intro_shake')}</p>}
      {permission !== null && (
        <Button type="button" onClick={start}>
          {t('messages.start')}
        </Button>
      )}
      <LangSelect />
      <Footer>
        {t('messages.follow_me')}
        <a
          href="https://www.instagram.com/nikkanchikuchiku/"
          target="_blank"
          rel="noopener noreferrer"
        >
          @nikkanchikuchiku
        </a>
      </Footer>
    </Container>
  );
}
