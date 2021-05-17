export interface Post {
  src: string;
  id: string;
  videoUrl: string | null;
  caption: string;
  datetime: string;
  timestamp: number;
  local?: boolean;
  skip?: string;
  originalSrc?: string;
  originalVideoUrl?: string;
}
