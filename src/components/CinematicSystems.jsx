import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function CinematicInteractionSystems() {
  useEffect(() => {
    const cleanups = [];
    let frame = 0;
    let lastScroll = window.scrollY;
    let velocity = 0;

    const updateVelocity = () => {
      velocity += (window.scrollY - lastScroll - velocity) * 0.14;
      lastScroll = window.scrollY;
      document.documentElement.style.setProperty('--scroll-velocity', `${Math.max(-12, Math.min(12, velocity * 0.18))}deg`);
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateVelocity); };
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanups.push(() => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); });

    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-iris-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    const wireElements = () => {
      document.querySelectorAll('[data-iris]:not([data-iris-ready])').forEach((element) => { element.dataset.irisReady = 'true'; revealObserver.observe(element); });
      document.querySelectorAll('[data-velocity]:not([data-velocity-ready])').forEach((element) => { element.dataset.velocityReady = 'true'; });
    };
    wireElements();
    const mutationObserver = new MutationObserver(wireElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => { revealObserver.disconnect(); mutationObserver.disconnect(); });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);
  return null;
}

export function FilmGrainOverlay() {
  return <div className="film-grain-overlay" aria-hidden="true" />;
}

export function RollingMetric({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 900, 1);
      setDisplay(Math.round(value * (1 - ((1 - progress) ** 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <motion.span initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{display}</motion.span>;
}

export function TelemetryDrawer({ item, onClose, category = 'Private asset' }) {
  return <AnimatePresence>
    {item ? <motion.div className="telemetry-drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.aside className="telemetry-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 240 }} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${item.model || item.name} specifications`}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close asset telemetry"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        <span className="section-kicker">{category} / Telemetry</span>
        <h2>{item.model || item.name}</h2>
        <p className="telemetry-drawer-lead">Private intelligence packet / authenticated desk record</p>
        <div className="telemetry-spec-grid">
          {Object.entries(item).filter(([key]) => !['id', 'detail', 'model', 'name'].includes(key) && typeof item[key] !== 'object').slice(0, 8).map(([key, value]) => <div key={key}><span>{key.replaceAll('_', ' ')}</span><strong>{String(value || 'On file')}</strong></div>)}
        </div>
        <p className="telemetry-drawer-detail">{item.detail || 'Complete provenance, service, and delivery intelligence is held in the private desk file.'}</p>
        <div className="telemetry-drawer-status"><span className="telemetry-pulse" /> Desk record available / principal review on request</div>
      </motion.aside>
    </motion.div> : null}
  </AnimatePresence>;
}
