import onChange from 'on-change';

export default (state, i18nextInstance, elements) => {
  const showError = () => {
    elements.feedback.classList.add('d-block', 'invalid-feedback');
    elements.feedback.textContent = i18nextInstance.t(state.form.error.message);
    elements.input.classList.add('is-invalid');
  };

  const showSuccess = () => {
    elements.feedback.classList.add('d-block');
    elements.feedback.textContent = i18nextInstance.t('success');
  };

  const hideFeedback = () => {
    elements.feedback.classList.remove('d-block', 'invalid-feedback');
    elements.input.classList.remove('is-invalid');
  };

  const resetForm = () => {
    elements.input.value = '';
    elements.input.focus();
  };

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.state') {
      switch (value) {
        case 'invalid':
          showError();
          break;

        case 'valid':
          hideFeedback();
          break;

        case 'filling':
          resetForm();
          break;

        default:
          break;
      }
    }
    if (path === 'feeds') {
      showSuccess();
    }
  });

  return watchedState;
};
