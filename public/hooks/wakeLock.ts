import NoSleep from 'nosleep.js';

export function useWakeLock() {
  return function enable() {
    const noSleep = new NoSleep();
    noSleep.enable();

    return () => noSleep.disable();
  };
}
