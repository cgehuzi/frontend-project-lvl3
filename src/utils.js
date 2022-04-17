import axios from 'axios';
import * as yup from 'yup';

const proxy = 'https://allorigins.hexlet.app/get?url=';

export default (state) => {
  state.form.valid = null;

  const { url } = state.form.data;
  const feedUrls = state.feeds.map((feed) => feed.url);
  const schema = yup
    .string()
    .required('error.required')
    .url('error.url')
    .notOneOf(feedUrls, 'error.notOneOf');

  schema
    .validate(url)
    .then(() => {
      state.form.error = null;
      state.form.valid = true;

      state.form.state = 'processing';
      axios({
        method: 'get',
        url: `${proxy}${url}`,
        timeout: 10000,
      })
        .then((response) => {
          // handle success
          console.log(response);
          state.feeds = [...state.feeds, { url }];
          state.form.state = 'finished';
        })
        .catch((error) => {
          // handle error
          console.log(error);
          state.form.error = error;
          state.form.state = 'failed';
        });
    })
    .catch((err) => {
      state.form.error = err;
      state.form.valid = false;
    });
};
