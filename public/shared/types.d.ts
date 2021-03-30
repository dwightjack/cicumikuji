/**
 * @see https://stackoverflow.com/a/47058976/1531970
 */
export type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

export type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;

export type ObjectToPaths<T extends Record<string, any>> = Join<
  PathsToStringProps<T>,
  '.'
>;

export interface Locale {
  name: string;
  messages: Record<
    | 'title'
    | 'error'
    | 'error_detail'
    | 'lets_reload'
    | 'reload'
    | 'activate_shake'
    | 'intro_shake'
    | 'start'
    | 'enable'
    | 'disable'
    | 'language'
    | 'follow_me'
    | 'update_txt'
    | 'update'
    | 'updating',
    string
  >;
  fortune: Record<'low' | 'little' | 'normal' | 'good' | 'best', string>;
  quotes: string[];
}

export interface LocaleDb {
  ja: Locale;
  en: Locale;
  it: Locale;
}
