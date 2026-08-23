import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { supabase } from '../utils/supabaseClient';

const fallbackPosts = [
  { id: 'hvac-acquisitions', title: 'Service Business Acquisitions: The Underpriced Vertical', body: 'HVAC, residential cleaning, and home care businesses in the $500K-$1.5M SDE range represent the most consistently undervalued acquisition targets in the current market. Seller financing remains widely available as aging owner-operators seek clean exits. The Dwarica Group is actively acquiring in this corridor.', category: 'acquisition', created_at: '2026-06-30T12:00:00Z' },
  { id: 'capital-positioning', title: 'Capital Markets Desk: Current Positioning', body: 'Maintaining systematic exposure to volatility premium across equity indices while prediction market positioning continues to generate positive expected value on event-driven outcomes. Position sizing is unit-based. Every thesis is documented before execution.', category: 'trade', created_at: '2026-06-20T12:00:00Z' },
  { id: 'luxury-margins', title: 'Luxury Asset Margins: Why Physical Assets Outperform in Inflationary Regimes', body: 'Reference-grade timepieces from AP, Patek, and Richard Mille have historically outperformed traditional inflation hedges over 5-year horizons. Our dealer network access creates consistent arbitrage between wholesale and secondary market pricing.', category: 'asset', created_at: '2026-06-10T12:00:00Z' },
];

export default function HouseViewPage() {
  const { user, authReady } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(fallbackPosts);

  useEffect(() => {
    if (authReady && (!user || user.is_anonymous)) navigate('/', { replace: true });
  }, [authReady, navigate, user]);

  useEffect(() => {
    if (!user || user.is_anonymous) return undefined;
    let active = true;
    supabase.from('house_view_posts').select('id, title, body, category, created_at').eq('published', true).order('created_at', { ascending: false }).then(({ data }) => {
      if (active && data?.length) setPosts(data);
    }).catch(() => undefined);
    return () => { active = false; };
  }, [user]);

  if (!authReady || !user || user.is_anonymous) return <main className="house-view-loading"><span className="section-kicker">Private access / verifying session</span></main>;
  return <main className="house-view-page"><div className="house-view-inner"><header className="house-view-header"><span className="section-kicker">The House View</span><h1>Proprietary market intelligence.</h1><p>Updated as positions evolve.</p></header><div className="house-view-feed">{posts.map((post, index) => <motion.article key={post.id} className="house-view-post" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: index * .12 }}><span className="house-view-category">{post.category}</span><h2>{post.title}</h2><p>{post.body}</p><time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time></motion.article>)}</div></div></main>;
}
