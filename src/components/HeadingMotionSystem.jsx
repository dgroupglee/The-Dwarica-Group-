import { useEffect } from 'react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomWord(length) {
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

function prepareHeading(heading) {
  if (heading.dataset.motionReady === 'true') return;
  const words = heading.textContent.trim().split(/\s+/);
  heading.textContent = '';
  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.className = 'motion-word';
    span.dataset.word = word;
    span.textContent = randomWord(Math.max(word.length, 1));
    span.style.opacity = '0.08';
    span.style.filter = 'blur(4px)';
    span.style.transition = 'opacity 500ms ease, filter 500ms ease';
    heading.append(span);
    if (index < words.length - 1) heading.append(document.createTextNode(' '));
  });
  heading.dataset.motionReady = 'true';
}

function revealHeading(heading) {
  if (heading.dataset.scrambled === 'true') return;
  heading.dataset.scrambled = 'true';
  const words = [...heading.querySelectorAll('.motion-word')];
  const start = performance.now();
  const sequences = words.map((word) => ({ element: word, final: word.dataset.word, random: word.textContent }));

  words.forEach((word, index) => {
    window.setTimeout(() => {
      word.style.opacity = '1';
      word.style.filter = 'blur(0)';
    }, index * 35);
  });

  const resolve = (now) => {
    const elapsed = now - start;
    sequences.forEach(({ element, final, random }, index) => {
      const progress = Math.min(Math.max((elapsed - index * 35) / 500, 0), 1);
      const visibleLength = Math.floor(final.length * progress);
      element.textContent = final.slice(0, visibleLength) + random.slice(visibleLength);
    });
    if (sequences.some((_, index) => elapsed < index * 35 + 500)) requestAnimationFrame(resolve);
    else sequences.forEach(({ element, final }) => { element.textContent = final; });
  };
  requestAnimationFrame(resolve);
}

export default function HeadingMotionSystem() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) revealHeading(entry.target); });
    }, { threshold: 0.2 });
    const scan = () => {
      [...document.querySelectorAll('.hero-heading')].forEach((heading) => {
        prepareHeading(heading);
        observer.observe(heading);
      });
    };
    scan();
    const routeObserver = new MutationObserver(scan);
    routeObserver.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); routeObserver.disconnect(); };
  }, []);

  return null;
}
