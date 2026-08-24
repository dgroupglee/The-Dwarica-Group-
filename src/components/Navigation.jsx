import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';

const navItems = [
  { label: 'Strategies', href: '#strategies' },
  { label: 'Engine', href: '#compounding-engine' },
  { label: 'Vision', href: '#manifesto' },
  { label: 'Capital Desk', href: '#capital-desk' },
];

export default function Navigation() {
  const { savedItems, user } = useAuth();
  const authenticated = Boolean(user && !user.is_anonymous);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { setMobileOpen(false); return; }
      if (event.key !== 'Tab') return;
      const menu = document.getElementById('mobile-navigation');
      const focusable = menu ? [...menu.querySelectorAll('a, button')].filter((item) => !item.disabled) : [];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[82px] w-full max-w-[1420px] items-center justify-between gap-5 px-4 md:px-6">
        <div className="flex-1">
          <Link to="/" className="flex items-center text-white no-underline">
            <span className="mr-3 grid h-[34px] w-[34px] place-items-center border border-[#C5A059] text-sm font-medium text-[#C5A059]">
              D
            </span>
            <span className="font-serif text-xl uppercase tracking-[0.18em] text-white md:text-2xl">
              The Dwarica Group
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-[10px] uppercase tracking-[0.22em] text-white/70 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} to={`/${item.href}`} className="transition hover:text-[#C5A059]">
              {item.label}
            </Link>
          ))}
          <Link to="/portal" className="transition hover:text-[#C5A059]">Private Portal</Link>
          <Link to="/lp-portal" className="transition hover:text-[#C5A059]">LP Portal</Link>
          {authenticated ? <Link to="/house-view" className="transition hover:text-[#C5A059]">House View</Link> : null}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-white/10 text-white transition hover:border-[#C5A059] hover:text-[#C5A059] md:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <motion.path d={mobileOpen ? 'M5 5L19 19' : 'M4 7H20'} animate={{ pathLength: 1 }} />
              <motion.path d={mobileOpen ? 'M19 5L5 19' : 'M4 12H20'} animate={{ pathLength: 1 }} />
              {!mobileOpen ? <motion.path d="M4 17H20" animate={{ pathLength: 1 }} /> : null}
            </svg>
          </button>
          <Link
            to="/dashboard"
            aria-label={`Private access vault, ${savedItems.length} saved items`}
            title="Private access"
            className="private-vault-access relative inline-flex h-11 w-11 items-center justify-center border border-white/10 bg-white/0 text-white transition hover:border-[#C5A059] hover:text-[#C5A059]"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 8.5h16v11H4zM6.5 8.5V6.8A2.8 2.8 0 0 1 9.3 4h5.4a2.8 2.8 0 0 1 2.8 2.8v1.7M9 12h6M9 15h6" />
            </svg>
            {savedItems.length > 0 ? <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#C5A059] px-1 text-[9px] font-semibold text-[#0A0A0A]">{savedItems.length}</span> : null}
          </Link>
          <Link
            to="/market"
            data-ripple
            className="inline-flex items-center justify-center border border-[#C5A059]/80 bg-[#C5A059]/10 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white shadow-[0_0_30px_rgba(197,160,89,0.12)] transition"
          >
            [ Marketplace ]
          </Link>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <motion.nav
            id="mobile-navigation"
            className="border-t border-white/10 px-4 pb-5 md:hidden"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="mx-auto flex w-full max-w-[1420px] flex-col gap-1 pt-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={`/${item.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-white/5 px-2 py-4 text-[10px] uppercase tracking-[0.22em] text-white/70 transition hover:text-[#C5A059]"
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/market" onClick={() => setMobileOpen(false)} className="px-2 py-4 text-[10px] uppercase tracking-[0.22em] text-[#C5A059]">Marketplace</Link>
              <Link to="/portal" onClick={() => setMobileOpen(false)} className="px-2 py-4 text-[10px] uppercase tracking-[0.22em] text-white/70 transition hover:text-[#C5A059]">Private Portal</Link>
              <Link to="/lp-portal" onClick={() => setMobileOpen(false)} className="px-2 py-4 text-[10px] uppercase tracking-[0.22em] text-white/70 transition hover:text-[#C5A059]">LP Portal</Link>
              {authenticated ? <Link to="/house-view" onClick={() => setMobileOpen(false)} className="px-2 py-4 text-[10px] uppercase tracking-[0.22em] text-white/70 transition hover:text-[#C5A059]">House View</Link> : null}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
