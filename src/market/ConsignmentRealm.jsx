import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase, triggerAutoAccountProvisioning } from '../utils/supabaseClient';

const initialForm = { item_type: '', description: '', asking_price: '', email: '', condition: '' };

export default function ConsignmentRealm() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileNames, setFileNames] = useState([]);
  const [error, setError] = useState('');

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!form.item_type.trim() || !form.condition.trim() || !form.description.trim() || !form.email.trim()) {
      setError('Complete every required field before submitting.');
      return;
    }
    const provisioning = await triggerAutoAccountProvisioning('consignment', {
      item_type: form.item_type,
      description: form.description,
      email: form.email,
    });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError(provisioning.error || 'Your submission could not be routed. Please try again.');
      return;
    }

    const { error: insertError } = await supabase.from('consignment_submissions').insert({
      account_id: user.id,
      item_description: `${form.item_type} — ${form.condition} — ${form.description}`,
      asking_price: Number.parseFloat(form.asking_price) || null,
      photos: fileNames,
      status: 'received',
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSubmitted(true);
  }

  const handleFiles = (files) => setFileNames([...files].map((file) => file.name));

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto w-full max-w-[1380px] px-4 pb-20 pt-10 md:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="mb-4 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#C5A059] before:h-px before:w-6 before:bg-[#C5A059]">Consignment & Placements</div>
          <h1 className="max-w-[800px] font-serif text-4xl uppercase leading-none tracking-[-0.05em] text-white md:text-6xl">Have something exceptional to sell?</h1>
        </div>
        <Link to="/market" className="inline-flex items-center border border-[#C5A059]/70 bg-[#C5A059]/5 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-white">← Back to doors</Link>
      </div>

      <div className="grid gap-6 border border-white/10 bg-[#0d1117] p-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] md:p-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-center">
          <span className="mb-3 text-[9px] uppercase tracking-[0.2em] text-[#C5A059]">Private desk routing</span>
          <h2 className="font-serif text-4xl uppercase leading-none tracking-[-0.04em] text-white md:text-5xl">Submit your piece for principal review.</h2>
          <p className="mt-4 max-w-[34ch] text-base leading-8 text-white/75">Share the asset class, condition, and outline details. A principal will evaluate it and identify the right buyer within 24 hours.</p>
        </div>

        {submitted ? (
          <motion.div role="status" aria-live="polite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[320px] flex-col justify-center border border-[#C5A059]/30 bg-[#C5A059]/5 p-8">
            <p className="mb-2 font-serif text-3xl italic text-[#D4A840]">Received.</p>
            <p className="text-sm leading-7 text-white/60">A principal will confirm your details within 24 hours.</p>
          </motion.div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              {[['Item Type', 'item_type', 'e.g. Patek Philippe watch, Cuban link chain, Rolls-Royce...'], ['Condition', 'condition', 'Unworn / Excellent / Good / Fair'], ['Asking Price (USD)', 'asking_price', '0.00'], ['Your Email', 'email', 'your@email.com']].map(([label, name, placeholder]) => (
                <label key={name} className="flex flex-col gap-2 text-[9px] uppercase tracking-[0.18em] text-[#C5A059]"><span>{label}</span><input className="border border-white/10 bg-[#050505] px-4 py-3 text-sm tracking-[0.04em] text-white placeholder:text-white/40" name={name} type={name === 'asking_price' ? 'number' : name === 'email' ? 'email' : 'text'} value={form[name]} onChange={updateField} required placeholder={placeholder} /></label>
              ))}
            </div>
            <label className="flex flex-col gap-2 text-[9px] uppercase tracking-[0.18em] text-[#C5A059]"><span>Description</span><textarea className="min-h-[140px] border border-white/10 bg-[#050505] px-4 py-3 text-sm leading-7 text-white placeholder:text-white/40" name="description" value={form.description} onChange={updateField} required placeholder="Describe the piece — model, year, papers, accessories, relevant history..." /></label>
            <label className={`block cursor-pointer border border-dashed p-8 text-center transition-colors ${dragOver ? 'border-[#D4A840]' : 'border-white/15'}`} onDragOver={(event) => { event.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(event) => { event.preventDefault(); setDragOver(false); handleFiles(event.dataTransfer.files); }}>
              <input className="sr-only" type="file" accept="image/jpeg,image/png,image/heic" multiple onChange={(event) => handleFiles(event.target.files)} />
              <p className="text-xs text-white/40">{fileNames.length ? fileNames.join(', ') : 'Drop photos here — or click to upload'}</p><p className="mt-1 text-[10px] text-white/20">JPEG, PNG, HEIC accepted</p>
            </label>
            {error ? <p role="alert" className="text-xs text-red-300">{error}</p> : null}
            <button type="submit" className="w-full border border-[#C5A059] bg-[#C5A059] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0A0A0A]">Submit for Review</button>
          </form>
        )}
      </div>
    </motion.section>
  );
}
