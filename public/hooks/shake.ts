import { useEffect, useState } from 'preact/hooks';
import Shake from 'shake.js';

export type ShakePermission = 'granted' | 'denied' | 'na' | null;

export function useShake(eventHandler: (...args: any[]) => any) {
  const [permission, setState] = useState<ShakePermission>(
    localStorage.getItem('shakable') as ShakePermission,
  );

  function setPermission(state: ShakePermission) {
    setState(state);
    localStorage.setItem('shakable', state);
  }

  function deny() {
    setPermission('denied');
  }

  function handler() {
    requestAnimationFrame(eventHandler);
  }

  async function checkPermission() {
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
      setPermission(permissionState as ShakePermission);
    } catch (err) {
      setPermission('denied');
      console.error(err);
    }
  }

  useEffect(() => {
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
      setPermission('na');
      console.error('Motion event not available');
      return;
    }
    if (typeof DeviceMotionEvent.requestPermission !== 'function') {
      setPermission('granted');
    }
  }, []);

  return [permission, checkPermission, deny] as const;
}
