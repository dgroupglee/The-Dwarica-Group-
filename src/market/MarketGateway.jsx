import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const doors = [
  {
    id: 'timepieces',
    label: 'Door 1',
    title: 'TIMEPIECES & FINE JEWELRY',
    subtitle: 'Authenticated inventory, private placement, and direct allocation routing.',
    path: '/market/timepieces',
  },
  {
    id: 'automobiles',
    label: 'Door 2',
    title: 'AUTOMOBILES',
    subtitle: 'Ultra-luxury motorcars, garage provenance, and white-glove deployment.',
    path: '/market/automobiles',
  },
  {
    id: 'consign',
    label: 'Door 3',
    title: 'CONSIGNMENT & PLACEMENTS',
    subtitle: 'Private intake for horology, fine art, motors, and high-conviction client assets.',
    path: '/market/consign',
  },
];

export default function MarketGateway() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.market-door',
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12 }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="min-h-screen bg-[#0A0A0A] px-4 pb-20 pt-12 text-white md:px-6">
      <div className="mx-auto mb-8 max-w-[1520px]">
        <div className="mb-4 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#C5A059] before:h-px before:w-6 before:bg-[#C5A059]">
          Three Doors
        </div>
        <h1 className="max-w-[1000px] font-serif text-4xl uppercase leading-none tracking-[-0.06em] text-white md:text-7xl">
          Private access to the firm’s curated asset corridors.
        </h1>
      </div>

      <div className="mx-auto grid max-w-[1520px] grid-cols-1 gap-4 md:grid-cols-3">
        {doors.map((door) => (
          <Link
            key={door.id}
            to={door.path}
            className="market-door group relative min-h-[560px] overflow-hidden border border-[#C5A059]/70 bg-[var(--card)] transition duration-300 hover:border-[#C5A059] hover:shadow-[0_0_30px_rgba(197,160,89,0.18)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[var(--card)] to-[#0A0A0A] transition duration-500 group-hover:from-[#121212]" />

            <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
              <span className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">{door.label}</span>
              <h2 className="mb-3 max-w-[18ch] font-serif text-3xl uppercase leading-none tracking-[-0.05em] text-white md:text-5xl">
                {door.title}
              </h2>
              <p className="max-w-[35ch] text-sm leading-7 text-white/80">{door.subtitle}</p>
              <span className="mt-6 text-[10px] uppercase tracking-[0.18em] text-[#C5A059]">Enter realm →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
