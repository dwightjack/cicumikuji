import { styled } from 'goober';
import { transparentize } from 'color2k';
import theme from '../../shared/theme';

export const Figure = styled('figure')`
  position: relative;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;

  > * {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

export const MainImage = styled('img')`
  object-fit: contain;
  height: 100%;
  width: 100%;
  z-index: 1;
`;
export const BgImage = styled('img')`
  object-fit: cover;
  height: 100%;
  width: 100%;
  opacity: 0.5;
  filter: blur(5px);
`;

export const FigCaption = styled('figcaption')`
  background: ${transparentize(theme.color.background.primary, 0.6)};
  top: auto;
  z-index: 2;
`;

export const Reloader = styled('button')`
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

export const CaptionText = styled('p')`
  white-space: pre-wrap;
`;
