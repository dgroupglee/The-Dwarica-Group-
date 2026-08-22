import { useEffect, useRef } from 'react';

const pitch = 'Seven simultaneous strategies mean your capital is never concentrated in a single market cycle. When acquisition multiples are elevated, our capital markets desk is generating active returns. When public markets pull back, our private equity positions are producing operating cash flow independent of price. When luxury asset markets are slow, real estate is compounding through appreciation and rental income. The combination is not diversification for its own sake — it is systematic protection of compounding. Every dollar deployed inside The Dwarica Group participates across all seven strategies. The AUM grows not because one strategy wins but because the system is designed so that something is always working. We are not waiting for conditions to improve. We are deploying across every condition simultaneously. This is how we build. This is how legacy capital grows.';

export default function InvestorPitchSection() {
  const root = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }, { threshold: 0.2 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  return <section ref={root} className="investor-pitch-section" id="why-capital-compounds"><div className="section-frame"><span className="section-kicker">The investment case</span><h2 className="section-title">Why Capital Compounds Inside The Dwarica Group.</h2><p className="investor-pitch-copy">{pitch}</p></div></section>;
}