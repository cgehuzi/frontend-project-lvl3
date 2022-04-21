import view from './view.js';
import submit from './utils.js';

export default (state, i18nextInstance) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.rss-input'),
    submit: document.querySelector('.rss-submit'),
    feedback: document.querySelector('.rss-feedback'),
    feedsWrap: document.querySelector('.rss-feeds'),
    postsWrap: document.querySelector('.rss-posts'),
    modal: document.querySelector('.rss-modal'),
    modalDetails: document.querySelector('.rss-modal-details'),
    modalLink: document.querySelector('.rss-modal-link'),
  };

  const staticHtml = {
    title: document.querySelector('.static-title'),
    subtitle: document.querySelector('.static-subtitle'),
    label: document.querySelector('.static-label'),
    example: document.querySelector('.static-example'),
    submit: document.querySelector('.static-submit'),
    modalTitle: document.querySelector('.static-modal-title'),
    modalLink: document.querySelector('.static-modal-link'),
  };

  document.body.parentElement.lang = i18nextInstance.language;
  document.title = i18nextInstance.t('static.title');
  staticHtml.title.textContent = i18nextInstance.t('static.title');
  staticHtml.subtitle.textContent = i18nextInstance.t('static.subtitle');
  staticHtml.label.textContent = i18nextInstance.t('static.label');
  staticHtml.example.textContent = i18nextInstance.t('static.example');
  staticHtml.submit.textContent = i18nextInstance.t('static.submit');
  staticHtml.modalTitle.textContent = i18nextInstance.t('static.modalTitle');
  staticHtml.modalLink.textContent = i18nextInstance.t('static.modalLink');

  const watchedState = view(state, i18nextInstance, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.data.url = elements.input.value;
    submit(watchedState);
  });
};
