import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { supabase } from '../utils/supabaseClient';
import { TelemetryDrawer } from '../components/CinematicSystems';

const vehicles = [
  { id: 'maybach-s580', model: 'Mercedes-Maybach S580 4MATIC', variations: [{ id: 'maybach-s580-2023', label: '2023', price: 185000, color: 'Obsidian Black', mileage: '9,400 mi' }, { id: 'maybach-s580-2024', label: '2024', price: 225000, color: 'Mojave Silver', mileage: '4,100 mi' }, { id: 'maybach-s580-2022', label: '2022', price: 198000, color: 'Rubellite Red', mileage: '18,600 mi' }] },
  { id: 'maybach-gls600', model: 'Mercedes-Maybach GLS600', variations: [{ id: 'gls600-2023', label: '2023', price: 195000, color: 'Obsidian Black', mileage: '12,200 mi' }, { id: 'gls600-2024', label: '2024', price: 240000, color: 'Diamond White', mileage: '3,800 mi' }] },
  { id: 'rolls-ghost', model: 'Rolls-Royce Ghost', variations: [{ id: 'ghost-standard', label: 'Standard Wheelbase', price: 380000, color: 'Argent Silver', mileage: '7,100 mi' }, { id: 'ghost-extended', label: 'Extended Wheelbase', price: 485000, color: 'Salamanca Blue', mileage: '2,900 mi' }] },
  { id: 'rolls-cullinan', model: 'Rolls-Royce Cullinan', variations: [{ id: 'cullinan-standard', label: 'Standard', price: 420000, color: 'Midnight Sapphire', mileage: '8,500 mi' }, { id: 'cullinan-black-badge', label: 'Black Badge', price: 560000, color: 'Fuxia', mileage: '2,200 mi' }] },
  { id: 'bentley-bentayga', model: 'Bentley Bentayga', variations: [{ id: 'bentayga-v8', label: 'V8', price: 195000, color: 'Onyx', mileage: '15,400 mi' }, { id: 'bentayga-speed', label: 'Speed', price: 285000, color: 'Viridian', mileage: '5,600 mi' }] },
  { id: 'bmw-760i', model: 'BMW 7 Series 760i', variations: [{ id: 'bmw-760i-2024', label: '2024', price: 135000, color: 'Tanzanite Blue', mileage: '4,900 mi' }, { id: 'bmw-760i-2023', label: '2023', price: 118000, color: 'Black Sapphire', mileage: '13,700 mi' }] },
  { id: 'mercedes-gls450', model: 'Mercedes-Benz GLS 450', variations: [{ id: 'gls450-2024-amg', label: '2024 AMG Line', price: 108000, color: 'Obsidian Black', mileage: '5,200 mi' }, { id: 'gls450-2023-standard', label: '2023 Standard', price: 92000, color: 'Polar White', mileage: '16,300 mi' }] },
];

const money = (value) => `$${value.toLocaleString('en-US')}`;
const makeOf = (model) => model.startsWith('Mercedes-Maybach') ? 'Mercedes-Maybach' : model.startsWith('Rolls-Royce') ? 'Rolls-Royce' : model.startsWith('Bentley') ? 'Bentley' : model.startsWith('BMW') ? 'BMW' : 'Mercedes-Benz';

function MasterVehicleCard({ make, vehicles: makeVehicles, savedItems, toggleFavorite, favoritePulseId, onTelemetry, onConfigure, onInquiry, isAccountHolder, setEmailPrompt, expanded, onToggle }) {
  const variations = makeVehicles.flatMap((vehicle) => vehicle.variations.map((variation) => ({ vehicle, variation })));
  const prices = variations.map(({ variation }) => variation.price);
  return <motion.article layout className={`automobile-master-card ${expanded ? 'is-expanded' : ''}`}>
    <button type="button" className="automobile-master-trigger" aria-expanded={expanded} onClick={onToggle}><span className="automobile-master-index">{String(makeVehicles.length).padStart(2, '0')} / inventory paths</span><strong>{make}</strong><span className="automobile-master-summary">{variations.length} configurations · {money(Math.min(...prices))}—{money(Math.max(...prices))}<b>{expanded ? '−' : '+'}</b></span></button>
    <AnimatePresence initial={false}>{expanded ? <motion.div className="automobile-variation-stack" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .35, ease: 'easeOut' }}>
      {variations.map(({ vehicle, variation }) => { const isSaved = savedItems.includes(variation.id); return <div className="automobile-variation-row" key={variation.id}>
        <div className="automobile-variation-title"><span>{variation.label}</span><strong>{vehicle.model}</strong></div>
        <div className="automobile-variation-spec"><span>Exterior / interior</span><strong>{variation.color} / On request</strong></div>
        <div className="automobile-variation-spec"><span>Mileage</span><strong>{variation.mileage}</strong></div>
        <strong className="automobile-variation-price">{money(variation.price)}</strong>
        <div className="automobile-variation-actions"><button type="button" className={`favorite-button ${isSaved ? 'favorite-button--saved' : ''} ${favoritePulseId === variation.id ? 'favorite-button--pulse' : ''}`} aria-label={isSaved ? `Remove ${vehicle.model} ${variation.label}` : `Save ${vehicle.model} ${variation.label}`} aria-pressed={isSaved} onClick={() => toggleFavorite({ id: variation.id, name: `${vehicle.model} / ${variation.label}`, category: 'Automobiles', price: variation.price })}>♡</button><button type="button" className="inventory-hint-button" onClick={() => onTelemetry({ ...variation, model: vehicle.model, detail: `${variation.color} exterior, ${variation.mileage}. Complete provenance record held in the private desk file.` })}>Details</button><button type="button" className="secondary-button" onClick={() => onConfigure({ vehicle, variation })}>Configure</button><button type="button" className="primary-button" onClick={() => onInquiry({ vehicle, variation })}>Request</button></div>
        {isAccountHolder ? <div className="automobile-private-readout"><span>Private verification</span><strong>VIN / service / ownership file available</strong></div> : <button type="button" className="automobile-private-readout automobile-private-readout--locked" onClick={() => setEmailPrompt({ type: 'dossier_unlock', assetId: variation.id })}><span>Account access</span><strong>View service and ownership details</strong></button>}
      </div>; })}
    </motion.div> : null}</AnimatePresence>
  </motion.article>;
}

export default function AutomobilesRealm() {
  const { savedItems, toggleFavorite, favoritePulseId, notice, user, setEmailPrompt } = useAuth();
  const [priceSort, setPriceSort] = useState('Default');
  const [vehicleCategory, setVehicleCategory] = useState('All');
  const [expandedMake, setExpandedMake] = useState('');
  const [inquiry, setInquiry] = useState(null);
  const [configureItem, setConfigureItem] = useState(null);
  const [drawerItem, setDrawerItem] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const isAccountHolder = user && !user.is_anonymous;
  const visibleVehicles = useMemo(() => vehicles.filter((vehicle) => vehicleCategory === 'All' || (vehicleCategory === 'SUV' && /GLS|Cullinan|Bentayga/i.test(vehicle.model)) || (vehicleCategory === 'Sedan' && /S580|760|Ghost/i.test(vehicle.model))).sort((a, b) => priceSort === 'Price: Low to High' ? a.variations[0].price - b.variations[0].price : priceSort === 'Price: High to Low' ? b.variations[0].price - a.variations[0].price : 0), [priceSort, vehicleCategory]);
  const groupedVehicles = visibleVehicles.reduce((groups, vehicle) => { const make = makeOf(vehicle.model); groups[make] = groups[make] || []; groups[make].push(vehicle); return groups; }, {});

  const submitRequest = async (event, type) => {
    event.preventDefault(); const data = new FormData(event.currentTarget); const selected = type === 'configure' ? configureItem : inquiry; const item = { item_name: selected.vehicle.model, item_category: type === 'configure' ? 'Automobiles configuration' : 'Automobiles', item_reference: selected.variation.id, message: type === 'configure' ? `Trim: ${data.get('trim')}\nColor: ${data.get('color')}\nMileage: ${data.get('mileage')}` : String(data.get('message')), email: String(data.get('email')) };
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser || currentUser.is_anonymous) { window.localStorage.setItem('pendingInquiry', JSON.stringify(item)); setEmailPrompt({ type: 'inquiry', inquiry: item }); setInquiry(null); setConfigureItem(null); return; }
    const { error } = await supabase.from('inquiries').insert({ account_id: currentUser.id, ...item, status: 'received' }); if (!error) { setInquiry(null); setConfigureItem(null); setSubmitted(true); }
  };

  return <section className="realm-shell"><div className="realm-header"><div className="realm-title"><span className="section-kicker">Automobiles / ghost inventory</span><h1 className="section-title">Depth of choice. One private desk.</h1><p className="realm-intro">Select a marque to expand every available model, year, color, mileage, and price point in one operating view.</p></div><Link to="/market" className="back-link">Back to doors</Link></div>
    {notice ? <div className="access-banner">{notice}</div> : null}<div className="market-filters automobile-filters">{['All', 'Sedan', 'SUV'].map((item) => <button key={item} type="button" className={vehicleCategory === item ? 'market-filter market-filter--active' : 'market-filter'} onClick={() => setVehicleCategory(item)}>{item}</button>)}</div><div className="market-sort-row"><label htmlFor="automobile-price-sort">Sort automobiles</label><select id="automobile-price-sort" value={priceSort} onChange={(event) => setPriceSort(event.target.value)}><option>Default</option><option>Price: Low to High</option><option>Price: High to Low</option></select></div>
    <div className="automobile-master-list">{Object.entries(groupedVehicles).map(([make, makeVehicles]) => <MasterVehicleCard key={make} make={make} vehicles={makeVehicles} savedItems={savedItems} toggleFavorite={toggleFavorite} favoritePulseId={favoritePulseId} onTelemetry={setDrawerItem} onConfigure={setConfigureItem} onInquiry={setInquiry} isAccountHolder={isAccountHolder} setEmailPrompt={setEmailPrompt} expanded={expandedMake === make} onToggle={() => setExpandedMake(expandedMake === make ? '' : make)} />)}</div>
    <TelemetryDrawer item={drawerItem} onClose={() => setDrawerItem(null)} category="Automobile" />
    {inquiry ? <div className="market-modal-backdrop" onClick={() => setInquiry(null)}><div className="market-modal" onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setInquiry(null)} aria-label="Close inquiry">×</button><span className="section-kicker">Private inquiry</span><h2>{inquiry.vehicle.model}</h2><form onSubmit={(event) => submitRequest(event, 'inquiry')}><label>Your Email<input required type="email" name="email" placeholder="your@email.com" /></label><label>Message<textarea required rows="4" name="message" placeholder="Specification, history, delivery." /></label><button type="submit" className="primary-button">Submit Inquiry</button></form></div></div> : null}
    {configureItem ? <div className="market-modal-backdrop" onClick={() => setConfigureItem(null)}><div className="market-modal configure-order-modal" onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setConfigureItem(null)} aria-label="Close configuration">×</button><span className="section-kicker">Automotive configuration desk</span><h2>Configure your order.</h2><p>{configureItem.vehicle.model} / {configureItem.variation.label}</p><form onSubmit={(event) => submitRequest(event, 'configure')}><label>Trim preference<input required name="trim" defaultValue={configureItem.variation.label} /></label><label>Color preference<input required name="color" defaultValue={configureItem.variation.color} /></label><label>Mileage preference<input required name="mileage" defaultValue={configureItem.variation.mileage} /></label><label>Direct email<input required type="email" name="email" placeholder="your@email.com" /></label><button type="submit" className="primary-button">Route configuration request</button></form></div></div> : null}{submitted ? <div className="market-toast" role="status">Request received. A principal will confirm the next step within 24 hours.</div> : null}
  </section>;
}
