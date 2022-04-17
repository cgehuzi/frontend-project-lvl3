import onChange from 'on-change';

export default (state, i18nextInstance, elements) => {
  const disableSubmit = (disabled) => {
    elements.input.readOnly = disabled;
    elements.submit.disabled = disabled;
  };

  const showError = () => {
    elements.feedback.classList.add('d-block', 'invalid-feedback');
    elements.feedback.textContent = i18nextInstance.t(state.form.error.message);
    if (state.form.valid === false) {
      elements.input.classList.add('is-invalid');
    }
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
        case 'filling':
          disableSubmit(false);
          break;

        case 'processing':
          disableSubmit(true);
          break;

        case 'finished':
          disableSubmit(false);
          showSuccess();
          resetForm();
          break;

        case 'failed':
          disableSubmit(false);
          showError();
          break;

        default:
          disableSubmit(false);
          break;
      }
    }

    if (path === 'form.valid') {
      switch (value) {
        case false:
          showError();
          break;

        default:
          hideFeedback();
          break;
      }
    }
  });

  return watchedState;
};
