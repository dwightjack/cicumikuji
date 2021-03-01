import { FrameItem } from '../../types';
import {
  Figure,
  FigCaption,
  CaptionText,
  Reloader,
  MainImage,
  BgImage,
} from './Frame.styles';
import { useCSSProps } from '../../hooks/style';
interface FrameProps extends FrameItem {
  onClick?: () => void;
}

export function Frame({
  caption,
  src,
  datetime,
  formatted,
  onClick = () => {},
}: FrameProps) {
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
