import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { supabase } from '../utils/supabaseClient';
import { TelemetryDrawer } from '../components/CinematicSystems';
import MarketplaceCartDrawer from '../components/MarketplaceCartDrawer';

const inventory = [
  { id: 'nautilus-5711', brand: 'Patek Philippe', model: 'Nautilus 5711/1A-010', category: 'Watches', descriptor: 'Stainless steel / blue dial', price: 180000, ship: 'Ships within 5 days', papers: 'Full Set', condition: 'Unworn', detail: 'Production year 2021. Original blue sunburst dial with stainless steel bracelet.' },
  { id: 'royal-oak-15500', brand: 'Audemars Piguet', model: 'Royal Oak 15500ST', category: 'Watches', descriptor: 'Blue dial / steel bracelet', price: 145000, ship: 'Ships within 3 days', papers: 'Papers Only', condition: 'Excellent', detail: 'Reference 15500ST with blue tapisserie dial and factory service history.' },
  { id: 'rm-055', brand: 'Richard Mille', model: 'RM 055', category: 'Watches', descriptor: 'Titanium / manual winding', price: 320000, ship: 'Ships within 7 days', papers: 'Full Set', condition: 'Unworn', detail: 'Bubba Watson edition in grade 5 titanium with original presentation set.' },
  { id: 'overseas-4500', brand: 'Vacheron Constantin', model: 'Overseas 4500V', category: 'Watches', descriptor: 'Stainless steel / blue dial', price: 84000, ship: 'Ships within 4 days', papers: 'Full Set', condition: 'Excellent', detail: 'Self-winding calibre 5100A with interchangeable bracelet and strap system.' },
  { id: 'cuban-vvs1', brand: 'DGroup Private Collection', model: '18K White Gold Cuban Link', category: 'Chains & Links', descriptor: '26 in / 12mm / VVS1 diamond set', price: 28500, ship: 'Ships within 4 days', papers: 'GIA documentation', condition: 'New', detail: '18K white gold, finished diamond setting, VVS1 clarity grade.' },
  { id: 'tennis-vs2', brand: 'DGroup Private Collection', model: 'Tennis Bracelet', category: 'Bracelets', descriptor: '7 in / 5.2 TCW / VS2 diamonds', price: 42000, ship: 'Ships within 5 days', papers: 'GIA documentation', condition: 'New', detail: 'Platinum setting with round brilliant diamonds, VS2 clarity grade.' },
  { id: 'solitaire-vs1', brand: 'DGroup Private Collection', model: 'Diamond Solitaire Ring', category: 'Rings', descriptor: '3.1ct round brilliant / VS1-F', price: 68000, ship: 'Ships within 6 days', papers: 'GIA documentation', condition: 'New', detail: '3.1ct round brilliant diamond, VS1 clarity, F color, 18K yellow gold.' },
  { id: 'gmt-batman', brand: 'Rolex', model: 'GMT-Master II 126710BLNR', category: 'Watches', descriptor: 'Batman / oyster bracelet', price: 28500, ship: 'Ships within 3 days', papers: 'Papers Only', condition: 'Excellent', detail: 'Black and blue Cerachrom bezel with current-generation calibre 3285.' },
  { id: 'submariner-126610ln', brand: 'Rolex', model: 'Submariner 126610LN', category: 'Watches', descriptor: 'Black ceramic bezel / black dial', price: 18500, ship: 'Ships within 3 business days', papers: 'Full Set', condition: 'Excellent', detail: 'Black Cerachrom bezel with black dial and Oyster bracelet.' },
  { id: 'day-date-228238', brand: 'Rolex', model: 'Day-Date 40 228238', category: 'Watches', descriptor: 'Yellow gold / green fluted dial', price: 58000, ship: 'Ships within 5 business days', papers: 'Full Set', condition: 'Excellent', detail: 'Yellow gold case and bracelet with green fluted dial.' },
  { id: 'royal-oak-15450st', brand: 'Audemars Piguet', model: 'Royal Oak 37mm 15450ST', category: 'Watches', descriptor: 'Stainless steel / blue dial', price: 62000, ship: 'Ships within 4 business days', papers: 'Full Set', condition: 'Excellent', detail: '37mm stainless steel Royal Oak with blue dial.' },
  { id: 'calatrava-5196p', brand: 'Patek Philippe', model: 'Calatrava 5196P', category: 'Watches', descriptor: 'Platinum / ivory dial', price: 68000, ship: 'Ships within 7 business days', papers: 'Full Set', condition: 'Excellent', detail: 'Platinum Calatrava with ivory dial.' },
  { id: 'gold-cuban-bracelet', brand: 'DGroup Private Collection', model: '18k Yellow Gold Diamond Cuban Link Bracelet', category: 'Bracelets', descriptor: '8 inches / 5.00 CTW / VS1 clarity', price: 14200, ship: 'Ships within 5 business days', papers: 'GIA documentation', condition: 'New', detail: '18k yellow gold diamond Cuban link bracelet with VS1 clarity stones.' },
  { id: 'diamond-cuban-chain', brand: 'DGroup Private Collection', model: '10mm Diamond Cuban Link Chain', category: 'Chains & Links', descriptor: '22 inches / white gold', price: 22500, ship: 'Ships within 5 business days', papers: 'GIA documentation', condition: 'New', detail: 'White gold 10mm diamond Cuban link chain.' },
  { id: 'custom-solitaire', brand: 'DGroup Private Collection', model: 'Custom Solitaire Diamond Ring', category: 'Rings', descriptor: 'GIA certified stone / setting of choice', price: null, ship: 'Inquiry only / delivered in 3 weeks', papers: 'GIA certified stone', condition: 'Made to order', detail: 'Inquire for pricing. Select a GIA certified stone and setting.' },
  { id: 'loose-diamond-vvs1', brand: 'DGroup Private Collection', model: 'VVS1 Loose Diamond', category: 'Rings', descriptor: '2.00 CT round brilliant / GIA certified', price: 18000, ship: 'Ships insured overnight', papers: 'GIA documentation', condition: 'New', detail: '2.00 carat round brilliant GIA certified loose diamond.' },
  { id: 'custom-pendant', brand: 'DGroup Private Collection', model: 'Custom Pendant', category: 'Chains & Links', descriptor: 'Any design / inquiry only', price: null, ship: 'Inquiry only', papers: 'Documentation provided', condition: 'Made to order', detail: 'Bring your vision. We handle design, sourcing, and delivery end to end.' },
  { id: 'royal-oak-chronograph', brand: 'Audemars Piguet', model: 'Royal Oak Chronograph 26240OR', category: 'Watches', descriptor: 'Rose gold / black dial / integrated bracelet', price: 118000, ship: 'Ships within 6 business days', papers: 'Full Set', condition: 'Unworn', detail: '18K rose gold case and bracelet with black Grande Tapisserie dial and matching subdials.' },
  { id: 'daytona-panda', brand: 'Rolex', model: 'Cosmograph Daytona 126500LN', category: 'Watches', descriptor: 'White dial / black ceramic bezel / Oysterflex', price: 52000, ship: 'Ships within 4 business days', papers: 'Full Set', condition: 'Excellent', detail: 'White lacquer dial with black Cerachrom bezel and Oyster bracelet. Reserved for principal review.', status: 'Reserved' },
  { id: 'nautilus-green', brand: 'Patek Philippe', model: 'Nautilus 5711/1A-014', category: 'Watches', descriptor: 'Olive green dial / steel bracelet', price: 210000, ship: 'Inquiry only', papers: 'Full Set', condition: 'Excellent', detail: 'Discontinued olive green dial configuration with original bracelet and complete documentation.', status: 'Sold' },
  { id: 'overseas-black', brand: 'Vacheron Constantin', model: 'Overseas 4500V/110A', category: 'Watches', descriptor: 'Black dial / steel bracelet and rubber strap', price: 76000, ship: 'Ships within 5 business days', papers: 'Full Set', condition: 'Unworn', detail: 'Black lacquer dial with interchangeable steel, leather, and rubber strap system.' },
  { id: 'rose-gold-tennis', brand: 'DGroup Private Collection', model: 'Rose Gold Tennis Bracelet', category: 'Fine Jewelry', descriptor: '18K rose gold / 6.80 TCW / VS diamonds', price: 36000, ship: 'Ships within 7 business days', papers: 'GIA documentation', condition: 'New', detail: 'Flexible 18K rose gold tennis bracelet set with graduated round brilliant diamonds.' },
  { id: 'multi-metal-cuff', brand: 'DGroup Private Collection', model: 'Multi-Metal Diamond Cuff', category: 'Fine Jewelry', descriptor: 'White, yellow, and rose gold / 4.20 TCW', price: 29500, ship: 'Ships within 5 business days', papers: 'Independent appraisal', condition: 'New', detail: 'Architectural three-tone gold cuff with pavé diamond channels and a concealed hinge.' },
  { id: 'diamond-hoops', brand: 'DGroup Private Collection', model: 'Diamond Pavé Hoops', category: 'Fine Jewelry', descriptor: '18K white gold / 2.40 TCW / F-VS', price: 12400, ship: 'Ships within 3 business days', papers: 'Independent appraisal', condition: 'New', detail: 'Medium-scale 18K white gold hoops with continuous pavé diamond coverage.' },
];

const formatPrice = (value) => value == null ? 'Inquire for pricing' : `$${Number(value).toLocaleString('en-US')}`;
const statusClass = (status) => `inventory-status--${(status || 'Available').toLowerCase().replace(/\s+/g, '-')}`;

export default function TimepiecesRealm() {
  const { toggleFavorite, savedItems, favoritePulseId, unlockDossier, notice, user, setEmailPrompt } = useAuth();
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [customInquiry, setCustomInquiry] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState(null);
  const [drawerItem, setDrawerItem] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleCartItem = (item) => {
    setCartItems((current) => current.some((selected) => selected.id === item.id) ? current.filter((selected) => selected.id !== item.id) : [...current, item]);
    setCartOpen(true);
  };

  const visibleItems = useMemo(() => inventory.filter((item) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesCategory = category === 'All' || item.category === category;
    const matchesSearch = !query || [item.brand, item.model, item.reference || item.model].some((value) => value.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  }).sort((left, right) => {
    if (sort === 'Price (Low-High)') return (left.price ?? Number.POSITIVE_INFINITY) - (right.price ?? Number.POSITIVE_INFINITY);
    if (sort === 'Price (High-Low)') return (right.price ?? -1) - (left.price ?? -1);
    return left.brand.localeCompare(right.brand);
  }), [category, searchTerm, sort]);

  const submitListingInquiry = async (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(event.currentTarget);
    const inquiry = {
      item_name: item.model,
      item_category: item.category,
      item_reference: item.reference || item.model,
      message: `${item.reference || item.model}\n${formData.get('message')}`,
      email: formData.get('email'),
    };
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser || currentUser.is_anonymous) {
      window.localStorage.setItem('pendingInquiry', JSON.stringify(inquiry));
      setEmailPrompt({ type: 'inquiry', inquiry });
      return;
    }
    const { error } = await supabase.from('inquiries').insert({ account_id: currentUser.id, item_name: inquiry.item_name, item_category: inquiry.item_category, message: inquiry.message, status: 'received' });
    if (!error) setSubmittedInquiryId(item.id);
  };

  const submitInquiry = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setCustomInquiry(false);
  };

  return (
    <section className="realm-shell">
      <div className="realm-header">
        <div className="realm-title"><span className="section-kicker">Timepieces & Fine Jewelry</span><h1 className="section-title">Finished pieces. Immediate availability.</h1><p className="realm-intro">Authenticated watches and finished diamond pieces presented with transparent pricing and confirmed ship-by timing.</p></div>
        <div className="realm-header-actions"><button type="button" className="market-cart-trigger" onClick={() => setCartOpen(true)} aria-expanded={cartOpen}>Allocation cart <span>{cartItems.length}</span></button><Link to="/market" className="back-link">Back to doors</Link></div>
      </div>
      <label className="market-search"><span>Search inventory</span><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by brand, model, or reference..." /></label>
      <div className="market-filter-bar">
        <div className="market-filters">{['All', 'Watches', 'Chains & Links', 'Bracelets', 'Rings', 'Fine Jewelry'].map((item) => <button key={item} type="button" className={category === item ? 'market-filter market-filter--active' : 'market-filter'} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort inventory"><option>Newest</option><option>Price (Low-High)</option><option>Price (High-Low)</option><option>Brand</option></select>
      </div>
      {notice ? <div className="access-banner">{notice}</div> : null}
      <motion.div layout className="realm-grid realm-grid--three"><AnimatePresence mode="popLayout">
        {visibleItems.map((item) => {
          const isSaved = savedItems.includes(item.id);
          const isOpen = expanded === item.id;
          const inCart = cartItems.some((selected) => selected.id === item.id);
          const isSold = item.status === 'Sold';
          return <motion.article layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .94 }} transition={{ duration: .45 }} data-velocity key={item.id} className={`realm-card inventory-card ${isOpen ? 'inventory-card--expanded' : ''}`}>
              <div className="inventory-image-placeholder"><span>{item.brand}</span></div><button type="button" className="inventory-card-main" onClick={() => setExpanded(isOpen ? null : item.id)} aria-expanded={isOpen}>
              <span className="inventory-label">{item.brand}</span><h2>{item.model}</h2><p>{item.descriptor}</p><strong className="inventory-price">{formatPrice(item.price)}</strong><span className={`inventory-status ${statusClass(item.status)}`}>{item.status || 'Available'}</span><span className="ship-badge">{item.ship}</span>
            </button>
            <button type="button" className={`favorite-button ${isSaved ? 'favorite-button--saved' : ''} ${favoritePulseId === item.id ? 'favorite-button--pulse' : ''}`} aria-label={isSaved ? `Remove ${item.model}` : `Save ${item.model}`} aria-pressed={isSaved} onClick={(event) => { event.stopPropagation(); toggleFavorite({ id: item.id, name: item.model, category: item.category, price: item.price }); }}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 1.06-8.84Z" /></svg></button>
            <div className="inventory-actions"><span className="inventory-hint">{isOpen ? 'Collapse details' : 'Open details'}</span><button type="button" className="inventory-hint-button" onClick={(event) => { event.stopPropagation(); setDrawerItem(item); }}>Open telemetry →</button><button type="button" className={`reserve-inline-button ${inCart ? 'reserve-inline-button--active' : ''}`} disabled={isSold} onClick={(event) => { event.stopPropagation(); toggleCartItem(item); }}>{isSold ? 'Sold / unavailable' : inCart ? 'In allocation cart' : item.status === 'Reserved' ? 'Join reserve review' : 'Reserve asset'}</button></div>
            {isOpen ? <><div className={`inventory-detail-wrap ${user?.is_anonymous || !user ? 'inventory-detail-wrap--locked' : ''}`} role={user?.is_anonymous || !user ? 'button' : undefined} tabIndex={user?.is_anonymous || !user ? 0 : undefined} onClick={user?.is_anonymous || !user ? () => unlockDossier(item.id) : undefined} onKeyDown={user?.is_anonymous || !user ? (event) => { if (event.key === 'Enter' || event.key === ' ') unlockDossier(item.id); } : undefined}><div className="inventory-detail"><div><span>Condition</span><strong>{item.condition}</strong></div><div><span>Papers Status</span><strong>{item.papers}</strong></div><div><span>Production Year</span><strong>2021</strong></div><div><span>Previous Owners</span><strong>Private history available</strong></div><div><span>Service History</span><strong>Verified in private file</strong></div><div><span>Case Size</span><strong>Reference-specific</strong></div><div><span>Dial Color</span><strong>{item.descriptor}</strong></div><p>{item.detail}</p></div>{user?.is_anonymous || !user ? <div className="inventory-private-note"><span>PRIVATE INTELLIGENCE — ACCOUNT HOLDERS ONLY</span><div className="inventory-private-fields"><span>Papers Status</span><span>Previous Owners</span><span>Service History</span><span>Production Year</span><span>Case Size</span><span>Dial Color</span></div><em>Create your private DGroup account to access full asset intelligence.</em></div> : null}</div><div className="listing-inquiry" onClick={(event) => event.stopPropagation()}>{submittedInquiryId === item.id ? <p className="listing-inquiry-confirmation">Inquiry received. A principal will confirm your details within 24 hours.</p> : <form onSubmit={(event) => submitListingInquiry(event, item)}><span className="listing-inquiry-label">INQUIRE ABOUT THIS PIECE</span><input type="hidden" name="item" value={`${item.model} / ${item.reference || item.model}`} /><label>Your Email<input required type="email" name="email" placeholder="your@email.com" /></label><label>Message<textarea required name="message" placeholder="Any specific questions about this piece — papers, service history, provenance." /></label><button type="submit" className="primary-button">Submit Inquiry</button></form>}</div></> : null}
          </motion.article>;
        })}
      </AnimatePresence></motion.div>
      <TelemetryDrawer item={drawerItem} onClose={() => setDrawerItem(null)} category="Timepiece" />
      <MarketplaceCartDrawer items={cartItems} open={cartOpen} onClose={() => setCartOpen(false)} onRemove={(id) => setCartItems((current) => current.filter((item) => item.id !== id))} onSubmitted={() => { setCartItems([]); }} />
      <div className="custom-inquiry"><p>Looking for something specific? The desk can facilitate a private inquiry.</p><button type="button" className="secondary-button" onClick={() => setCustomInquiry(true)}>Inquire</button></div>
      {customInquiry ? <div className="market-modal-backdrop" onClick={() => setCustomInquiry(false)}><div className="market-modal" onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setCustomInquiry(false)} aria-label="Close inquiry"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg></button><span className="section-kicker">Private inquiry</span><h2>Describe the piece.</h2><form onSubmit={submitInquiry}><label>What are you looking for?<input required name="item" placeholder="Piece, brand, or reference" /></label><label>Your Email<input required name="email" type="email" placeholder="Direct email" /></label><button type="submit" className="primary-button">Submit inquiry</button></form></div></div> : null}
      {submitted ? <div className="market-toast" role="status">Inquiry received. A principal will confirm the next step within 24 hours.</div> : null}
    </section>
  );
}
