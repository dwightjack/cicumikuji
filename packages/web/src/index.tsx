import { del, get, set } from 'idb-keyval';
import { render } from 'preact';
import { App } from '../src/components/App';
import { inferLocale } from '../src/locale';
import { I18nProvider } from '../src/providers/i18n';
import { AppStateProvider } from './providers/appState';
import { POST_API_KEY } from './shared/constants';

async function run() {
  if (process.env.NODE_ENV !== 'production') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }

  if (process.env.HASH) {
    // check for previous build
    const hash = await get<string>('build');
    if (hash !== process.env.HASH) {
      // if the build is different, clear the cache
      await del(POST_API_KEY);
      await set('build', process.env.HASH);
    }
  }

  const lang = await get('locale');
  render(
    <AppStateProvider>
      <I18nProvider lang={lang || inferLocale()}>
        <App />
      </I18nProvider>
    </AppStateProvider>,
    document.body,
  );
}

run();
