import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { supabase } from '../utils/supabaseClient';

const formatPrice = (value) => value == null ? 'Inquire for pricing' : `$${Number(value).toLocaleString('en-US')}`;

export default function MarketplaceCartDrawer({ items, open, onClose, onRemove, onSubmitted }) {
  const { user, requestAccess } = useAuth();
  const [reserveMode, setReserveMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: user?.email || '', shipping_destination: '', notes: '' });

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submitReserveRequest = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = {
      email: form.email.trim(),
      shipping_destination: form.shipping_destination.trim(),
      notes: form.notes.trim(),
      items: items.map((item) => ({ id: item.id, name: item.model, category: item.category, price: item.price })),
    };
    const itemSummary = items.map((item) => `${item.brand} ${item.model} (${formatPrice(item.price)})`).join('\n');
    const message = `ALLOCATION REQUEST\n${itemSummary}\n\nShipping destination: ${payload.shipping_destination}\nDirect inquiry notes: ${payload.notes || 'None provided.'}`;

    try {
      if (user && !user.is_anonymous) {
        const { error: insertError } = await supabase.from('inquiries').insert({
          account_id: user.id,
          item_name: items.length === 1 ? items[0].model : `${items.length} marketplace assets`,
          item_category: 'Marketplace allocation',
          message,
          status: 'reserve_requested',
        });
        if (insertError) throw insertError;
      } else {
        window.localStorage.setItem('pendingAllocationRequest', JSON.stringify(payload));
        const accessResult = await requestAccess('asset_reservation', payload);
        if (accessResult?.ok === false) throw new Error(accessResult.message || 'Private access could not be created.');
      }
      setSubmitted(true);
      setReserveMode(false);
      onSubmitted();
    } catch (submissionError) {
      setError(submissionError.message || 'The request could not be routed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="market-cart-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.aside className="market-cart-drawer" role="dialog" aria-modal="true" aria-labelledby="allocation-cart-title" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }} onClick={(event) => event.stopPropagation()}>
            <div className="market-cart-header">
              <div><span className="section-kicker">Private allocation desk</span><h2 id="allocation-cart-title">Your selections <span>({items.length})</span></h2></div>
              <button type="button" className="modal-close" onClick={onClose} aria-label="Close allocation cart">×</button>
            </div>
            {submitted ? (
              <div className="market-cart-success" role="status" aria-live="polite"><span className="section-kicker">Request received</span><h3>Allocation review is underway.</h3><p>A principal will confirm availability, shipping logistics, and next steps within 24 hours.</p><button type="button" className="secondary-button" onClick={onClose}>Return to inventory</button></div>
            ) : reserveMode ? (
              <form className="market-reserve-form" onSubmit={submitReserveRequest}><span className="section-kicker">Reserve asset</span><h3>Route a confidential request.</h3><p className="market-form-note">No payment is taken here. We will confirm availability and secure, insured delivery directly.</p><label>Email<input required type="email" name="email" value={form.email} onChange={updateField} placeholder="direct@email.com" /></label><label>Preferred shipping destination<input required type="text" name="shipping_destination" value={form.shipping_destination} onChange={updateField} placeholder="City, state / country" /></label><label>Direct inquiry notes<textarea name="notes" value={form.notes} onChange={updateField} placeholder="Timing, preferred configuration, or questions" /></label>{error ? <p className="market-form-error" role="alert">{error}</p> : null}<div className="market-form-actions"><button type="button" className="secondary-button" onClick={() => setReserveMode(false)}>Back</button><button type="submit" className="primary-button" disabled={submitting}>{submitting ? 'Routing…' : 'Request allocation'}</button></div></form>
            ) : items.length ? (
              <><div className="market-cart-list">{items.map((item) => <div className="market-cart-item" key={item.id}><div><span>{item.brand}</span><h3>{item.model}</h3><p>{item.category} · {formatPrice(item.price)}</p></div><button type="button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.model} from selections`}>Remove</button></div>)}</div><div className="market-cart-footer"><p>Selections are held for review only. Final pricing and availability are confirmed by the allocation desk.</p><button type="button" className="primary-button" onClick={() => setReserveMode(true)}>Request Allocation / Reserve Asset</button></div></>
            ) : <div className="market-cart-empty"><span className="section-kicker">No selections yet</span><h3>Build a private shortlist.</h3><p>Use “Reserve asset” on any available timepiece or jewelry piece to route it to this desk.</p><button type="button" className="secondary-button" onClick={onClose}>Browse inventory</button></div>}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
