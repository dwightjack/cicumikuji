import { useSignalEffect } from '@preact/signals';
import { useRef } from 'preact/hooks';
import { useI18n } from '../../providers/i18n';
import { useToggle } from '../../signals/toggle';
import { Control, Root, VideoFrame } from './Video.styles';
export interface VideoProps {
  src: string;
  poster: string;
}

export function Video({ src, poster }: VideoProps) {
  const [isPlaying, toggle] = useToggle();
  const videoRef = useRef<HTMLVideoElement>();
  const { t } = useI18n();

  useSignalEffect(() => {
    if (!videoRef.current) {
      return;
    }
    if (isPlaying.value) {
      videoRef.current.play();
      return;
    }
    videoRef.current.pause();
  });
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
        onClick={toggle}
        isPlaying={isPlaying.value}
        aria-label={
          isPlaying.value ? t('messages.pause_video') : t('messages.play_video')
        }
      />
    </Root>
  );
}
