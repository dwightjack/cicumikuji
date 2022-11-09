import { styled } from 'goober';
import { forwardRef } from 'preact/compat';
import { randomInt } from '../../shared/utils';
import { Button } from '../Button/Button';
import reload from '../../assets/reload.png';

export const Figure = styled('figure')`
  position: relative;
  width: 100vw;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;

  > * {
    position: absolute;
  }
`;

export const MainImage = styled('img', forwardRef)`
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  object-fit: contain;
  opacity: var(--opacity, 0);
  transform: scale(var(--scale, 0.5))
    rotate(var(--rotate, ${() => randomInt(-150, 100)}deg));
  will-change: transform, opacity;
  transition: opacity 800ms linear,
    transform 300ms cubic-bezier(0.65, 0, 0.35, 1);
`;

export const BgImage = styled('img', forwardRef)`
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  filter: blur(5px);
  opacity: var(--opacity, 0);
  will-change: transform, opacity;
  transition: opacity 1000ms linear;
`;

export const FigCaption = styled('figcaption')`
  top: auto;
  z-index: 2;
  background: rgba(var(--color-background-primary-rgb) / 0.6);
`;

export const Reloader = styled(Button)`
  right: 1rem;
  bottom: 1rem;
  z-index: 3;
  width: 3.5rem;
  height: 3.5rem;
  background-image: url('${reload}');
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center;
`;

export const CaptionText = styled('p')`
  white-space: pre-wrap;
`;

export const OmikujiContainer = styled('figcaption', forwardRef)`
  z-index: 3;
  top: 0;
  left: 0;
  opacity: var(--opacity, 0);
  transform: scale(var(--scale, 0.5));
  will-change: opacity, transform;
  transition: opacity 500ms cubic-bezier(0.87, 0, 0.13, 1),
    transform 500ms cubic-bezier(0.87, 0, 0.13, 1);
  transition-delay: 1000ms;
`;
