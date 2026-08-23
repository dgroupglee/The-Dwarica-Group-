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
  return <section ref={root} id="capital-markets" className="capital-markets-section"><div className="capital-curves"><svg viewBox="0 0 640 420" role="img" aria-labelledby="market-chart-title market-chart-desc"><title id="market-chart-title">Institutional market momentum chart</title><desc id="market-chart-desc">Three indexed market signals move through a restrained terminal grid, with the primary signal trending upward and a benchmark moving downward.</desc><g className="chart-grid" aria-hidden="true">{[60, 120, 180, 240, 300, 360].map((y) => <line key={`h-${y}`} x1="0" x2="640" y1={y} y2={y} />)}{[80, 200, 320, 440, 560].map((x) => <line key={`v-${x}`} x1={x} x2={x} y1="20" y2="380" />)}</g><line className="chart-axis" x1="0" x2="640" y1="380" y2="380" /><path pathLength="1" className="curve-path curve-path--primary" d="M0 302 C70 286 94 320 158 266 S255 218 320 244 S422 126 490 150 S566 88 640 52" /><path pathLength="1" className="curve-path curve-path--secondary" d="M0 250 C70 240 120 258 180 226 S280 236 340 198 S430 184 498 204 S570 156 640 172" /><path pathLength="1" className="curve-path curve-path--benchmark" d="M0 116 C82 132 128 118 190 168 S282 150 350 216 S456 194 512 266 S584 246 640 310" /><g className="chart-labels" aria-hidden="true"><text x="8" y="410">01</text><text x="202" y="410">02</text><text x="394" y="410">03</text><text x="590" y="410">04</text></g></svg><div className="chart-legend" aria-label="Chart legend"><span><i className="legend-mark legend-mark--primary" />Primary signal</span><span><i className="legend-mark legend-mark--secondary" />Liquidity band</span><span><i className="legend-mark legend-mark--benchmark" />Benchmark</span></div></div><div className="capital-instruments"><span className="section-kicker">Capital markets / shared leadership</span><h2 className="section-title">Market intelligence is treated as a core operating input.</h2><p className="capital-markets-intro">The firm reviews listed markets, derivatives, macro signals, and digital liquidity through the same disciplined lens used across every other strategy: timing, durability, and optionality. The goal is not reaction; it is informed decision-making with a clear view of what matters next. These markets serve as a source of information, liquidity, and flexibility that strengthens the wider platform.</p><p className="capital-markets-intro">That means the desk is not just trading for activity. It is helping the group understand where capital is moving, how conditions are changing, and where opportunities are emerging before they become obvious to the broader market. Select an instrument to inspect its role.</p><ul>{instruments.map(([instrument, description], index) => <li className={`instrument-line ${index === activeInstrument ? 'instrument-line--active' : ''}`} key={instrument}><button type="button" aria-expanded={index === activeInstrument} onClick={() => setActiveInstrument(index)}><span>{instrument}</span><b aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24"><path d={index === activeInstrument ? 'M5 12h14' : 'M12 5v14M5 12h14'} /></svg></b></button>{index === activeInstrument ? <p>{description}</p> : null}</li>)}</ul></div></section>;
}
