import { Root, VideoFrame, Control } from './Video.styles';
import { useRef, useState, useEffect } from 'preact/hooks';
export interface VideoProps {
  src: string;
  poster: string;
}

export function Video({ src, poster }: VideoProps) {
  const [play, setPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    if (play) {
      videoRef.current.play();
      return;
    }
    videoRef.current.pause();
  }, [play, videoRef]);
  return (
    <Root>
      <VideoFrame ref={videoRef} loop poster={poster}>
        <source src={src} type="video/mp4" />
      </VideoFrame>
      <Control onClick={() => setPlay((v) => !v)} />
    </Root>
  );
}
