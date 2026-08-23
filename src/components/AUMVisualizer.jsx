import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const corePillars = [
  { id: '01', title: 'Private Enterprise', subtitle: 'SMB acquisitions & operational hold', focus: 'Acquiring and scaling cash-flowing operating companies with resilient baseline demand.', execution: 'Targeting established businesses with proven cash flows and applying disciplined operating oversight to drive long-term equity value.' },
  { id: '02', title: 'Liquid Capital Markets', subtitle: 'Systematic deployment & volatility', focus: 'Disciplined positioning across public equities, options, and regulated prediction markets.', execution: 'Executing documented, position-sized strategies designed to capture market anomalies while maintaining dry powder for macroeconomic dislocations.' },
  { id: '03', title: 'Hard Assets & Real Estate', subtitle: 'Tangible value & wholesale access', focus: 'Securing reference-grade physical assets and durable property positions.', execution: 'Leveraging direct market relationships to acquire luxury timepieces, fine assets, and real estate with a focus on basis, provenance, and long-duration value.' },
];

function resetTilt(element) {
  element.style.setProperty('--mandate-rotate-x', '0deg');
  element.style.setProperty('--mandate-rotate-y', '0deg');
  element.style.setProperty('--mandate-glow-x', '50%');
  element.style.setProperty('--mandate-glow-y', '50%');
}

function trackTilt(event) {
  if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  card.style.setProperty('--mandate-rotate-x', `${(0.5 - y) * 7}deg`);
  card.style.setProperty('--mandate-rotate-y', `${(x - 0.5) * 7}deg`);
  card.style.setProperty('--mandate-glow-x', `${x * 100}%`);
  card.style.setProperty('--mandate-glow-y', `${y * 100}%`);
}

export default function AUMVisualizer() {
  const [activeCard, setActiveCard] = useState(0);
  const cardRefs = useRef([]);

  const selectCard = (index) => {
    setActiveCard(index);
    cardRefs.current[index]?.focus({ preventScroll: true });
  };

  return <section className="aum-visualizer mandate-visualizer" id="capital-deployment"><div className="aum-visualizer-inner"><div className="mandate-header"><span className="section-kicker">Core operating mandate</span><h2 className="section-title">Capital deployment engineered for control and yield.</h2></div><div className="mandate-card-grid">{corePillars.map((pillar, index) => { const isActive = activeCard === index; return <motion.article key={pillar.id} ref={(element) => { cardRefs.current[index] = element; }} className={`mandate-card ${isActive ? 'is-active' : ''}`} role="button" tabIndex="0" aria-expanded={isActive} onClick={() => selectCard(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectCard(index); } }} onPointerMove={trackTilt} onPointerLeave={(event) => resetTilt(event.currentTarget)} whileHover={{ y: -8, scale: 1.01 }} transition={{ duration: .3, ease: 'easeOut' }}><span className="mandate-card-glow" aria-hidden="true" />{isActive ? <span className="mandate-card-accent" aria-hidden="true" /> : null}<div className="mandate-card-meta"><span>Pillar // {pillar.id}</span><i aria-hidden="true" /></div><h3>{pillar.title}</h3><p className="mandate-card-subtitle">{pillar.subtitle}</p><p className="mandate-card-focus">{pillar.focus}</p><AnimatePresence initial={false}>{isActive ? <motion.div className="mandate-card-execution" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: .3 }}><span>Execution architecture</span><p>{pillar.execution}</p></motion.div> : null}</AnimatePresence></motion.article>; })}</div></div></section>;
}
