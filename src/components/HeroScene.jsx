import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.z = 5;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch {
      canvas.hidden = true;
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setClearColor(0x050505, 0);

    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const edges = new THREE.EdgesGeometry(geometry);
    const icosahedron = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xd4a840, transparent: true, opacity: 0.6 }));
    scene.add(icosahedron);

    const shaderMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uPointer: { value: new THREE.Vector2(0.5, 0.5) } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'uniform float uTime; uniform vec2 uPointer; varying vec2 vUv; void main(){ float d=distance(vUv,uPointer); float glow=smoothstep(.48,.02,d)*.09; vec3 navy=vec3(.03,.09,.16); vec3 gold=vec3(.83,.66,.25); vec3 color=mix(navy,gold,glow+sin(uTime*.35+vUv.x*5.)*.025); gl_FragColor=vec4(color,glow*.55); }',
    });
    const shaderPlane = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), shaderMaterial);
    shaderPlane.position.z = -3;
    scene.add(shaderPlane);

    const torus = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.008, 12, 128), new THREE.MeshBasicMaterial({ color: 0x4a90d9, transparent: true, opacity: 0.4 }));
    scene.add(torus);

    const particleCount = 900;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 8 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const offset = index * 3;
      positions[offset] = radius * Math.sin(phi) * Math.cos(theta);
      positions[offset + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[offset + 2] = radius * Math.cos(phi);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.018, transparent: true, opacity: 0.3, depthWrite: false }));
    scene.add(particles);

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      camera.aspect = Math.max(bounds.width, 1) / Math.max(bounds.height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(Math.max(bounds.width, 1), Math.max(bounds.height, 1), false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (event) => { const bounds = canvas.getBoundingClientRect(); pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2; pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * -2; shaderMaterial.uniforms.uPointer.value.set((pointer.targetX + 1) / 2, (pointer.targetY + 1) / 2); };
    canvas.addEventListener('pointermove', onPointerMove);
    let visible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '200px' });
    visibilityObserver.observe(canvas);

    let frameId;
    const render = () => {
      if (visible) {
        pointer.x += (pointer.targetX - pointer.x) * 0.025;
        pointer.y += (pointer.targetY - pointer.y) * 0.025;
        camera.position.x = pointer.x * 0.18;
        camera.position.y = pointer.y * 0.12;
        camera.lookAt(0, 0, 0);
        shaderMaterial.uniforms.uTime.value += 0.016;
        icosahedron.rotation.y += 0.003;
        icosahedron.rotation.x += 0.0012;
        torus.rotation.x += 0.001;
        renderer.render(scene, camera);
      }
      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      geometry.dispose();
      edges.dispose();
      icosahedron.material.dispose();
      shaderPlane.geometry.dispose();
      shaderMaterial.dispose();
      torus.geometry.dispose();
      torus.material.dispose();
      particleGeometry.dispose();
      particles.material.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-scene" aria-hidden="true" />;
}
