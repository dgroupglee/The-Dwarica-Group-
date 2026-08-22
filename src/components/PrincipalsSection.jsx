import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';


const principals = [
  { initial: 'W', name: 'William Dwarica', role: 'Co-Founding Managing Principal / Chief Executive & Deal Architect', copy: 'William leads the firm’s strategic architecture across acquisitions, real estate, private ownership, and operational roll-ups. His role is to identify where capital can become durable value, then shape the structure, execution path, and long-term platform logic around that opportunity.' },
  { initial: 'D', name: 'Dion Dwarica', role: 'Co-Founding Managing Principal / Chief Investment Officer', copy: 'Dion leads the firm’s market intelligence, risk lens, and capital deployment tempo across liquid markets, alternative assets, and monetization channels. He connects operational awareness with market timing so the platform can move decisively without losing discipline.' },
];

export default function PrincipalsSection() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => gsap.fromTo('.principal-card', { opacity: 0, rotateY: 12, z: -180 }, { opacity: 1, rotateY: 0, z: 0, stagger: 0.18, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center center', scrub: 1 } }), root);
    return () => ctx.revert();
  }, []);
  return <section ref={root} id="principals" className="principals-section"><div className="section-frame"><span className="section-kicker">Principal leadership / dual-principal engine</span><h2 className="section-title">Two mandates. One operating standard.</h2><p className="principals-intro">The firm is led by two principals with different but complementary mandates: one focused on deal architecture, operating expansion, and acquisition execution; the other focused on market intelligence, risk calibration, and capital timing. Together, they create a single decision-making framework that spans every vertical and every stage of the investment cycle.</p><p className="principals-intro">That continuity matters. The same principals who assess the opportunity are the ones who guide deployment, capital structure, asset management, and long-term portfolio direction. It keeps the platform coherent, responsive, and accountable.</p><div className="principals-grid">{principals.map((principal) => <article className="principal-card" key={principal.name}><span className="principal-initial">{principal.initial}</span><span className="principal-label">{principal.role}</span><h3>{principal.name}</h3><p>{principal.copy}</p></article>)}</div></div></section>;
}
