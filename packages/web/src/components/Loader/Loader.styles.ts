import { keyframes, styled } from 'goober';
import { Layer } from '../../shared/styles';

const bounce = keyframes`
  0%   { transform: scale(1,1)      translateY(0); }
  5%  { transform: scale(1.1,.9)   translateY(0); }
  30%  { transform: scale(.9,1.1)   translateY(-100px); }
  40%  { transform: scale(1,1)      translateY(-7px); }
  50%  { transform: scale(1.05,.95) translateY(7px); }
  64%  { transform: scale(1,1)      translateY(0); }
  100% { transform: scale(1,1)      translateY(0); }
`;

export const Container = styled(Layer)`
  --layer-level: 100;
`;

export const Svg = styled('svg')`
  display: block;
  inline-size: 50%;
  block-size: 50%;
  object-fit: contain;
  animation-name: ${bounce};
  animation-timing-function: cubic-bezier(0.28, 0.84, 0.23, 0.99);
  animation-duration: 1.7s;
  animation-iteration-count: infinite;
`;
