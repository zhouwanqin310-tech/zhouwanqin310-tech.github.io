document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
const languageLink = document.querySelector('[data-language-switch]');
if (languageLink) {
  // A language switch on the homepage preserves its current section anchor.
  const updateLanguageLink = () => {
    const target = new URL(languageLink.href);
    if (['/', '/en/'].includes(location.pathname) && ['/', '/en/'].includes(target.pathname)) {
      target.hash = location.hash;
      languageLink.href = target.pathname + target.hash;
    }
  };
  updateLanguageLink();
  window.addEventListener('hashchange', updateLanguageLink);
}
