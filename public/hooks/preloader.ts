import { useRef } from 'preact/hooks';
import { useAppState } from '../providers/appState';
import { sampleUniq, preload } from '../shared/utils';
import { FrameItem } from '../types';

export function useFramePreloader(maxRetry = 5) {
  const { loadStart, loadComplete, setError } = useAppState();
  const frame = useRef<FrameItem>(null);
  const count = useRef(maxRetry);

  async function loader(
    data: FrameItem[],
    node: FrameItem,
  ): Promise<FrameItem> {
    frame.current = sampleUniq(data, node);
    if (frame.current && frame.current.src) {
      loadStart();
      try {
        await preload(frame.current.src);
        return frame.current;
      } catch (err) {
        if (count.current > 0) {
          count.current -= 1;
          return loader(data, frame.current);
        }
        setError('Error loading images...');
        throw err;
      } finally {
        loadComplete();
      }
    }
    return frame.current;
  }

  return loader;
}
