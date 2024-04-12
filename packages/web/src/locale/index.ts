import type { LocaleDb } from '../shared/types';
import { en } from './en';
import { it } from './it';
import { ja } from './ja';

export const db: LocaleDb = {
  en,
  it,
  ja,
};

export function inferLocale(fallback = 'en') {
  const userLanguages = (navigator.languages || [navigator.language]).map(
    (lang) => lang.replace(/-.+$/, ''),
  );
  const locales = Object.keys(db);
  return userLanguages.find((l) => locales.includes(l)) ?? fallback;
}
