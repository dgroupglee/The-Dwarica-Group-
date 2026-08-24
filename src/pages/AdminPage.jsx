import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { supabase } from '../utils/supabaseClient';

const ADMIN_ROLES = new Set(['admin', 'principal', 'co_principal']);
const REQUEST_STATES = ['received', 'reviewing', 'sourcing', 'reserved', 'closed'];

function roleFor(user) {
  return String(user?.app_metadata?.role || '').toLowerCase();
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function Metric({ label, value }) {
  return <article className="admin-metric"><span>{label}</span><strong>{value}</strong></article>;
}

export default function AdminPage() {
  const { user, authReady } = useAuth();
  const [records, setRecords] = useState({ accounts: [], favorites: [], inquiries: [], consignments: [], audit: [], listings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('inquiries');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState('');

  const isAdmin = ADMIN_ROLES.has(roleFor(user));

  useEffect(() => {
    if (!authReady || !user || !isAdmin) { setLoading(false); return undefined; }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const results = await Promise.all([
        supabase.from('accounts').select('id,email,account_type,created_at').order('created_at', { ascending: false }).limit(100),
        supabase.from('favorites').select('id,account_id,item_id,item_name,item_category,item_price,created_at').order('created_at', { ascending: false }).limit(100),
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('consignment_submissions').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('listings').select('*').order('created_at', { ascending: false }).limit(100),
      ]);
      const failed = results.find((result) => result.error && !String(result.error.message || '').includes('does not exist'));
      if (cancelled) return;
      if (failed) setError(failed.error.message);
      setRecords({ accounts: results[0].data || [], favorites: results[1].data || [], inquiries: results[2].data || [], consignments: results[3].data || [], audit: results[4].data || [], listings: results[5].data || [] });
      setLoading(false);
    };
    load().catch((loadError) => { if (!cancelled) { setError(loadError.message || 'Unable to load operations data.'); setLoading(false); } });
    const channel = supabase.channel('admin-operations-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, load)
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [authReady, isAdmin, user]);

  const updateInquiry = async (id, status) => {
    setSaving(id);
    const { error: updateError } = await supabase.from('inquiries').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (updateError) setError(updateError.message);
    else setRecords((current) => ({ ...current, inquiries: current.inquiries.map((item) => item.id === id ? { ...item, status } : item) }));
    setSaving('');
  };

  const updateListing = async (listing) => {
    const nextAvailable = !listing.available;
    setSaving(listing.id);
    const { error: updateError } = await supabase.from('listings').update({ available: nextAvailable, status: nextAvailable ? 'Available' : 'Reserved', updated_at: new Date().toISOString() }).eq('id', listing.id);
    if (updateError) setError(updateError.message);
    else setRecords((current) => ({ ...current, listings: current.listings.map((item) => item.id === listing.id ? { ...item, available: nextAvailable, status: nextAvailable ? 'Available' : 'Reserved' } : item) }));
    setSaving('');
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const source = records[activeView] || [];
    if (!term) return source;
    return source.filter((item) => JSON.stringify(item).toLowerCase().includes(term));
  }, [activeView, records, search]);

  if (!authReady) return <main className="admin-page"><div className="admin-state">Verifying operations access…</div></main>;
  if (!user) return <main className="admin-page"><div className="admin-state"><span className="section-kicker">Operations access</span><h1>Sign in to continue.</h1><p>The operations console requires a principal account with an explicit server-issued role.</p><Link className="primary-button" to="/portal">Return to portal</Link></div></main>;
  if (!isAdmin) return <main className="admin-page"><div className="admin-state"><span className="section-kicker">Restricted operations</span><h1>Access not provisioned.</h1><p>Your session is valid, but it does not carry an approved operations role. Ask a principal to provision access through Supabase Auth.</p><Link className="secondary-button" to="/portal">Return to portal</Link></div></main>;

  return <main className="admin-page"><div className="admin-inner"><header className="admin-header"><div><span className="section-kicker">Principal operations / oversight terminal</span><h1>Operating control.</h1><p>{user.email} · Role {roleFor(user)} · Last refresh {formatDate(new Date())}</p></div><Link to="/portal" className="back-link">Client portal →</Link></header>{error ? <div className="admin-notice" role="alert">Some operational data is unavailable: {error}</div> : null}<section className="admin-metrics"><Metric label="Accounts" value={records.accounts.length} /><Metric label="Allocation inquiries" value={records.inquiries.length} /><Metric label="Consignment files" value={records.consignments.length} /><Metric label="Audit events" value={records.audit.length} /><Metric label="Tracked listings" value={records.listings.length} /></section><nav className="admin-tabs" aria-label="Operations views">{[['inquiries', 'Requests'], ['consignments', 'Consignments'], ['accounts', 'Accounts'], ['favorites', 'Saved assets'], ['audit', 'Audit log'], ['listings', 'Inventory']].map(([key, label]) => <button type="button" key={key} className={activeView === key ? 'is-active' : ''} onClick={() => setActiveView(key)}>{label}</button>)}</nav><label className="admin-search">Search operations<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Email, asset, request, or status" /></label><section className="admin-record-list" aria-live="polite">{loading ? <div className="admin-empty">Loading operational records…</div> : filtered.length ? filtered.map((item) => <article className="admin-record" key={item.id || `${activeView}-${JSON.stringify(item)}`}><div><span>{item.item_category || item.action || activeView}</span><strong>{item.item_name || item.email || item.item_id || item.title || 'Operational record'}</strong><small>{item.account_id || item.user_id || item.brand || ''} · {formatDate(item.created_at || item.closed_at)}</small></div>{activeView === 'inquiries' ? <select value={item.status || 'received'} disabled={saving === item.id} onChange={(event) => updateInquiry(item.id, event.target.value)} aria-label={`Update status for ${item.item_name || 'inquiry'}`}>{REQUEST_STATES.map((status) => <option key={status} value={status}>{status}</option>)}</select> : activeView === 'listings' ? <button type="button" className="admin-record-action" disabled={saving === item.id} onClick={() => updateListing(item)}>{item.available ? 'Mark reserved' : 'Mark available'}</button> : <span className="admin-record-status">{item.status || item.classification || 'Recorded'}</span>}</article>) : <div className="admin-empty">No records match this view.</div>}</section></div></main>;
}
