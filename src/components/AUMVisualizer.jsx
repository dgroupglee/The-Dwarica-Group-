import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const pillars = [
  { label: 'Liquid Capital Markets', percentage: 35, desc: 'Active trading across equities, options, futures, and regulated prediction markets.' },
  { label: 'Private Enterprise', percentage: 40, desc: 'SMB acquisitions, business carve-outs, and cash-flowing operational companies.' },
  { label: 'Hard Assets', percentage: 25, desc: 'Reference-grade timepieces, fine jewelry, and ultra-luxury vehicle brokerage.' },
];

export default function AUMVisualizer() {
  const [active, setActive] = useState(0);
  const size = 300;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const segments = useMemo(() => {
    let offset = 0;
    return pillars.map((pillar, index) => {
      const dashLength = (pillar.percentage / 100) * circumference;
      const segment = { ...pillar, dashLength, dashOffset: offset, index };
      offset += dashLength;
      return segment;
    });
  }, [circumference]);

  return <section className="aum-visualizer" id="capital-deployment"><div className="aum-visualizer-inner"><span className="section-kicker">Capital deployment</span><h2 className="section-title">How we allocate capital.</h2><div className="aum-visualizer-layout"><div className="aum-ring-wrap"><svg viewBox={`0 0 ${size} ${size}`} role="img" aria-labelledby="aum-title aum-description"><title id="aum-title">Capital allocation breakdown</title><desc id="aum-description">Liquid capital markets at 35 percent, private enterprise at 40 percent, and hard assets at 25 percent.</desc><circle className="aum-ring-track" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} />{segments.map((segment) => <motion.circle key={segment.label} className={`aum-ring-segment ${active === segment.index ? 'is-active' : ''}`} cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} strokeDasharray={`${segment.dashLength} ${circumference - segment.dashLength}`} strokeDashoffset={-segment.dashOffset} initial={{ strokeDasharray: `0 ${circumference}` }} whileInView={{ strokeDasharray: `${segment.dashLength} ${circumference - segment.dashLength}` }} viewport={{ once: true, amount: .6 }} transition={{ duration: 1.2, delay: segment.index * .2, ease: 'easeOut' }} onClick={() => setActive(segment.index)} role="button" tabIndex="0" aria-label={`${segment.label}, ${segment.percentage}%`} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setActive(segment.index); }} />)}</svg><div className="aum-ring-center"><strong>{pillars[active].percentage}%</strong><span>Allocated</span></div></div><div className="aum-pillar-list">{pillars.map((pillar, index) => <motion.button type="button" key={pillar.label} className={`aum-pillar ${active === index ? 'is-active' : ''}`} onClick={() => setActive(index)} whileHover={{ y: -2 }} aria-pressed={active === index}><span className="aum-pillar-heading"><i />{pillar.percentage}% — {pillar.label}</span>{active === index ? <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="aum-pillar-description">{pillar.desc}</motion.span> : null}</motion.button>)}</div></div></div></section>;
}
