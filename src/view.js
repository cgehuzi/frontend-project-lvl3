import onChange from 'on-change';
import _ from 'lodash';

export default (state, i18nextInstance, elements) => {
  let watchedState;

  const disableSubmit = (disabled) => {
    elements.input.readOnly = disabled;
    elements.submit.disabled = disabled;
  };

  const showError = () => {
    elements.feedback.classList.add('invalid-feedback');
    elements.feedback.textContent = i18nextInstance.t(state.form.error.message);
    if (state.form.valid === false) {
      elements.input.classList.add('is-invalid');
    }
  };

  const showSuccess = () => {
    elements.feedback.classList.add('valid-feedback');
    elements.feedback.textContent = i18nextInstance.t('success');
  };

  const hideFeedback = () => {
    elements.feedback.classList.remove('valid-feedback', 'invalid-feedback');
    elements.feedback.innerHTML = '&nbsp;';
    elements.input.classList.remove('is-invalid');
  };

  const resetForm = () => {
    elements.input.value = '';
    elements.input.focus();
  };

  const createCard = (title) => {
    const card = document.createElement('section');
    card.classList.add('card', 'border-0');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h2');
    cardTitle.classList.add('cadr-title', 'h4');

    cardTitle.textContent = i18nextInstance.t(title);
    cardBody.append(cardTitle);
    card.append(cardBody);

    return card;
  };

  const renderFeeds = () => {
    const card = createCard('feeds');

    const list = document.createElement('ul');
    list.classList.add('list-group', 'border-0', 'rounded-0');

    state.feeds.forEach((feed) => {
      const item = document.createElement('li');
      item.classList.add('list-group-item', 'border-0');

      const title = document.createElement('h3');
      title.classList.add('h6', 'm-0');
      title.textContent = feed.title;

      const description = document.createElement('p');
      description.classList.add('mt-2', 'mb-0', 'small', 'text-black-50', 'lh-sm');
      description.textContent = feed.description;

      const link = document.createElement('a');
      link.classList.add('small', 'fw-bold');
      link.href = feed.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = i18nextInstance.t('toSource');

      item.append(title, description, link);
      list.append(item);
    });

    card.append(list);
    elements.feedsWrap.innerHTML = '';
    elements.feedsWrap.append(card);
  };

  const markAsRead = (id) => {
    const post = _.find(watchedState.posts, { id });
    post.isRead = true;
  };

  const showDetails = (id) => {
    const post = _.find(state.posts, { id });

    const title = document.createElement('h5');
    title.textContent = post.title;

    const description = document.createElement('p');
    description.classList.add('small', 'text-break');
    description.textContent = post.description;

    elements.modalDetails.innerHTML = '';
    elements.modalDetails.append(title, description);
    elements.modalLink.href = post.link;
  };

  const renderPosts = () => {
    const card = createCard('posts');

    const list = document.createElement('ul');
    list.classList.add('list-group', 'border-0', 'rounded-0');

    state.posts.forEach((post) => {
      const item = document.createElement('li');
      item.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-baseline',
        'border-0',
      );

      const link = document.createElement('a');
      if (post.isRead) {
        link.classList.add('fw-regular', 'link-secondary');
      } else {
        link.classList.add('fw-bold');
      }
      link.href = post.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = post.title;
      link.addEventListener('click', () => {
        markAsRead(post.id);
      });

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-dark', 'btn-sm', 'ms-4');
      button.type = 'button';
      button.dataset.bsToggle = 'modal';
      button.dataset.bsTarget = '.rss-modal';
      button.textContent = i18nextInstance.t('details');
      button.addEventListener('click', () => {
        showDetails(post.id);
        markAsRead(post.id);
      });

      item.append(link, button);
      list.append(item);
    });

    card.append(list);
    elements.postsWrap.innerHTML = '';
    elements.postsWrap.append(card);
  };

  watchedState = onChange(state, (path, value) => {
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

    if (path.match(/feeds/)) {
      renderFeeds();
    }

    if (path.match(/posts/)) {
      renderPosts();
    }
  });

  return watchedState;
};
