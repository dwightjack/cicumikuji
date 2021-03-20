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
    | 'language',
    string
  >;
  fortune: Record<'low' | 'little' | 'normal' | 'good' | 'best', string>;
  quotes: string[];
}

[
  'だいころす！',
  '触らないで！',
  'お風呂したくない！',
  'お風呂したくない！',
  '人間がいないと最高〜',
  'おふとん最高〜',
];

export const en: Locale = {
  name: 'English',
  messages: {
    title: 'This is Cicumikuji!',
    error: 'An error occurred!',
    error_detail: 'Error detail:',
    lets_reload: `Let's try reloading the app...`,
    reload: 'Reload!',
    activate_shake: 'Press the button below to enable the shake gesture.',
    intro_shake:
      'Once the app has started, shake the device to tell your fortune!',
    start: 'Start!',
    enable: 'Enable',
    disable: 'Disable',
    language: 'Language:',
  },

  fortune: {
    low: 'Bad Luck!',
    little: 'Could be better',
    normal: 'As usual...',
    good: 'Lucky!',
    best: 'Very lucky!',
  },

  quotes: [
    'More mealworms!',
    `I'm itchy!`,
    `I'm hungry!`,
    'So sleepy...',
    'Mealworms!',
    'I hate everything!',
    `Don't touch me!`,
    'I hate bath!',
    'So peaceful without the humans...',
    'Mealworms are delicious!',
    'I love my futon!',
  ],
};

export const it: Locale = {
  name: 'Italiano',
  messages: {
    title: 'Ciao! Sono Cicumikuji!',
    error: 'Si è verificato un errore!',
    error_detail: `Dettaglio dell'errore:`,
    lets_reload: `Prova a ricaricare l'app...`,
    reload: 'Ricarica!',
    activate_shake:
      'Premi il buttone qui sotto per abilitare la funzionalità "scuoti per giocare".',
    intro_shake:
      'Una volta iniziato, scuoti il dispositivo per avere un nuovo responso!',
    start: 'Inizia!',
    enable: 'Abilita',
    disable: 'Disabilita',
    language: 'Lingua:',
  },
  fortune: {
    low: 'Giornata no',
    little: 'Così così',
    normal: `Va bene così`,
    good: 'Che fortuna!',
    best: 'Alla grande!',
  },
  quotes: [
    'Più vermetti!',
    'Che prurito!',
    'Ho fame!',
    'Che sonno...',
    'E i vermetti?!',
    'Odio tutti!',
    'Non mi toccare!',
    'Il bagnetto no!!!',
    'Che pace senza gli umani',
    'I vermetti sono il top!',
    `Futon, ti adoro!`,
  ],
};

export const ja: Locale = {
  name: '日本語',
  messages: {
    title: 'ちくみくじです！',
    error: 'エラー!',
    error_detail: 'エラーのメッセージ:',
    lets_reload: `アプリを再度読み込んでください`,
    reload: '再読み込み!',
    activate_shake: '下のボタンを押すと、シェイク機能が有効になります.',
    intro_shake: 'アプリの起動後、デバイスを振ると運勢を占えます',
    start: 'スタート!',
    enable: '有効にする',
    disable: '無効にする',
    language: '言語',
  },
  fortune: {
    low: '凶',
    little: '小吉',
    normal: '中吉',
    good: '吉',
    best: '大吉',
  },
  quotes: [
    '虫くれ！',
    'かゆい',
    'お腹へった',
    'ねむい〜',
    '虫まだ？',
    'だいころす！',
    '触らないで！',
    'お風呂したくない！',
    '人間がいないと最高〜',
    '虫うめぇ〜！',
    'おふとん最高〜',
  ],
};

export const db = {
  en,
  it,
  ja,
};

export type LocaleDb = typeof db;

export function inferLocale(fallback = 'en') {
  const userLanguages = (
    navigator.languages || [navigator.language]
  ).map((lang) => lang.replace(/-.+$/, ''));
  const locales = Object.keys(db);
  return userLanguages.find((l) => locales.includes(l)) ?? fallback;
}
