import axios from 'axios';
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

      state.form.state = 'processing';
      axios
        .get('https://lorem-rss.herokuapp.com/feed?unit=second&interval=5')
        .then(function (response) {
          // handle success
          console.log(response);
          state.form.state = 'filling';
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          state.form.error = error;
          state.form.state = 'invalid';
        });

      state.feeds = [...state.feeds, { url: elements.input.value }];
    })
    .catch((err) => {
      state.form.error = err;
      state.form.state = 'invalid';
    });
};

export default validation;
