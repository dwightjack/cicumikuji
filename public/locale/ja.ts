import { Locale } from '../shared/types';

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
