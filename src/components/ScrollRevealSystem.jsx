import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function ScrollRevealSystem() {
  useEffect(() => {
    const wordObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        wordObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.hero-word, .manifesto-word').forEach((word, index) => {
      word.style.setProperty('--word-delay', `${Math.min(index * 35, 420)}ms`);
      wordObserver.observe(word);
    });

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray('.animate-in, .identity-theses > div, .principal-card, .join-panel, .investor-pitch-copy');
      cards.forEach((card, index) => {
        gsap.fromTo(card, { opacity: 0, y: 60, scale: 0.95, rotateX: 8 }, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
    });
    return () => { wordObserver.disconnect(); context.revert(); };
  }, []);

  return null;
}
