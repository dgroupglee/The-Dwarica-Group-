document.addEventListener('DOMContentLoaded', () => {
  const formatUSD = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);

  const state = {
    bag: [],
    verified: false
  };

  const animateStatNumbers = () => {
    document.querySelectorAll('.stat-number').forEach((node) => {
      const target = Number(node.dataset.stat || 0);
      let start = 0;
      const duration = 1200;
      const step = () => {
        const progress = Math.min((performance.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        node.textContent = `${value}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame((time) => {
        start = time;
        requestAnimationFrame(step);
      });
    });
  };

  const initSmoothScroll = () => {
    if (!window.Lenis) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      lerp: 0.08,
      infinite: false
    });

    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    window.dwaricaLenis = lenis;
  };

  const initHeadlineReveal = () => {
    const words = document.querySelectorAll('.headline .word-split');
    if (!words.length) return;

    if (window.gsap) {
      gsap.set(words, { opacity: 0.08, filter: 'blur(4px)', y: 20 });
      gsap.to(words, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.045,
        delay: 0.1
      });
    } else {
      words.forEach((word) => {
        word.style.opacity = '1';
        word.style.filter = 'blur(0)';
        word.style.transform = 'translateY(0)';
      });
    }
  };

  const initNavClock = () => {
    const clock = document.getElementById('navClock');
    if (!clock) return;

    const formatTime = (timeZone) => new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZoneName: 'short'
    }).format(new Date());

    const update = () => {
      const ny = formatTime('America/New_York').replace(' ', '').replace(/\s/g, '');
      const ldn = formatTime('Europe/London').replace(' ', '').replace(/\s/g, '');
      const dxb = formatTime('Asia/Dubai').replace(' ', '').replace(/\s/g, '');
      clock.textContent = `NY ${ny} · LDN ${ldn} · DXB ${dxb}`;
    };

    update();
    setInterval(update, 1000);
  };

  const initParallaxGlow = () => {
    const layers = document.querySelectorAll('.parallax-layer');
    if (!layers.length) return;

    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      layers.forEach((layer, index) => {
        const strength = (index + 1) * 0.15;
        layer.style.transform = `translate3d(0, ${scrollY * strength}px, 0)`;
      });
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  };

  const initScrambleHeadings = () => {
    const headings = document.querySelectorAll('.scramble-headline, h2');
    if (!headings.length) return;

    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    const scramble = (element) => {
      if (element.dataset.scrambled === 'true') return;
      element.dataset.scrambled = 'true';
      const original = (element.dataset.original || element.textContent).replace(/\s+/g, ' ').trim();
      element.dataset.original = original;
      const chars = original.split('');
      const base = chars.map((char) => (char === ' ' ? ' ' : charset[Math.floor(Math.random() * charset.length)]));
      element.textContent = base.join('');

      let frame = 0;
      const totalFrames = 20;
      const tick = () => {
        const progress = frame / totalFrames;
        const next = chars.map((char, index) => {
          if (char === ' ') return ' ';
          if (index / chars.length > progress) {
            return charset[Math.floor(Math.random() * charset.length)];
          }
          return char;
        });
        element.textContent = next.join('');

        frame += 1;
        if (frame <= totalFrames) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = original;
        }
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          scramble(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    headings.forEach((heading) => {
      heading.classList.add('scramble-headline');
      observer.observe(heading);
    });
  };

  const initStrategyAccordion = () => {
    const items = document.querySelectorAll('.strategy-item');
    const details = document.querySelectorAll('.strategy-detail');
    if (!items.length || !details.length) return;

    const setActive = (targetId) => {
      items.forEach((item) => {
        const active = item.dataset.strategy === targetId;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });

      details.forEach((detail) => {
        const active = detail.dataset.detail === targetId;
        detail.classList.toggle('active', active);
      });
    };

    items.forEach((item) => {
      item.addEventListener('click', () => setActive(item.dataset.strategy));
    });

    setActive(document.querySelector('.strategy-item.active')?.dataset.strategy || '01');
  };

  const initThreeHero = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || !window.THREE) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 6;

    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const gold = new THREE.Color('#d4af37');

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 8;
      positions[i3 + 2] = (Math.random() - 0.5) * 8;

      const color = gold.clone().offsetHSL((Math.random() - 0.5) * 0.08, 0.1, 0.1);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const onResize = () => {
      const { clientWidth, clientHeight } = canvas;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    onResize();
    window.addEventListener('resize', onResize, { passive: true });

    let pointerX = 0;
    let pointerY = 0;
    window.addEventListener('pointermove', (event) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.x += 0.0016;
      points.rotation.y += 0.0013;
      points.rotation.z = pointerX * 0.22;
      points.position.x = pointerX * 0.8;
      points.position.y = -pointerY * 0.8;
      renderer.render(scene, camera);
    };

    animate();
  };

  const initTilt = () => {
    document.querySelectorAll('.market-card, .data-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const py = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        const rotateY = px * 8;
        const rotateX = -py * 8;
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  };

  const initOrbit = () => {
    const orbitWrap = document.querySelector('.orbit-wrap');
    if (!orbitWrap) return;

    const nodes = [
      { index: '01', title: 'Brokerage', meta: 'Fee income and private market liquidity', x: 50, y: 8 },
      { index: '02', title: 'Acquisitions', meta: 'Capital deployment into real assets and operating companies', x: 76, y: 32 },
      { index: '03', title: 'Cash Flow', meta: 'Net operating returns and asset appreciation', x: 84, y: 62 },
      { index: '04', title: 'Markets', meta: 'Active positioning and cross-market yield', x: 68, y: 84 },
      { index: '05', title: 'AUM', meta: 'Compounding capital base across all strategies', x: 28, y: 76 }
    ];

    const ring = document.createElement('div');
    ring.className = 'orbit-ring';
    orbitWrap.appendChild(ring);

    nodes.forEach((node, index) => {
      const el = document.createElement('div');
      el.className = 'orbit-node';
      el.style.left = `${node.x}%`;
      el.style.top = `${node.y}%`;
      el.style.transform = `translate(-50%, -50%) rotate(${index * 72}deg)`;
      el.innerHTML = `
        <span class="index">${node.index}</span>
        <div class="title">${node.title}</div>
        <div class="meta">${node.meta}</div>
      `;
      orbitWrap.appendChild(el);
    });
  };

  const initCinematicScroll = () => {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.hero-grid, .section-header, .market-card, .portal-card, .benefit-item, .copy-panel, .vault-item, .form-panel').forEach((element, index) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 60,
          x: index % 2 === 0 ? -18 : 18,
          rotateX: 14,
          rotateY: index % 2 === 0 ? -4 : 4,
          filter: 'blur(8px)',
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)'
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotateX: 0,
          rotateY: 0,
          filter: 'blur(0px)',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 86%',
            once: true
          }
        }
      );
    });

    const vaultTrack = document.querySelector('.vault-track');
    if (vaultTrack) {
      const getScrollAmount = () => vaultTrack.scrollWidth - window.innerWidth + 160;
      gsap.to(vaultTrack, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.vault-section',
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    }

    gsap.from('.benefit-item', {
      opacity: 0,
      y: 18,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: '.benefits-band',
        start: 'top 85%'
      }
    });

    const velocityWatcher = () => {
      let lastY = 0;
      const onScroll = () => {
        const currentY = window.scrollY || window.pageYOffset;
        const velocity = Math.abs(currentY - lastY);
        const strength = Math.min(velocity / 24, 3.2);
        document.documentElement.style.setProperty('--chromatic-shift', `${strength}px`);
        lastY = currentY;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    };

    velocityWatcher();
  };

  const initForm = () => {
    const form = document.querySelector('.inquiry-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const inputs = Array.from(form.querySelectorAll('input, textarea, select'));
      const valid = inputs.every((field) => field.value.trim() !== '');

      if (!valid) {
        alert('Please complete all required fields.');
        return;
      }

      const success = form.querySelector('.form-success');
      if (success) success.style.display = 'block';
      form.reset();
    });
  };

  const initFloatingRequest = () => {
    const hero = document.querySelector('.hero');
    const button = document.querySelector('.floating-request');
    if (!hero || !button) return;

    const observer = new IntersectionObserver(
      (records) => {
        records.forEach((record) => {
          button.classList.toggle('visible', !record.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(hero);
  };

  const initBagSystem = () => {
    const drawer = document.getElementById('allocationBagDrawer');
    const badge = document.getElementById('allocationBagBadge');
    const bagItems = document.getElementById('bagItems');
    const bagExposure = document.getElementById('bagExposure');
    const bagNav = document.getElementById('bagNav');
    const bagCount = badge?.querySelector('.bag-count');
    const closeButton = document.querySelector('.bag-close');
    const modal = document.getElementById('accessModal');
    const modalPrimary = document.querySelector('.modal-primary');
    const modalSecondary = document.querySelector('.modal-secondary');
    const bagSubmit = document.querySelector('.bag-submit');

    const renderBag = () => {
      if (!bagItems) return;

      if (state.bag.length === 0) {
        bagItems.innerHTML = '<div class="bag-empty">No private selections yet.</div>';
      } else {
        const items = state.bag.map((item) => `
          <div class="bag-row">
            <div>
              <h4>${item.name}</h4>
              <p>${item.category}</p>
            </div>
            <div class="bag-price">${formatUSD(item.price)}</div>
          </div>
        `).join('');
        bagItems.innerHTML = items;
      }

      const total = state.bag.reduce((sum, item) => sum + Number(item.price || 0), 0);
      bagExposure.textContent = formatUSD(total);
      bagNav.textContent = formatUSD(Math.round(total * 0.92));
      if (bagCount) bagCount.textContent = String(state.bag.length);
    };

    const openBag = () => {
      if (drawer) drawer.classList.add('open');
    };
    const closeBag = () => {
      if (drawer) drawer.classList.remove('open');
    };

    badge?.addEventListener('click', openBag);
    closeButton?.addEventListener('click', closeBag);
    drawer?.addEventListener('click', (event) => {
      if (event.target === drawer) closeBag();
    });

    const unlockAccess = async () => {
      state.verified = true;
      modal?.classList.remove('open');

      if (window.DwaricaSupabase && typeof window.DwaricaSupabase.triggerAutoAccountProvisioning === 'function') {
        await window.DwaricaSupabase.triggerAutoAccountProvisioning('guest_unlock', {
          source: 'landing_page',
          label: 'Private access unlocked',
          timestamp: new Date().toISOString()
        });
      }
    };

    modalPrimary?.addEventListener('click', unlockAccess);
    modalSecondary?.addEventListener('click', () => modal?.classList.remove('open'));

    document.querySelectorAll('.vault-action').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const item = event.currentTarget.closest('.vault-item');
        if (!item) return;

        const payload = {
          name: item.dataset.itemName,
          price: Number(item.dataset.price || 0),
          category: item.dataset.category || 'Private inventory'
        };

        if (!state.verified) {
          modal?.classList.add('open');
          return;
        }

        state.bag.push(payload);
        renderBag();
        openBag();
      });
    });

    bagSubmit?.addEventListener('click', () => {
      if (state.bag.length === 0) return;
      const contactSection = document.getElementById('contact');
      closeBag();
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    renderBag();
  };

  const initAutoProvision = () => {
    const triggers = document.querySelectorAll('[data-auto-account]');
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', async () => {
        if (window.DwaricaSupabase && typeof window.DwaricaSupabase.triggerAutoAccountProvisioning === 'function') {
          await window.DwaricaSupabase.triggerAutoAccountProvisioning(trigger.dataset.autoAccount, {
            source: 'landing_page',
            label: trigger.textContent.trim(),
            timestamp: new Date().toISOString()
          });
        }
      });
    });
  };

  animateStatNumbers();
  initSmoothScroll();
  initHeadlineReveal();
  initNavClock();
  initParallaxGlow();
  initScrambleHeadings();
  initStrategyAccordion();
  initThreeHero();
  initTilt();
  initOrbit();
  initCinematicScroll();
  initForm();
  initFloatingRequest();
  initBagSystem();
  initAutoProvision();
});
