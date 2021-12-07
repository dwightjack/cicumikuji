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

export interface EdgeCreatedTime {
  unix: number;
  string: string;
  humanized: string;
}

export interface Original {
  low: string;
  standard: string;
  high: string;
}

export interface Images {
  thumbnail: string;
  original: Original;
  square: string[];
}

export interface EdgeVideos {
  low_bandwidth: string;
  low: string;
  standard: string;
}

export interface EdgeFigures {
  video_views: number;
  likes_count: number;
  comments_count: number;
}

export interface EdgeLocation {
  id?: any;
  name: string;
  slug?: any;
  address?: any;
}

export interface EdgeComments {
  preview: any[];
  list: any[];
  has_more: boolean;
  next_page: string;
}

export interface Edge {
  id: string;
  short_code: string;
  owner_id: number;
  created_time: EdgeCreatedTime;
  type: string;
  post_url: string;
  images: Images;
  carousel: any[];
  caption: string;
  is_caption_edited: boolean;
  is_ad: boolean;
  is_comment_disabled: boolean;
  videos: EdgeVideos;
  figures: EdgeFigures;
  location: EdgeLocation;
  comments: EdgeComments;
  tagged_users: string[];
  sidecar: any[];
}
