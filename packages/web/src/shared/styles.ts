import { styled } from 'goober';

export const Layer = styled('section')`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background: var(--layer-bg, var(--color-background-frame));
  z-index: var(--layer-level, 10);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
