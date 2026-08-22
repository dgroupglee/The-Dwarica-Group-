import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';


export default function FirmIdentitySection() {
  const root = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return undefined;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.z = 5;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: element, antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch {
      element.hidden = true;
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    const torus = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.018, 12, 64), new THREE.MeshBasicMaterial({ color: 0x4a90d9, wireframe: true, transparent: true, opacity: 0.8 }));
    scene.add(torus);
    const resize = () => { const bounds = element.getBoundingClientRect(); camera.aspect = bounds.width / Math.max(bounds.height, 1); camera.updateProjectionMatrix(); renderer.setSize(bounds.width, bounds.height, false); };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; }, { rootMargin: '240px' });
    visibilityObserver.observe(element);
    let frame;
    const render = () => { if (isVisible) { torus.rotation.y += 0.002; torus.rotation.x = Math.sin(performance.now() * 0.0003) * 0.12; renderer.render(scene, camera); } frame = requestAnimationFrame(render); };
    render();
    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); visibilityObserver.disconnect(); torus.geometry.dispose(); torus.material.dispose(); renderer.forceContextLoss(); renderer.dispose(); };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => gsap.fromTo('.identity-copy', { opacity: 0, x: 100, rotateY: 14 }, { opacity: 1, x: 0, rotateY: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'center center', scrub: 1 } }), root);
    return () => ctx.revert();
  }, []);

  return <section ref={root} id="identity" className="identity-section"><canvas ref={canvas} className="identity-scene" aria-hidden="true" /><div className="identity-copy"><span className="section-kicker">Firm identity / one firm, seven verticals</span><h2 className="section-title">Cross-vertical capital efficiency.</h2><p>The Dwarica Group operates as a multi-strategy private investment holding firm and family office. Transactional desks create velocity, private markets create durable ownership, liquid intelligence creates optionality, and intellectual property creates long-duration cash flow.</p><p>Each vertical exists to serve a distinct role in the same capital system: originate opportunity, deploy capital with discipline, and compound value through operating control and patient holding. The firm is designed to function as one platform, not seven isolated businesses.</p><p>Rather than relying on a single asset class, the firm balances immediate liquidity, durable real assets, operating businesses, alternative income streams, and strategic market intelligence. That structure helps reduce dependence on any one cycle, sector, or market condition.</p><div className="identity-theses"><div><span>Generate</span><strong>Origination liquidity</strong><p>High-conviction transaction flow creates working capital and live market intelligence.</p></div><div><span>Deploy</span><strong>Asset-rate deployment</strong><p>Capital moves into real assets, operating companies, and liquid opportunities selected for durability.</p></div><div><span>Compound</span><strong>Institutional permanence</strong><p>Recycled yield and operating discipline expand the platform across cycles.</p></div></div></div></section>;
}
