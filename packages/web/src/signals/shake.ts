import { useSignal, useSignalEffect } from '@preact/signals';
// @ts-expect-error
import Shake from 'shake.js';

export type ShakePermission = 'denied' | 'granted' | 'prompt' | null;

export function useShake(eventHandler: (...args: any[]) => any) {
  const permission = useSignal<ShakePermission>(null);

  function denyShake() {
    permission.value = 'denied';
  }

  function handler() {
    requestAnimationFrame(eventHandler);
  }

  async function getShake() {
    if (!('DeviceMotionEvent' in window)) {
      permission.value = 'denied';
      console.error('Motion event not available');
      return;
    }
    if (typeof (DeviceMotionEvent as any).requestPermission !== 'function') {
      permission.value = 'granted';
      return;
    }

    try {
      const permissionState = await (
        DeviceMotionEvent as any
      ).requestPermission();
      permission.value = permissionState;
    } catch (err) {
      permission.value = 'denied';
      console.error(err);
    }
  }

  function bindShake() {
    let shaker: any;
    if (permission.value === 'granted') {
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
  }

  useSignalEffect(() => {
    if (permission.value !== null) {
      return;
    }
    if (!('DeviceMotionEvent' in window)) {
      permission.value = 'denied';
      console.error('Motion event not available');
      return;
    }
    if (typeof (DeviceMotionEvent as any).requestPermission !== 'function') {
      permission.value = 'granted';
    }
  });

  return { canShake: permission, getShake, denyShake, bindShake } as const;
}
