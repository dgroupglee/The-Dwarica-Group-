import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import ExecutiveIntelligenceCockpit from '../portal/ExecutiveIntelligenceCockpit';

const cards = [
  {
    label: 'Allocation',
    title: 'Direct capital access',
    copy: 'The desk is designed for serious capital conversations that require discretion, precision, and a clear path to principal review rather than a generic intake process.'
  },
  {
    label: 'Desk',
    title: 'Private market intelligence',
    copy: 'Institutional diligence, operating insight, pricing context, and macro awareness are synthesized into a usable decision framework before capital is deployed.'
  },
  {
    label: 'Continuity',
    title: 'White-glove execution',
    copy: 'Every inquiry is routed with a named principal, a structured review process, and a direct path toward follow-up, discussion, and execution when appropriate.'
  }
];

export default function CapitalDesk() {
  const { requestAccess } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await requestAccess('capital_allocation_inquiry', Object.fromEntries(formData.entries()));
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <section id="capital-desk" className="capital-desk">
      <div className="section-frame">
        <div className="section-kicker">Capital desk</div>
        <h2 className="section-title">Private allocation begins with direct principal continuity.</h2>
        <ExecutiveIntelligenceCockpit />

        <div className="capital-intake-wrap">
          <div className="capital-intake-copy">
            <span className="capital-card-label">Principal portal</span>
            <h3>One direct conversation.</h3>
            <p>The Capital Desk is the firm’s principal entry point for capital allocation, strategic partnerships, and high-conviction opportunities. It is built for clients who need a confidential, direct path to evaluation rather than an endless sales funnel.</p>
            <p>By sharing the mandate, timing, and structure clearly, a principal can quickly understand whether the opportunity aligns with the firm’s platform, risk framework, and deployment priorities.</p>
            <div className="desk-notes">{cards.map((card) => <div key={card.label}><span>{card.label}</span><strong>{card.title}</strong><p>{card.copy}</p></div>)}</div>
          </div>

          <form className="capital-intake-form" onSubmit={handleSubmit}>
            <div className="capital-form-grid">
              <label>
                <span>Target allocation range</span>
                <select name="allocationRange" defaultValue="">
                  <option value="" disabled>Select a range</option>
                  <option>$1M - $5M</option>
                  <option>$5M - $25M</option>
                  <option>$25M+</option>
                </select>
              </label>
              <label>
                <span>Deployment horizon</span>
                <input name="deploymentHorizon" type="text" placeholder="30 / 90 / 180 days" required />
              </label>
              <label className="full-width">
                <span>Message</span>
                <textarea name="message" rows="5" placeholder="Describe the mandate, timing, and desired structure." required />
              </label>
            </div>
            <div className="principal-summary-footer">
              <div className="principal-summary-heading">
                <span>Principal routing</span>
                <p>Secure contact details for direct follow-up.</p>
              </div>
              <div className="principal-summary-grid">
                <label>
                  <span>Principal name</span>
                  <input name="principalName" type="text" placeholder="Your name" required />
                </label>
                <label>
                  <span>Entity / institution</span>
                  <input name="entity" type="text" placeholder="Institution or family office" required />
                </label>
                <label>
                  <span>Direct contact</span>
                  <input name="directContact" type="email" placeholder="you@example.com" required />
                </label>
              </div>
            </div>
            <button type="submit">Route to principal desk</button>
            {submitted ? <span className="success-note">Inquiry routed to the principal desk.</span> : null}
          </form>
        </div>
      </div>
    </section>
  );
}
