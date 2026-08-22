import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { supabase } from '../utils/supabaseClient';

export default function DashboardShell() {
  const { user, savedItems, unlockedDossiers, requestAccess, toastMessage, lastAction } = useAuth();
  const [activity, setActivity] = useState({ favorites: [], inquiries: [], consignments: [], deals: [] });
  const [loading, setLoading] = useState(true);
  const clientName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Private client';
  const recentAction = lastAction?.assetId ? `${lastAction.type.replaceAll('_', ' ')} / ${lastAction.assetId.replaceAll('-', ' ')}` : 'No recent activity';

  useEffect(() => {
    let cancelled = false;
    const loadActivity = async () => {
      if (!user || user.is_anonymous) { setLoading(false); return; }
      const [favorites, inquiries, consignments, deals] = await Promise.all([
        supabase.from('favorites').select('*').eq('account_id', user.id).order('created_at', { ascending: false }),
        supabase.from('inquiries').select('*').eq('account_id', user.id).order('created_at', { ascending: false }),
        supabase.from('consignment_submissions').select('*').eq('account_id', user.id).order('created_at', { ascending: false }),
        supabase.from('closed_deals').select('*').eq('account_id', user.id).order('closed_at', { ascending: false }),
      ]);
      if (!cancelled) {
        setActivity({ favorites: favorites.data || [], inquiries: inquiries.data || [], consignments: consignments.data || [], deals: deals.data || [] });
        setLoading(false);
      }
    };
    loadActivity();
    return () => { cancelled = true; };
  }, [user]);

  const handleInquiry = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await requestAccess('allocation_desk_inquiry', { source: 'dashboard', ...Object.fromEntries(formData.entries()) });
    event.currentTarget.reset();
  };

  return (
    <section className="dashboard-shell">
      <div className="dashboard-header">
        <div>
          <span className="section-kicker">Private portal / {clientName}</span>
          <h1 className="section-title">A private view of your DGroup activity.</h1>
        </div>
        <Link to="/market" className="back-link">Marketplace</Link>
      </div>
      <div className="dashboard-grid">
        <article className="dashboard-zone">
          <span className="dashboard-zone-label">01 / Activity</span>
          <h2>Vault activity</h2>
          <p>{loading ? 'Loading your private activity.' : `${activity.favorites.length} saved allocation${activity.favorites.length === 1 ? '' : 's'}, ${activity.inquiries.length} quer${activity.inquiries.length === 1 ? 'y' : 'ies'}, ${activity.consignments.length} consignment${activity.consignments.length === 1 ? '' : 's'}, and ${activity.deals.length} closed deal${activity.deals.length === 1 ? '' : 's'}.`}</p>
          <div className="dashboard-current"><span>Current client signal</span><strong>{recentAction}</strong></div>
          <div className="dashboard-list">
            {activity.favorites.map((item) => <span key={`favorite-${item.id}`}>{item.item_name || item.item_id}<small>{item.item_category || 'Saved item'} / {item.item_price ? `$${Number(item.item_price).toLocaleString()}` : 'Private allocation'}</small></span>)}
            {activity.inquiries.map((item) => <span key={`inquiry-${item.id}`}>{item.item_name || 'Allocation inquiry'}<small>Status: {item.status || 'received'}</small></span>)}
            {activity.consignments.map((item) => <span key={`consignment-${item.id}`}>{item.item_description || 'Consignment submission'}<small>Status: {item.status || 'received'} / Views: {item.view_count || 0}</small></span>)}
            {activity.deals.map((item) => <span key={`deal-${item.id}`}>{item.item_name || 'Closed deal'}<small>Closed / {item.sale_price ? `$${Number(item.sale_price).toLocaleString()}` : 'Private terms'}</small></span>)}
            {!loading && !activity.favorites.length && !activity.inquiries.length && !activity.consignments.length && !activity.deals.length ? <span>Your activity will appear here as the firm works with you.</span> : null}
          </div>
        </article>
        <article className="dashboard-zone">
          <span className="dashboard-zone-label">02 / Firm Pulse</span>
          <h2>Compound velocity</h2>
          <div className="firm-pulse-copy"><p>The acquisition desk continues to review proprietary operating businesses where durable cash flow and motivated ownership create an attractive basis for long-term control.</p><p>Real asset underwriting remains focused on income quality, location, and the relationship between current yield and future value.</p><p>Across liquid markets and private opportunities, the firm is preserving flexibility so capital can move when pricing becomes more rational.</p></div>
        </article>
        <article className="dashboard-zone dashboard-zone--discover">
          <span className="dashboard-zone-label">03 / Discover</span>
          <h2>Continue through the doors.</h2>
          <p>{activity.favorites.length ? 'New arrivals matching your interests.' : 'Your DGroup access is active. Explore what we have available.'}</p>
          <div className="dashboard-discover-links"><Link to="/market/timepieces">Timepieces & Fine Jewelry</Link><Link to="/market/automobiles">Automobiles</Link><Link to="/market/consign">Consignment & Placements</Link></div>
        </article>
      </div>
    </section>
  );
}
