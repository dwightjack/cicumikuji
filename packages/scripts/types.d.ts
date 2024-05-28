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

export interface Entry {
  uri: string;
  creation_timestamp: number;
  media_metadata: {
    photo_metadata: PhotoMetadata;
    camera_metadata: {
      has_camera_metadata: boolean;
    };
  };
  title: string;
  cross_post_source: {
    source_app: string;
  };
}

export interface PhotoMetadata {
  exif_data: {
    latitude: number;
    longitude: number;
  }[];
}
