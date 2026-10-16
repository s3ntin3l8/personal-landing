// Screen-recording loops: play while on screen, pause when not. Each has a
// pause toggle; once paused by hand a loop stays paused. With reduced motion
// they never autoplay and the toggle starts them instead.
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const loops = [
  ...document.querySelectorAll<HTMLVideoElement>('video[data-loop]'),
].map((video) => ({
  video,
  button:
    video.parentElement?.querySelector<HTMLButtonElement>('[data-loop-toggle]'),
  visible: false,
  heldByUser: false,
}));

function render(loop: (typeof loops)[number]) {
  const playing = !loop.video.paused;
  const state = loop.button?.querySelector('[data-loop-state]');
  if (state) state.textContent = playing ? 'Pause' : 'Play';
}

function sync(loop: (typeof loops)[number]) {
  const shouldPlay = loop.visible && !loop.heldByUser && !motion.matches;
  if (shouldPlay && loop.video.paused) loop.video.play().catch(() => {});
  else if (!shouldPlay && !loop.video.paused) loop.video.pause();
}

if (loops.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const loop = loops.find((l) => l.video === entry.target);
        if (!loop) continue;
        loop.visible = entry.isIntersecting;
        if (!loop.visible) loop.video.pause();
        else sync(loop);
      }
    },
    { threshold: 0.4 },
  );

  for (const loop of loops) {
    observer.observe(loop.video);
    loop.video.addEventListener('play', () => render(loop));
    loop.video.addEventListener('pause', () => render(loop));
    loop.button?.addEventListener('click', () => {
      if (loop.video.paused) {
        loop.heldByUser = false;
        loop.video.play().catch(() => {});
      } else {
        loop.heldByUser = true;
        loop.video.pause();
      }
    });
    render(loop);
  }

  // Follow the OS setting live, not only at page load.
  motion.addEventListener('change', () => loops.forEach(sync));
}
