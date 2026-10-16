// Top nav: underline the link of the section crossing the middle of the
// viewport. Without JS the links are plain anchors.
const links = new Map<string, HTMLElement>();
document
  .querySelectorAll<HTMLElement>('[data-nav]')
  .forEach((el) => links.set(el.dataset.nav!, el));

if (links.size > 0) {
  let active: string | null = null;
  const observer = new IntersectionObserver(
    (entries) => {
      let next = active;
      for (const entry of entries) {
        const id = entry.target.id;
        if (entry.isIntersecting) next = id;
        // Leaving without a successor (e.g. back up into the hero) clears it.
        else if (id === next) next = null;
      }
      if (next === active) return;
      if (active) links.get(active)?.removeAttribute('aria-current');
      if (next) links.get(next)?.setAttribute('aria-current', 'true');
      active = next;
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}
