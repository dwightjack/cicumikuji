import { styled } from 'goober';
import { Layer } from '../../shared/styles';

export const Container = styled(Layer)`
  --layer-level: 110;
  border: 0.5rem solid var(--color-border-warning);
`;

export const Title = styled('h2')`
  color: var(--color-border-warning);
`;

export const ErrorMessage = styled('pre')`
  background-color: var(--color-background-warning);
  border-radius: var(--size-radius-sm);
  padding: 0.5em;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: inherit;
`;
