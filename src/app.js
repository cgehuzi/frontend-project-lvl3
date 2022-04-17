import view from './view.js';
import submit from './utils.js';

export default (state, i18nextInstance) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.rss-input'),
    submit: document.querySelector('.rss-submit'),
    feedback: document.querySelector('.rss-feedback'),
  };

  const watchedState = view(state, i18nextInstance, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.data.url = elements.input.value;
    submit(watchedState);
  });
};
