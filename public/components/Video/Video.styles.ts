import { styled } from 'goober';
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

export const Control = styled('button')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  border: 0;
  border-radius: 0;

  &::after {
    content: '';
    background-color: #fff;
    box-shadow: 2px 2px 1px 1px rgba(var(--color-text-primary-rgb) / 0.4);
  }
`;
