(() => {
  const main = document.querySelector('[data-course-page]');
  if (!main) return;
  const courses = window.courseContent || {};
  const id = new URLSearchParams(window.location.search).get('course');
  if (!id) return;
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const link = (text, href) => {
    const node = element('a', text);
    node.href = href;
    return node;
  };
  const usableUrl = (value) => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const parsed = new URL(value, document.baseURI);
      return ['https:', 'http:', 'file:'].includes(parsed.protocol) ? value : '';
    } catch { return ''; }
  };
  if (!Object.hasOwn(courses, id)) {
    document.title = 'Course not found — Sheikh Mostofa Amir Foisol';
    main.replaceChildren(element('h1', 'Course not found'), link('Browse Fall 2026 courses', 'teaching.html#fall-2026'));
    return;
  }
  const course = courses[id];
  document.title = `${course.title} · ${course.term} — Sheikh Mostofa Amir Foisol`;
  main.replaceChildren();
  main.append(element('h1', course.title));

  const channel = course.channel || {};
  const channelName = ['Slack', 'Discord'].includes(channel.platform) ? `${channel.platform} channel` : 'Course channel';
  const channelLine = element('p', '', 'course-channel');
  channelLine.append(usableUrl(channel.url) ? link(channelName, channel.url) : element('span', `${channelName} link coming soon`, 'muted'));
  main.append(channelLine);

  const schedule = element('section', '', 'course-schedule');
  const scheduleTitle = element('h2', 'Schedule and materials');
  scheduleTitle.id = 'schedule-title';
  schedule.setAttribute('aria-labelledby', scheduleTitle.id);
  schedule.append(scheduleTitle);
  main.append(schedule);
  const wrapper = element('div', '', 'schedule-scroll');
  wrapper.tabIndex = 0;
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Course schedule; scroll horizontally on small screens');
  const table = element('table', '', 'schedule-table');
  table.setAttribute('aria-labelledby', scheduleTitle.id);
  const head = element('thead');
  const headerRow = element('tr');
  ['Date', 'Lecture material', 'Actions'].forEach((label) => {
    const cell = element('th', label);
    cell.scope = 'col';
    headerRow.append(cell);
  });
  head.append(headerRow);
  const body = element('tbody');
  const sessions = Array.isArray(course.schedule) ? course.schedule : [];
  const materialsCell = (materials) => {
    const cell = element('td');
    if (!Array.isArray(materials) || !materials.length) {
      cell.append(element('span', 'Coming soon', 'muted'));
      return cell;
    }
    const list = element('ul', '', 'resource-list');
    materials.forEach((material) => {
      const item = element('li');
      item.append(usableUrl(material.url) ? link(material.title || 'View material', material.url) : element('span', `${material.title || 'Material'} — coming soon`, 'muted'));
      list.append(item);
    });
    cell.append(list);
    return cell;
  };
  const actionsCell = (actions) => {
    const cell = element('td');
    if (!Array.isArray(actions) || !actions.length) {
      cell.append(element('span', 'No reminders yet', 'muted'));
      return cell;
    }
    const list = element('ul', '', 'action-list');
    actions.forEach((action) => {
      const item = element('li');
      const text = typeof action === 'string' ? action : action.text;
      item.append(usableUrl(action.url) ? link(text, action.url) : element('span', text));
      list.append(item);
    });
    cell.append(list);
    return cell;
  };
  if (!sessions.length) {
    const row = element('tr');
    row.append(element('td', 'To be announced', 'muted'), materialsCell([]), actionsCell([]));
    body.append(row);
  }
  sessions.forEach((session) => {
    const row = element('tr');
    const dateCell = element('td');
    // Keep dates as written; avoid timezone shifts when displaying ISO dates.
    if (/^\d{4}-\d{2}-\d{2}$/.test(session.date || '')) {
      const date = element('time', session.date);
      date.dateTime = session.date;
      dateCell.append(date);
    } else dateCell.append(element('span', session.date || 'To be announced', 'muted'));
    row.append(dateCell, materialsCell(session.lectureMaterials), actionsCell(session.actions));
    body.append(row);
  });
  table.append(head, body);
  wrapper.append(table);
  schedule.append(wrapper);
})();
