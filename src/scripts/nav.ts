// Top nav: underline the link of the section crossing the middle of the
// viewport. Without JS the links are plain anchors.
const links = new Map<string, HTMLElement>();
document
  .querySelectorAll<HTMLElement>('[data-nav]')
  .forEach((el) => links.set(el.dataset.nav!, el));

if (links.size > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((el, id) => {
          if (id === entry.target.id) el.setAttribute('aria-current', 'true');
          else el.removeAttribute('aria-current');
        });
      }
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}
