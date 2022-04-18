import axios from 'axios';
import * as yup from 'yup';
import parseRss from './parser';

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
        url: `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`,
        timeout: 10000,
      })
        .then((response) => {
          const rss = parseRss(response.data.contents);
          state.feeds = [...state.feeds, { url, ...rss.feed }];
          state.posts = [...state.posts, ...rss.posts];
          state.form.state = 'finished';
        })
        .catch((error) => {
          state.form.error = error;
          state.form.state = 'failed';
        });
    })
    .catch((err) => {
      state.form.error = err;
      state.form.valid = false;
    });
};
