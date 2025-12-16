import {
  type ReadonlySignal,
  type Signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from '@preact/signals';
import { set } from 'idb-keyval';
import { type ComponentChildren, createContext } from 'preact';
import { useCallback, useContext } from 'preact/hooks';
import { db } from '../locale';
import type { Locale, LocaleDb, ObjectToPaths } from '../shared/types';

export interface I18nContext {
  db: LocaleDb;
  locale: Signal<string>;
  locales: { id: keyof LocaleDb; label: string }[];
  current: Locale;
  formatDate: (date?: number | Date | undefined) => string;
}

const locales = (Object.keys(db) as (keyof LocaleDb)[]).map((id) => ({
  id,
  label: db[id].name,
}));

const I18nContext = createContext<ReadonlySignal<I18nContext> | undefined>(
  undefined,
);

export function useI18n() {
  const context = useContext(I18nContext);

  if (context === undefined) {
    throw new Error('useI18n must be used within a I18nProvider');
  }

  const {
    current = {} as Locale,
    locale,
    locales,
    db,
    formatDate,
  } = context.value;

  const t = useCallback(
    function t(path: ObjectToPaths<Locale>, def = '', lang?: keyof LocaleDb) {
      return (path
        .split('.')
        .reduce((obj, key) => (obj as any)?.[key], lang ? db[lang] : current) ??
        def) as unknown as string;
    },
    [locale.value, locales],
  );

  return { t, locale, locales, formatDate };
}

export function I18nProvider({
  children,
  lang,
}: {
  children: ComponentChildren;
  lang: keyof LocaleDb;
}) {
  const locale = useSignal<keyof LocaleDb>(lang);

  const i18n = useComputed(() => {
    const intl = Intl.DateTimeFormat(locale.value, { timeZone: 'UTC' });
    return {
      db,
      locales,
      locale,
      current: db[locale.value],
      formatDate: intl.format.bind(intl),
    };
  });

  useSignalEffect(() => {
    set('locale', locale.value);
  });

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}
