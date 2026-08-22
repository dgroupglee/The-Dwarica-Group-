import { motion } from 'framer-motion';

export default function PrivateLedgerCallout() {
  return (
    <motion.aside
      className="private-ledger"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-label="Private ledger assets under management"
    >
      <div className="private-ledger-accent" aria-hidden="true" />
      <div className="private-ledger-grid">
        <div>
          <p className="private-ledger-label">Assets Under Management</p>
          <p className="private-ledger-value">$45M+</p>
        </div>
        <div className="private-ledger-statement">
          <p>“Capital deployment is systematically structured across private equity, commercial real estate corridors, and specialized asset desks to ensure compounding permanence and absolute institutional gravity.”</p>
        </div>
      </div>
    </motion.aside>
  );
}
