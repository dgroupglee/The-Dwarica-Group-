import { useState } from 'react';
import { motion } from 'framer-motion';

const pillars = [
  { label: 'Private Enterprise', percentage: 40, tone: 'primary', desc: 'SMB acquisitions, business carve-outs, and cash-flowing operational companies generating predictable baseline yield.' },
  { label: 'Liquid Capital Markets', percentage: 35, tone: 'secondary', desc: 'Active systematic deployment across equities, options, futures, and regulated prediction markets.' },
  { label: 'Hard Assets', percentage: 25, tone: 'tertiary', desc: 'Reference-grade timepieces, fine jewelry, and ultra-luxury vehicle brokerage secured via direct wholesale networks.' },
];

export default function AUMVisualizer() {
  const [active, setActive] = useState(0);

  return <section className="aum-visualizer" id="capital-deployment"><div className="aum-visualizer-inner"><span className="section-kicker">Capital deployment</span><h2 className="section-title">How we allocate capital.</h2><div className="aum-stacked-bar-wrap"><div className="aum-stacked-bar" role="group" aria-label="Capital allocation breakdown">{pillars.map((pillar, index) => <motion.button type="button" key={pillar.label} className={`aum-stacked-segment aum-stacked-segment--${pillar.tone} ${active === index ? 'is-active' : ''}`} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.05, delay: index * .18, ease: 'easeOut' }} style={{ '--segment-width': `${pillar.percentage}%` }} onClick={() => setActive(index)} aria-label={`${pillar.label}: ${pillar.percentage}%`} aria-pressed={active === index}><span>{pillar.percentage}%</span></motion.button>)}</div><div className="aum-stacked-legend">{pillars.map((pillar, index) => <button type="button" key={pillar.label} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)}><i className={`aum-legend-dot aum-legend-dot--${pillar.tone}`} />{pillar.label}</button>)}</div></div><div className="aum-pillar-cards">{pillars.map((pillar, index) => <motion.button type="button" key={pillar.label} className={`aum-pillar-card ${active === index ? 'is-active' : ''}`} onClick={() => setActive(index)} whileHover={{ y: -3 }} aria-pressed={active === index}><div className="aum-pillar-card-meta"><span>Pillar 0{index + 1} — {pillar.percentage}%</span><i className={`aum-legend-dot aum-legend-dot--${pillar.tone}`} /></div><h3>{pillar.label}</h3><p>{pillar.desc}</p></motion.button>)}</div></div></section>;
}
