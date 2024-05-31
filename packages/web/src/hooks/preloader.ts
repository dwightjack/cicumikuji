import { useRef } from 'preact/hooks';
import { useAppState } from '../providers/appState';
import { preload, sampleUniq } from '../shared/utils';
import type { FrameItem } from '../types';

export function useFramePreloader(maxRetry = 5) {
  const { loadComplete, loadStart, setError } = useAppState();
  const frame = useRef<FrameItem | null>(null);
  const count = useRef(maxRetry);

  async function loader(
    data?: FrameItem[],
    node?: FrameItem | null,
  ): Promise<FrameItem | null> {
    frame.current = data ? sampleUniq(data, node) : null;
    if (frame.current?.src) {
      loadStart();
      try {
        await preload(frame.current.src);
        count.current = maxRetry;
        return frame.current;
      } catch (err) {
        if (count.current > 0) {
          count.current -= 1;
          return loader(data, frame.current);
        }
        setError('Error loading images...');
        count.current = maxRetry;
        throw err;
      } finally {
        loadComplete();
      }
    }
    return frame.current;
  }

  return loader;
}
