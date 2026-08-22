import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function LPPortalPage() {
  const { requestAccess } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const requestMaterials = async (event) => {
    event.preventDefault();
    const details = Object.fromEntries(new FormData(event.currentTarget).entries());
    await requestAccess('lp_materials_request', { ...details, source: 'lp-portal', qualification: 'prospective-accredited-investor' });
    setSubmitted(true);
    setOpen(false);
  };
  return <main className="lp-portal-page">
    <div className="lp-portal-inner">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
        <span className="section-kicker">Limited partner access / 506 infrastructure</span>
        <h1>Institutional capital, structured for durable ownership.</h1>
        <p className="lp-portal-lead">The Dwarica Group works with qualified partners across a coordinated holding structure spanning real assets, operating businesses, capital markets, and specialist asset desks. This is a private diligence environment for prospective limited partners.</p>
      </motion.div>
      <div className="lp-portal-grid">
        <section className="lp-portal-card"><span className="portal-zone-label">01 / Mandate</span><h2>One platform. Multiple compounding lanes.</h2><p>Liquidity-generating desks feed disciplined deployment into assets and operating companies selected for control, cash flow, and long-duration value creation.</p><div className="lp-mandate-list"><span>Origination → underwriting → ownership</span><span>Quarterly reporting and principal access</span><span>Defined position sizing and documented theses</span></div></section>
        <section className="lp-portal-card lp-portal-compliance"><span className="portal-zone-label">02 / Offering framework</span><h2>Regulation D / Rule 506 pathway.</h2><p>Where an offering is appropriate, the firm can structure private capital participation through a Rule 506 exemption, subject to offering-specific documentation, investor qualification, suitability, and applicable securities counsel.</p><small>This page is informational only. It is not an offer to sell securities or a solicitation to buy securities. Access, eligibility, terms, and disclosures are determined for each offering.</small>{submitted ? <p className="lp-request-confirmation">Qualification request received. The private capital team will review your details.</p> : <button type="button" data-ripple className="primary-button" onClick={() => setOpen(true)}>Request LP materials</button>}</section>
      </div>
      <div className="lp-portal-footer"><Link to="/portal">Existing member portal →</Link><Link to="/">Return to the firm →</Link></div>
    </div>
    {open ? <div className="market-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><motion.div className="market-modal lp-qualification-modal" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><button type="button" className="modal-close" onClick={() => setOpen(false)} aria-label="Close qualification form">×</button><span className="section-kicker">Private capital qualification</span><h2>Request LP materials.</h2><p>Share the details the private capital team needs to route your request securely.</p><form onSubmit={requestMaterials}><label>Entity name<input required name="entity_name" placeholder="Entity or family office" /></label><label>Contact email<input required type="email" name="email" placeholder="Direct email" /></label><label>Accredited investor status<select required name="accredited_status" defaultValue=""><option value="" disabled>Select one</option><option>Individual accredited investor</option><option>Entity accredited investor</option><option>Qualified purchaser / institutional</option></select></label><label>Direct contact<input required name="direct_contact" placeholder="Phone or preferred contact" /></label><button type="submit" className="primary-button">Submit qualification</button></form></motion.div></div> : null}
  </main>;
}
