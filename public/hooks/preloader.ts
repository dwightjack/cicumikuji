import { useState } from 'preact/hooks';

export function useImagePreloader() {
  const [loaded, setLoaded] = useState(false);

  function loader(src: string) {
    setLoaded(false);
    const img = new Image();
    img.src = src;

    img.onload = () => setLoaded(true);
    return () => {
      img.onload = () => {};
    };
  }

  return [loaded, loader] as const;
}
