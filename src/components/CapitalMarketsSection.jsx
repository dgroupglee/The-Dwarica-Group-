import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const instruments = [
  ['Equities', 'Active listed-market review provides liquidity, information, and tactical exposure across changing macro conditions.'],
  ['Options & Derivatives', 'Structured derivatives are evaluated for asymmetric exposure, hedging utility, and disciplined risk boundaries.'],
  ['Futures', 'Futures markets extend the desk’s ability to express views on rates, commodities, indices, and global risk appetite.'],
  ['Crypto', 'Digital assets are monitored as a liquid intelligence channel with strict attention to custody, volatility, and position sizing.'],
  ['Prediction Markets', 'Event-driven markets add a real-time probability layer to the firm’s macro and news analysis.'],
  ['Thematic Macro', 'Policy shifts, rates, global news, and market signals are condensed into a single operating view that informs capital allocation and portfolio timing.'],
];

const signalLanes = [
  ['01', 'Observe', 'Rates, liquidity, and market structure'],
  ['02', 'Price', 'Basis, volatility, and downside'],
  ['03', 'Deploy', 'Timing, sizing, and optionality'],
];

export default function CapitalMarketsSection() {
  const root = useRef(null);
  const [activeInstrument, setActiveInstrument] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.instrument-line', { opacity: 0, x: 28 }, { opacity: 1, x: 0, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center center', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="capital-markets" className="capital-markets-section">
      <aside className="market-signal-console" aria-label="Market intelligence operating console">
        <div className="market-console-header">
          <span className="section-kicker">Operating signal console</span>
          <span className="market-console-status"><i /> Live desk view</span>
        </div>
        <div className="market-console-readout">
          <span>Decision standard</span>
          <strong>Timing before velocity.</strong>
          <p>Every market input is translated into a decision about basis, durability, or the next allocation.</p>
        </div>
        <div className="market-signal-lanes" aria-label="Capital decision sequence">
          {signalLanes.map(([number, label, detail], index) => (
            <div className={`market-signal-lane ${index === 1 ? 'is-current' : ''}`} key={number}>
              <span>{number}</span>
              <div><strong>{label}</strong><small>{detail}</small></div>
              {index < signalLanes.length - 1 ? <b aria-hidden="true">→</b> : null}
            </div>
          ))}
        </div>
        <div className="market-console-footer"><span>System posture</span><strong>Selective deployment</strong></div>
      </aside>
      <div className="capital-instruments">
        <span className="section-kicker">Capital markets / shared leadership</span>
        <h2 className="section-title">Market intelligence is treated as a core operating input.</h2>
        <p className="capital-markets-intro">The firm reviews listed markets, derivatives, macro signals, and digital liquidity through the same disciplined lens used across every other strategy: timing, durability, and optionality. The goal is not reaction; it is informed decision-making with a clear view of what matters next.</p>
        <p className="capital-markets-intro">The desk helps the group understand where capital is moving, how conditions are changing, and where opportunities are emerging before they become obvious to the broader market. Select an instrument to inspect its role.</p>
        <ul>
          {instruments.map(([instrument, description], index) => (
            <li className={`instrument-line ${index === activeInstrument ? 'instrument-line--active' : ''}`} key={instrument}>
              <button type="button" aria-expanded={index === activeInstrument} onClick={() => setActiveInstrument(index)}>
                <span>{instrument}</span>
                <b aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24"><path d={index === activeInstrument ? 'M5 12h14' : 'M12 5v14M5 12h14'} /></svg></b>
              </button>
              {index === activeInstrument ? <p>{description}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
