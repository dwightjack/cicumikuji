import { FrameItem } from '../../types';
import {
  Figure,
  FigCaption,
  CaptionText,
  Reloader,
  MainImage,
  BgImage,
  OmikujiContainer,
} from './Frame.styles';
import { useCSSProps } from '../../hooks/style';
import { sample } from '../../shared/utils';
import { Omikuji } from '../Omikuji/Omikuji';

interface FrameProps extends FrameItem {
  onClick?: () => void;
}
const omikuji = ['凶', '小吉', '中吉', '吉', '大吉'];

export function Frame({
  caption,
  src,
  datetime,
  formatted,
  onClick = () => {},
}: FrameProps) {
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
      <MainImage src={src} alt="" ref={imageInRef} />

      {/* <FigCaption>
        <p>
          <time dateTime={datetime}>{formatted}</time>
        </p>
        <CaptionText>{caption}</CaptionText>
      </FigCaption> */}
      <Reloader onClick={onClick} aria-label="Reload!" />
    </Figure>
  );
}
