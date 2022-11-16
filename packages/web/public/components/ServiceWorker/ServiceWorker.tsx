import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { Workbox, messageSW } from 'workbox-window';
import { useI18n } from '../../providers/i18n';
import { Button } from '../Button/Button';
import { Alert, Text } from './ServiceWorker.styles';
// @ts-ignore
import swURL from 'sw:../../sw.ts';

export function ServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>(
    null,
  );
  const wb = useRef<Workbox>(new Workbox(swURL));
  const [shouldUpdate, setUpdater] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { t } = useI18n();

  if (!('serviceWorker' in navigator)) {
    return null;
  }

  useEffect(() => {
    if (!wb.current) {
      return;
    }
    wb.current.addEventListener('waiting', () => setUpdater(true));
    wb.current.addEventListener('externalwaiting' as any, () =>
      setUpdater(true),
    );
    wb.current.register().then(setRegistration);
  }, [wb.current]);

  // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
  const onUpdate = useCallback(() => {
    // Assuming the user accepted the update, set up a listener
    // that will reload the page as soon as the previously waiting
    // service worker has taken control.
    setUpdating(true);

    wb.current.addEventListener('controlling', () => {
      window.location.reload();
    });

    if (registration && registration.waiting) {
      // Send a message to the waiting service worker,
      // instructing it to activate.
      // Note: for this to work, you have to add a message
      // listener in your service worker. See below.
      messageSW(registration.waiting, { type: 'SKIP_WAITING' });
    }
  }, [registration, wb.current]);

  if (!shouldUpdate) {
    return null;
  }

  return (
    <Alert role="alertdialog" aria-labelledby="sw-update-title">
      <Text id="sw-update-title">{t('messages.update_txt')}</Text>
      {updating ? (
        <Text>{t('messages.updating')}</Text>
      ) : (
        <Button onClick={onUpdate}>{t('messages.update')}</Button>
      )}
    </Alert>
  );
}
