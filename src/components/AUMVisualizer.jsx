import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const pillars = [
  { id: '01', title: 'Private Enterprise', tagline: 'SMB Acquisitions & Operational Hold', metricLabel: 'Target Cash Flow Baseline', metricValue: 'Predictable SDE Yield', description: 'Acquiring and scaling cash-flowing operating companies with resilient baseline demand, disciplined oversight, and a long-duration ownership mindset.' },
  { id: '02', title: 'Liquid Capital Markets', tagline: 'Systematic Deployment & Volatility', metricLabel: 'Execution Speed', metricValue: 'T+1 Daily Liquid', description: 'Systematic positioning across public equities, options, and regulated prediction markets, with unit-based sizing and dry powder reserved for dislocation.' },
  { id: '03', title: 'Hard Assets & Real Estate', tagline: 'Tangible Value & Wholesale Arbitrage', metricLabel: 'Inflation Hedge', metricValue: 'Physical Collateral Backing', description: 'Securing reference-grade physical assets and durable property positions through direct wholesale networks, with emphasis on basis, provenance, and utility.' },
];

export default function AUMVisualizer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePillar = pillars[activeIndex];

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % pillars.length);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + pillars.length) % pillars.length);
    }
  };

  return (
    <section className="aum-visualizer capital-flow-visualizer" id="capital-deployment">
      <div className="aum-visualizer-inner capital-flow-inner">
        <div className="capital-flow-header">
          <div>
            <span className="section-kicker">Capital architecture &amp; flow</span>
            <h2 className="section-title">Engineered for control and yield.</h2>
          </div>
          <span className="capital-flow-index" aria-label={`Strategy ${activePillar.id} of ${pillars.length}`}>{activePillar.id} / 03</span>
        </div>

        <div className="capital-flow-tabs" role="tablist" aria-label="Capital deployment pillars" onKeyDown={handleKeyDown}>
          {pillars.map((pillar, index) => (
            <button className={`capital-flow-tab ${activeIndex === index ? 'is-active' : ''}`} key={pillar.id} id={`capital-tab-${pillar.id}`} type="button" role="tab" aria-selected={activeIndex === index} aria-controls="capital-flow-panel" tabIndex={activeIndex === index ? 0 : -1} onClick={() => setActiveIndex(index)}>
              <span>{pillar.id}</span><strong>{pillar.title}</strong>
            </button>
          ))}
        </div>

        <div className="capital-flow-panel-shell">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div className="capital-flow-panel" key={activePillar.id} role="tabpanel" id="capital-flow-panel" aria-labelledby={`capital-tab-${activePillar.id}`} tabIndex="0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28, ease: 'easeOut' }}>
              <span className="capital-flow-topline" aria-hidden="true" />
              <div className="capital-flow-panel-content">
                <div className="capital-flow-narrative">
                  <div className="capital-flow-kicker"><span /> Active deployment lane</div>
                  <h3>{activePillar.title}</h3>
                  <p className="capital-flow-tagline">{activePillar.tagline}</p>
                  <p className="capital-flow-description">{activePillar.description}</p>
                </div>
                <div className="capital-flow-metric">
                  <span className="capital-flow-metric-label">{activePillar.metricLabel}</span>
                  <strong>{activePillar.metricValue}</strong>
                  <div className="capital-flow-status"><i /> Deployment status <b>Active desk</b></div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
