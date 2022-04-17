import i18next from 'i18next';
import resources from './locales/index.js';
import app from './app.js';

export default () => {
  const state = {
    form: {
      state: 'filling',
      valid: null,
      error: null,
      data: {
        url: '',
      },
    },
    feeds: [],
  };

  const i18nextInstance = i18next.createInstance();

  return i18nextInstance.init({ lng: 'en', resources }, () => {
    app(state, i18nextInstance);
  });
};
