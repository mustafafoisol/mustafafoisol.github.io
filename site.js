(() => {
  const content = window.siteContent;
  if (!content) return;

  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
  };
  const usableUrl = (value) => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const parsed = new URL(value, window.location.href);
      return ['http:', 'https:', 'file:'].includes(parsed.protocol) ? value : '';
    } catch {
      return '';
    }
  };
  const appendTitle = (container, item) => {
    const url = usableUrl(item.url);
    const label = document.createElement(url ? 'a' : 'span');
    label.textContent = item.title;
    if (url) label.href = url;
    container.append(label);
  };

  if (content.building) setText('[data-building-title]', content.building.title || '');
  if (content.teaching) {
    document.querySelectorAll('[data-teaching-title]').forEach((node) => {
      node.replaceChildren();
      appendTitle(node, content.teaching);
    });
  }
  const learning = Array.isArray(content.learning) ? content.learning : [];
  const learningSummary = document.querySelector('[data-learning-summary]');
  if (learningSummary) {
    learningSummary.replaceChildren();
    learning.slice(0, 3).forEach((item, index) => {
      if (index) learningSummary.append(document.createTextNode(' · '));
      appendTitle(learningSummary, { title: item.title, url: item.url });
    });
  }

  const recents = Array.isArray(content.recents) ? content.recents : [];
  const topList = document.querySelector('[data-recent-top]');
  const olderList = document.querySelector('[data-recent-more]');
  const addUpdates = (list, updates) => {
    if (!list) return;
    list.replaceChildren();
    updates.forEach((update) => {
      const row = document.createElement('li');
      row.textContent = update;
      list.append(row);
    });
  };
  addUpdates(topList, recents.slice(0, 3));
  addUpdates(olderList, recents.slice(3));
  const moreUpdates = document.querySelector('.more-updates');
  if (moreUpdates) moreUpdates.hidden = recents.length <= 3;

  const stories = Array.isArray(content.stories) ? content.stories : [];
  const storyList = document.querySelector('[data-story-list]');
  const dialogBox = document.querySelector('[data-story-dialogs]');
  if (storyList && dialogBox) {
    storyList.replaceChildren();
    dialogBox.replaceChildren();
    stories.forEach((story, index) => {
      const id = 'story-' + (index + 1);
      const row = document.createElement('li');
      const button = document.createElement('button');
      button.className = 'story-trigger';
      button.type = 'button';
      button.textContent = story.title;
      row.append(button);
      storyList.append(row);

      const dialog = document.createElement('dialog');
      dialog.className = 'story-dialog';
      dialog.setAttribute('aria-labelledby', id + '-title');
      const title = document.createElement('h2');
      title.id = id + '-title';
      title.textContent = story.title;
      const happened = document.createElement('p');
      happened.textContent = story.happened || '';
      const learned = document.createElement('p');
      learned.textContent = story.learned || '';
      const closeForm = document.createElement('form');
      closeForm.method = 'dialog';
      const close = document.createElement('button');
      close.className = 'dialog-close';
      close.type = 'submit';
      close.textContent = 'Close';
      closeForm.append(close);
      dialog.append(title, happened, learned, closeForm);
      dialogBox.append(dialog);
      button.addEventListener('click', () => dialog.showModal());
    });
  }
})();
