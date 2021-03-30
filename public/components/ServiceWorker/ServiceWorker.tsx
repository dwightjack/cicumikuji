import { useCallback, useEffect, useState } from 'preact/hooks';
import { Workbox, messageSW } from 'workbox-window';
import { Button } from '../Button/Button';
import { Alert, Text } from './ServiceWorker.styles';

export function ServiceWorker({ url }: { url: string }) {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>(
    null,
  );
  const [shouldUpdate, setUpdater] = useState(false);

  if (!('serviceWorker' in navigator)) {
    return null;
  }

  const wb = new Workbox(url);

  // Add an event listener to detect when the registered
  // service worker has installed but is waiting to activate.
  wb.addEventListener('waiting', () => setUpdater(true));
  wb.addEventListener('externalwaiting' as any, () => setUpdater(true));

  useEffect(() => {
    wb.register().then(setRegistration);
  }, []);

  // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
  const onUpdate = useCallback(() => {
    // Assuming the user accepted the update, set up a listener
    // that will reload the page as soon as the previously waiting
    // service worker has taken control.
    wb.addEventListener('controlling', () => {
      window.location.reload();
    });

    if (registration && registration.waiting) {
      // Send a message to the waiting service worker,
      // instructing it to activate.
      // Note: for this to work, you have to add a message
      // listener in your service worker. See below.
      messageSW(registration.waiting, { type: 'SKIP_WAITING' });
    }
  }, [registration]);

  if (!shouldUpdate) {
    return null;
  }

  return (
    <Alert role="alertdialog" aria-labelledby="sw-update-title">
      <Text id="sw-update-title">Application update available.</Text>
      <Button onClick={onUpdate}>Update</Button>
    </Alert>
  );
}
