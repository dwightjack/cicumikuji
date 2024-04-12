import { set } from 'idb-keyval';
import { type ComponentChildren, createContext } from 'preact';
import {
  type StateUpdater,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { db } from '../locale';
import type { Locale, LocaleDb, ObjectToPaths } from '../shared/types';

export interface I18nContext {
  db: LocaleDb;
  locale: string;
  locales: { id: keyof LocaleDb; label: string }[];
  current: Locale;
  setLocale: StateUpdater<keyof LocaleDb>;
}

const locales = (Object.keys(db) as (keyof LocaleDb)[]).map((id) => ({
  id,
  label: db[id].name,
}));

const I18nContext = createContext<I18nContext | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);

  if (context === undefined) {
    throw new Error('useI18n must be used within a I18nProvider');
  }

  const { current = {} as Locale, setLocale, locale, locales, db } = context;

  const t = useCallback(
    function t(path: ObjectToPaths<Locale>, def = '', lang?: keyof LocaleDb) {
      return (path
        .split('.')
        .reduce((obj, key) => (obj as any)?.[key], lang ? db[lang] : current) ??
        def) as unknown as string;
    },
    [locale, locales],
  );

  return { t, setLocale, locale, locales };
}

export function I18nProvider({
  children,
  lang,
}: { children: ComponentChildren; lang: keyof LocaleDb }) {
  const [locale, setLocale] = useState<keyof LocaleDb>(lang);

  const i18n = useMemo(
    () => ({
      db,
      locale,
      locales,
      current: db[locale],
      setLocale,
    }),
    [locale],
  );

  useEffect(() => {
    set('locale', locale);
  }, [locale]);

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}
