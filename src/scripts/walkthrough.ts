// Sticky feature walkthrough: as a feature's text scrolls past the middle of
// the viewport, crossfade the screenshot stack to the matching shot.
// Without JS the first feature/shot stays active, so the page still reads fine.
document.querySelectorAll<HTMLElement>('[data-walkthrough]').forEach((root) => {
  const features = [...root.querySelectorAll<HTMLElement>('[data-feature]')];
  const shots = [...root.querySelectorAll<HTMLElement>('[data-shot]')];
  if (features.length < 2 || shots.length === 0) return;

  const activate = (index: number) => {
    features.forEach((el, i) => el.classList.toggle('is-active', i === index));
    shots.forEach((el, i) => el.classList.toggle('is-active', i === index));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting)
          activate(Number((entry.target as HTMLElement).dataset.feature));
      }
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );
  features.forEach((el) => observer.observe(el));
});
