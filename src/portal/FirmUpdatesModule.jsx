import { motion } from 'framer-motion';

const updates = [
  { label: 'Market structure', title: 'Liquidity is a strategic asset.', body: 'As financing conditions normalize, disciplined underwriting and flexible capital reserves remain central to durable acquisition pacing.' },
  { label: 'Portfolio architecture', title: 'Diversification follows control.', body: 'The firm continues to prioritize durable cash flow, real-asset protection, and operating leverage over short-term narrative momentum.' },
  { label: 'Authorized dispatch', title: 'The platform is expanding its private desk.', body: 'New sourcing pathways are being organized across timepieces, automobiles, and principal-led opportunities with secure digital fulfillment.' },
];

export default function FirmUpdatesModule() {
  return <section className="firm-updates-module" aria-label="Firm updates"><div className="firm-updates-heading"><span className="portal-zone-label">Firm pulse / authorized dispatch</span><small>Read only · DGroup intelligence</small></div><div className="firm-updates-list">{updates.map((update, index) => <motion.article key={update.title} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .08, duration: .45 }}><span>{update.label}</span><h3>{update.title}</h3><p>{update.body}</p></motion.article>)}</div></section>;
}
