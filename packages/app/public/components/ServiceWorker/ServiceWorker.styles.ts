import { styled } from 'goober';
import { Layer } from '../../shared/styles';

export const Alert = styled(Layer)`
  --layer-level: 100;
  --layer-bg: var(--color-background-alternate);
  flex-direction: row;
  align-items: baseline;
  top: auto;
`;

export const Text = styled('p')`
  margin-top: 0;
  margin-right: auto;
  margin-bottom: 0;
  color: var(--color-text-alternate);
`;
