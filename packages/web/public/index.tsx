import { render } from 'preact';
import { App } from './components/App';
import { AppStateProvider } from './providers/appState';
import { I18nProvider } from './providers/i18n';
import { inferLocale } from './locale';
import { get } from 'idb-keyval';

get('locale')
  .then((lang) => lang || inferLocale())
  .then((lang) => {
    render(
      <I18nProvider lang={lang}>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </I18nProvider>,
      document.body,
    );
  });
