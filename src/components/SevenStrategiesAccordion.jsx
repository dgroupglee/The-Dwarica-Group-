import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


const strategies = [
  { id: '01', title: 'Commercial Real Estate', description: 'The Dwarica Group acquires and holds commercial real estate across primary and high-growth secondary markets — multi-family assets, triple-net retail, mixed-use properties, and light industrial. Every position is structured for decades of ownership. We syndicate larger acquisitions with equity partners who participate in both current yield and long-term appreciation.', bullets: ['Stable income', 'Strong tenants', 'Long-term value'], labels: ['Return profile', 'Income source', 'Protection', 'Upside'], theme: 'Steady cash flow' },
  { id: '02', title: 'Residential Real Estate', description: 'We source off-market residential properties through proprietary channels that public buyers cannot access — pre-foreclosure, probate, tax-delinquent, and distressed situations across multiple states. Sellers receive offers within 24 hours and close on their timeline. Investors receive consistent, pre-negotiated deal flow that never touches the MLS.', bullets: ['Good entry price', 'Demand in the area', 'Exit flexibility'], labels: ['Buying principle', 'Local signal', 'Decision path', 'Potential gain'], theme: 'Buy where the market is strong' },
  { id: '03', title: 'Private Equity & Acquisitions', description: 'The Dwarica Group identifies and acquires cash-flowing operating businesses in the $200,000 to $2,000,000 SDE range — companies with durable revenue, motivated ownership, and significant untapped value available to a disciplined operator. We prioritize proprietary origination, structure acquisitions to generate immediate operating cash flow from day one, and build portfolio positions designed to compound over multi-year hold periods. Capital partners participate in both current income and the terminal exit multiple.', bullets: ['Durable economics', 'Defensible position', 'Aligned governance'], labels: ['Investment standard', 'Competitive edge', 'Ownership model', 'Value thesis'], theme: 'Build lasting enterprise value' },
  { id: '04', title: 'Capital Markets', description: 'The firm maintains an active multi-instrument capital deployment desk across public equities, options, futures, crypto, and regulated prediction markets. Long-term compounding through tax-advantaged equity allocation runs in parallel with active positioning across macro themes and event-driven markets. Every instrument has a defined position size, documented thesis, and process-driven entry and exit.', bullets: ['Market timing', 'Risk control', 'Liquidity options'], labels: ['Why it matters', 'Guardrail', 'Available choices', 'Portfolio role'], theme: 'Keep capital ready and informed' },
  { id: '05', title: 'Luxury Automotive', description: 'We operate a private brokerage for buyers and sellers of exotic and ultra-luxury vehicles — Mercedes-Maybach, Rolls-Royce, Lamborghini, Bentley, Brabus, McLaren, and comparable. No physical lot. No inventory risk. Every listing represents a vehicle we can deliver. Transactions close privately at pricing that reflects real market intelligence.', bullets: ['Rare inventory', 'Trusted provenance', 'Fast execution'], labels: ['Inventory', 'Confidence', 'Client experience', 'Transaction role'], theme: 'High-value assets with clear demand' },
  { id: '06', title: 'Watches & Fine Jewelry', description: 'Through licensed dealer credentials and private wholesale networks unavailable to retail participants, The Dwarica Group sources luxury watches and fine jewelry for private clients at pricing the public market cannot replicate. Vacheron Constantin, Patek Philippe, Richard Mille, Audemars Piguet, Rolex, Cartier. We source to confirmed buyers. The asset arrives. That is the entire model.', bullets: ['Authenticated pieces', 'Strong resale confidence', 'Collector demand'], labels: ['Verification', 'Market test', 'Audience', 'Value source'], theme: 'Premium assets with trusted value' },
  { id: '07', title: 'Glee Music Collective', description: 'The firm\'s entertainment vertical is an independent music label executing a founder-led rollout — building proprietary audience infrastructure and catalog before any public launch. Both principals operate this vertical. Streaming royalties, sync licensing, brand integration, and label equity compound into a significant IP asset class. The creative vision and business architecture are built simultaneously.', bullets: ['Royalties', 'Creative rights', 'Long-term income'], labels: ['Revenue stream', 'What is owned', 'Time horizon', 'Strategic role'], theme: 'Turn creative assets into recurring income' },
];

export default function SevenStrategiesAccordion() {
  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStrategy = strategies[activeIndex];

  useLayoutEffect(() => {
    let media;
    const ctx = gsap.context(() => {
      media = gsap.matchMedia();
      media.add('(min-width: 769px)', () => ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const nextIndex = Math.min(strategies.length - 1, Math.floor(progress * strategies.length));
          setActiveIndex((current) => current === nextIndex ? current : nextIndex);
        },
      }));
      media.add('(max-width: 768px)', () => ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: true,
        onUpdate: ({ progress }) => setActiveIndex(Math.min(strategies.length - 1, Math.floor(progress * strategies.length))),
      }));
    }, ref);
    return () => { media?.revert(); ctx.revert(); };
  }, []);

  return (
    <section ref={ref} id="strategies" className="strategies-section">
      <div className="section-frame">
        <div className="section-kicker">Seven strategies</div>
        <h2 className="section-title">A unified operating system built around seven execution lanes.</h2>
        <p className="strategy-intro">The firm’s seven strategies are not separate silos. They are coordinated tools within one operating system: some create liquidity, some acquire durable assets, some scale ownership, and others strengthen market intelligence, financing flexibility, and income generation. Together they give the platform more optionality than any single strategy could provide on its own.</p>

        <div className="strategy-viewport-shell">
        <div className="strategy-viewport">
          <div className="strategy-index-list" aria-label="Select a compounding strategy">
            <div className="strategy-console-label"><span>Operating lanes</span><strong>{String(activeIndex + 1).padStart(2, '0')} / 07</strong></div>
            {strategies.map((strategy, index) => <button type="button" key={strategy.id} className={`strategy-number ${index === activeIndex ? 'active' : ''}`} onClick={() => setActiveIndex(index)} aria-pressed={index === activeIndex}><span>{strategy.id}</span><span>{strategy.title}</span></button>)}
            <div className="strategy-progress" aria-hidden="true"><span style={{ width: `${((activeIndex + 1) / strategies.length) * 100}%` }} /></div>
            <p className="strategy-console-hint">Select a lane or continue scrolling to move through the operating system.</p>
          </div>
          <div className="strategy-stack">
            <AnimatePresence mode="wait">
              <motion.article className="strategy-panel-item strategy-panel-item--active" key={activeStrategy.id} initial={{ opacity: 0, x: 28, filter: 'blur(8px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -18, filter: 'blur(6px)' }} transition={{ duration: .45, ease: [0.22, 1, .36, 1] }}>
                <div className="strategy-panel-head">
                  <span className="strategy-no">Strategy {activeStrategy.id}</span>
                  <span className="strategy-panel-status"><i /> Active thesis</span>
                </div>
                <h3 className="strategy-heading">{activeStrategy.title}</h3>
                <p className="strategy-body">{activeStrategy.description}</p>
                <div className="strategy-meta">
                  <div className="strategy-meta-card"><span>{activeStrategy.labels[0]}</span><strong>{activeStrategy.theme}</strong></div>
                  {activeStrategy.bullets.map((bullet, index) => <div key={bullet} className="strategy-meta-card"><span>{activeStrategy.labels[index + 1]}</span><strong>{bullet}</strong></div>)}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
        </div>
        <motion.div className="strategy-architecture-band" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .65 }}>
          <div className="strategy-architecture-lead"><span className="section-kicker">The operating system / capital flow</span><h3>Seven lanes. Three roles. One durable holding structure.</h3><p>The strategies are designed to work in sequence. Transactional desks create useful proximity to demand, ownership strategies convert that intelligence into durable assets, and the wider platform recycles yield into the next high-conviction opportunity.</p></div>
          <div className="strategy-architecture-steps">
            <article><span>01 / Generate</span><strong>Liquidity and intelligence</strong><p>Live transaction flow keeps the firm close to pricing, demand, and motivated counterparties.</p></article>
            <article><span>02 / Deploy</span><strong>Control and ownership</strong><p>Capital moves into real assets and operating companies with defined downside guardrails.</p></article>
            <article><span>03 / Compound</span><strong>Permanent optionality</strong><p>Cash flow, equity value, and market intelligence strengthen every future deployment decision.</p></article>
          </div>
        </motion.div>
        <motion.div className="strategy-command-box" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .65, delay: .08 }}>
          <div className="strategy-command-mark"><strong>DG</strong><span>Private<br />allocation<br />map</span></div>
          <div className="strategy-cycle-header"><span className="section-kicker">The command layer / live allocation logic</span><h3>Where market signal becomes durable position.</h3><p>The seven lanes are the visible surface of a deeper operating loop. Information enters through live demand, gets tested against basis and downside, then returns as a stronger decision for the next deployment.</p><div className="strategy-command-spec"><span>System output</span><strong>Institutional optionality</strong><small>Every lane should improve the quality, timing, or durability of the next allocation.</small></div></div>
          <div className="strategy-cycle-track" aria-label="Private allocation sequence">
            <div><span>01 / Signal</span><strong>Read demand</strong><small>Proximity to live markets</small></div><i aria-hidden="true">→</i><div><span>02 / Basis</span><strong>Price risk</strong><small>Discipline before velocity</small></div><i aria-hidden="true">→</i><div><span>03 / Position</span><strong>Take control</strong><small>Ownership with a point of view</small></div><i aria-hidden="true">→</i><div><span>04 / Continuity</span><strong>Extend duration</strong><small>Make the next decision better</small></div>
          </div>
          <div className="strategy-register-heading"><span>System register</span><small>Seven execution lanes / one operating standard</small></div>
          <div className="strategy-lane-register">{strategies.map((strategy) => <div key={`register-${strategy.id}`}><span>{strategy.id}</span><strong>{strategy.title}</strong><small>{strategy.theme}</small></div>)}</div>
          <div className="strategy-closing-panel"><div><span className="section-kicker">System conclusion / principal view</span><h4>The strategy is not the lane. It is the relationship between them.</h4></div><p>When one market slows, another creates signal. When one asset requires patience, another creates liquidity. That is the advantage of building a holding structure designed to keep learning, deploying, and compounding.</p><strong className="strategy-closing-mark">DG / 07 → 01</strong></div>
        </motion.div>
      </div>
    </section>
  );
}
