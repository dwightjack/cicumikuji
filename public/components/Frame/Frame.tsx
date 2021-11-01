import { FrameItem } from '../../types';
import {
  Figure,
  Reloader,
  MainImage,
  BgImage,
  OmikujiContainer,
} from './Frame.styles';
import { useCSSProps } from '../../hooks/style';
import { Omikuji } from '../Omikuji/Omikuji';
import { Video } from '../Video/Video';
import { useI18n } from '../../providers/i18n';

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

  console.log(videoUrl);

  return (
    <Figure>
      <OmikujiContainer ref={omikujiRef}>
        <Omikuji />
      </OmikujiContainer>

      <BgImage src={src} alt="" ref={bgImageInRef} />
      {/* <MainImage src={src} alt="" ref={imageInRef} /> */}
      <MainImage as={'div'} ref={imageInRef}>
        <Video src={videoUrl} poster={src} />
      </MainImage>
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
