import { createContext } from 'preact';
import { useReducer, useMemo } from 'preact/hooks';

export type AppStatus = 'boot' | 'splash' | 'play' | 'error';
export interface State {
  loadQueue: number;
  error: string;
  status: AppStatus;
}

export interface Action {
  type: keyof State;
  payload?: any;
}

export interface AppStateContext extends ReturnType<typeof createActions> {
  $state: State;
  isReady: boolean;
  isLoading: boolean;
  showSplash: boolean;
}

const initialState: State = {
  loadQueue: 0,
  error: '',
  status: 'boot',
};

const createActions = (dispatch: (action: Action) => void) => ({
  loadStart: () => dispatch({ type: 'loadQueue', payload: 1 }),
  loadComplete: () => dispatch({ type: 'loadQueue', payload: -1 }),
  setError: (payload: string | Error) => dispatch({ type: 'error', payload }),
  setStatus: (payload: AppStatus) => dispatch({ type: 'status', payload }),
  dispatch,
});

function reducer(state: State, { type, payload }: Action): State {
  switch (type) {
    case 'loadQueue':
      return {
        ...state,
        loadQueue: state.loadQueue + payload,
      };
    case 'error':
      return {
        ...state,
        error: payload,
        status: 'error',
      };
    case 'status':
      return {
        ...state,
        status: payload,
      };
  }
}

export const AppStateContext = createContext<AppStateContext>(null);

export function AppStateProvider({ children }) {
  const [appState, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      $state: appState,
      isReady: appState.loadQueue === 0 && appState.status === 'play',
      showSplash: appState.status === 'splash',
      isLoading: appState.loadQueue > 0,
      ...createActions(dispatch),
    }),
    [appState],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
