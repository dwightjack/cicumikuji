import { render } from 'preact';
import { App } from './components/App';
import { AppStateProvider } from './providers/appState';
// @ts-ignore
import swURL from 'sw:./sw.ts';
navigator.serviceWorker.register(swURL);

render(
  <AppStateProvider>
    <App />
  </AppStateProvider>,
  document.body,
);
