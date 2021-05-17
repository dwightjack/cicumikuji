export interface Caption {
  edges: {
    node: { text: string };
  }[];
}

export type AppState = 'idle' | 'loading' | 'loaded' | 'error';

export interface FrameItem {
  src: string;
  caption: string;
  datetime: string;
  videoUrl: null | string;
  timestamp: number;
  formatted: string;
}
