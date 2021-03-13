import { styled } from 'goober';
import { Layer } from '../../shared/styles';

export const Container = styled(Layer)`
  --layer-level: 90;
  text-align: center;
  row-gap: 1rem;
`;

export const ButtonGroup = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`;

export const Title = styled('h1')`
  color: var(--color-text-heading);
`;
