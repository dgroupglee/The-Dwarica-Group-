import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { supabase } from '../utils/supabaseClient';
import { TelemetryDrawer } from '../components/CinematicSystems';

const vehicles = [
  { id: 'maybach-s580', model: 'Mercedes-Maybach S580 4MATIC', variations: [{ id: 'maybach-s580-2023', label: '2023', price: 185000, color: 'Obsidian Black', mileage: '9,400 mi' }, { id: 'maybach-s580-2024', label: '2024', price: 225000, color: 'Manufaktur Mojave Silver', mileage: '4,100 mi' }, { id: 'maybach-s580-2022', label: '2022', price: 198000, color: 'Rubellite Red', mileage: '18,600 mi' }] },
  { id: 'maybach-gls600', model: 'Mercedes-Maybach GLS600', variations: [{ id: 'gls600-2023', label: '2023', price: 195000, color: 'Obsidian Black', mileage: '12,200 mi' }, { id: 'gls600-2024', label: '2024', price: 240000, color: 'Designo Diamond White', mileage: '3,800 mi' }] },
  { id: 'rolls-ghost', model: 'Rolls-Royce Ghost', variations: [{ id: 'ghost-standard', label: 'Standard Wheelbase', price: 380000, color: 'Argent Silver', mileage: '7,100 mi' }, { id: 'ghost-extended', label: 'Extended Wheelbase', price: 485000, color: 'Salamanca Blue', mileage: '2,900 mi' }] },
  { id: 'rolls-cullinan', model: 'Rolls-Royce Cullinan', variations: [{ id: 'cullinan-standard', label: 'Standard', price: 420000, color: 'Midnight Sapphire', mileage: '8,500 mi' }, { id: 'cullinan-black-badge', label: 'Black Badge', price: 560000, color: 'Fuxia', mileage: '2,200 mi' }] },
  { id: 'bentley-bentayga', model: 'Bentley Bentayga', variations: [{ id: 'bentayga-v8', label: 'V8', price: 195000, color: 'Onyx', mileage: '15,400 mi' }, { id: 'bentayga-speed', label: 'Speed', price: 285000, color: 'Viridian', mileage: '5,600 mi' }, { id: 'bentayga-azure', label: 'Azure', price: 245000, color: 'Glacier White', mileage: '9,800 mi' }] },
  { id: 'bentley-flying-spur', model: 'Bentley Flying Spur', variations: [{ id: 'flying-spur-v8', label: 'V8', price: 215000, color: 'Magnetic', mileage: '12,100 mi' }, { id: 'flying-spur-w12', label: 'W12', price: 270000, color: 'Cricket Ball', mileage: '7,400 mi' }, { id: 'flying-spur-speed', label: 'Speed', price: 310000, color: 'Pale Brodgar', mileage: '3,600 mi' }] },
  { id: 'bmw-760i', model: 'BMW 7 Series 760i', variations: [{ id: 'bmw-760i-2024', label: '2024', price: 135000, color: 'Frozen Tanzanite Blue', mileage: '4,900 mi' }, { id: 'bmw-760i-2023', label: '2023', price: 118000, color: 'Black Sapphire', mileage: '13,700 mi' }] },
  { id: 'mercedes-gls450', model: 'Mercedes-Benz GLS 450', variations: [{ id: 'gls450-2024-amg', label: '2024 AMG Line', price: 108000, color: 'Obsidian Black', mileage: '5,200 mi' }, { id: 'gls450-2023-standard', label: '2023 Standard', price: 92000, color: 'Polar White', mileage: '16,300 mi' }] },
];

const money = (value) => `$${value.toLocaleString('en-US')}`;

export default function AutomobilesRealm() {
  const { savedItems, toggleFavorite, favoritePulseId, notice, user, setEmailPrompt } = useAuth();
  const [selected, setSelected] = useState(Object.fromEntries(vehicles.map((vehicle) => [vehicle.id, vehicle.variations[0].id])));
  const [inquiry, setInquiry] = useState(null);
  const [priceSort, setPriceSort] = useState('Default');
  const [vehicleCategory, setVehicleCategory] = useState('All');
  const [submitted, setSubmitted] = useState(false);
  const [drawerItem, setDrawerItem] = useState(null);
  const isAccountHolder = user && !user.is_anonymous;
  const setVariation = (vehicleId, variationId) => setSelected((current) => ({ ...current, [vehicleId]: variationId }));
  const visibleVehicles = useMemo(() => vehicles.filter((vehicle) => vehicleCategory === 'All' || (vehicleCategory === 'SUV' && /GLS|Cullinan|Urus|Bentayga/i.test(vehicle.model)) || (vehicleCategory === 'Sedan' && /S580|760|Flying Spur|Ghost/i.test(vehicle.model)) || (vehicleCategory === 'Convertible' && /Convertible|Spider|Cabriolet/i.test(vehicle.model)) || (vehicleCategory === 'Coupe' && /Coupe|GT/i.test(vehicle.model))).sort((left, right) => {
    if (priceSort === 'Price: Low to High') return Math.min(...left.variations.map((item) => item.price)) - Math.min(...right.variations.map((item) => item.price));
    if (priceSort === 'Price: High to Low') return Math.min(...right.variations.map((item) => item.price)) - Math.min(...left.variations.map((item) => item.price));
    return 0;
  }), [priceSort, vehicleCategory]);
  const submitInquiry = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inquiryData = {
      item_name: `${inquiry.vehicle.model} / ${inquiry.variation.label}`,
      item_category: 'Automobiles',
      item_reference: inquiry.variation.id,
      message: `${inquiry.variation.label}\n${formData.get('message')}`,
      email: formData.get('email'),
    };
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser || currentUser.is_anonymous) {
      window.localStorage.setItem('pendingInquiry', JSON.stringify(inquiryData));
      setEmailPrompt({ type: 'inquiry', inquiry: inquiryData });
      setInquiry(null);
      return;
    }
    const { error } = await supabase.from('inquiries').insert({ account_id: currentUser.id, item_name: inquiryData.item_name, item_category: inquiryData.item_category, message: inquiryData.message, status: 'received' });
    if (!error) { setInquiry(null); setSubmitted(true); }
  };

  return <section className="realm-shell">
    <div className="realm-header"><div className="realm-title"><span className="section-kicker">Automobiles</span><h1 className="section-title">Confirmed vehicles. Clear configurations.</h1><p className="realm-intro">Ultra-luxury motorcars with transparent configuration, pricing, and delivery logistics.</p></div><Link to="/market" className="back-link">Back to doors</Link></div>
    {notice ? <div className="access-banner">{notice}</div> : null}
    <div className="market-filters automobile-filters">{['All', 'Sedan', 'SUV', 'Convertible', 'Coupe'].map((item) => <button key={item} type="button" className={vehicleCategory === item ? 'market-filter market-filter--active' : 'market-filter'} onClick={() => setVehicleCategory(item)}>{item}</button>)}</div>
    <div className="market-sort-row"><label htmlFor="automobile-price-sort">Sort automobiles</label><select id="automobile-price-sort" value={priceSort} onChange={(event) => setPriceSort(event.target.value)}><option>Default</option><option>Price: Low to High</option><option>Price: High to Low</option></select></div>
    <motion.div layout className="realm-grid realm-grid--three">{visibleVehicles.map((vehicle) => { const variation = vehicle.variations.find((item) => item.id === selected[vehicle.id]); const isSaved = savedItems.includes(variation.id); return <motion.article layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="realm-card vehicle-card" key={vehicle.id}>
      <div className="inventory-image-placeholder"><span>{vehicle.model}</span></div>
      <span className="inventory-label">In-hand configuration</span><h2>{vehicle.model}</h2>
      <div className="vehicle-configs">{vehicle.variations.map((item) => <button type="button" key={item.id} className={variation.id === item.id ? 'config-pill config-pill--active' : 'config-pill'} onClick={() => setVariation(vehicle.id, item.id)}>{item.label}</button>)}</div>
      <div className="vehicle-basic-specs"><div><span>Year / variation</span><strong>{variation.label}</strong></div><div><span>Exterior</span><strong>{variation.color}</strong></div><div><span>Mileage</span><strong>{variation.mileage}</strong></div></div>
      <strong className="inventory-price vehicle-price">{money(variation.price)}</strong><span className="ship-badge">Listed price / delivery on inquiry</span>
      <div className="inventory-actions"><button type="button" className={`favorite-button ${isSaved ? 'favorite-button--saved' : ''} ${favoritePulseId === variation.id ? 'favorite-button--pulse' : ''}`} aria-label={isSaved ? `Remove ${vehicle.model} ${variation.label}` : `Save ${vehicle.model} ${variation.label}`} aria-pressed={isSaved} onClick={(event) => { event.stopPropagation(); toggleFavorite({ id: variation.id, name: `${vehicle.model} / ${variation.label}`, category: 'Automobiles', price: variation.price }); }}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0 7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 1.06-8.84Z" /></svg></button><button type="button" className="inventory-hint-button" onClick={() => setDrawerItem({ ...variation, model: vehicle.model, detail: `${variation.color} exterior, ${variation.mileage}. Complete VIN, service, and provenance record held in the private desk file.` })}>Open telemetry →</button><button type="button" className="primary-button" data-ripple onClick={() => setInquiry({ vehicle, variation })}>Confirm interest</button></div>
      {isAccountHolder ? <div className="inventory-detail"><div><span>Interior</span><strong>Nappa leather / open-pore trim</strong></div><div><span>Trim specification</span><strong>{variation.label} full specification</strong></div><div><span>Desk recommendation</span><strong>S580 4MATIC offers the best value-to-specification ratio in this range</strong></div><div><span>VIN / accident history</span><strong>Verified file / clean</strong></div><div><span>Service record</span><strong>Complete</strong></div></div> : <div className="inventory-private-note" role="button" tabIndex="0" onClick={() => setEmailPrompt({ type: 'dossier_unlock', assetId: variation.id })}><span>PRIVATE INTELLIGENCE — ACCOUNT HOLDERS ONLY</span><div className="inventory-private-fields"><span>Interior Color and Material</span><span>Full Trim Specification</span><span>VIN Status</span><span>Accident History</span><span>Service Record Completeness</span></div><em>Create your private DGroup account to access full asset intelligence.</em></div>}
    </motion.article>; })}</motion.div>
    <TelemetryDrawer item={drawerItem} onClose={() => setDrawerItem(null)} category="Automobile" />
    {inquiry ? <div className="market-modal-backdrop" onClick={() => setInquiry(null)}><div className="market-modal" onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setInquiry(null)} aria-label="Close inquiry"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg></button><span className="section-kicker">Private inquiry</span><h2>{inquiry.vehicle.model}</h2><p>{inquiry.variation.label} · {money(inquiry.variation.price)}</p><form onSubmit={submitInquiry}><span className="listing-inquiry-label">INQUIRE ABOUT THIS VEHICLE</span><input type="hidden" name="item" value={`${inquiry.vehicle.model} / ${inquiry.variation.label}`} /><label>Your Email<input required type="email" name="email" placeholder="your@email.com" /></label><label>Message<textarea required rows="4" name="message" placeholder="Any specific questions about this vehicle — specification, history, delivery." /></label><button type="submit" className="primary-button">Submit Inquiry</button></form></div></div> : null}
    {submitted ? <div className="market-toast" role="status">Inquiry received. A principal will confirm your details within 24 hours.</div> : null}
  </section>;
}
