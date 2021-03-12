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
  video_url: null | string;
  timestamp: number;
  formatted: string;
}
