import { useMemo } from 'react';

const timepieces = [
  { id: 'discovery-nautilus', reference: '5711/1A-010', brand: 'Patek Philippe', title: 'Nautilus 5711/1A', category: 'Timepieces', price: 180000, descriptor: 'Blue sunburst dial / stainless steel' },
  { id: 'discovery-royal-oak', reference: '15500ST', brand: 'Audemars Piguet', title: 'Royal Oak 15500ST', category: 'Timepieces', price: 145000, descriptor: 'Blue tapisserie dial / steel' },
  { id: 'discovery-overseas', reference: '4500V/110A', brand: 'Vacheron Constantin', title: 'Overseas 4500V', category: 'Timepieces', price: 84000, descriptor: 'Blue dial / interchangeable system' },
  { id: 'discovery-day-date', reference: '228238', brand: 'Rolex', title: 'Day-Date 40', category: 'Timepieces', price: 58000, descriptor: 'Yellow gold / green fluted dial' },
  { id: 'discovery-calatrava', reference: '5196P', brand: 'Patek Philippe', title: 'Calatrava 5196P', category: 'Timepieces', price: 68000, descriptor: 'Platinum / ivory dial' },
  { id: 'discovery-rm', reference: 'RM 055', brand: 'Richard Mille', title: 'RM 055', category: 'Timepieces', price: 320000, descriptor: 'Grade 5 titanium / manual winding' },
];

const automobiles = [
  { id: 'discovery-ghost', reference: 'GHOST-EWB', brand: 'Rolls-Royce', title: 'Ghost Extended Wheelbase', category: 'Automobiles', price: 485000, descriptor: 'Salamanca Blue / bespoke interior' },
  { id: 'discovery-cullinan', reference: 'CULLINAN-BB', brand: 'Rolls-Royce', title: 'Cullinan Black Badge', category: 'Automobiles', price: 560000, descriptor: 'Fuxia / Black Badge specification' },
  { id: 'discovery-maybach', reference: 'S580-4MATIC', brand: 'Mercedes-Maybach', title: 'S580 4MATIC', category: 'Automobiles', price: 225000, descriptor: 'Manufaktur Mojave Silver' },
];

const nearest = (items, budget, brand) => [...items].sort((a, b) => {
  const brandBoostA = brand && a.brand === brand ? -budget * 0.18 : 0;
  const brandBoostB = brand && b.brand === brand ? -budget * 0.18 : 0;
  return Math.abs(a.price - budget) + brandBoostA - (Math.abs(b.price - budget) + brandBoostB);
});

function buildBundles(items, budget) {
  const half = budget / 2;
  return items.slice(0, 4).map((item, index) => ({
    id: `bundle-${item.id}`,
    reference: `PAIR-${index + 1}`,
    brand: 'DGroup Pairing Desk',
    title: `${item.title} / complementary allocation`,
    category: 'Bundled acquisition',
    price: Math.round(budget),
    descriptor: `Two correlated positions at approximately $${Math.round(half).toLocaleString()} each`,
    bundleItems: [item, items[(index + 1) % items.length]],
  }));
}

export function useDiscoveryFeed(affinity) {
  return useMemo(() => {
    const budget = Math.max(25000, affinity?.target_budget || 50000);
    const matches = nearest(timepieces, budget, affinity?.topBrand).slice(0, 4).map((item) => ({ ...item, lane: 'Direct match' }));
    const bundles = buildBundles(nearest(timepieces, budget), budget).slice(0, 3).map((item) => ({ ...item, lane: 'Dynamic bundle' }));
    const lateral = nearest([...timepieces.filter((item) => !affinity?.topBrand || item.brand !== affinity.topBrand), ...automobiles], budget * 1.15).slice(0, 3).map((item) => ({ ...item, lane: 'Lateral aspirational' }));
    const curated = [...matches, ...bundles, ...lateral];
    return curated.reduce((feed, item, index) => {
      if (index > 0 && index % 7 === 0) feed.push({ id: `concierge-${index}`, type: 'concierge' });
      feed.push(item);
      return feed;
    }, []);
  }, [affinity]);
}
