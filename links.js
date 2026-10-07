(() => {
  const siteRoot = new URL('.', new URL('links.js', document.baseURI));
  document.querySelectorAll('a[href]').forEach((link) => {
    let destination;
    try { destination = new URL(link.getAttribute('href'), document.baseURI); }
    catch { return; }
    const onThisSite = destination.origin === siteRoot.origin && destination.pathname.startsWith(siteRoot.pathname);
    const webLink = destination.protocol === 'http:' || destination.protocol === 'https:';
    if (webLink && !onThisSite) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else if (onThisSite) {
      link.removeAttribute('target');
    }
  });
})();
