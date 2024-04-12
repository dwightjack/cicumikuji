import type { FrameItem } from '../../../public/types';
import { useCSSProps } from '../../hooks/style';
import { useI18n } from '../../providers/i18n';
import { Omikuji } from '../Omikuji/Omikuji';
import { Video } from '../Video/Video';
import {
  BgImage,
  Figure,
  MainImage,
  OmikujiContainer,
  Reloader,
} from './Frame.styles';

interface FrameProps extends FrameItem {
  onClick?: () => void;
}
export function Frame({ src, onClick = () => {}, videoUrl }: FrameProps) {
  const { t } = useI18n();
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

  return (
    <Figure>
      <OmikujiContainer ref={omikujiRef}>
        <Omikuji />
      </OmikujiContainer>

      <BgImage src={src} alt="" ref={bgImageInRef} />
      {videoUrl ? (
        <MainImage as={'div'} ref={imageInRef}>
          <Video src={videoUrl} poster={src} />
        </MainImage>
      ) : (
        <MainImage src={src} alt="" ref={imageInRef} />
      )}

      {/* <FigCaption>
        <p>
          <time dateTime={datetime}>{formatted}</time>
        </p>
        <CaptionText>{caption}</CaptionText>
      </FigCaption> */}
      <Reloader onClick={onClick} aria-label={t('messages.reload')} />
    </Figure>
  );
}
