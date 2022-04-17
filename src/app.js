import watch from './view.js';
import validation from './utils.js';

export default () => {
  const state = {
    form: {
      state: 'filling',
      valid: true,
      error: null,
      success: {
        message: 'RSS uploaded successfully',
      },
    },
    feeds: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.rss-input'),
    submit: document.querySelector('.rss-submit'),
    feedback: document.querySelector('.rss-feedback'),
  };

  const watchedState = watch(state, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    validation(watchedState, elements);
  });
};
