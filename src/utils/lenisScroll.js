import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initLenis() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.refresh();
  return null;
}
