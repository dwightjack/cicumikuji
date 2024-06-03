export function useWakeLock() {
  return async function enable() {
    if ('wakeLock' in navigator && !(navigator as any).standalone) {
      let wakeLock: WakeLockSentinel | null = null;
      async function getWakeLock() {
        try {
          wakeLock = await navigator.wakeLock.request();
        } catch {
          console.warn('Unable to get wakelock');
        }
      }

      getWakeLock();
      const handleVisibilityChange = () =>
        wakeLock && document.visibilityState === 'visible' && getWakeLock();
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        wakeLock?.release();
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange,
        );
      };
    }
    const NoSleep = await import('nosleep.js').then((m) => m.default);
    const noSleep = new NoSleep();
    noSleep.enable();

    return () => noSleep.disable();
  };
}
