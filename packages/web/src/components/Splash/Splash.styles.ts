import { styled } from 'goober';
import { Layer } from '../../shared/styles';

export const Container = styled(Layer)`
  --layer-level: 90;
  text-align: center;
  row-gap: 2rem;

  & > * {
    margin-block: 0;
  }
`;

export const ButtonGroup = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;

  & > * + * {
    margin: 0.5rem;
  }
`;

export const Title = styled('h1')`
  color: var(--color-text-heading);
  margin-block-start: auto;
`;

export const Footer = styled('footer')`
  margin-block-start: auto;

  & > a {
    margin-inline-start: 0.2em;
  }
`;
