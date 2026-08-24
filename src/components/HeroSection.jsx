import { useEffect, useRef } from 'react';
import { RollingMetric } from './CinematicSystems';


const words = ['Seven', 'Strategies.', 'One', 'Compounding', 'System.'];
const heroStats = [
  { value: 7, label: 'strategies / one system' },
  { value: 3, label: 'global capital corridors' },
  { value: 24, label: 'hour market vigilance' },
];

export default function HeroSection() {
  const root = useRef(null);
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => undefined);
      else video.pause();
    }, { threshold: 0.05 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={root} id="hero" className="hero-section site-shell">
      <div className="hero-mobile-background" aria-hidden="true" />
      <div className="hero-video-layer" aria-hidden="true" data-video-slot="hero-background">
        {/* Replace /hero-video.mp4 with actual video file when available */}
        <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" poster="/hero-poster.jpg" aria-hidden="true">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-video-overlay" aria-hidden="true" />
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-monogram" aria-label="The Dwarica Group mark">D<span>G</span></div>
          <div className="hero-kicker">Private capital architecture</div>
          <h1 className="hero-heading" aria-label="Seven Strategies. One Compounding System.">
            {words.map((word, index) => (
              <span key={word + index} className="hero-word">{word}&nbsp;</span>
            ))}
          </h1>
          <p className="hero-sub">
            The Dwarica Group is a multi-strategy private investment platform focused on disciplined ownership, direct capital deployment, and long-duration compounding across real assets, operating businesses, liquid markets, luxury inventory, and creative infrastructure.
          </p>
          <div className="hero-actions">
            <a href="#capital-desk" data-ripple className="primary-button">Request Allocation</a>
            <a href="#strategies" data-ripple className="secondary-button">Explore Strategies</a>
          </div>
          <div className="hero-stats" aria-label="Firm metrics">
            {heroStats.map((item) => (
              <div key={item.label} className="hero-stat">
                <span><RollingMetric value={item.value} /></span>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
          <div className="architecture-brief">
            <div><span>01 / Generate</span><strong>Transactional liquidity</strong><p>High-conviction asset desks create working capital and live market intelligence.</p></div>
            <div><span>02 / Deploy</span><strong>Durable ownership</strong><p>Capital is directed into real estate, operating businesses, liquid markets, and intellectual property.</p></div>
            <div><span>03 / Compound</span><strong>Institutional continuity</strong><p>Recycled yield expands the platform while preserving optionality across cycles.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
