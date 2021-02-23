import { FrameItem } from '../../types';
import {
  Figure,
  FigCaption,
  CaptionText,
  Reloader,
  MainImage,
  BgImage,
} from './Frame.styles';
import { useImagePreloader } from '../../hooks/preloader';

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
  const loaded = useImagePreloader(src);

  return (
    <Figure>
      {!loaded ? (
        <p>loading...</p>
      ) : (
        <>
          <BgImage src={src} alt="" />
          <MainImage src={src} alt="" />
          <FigCaption>
            <p>
              <time dateTime={datetime}>{formatted}</time>
            </p>
            <CaptionText>{caption}</CaptionText>
          </FigCaption>
        </>
      )}

      <Reloader onClick={onClick} aria-label="Reload!" />
    </Figure>
  );
}
