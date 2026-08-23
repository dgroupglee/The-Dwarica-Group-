import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function FirmIdentitySection() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => gsap.fromTo('.identity-copy', { opacity: 0, x: 100, rotateY: 14 }, { opacity: 1, x: 0, rotateY: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'center center', scrub: 1 } }), root);
    return () => ctx.revert();
  }, []);

  return <section ref={root} id="identity" className="identity-section"><div className="identity-copy"><span className="section-kicker">Firm identity / one firm, seven verticals</span><h2 className="section-title">Cross-vertical capital efficiency.</h2><p>The Dwarica Group operates as a multi-strategy private investment holding firm and family office. Transactional desks create velocity, private markets create durable ownership, liquid intelligence creates optionality, and intellectual property creates long-duration cash flow.</p><p>Each vertical exists to serve a distinct role in the same capital system: originate opportunity, deploy capital with discipline, and compound value through operating control and patient holding. The firm is designed to function as one platform, not seven isolated businesses.</p><p>Rather than relying on a single asset class, the firm balances immediate liquidity, durable real assets, operating businesses, alternative income streams, and strategic market intelligence. That structure helps reduce dependence on any one cycle, sector, or market condition.</p><div className="identity-theses"><div><span>Generate</span><strong>Origination liquidity</strong><p>High-conviction transaction flow creates working capital and live market intelligence.</p></div><div><span>Deploy</span><strong>Asset-rate deployment</strong><p>Capital moves into real assets, operating companies, and liquid opportunities selected for durability.</p></div><div><span>Compound</span><strong>Institutional permanence</strong><p>Recycled yield and operating discipline expand the platform across cycles.</p></div></div></div></section>;
}
