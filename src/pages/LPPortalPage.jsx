import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/useAuth';

const lpRoles = new Set(['lp', 'limited_partner', 'limited-partner', 'admin', 'principal']);

const documents = [
  { id: 'ppm-2026', category: 'PPMs & Offering Circulars', title: 'DGroup Multi-Strategy Fund I / Private Placement Memorandum', date: 'Jun 30, 2026', size: '4.8 MB', classification: 'LP confidential', type: 'PDF' },
  { id: 'offering-circular', category: 'PPMs & Offering Circulars', title: 'Offering Circular / Real Assets Continuation Vehicle', date: 'May 18, 2026', size: '2.1 MB', classification: 'LP confidential', type: 'PDF' },
  { id: 'call-q2', category: 'Capital Calls & Distributions', title: 'Capital Call Notice / Q2 2026', date: 'Jun 12, 2026', size: '384 KB', classification: 'Action required', type: 'PDF' },
  { id: 'distribution-q1', category: 'Capital Calls & Distributions', title: 'Distribution Slip / Q1 2026 Real Assets', date: 'Apr 07, 2026', size: '212 KB', classification: 'LP confidential', type: 'PDF' },
  { id: 'quarterly-q2', category: 'Performance & Audited Statements', title: 'Quarterly Performance Report / Q2 2026', date: 'Jul 15, 2026', size: '1.7 MB', classification: 'LP confidential', type: 'PDF' },
  { id: 'audit-2025', category: 'Performance & Audited Statements', title: 'Audited Financial Statements / FY 2025', date: 'Mar 28, 2026', size: '3.6 MB', classification: 'Audited', type: 'PDF' },
  { id: 'k1-2025', category: 'Tax Documentation', title: 'K-1 Tax Package / FY 2025', date: 'Mar 01, 2026', size: '624 KB', classification: 'Tax sensitive', type: 'PDF' },
];

const categories = [...new Set(documents.map((document) => document.category))];

function AccessGate({ onOpenAuth, pending }) {
  return <main className="lp-access-page"><div className="lp-access-card"><span className="section-kicker">Limited partner access / secure gateway</span><div className="lp-access-mark">D<span>G</span></div><h1>The investor record is private by design.</h1><p>Verified limited partners can review offering documents, capital activity, performance reporting, and tax materials inside the DGroup LP Vault.</p><div className="lp-access-actions"><button type="button" className="primary-button" data-ripple onClick={onOpenAuth}>Sign in for LP access</button><Link to="/" className="secondary-button">Return to the firm</Link></div>{pending ? <p className="lp-access-note" role="status">Your account is authenticated, but LP verification is still pending. Contact the private capital team for access.</p> : <small className="lp-access-disclaimer">Access is limited to verified LP accounts. Offering terms and document availability are determined by the private capital team.</small>}</div></main>;
}

function SummaryCard({ label, value, detail, tone = '' }) {
  return <article className={`lp-summary-card ${tone}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

function PerformancePanel() {
  return <section className="lp-analytics-grid"><article className="lp-panel lp-performance-panel"><div className="lp-panel-heading"><div><span className="portal-zone-label">01 / Net asset value</span><h2>Fund performance</h2></div><span className="lp-status-badge">Illustrative snapshot</span></div><div className="lp-chart-wrap"><svg viewBox="0 0 760 260" role="img" aria-labelledby="lp-performance-title lp-performance-description"><title id="lp-performance-title">Illustrative fund performance curve</title><desc id="lp-performance-description">An upward indexed performance curve from January through June with a secondary benchmark line.</desc><g className="lp-chart-grid" aria-hidden="true">{[40, 90, 140, 190, 240].map((y) => <line key={`h-${y}`} x1="0" x2="760" y1={y} y2={y} />)}{[80, 220, 360, 500, 640].map((x) => <line key={`v-${x}`} x1={x} x2={x} y1="18" y2="240" />)}</g><path className="lp-chart-area" d="M0 208 C86 196 120 202 182 166 S286 154 350 144 S454 116 516 90 S640 76 760 38 L760 240 L0 240Z" /><path pathLength="1" className="lp-chart-line lp-chart-line--primary" d="M0 208 C86 196 120 202 182 166 S286 154 350 144 S454 116 516 90 S640 76 760 38" /><path pathLength="1" className="lp-chart-line lp-chart-line--benchmark" d="M0 216 C100 212 150 208 230 194 S330 188 410 176 S550 166 620 150 S700 144 760 134" /></svg><div className="lp-chart-axis"><span>Jan 26</span><span>Mar 26</span><span>Jun 26</span></div></div><div className="lp-chart-legend"><span><i className="lp-legend-line lp-legend-line--primary" />DGroup NAV / 118.4</span><span><i className="lp-legend-line lp-legend-line--benchmark" />Reference benchmark / 106.2</span></div></article><article className="lp-panel lp-allocation-panel"><div className="lp-panel-heading"><div><span className="portal-zone-label">02 / Allocation posture</span><h2>Capital at work</h2></div><span className="lp-panel-value">$24.8M</span></div><div className="lp-allocation-list"><div><span><i className="lp-dot lp-dot--gold" />Real assets</span><strong>42%</strong><b><i style={{ width: '42%' }} /></b></div><div><span><i className="lp-dot lp-dot--silver" />Operating equity</span><strong>28%</strong><b><i style={{ width: '28%' }} /></b></div><div><span><i className="lp-dot lp-dot--soft" />Liquid strategies</span><strong>18%</strong><b><i style={{ width: '18%' }} /></b></div><div><span><i className="lp-dot lp-dot--muted" />Cash & reserves</span><strong>12%</strong><b><i style={{ width: '12%' }} /></b></div></div><div className="lp-liquidity-readout"><span>Liquidity coverage</span><strong>14.6 months</strong><small>Above current operating reserve target</small></div></article></section>;
}

function DocumentRow({ document, onView, onDownload }) {
  return <article className="lp-document-row"><div className="lp-document-icon" aria-hidden="true">{document.type}</div><div className="lp-document-copy"><h3>{document.title}</h3><div><span>{document.category}</span><span>{document.date}</span><span>{document.size}</span></div></div><span className={`lp-document-tag ${document.classification === 'Action required' ? 'lp-document-tag--action' : ''}`}>{document.classification}</span><div className="lp-document-actions"><button type="button" onClick={() => onView(document)}>View</button><button type="button" onClick={() => onDownload(document)}>Secure download</button></div></article>;
}

export default function LPPortalPage() {
  const { user, authReady } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const role = String(user?.app_metadata?.role || user?.user_metadata?.role || user?.user_metadata?.account_type || '').toLowerCase();
  const verifiedLp = Boolean(user && !user.is_anonymous && lpRoles.has(role));
  const pendingAccess = Boolean(user && !user.is_anonymous && !verifiedLp);
  const documentCount = useMemo(() => documents.length, []);

  if (!authReady) return <main className="lp-access-page"><div className="lp-access-card"><span className="section-kicker">Secure investor gateway</span><h1>Verifying access...</h1><p>Establishing your private session before opening the LP Vault.</p></div></main>;
  if (!verifiedLp) return <><AccessGate pending={pendingAccess} onOpenAuth={() => setAuthOpen(true)} />{authOpen ? <AuthModal gated onClose={() => setAuthOpen(false)} /> : null}</>;

  const handleDownload = (document) => {
    setNotice(`Secure download request queued for ${document.title}.`);
    window.setTimeout(() => setNotice(''), 4200);
  };

  return <main className="lp-workspace"><div className="lp-workspace-inner"><header className="lp-workspace-header"><div><span className="section-kicker">Limited partner portal / verified session</span><h1>Capital, reported with precision.</h1><p>Private reporting, fund documentation, and allocation visibility in one controlled record.</p></div><div className="lp-session-block"><span className="lp-session-status"><i />LP access active</span><strong>{user.email}</strong><Link to="/" className="lp-exit-link">Return to firm →</Link></div></header><section className="lp-summary-grid" aria-label="Portfolio summary"><SummaryCard label="Portfolio valuation" value="$28.6M" detail="+11.8% since inception" tone="lp-summary-card--primary" /><SummaryCard label="Committed capital" value="$12.0M" detail="$9.4M deployed / $2.6M available" /><SummaryCard label="Distributions" value="$1.84M" detail="Trailing twelve months" /><SummaryCard label="Next reporting date" value="15 Oct 26" detail="Q3 performance package" /></section><PerformancePanel /><section className="lp-vault-section"><div className="lp-vault-heading"><div><span className="portal-zone-label">03 / The vault</span><h2>Investor documents</h2><p>{documentCount} controlled files · Updated through 30 Jun 2026</p></div><span className="lp-vault-security"><i />Encrypted document index</span></div>{notice ? <div className="lp-vault-notice" role="status" aria-live="polite">{notice}</div> : null}<div className="lp-document-groups">{categories.map((category) => <section className="lp-document-group" key={category}><div className="lp-document-group-heading"><h3>{category}</h3><span>{documents.filter((document) => document.category === category).length} files</span></div><div className="lp-document-list">{documents.filter((document) => document.category === category).map((document) => <DocumentRow key={document.id} document={document} onView={setSelectedDocument} onDownload={handleDownload} />)}</div></section>)}</div></section><footer className="lp-workspace-footer"><span>LP confidential / distribution restricted to verified account holders</span><span>Need assistance? Contact the private capital team.</span></footer></div>{selectedDocument ? <div className="lp-document-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedDocument(null); }}><motion.aside className="lp-document-drawer" role="dialog" aria-modal="true" aria-labelledby="lp-document-title" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}><button type="button" className="modal-close" onClick={() => setSelectedDocument(null)} aria-label="Close document details">×</button><span className="section-kicker">{selectedDocument.classification}</span><div className="lp-drawer-filemark">{selectedDocument.type}</div><h2 id="lp-document-title">{selectedDocument.title}</h2><p>This document is indexed to your verified LP session. Download access is recorded for compliance and reporting continuity.</p><dl><div><dt>Category</dt><dd>{selectedDocument.category}</dd></div><div><dt>Published</dt><dd>{selectedDocument.date}</dd></div><div><dt>File size</dt><dd>{selectedDocument.size}</dd></div></dl><button type="button" className="primary-button" onClick={() => handleDownload(selectedDocument)}>Request secure download</button></motion.aside></div> : null}</main>;
}
