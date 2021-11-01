import { styled, keyframes } from 'goober';
import { forwardRef } from 'preact/compat';

export const Root = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export const VideoFrame = styled('video', forwardRef)`
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const fadeOut = keyframes`
    to {
        opacity: 0;
    }
`;

export const Control = styled('button')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  border: 0;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;

  &::after {
    display: block;
    content: '';
    filter: drop-shadow(2px 2px 1px rgba(var(--color-text-primary-rgb) / 0.4));
    ${({ isPlaying }) => {
      if (isPlaying) {
        return `
          width: 3.5rem;
          height: 5rem;
          border-style: double;
          border-width: 0px 0px 0px 3.5rem;
          border-color: var(--color-background-frame);
          animation: ${fadeOut} 0.2s linear;
          animation-fill-mode: forwards;
          animation-delay: 0.5s;
        `;
      }

      return `
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 2.5rem 0 2.5rem 3.5rem;
        border-color: transparent;
        border-left-color: var(--color-background-frame);
      `;
    }}
  }
`;