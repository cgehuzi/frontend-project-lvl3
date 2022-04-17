import onChange from 'on-change';

const showError = (state, elements) => {
  elements.feedback.classList.add('d-block', 'invalid-feedback');
  elements.feedback.textContent = state.form.error.message;
  elements.input.classList.add('is-invalid');
};

const showSuccess = (state, elements) => {
  elements.feedback.classList.add('d-block');
  elements.feedback.textContent = state.form.success.message;
};

const hideFeedback = (elements) => {
  elements.feedback.classList.remove('d-block', 'invalid-feedback');
  elements.input.classList.remove('is-invalid');
};

const resetForm = (elements) => {
  elements.input.value = '';
  elements.input.focus();
};

export default (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.state') {
      switch (value) {
        case 'invalid':
          showError(state, elements);
          break;

        case 'valid':
          hideFeedback(elements);
          break;

        case 'filling':
          resetForm(elements);
          break;

        default:
          break;
      }
    }
    if (path === 'feeds') {
      showSuccess(state, elements);
    }
  });

  return watchedState;
};
