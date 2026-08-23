import { useState } from 'react';
import { motion } from 'framer-motion';

const initialAllocation = { enterprise: 40, liquid: 35, assets: 25 };

export default function AUMVisualizer() {
  const [allocation, setAllocation] = useState(initialAllocation);
  const { enterprise, liquid, assets } = allocation;

  const handleSliderChange = (type, nextValue) => {
    const value = Number(nextValue);
    if (type === 'enterprise') {
      const remaining = 100 - value;
      const ratio = liquid / (liquid + assets || 1);
      const nextLiquid = Math.round(remaining * ratio);
      setAllocation({ enterprise: value, liquid: nextLiquid, assets: 100 - value - nextLiquid });
    } else if (type === 'liquid') {
      const remaining = 100 - value;
      const ratio = enterprise / (enterprise + assets || 1);
      const nextEnterprise = Math.round(remaining * ratio);
      setAllocation({ enterprise: nextEnterprise, liquid: value, assets: 100 - value - nextEnterprise });
    } else {
      const remaining = 100 - value;
      const ratio = enterprise / (enterprise + liquid || 1);
      const nextEnterprise = Math.round(remaining * ratio);
      setAllocation({ enterprise: nextEnterprise, liquid: 100 - value - nextEnterprise, assets: value });
    }
  };

  const weightedYield = ((enterprise * 0.21) + (liquid * 0.14) + (assets * 0.17)).toFixed(1);
  const weightedLiquidityDays = Math.round((enterprise * 1460 + liquid + assets * 21) / 100);
  const sliders = [
    { key: 'enterprise', label: 'Private Enterprise', value: enterprise, min: 10, max: 80 },
    { key: 'liquid', label: 'Liquid Capital Markets', value: liquid, min: 10, max: 80 },
    { key: 'assets', label: 'Hard Assets & Real Estate', value: assets, min: 5, max: 60 },
  ];

  return <section className="aum-visualizer aum-sandbox" id="capital-deployment"><div className="aum-visualizer-inner"><span className="section-kicker">Interactive mandate sandbox</span><h2 className="section-title">Simulate capital deployment.</h2><p className="aum-sandbox-intro">Adjust the allocation weights to model blended yield targets, liquidity horizons, and risk distribution across the firm’s core operating pillars.</p><div className="aum-sandbox-bar-wrap"><div className="aum-sandbox-bar" role="img" aria-label={`Current allocation: Private Enterprise ${enterprise} percent, Liquid Capital Markets ${liquid} percent, Hard Assets ${assets} percent`}><motion.div className="aum-sandbox-segment aum-sandbox-segment--enterprise" animate={{ width: `${enterprise}%` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} /><motion.div className="aum-sandbox-segment aum-sandbox-segment--liquid" animate={{ width: `${liquid}%` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} /><motion.div className="aum-sandbox-segment aum-sandbox-segment--assets" animate={{ width: `${assets}%` }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} /></div><div className="aum-sandbox-bar-labels"><span>Private Enterprise: {enterprise}%</span><span>Liquid Markets: {liquid}%</span><span>Hard Assets: {assets}%</span></div></div><div className="aum-sandbox-grid"><div className="aum-sandbox-controls"><span className="aum-sandbox-label">[ Allocation parameters ]</span>{sliders.map((slider) => <label className="aum-sandbox-slider" key={slider.key}><span><b>{slider.label}</b><strong>{slider.value}%</strong></span><input type="range" min={slider.min} max={slider.max} value={slider.value} onChange={(event) => handleSliderChange(slider.key, event.target.value)} aria-label={`${slider.label} allocation`} /><small>{slider.min}% — {slider.max}% adjustable range</small></label>)}</div><div className="aum-sandbox-output"><div className="aum-sandbox-output-head"><span className="aum-sandbox-label">[ Live model output ]</span><span>Simulation active</span></div><div className="aum-sandbox-metrics"><div><span>Blended target yield</span><strong>~{weightedYield}% IRR</strong></div><div><span>Average liquidity horizon</span><strong>~{weightedLiquidityDays} days</strong></div></div><div className="aum-sandbox-note"><span>Mandate balance note</span><p>This illustrative model demonstrates how the firm balances long-term cash flow generation with liquid deployment and hard-asset backing. It is not a forecast, offer, or representation of historical performance.</p></div></div></div></div></section>;
}
