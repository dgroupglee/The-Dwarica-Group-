import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { useAffinity } from './useAffinity';
import { useDiscoveryFeed } from './useDiscoveryFeed';
import { supabase } from '../utils/supabaseClient';

const SPRING = { type: 'spring', stiffness: 180, damping: 24, mass: 1.2 };

function ConciergeCard({ onSubmit }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const submit = (event) => {
    event.preventDefault();
    onSubmit(email);
    setOpen(false);
    setEmail('');
  };
  return <motion.article className="discovery-concierge-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
    <span className="portal-zone-label">Sourcing desk / bespoke allocation</span>
    <h3>Looking for a specific allocation?</h3>
    <p>Our sourcing desk can acquire bespoke timepieces and vehicles within 48 hours.</p>
    <p className="discovery-compliance">Fully insured global logistics. All acquisitions are handled securely online via direct shipping.</p>
    {open ? <form onSubmit={submit} className="discovery-concierge-form"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Direct email" aria-label="Direct email" /><button className="primary-button" type="submit">Submit inquiry</button></form> : <button type="button" className="secondary-button" onClick={() => setOpen(true)}>Submit inquiry →</button>}
  </motion.article>;
}

function DiscoveryCard({ item, observeCard, savedItems, toggleFavorite, onInquire }) {
  const saved = savedItems.includes(item.id);
  return <motion.article ref={observeCard} data-reference={item.reference} data-brand={item.brand} data-price={item.price} className="discovery-card" initial={{ opacity: 0, y: 28, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={SPRING}>
    <div className="discovery-card-image"><span>{item.category}</span><b>{item.brand}</b></div>
    <div className="discovery-card-copy"><span className="discovery-lane">{item.lane}</span><h3>{item.title}</h3><p>{item.descriptor}</p><div className="discovery-card-meta"><strong>{item.price ? `$${Number(item.price).toLocaleString()}` : 'Private terms'}</strong><code>{item.reference}</code></div></div>
    <div className="discovery-card-actions"><button type="button" className={saved ? 'discovery-favorite is-saved' : 'discovery-favorite'} onClick={() => toggleFavorite({ id: item.id, name: item.title, category: item.category, price: item.price })} aria-label={saved ? `Remove ${item.title}` : `Save ${item.title}`}>{saved ? 'Saved' : 'Save to vault'}</button><button type="button" className="discovery-inquire" onClick={() => onInquire(item)}>Request details →</button></div>
  </motion.article>;
}

function VirtualDiscoveryList({ feed, renderItem }) {
  const viewportRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const itemHeight = 430;
  const overscan = 3;
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const end = Math.min(feed.length, start + 1 + overscan * 2);
  const visible = feed.slice(start, end);
  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;
    const onScroll = () => setScrollTop(node.scrollTop);
    node.addEventListener('scroll', onScroll, { passive: true });
    return () => node.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="discovery-feed-viewport" ref={viewportRef} aria-label="Curated private discovery feed"><div style={{ height: `${feed.length * itemHeight}px`, position: 'relative' }}><div className="discovery-feed-window" style={{ transform: `translateY(${start * itemHeight}px)` }}>{visible.map((item, index) => renderItem(item, start + index))}</div></div></div>;
}

export default function BespokeDiscoveryFeed() {
  const { user, savedItems, toggleFavorite, requestAccess, toastMessage } = useAuth();
  const { affinity, topBrand, observeCard } = useAffinity(user);
  const feed = useDiscoveryFeed({ ...affinity, topBrand });
  const [inquiryItem, setInquiryItem] = useState(null);
  const [liveNotice, setLiveNotice] = useState('');

  useEffect(() => {
    if (!user || user.is_anonymous) return undefined;
    let cleanup = () => undefined;
    supabaseChannel(user.id, (message) => {
      setLiveNotice(message);
      window.setTimeout(() => setLiveNotice(''), 2600);
    }).then((dispose) => { cleanup = dispose; });
    return () => cleanup();
  }, [user]);

  const handleInquiry = async (item) => {
    setInquiryItem(null);
    const result = await requestAccess('discovery_inquiry', { item_name: item.title, item_category: item.category, item_reference: item.reference, source: 'bespoke-discovery' });
    if (result?.ok) setLiveNotice('Your sourcing desk request is now in review.');
  };
  const handleConcierge = async (email) => {
    const result = await requestAccess('sourcing_desk_request', { email, source: 'bespoke-discovery' });
    setLiveNotice(result?.message || 'Your sourcing request is now in review.');
  };
  const feedLabel = useMemo(() => `${affinity.dwellEvents.length} passive signal${affinity.dwellEvents.length === 1 ? '' : 's'} captured`, [affinity.dwellEvents.length]);
  return <section className="bespoke-discovery-engine"><div className="discovery-engine-header"><div><span className="portal-zone-label">03 / Bespoke discovery engine</span><h2>A private loop around your point of view.</h2><p>Curated from your saved record, passive dwell signals, and the firm’s live desk intelligence.</p></div><div className="discovery-telemetry-readout"><span>{feedLabel}</span><strong>{affinity.target_budget ? `$${Math.round(affinity.target_budget).toLocaleString()}` : '$50,000'} target budget</strong>{topBrand ? <small>Preference signal / {topBrand}</small> : <small>Preference signal / forming</small>}</div></div>{liveNotice || toastMessage ? <div className="discovery-live-banner" role="status"><span />{liveNotice || toastMessage}</div> : null}<VirtualDiscoveryList feed={feed} renderItem={(item, index) => item.type === 'concierge' ? <ConciergeCard key={item.id} onSubmit={handleConcierge} /> : <DiscoveryCard key={item.id} item={item} observeCard={observeCard} savedItems={savedItems} toggleFavorite={toggleFavorite} onInquire={setInquiryItem} />}/><AnimatePresence>{inquiryItem ? <motion.div className="discovery-inquiry-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={SPRING}><button type="button" className="modal-close" onClick={() => setInquiryItem(null)} aria-label="Close inquiry">×</button><span className="portal-zone-label">Private request</span><h3>{inquiryItem.title}</h3><p>{inquiryItem.brand} / {inquiryItem.reference}</p><button type="button" className="primary-button" onClick={() => handleInquiry(inquiryItem)}>Send to sourcing desk</button></motion.div> : null}</AnimatePresence></section>;
}

function supabaseChannel(userId, onMessage) {
  // Kept in a tiny adapter so the feed can remain locally testable when Supabase is not configured.
  try {
    const channel = supabase.channel('user-session').on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => onMessage('The inventory desk has synchronized a new allocation.')).on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries', filter: `account_id=eq.${userId}` }, () => onMessage('Your private inquiry status has synchronized.')).subscribe();
    return Promise.resolve(() => { supabase.removeChannel(channel); });
  } catch {
    return Promise.resolve(() => undefined);
  }
}
