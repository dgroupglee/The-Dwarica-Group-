import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';


const paths = [
  ['INVEST', 'Bring a mandate, a strategic opportunity, or a capital requirement and begin a direct principal conversation.'],
  ['OPERATE', 'Present an operating business, property deal, or platform opportunity with the discipline to scale with the firm.'],
  ['PLACE', 'Route an in-hand asset, private inventory, or discreet placement opportunity into a clear and confidential review path.'],
];

export default function JoinFirmSection() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => gsap.fromTo('.join-panel', { opacity: 0, x: (index) => index === 0 ? -80 : index === 2 ? 80 : 0, y: (index) => index === 1 ? 80 : 0, rotate: (index) => index === 1 ? 2 : 0 }, { opacity: 1, x: 0, y: 0, rotate: 0, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center center', scrub: 1 } }), root);
    return () => ctx.revert();
  }, []);
  return <section ref={root} id="join-firm" className="join-section"><div className="section-frame"><span className="section-kicker">Join the firm</span><h2 className="section-title">Private opportunity begins with a precise introduction.</h2><p className="join-intro">The Dwarica Group is built for serious conversations with principals, operators, and asset holders who are evaluating a meaningful opportunity. Whether the need is capital, operating partnership, or discreet placement, the entry point is a direct, structured inquiry that reflects the seriousness of the mandate.</p><div className="join-grid">{paths.map(([label, copy]) => <article className="join-panel" key={label}><span>{label}</span><p>{copy}</p></article>)}</div></div></section>;
}
