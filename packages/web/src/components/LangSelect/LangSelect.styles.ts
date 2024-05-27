import { styled } from 'goober';

export const Root = styled('label')`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
`;

export const Select = styled('select')`
  border: 2px solid var(--color-background-primary);
  padding: 0.2rem;
  border-radius: var(--size-radius-sm);
  background: transparent;
  box-shadow: 1px 1px 1px 1px rgba(var(--color-text-primary-rgb) / 0.4);
`;
