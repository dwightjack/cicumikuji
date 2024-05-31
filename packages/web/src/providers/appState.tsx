import {
  type ReadonlySignal,
  type Signal,
  batch,
  computed,
  signal,
  useSignal,
} from '@preact/signals';
import { type ComponentChildren, createContext } from 'preact';
import { useContext } from 'preact/hooks';

export type AppStatus = 'boot' | 'splash' | 'play' | 'error';

export interface AppStateContext {
  loadQueue: Signal<number>;
  appError: Signal<string>;
  appStatus: Signal<AppStatus>;
  appBooted: Signal<boolean>;
  isReady: ReadonlySignal<boolean>;
  isLoading: ReadonlySignal<boolean>;
  loadStart: () => void;
  loadComplete: () => void;
  setError: (error: string | Error) => void;
  setStatus: (status: AppStatus) => void;
}

const AppStateContext = createContext<AppStateContext | undefined>(undefined);

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within a I18nProvider');
  }
  return context;
}

export function AppStateProvider({
  children,
}: { children: ComponentChildren }) {
  const loadQueue = useSignal(0);
  const appError = useSignal<string>('');
  const appStatus = useSignal<AppStatus>('boot');
  const appBooted = useSignal(false);

  const appState = {
    loadQueue,
    appError,
    appStatus,
    appBooted,
    loadStart: () => {
      loadQueue.value++;
    },
    loadComplete: () => {
      loadQueue.value--;
    },
    setError: (error) => {
      batch(() => {
        appError.value = error.toString();
        appStatus.value = 'error';
      });
    },
    setStatus: (status: AppStatus) => {
      appStatus.value = status;
    },

    isReady: computed(
      () => loadQueue.value === 0 && appStatus.value === 'play',
    ),
    isLoading: computed(() => loadQueue.value > 0),
  } satisfies AppStateContext;

  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
}
