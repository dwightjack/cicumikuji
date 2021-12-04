import { Root, VideoFrame, Control } from './Video.styles';
import { useRef, useState, useEffect } from 'preact/hooks';
import { useI18n } from '../../providers/i18n';
export interface VideoProps {
  src: string;
  poster: string;
}

export function Video({ src, poster }: VideoProps) {
  const [play, setPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>();
  const { t } = useI18n();

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
      <VideoFrame
        ref={videoRef}
        loop
        poster={poster}
        playsinline
        muted
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </VideoFrame>
      <Control
        onClick={() => setPlay((v) => !v)}
        isPlaying={play}
        aria-label={play ? t('messages.pause_video') : t('messages.play_video')}
      />
    </Root>
  );
}
