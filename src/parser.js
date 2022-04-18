import { nanoid } from 'nanoid';

const getPosts = (feedId, feed) => {
  const items = feed.querySelectorAll('item');

  return Array.from(items).map((item) => {
    const id = nanoid();
    const link = item.querySelector('link').textContent;
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;

    return {
      feedId,
      id,
      link,
      title,
      description,
    };
  });
};

export default (data) => {
  const parser = new DOMParser();
  const feed = parser.parseFromString(data, 'application/xml');

  if (feed.querySelector('parsererror') !== null) {
    throw new Error('error.notRss');
  }

  const id = nanoid();
  const link = feed.querySelector('channel > link').textContent;
  const title = feed.querySelector('channel > title').textContent;
  const description = feed.querySelector('channel > description').textContent;
  const posts = getPosts(id, feed);

  return {
    feed: {
      id,
      link,
      title,
      description,
    },
    posts,
  };
};
