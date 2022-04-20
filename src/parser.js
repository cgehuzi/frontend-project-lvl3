import objectHash from 'object-hash';

const getPosts = (rss, feed) => {
  const items = feed.querySelectorAll('item');

  return Array.from(items).map((item) => {
    const link = item.querySelector('link').textContent;
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;

    const post = {
      rss,
      link,
      title,
      description,
      isRead: false,
    };
    const id = objectHash(post);

    return { id, ...post };
  });
};

export default (data, rss) => {
  const parser = new DOMParser();
  const feed = parser.parseFromString(data, 'application/xml');

  if (feed.querySelector('parsererror') !== null) {
    throw new Error('error.notRss');
  }

  const link = feed.querySelector('channel > link').textContent;
  const title = feed.querySelector('channel > title').textContent;
  const description = feed.querySelector('channel > description').textContent;
  const posts = getPosts(rss, feed);

  return {
    feed: {
      rss,
      link,
      title,
      description,
    },
    posts,
  };
};
