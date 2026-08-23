import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ManifestoSection from './components/ManifestoSection';
import FirmIdentitySection from './components/FirmIdentitySection';
import CompoundingEngineFlow from './components/CompoundingEngineFlow';
import SevenStrategiesAccordion from './components/SevenStrategiesAccordion';
import InvestorPitchSection from './components/InvestorPitchSection';
import CapitalMarketsSection from './components/CapitalMarketsSection';
import PrincipalsSection from './components/PrincipalsSection';
import JoinFirmSection from './components/JoinFirmSection';
import CapitalDeskSection from './components/CapitalDeskSection';
import MarketGateway from './market/MarketGateway';
import TimepiecesRealm from './market/TimepiecesRealm';
import AutomobilesRealm from './market/AutomobilesRealm';
import ConsignmentRealm from './market/ConsignmentRealm';
import { useAuth } from './context/useAuth';
import PortalPage from './portal/PortalPage';
import HeadingMotionSystem from './components/HeadingMotionSystem';
import ScrollRevealSystem from './components/ScrollRevealSystem';
import SmoothScrollSystem from './components/SmoothScrollSystem';
import AuthCallbackPage from './pages/AuthCallbackPage';
import LPPortalPage from './pages/LPPortalPage';
import PasswordResetPage from './pages/PasswordResetPage';
import { supabase } from './utils/supabaseClient';
import { CinematicInteractionSystems, FilmGrainOverlay, LiveTelemetryBar } from './components/CinematicSystems';
import AUMVisualizer from './components/AUMVisualizer';
import MarketTicker from './components/MarketTicker';
import HouseViewPage from './pages/HouseViewPage';

function HomePage() {
  return (
    <>
      <HeroSection />
      <FirmIdentitySection />
      <CompoundingEngineFlow />
      <SevenStrategiesAccordion />
      <AUMVisualizer />
      <ManifestoSection />
      <InvestorPitchSection />
      <CapitalMarketsSection />
      <PrincipalsSection />
      <JoinFirmSection />
      <CapitalDeskSection />
      <footer className="site-footer">
        <span>THE DWARICA GROUP</span>
        <span>Private capital architecture / New York / London / Dubai</span>
      </footer>
    </>
  );
}

function FloatingAllocationCta() {
  useEffect(() => {
    const hero = document.querySelector('#hero');
    const footer = document.querySelector('.site-footer');
    const button = document.querySelector('.floating-allocation-cta');
    if (!button) return undefined;
    const heroObserver = hero ? new IntersectionObserver(([entry]) => button.classList.toggle('is-visible', !entry.isIntersecting), { threshold: 0.05 }) : null;
    const footerObserver = footer ? new IntersectionObserver(([entry]) => button.classList.toggle('footer-nearby', entry.isIntersecting), { threshold: 0.1 }) : null;
    if (heroObserver && hero) heroObserver.observe(hero);
    if (footerObserver && footer) footerObserver.observe(footer);
    return () => { heroObserver?.disconnect(); footerObserver?.disconnect(); };
  }, []);
  return (
    <a href="#capital-desk" data-ripple className="floating-allocation-cta">
      <span>Request Allocation</span>
      <strong>→</strong>
    </a>
  );
}

function CardTiltSystem() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const cards = [...document.querySelectorAll('.join-panel, .investor-pitch-section .strategy-meta-card')];
    const cleanups = cards.map((card) => {
      const move = (event) => {
        const bounds = card.getBoundingClientRect();
        const x = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;
        const y = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
        card.style.transform = `perspective(1000px) rotateX(${Math.max(-5, Math.min(5, x))}deg) rotateY(${Math.max(-5, Math.min(5, y))}deg)`;
      };
      const leave = () => { card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'; };
      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', leave);
      return () => { card.removeEventListener('mousemove', move); card.removeEventListener('mouseleave', leave); };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}

function AuthSessionRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/auth/callback') navigate('/portal');
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (location.pathname !== '/auth/callback') return;
    supabase.auth.getSession().then(({ data: { session } }) => navigate(session ? '/portal' : '/', { replace: true }));
  }, [location.pathname, navigate]);

  return null;
}

function EmailAccessModal() {
  const { emailPrompt, setEmailPrompt, submitEmailAccess } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { if (emailPrompt) { setEmail(''); setError(''); } }, [emailPrompt]);
  const close = () => { setError(''); setEmail(''); setEmailPrompt(null); };
  const submit = async (event) => {
    event.preventDefault();
    const result = await submitEmailAccess(email);
    if (!result.ok) setError(result.message || 'Please try again.');
    else setEmail('');
  };
  const isInquiry = emailPrompt?.type === 'inquiry';
  return <AnimatePresence>{emailPrompt ? <motion.div className="market-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><motion.div className="market-modal access-modal" initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .98 }} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="private-access-title"><button type="button" className="modal-close" onClick={close} aria-label="Close access form"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg></button><span className="section-kicker">Private access</span><h2 id="private-access-title">{isInquiry ? 'Continue your private inquiry.' : 'Save your private selections.'}</h2><p>Enter your email to receive a secure magic link and {isInquiry ? 'continue with a principal.' : 'access the full details.'}</p><form onSubmit={submit}><label className="sr-only" htmlFor="access-email">Email address</label><input id="access-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Direct email" autoFocus /><button type="submit" data-ripple className="primary-button">{isInquiry ? 'Continue securely' : 'Save my picks'}</button>{error ? <span className="success-note" role="alert">{error}</span> : null}</form></motion.div></motion.div> : null}</AnimatePresence>;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F7]">
      <MarketTicker />
      <Navigation />
      <main>
        <AuthSessionRedirect />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/market" element={<MarketGateway />} />
          <Route path="/market/timepieces" element={<TimepiecesRealm />} />
          <Route path="/market/automobiles" element={<AutomobilesRealm />} />
          <Route path="/market/consign" element={<ConsignmentRealm />} />
          <Route path="/dashboard" element={<PortalPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/auth/reset" element={<PasswordResetPage />} />
          <Route path="/lp-portal" element={<LPPortalPage />} />
          <Route path="/house-view" element={<HouseViewPage />} />
        </Routes>
      </main>
      <FloatingAllocationCta />
      <EmailAccessModal />
      <HeadingMotionSystem />
      <CardTiltSystem />
      <ScrollRevealSystem />
      <SmoothScrollSystem />
      <CinematicInteractionSystems />
      <FilmGrainOverlay />
      <LiveTelemetryBar />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
