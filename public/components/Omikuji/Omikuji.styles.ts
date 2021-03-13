import { styled } from 'goober';

export const Root = styled('p')`
  display: flex;
  align-items: center;
  margin: 0;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--color-background-highlight);
  writing-mode: vertical-rl;
`;

export const Title = styled('em')`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  min-height: 2.5em;
  font-size: 2rem;
  font-style: normal;
  text-align: center;
  border-bottom: 1px solid rgba(var(--color-text-primary-rgb) / 0.5);
`;

export const Quote = styled('q')`
  font-size: 1.2rem;
  padding: 0.5rem;
  letter-spacing: 0.2em;

  &::before,
  &::after {
    display: none;
  }
`;
