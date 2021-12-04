import { Locale } from '../shared/types';

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
    follow_me: 'Follow me!',
    update: 'Update',
    updating: 'Updating...',
    update_txt: 'Application update available.',
    play_video: 'Play video',
    pause_video: 'Pause video',
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
