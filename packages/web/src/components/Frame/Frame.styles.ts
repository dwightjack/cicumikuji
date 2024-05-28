import { styled } from 'goober';
import { forwardRef } from 'preact/compat';
import reload from '../../assets/reload.png';
import { randomInt } from '../../shared/utils';
import { Button } from '../Button/Button';

export const Figure = styled('figure')`
  position: relative;
  inline-size: 100dvi;
  block-size: 100dvb;
  margin: 0;
  padding: 0;
  overflow: hidden;

  > * {
    position: absolute;
  }
`;

export const MainImage = styled('img', forwardRef)`
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
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
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  filter: blur(5px);
  opacity: var(--opacity, 0);
  will-change: transform, opacity;
  transition: opacity 1000ms linear;
`;

export const ExpandCaption = styled('button')`
  all: unset;
  display: inline-block;
  text-decoration: underline;

  &[hidden] {
    display: none;
  }
`;

export const FigCaption = styled('figcaption', forwardRef)`
  inset-block-end: 1rem;
  inset-inline-start: 1rem;
  z-index: 4;
  background: rgba(var(--color-background-primary-rgb) / 0.8);
  padding: 1rem;
  max-inline-size: 50vw;
  min-inline-size: 1rem;
  min-block-size: 1rem;
  border-radius: var(--size-radius-md);
  opacity: var(--opacity, 0);
  will-change: opacity;
  transition: all 250ms cubic-bezier(.84,.21,.41,.88) 0ms, opacity 500ms ease-out 1300ms;
  line-height: 1.5;
  ${({ expanded }) =>
    expanded
      ? `
    max-inline-size: calc(100vw - 4rem);
    min-inline-size: calc(100vw - 4rem);
    min-block-size: calc(100vh - 4rem);
    translate: 1rem -1rem;
    overflow: auto;
    background: rgba(var(--color-background-primary-rgb));
    box-shadow: 2px 2px 1px 1px rgba(var(--color-text-primary-rgb) / 0.4);
  `
      : ''}

  & > * {
    white-space: pre-wrap;
    margin: 0rem;
  }

  & > :not(:last-child) {
    margin-block-end: 0.5rem;
  }
`;

export const Reloader = styled(Button)`
  position: absolute;
  inset-inline-end: 1rem;
  inset-block-end: 1rem;
  z-index: 3;
  inline-size: 3.5rem;
  aspect-ratio: 1;
  background-image: url('${reload}');
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center;
`;

export const OmikujiContainer = styled('div', forwardRef)`
  position: absolute;
  z-index: 3;
  inset-inline-start: 1rem;
  inset-block-start: 1rem;
  opacity: var(--opacity, 0);
  transform: scale(var(--scale, 0.5));
  will-change: opacity, transform;
  transition: opacity 500ms cubic-bezier(0.87, 0, 0.13, 1),
    transform 500ms cubic-bezier(0.87, 0, 0.13, 1);
  transition-delay: 1000ms;
`;
