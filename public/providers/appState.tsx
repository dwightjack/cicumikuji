import { createContext } from 'preact';
import { useReducer } from 'preact/hooks';

export interface State {
  loadQueue: number;
  error: string;
}

export interface Action {
  type: 'queue' | 'dequeue' | 'error';
  payload?: any;
}

const initialState: State = {
  loadQueue: 0,
  error: '',
};

export const selectors = {
  isReady: (state: State) => state.loadQueue === 0 && !state.error,
};

const createActions = (dispatch: (action: Action) => void) => ({
  queue: () => dispatch({ type: 'queue' }),
  dequeue: () => dispatch({ type: 'dequeue' }),
  setError: (err: string | Error) => dispatch({ type: 'error', payload: err }),
  dispatch,
});

function reducer(state: State, { type, payload }: Action): State {
  switch (type) {
    case 'queue':
    case 'dequeue':
      return {
        ...state,
        loadQueue: state.loadQueue + (type === 'queue' ? 1 : -1),
      };
    case 'error':
      return {
        ...state,
        error: payload,
      };
  }
}

export const AppStateContext = createContext<
  [State, ReturnType<typeof createActions>]
>(null);

export function AppStateProvider({ children }) {
  const [appState, dispatch] = useReducer(reducer, initialState);

  return (
    <AppStateContext.Provider value={[appState, createActions(dispatch)]}>
      {children}
    </AppStateContext.Provider>
  );
}
