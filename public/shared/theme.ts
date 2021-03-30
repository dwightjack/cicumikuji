import { setup, styled } from 'goober';
import { createGlobalStyles } from 'goober/global';
import { h } from 'preact';

setup(h);

export const GlobalStyles = createGlobalStyles`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    font-family: 'Yusei Magic', sans-serif;
    background: #fff;
    height: 100%;
  }
`;

export const AppRoot = styled('main')`
  /*  Spacing */
  --size-base: 1rem;

  --color-white: 255 255 255;
  --color-green-500: 186 249 142;
  --color-green-900: 81 152 32;
  --color-gray-900: 51 51 51;
  --color-red-100: 254 226 226;
  --color-red-900: 221 53 53;
  --color-orange-300: 255 249 80;

  /* UI  */

  --color-text-primary-rgb: var(--color-gray-900);
  --color-text-alternate-rgb: var(--color-white);
  --color-text-warning-rgb: var(--color-red-900);
  --color-text-heading-rgb: var(--color-green-900);
  --color-background-alternate-rgb: var(--color-green-900);
  --color-background-primary-rgb: var(--color-green-500);
  --color-background-frame-rgb: var(--color-white);
  --color-background-warning-rgb: var(--color-red-100);
  --color-background-highlight-rgb: var(--color-orange-300);
  --color-border-warning-rgb: var(--color-red-900);

  --color-text-primary: rgb(var(--color-gray-900));
  --color-text-alternate: rgb(var(--color-white));
  --color-text-warning: rgb(var(--color-red-900));
  --color-text-heading: rgb(var(--color-green-900));
  --color-background-primary: rgb(var(--color-green-500));
  --color-background-frame: rgb(var(--color-white));
  --color-background-alternate: rgb(var(--color-green-900));
  --color-background-warning: rgb(var(--color-red-100));
  --color-background-highlight: rgb(var(--color-orange-300));
  --color-border-warning: rgb(var(--color-red-900));

  --size-radius-sm: calc(var(--size-base) * 0.25);

  /* Styles */
  color: var(--color-text-primary);
  height: 100%;

  a:not([class]) {
    color: var(--color-text-heading);
  }
`;
