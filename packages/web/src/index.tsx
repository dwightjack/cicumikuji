import { get } from 'idb-keyval';
import { render } from 'preact';
import { App } from '../src/components/App';
import { inferLocale } from '../src/locale';
import { AppStateProvider } from '../src/providers/appState';
import { I18nProvider } from '../src/providers/i18n';

async function run() {
  if (process.env.NODE_ENV !== 'production') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }

  const lang = await get('locale');
  render(
    <I18nProvider lang={lang || inferLocale()}>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </I18nProvider>,
    document.body,
  );
}

run();
