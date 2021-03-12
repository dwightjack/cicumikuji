import { createContext } from 'preact';
import { useState } from 'preact/hooks';
import { AppState } from '../types';

export const StoreContext = createContext({});

export const StoreProvider = ({ children }) => {
  const appState = useState<AppState>('idle');

  return (
    <StoreContext.Provider value={appState}>{children}</StoreContext.Provider>
  );
};
