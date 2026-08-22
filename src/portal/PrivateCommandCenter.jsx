import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDualBrain } from './useDualBrain';
import { supabase } from '../utils/supabaseClient';
import BespokeDiscoveryFeed from './BespokeDiscoveryFeed';
import ErrorBoundary from './ErrorBoundary';
import AuthModal from '../components/AuthModal';

const metrics = [
  ['favorites', 'Saved allocations'],
  ['inquiries', 'Active inquiries'],
  ['consignments', 'Consignment submissions'],
  ['deals', 'Closed deals'],
];

export default function PrivateCommandCenter({ user, activity, loading, signOut, memberSince, syncPulse }) {
  const { dualWrite } = useDualBrain(user);
  const [authOpen, setAuthOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submitMandate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (!user) { setAuthOpen(true); return; }
    dualWrite({ preferences: { last_mandate: form, mandate_updated_at: Date.now() } });
    const { error } = await supabase.from('inquiries').insert({ account_id: user.id, item_name: form.mandate, item_category: 'Private sourcing desk', message: `Target valuation: ${form.valuation}\n${form.detail}`, status: 'received' });
    setSubmitting(false);
    if (!error) { setSubmitted(true); event.currentTarget.reset(); }
  };
  const displayUser = user || { email: 'Preview client' };
  return <section className="command-center-shell"><CommandSidebar onAuth={() => setAuthOpen(true)} /><div className={`command-center ${user ? '' : 'command-center--teaser'}`}><header className="command-center-header"><div><span className="section-kicker">Private client command center</span><h1>Capital, curated around your mandate.</h1><p>{displayUser.email} <span>·</span> {user ? `Member since ${memberSince}` : 'Preview environment'}</p></div><div className="command-center-status"><span className={syncPulse ? 'is-live' : ''} />{syncPulse ? 'Live sync received' : user ? 'Private session active' : 'Teaser preview'}{user ? <button type="button" onClick={signOut}>Sign out</button> : <button type="button" onClick={() => setAuthOpen(true)}>Sign in</button>}</div></header><div className="command-center-grid"><aside className="command-lane command-lane--vault"><div className="command-lane-heading"><span className="portal-zone-label">01 / Active vault</span><strong>Live position record</strong></div><div className="command-metrics">{metrics.map(([key, label]) => <div className="command-metric" key={key}><strong>{activity[key].length}</strong><span>{label}</span></div>)}</div><div className="command-vault-list"><div className="command-subheading"><span>Recent allocations</span><small>{loading ? 'Syncing' : `${activity.favorites.length} recorded`}</small></div>{activity.favorites.length ? activity.favorites.map((item) => <button type="button" className="command-vault-item" key={item.id} onClick={() => setSelected(item)}><span><strong>{item.item_name || item.item_id}</strong><small>{item.item_category || 'Private allocation'} {item.item_price ? `· $${Number(item.item_price).toLocaleString()}` : ''}</small></span><b>→</b></button>) : <div className="command-empty-state"><span>Your vault is ready.</span><p>Save an allocation in the marketplace and it will appear here instantly.</p><Link to="/market">Open marketplace →</Link></div>}</div><div className="command-vault-footer"><span>Affinity engine</span><b>Monitoring live behavior</b></div></aside><main className="command-lane command-lane--discovery"><div className="command-lane-heading"><span className="portal-zone-label">02 / Discovery stream</span><strong>Assets moving through the desk</strong></div><ErrorBoundary><BespokeDiscoveryFeed /></ErrorBoundary></main><aside className="command-lane command-lane--sourcing"><div className="command-lane-heading"><span className="portal-zone-label">03 / Sourcing desk</span><strong>Send a mandate to the principals</strong></div><p className="command-sourcing-intro">Describe the asset, valuation, or reference you want the desk to locate. Your request enters the private review queue immediately.</p>{submitted ? <div className="command-confirmation"><strong>Mandate received.</strong><p>A principal will review your criteria and follow up through your private channel.</p><button type="button" className="secondary-button" onClick={() => setSubmitted(false)}>Submit another mandate</button></div> : <form className="command-sourcing-form" onSubmit={submitMandate}><label>Mandate type<select required name="mandate" defaultValue=""><option value="" disabled>Select a focus</option><option>Specific timepiece or reference</option><option>Automobile acquisition</option><option>Private equity opportunity</option><option>Structured acquisition</option><option>Fine jewelry allocation</option></select></label><label>Target valuation<input required name="valuation" placeholder="$50,000 — $250,000" /></label><label>Brief criteria<textarea required name="detail" placeholder="Reference, geography, return profile, or acquisition criteria..." /></label><button type="submit" className="primary-button" disabled={submitting}>{submitting ? 'Routing securely…' : 'Send to sourcing desk →'}</button></form>}<p className="command-compliance">Fully insured global logistics. All acquisitions are handled securely online via direct shipping.</p></aside></div></div>{!user ? <div className="command-teaser-shield"><div className="command-teaser-card"><span className="section-kicker">Private access required</span><h2>Unlock the live command center.</h2><p>Sign in or request an allocation profile to unlock live vault streaming, favoriting, and direct desk submissions.</p><div><button type="button" className="primary-button" onClick={() => setAuthOpen(true)}>Sign in securely</button><button type="button" className="secondary-button" onClick={() => setAuthOpen(true)}>Request access</button></div></div></div> : null}{authOpen ? <AuthModal onClose={() => setAuthOpen(false)} /> : null}{selected ? <motion.div className="command-quick-drawer" initial={{ x: '100%' }} animate={{ x: 0 }}><button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label="Close allocation details">×</button><span className="portal-zone-label">Vault allocation</span><h2>{selected.item_name || selected.item_id}</h2><p>{selected.item_category || 'Private allocation'} {selected.item_price ? `· $${Number(selected.item_price).toLocaleString()}` : ''}</p><Link to="/market" className="primary-button">Coordinate securely →</Link></motion.div> : null}</section>;
}

function CommandSidebar({ onAuth }) {
  const items = [['Vault & Allocations', '#vault'], ['Timepieces & Fine Jewelry Stream', '/market/timepieces'], ['Automobiles Realm', '/market/automobiles'], ['Firm Pulse & Updates', '#pulse'], ['Sourcing Concierge Desk', '#sourcing'], ['Account Settings & Profile', '#account']];
  return <aside className="command-sidebar"><Link to="/" className="command-sidebar-brand"><span>D</span><strong>DGroup<br /><small>Private workspace</small></strong></Link><div className="command-sidebar-label">Workspace</div><nav>{items.map(([label, target]) => target.startsWith('/') ? <Link key={label} to={target}>{label}<b>↗</b></Link> : <button type="button" key={label} onClick={onAuth}>{label}<b>•••</b></button>)}</nav><div className="command-sidebar-bottom"><span>Access layer</span><strong>Invitation only</strong><button type="button" onClick={onAuth}>Request profile →</button></div></aside>;
}
