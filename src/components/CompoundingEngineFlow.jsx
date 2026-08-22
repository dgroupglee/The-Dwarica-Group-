import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const compoundingStages = [
  { step: '01', title: 'Originating Liquidity', subtitle: 'Immediate Working Capital', description: 'Luxury automotive, timepieces, fine jewelry, and residential opportunity flow create operating liquidity while keeping the platform close to live demand and pricing intelligence.', metrics: ['Transactional Velocity', 'OpInc Capital', 'Market Intelligence'] },
  { step: '02', title: 'Asset-Rate Deployment', subtitle: 'Yield Optimization', description: 'Systematically redirecting cash flow into high-yield asset classes and collateralized private debt structures with rigorous risk-adjusted return floors.', metrics: ['Collateralized Flow', 'Yield Alpha', 'Risk Mitigated'] },
  { step: '03', title: 'Institutional Roll-Ups', subtitle: 'Balanced Expansion', description: 'Aggregating fragmented regional operators into unified portfolio holding structures, capturing operational efficiencies and compounding equity value.', metrics: ['EBITDA Synergy', 'Holding Scale', 'Structural Moat'] },
];

export default function CompoundingEngineFlow() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="compounding-engine-interactive" id="compounding-engine">
      <div className="compounding-engine-inner">
        <div className="compounding-engine-header">
          <div className="compounding-engine-kicker"><span aria-hidden="true" />Compounding Engine</div>
          <h2>From Capital Velocity to <br /><em>Institutional Permanence.</em></h2>
        </div>
        <div className="compounding-stage-grid" role="list" aria-label="Compounding engine stages">
          {compoundingStages.map((stage, index) => {
            const isActive = activeStep === index;
            return (
              <motion.button key={stage.step} type="button" className={`compounding-stage${isActive ? ' compounding-stage--active' : ''}`} onClick={() => setActiveStep(index)} whileHover={{ y: -6 }} whileTap={{ scale: 0.995 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} aria-pressed={isActive}>
                <div className="compounding-stage-top"><span>Stage {stage.step} / 03</span><i aria-hidden="true" /></div>
                <h3>{stage.title}</h3>
                <p className="compounding-stage-subtitle">{stage.subtitle}</p>
                <p className="compounding-stage-description">{stage.description}</p>
                <AnimatePresence initial={false}>
                  {isActive ? <motion.div className="compounding-stage-metrics" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>{stage.metrics.map((metric) => <span key={metric}>{metric}</span>)}</motion.div> : null}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
