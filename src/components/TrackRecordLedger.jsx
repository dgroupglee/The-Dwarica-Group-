import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';

const fallbackRecords = [
  { id: 'q2-2025', date: 'Q2 2025', category: 'asset', description: 'Acquired reference-grade Audemars Piguet Royal Oak at wholesale. Exited via private client placement.', return_label: '+16% in 22 days' },
  { id: 'q3-2025', date: 'Q3 2025', category: 'trade', description: 'Systematic prediction market positioning across economic event schedule. 14 consecutive positive outcomes.', return_label: 'Consistent positive EV' },
  { id: 'q4-2025', date: 'Q4 2025', category: 'acquisition', description: 'Executed proprietary sourcing of service business target in Nassau County. Currently under LOI.', return_label: 'Pending close' },
  { id: 'q1-2026', date: 'Q1 2026', category: 'asset', description: 'Luxury automotive brokerage closed: Rolls-Royce Ghost matched to qualified buyer via private network.', return_label: 'Fee captured at close' },
];

export default function TrackRecordLedger() {
  const [records, setRecords] = useState(fallbackRecords);

  useEffect(() => {
    let active = true;
    supabase.from('track_record').select('id, date, category, description, return_label').eq('published', true).order('created_at', { ascending: true }).then(({ data }) => {
      if (active && data?.length) setRecords(data);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  return <section className="track-record-section" id="track-record"><div className="track-record-inner"><div className="track-record-intro"><span className="section-kicker">Track record ledger</span><h2 className="section-title">Realized wins. Documented outcomes.</h2><p>Selected historical outcomes from the firm’s operating and allocation record. Past performance is not indicative of future results.</p></div><div className="track-record-timeline">{records.map((record, index) => <motion.article key={record.id} className="track-record-entry" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .55, delay: index * .12 }}><time>{record.date}</time><span className="track-record-node" aria-hidden="true" /><div><span className="track-record-category">{record.category}</span><p>{record.description}</p><strong>{record.return_label}</strong></div></motion.article>)}</div></div></section>;
}
