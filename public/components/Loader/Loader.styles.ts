import { styled, keyframes } from 'goober';

const bounce = keyframes`
  0%   { transform: scale(1,1)      translateY(0); }
  10%  { transform: scale(1.1,.9)   translateY(0); }
  30%  { transform: scale(.9,1.1)   translateY(-100px); }
  50%  { transform: scale(1.05,.95) translateY(0); }
  57%  { transform: scale(1,1)      translateY(-7px); }
  64%  { transform: scale(1,1)      translateY(0); }
  100% { transform: scale(1,1)      translateY(0); }
`;

export const Container = styled('div')`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Svg = styled('svg')`
  display: block;
  width: 50%;
  height: 50%;
  object-fit: contain;
  animation-name: ${bounce};
  animation-timing-function: cubic-bezier(0.28, 0.84, 0.42, 1);
  animation-duration: 1.7s;
  animation-iteration-count: infinite;
`;
