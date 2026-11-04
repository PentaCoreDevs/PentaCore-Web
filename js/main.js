/**
 * PENTACORE - CLIENT INTERACTION ENGINE
 * Theme Controller, Interactive Hero Showcase, Architecture Explorer & Direct Contact Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeroShowcase();
  initNavbar();
  initArchitectureExplorer();
  initContactForm();
  initScrollSpy();
});

/* ==========================================================================
   0. HERO KINETIC 5-LAYER ISOMETRIC GLASS & LIGHT SCULPTURE (ZERO TEXT)
   ========================================================================== */
function initHeroShowcase() {
  const stage = document.getElementById('hero-showcase-stage');
  const canvas = document.getElementById('hero-kinetic-canvas');
  if (!stage || !canvas) return;

  const ctx = canvas.getContext('2d');
  const layers = Array.from(stage.querySelectorAll('.kinetic-layer'));
  const sheens = layers.map(layer => layer.querySelector('.layer-glass-sheen'));

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    width = rect.width || 520;
    height = rect.height || 520;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Interactive Pointer & Hover State
  let targetX = 0;
  let targetY = 0;
  let smoothX = 0;
  let smoothY = 0;
  let targetHover = 0;
  let smoothHover = 0;

  // Ambient Floating Light Particles
  const particleCount = 26;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    x: (Math.random() - 0.5) * 340,
    y: (Math.random() - 0.5) * 380,
    r: 1.4 + (i % 4) * 0.75,
    speedY: 0.28 + Math.random() * 0.45,
    phase: Math.random() * Math.PI * 2,
    swayAmp: 8 + Math.random() * 14,
    isMint: i % 3 === 0,
    alpha: 0.28 + Math.random() * 0.52
  }));

  // Click Harmonic Shockwaves
  const ripples = [];

  stage.addEventListener('pointerenter', () => {
    targetHover = 1;
  });

  stage.addEventListener('pointermove', (e) => {
    const rect = stage.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    targetHover = 1;
  });

  stage.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    targetHover = 0;
  });

  stage.addEventListener('click', () => {
    ripples.push({ progress: 0 });
    layers.forEach((layer, idx) => {
      setTimeout(() => {
        layer.classList.add('is-pulsing');
        setTimeout(() => layer.classList.remove('is-pulsing'), 520);
      }, idx * 85);
    });
  });

  const startTime = performance.now();

  function renderFrame(now) {
    const t = (now - startTime) * 0.001;

    smoothX += (targetX - smoothX) * 0.075;
    smoothY += (targetY - smoothY) * 0.075;
    smoothHover += (targetHover - smoothHover) * 0.08;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const isMobile = width <= 460;
    const stackScale = isMobile ? 0.76 : 1;

    // Dynamic Isometric Tilt Angles
    const rx = 57.5 - smoothY * 7.5;
    const rz = -45 + smoothX * 10.5;

    // Layer Spacing expands smoothly on hover
    const baseSpacing = (54 + smoothHover * 10) * stackScale;

    const cx = width * 0.5;
    const cy = height * 0.5;

    const layerCenters = [];

    layers.forEach((layer, i) => {
      // i = 0 (bottom) to 4 (top), centered around i = 2
      const relIdx = i - 2;
      const wave = Math.sin(t * 2.0 - i * 0.72) * 6.5;
      const tx = smoothX * (relIdx * 7.5);
      const ty = -relIdx * baseSpacing + wave + smoothY * (relIdx * 4.5);
      const sc = 1 + Math.sin(t * 1.6 - i * 0.5) * 0.012 + smoothHover * 0.018;

      layer.style.setProperty('--tx', `${tx.toFixed(2)}px`);
      layer.style.setProperty('--ty', `${(ty / stackScale).toFixed(2)}px`);
      layer.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      layer.style.setProperty('--rz', `${rz.toFixed(2)}deg`);
      layer.style.setProperty('--sc', sc.toFixed(3));

      if (sheens[i]) {
        const sx = 50 + smoothX * 28 + Math.sin(t + i) * 8;
        const sy = 50 + smoothY * 28 + Math.cos(t + i) * 8;
        sheens[i].style.setProperty('--sheen-x', `${sx.toFixed(1)}%`);
        sheens[i].style.setProperty('--sheen-y', `${sy.toFixed(1)}%`);
      }

      layerCenters.push({
        x: cx + tx * stackScale,
        y: cy + ty
      });
    });

    // Clear & Draw High-DPI Light Field Canvas
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const p0 = layerCenters[0];
    const p4 = layerCenters[4];

    // 1. Vertical Perimeter Laser Filaments connecting the 5 layers
    const filamentOffsets = [
      { dx: -118 * stackScale, dy: 8 * stackScale, phase: 0.0, isMint: false },
      { dx: 118 * stackScale, dy: 8 * stackScale, phase: 0.35, isMint: true },
      { dx: -48 * stackScale, dy: -52 * stackScale, phase: 0.65, isMint: true },
      { dx: 48 * stackScale, dy: 52 * stackScale, phase: 0.85, isMint: false }
    ];

    filamentOffsets.forEach((fil) => {
      const xStart = p0.x + fil.dx;
      const yStart = p0.y + fil.dy * 0.6;
      const xEnd = p4.x + fil.dx * 0.68;
      const yEnd = p4.y + fil.dy * 0.45;

      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xEnd, yEnd);
      ctx.strokeStyle = fil.isMint
        ? (isDark ? 'rgba(52, 211, 153, 0.20)' : 'rgba(16, 185, 129, 0.22)')
        : (isDark ? 'rgba(96, 165, 250, 0.22)' : 'rgba(37, 99, 235, 0.20)');
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Traveling spark along filament
      const prog = (t * 0.42 + fil.phase) % 1;
      const sx = xStart + (xEnd - xStart) * prog;
      const sy = yStart + (yEnd - yStart) * prog;

      const sparkGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 9);
      if (fil.isMint) {
        sparkGrad.addColorStop(0, isDark ? 'rgba(110, 231, 183, 0.95)' : 'rgba(16, 185, 129, 0.9)');
        sparkGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      } else {
        sparkGrad.addColorStop(0, isDark ? 'rgba(147, 197, 253, 0.95)' : 'rgba(37, 99, 235, 0.9)');
        sparkGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
      }
      ctx.fillStyle = sparkGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, 9, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Central Vertical Energy Spine through all 5 cores
    const spineGrad = ctx.createLinearGradient(p0.x, p0.y + 18, p4.x, p4.y - 24);
    spineGrad.addColorStop(0, 'rgba(37, 99, 235, 0)');
    spineGrad.addColorStop(0.2, isDark ? 'rgba(96, 165, 250, 0.45)' : 'rgba(37, 99, 235, 0.38)');
    spineGrad.addColorStop(0.5, isDark ? 'rgba(52, 211, 153, 0.65)' : 'rgba(16, 185, 129, 0.52)');
    spineGrad.addColorStop(0.8, isDark ? 'rgba(96, 165, 250, 0.55)' : 'rgba(37, 99, 235, 0.45)');
    spineGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y + 18);
    ctx.lineTo(p4.x, p4.y - 24);
    ctx.strokeStyle = spineGrad;
    ctx.lineWidth = 2.6;
    ctx.stroke();

    // 3 Rising Core Light Packets along Central Spine
    for (let k = 0; k < 3; k++) {
      const pProg = (t * 0.55 + k / 3) % 1;
      const px = p0.x + (p4.x - p0.x) * pProg;
      const py = p0.y + (p4.y - p0.y) * pProg;
      const alpha = Math.sin(pProg * Math.PI);

      const pktGrad = ctx.createRadialGradient(px, py, 0, px, py, 14);
      pktGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * alpha})`);
      pktGrad.addColorStop(0.35, k % 2 === 0
        ? `rgba(59, 130, 246, ${0.75 * alpha})`
        : `rgba(16, 185, 129, ${0.75 * alpha})`);
      pktGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');

      ctx.fillStyle = pktGrad;
      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Ambient Rising Light Motes
    particles.forEach((pt) => {
      pt.y -= pt.speedY;
      if (pt.y < -200) pt.y = 200;

      const swayX = Math.sin(t * 1.3 + pt.phase) * pt.swayAmp;
      const drawX = cx + (pt.x + swayX) * stackScale + smoothX * 14;
      const drawY = cy + pt.y * stackScale + smoothY * 10;

      const mGrad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, pt.r * 3.8);
      if (pt.isMint) {
        mGrad.addColorStop(0, isDark ? `rgba(110, 231, 183, ${pt.alpha})` : `rgba(16, 185, 129, ${pt.alpha})`);
        mGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      } else {
        mGrad.addColorStop(0, isDark ? `rgba(147, 197, 253, ${pt.alpha})` : `rgba(37, 99, 235, ${pt.alpha})`);
        mGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
      }

      ctx.fillStyle = mGrad;
      ctx.beginPath();
      ctx.arc(drawX, drawY, pt.r * 3.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Interactive Click Shockwave Ellipses
    for (let r = ripples.length - 1; r >= 0; r--) {
      const rp = ripples[r];
      rp.progress += 0.024;
      if (rp.progress >= 1) {
        ripples.splice(r, 1);
        continue;
      }
      const ease = 1 - Math.pow(1 - rp.progress, 3);
      const rxRadius = (40 + ease * 195) * stackScale;
      const ryRadius = rxRadius * 0.52;
      const alpha = (1 - rp.progress) * 0.65;

      ctx.beginPath();
      ctx.ellipse(layerCenters[2].x, layerCenters[2].y, rxRadius, ryRadius, 0, 0, Math.PI * 2);
      ctx.strokeStyle = isDark
        ? `rgba(110, 231, 183, ${alpha})`
        : `rgba(37, 99, 235, ${alpha})`;
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }

    ctx.restore();
    requestAnimationFrame(renderFrame);
  }

  requestAnimationFrame(renderFrame);
}

/* ==========================================================================
   1. THEME CONTROLLER (LIGHT DEFAULT + DARK SWITCHER)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  
  // Default to light theme, check saved preference or initial attribute
  const initialAttr = document.documentElement.getAttribute('data-theme');
  const savedTheme = localStorage.getItem('pentacore-theme') || initialAttr || 'light';
  setTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      localStorage.setItem('pentacore-theme', next);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (!toggleBtn) return;

    if (theme === 'dark') {
      toggleBtn.setAttribute('aria-label', 'Cambiar a modo claro');
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      toggleBtn.setAttribute('aria-label', 'Cambiar a modo oscuro');
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }
}

/* ==========================================================================
   2. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen 
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });
  }
}

/* ==========================================================================
   3. ADAPTIVE ARCHITECTURE EXPLORER & HYBRID COMBINATOR
   5 Real-World Scenarios × 3 Adaptation Stages (15 Dynamic Topologies)
   ========================================================================== */
function initArchitectureExplorer() {
  const tabButtons = document.querySelectorAll('.arch-tab-btn');
  const scaleButtons = document.querySelectorAll('.arch-scale-btn');
  const layerItems = document.querySelectorAll('.arch-layer-item');

  const blueprintTitle = document.getElementById('blueprint-title');
  const blueprintBadge = document.getElementById('blueprint-badge');
  const contextEyebrow = document.getElementById('arch-context-eyebrow');
  const contextText = document.getElementById('arch-context-text');
  const stageStatusPill = document.getElementById('stage-status-pill');
  const telemetryStatus = document.getElementById('telemetry-status');
  const stackTagsContainer = document.getElementById('arch-stack-tags');

  const nodeTopTitle = document.getElementById('node-top-title');
  const nodeTopDesc = document.getElementById('node-top-desc');
  const nodeTopBadge = document.getElementById('node-top-badge');

  const nodeMidTitle = document.getElementById('node-mid-title');
  const nodeMidDesc = document.getElementById('node-mid-desc');
  const nodeMidBadge = document.getElementById('node-mid-badge');

  const nodeBotTitle = document.getElementById('node-bot-title');
  const nodeBotDesc = document.getElementById('node-bot-desc');
  const nodeBotBadge = document.getElementById('node-bot-badge');

  const connectorLabel1 = document.getElementById('connector-label-1');
  const connectorLabel2 = document.getElementById('connector-label-2');

  const metric1Val = document.getElementById('metric-1-val');
  const metric1Lbl = document.getElementById('metric-1-lbl');
  const metric2Val = document.getElementById('metric-2-val');
  const metric2Lbl = document.getElementById('metric-2-lbl');
  const metric3Val = document.getElementById('metric-3-val');
  const metric3Lbl = document.getElementById('metric-3-lbl');

  const dynamicScene = document.getElementById('arch-dynamic-scene');
  const dynamicSvg = document.getElementById('arch-dynamic-svg');
  const sceneCaption = document.getElementById('arch-scene-caption');
  const applyBtn = document.getElementById('arch-apply-btn');
  const applyBtnText = document.getElementById('arch-apply-btn-text');

  const adaptValTopology = document.getElementById('adapt-val-topology');
  const adaptValDeploy = document.getElementById('adapt-val-deploy');
  const adaptValGrowth = document.getElementById('adapt-val-growth');
  const stageEvoText = document.getElementById('stage-evo-text');

  if (!tabButtons.length || !dynamicSvg) return;

  let currentScenario = 'operaciones';
  let currentScale = 'agil';
  let currentLayer = 'top';

  const scaleNames = {
    agil: 'Enfoque Ágil',
    integrado: 'Ecosistema Conectado',
    escala: 'Escala y Alta Demanda'
  };

  const scaleSummaryMeta = {
    agil: {
      topology: '4 Módulos Esenciales',
      deploy: 'Directo sin Fricción',
      growth: 'Base Modular Lista',
      evoText: 'Si mañana tu operación crece o necesitas conectar nuevos sistemas, esta base modular permite evolucionar al siguiente nivel sin desechar ni reescribir lo construido.'
    },
    integrado: {
      topology: '6 Módulos Conectados',
      deploy: 'Sincronización Activa',
      growth: 'APIs y Flujos Unidos',
      evoText: 'Todas tus áreas y herramientas externas trabajan sincronizadas en tiempo real. Puedes sumar nuevas integraciones o canales sin frenar la operación diaria.'
    },
    escala: {
      topology: '7 Nodos Distribuidos',
      deploy: 'Alta Disponibilidad',
      growth: 'Auto-Escalado Elástico',
      evoText: 'Diseñado para soportar picos de demanda, múltiples sucursales o clientes corporativos con aislamiento seguro, balanceo automático y continuidad operativa.'
    }
  };

  const scenarioServiceMap = {
    operaciones: 'custom',
    apps: 'apps',
    automatizacion: 'automation',
    saas: 'saas',
    modernizacion: 'cloud'
  };

  const adaptiveData = {
    operaciones: {
      name: 'Operaciones y Gestión',
      stages: {
        agil: {
          context: 'Ideal cuando tu equipo necesita dejar atrás hojas de cálculo dispersas o procesos manuales con una plataforma interna rápida, clara y ajustada exactamente a tu flujo diario.',
          conn1: 'Peticiones directas por rol',
          conn2: 'Escritura segura y trazable',
          top: { title: 'Panel Operativo Unificado', badge: 'Web Responsiva', desc: 'Interfaz limpia por roles para ventas, operaciones o administración sin curva de aprendizaje.' },
          mid: { title: 'Núcleo de Reglas de tu Negocio', badge: 'Monolito Modular', desc: 'Estados de pedidos, autorizaciones, cálculos y validaciones hechas para tu operación.' },
          bot: { title: 'Base de Datos Centralizada', badge: 'Fuente Única', desc: 'Información estructurada en el motor ideal para tu caso, con respaldos automáticos y trazabilidad.' },
          stack: ['Aplicación Web', 'Roles y Permisos', 'API Modular', 'Motor SQL o NoSQL', 'Respaldos Automáticos'],
          m1: { val: 'Ágil', lbl: 'Puesta en Marcha' },
          m2: { val: '0%', lbl: 'Sobre-Ingeniería' },
          m3: { val: '100%', lbl: 'Ajustado a tu Flujo' },
          telemetry: '100% CÓDIGO PROPIO · SIN LICENCIAS POR USUARIO',
          captions: {
            top: 'Panel Operativo Unificado: Tus equipos trabajan desde una interfaz rápida y clara diseñada alrededor de sus tareas reales.',
            mid: 'Núcleo de Reglas: Un backend modular sin complejidad innecesaria que ejecuta tus validaciones, permisos y flujos de aprobación.',
            bot: 'Base de Datos Centralizada: Elegimos el motor relacional o documental ideal para tu operación, reemplazando archivos sueltos por una fuente única.'
          },
          nodes: {
            top1: ['Panel Operativo', 'Ventas y Operaciones'],
            mid1: ['Motor de Reglas', 'Lógica de tu Negocio', 'Cero Fricción'],
            bot1: ['Base Centralizada', 'SQL / NoSQL Adaptable'],
            bot2: ['Respaldos y Logs', 'Historial Completo']
          }
        },
        integrado: {
          context: 'Cuando ya utilizas facturación electrónica, contabilidad, CRM o almacén y necesitas un sistema central que coordine todas las áreas sin doble captura de información.',
          conn1: 'Flujo sincronizado por área',
          conn2: 'Integración bidireccional activa',
          top: { title: 'Portales por Área y Personal en Campo', badge: 'Web y Tablets', desc: 'Vistas especializadas para oficina, almacén, planta o equipos móviles en ruta.' },
          mid: { title: 'Orquestador de Procesos y Conectores', badge: 'Sincronización Activa', desc: 'Comunica tus áreas automáticamente y conecta con tus sistemas administrativos actuales.' },
          bot: { title: 'Datos Operativos y Sistemas Actuales', badge: 'Cero Doble Captura', desc: 'Sincronización con facturación, contabilidad, inventario y reportes gerenciales en vivo.' },
          stack: ['Portales por Rol', 'Conectores ERP y CRM', 'Facturación Electrónica', 'Webhooks', 'Reportes en Vivo'],
          m1: { val: 'Cero', lbl: 'Doble Captura' },
          m2: { val: 'En Vivo', lbl: 'Conexión entre Áreas' },
          m3: { val: 'Modular', lbl: 'Crece por Etapas' },
          telemetry: 'INTEGRACIÓN FLUIDA CON TUS HERRAMIENTAS ACTUALES',
          captions: {
            top: 'Portales por Área: Cada departamento ve únicamente las herramientas e indicadores que necesita para operar con rapidez.',
            mid: 'Orquestador Central: Cuando ventas cierra una orden, almacén y facturación reciben la información al instante sin pasos manuales.',
            bot: 'Ecosistema Conectado: Nos adaptamos a las bases de datos y sistemas contables que tu empresa ya utiliza hoy.'
          },
          nodes: {
            top1: ['Portal Oficina', 'Gestión y Control'],
            top2: ['Vista de Campo', 'Planta y Almacén'],
            mid1: ['Núcleo Operativo', 'Flujos de Empresa'],
            mid2: ['Puente de APIs', 'Sincronización Activa'],
            bot1: ['Base Operativa', 'Datos y Reportes'],
            bot2: ['ERP y Facturación', 'Sistemas Actuales']
          }
        },
        escala: {
          context: 'Para organizaciones con múltiples sucursales, alto volumen de operaciones simultáneas o requerimientos estrictos de disponibilidad, auditoría y control corporativo.',
          conn1: 'Acceso distribuido multi-sede',
          conn2: 'Persistencia replicada de alta velocidad',
          top: { title: 'Ecosistema Multi-Sucursal y Corporativo', badge: 'Control Regional', desc: 'Operación simultánea para decenas de sedes con acceso único (SSO) y permisos jerárquicos.' },
          mid: { title: 'Servicios de Alta Concurrencia y Colas', badge: 'Procesos Asíncronos', desc: 'Procesamiento fluido de cierres masivos, rutas logísticas y alertas sin bloquear el sistema.' },
          bot: { title: 'Clúster de Datos, Caché y Auditoría', badge: 'Continuidad 24/7', desc: 'Bases de datos con réplicas activas, memoria caché ultrarrápida y trazabilidad total.' },
          stack: ['Multi-Sucursal', 'SSO Corporativo', 'Colas Asíncronas', 'Clúster de Base de Datos', 'Caché en Memoria'],
          m1: { val: 'Multi-Sede', lbl: 'Operación Simultánea' },
          m2: { val: '99.99%', lbl: 'Continuidad Operativa' },
          m3: { val: 'Total', lbl: 'Auditoría y Control' },
          telemetry: 'ARQUITECTURA PREPARADA PARA OPERACIÓN CRÍTICA 24/7',
          captions: {
            top: 'Ecosistema Multi-Sucursal: Todas tus sedes y equipos operan en tiempo real bajo políticas de seguridad unificadas.',
            mid: 'Alta Concurrencia: Tareas pesadas como cierres contables o despachos masivos se procesan en segundo plano sin frenar a los usuarios.',
            bot: 'Clúster y Auditoría: Réplicas automáticas y caché en memoria para garantizar velocidad constante y respaldo permanente.'
          },
          nodes: {
            top1: ['Sedes y Sucursales', 'Operación Regional'],
            top2: ['Gateway de Acceso', 'SSO y Seguridad'],
            top3: ['Dirección General', 'Tablero Corporativo'],
            mid1: ['Servicios Core', 'Reglas Corporativas'],
            mid2: ['Colas de Trabajo', 'Cierres y Lotes'],
            bot1: ['Clúster Principal', 'Alta Disponibilidad'],
            bot2: ['Caché y Auditoría', 'Réplica en Vivo']
          }
        }
      }
    },

    apps: {
      name: 'Apps Web y Móviles',
      stages: {
        agil: {
          context: 'Para lanzar un portal de clientes, sistema de reservas, catálogo interactivo o aplicación móvil con una experiencia impecable y tiempos de entrega cortos.',
          conn1: 'Interacción fluida y segura',
          conn2: 'Transacciones y perfiles protegidos',
          top: { title: 'Aplicación Web y Móvil para Clientes', badge: 'UI/UX Rápida', desc: 'Pantallas intuitivas y veloces adaptadas a teléfonos y escritorio, diseñadas para convertir.' },
          mid: { title: 'API de Clientes, Reservas y Pagos', badge: 'Backend Directo', desc: 'Gestión de cuentas, solicitudes, citas o compras conectada directamente a medios de pago.' },
          bot: { title: 'Base de Clientes y Multimedia', badge: 'Almacenamiento Cloud', desc: 'Perfiles de usuarios, historial de pedidos y archivos optimizados con carga instantánea.' },
          stack: ['App Web / PWA', 'Apps Móviles', 'Pasarelas de Pago', 'Autenticación Segura', 'Notificaciones'],
          m1: { val: 'Intuitiva', lbl: 'Experiencia de Usuario' },
          m2: { val: 'Directa', lbl: 'Integración de Pagos' },
          m3: { val: 'Escalable', lbl: 'Lista para Crecer' },
          telemetry: 'EXPERIENCIA DE USUARIO DISEÑADA PARA WEB Y MÓVIL',
          captions: {
            top: 'Experiencia del Cliente: Interfaces modernas y ligeras donde tus usuarios pueden reservar, comprar o autogestionarse en segundos.',
            mid: 'API Transaccional: Procesa pagos, valida disponibilidad y envía confirmaciones automáticas de forma confiable.',
            bot: 'Datos de Clientes: Almacenamiento seguro de perfiles, historial y documentos con protección de datos personales.'
          },
          nodes: {
            top1: ['App Web y Móvil', 'Portal de Clientes'],
            mid1: ['API de Servicios', 'Reservas y Pagos', 'Flujo Directo'],
            bot1: ['Base de Clientes', 'Perfiles y Pedidos'],
            bot2: ['Pagos y Alertas', 'Confirmación en Vivo']
          }
        },
        integrado: {
          context: 'Cuando la aplicación de tus clientes debe conectarse en tiempo real con tu inventario, agenda interna, CRM, canales de mensajería o logística de entregas.',
          conn1: 'Sincronización omnicanal',
          conn2: 'Actualización inmediata en tus sistemas',
          top: { title: 'Apps Móviles y Portal Web Omnicanal', badge: 'Móvil y Web', desc: 'El cliente inicia su gestión en el teléfono y la continúa en la web con notificaciones push.' },
          mid: { title: 'Motor de Disponibilidad y Fidelización', badge: 'Tiempo Real', desc: 'Reglas dinámicas de precios, cupos en vivo, alertas por mensajería y seguimiento de pedidos.' },
          bot: { title: 'Conexión con tu Inventario y CRM', badge: 'Sincronización Total', desc: 'Cada compra, cita o solicitud impacta automáticamente en tu sistema administrativo.' },
          stack: ['App Móvil + Web', 'Notificaciones Push', 'Canales de Mensajería', 'Sincronización de Stock', 'Panel de Control'],
          m1: { val: 'Omnicanal', lbl: 'Móvil y Web Unidos' },
          m2: { val: 'En Vivo', lbl: 'Stock y Agenda' },
          m3: { val: 'Automático', lbl: 'Flujo Post-Venta' },
          telemetry: 'CONECTADO EN TIEMPO REAL CON TU OPERACIÓN COMERCIAL',
          captions: {
            top: 'Experiencia Omnicanal: Aplicaciones móviles y portal web sincronizados con notificaciones instantáneas al teléfono del cliente.',
            mid: 'Motor Comercial: Coordina pagos, agenda, cupones y avisos automáticos por tus canales de mensajería o correo electrónico.',
            bot: 'Integración Interna: Tu equipo no tiene que copiar pedidos; todo entra directo al inventario y al CRM de la empresa.'
          },
          nodes: {
            top1: ['App Móvil Nube', 'Notificaciones Push'],
            top2: ['Portal Web Clientes', 'Autogestión 24/7'],
            mid1: ['Motor Comercial', 'Pagos y Reservas'],
            mid2: ['Mensajería Activa', 'Alertas y Avisos'],
            bot1: ['Inventario y Agenda', 'Stock en Tiempo Real'],
            bot2: ['CRM y Facturación', 'Registro Automático']
          }
        },
        escala: {
          context: 'Para plataformas digitales de alto tráfico con miles de usuarios simultáneos, picos de demanda en campañas y distribución de contenido a alta velocidad.',
          conn1: 'Distribución global de baja latencia',
          conn2: 'Transacciones protegidas en paralelo',
          top: { title: 'Distribución Edge y Apps de Alto Tráfico', badge: 'Carga Instantánea', desc: 'Red CDN global y optimización extrema para responder en milisegundos desde cualquier lugar.' },
          mid: { title: 'Servicios Elásticos con Auto-Escalado', badge: 'Resistente a Picos', desc: 'La capacidad crece automáticamente durante lanzamientos o campañas de alta demanda.' },
          bot: { title: 'Caché en Memoria y Motor de Búsqueda', badge: 'Baja Latencia', desc: 'Catálogos, sesiones y transacciones de alta velocidad protegidos contra caídas.' },
          stack: ['Red Edge CDN', 'Auto-Escalado Cloud', 'Búsqueda Instantánea', 'Caché en Memoria', 'Seguridad Transaccional'],
          m1: { val: '< 45ms', lbl: 'Tiempo de Respuesta' },
          m2: { val: 'Elástico', lbl: 'Soporta Horas Pico' },
          m3: { val: '99.99%', lbl: 'Disponibilidad' },
          telemetry: 'INFRAESTRUCTURA ELÁSTICA PARA MILES DE USUARIOS CONCURRENTES',
          captions: {
            top: 'Distribución en el Borde: El contenido estático y catálogo se sirven desde nodos cercanos al usuario para una carga inmediata.',
            mid: 'Escalado Automático: Si el tráfico se multiplica por diez en una campaña, los servicios se expanden sin desconectar clientes.',
            bot: 'Velocidad en Memoria: Búsquedas, carritos y sesiones respaldados por caché en memoria y bases de datos replicadas.'
          },
          nodes: {
            top1: ['Apps Móviles', 'Tráfico Masivo'],
            top2: ['Edge CDN Global', 'Caché Cercano'],
            top3: ['Web Transaccional', 'Alta Conversión'],
            mid1: ['Clúster de APIs', 'Auto-Escalado'],
            mid2: ['Cola de Pagos', 'Cero Pérdidas'],
            bot1: ['Base Distribuida', 'Lectura y Escritura'],
            bot2: ['Caché y Buscador', 'Respuesta < 45ms']
          }
        }
      }
    },

    automatizacion: {
      name: 'Automatización y Datos',
      stages: {
        agil: {
          context: 'Para eliminar tareas repetitivas de inmediato: conectar formularios, cruzar datos entre plataformas, generar documentos automáticos o disparar alertas inteligentes.',
          conn1: 'Captura automática de eventos',
          conn2: 'Actualización limpia sin intervención humana',
          top: { title: 'Capturadores de Eventos y Formularios', badge: 'Disparo Automático', desc: 'Recibe información desde tus canales digitales, correos, archivos o acciones del equipo.' },
          mid: { title: 'Motor de Reglas y Transformación', badge: 'Flujo Sin Fricción', desc: 'Valida, limpia, cruza datos y genera reportes o documentos en cuestión de segundos.' },
          bot: { title: 'Actualización de Sistemas y Avisos', badge: 'Cero Error Manual', desc: 'Guarda la información procesada en tus herramientas y notifica a los responsables.' },
          stack: ['Integración por API', 'Webhooks', 'Bots Operativos', 'Generación de Documentos', 'Alertas en Vivo'],
          m1: { val: '-80%', lbl: 'Trabajo Manual' },
          m2: { val: '0%', lbl: 'Errores de Captura' },
          m3: { val: 'Semanas', lbl: 'Retorno Visible' },
          telemetry: 'AUTOMATIZACIÓN DIRECTA PARA AHORRAR HORAS DE TRABAJO EQUIPO',
          captions: {
            top: 'Disparadores Automáticos: El flujo inicia apenas entra un pedido, se sube un archivo o se registra un evento en tu operación.',
            mid: 'Transformación Inteligente: Las reglas de negocio validan y estructuran los datos sin que nadie tenga que copiar y pegar.',
            bot: 'Destino Conectado: Tus hojas de control, bases de datos y canales de comunicación quedan actualizados al instante.'
          },
          nodes: {
            top1: ['Eventos y Archivos', 'Captura Automática'],
            mid1: ['Motor de Flujos', 'Reglas y Limpieza', '100% Automático'],
            bot1: ['Sistemas Internos', 'Datos Actualizados'],
            bot2: ['Avisos y Documentos', 'Entrega Inmediata']
          }
        },
        integrado: {
          context: 'Cuando la información de tu negocio está repartida en varias plataformas y necesitas centralizarla en tableros ejecutivos en vivo o incorporar asistentes de IA.',
          conn1: 'Ingesta programada y eventos en vivo',
          conn2: 'Consolidación en fuente única analítica',
          top: { title: 'Tableros Ejecutivos y Asistentes IA', badge: 'Decisiones en Vivo', desc: 'Visualización clara de rentabilidad, ventas y operaciones con consulta asistida por IA.' },
          mid: { title: 'Pipelines de Datos e Inteligencia Aplicada', badge: 'ETL + Modelos IA', desc: 'Extrae datos de múltiples fuentes, clasifica texto o documentos y unifica criterios.' },
          bot: { title: 'Repositorio Central de Datos (Data Hub)', badge: 'Datos Confiables', desc: 'Consolida finanzas, comercial y operaciones en una estructura lista para análisis.' },
          stack: ['Dashboards en Vivo', 'Pipelines de Datos', 'IA y Modelos Privados', 'Conectores Multi-API', 'Analítica de Negocio'],
          m1: { val: 'Unificada', lbl: 'Visión del Negocio' },
          m2: { val: 'En Vivo', lbl: 'Métricas Clave' },
          m3: { val: 'IA Privada', lbl: 'Asistencia Segura' },
          telemetry: 'DATOS CENTRALIZADOS E INTELIGENCIA ARTIFICIAL SOBRE TU PROPIA INFORMACIÓN',
          captions: {
            top: 'Tableros y Copilotos: Consulta el estado real de tu empresa en segundos mediante paneles interactivos y asistentes sobre tus datos.',
            mid: 'Pipelines e IA: Procesa documentos, clasifica solicitudes y cruza información de ventas y finanzas automáticamente.',
            bot: 'Data Hub Central: Unifica la información dispersa de tus herramientas en una base analítica rápida y confiable.'
          },
          nodes: {
            top1: ['Dashboard Directivo', 'KPIs en Tiempo Real'],
            top2: ['Asistente IA Interno', 'Consulta y Análisis'],
            mid1: ['Pipeline de Datos', 'Cruce y Limpieza'],
            mid2: ['Motor de IA', 'Clasificación Segura'],
            bot1: ['Data Hub Central', 'Histórico Unificado'],
            bot2: ['APIs Externas y ERP', 'Fuentes Conectadas']
          }
        },
        escala: {
          context: 'Para operaciones intensivas en datos que procesan miles de eventos por minuto: logística en tiempo real, telemetría, fintech o motores predictivos.',
          conn1: 'Ingesta continua de alta frecuencia',
          conn2: 'Almacenamiento analítico de alto rendimiento',
          top: { title: 'Centro de Comando y Alertas Predictivas', badge: 'Observabilidad Total', desc: 'Monitoreo en tiempo real con detección temprana de anomalías y desvíos operativos.' },
          mid: { title: 'Streaming de Eventos en Paralelo', badge: 'Alta Velocidad', desc: 'Colas distribuidas que procesan miles de registros por segundo sin cuellos de botella.' },
          bot: { title: 'Almacenamiento de Series de Tiempo y BI', badge: 'Escala Masiva', desc: 'Consultas en milisegundos sobre millones de transacciones y registros históricos.' },
          stack: ['Streaming de Eventos', 'Colas Distribuidas', 'Analítica de Alta Velocidad', 'Alertas Predictivas', 'APIs de Alto Rendimiento'],
          m1: { val: 'Tiempo Real', lbl: 'Procesamiento' },
          m2: { val: 'Millones', lbl: 'Registros Analizados' },
          m3: { val: 'Continuo', lbl: 'Flujo sin Pérdidas' },
          telemetry: 'ARQUITECTURA DE DATOS DE ALTA FRECUENCIA Y TOLERANCIA A FALLOS',
          captions: {
            top: 'Centro de Comando: Visualización instantánea de flujos masivos y alertas automáticas ante cualquier anomalía.',
            mid: 'Streaming en Paralelo: Los eventos se distribuyen en múltiples procesadores para mantener latencia mínima todo el tiempo.',
            bot: 'Base Analítica Masiva: Diseñada para consultar grandes volúmenes históricos sin afectar la velocidad operativa.'
          },
          nodes: {
            top1: ['Tablero en Vivo', 'Monitoreo Continuo'],
            top2: ['Motor de Alertas', 'Detección Temprana'],
            top3: ['APIs Consumidoras', 'Sistemas Externos'],
            mid1: ['Bus de Streaming', 'Ingesta Paralela'],
            mid2: ['Workers Analíticos', 'Cálculo en Vivo'],
            bot1: ['Clúster Analítico', 'Millones de Filas'],
            bot2: ['Series de Tiempo', 'Histórico Rápido']
          }
        }
      }
    },

    saas: {
      name: 'Productos SaaS',
      stages: {
        agil: {
          context: 'Para fundadores y empresas que buscan lanzar un producto SaaS al mercado en semanas para validar con clientes reales, sobre una base limpia lista para crecer.',
          conn1: 'Acceso seguro por cuenta',
          conn2: 'Datos aislados por cliente',
          top: { title: 'Aplicación SaaS y Registro de Clientes', badge: 'Onboarding Rápido', desc: 'Experiencia moderna donde tus primeros clientes crean su cuenta y comienzan a usar el producto.' },
          mid: { title: 'Core del Producto y Suscripciones', badge: 'MVP Escalable', desc: 'La funcionalidad principal de tu solución integrada con cobros recurrentes y planes.' },
          bot: { title: 'Base de Datos Multi-Cuenta', badge: 'Aislamiento Lógico', desc: 'Separación segura de la información de cada cliente con costos de servidor optimizados.' },
          stack: ['Web App Reactiva', 'Pasarelas de Suscripción', 'Autenticación Multi-Cuenta', 'Backend Modular', 'Despliegue Cloud'],
          m1: { val: 'Rápida', lbl: 'Salida al Mercado' },
          m2: { val: 'Controlado', lbl: 'Costo Operativo' },
          m3: { val: 'Sólida', lbl: 'Base para Escalar' },
          telemetry: 'DE IDEA A PRODUCTO COMERCIAL SIN DEUDA TÉCNICA',
          captions: {
            top: 'Onboarding Ágil: Tus usuarios se registran, eligen su plan y acceden al producto desde cualquier navegador.',
            mid: 'Core y Monetización: Construimos el corazón de tu negocio con gestión de suscripciones y permisos desde el primer día.',
            bot: 'Aislamiento Seguro: Aunque es un MVP ágil, los datos de cada empresa cliente están estrictamente protegidos y separados.'
          },
          nodes: {
            top1: ['Clientes SaaS', 'Onboarding y App'],
            mid1: ['Core del Producto', 'Lógica y Planes', 'Base Escalable'],
            bot1: ['Base Multi-Cuenta', 'Aislamiento por Cliente'],
            bot2: ['Pasarela de Cobros', 'Suscripciones Activas']
          }
        },
        integrado: {
          context: 'Cuando tu plataforma SaaS crece en usuarios y necesita gestión de equipos por empresa, facturación por consumo, webhooks y API para integrarse con otros sistemas.',
          conn1: 'Aislamiento por organización y rol',
          conn2: 'Persistencia optimizada con caché',
          top: { title: 'Espacios de Trabajo y Portal de Equipos', badge: 'Multi-Empresa', desc: 'Cada empresa cliente administra sus propios usuarios, permisos, facturación e integraciones.' },
          mid: { title: 'Servicios Modulares y Tareas en Fondo', badge: 'Escalado Comercial', desc: 'Control de límites por plan, envíos masivos, reportes y webhooks para clientes.' },
          bot: { title: 'Datos Particionados y Caché en Memoria', badge: 'Alto Rendimiento', desc: 'Consultas rápidas incluso cuando tus clientes almacenan grandes volúmenes de información.' },
          stack: ['Multi-Tenant Avanzado', 'Cobro por Uso o Plan', 'API Pública y Webhooks', 'Colas en Segundo Plano', 'Motores SQL / NoSQL'],
          m1: { val: 'Self-Service', lbl: 'Gestión de Clientes' },
          m2: { val: 'API-First', lbl: 'Conectable' },
          m3: { val: 'Constante', lbl: 'Velocidad de App' },
          telemetry: 'PLATAFORMA SAAS LISTA PARA CRECIMIENTO COMERCIAL SOSTENIDO',
          captions: {
            top: 'Espacios Multi-Empresa: Tus clientes invitan a su equipo, configuran roles y conectan sus propias herramientas.',
            mid: 'Servicios de Producto: Gestiona límites de uso por plan y ejecuta procesos pesados en segundo plano sin trabar la interfaz.',
            bot: 'Rendimiento con Caché: Combinamos motores de base de datos y caché en memoria para que la aplicación responda al instante.'
          },
          nodes: {
            top1: ['Empresas Cliente', 'Equipos y Roles'],
            top2: ['API y Webhooks', 'Ecosistema Abierto'],
            mid1: ['Core Multi-Tenant', 'Reglas y Límites'],
            mid2: ['Workers Asíncronos', 'Correos y Reportes'],
            bot1: ['Datos Particionados', 'Seguridad por Cliente'],
            bot2: ['Caché en Memoria', 'Sesiones y Velocidad']
          }
        },
        escala: {
          context: 'Para plataformas SaaS consolidadas que atienden clientes corporativos con exigencias de alta disponibilidad (SLA), inicio de sesión empresarial y despliegues sin cortes.',
          conn1: 'Enrutamiento seguro con aislamiento estricto',
          conn2: 'Clústeres distribuidos multi-región',
          top: { title: 'Gateway Global y Acceso Corporativo SSO', badge: 'Seguridad Enterprise', desc: 'Inicio de sesión único corporativo, dominios personalizados y protección perimetral.' },
          mid: { title: 'Microservicios y Aislamiento de Carga', badge: 'Escala Bajo Demanda', desc: 'El uso intensivo de un cliente corporativo nunca degrada la velocidad de los demás.' },
          bot: { title: 'Clústeres Dedicados y Réplicas Activas', badge: '99.99% Uptime', desc: 'Opciones de base de datos compartida o aislada por contrato con respaldo continuo.' },
          stack: ['SSO Empresarial', 'Microservicios', 'Orquestación Elástica', 'Instancias Dedicadas', 'Despliegue Zero-Downtime'],
          m1: { val: '< 32ms', lbl: 'Latencia Media' },
          m2: { val: '99.99%', lbl: 'Disponibilidad SLA' },
          m3: { val: 'Zero-Down', lbl: 'Actualizaciones' },
          telemetry: 'ARQUITECTURA SAAS DE NIVEL CORPORATIVO Y ESCALA GLOBAL',
          captions: {
            top: 'Gateway Global: Valida identidad corporativa, aplica límites de seguridad y distribuye el tráfico con baja latencia.',
            mid: 'Microservicios Desacoplados: Escalamos de forma independiente los módulos más demandados de tu producto SaaS.',
            bot: 'Persistencia Distribuida: Particiones por cliente, réplicas de lectura y caché distribuido para disponibilidad continua.'
          },
          nodes: {
            top1: ['Tenant Corporativo', 'SSO y Dominio Propio'],
            top2: ['API Gateway Edge', 'Aislamiento Activo'],
            top3: ['Cuentas Estándar', 'Acceso Multi-Región'],
            mid1: ['Microservicios SaaS', 'Escala Independiente'],
            mid2: ['Bus de Eventos', 'Colas de Alta Carga'],
            bot1: ['Clúster de Datos', 'Partición y Réplicas'],
            bot2: ['Caché Distribuido', 'Baja Latencia']
          }
        }
      }
    },

    modernizacion: {
      name: 'Modernización y Cloud',
      stages: {
        agil: {
          context: 'Cuando tu sistema actual es lento, sufre caídas o resulta difícil de cambiar, y necesitas estabilizarlo y acelerar su respuesta rápido sin reescribir todo desde cero.',
          conn1: 'Optimización de accesos críticos',
          conn2: 'Consultas afinadas y respaldos seguros',
          top: { title: 'Estabilización de Pantallas y Accesos', badge: 'Mejora Inmediata', desc: 'Eliminamos los cuellos de botella en las vistas y flujos que más frenan a tus usuarios hoy.' },
          mid: { title: 'Refactorización de Puntos Críticos', badge: 'Código Saneado', desc: 'Corregimos fugas de memoria, procesos lentos y brechas de seguridad en tu servidor actual.' },
          bot: { title: 'Afinación de Base de Datos y Respaldos', badge: 'Datos Protegidos', desc: 'Optimización de índices, limpieza de consultas pesadas y respaldos automatizados en tu motor actual.' },
          stack: ['Auditoría de Código', 'Optimización de Consultas', 'Refuerzo de Seguridad', 'Automatización de Deploy', 'Monitoreo de Salud'],
          m1: { val: '+3x', lbl: 'Velocidad de Respuesta' },
          m2: { val: 'Cero', lbl: 'Paradas Operativas' },
          m3: { val: 'Rápido', lbl: 'Alivio Técnico' },
          telemetry: 'ESTABILIZACIÓN Y VELOCIDAD SIN DETENER LA OPERACIÓN DE TU EMPRESA',
          captions: {
            top: 'Mejora Visible: Tus usuarios notan la diferencia de velocidad de inmediato en las pantallas y reportes de uso diario.',
            mid: 'Intervención Quirúrgica: Detectamos y reparamos el 20% del código que causa el 80% de las lentitudes o fallos.',
            bot: 'Protección de Datos: Aseguramos que tu base de datos actual responda rápido y cuente con respaldos verificables.'
          },
          nodes: {
            top1: ['Usuarios Actuales', 'Sin Interrupción'],
            mid1: ['Sistema Optimizado', 'Código Refactorizado', 'Mayor Velocidad'],
            bot1: ['Base de Datos Afinada', 'Índices y Rendimiento'],
            bot2: ['Monitor y Backups', 'Respaldo Automático']
          }
        },
        integrado: {
          context: 'Modernizamos tu plataforma paso a paso: creamos módulos nuevos y modernos que conviven en armonía con tu sistema antiguo hasta reemplazarlo sin riesgo.',
          conn1: 'Enrutamiento transparente para el usuario',
          conn2: 'Sincronización entre lo nuevo y lo actual',
          top: { title: 'Nuevas Interfaces y Módulos Modernos', badge: 'Evolución Gradual', desc: 'Entregamos nuevas funciones con tecnología actual mientras el resto de tu operación sigue activa.' },
          mid: { title: 'Capa Puente de Coexistencia', badge: 'Transición Sin Riesgo', desc: 'Conecta de forma invisible el sistema heredado con los nuevos servicios en contenedores.' },
          bot: { title: 'Migración Progresiva de Datos', badge: '100% Compatible', desc: 'Los datos se mantienen sincronizados y limpios durante cada etapa de la modernización.' },
          stack: ['Reemplazo Gradual', 'API Puente', 'Contenedores Modulares', 'Pruebas Automatizadas', 'Migración Segura'],
          m1: { val: 'Gradual', lbl: 'Riesgo Controlado' },
          m2: { val: '100%', lbl: 'Continuidad de Negocio' },
          m3: { val: 'Mensual', lbl: 'Entregas de Valor' },
          telemetry: 'MODERNIZACIÓN PROGRESIVA: RENUEVA TU TECNOLOGÍA SIN CONGELAR TU EMPRESA',
          captions: {
            top: 'Transición Transparente: Tu equipo y clientes aprovechan las mejoras desde el primer mes sin cambios bruscos.',
            mid: 'Puente de Coexistencia: Dirige cada petición al módulo nuevo o al sistema anterior de forma totalmente transparente.',
            bot: 'Datos Sincronizados: Ningún registro se pierde; la estructura de datos evoluciona de manera controlada.'
          },
          nodes: {
            top1: ['Nueva Interfaz Web', 'Módulos Modernizados'],
            top2: ['Accesos Actuales', 'Continuidad Total'],
            mid1: ['Gateway Puente', 'Enrutamiento Seguro'],
            mid2: ['Nuevos Servicios', 'Arquitectura Limpia'],
            bot1: ['Nueva Base Cloud', 'Estructura Moderna'],
            bot2: ['Sistema Heredado', 'En Reemplazo Gradual']
          }
        },
        escala: {
          context: 'Transformación hacia una infraestructura en la nube automatizada, capaz de escalar sola, desplegar mejoras en minutos y recuperarse automáticamente ante fallos.',
          conn1: 'Despliegue continuo verificado',
          conn2: 'Redundancia multi-zona y observabilidad',
          top: { title: 'Pipelines de Despliegue Continuo (CI/CD)', badge: 'Despliegue Activo', desc: 'Cada mejora pasa por pruebas automáticas y se publica sin desconectar a ningún usuario.' },
          mid: { title: 'Orquestación en Nube y Seguridad', badge: 'Auto-Recuperación', desc: 'Contenedores gestionados con balanceo de carga, redes privadas y cifrado extremo a extremo.' },
          bot: { title: 'Alta Disponibilidad y Telemetría 24/7', badge: 'Resiliencia Total', desc: 'Monitoreo preventivo, respaldos multi-zona y respuesta automática ante picos de carga.' },
          stack: ['Nube Pública o Híbrida', 'Orquestación de Contenedores', 'Pipelines CI/CD', 'Seguridad Zero-Trust', 'Observabilidad 24/7'],
          m1: { val: '< 3 min', lbl: 'Despliegue Seguro' },
          m2: { val: 'Multi-Zona', lbl: 'Redundancia Cloud' },
          m3: { val: '24/7', lbl: 'Monitoreo Activo' },
          telemetry: 'INFRAESTRUCTURA CLOUD MODERNA, AUTOMATIZADA Y RESILIENTE',
          captions: {
            top: 'Entrega Continua: Publicar nuevas funciones deja de ser un riesgo de fin de semana y pasa a ser un proceso automático.',
            mid: 'Orquestación Resiliente: Si un contenedor presenta un fallo, la infraestructura lo reemplaza al instante sin afectar el servicio.',
            bot: 'Observabilidad y Redundancia: Métricas en vivo y réplicas en múltiples zonas para proteger la continuidad del negocio.'
          },
          nodes: {
            top1: ['Repositorio y Código', 'Control de Versiones'],
            top2: ['Pipeline CI/CD', 'Pruebas y Despliegue'],
            top3: ['Tráfico de Usuarios', 'Balanceo Global'],
            mid1: ['Clúster en Nube', 'Auto-Escalado Activo'],
            mid2: ['Red Zero-Trust', 'Seguridad y Cifrado'],
            bot1: ['Datos Multi-Zona', 'Respaldo Continuo'],
            bot2: ['Telemetría 24/7', 'Alertas y Métricas']
          }
        }
      }
    }
  };

  function createSvgNode(x, y, w, h, layerTarget, lines, isHub = false) {
    const rectClass = isHub ? 'node-rect hub-rect' : 'node-rect';
    const titleClass = isHub ? 'node-title-txt hub-txt' : 'node-title-txt';
    const cx = Math.round(w / 2);

    let textMarkup = '';
    if (lines.length === 2) {
      textMarkup = `
        <text x="${cx}" y="${Math.round(h * 0.43)}" text-anchor="middle" class="${titleClass}">${lines[0]}</text>
        <text x="${cx}" y="${Math.round(h * 0.72)}" text-anchor="middle" class="node-sub-txt">${lines[1]}</text>
      `;
    } else if (lines.length >= 3) {
      textMarkup = `
        <text x="${cx}" y="${Math.round(h * 0.32)}" text-anchor="middle" class="${titleClass}">${lines[0]}</text>
        <text x="${cx}" y="${Math.round(h * 0.56)}" text-anchor="middle" class="node-sub-txt">${lines[1]}</text>
        <text x="${cx}" y="${Math.round(h * 0.78)}" text-anchor="middle" class="node-sub-txt" fill="#0A8068">${lines[2]}</text>
      `;
    }

    return `
      <g class="stage-node-box ${isHub ? 'node-hub' : ''}" data-layer-target="${layerTarget}" transform="translate(${x}, ${y})">
        <rect width="${w}" height="${h}" rx="${isHub ? 10 : 8}" class="${rectClass}" />
        ${textMarkup}
      </g>
    `;
  }

  function renderDynamicTopology(scenarioKey, scaleKey) {
    const scenario = adaptiveData[scenarioKey];
    if (!scenario || !scenario.stages[scaleKey]) return;
    const stageData = scenario.stages[scaleKey];
    const n = stageData.nodes;

    let bannerLabel = '';
    let pathsMarkup = '';
    let pulsesMarkup = '';
    let nodesMarkup = '';

    if (scaleKey === 'agil') {
      bannerLabel = 'ARQUITECTURA ESENCIAL · 4 PIEZAS CLAVE SIN SOBRE-INGENIERÍA';
      pathsMarkup = `
        <path class="flow-path" d="M 156 182 L 196 182" />
        <path class="flow-path" d="M 346 168 L 368 168 L 368 122 L 388 122" />
        <path class="flow-path" d="M 346 196 L 368 196 L 368 242 L 388 242" />
      `;
      pulsesMarkup = `
        <circle class="pulse-particle" r="4.5" fill="#1F62E6">
          <animateMotion path="M 156 182 L 196 182" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <circle class="pulse-particle" r="4.5" fill="#1F62E6">
          <animateMotion path="M 346 168 L 368 168 L 368 122 L 388 122" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle class="pulse-particle" r="4.5" fill="#0A8068">
          <animateMotion path="M 346 196 L 368 196 L 368 242 L 388 242" dur="2.1s" repeatCount="indefinite" />
        </circle>
      `;
      nodesMarkup = [
        createSvgNode(18, 150, 138, 64, 'top', n.top1, false),
        createSvgNode(196, 136, 150, 92, 'mid', n.mid1, true),
        createSvgNode(388, 90, 136, 62, 'bot', n.bot1, false),
        createSvgNode(388, 210, 136, 62, 'bot', n.bot2, false)
      ].join('');
    } else if (scaleKey === 'integrado') {
      bannerLabel = 'ECOSISTEMA CONECTADO · 6 MÓDULOS Y SINCRONIZACIÓN ACTIVA';
      pathsMarkup = `
        <path class="flow-path" d="M 150 112 L 194 112" />
        <path class="flow-path" d="M 150 248 L 172 248 L 172 126 L 194 126" />
        <path class="flow-path" d="M 270 148 L 270 212" />
        <path class="flow-path" d="M 346 112 L 390 112" />
        <path class="flow-path" d="M 346 246 L 390 246" />
        <path class="flow-path" d="M 346 128 L 368 128 L 368 232 L 390 232" />
      `;
      pulsesMarkup = `
        <circle class="pulse-particle" r="4.5" fill="#1F62E6">
          <animateMotion path="M 150 112 L 194 112" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <circle class="pulse-particle" r="4.5" fill="#0A8068">
          <animateMotion path="M 150 248 L 172 248 L 172 126 L 194 126" dur="2.1s" repeatCount="indefinite" />
        </circle>
        <circle class="pulse-particle" r="4" fill="#3D7EFF">
          <animateMotion path="M 346 128 L 368 128 L 368 232 L 390 232" dur="1.9s" repeatCount="indefinite" />
        </circle>
      `;
      nodesMarkup = [
        createSvgNode(16, 82, 134, 60, 'top', n.top1, false),
        createSvgNode(16, 218, 134, 60, 'top', n.top2, false),
        createSvgNode(194, 78, 152, 68, 'mid', n.mid1, true),
        createSvgNode(194, 212, 152, 66, 'mid', n.mid2, false),
        createSvgNode(390, 82, 134, 60, 'bot', n.bot1, false),
        createSvgNode(390, 216, 134, 60, 'bot', n.bot2, false)
      ].join('');
    } else {
      bannerLabel = 'ALTA ESCALA Y RESILIENCIA · 7 NODOS DISTRIBUIDOS EN VIVO';
      pathsMarkup = `
        <path class="flow-path" d="M 142 92 L 168 92 L 168 122 L 194 122" />
        <path class="flow-path" d="M 142 182 L 194 134" />
        <path class="flow-path" d="M 142 272 L 168 272 L 168 242 L 194 242" />
        <path class="flow-path" d="M 269 162 L 269 208" />
        <path class="flow-path" d="M 344 122 L 390 114" />
        <path class="flow-path" d="M 344 242 L 390 246" />
        <path class="flow-path" d="M 344 138 L 368 138 L 368 232 L 390 232" />
      `;
      pulsesMarkup = `
        <circle class="pulse-particle" r="4.5" fill="#1F62E6">
          <animateMotion path="M 142 92 L 168 92 L 168 122 L 194 122" dur="1.7s" repeatCount="indefinite" />
        </circle>
        <circle class="pulse-particle" r="4.5" fill="#0A8068">
          <animateMotion path="M 344 138 L 368 138 L 368 232 L 390 232" dur="1.9s" repeatCount="indefinite" />
        </circle>
        <circle class="pulse-particle" r="4.5" fill="#3D7EFF">
          <animateMotion path="M 142 272 L 168 272 L 168 242 L 194 242" dur="1.8s" repeatCount="indefinite" />
        </circle>
      `;
      nodesMarkup = [
        createSvgNode(16, 64, 126, 56, 'top', n.top1, false),
        createSvgNode(16, 152, 126, 60, 'top', n.top2, true),
        createSvgNode(16, 244, 126, 56, 'top', n.top3, false),
        createSvgNode(194, 92, 150, 70, 'mid', n.mid1, true),
        createSvgNode(194, 208, 150, 66, 'mid', n.mid2, false),
        createSvgNode(390, 82, 134, 64, 'bot', n.bot1, false),
        createSvgNode(390, 214, 134, 64, 'bot', n.bot2, false)
      ].join('');
    }

    const headerBannerMarkup = `
      <g class="svg-mode-banner" transform="translate(70, 12)">
        <rect width="400" height="28" rx="14" class="svg-banner-rect" />
        <text x="200" y="18" text-anchor="middle" class="svg-banner-txt">${bannerLabel}</text>
      </g>
    `;

    const bottomLegendMarkup = `
      <g class="svg-layer-legend" transform="translate(35, 330)">
        <g class="svg-legend-pill" data-layer-target="top" transform="translate(0, 0)">
          <rect width="144" height="26" rx="13" class="legend-pill-rect" />
          <text x="72" y="17" text-anchor="middle" class="legend-pill-txt">01 · Experiencia y Acceso</text>
        </g>
        <g class="svg-legend-pill" data-layer-target="mid" transform="translate(163, 0)">
          <rect width="144" height="26" rx="13" class="legend-pill-rect" />
          <text x="72" y="17" text-anchor="middle" class="legend-pill-txt">02 · Lógica y Reglas</text>
        </g>
        <g class="svg-legend-pill" data-layer-target="bot" transform="translate(326, 0)">
          <rect width="144" height="26" rx="13" class="legend-pill-rect" />
          <text x="72" y="17" text-anchor="middle" class="legend-pill-txt">03 · Datos e Integración</text>
        </g>
      </g>
    `;

    dynamicSvg.innerHTML = `
      ${headerBannerMarkup}
      ${pathsMarkup}
      ${pulsesMarkup}
      ${nodesMarkup}
      ${bottomLegendMarkup}
    `;

    // Bind click events to newly rendered SVG nodes and legend pills
    dynamicSvg.querySelectorAll('[data-layer-target]').forEach(el => {
      el.addEventListener('click', () => {
        const target = el.getAttribute('data-layer-target');
        if (target) setFocusedLayer(target);
      });
    });
  }

  function setFocusedLayer(layerKey) {
    if (!layerKey) return;
    currentLayer = layerKey;

    layerItems.forEach(item => {
      const isCurrent = item.dataset.layer === layerKey;
      item.classList.toggle('highlighted', isCurrent);
      item.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    });

    if (dynamicScene) {
      dynamicScene.setAttribute('data-focused-layer', layerKey);
    }

    const scenario = adaptiveData[currentScenario];
    const stageData = scenario && scenario.stages[currentScale];
    if (sceneCaption && stageData && stageData.captions[layerKey]) {
      sceneCaption.textContent = stageData.captions[layerKey];
    }
  }

  function updateArchitectureView() {
    const scenario = adaptiveData[currentScenario];
    if (!scenario) return;
    const stageData = scenario.stages[currentScale];
    if (!stageData) return;

    const scaleLabel = scaleNames[currentScale] || 'Adaptado';

    if (blueprintTitle) blueprintTitle.textContent = `Diseño Adaptado · ${scenario.name}`;
    if (blueprintBadge) blueprintBadge.textContent = scaleLabel;
    if (contextEyebrow) contextEyebrow.textContent = `CÓMO NOS ADAPTAMOS · ${scenario.name.toUpperCase()}`;
    if (contextText) contextText.textContent = stageData.context;

    if (stageStatusPill) stageStatusPill.textContent = `${scenario.name} · ${scaleLabel}`;
    if (telemetryStatus) telemetryStatus.textContent = stageData.telemetry;
    if (applyBtnText) applyBtnText.textContent = `Cotizar ${scenario.name} (${scaleLabel})`;

    if (nodeTopTitle) nodeTopTitle.textContent = stageData.top.title;
    if (nodeTopBadge) nodeTopBadge.textContent = stageData.top.badge;
    if (nodeTopDesc) nodeTopDesc.textContent = stageData.top.desc;

    if (nodeMidTitle) nodeMidTitle.textContent = stageData.mid.title;
    if (nodeMidBadge) nodeMidBadge.textContent = stageData.mid.badge;
    if (nodeMidDesc) nodeMidDesc.textContent = stageData.mid.desc;

    if (nodeBotTitle) nodeBotTitle.textContent = stageData.bot.title;
    if (nodeBotBadge) nodeBotBadge.textContent = stageData.bot.badge;
    if (nodeBotDesc) nodeBotDesc.textContent = stageData.bot.desc;

    if (connectorLabel1) connectorLabel1.textContent = stageData.conn1;
    if (connectorLabel2) connectorLabel2.textContent = stageData.conn2;

    if (stackTagsContainer && Array.isArray(stageData.stack)) {
      stackTagsContainer.innerHTML = stageData.stack
        .map(tag => `<span class="arch-tech-pill">${tag}</span>`)
        .join('');
    }

    if (metric1Val) metric1Val.textContent = stageData.m1.val;
    if (metric1Lbl) metric1Lbl.textContent = stageData.m1.lbl;
    if (metric2Val) metric2Val.textContent = stageData.m2.val;
    if (metric2Lbl) metric2Lbl.textContent = stageData.m2.lbl;
    if (metric3Val) metric3Val.textContent = stageData.m3.val;
    if (metric3Lbl) metric3Lbl.textContent = stageData.m3.lbl;

    const summaryMeta = scaleSummaryMeta[currentScale] || scaleSummaryMeta.agil;
    if (adaptValTopology) adaptValTopology.textContent = summaryMeta.topology;
    if (adaptValDeploy) adaptValDeploy.textContent = summaryMeta.deploy;
    if (adaptValGrowth) adaptValGrowth.textContent = summaryMeta.growth;
    if (stageEvoText) stageEvoText.textContent = summaryMeta.evoText;

    renderDynamicTopology(currentScenario, currentScale);
    setFocusedLayer(currentLayer);
  }

  // Bind Scenario Tabs (Step 1)
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentScenario = btn.dataset.tab;
      updateArchitectureView();
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });

  // Bind Complexity / Stage Buttons (Step 2)
  scaleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      scaleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScale = btn.dataset.scale;
      updateArchitectureView();
    });
  });

  // Bind Layer Specification Cards
  layerItems.forEach(item => {
    item.addEventListener('click', () => {
      setFocusedLayer(item.dataset.layer);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setFocusedLayer(item.dataset.layer);
      }
    });
  });

  // Bind "Cotizar un escenario como este" button to pre-fill contact form
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const serviceSelect = document.getElementById('service');
      const messageArea = document.getElementById('message');
      const scenario = adaptiveData[currentScenario];
      const scaleLabel = scaleNames[currentScale] || 'Adaptado';

      if (serviceSelect && scenarioServiceMap[currentScenario]) {
        serviceSelect.value = scenarioServiceMap[currentScenario];
      }
      if (messageArea && scenario) {
        messageArea.value = `Hola equipo de PentaCore, me interesa desarrollar un proyecto de "${scenario.name}" con alcance de "${scaleLabel}". Buscamos resolver lo siguiente: `;
        setTimeout(() => messageArea.focus(), 550);
      }
    });
  }

  // Bind Hybrid Combinator Chips & CTA
  const hybridChips = document.querySelectorAll('.hybrid-chip');
  const hybridCountLabel = document.getElementById('hybrid-count-label');
  const hybridCtaBtn = document.getElementById('hybrid-cta-btn');

  function updateHybridSummary() {
    const activeChips = Array.from(hybridChips).filter(c => c.classList.contains('active'));
    const count = activeChips.length;
    if (hybridCountLabel) {
      hybridCountLabel.textContent = count === 1
        ? '1 pieza seleccionada para tu arquitectura'
        : `${count} piezas seleccionadas para tu arquitectura`;
    }
  }

  hybridChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const isActive = chip.classList.toggle('active');
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      const checkSpan = chip.querySelector('.chip-check');
      if (checkSpan) {
        checkSpan.textContent = isActive ? '✓' : '+';
      }
      updateHybridSummary();
    });
  });

  if (hybridCtaBtn) {
    hybridCtaBtn.addEventListener('click', () => {
      const activeModules = Array.from(hybridChips)
        .filter(c => c.classList.contains('active'))
        .map(c => c.dataset.module);

      const serviceSelect = document.getElementById('service');
      const messageArea = document.getElementById('message');

      if (serviceSelect) {
        serviceSelect.value = 'hybrid';
      }
      if (messageArea) {
        const modulesList = activeModules.length
          ? activeModules.join(', ')
          : 'Solución personalizada a medida';
        messageArea.value = `Hola equipo de PentaCore, mi proyecto combina las siguientes piezas: ${modulesList}. Nuestra necesidad principal es: `;
        setTimeout(() => messageArea.focus(), 550);
      }
    });
  }

  // Render initial state
  updateArchitectureView();
  updateHybridSummary();
}

/* ==========================================================================
   4. CONTACT FORM ACTION ENGINE
   Dispatches formatted mailto: and provides clipboard & chat options
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !feedback || !submitBtn) return;

  const serviceLabels = {
    custom: "Operaciones y Software a Medida",
    apps: "Aplicación Web, Móvil o Portal",
    automation: "Automatización, APIs y Datos",
    saas: "Producto SaaS Escalable",
    cloud: "Modernización y Arquitectura Cloud",
    hybrid: "Arquitectura Híbrida (Combinación a Medida)",
    consulting: "Consultoría Técnica",
    other: "Otro requerimiento"
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const company = form.company.value.trim() || 'No especificada';
    const serviceVal = form.service.value;
    const serviceText = serviceLabels[serviceVal] || serviceVal;
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showError('Por favor completa los campos obligatorios: Nombre, Correo y Descripción.');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Por favor ingresa un correo electrónico con formato válido.');
      return;
    }

    // Prepare structured message
    const emailSubject = encodeURIComponent(`[PentaCore] Requerimiento de ${name} - ${serviceText}`);
    const emailBodyText = `Hola equipo de PentaCore,%0D%0A%0D%0A` +
      `Mi nombre: ${encodeURIComponent(name)}%0D%0A` +
      `Correo: ${encodeURIComponent(email)}%0D%0A` +
      `Empresa: ${encodeURIComponent(company)}%0D%0A` +
      `Solución requerida: ${encodeURIComponent(serviceText)}%0D%0A%0D%0A` +
      `Descripción de la necesidad:%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0A` +
      `---%0D%0AEnviado desde el formulario oficial de pentacore.dev`;

    const plainTextCopy = `Hola equipo de PentaCore,\n\n` +
      `Mi nombre: ${name}\n` +
      `Correo: ${email}\n` +
      `Empresa: ${company}\n` +
      `Solución requerida: ${serviceText}\n\n` +
      `Descripción de la necesidad:\n${message}\n`;

    const mailtoUrl = `mailto:contacto@pentacore.dev?subject=${emailSubject}&body=${emailBodyText}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(plainTextCopy)}`;

    // Trigger user's mail client directly
    window.location.href = mailtoUrl;

    // Display rich confirmation box with alternate actions
    feedback.className = 'form-feedback success';
    feedback.innerHTML = `
      <div>
        <strong>✓ Requerimiento preparado:</strong> Se ha abierto tu cliente de correo (Gmail, Outlook, Apple Mail) listo para remitir a <strong>contacto@pentacore.dev</strong>.
      </div>
      <div style="font-size: 0.84rem; color: var(--text-muted);">
        Si utilizas correo web o no se abrió tu cliente automáticamente, puedes usar estas alternativas directas:
      </div>
      <div class="feedback-actions">
        <button type="button" class="btn-inline-action" id="btn-copy-msg">
          📋 Copiar datos al portapapeles
        </button>
        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-inline-action">
          💬 Enviar por WhatsApp
        </a>
      </div>
    `;

    const copyBtn = document.getElementById('btn-copy-msg');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(plainTextCopy).then(() => {
          copyBtn.textContent = '✓ ¡Copiado al portapapeles!';
          setTimeout(() => {
            copyBtn.textContent = '📋 Copiar datos al portapapeles';
          }, 3000);
        });
      });
    }

    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  function showError(msg) {
    feedback.className = 'form-feedback error';
    feedback.innerHTML = `<strong>Error:</strong> ${msg}`;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* ==========================================================================
   5. SCROLL SPY FOR ACTIVE NAVIGATION LINK
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: "-70px 0px -40% 0px"
  });

  sections.forEach(section => observer.observe(section));
}
