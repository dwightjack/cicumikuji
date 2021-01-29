import { h } from 'preact';
import { styled, setup } from 'goober';
import { FrameItem } from '../utils';

interface FrameProps extends FrameItem {
  onClick?: () => void;
}

setup(h);

const Figure = styled('figure')`
  position: relative;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  align-items: stretch;

  > * {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

const Image = styled('img')`
  object-fit: contain;
  height: 100%;
  width: 100%;
  z-index: 1;
`;
const BgImage = styled('img')`
  object-fit: cover;
  height: 100%;
  width: 100%;
  opacity: 0.5;
  filter: blur(5px);
`;

const FigCaption = styled('figcaption')`
  background: rgba(186, 249, 142, 0.6);
  top: auto;
  z-index: 2;
`;

const Reloader = styled('button')`
  display: block;
  width: 100%;
  z-index: 3;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  outline: 0;
`;

const CaptionText = styled('p')`
  white-space: pre-wrap;
`;

export function Frame({
  caption,
  src,
  datetime,
  formatted,
  onClick = () => {},
}: FrameProps) {
  return (
    <Figure>
      <BgImage src={src} alt="" loading="lazy" />
      <Image src={src} alt="" loading="lazy" />
      <FigCaption>
        <p>
          <time dateTime={datetime}>{formatted}</time>
        </p>
        <CaptionText>{caption}</CaptionText>
      </FigCaption>
      <Reloader onClick={onClick} aria-label="Reload!" />
    </Figure>
  );
}
