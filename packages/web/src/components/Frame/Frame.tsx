import { useCSSProps } from '../../hooks/style';
import { useI18n } from '../../providers/i18n';
import type { FrameItem } from '../../types';
import { Omikuji } from '../Omikuji/Omikuji';
import { Video } from '../Video/Video';
import {
  BgImage,
  FigCaption,
  Figure,
  MainImage,
  OmikujiContainer,
  Reloader,
} from './Frame.styles';

interface FrameProps extends FrameItem {
  onClick?: () => void;
}

export function Frame({
  src,
  datetime,
  caption,
  onClick = () => {},
  videoUrl,
}: FrameProps) {
  const { t, formatDate } = useI18n();
  const omikujiRef = useCSSProps({
    opacity: 1,
    scale: 1,
  });
  const imageInRef = useCSSProps({
    scale: 1,
    rotate: 0,
    opacity: 1,
  });
  const bgImageInRef = useCSSProps({
    opacity: 1,
  });

  const captionInRef = useCSSProps({
    opacity: 1,
  });

  const shortCaption =
    caption.length > 20 ? `${caption.slice(20)}...` : caption;

  return (
    <>
      <OmikujiContainer ref={omikujiRef}>
        <Omikuji />
      </OmikujiContainer>
      <Figure>
        <BgImage src={src} alt="" ref={bgImageInRef} />
        {videoUrl ? (
          <MainImage as={'div'} ref={imageInRef}>
            <Video src={videoUrl} poster={src} />
          </MainImage>
        ) : (
          <MainImage src={src} alt="" ref={imageInRef} />
        )}

        <FigCaption ref={captionInRef}>
          <p>
            <time dateTime={datetime}>{formatDate(Date.parse(datetime))}</time>
          </p>
          <p>{shortCaption}</p>
        </FigCaption>
      </Figure>
      <Reloader onClick={onClick} aria-label={t('messages.reload')} />
    </>
  );
}
