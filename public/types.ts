export interface Caption {
  edges: {
    node: { text: string };
  }[];
}

export interface FrameItem {
  src: string;
  caption: string;
  datetime: string;
  formatted: string;
}
