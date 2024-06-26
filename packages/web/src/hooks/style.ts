import { useCallback } from 'preact/hooks';

export function useCSSProps(props: Record<string, any>) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const ref = useCallback((node: HTMLImageElement) => {
    if (node !== null) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          for (const [key, value] of Object.entries(props)) {
            node.style.setProperty(`--${key}`, `${value}`);
          }
        });
      });
    }
  }, []);
  return ref;
}
