import * as yup from 'yup';

const validation = (state, elements) => {
  const feedUrls = state.feeds.map((feed) => feed.url);
  const schema = yup
    .string()
    .required('error.required')
    .url('error.url')
    .notOneOf(feedUrls, 'error.notOneOf');

  state.form.state = 'processing';

  schema
    .validate(elements.input.value)
    .then(() => {
      state.form.error = null;
      state.form.state = 'valid';

      state.feeds = [...state.feeds, { url: elements.input.value }];
      state.form.state = 'filling';
    })
    .catch((err) => {
      state.form.error = err;
      state.form.state = 'invalid';
    });
};

export default validation;
