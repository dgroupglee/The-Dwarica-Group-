import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';


const words = ['We', 'are', 'not', 'waiting', 'for', 'the', 'right', 'moment.', 'We', 'are', 'building', 'it.'];

export default function ManifestoSection() {
  const root = useRef(null);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.manifesto-line path',
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', scrollTrigger: { trigger: root.current, start: 'top 75%' } }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" ref={root} className="manifesto-section">
      <div className="manifesto-inner">
        <p className="manifesto-text" aria-label="We are not waiting for the right moment. We are building it.">
          {words.map((word, index) => (
            <span key={word + index} className="manifesto-word">{word}&nbsp;</span>
          ))}
        </p>
        <svg className="manifesto-line" viewBox="0 0 100 1" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0.5H100" pathLength="1" />
        </svg>
        <button type="button" className="manifesto-toggle" aria-expanded={expanded} onClick={() => setExpanded((current) => !current)}>
          <span>{expanded ? 'Close the statement' : 'Read the conviction'}</span>
          <span aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
        {expanded ? <div className="manifesto-detail"><strong>Seven strategies, one operating standard.</strong><p>The Dwarica Group brings the same principal attention to real assets, operating businesses, liquid markets, luxury inventory, and creative infrastructure. The system is designed to make each allocation more informed by the others.</p><a href="#capital-desk">Continue to the Allocation Desk →</a></div> : null}
      </div>
    </section>
  );
}
