import { render } from 'preact';
import { App } from './components/App';
import { AppStateProvider } from './providers/appState';

render(
  <AppStateProvider>
    <App />
  </AppStateProvider>,
  document.body,
);
