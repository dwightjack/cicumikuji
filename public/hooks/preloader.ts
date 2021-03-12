import { useContext, useRef } from 'preact/hooks';
import { AppStateContext } from '../providers/appState';
import { sampleUniq, preload } from '../shared/utils';
import { FrameItem } from '../types';

export function useFramePreloader(maxRetry = 5) {
  const [, actions] = useContext(AppStateContext);
  const frame = useRef<FrameItem>(null);
  const count = useRef(maxRetry);

  async function loader(
    data: FrameItem[],
    node: FrameItem,
  ): Promise<FrameItem> {
    frame.current = sampleUniq(data, node);
    if (frame.current && frame.current.src) {
      actions.queue();
      try {
        await preload(frame.current.src);
        return frame.current;
      } catch (err) {
        if (count.current > 0) {
          count.current -= 1;
          return loader(data, frame.current);
        }
        actions.setError('Error loading images...');
        throw err;
      } finally {
        actions.dequeue();
      }
    }
    return frame.current;
  }

  return loader;
}
