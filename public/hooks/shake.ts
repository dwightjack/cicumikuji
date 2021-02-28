import { useEffect, useState } from 'preact/hooks';
import Shake from 'shake.js';

export function useShake(eventHandler) {
  const [permission, setPermission] = useState<boolean>(null);

  function handler() {
    requestAnimationFrame(eventHandler);
  }

  async function checkPermission() {
    if (typeof DeviceMotionEvent.requestPermission !== 'function') {
      setPermission(true);
      return;
    }

    try {
      const permissionState = await DeviceMotionEvent.requestPermission();
      setPermission(permissionState === 'granted');
    } catch (err) {
      setPermission(false);
      console.error(err);
    }
  }

  useEffect(() => {
    let shaker;
    if (permission) {
      shaker = new Shake({
        threshold: 5,
      });
      shaker.start();
      window.addEventListener('shake', handler, false);
    }
    return () => {
      window.removeEventListener('shake', handler, false);
      if (shaker) {
        shaker.stop();
      }
    };
  }, [permission, handler]);

  useEffect(() => {
    if (typeof DeviceMotionEvent.requestPermission !== 'function') {
      setPermission(true);
    }
  }, []);

  return [permission, checkPermission] as const;
}
