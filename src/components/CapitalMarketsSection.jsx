import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  const consoleRef = useRef(null);
  const [activeSignal, setActiveSignal] = useState(1);
  const [activeInstrument, setActiveInstrument] = useState(0);
  const signalCopy = [
    ['Timing before velocity.', 'Observe the market structure first: rates, liquidity, and demand reveal where the basis is changing.'],
    ['Price the downside.', 'Convert signal into a disciplined view of basis, volatility, and what must be true before capital moves.'],
    ['Deploy with optionality.', 'Take the position when timing, sizing, and control align — then preserve flexibility for the next decision.'],
  ];
  const trackConsole = (event) => {
    if (window.matchMedia('(pointer: coarse)').matches || !consoleRef.current) return;
    const bounds = consoleRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    consoleRef.current.style.setProperty('--console-rotate-x', `${y * -3}deg`);
    consoleRef.current.style.setProperty('--console-rotate-y', `${x * 3}deg`);
  };
  const resetConsole = () => { consoleRef.current?.style.setProperty('--console-rotate-x', '0deg'); consoleRef.current?.style.setProperty('--console-rotate-y', '0deg'); };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.instrument-line', { opacity: 0, x: 28 }, { opacity: 1, x: 0, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center center', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="capital-markets" className="capital-markets-section">
      <motion.aside ref={consoleRef} className="market-signal-console" aria-label="Market intelligence operating console" onPointerMove={trackConsole} onPointerLeave={resetConsole}>
        <div className="market-console-header">
          <span className="section-kicker">Operating signal console</span>
          <span className="market-console-status">Desk view</span>
        </div>
        <div className="market-console-readout">
          <span>Decision standard</span>
          <AnimatePresence mode="wait" initial={false}><motion.div key={activeSignal} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .22 }}><strong>{signalCopy[activeSignal][0]}</strong><p>{signalCopy[activeSignal][1]}</p></motion.div></AnimatePresence>
        </div>
        <div className="market-signal-lanes" aria-label="Capital decision sequence">
          {signalLanes.map(([number, label, detail], index) => (
            <button type="button" className={`market-signal-lane ${index === activeSignal ? 'is-current' : ''}`} key={number} onClick={() => setActiveSignal(index)} onMouseEnter={() => setActiveSignal(index)}>
              <span>{number}</span>
              <div><strong>{label}</strong><small>{detail}</small></div>
              {index < signalLanes.length - 1 ? <b aria-hidden="true">→</b> : null}
            </button>
          ))}
        </div>
        <div className="market-console-footer"><span>System posture</span><strong>Selective deployment</strong></div>
      </motion.aside>
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
              <AnimatePresence initial={false}>{index === activeInstrument ? <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: .24 }}>{description}</motion.p> : null}</AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
