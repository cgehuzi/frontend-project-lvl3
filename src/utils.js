import axios from 'axios';
import * as yup from 'yup';
import _ from 'lodash';
import parseRss from './parser.js';

const proxyUrl = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
const timeoutPeriod = 5000;
let timeoutID;

const checkNewPosts = (state) => {
  state.feeds.forEach((feed) => {
    const stateFeedPosts = state.posts
      .filter((post) => feed.rss === post.rss)
      .map((post) => ({ ...post, isRead: false }));

    axios({
      method: 'get',
      url: `${proxyUrl}${feed.rss}`,
      timeout: 10000,
    })
      .then((response) => {
        const { posts } = parseRss(response.data.contents, feed.rss);
        const newFeedPosts = _.differenceWith(posts, stateFeedPosts, _.isEqual);

        if (newFeedPosts.length > 0) {
          state.posts = [...newFeedPosts, ...state.posts];
        }

        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => checkNewPosts(state), timeoutPeriod);
      })
      .catch((error) => {
        state.form.error = error;
        state.form.state = 'failed';

        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => checkNewPosts(state), timeoutPeriod);
      });
  });
};

export default (state) => {
  state.form.valid = null;

  const { url } = state.form.data;
  const rssUrls = state.feeds.map((feed) => feed.rss);
  const schema = yup
    .string()
    .required('error.required')
    .url('error.url')
    .notOneOf(rssUrls, 'error.notOneOf');

  schema
    .validate(url)
    .then(() => {
      state.form.error = null;
      state.form.valid = true;

      state.form.state = 'processing';
      axios({
        method: 'get',
        url: `${proxyUrl}${url}`,
        timeout: 1000,
      })
        .then((response) => {
          const rss = parseRss(response.data.contents, url);
          state.feeds = [rss.feed, ...state.feeds];
          state.posts = [...rss.posts, ...state.posts];
          state.form.state = 'finished';

          clearTimeout(timeoutID);
          timeoutID = setTimeout(() => checkNewPosts(state), timeoutPeriod);
        })
        .catch((error) => {
          state.form.error = error.response ? error : new Error('error.network');
          state.form.state = 'failed';
        });
    })
    .catch((error) => {
      state.form.error = error;
      state.form.valid = false;
    });
};
