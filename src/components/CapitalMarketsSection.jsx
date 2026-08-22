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


export default function CapitalMarketsSection() {
  const root = useRef(null);
  const [activeInstrument, setActiveInstrument] = useState(0);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.curve-path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center center', scrub: 1 } });
      gsap.fromTo('.instrument-line', { opacity: 0, x: 70 }, { opacity: 1, x: 0, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'center center', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, []);
  return <section ref={root} id="capital-markets" className="capital-markets-section"><div className="capital-curves"><svg viewBox="0 0 600 420" preserveAspectRatio="none" aria-hidden="true"><path className="curve-path" d="M0 360 C120 310 160 330 250 230 S430 180 600 40" /><path className="curve-path" d="M0 400 C140 350 180 360 300 280 S450 250 600 100" /><path className="curve-path" d="M0 300 C120 280 230 260 330 180 S490 140 600 70" /></svg></div><div className="capital-instruments"><span className="section-kicker">Capital markets / shared leadership</span><h2 className="section-title">Market intelligence is treated as a core operating input.</h2><p className="capital-markets-intro">The firm reviews listed markets, derivatives, macro signals, and digital liquidity through the same disciplined lens used across every other strategy: timing, durability, and optionality. The goal is not reaction; it is informed decision-making with a clear view of what matters next. These markets serve as a source of information, liquidity, and flexibility that strengthens the wider platform.</p><p className="capital-markets-intro">That means the desk is not just trading for activity. It is helping the group understand where capital is moving, how conditions are changing, and where opportunities are emerging before they become obvious to the broader market. Select an instrument to inspect its role.</p><ul>{instruments.map(([instrument, description], index) => <li className={`instrument-line ${index === activeInstrument ? 'instrument-line--active' : ''}`} key={instrument}><button type="button" aria-expanded={index === activeInstrument} onClick={() => setActiveInstrument(index)}><span>{instrument}</span><b aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24"><path d={index === activeInstrument ? 'M5 12h14' : 'M12 5v14M5 12h14'} /></svg></b></button>{index === activeInstrument ? <p>{description}</p> : null}</li>)}</ul></div></section>;
}
