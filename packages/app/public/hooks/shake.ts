import { useCallback, useEffect, useState } from 'preact/hooks';
import Shake from 'shake.js';

export type ShakePermission = 'denied' | 'granted' | 'prompt' | null;

export function useShake(eventHandler: (...args: any[]) => any) {
  const [permission, setPermission] = useState<ShakePermission>(null);

  function denyShake() {
    setPermission('denied');
  }

  function handler() {
    requestAnimationFrame(eventHandler);
  }

  async function getShake() {
    if (!('DeviceMotionEvent' in window)) {
      setPermission('denied');
      console.error('Motion event not available');
      return;
    }
    if (typeof DeviceMotionEvent.requestPermission !== 'function') {
      setPermission('granted');
      return;
    }

    try {
      const permissionState = await DeviceMotionEvent.requestPermission();
      setPermission(permissionState);
    } catch (err) {
      setPermission('denied');
      console.error(err);
    }
  }

  const bindShake = useCallback(() => {
    let shaker: any;
    if (permission === 'granted') {
      shaker = new Shake({
        threshold: 5,
        timeout: 2000,
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
    if (permission !== null) {
      return;
    }
    if (!('DeviceMotionEvent' in window)) {
      setPermission('denied');
      console.error('Motion event not available');
      return;
    }
    if (typeof DeviceMotionEvent.requestPermission !== 'function') {
      setPermission('granted');
    }
  }, []);

  return { canShake: permission, getShake, denyShake, bindShake } as const;
}
