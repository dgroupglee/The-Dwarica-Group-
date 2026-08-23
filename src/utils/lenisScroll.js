import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initLenis() {
  if (typeof window === 'undefined') return () => undefined;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    ScrollTrigger.config({ ignoreMobileResize: true });
    ScrollTrigger.refresh();
    return () => undefined;
  }

  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.085,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.05,
  });

  const updateScrollTrigger = () => ScrollTrigger.update();
  let frameId = 0;
  const raf = (time) => {
    lenis.raf(time);
    frameId = window.requestAnimationFrame(raf);
  };

  lenis.on('scroll', updateScrollTrigger);
  document.documentElement.classList.add('lenis', 'lenis-smooth');
  ScrollTrigger.config({ ignoreMobileResize: true });
  frameId = window.requestAnimationFrame(raf);
  const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 80);

  return () => {
    window.cancelAnimationFrame(frameId);
    window.clearTimeout(refreshId);
    lenis.off('scroll', updateScrollTrigger);
    lenis.destroy();
    document.documentElement.classList.remove('lenis', 'lenis-smooth');
  };
}
