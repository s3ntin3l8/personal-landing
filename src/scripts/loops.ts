// Screen-recording loops: play while on screen, pause when not. With reduced
// motion they never autoplay; the poster shows and native controls appear.
const loops = [
  ...document.querySelectorAll<HTMLVideoElement>('video[data-loop]'),
];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduced) {
  loops.forEach((video) => (video.controls = true));
} else if (loops.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }
    },
    { threshold: 0.4 },
  );
  loops.forEach((video) => observer.observe(video));
}
