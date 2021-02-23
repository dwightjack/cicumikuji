import { useEffect, useState } from 'preact/hooks';

export function useImagePreloader(src: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.src = src;

    img.onload = () => setLoaded(true);
    return () => {
      img.onload = () => {};
    };
  }, [src]);

  return loaded;
}
