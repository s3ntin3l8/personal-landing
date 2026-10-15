// Index rail: mark the section that crosses the middle of the viewport.
const links = new Map<string, HTMLElement>();
document
  .querySelectorAll<HTMLElement>('[data-rail]')
  .forEach((el) => links.set(el.dataset.rail!, el));

if (links.size > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((el, id) =>
          el.setAttribute('aria-current', String(id === entry.target.id)),
        );
      }
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}
