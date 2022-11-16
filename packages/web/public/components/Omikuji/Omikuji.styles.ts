import { styled } from 'goober';

export const Root = styled('p')`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--color-background-highlight);

  html:lang(ja) & {
    writing-mode: vertical-rl;
    flex-direction: row;
  }

  html:not(:lang(ja)) & {
    line-height: 1.5;
  }
`;

export const Title = styled('em')`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  min-height: 2.5em;
  font-style: normal;
  text-align: center;
  border-bottom: 1px solid rgba(var(--color-text-primary-rgb) / 0.5);

  html:lang(ja) & {
    font-size: 2rem;
  }
`;

export const Quote = styled('q')`
  font-size: 1.2rem;
  padding: 0.5rem;

  &::before,
  &::after {
    display: none;
  }

  html:lang(ja) & {
    letter-spacing: 0.2em;
  }
`;

export const Mark = styled('span')`
  font-size: 2rem;

  &:not(:last-child) {
    margin-right: 0.5rem;
  }
`;
