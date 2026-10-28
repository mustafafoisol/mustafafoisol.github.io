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
  const courseUrl = (courseId, page = 'course') => `${page}.html?course=${encodeURIComponent(courseId)}`;
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
  const isSchedule = main.dataset.coursePage === 'schedule';
  document.title = `${course.title}${isSchedule ? ' schedule' : ''} · ${course.term} — Sheikh Mostofa Amir Foisol`;
  main.replaceChildren();
  const breadcrumb = element('p', '', 'breadcrumb');
  breadcrumb.append(link('Teaching', 'teaching.html'), ' / ', link(course.term, 'teaching.html#fall-2026'));
  if (isSchedule) breadcrumb.append(' / ', link(course.title, courseUrl(id)));
  main.append(breadcrumb, element('h1', course.title), element('p', course.term, 'muted'));
  const nav = element('nav', '', 'course-nav');
  nav.setAttribute('aria-label', 'Course navigation');
  const overviewLink = link('Overview', courseUrl(id));
  const scheduleLink = link('Schedule & materials', courseUrl(id, 'schedule'));
  (isSchedule ? scheduleLink : overviewLink).setAttribute('aria-current', 'page');
  nav.append(overviewLink, scheduleLink);
  main.append(nav);

  const section = (heading) => {
    const node = element('section', '', 'plain-section');
    node.append(element('h2', heading));
    main.append(node);
    return node;
  };
  if (!isSchedule) main.append(element('p', course.description));
  const channels = section('Course channels');
  channels.append(element('p', 'Join the course conversation on Slack or Discord.'));
  [['Slack', course.slackUrl], ['Discord', course.discordUrl]].forEach(([name, url]) => {
    const row = element('div', '', 'material-row');
    row.append(element('span', name));
    row.append(usableUrl(url) ? link(`Join ${name} channel`, url) : element('span', 'Link coming soon', 'muted'));
    channels.append(row);
  });
  if (!isSchedule) {
    const schedule = section('Schedule & materials');
    schedule.append(element('p', 'Find session dates, topics, lecture materials, and practice materials on the course schedule.'));
    schedule.append(link('View schedule & materials →', courseUrl(id, 'schedule')));
    const related = courses[course.relatedCourse];
    if (related) section('Related course').append(link(related.title, courseUrl(course.relatedCourse)));
    return;
  }

  const schedule = section('Schedule & materials');
  schedule.append(element('p', 'Dates and materials will be added here as they become available.', 'muted'));
  const wrapper = element('div', '', 'schedule-scroll');
  wrapper.tabIndex = 0;
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Course schedule; scroll horizontally on small screens');
  const table = element('table', '', 'schedule-table');
  table.append(element('caption', `${course.title} · ${course.term}`));
  const head = element('thead');
  const headerRow = element('tr');
  ['Date', 'Topic', 'Lecture materials', 'Practice materials'].forEach((label) => {
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
  if (!sessions.length) {
    const row = element('tr');
    row.append(element('td', 'To be announced', 'muted'), element('td', 'Topics will be announced', 'muted'), materialsCell([]), materialsCell([]));
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
    row.append(dateCell, element('td', session.topic || 'Topic to be announced'), materialsCell(session.lectureMaterials), materialsCell(session.practiceMaterials));
    body.append(row);
  });
  table.append(head, body);
  wrapper.append(table);
  schedule.append(wrapper);
})();
