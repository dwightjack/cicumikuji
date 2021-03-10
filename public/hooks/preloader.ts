import { useRef, useState } from 'preact/hooks';
import { sampleUniq, preload } from '../shared/utils';
import { FrameItem } from '../types';

export type LoadedState = 'idle' | 'loading' | 'loaded' | 'error';

export function useFramePreloader(maxRetry = 5) {
  const [loadedState, setLoadState] = useState<LoadedState>('idle');
  const frame = useRef<FrameItem>(null);
  const count = useRef(maxRetry);

  async function loader(
    data: FrameItem[],
    node: FrameItem,
  ): Promise<FrameItem> {
    setLoadState('loading');
    frame.current = sampleUniq(data, node);
    if (frame.current && frame.current.src) {
      try {
        await preload(frame.current.src);
        setLoadState('loaded');
        return frame.current;
      } catch (err) {
        if (count.current > 0) {
          count.current -= 1;
          return loader(data, frame.current);
        }
        setLoadState('error');
        throw err;
      }
    }
    return frame.current;
  }

  return [loadedState, loader] as const;
}
