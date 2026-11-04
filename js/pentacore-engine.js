/**
 * PENTACORE ENGINE - KINETIC 5-LAYER ARCHITECTURAL SCULPTURE
 * Minimalist, high-contrast 3D centerpiece built with Three.js
 *
 * Concept:
 * - 5 precision-beveled architectural squircle plates floating in an isometric
 *   stack around a central optical aperture and faceted sapphire core.
 * - Subtle, mesmerizing kinetic animation:
 *   1. Staggered torsion wave + micro-orbital glide (helical liquid ripple across the 5 layers).
 *   2. Harmonic vertical breathing (gentle expansion/compression of air gaps).
 *   3. Sequential luminosity pulse cascading across the 5 cobalt inlay rims.
 *   4. Interactive cursor magnetism with per-layer cascading inertia, hover
 *      "exploded view" expansion, and click wave ripple.
 */

import * as THREE from 'three';

export class PentaCoreEngine {
  constructor(containerElement) {
    this.container = containerElement;
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.pmremGenerator = null;
    this.envMapLight = null;
    this.envMapDark = null;

    // Timing
    this.lastTime = performance.now();
    this.elapsedTime = 0;

    // Scene Hierarchy
    this.masterGroup = null;
    this.layers = [];
    this.layerMaterials = [];
    this.inlayMaterials = [];
    this.coreGroup = null;
    this.innerJewelMesh = null;
    this.jewelEdgesMesh = null;
    this.coreRingMesh = null;
    this.shadowPlane = null;
    this.baseShadowOpacity = 0.85;

    // Studio Lighting
    this.keyLight = null;
    this.rimLight = null;
    this.fillLight = null;
    this.ambientLight = null;
    this.corePointLight = null;

    // Shared Core Materials
    this.sapphireCoreMaterial = null;
    this.jewelEdgeMaterial = null;

    // Interaction & Animation State
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.layerMouse = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 }
    ];
    this.isHovered = false;
    this.hoverBoost = 0;
    this.clickPulse = 0;
    this.isVisible = true;
    this.reducedMotion = false;
    this.animationFrameId = null;
    this.isDark = false;

    // Entrance Animation
    this.entranceStartTime = null;
    this.entranceDuration = 1.1;
    this.isAssembled = false;

    // Isometric viewing pitch
    this.basePitch = 0.56; // ~32 deg isometric elevation
    this.baseRoll = 0.0;

    // Observers
    this.resizeObserver = null;
    this.intersectionObserver = null;

    this.init();
  }

  init() {
    // 1. Accessibility: check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
    });

    // 2. Setup Scene & Camera
    this.scene = new THREE.Scene();

    const width = this.container.clientWidth || 540;
    const height = this.container.clientHeight || 520;

    this.camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    this.camera.position.set(0, 0.12, 7.3);

    // 3. Setup WebGL Renderer with Shadows
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = true;

    const canvas = this.renderer.domElement;
    canvas.id = 'pentacore-engine-canvas';
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.outline = 'none';
    canvas.style.pointerEvents = 'auto';
    canvas.style.cursor = 'pointer';
    canvas.style.touchAction = 'pan-y';
    canvas.setAttribute('aria-label', 'Escultura tridimensional interactiva de 5 módulos PentaCore');
    canvas.setAttribute('role', 'img');

    this.container.appendChild(canvas);

    // 4. Generate Procedural Studio Environment Maps
    this.initStudioEnvironments();

    // 5. Build Lighting, Ground Shadow & 5-Layer Kinetic Sculpture
    this.buildLighting();
    this.buildGroundShadow();
    this.buildKineticStack();

    // 6. Setup Observers & Listeners
    this.setupInteraction();
    this.setupObservers();

    // 7. Theme Sync
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    this.updateTheme(currentTheme);

    // 8. Start Loop
    this.entranceStartTime = performance.now();
    this.lastTime = performance.now();
    this.animate();
  }

  /**
   * Procedural Photographic Studio Softbox Environment Map
   */
  initStudioEnvironments() {
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.pmremGenerator.compileEquirectangularShader();

    const createEnvTexture = (isDark) => {
      const cv = document.createElement('canvas');
      cv.width = 512;
      cv.height = 256;
      const ctx = cv.getContext('2d');

      const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
      if (isDark) {
        bgGrad.addColorStop(0, '#1E293B');
        bgGrad.addColorStop(0.5, '#0F172A');
        bgGrad.addColorStop(1, '#020617');
      } else {
        bgGrad.addColorStop(0, '#FFFFFF');
        bgGrad.addColorStop(0.5, '#DBEAFE');
        bgGrad.addColorStop(1, '#93C5FD');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 512, 256);

      // Top studio softbox
      const topGrad = ctx.createRadialGradient(256, 30, 0, 256, 30, 150);
      topGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      topGrad.addColorStop(0.5, 'rgba(239, 246, 255, 0.8)');
      topGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, 512, 130);

      // Left corporate blue rim softbox
      const leftGrad = ctx.createRadialGradient(75, 128, 0, 75, 128, 120);
      leftGrad.addColorStop(0, isDark ? 'rgba(59, 130, 246, 0.95)' : 'rgba(37, 99, 235, 0.90)');
      leftGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
      ctx.fillStyle = leftGrad;
      ctx.fillRect(0, 30, 195, 200);

      // Right ice highlight softbox
      const rightGrad = ctx.createRadialGradient(435, 128, 0, 435, 128, 110);
      rightGrad.addColorStop(0, isDark ? 'rgba(147, 197, 253, 0.75)' : 'rgba(255, 255, 255, 0.95)');
      rightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = rightGrad;
      ctx.fillRect(320, 30, 192, 200);

      const tex = new THREE.CanvasTexture(cv);
      tex.mapping = THREE.EquirectangularReflectionMapping;
      const pmrem = this.pmremGenerator.fromEquirectangular(tex);
      tex.dispose();
      return pmrem.texture;
    };

    this.envMapLight = createEnvTexture(false);
    this.envMapDark = createEnvTexture(true);
  }

  buildLighting() {
    // 1. Studio Key Light with Shadow Map for inter-layer depth
    this.keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.3);
    this.keyLight.position.set(3.8, 7.2, 4.6);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.camera.near = 2.0;
    this.keyLight.shadow.camera.far = 14.0;
    const d = 2.3;
    this.keyLight.shadow.camera.left = -d;
    this.keyLight.shadow.camera.right = d;
    this.keyLight.shadow.camera.top = d;
    this.keyLight.shadow.camera.bottom = -d;
    this.keyLight.shadow.bias = -0.0008;
    this.keyLight.shadow.normalBias = 0.02;
    this.scene.add(this.keyLight);

    // 2. Studio Rim Light (Cobalt/ice grazing light from left-rear)
    this.rimLight = new THREE.DirectionalLight(0x2563EB, 2.0);
    this.rimLight.position.set(-4.5, -2.0, -3.0);
    this.scene.add(this.rimLight);

    // 3. Studio Fill Light (Soft front-left fill)
    this.fillLight = new THREE.DirectionalLight(0xF8FAFC, 0.85);
    this.fillLight.position.set(-3.5, 3.0, 4.5);
    this.scene.add(this.fillLight);

    // 4. Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xE2E8F0, 0.65);
    this.scene.add(this.ambientLight);

    // 5. Internal Core Point Light
    this.corePointLight = new THREE.PointLight(0x3B82F6, 2.4, 4.8, 1.3);
    this.corePointLight.position.set(0, 0.15, 0);
    this.scene.add(this.corePointLight);
  }

  /**
   * Ground contact shadow plane that breathes with the floating stack.
   */
  buildGroundShadow() {
    const cv = document.createElement('canvas');
    cv.width = 128;
    cv.height = 128;
    const ctx = cv.getContext('2d');

    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(30, 58, 138, 0.24)');
    grad.addColorStop(0.38, 'rgba(30, 41, 59, 0.11)');
    grad.addColorStop(0.72, 'rgba(51, 65, 85, 0.02)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(cv);
    const shadowGeo = new THREE.PlaneGeometry(4.3, 4.3);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });

    this.shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.position.set(0, -1.62, 0);
    this.scene.add(this.shadowPlane);
  }

  /**
   * Helper: creates a 2D rounded-square shape with an optional circular center hole
   */
  createRoundedPlateShape(size, cornerRadius, holeRadius = 0) {
    const shape = new THREE.Shape();
    const half = size / 2;
    const r = Math.min(cornerRadius, half * 0.48);

    shape.moveTo(-half + r, -half);
    shape.lineTo(half - r, -half);
    shape.absarc(half - r, -half + r, r, -Math.PI / 2, 0, false);
    shape.lineTo(half, half - r);
    shape.absarc(half - r, half - r, r, 0, Math.PI / 2, false);
    shape.lineTo(-half + r, half);
    shape.absarc(-half + r, half - r, r, Math.PI / 2, Math.PI, false);
    shape.lineTo(-half, -half + r);
    shape.absarc(-half + r, -half + r, r, Math.PI, Math.PI * 1.5, false);

    if (holeRadius > 0) {
      const holePath = new THREE.Path();
      holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
      shape.holes.push(holePath);
    }

    return shape;
  }

  /**
   * Helper: creates a thin rounded-square contour ribbon for the top inlay track
   */
  createInlayContourGeometry(size, cornerRadius, width) {
    const outerShape = this.createRoundedPlateShape(size, cornerRadius, 0);
    const innerSize = size - width * 2;
    const innerRadius = Math.max(0.02, cornerRadius - width);
    const half = innerSize / 2;
    const r = Math.min(innerRadius, half * 0.48);

    const hole = new THREE.Path();
    hole.moveTo(-half + r, -half);
    hole.lineTo(half - r, -half);
    hole.absarc(half - r, -half + r, r, -Math.PI / 2, 0, false);
    hole.lineTo(half, half - r);
    hole.absarc(half - r, half - r, r, 0, Math.PI / 2, false);
    hole.lineTo(-half + r, half);
    hole.absarc(-half + r, half - r, r, Math.PI / 2, Math.PI, false);
    hole.lineTo(-half, -half + r);
    hole.absarc(-half + r, -half + r, r, Math.PI, Math.PI * 1.5, false);
    outerShape.holes.push(hole);

    const geo = new THREE.ExtrudeGeometry(outerShape, {
      depth: 0.012,
      bevelEnabled: false,
      curveSegments: 28
    });
    geo.center();
    geo.rotateX(Math.PI / 2);
    return geo;
  }

  /**
   * Builds the 5-Layer Floating Architectural Stack + Suspended Sapphire Core
   */
  buildKineticStack() {
    this.masterGroup = new THREE.Group();
    this.masterGroup.position.y = 0.06;
    this.scene.add(this.masterGroup);

    const LAYER_COUNT = 5;
    // Harmonious architectural proportions across the 5 layers
    const layerSizes = [1.52, 1.68, 1.82, 1.68, 1.52];
    const holeRadii = [0.40, 0.44, 0.48, 0.46, 0.44];
    const baseGap = 0.34;

    this.layers = [];
    this.layerMaterials = [];
    this.inlayMaterials = [];

    for (let i = 0; i < LAYER_COUNT; i++) {
      const size = layerSizes[i];
      const cornerRadius = size * 0.24;
      const holeRadius = holeRadii[i];
      const isCenterLayer = i === 2;

      const layerGroup = new THREE.Group();
      const baseY = (i - 2) * baseGap;
      layerGroup.position.y = baseY;
      layerGroup.rotation.y = Math.PI / 4; // 45-deg diamond isometric orientation

      layerGroup.userData = {
        index: i,
        baseGap,
        isCenterLayer
      };

      // 1. Beveled Architectural Plate Geometry
      const plateShape = this.createRoundedPlateShape(size, cornerRadius, holeRadius);
      const plateGeo = new THREE.ExtrudeGeometry(plateShape, {
        depth: isCenterLayer ? 0.088 : 0.068,
        bevelEnabled: true,
        bevelThickness: 0.028,
        bevelSize: 0.028,
        bevelSegments: 8,
        curveSegments: 32
      });
      plateGeo.center();
      plateGeo.rotateX(Math.PI / 2);

      const plateMat = new THREE.MeshPhysicalMaterial({
        color: isCenterLayer ? 0x1D4ED8 : 0xD8E8FA,
        roughness: isCenterLayer ? 0.20 : 0.16,
        metalness: isCenterLayer ? 0.12 : 0.06,
        clearcoat: isCenterLayer ? 0.85 : 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 0.95,
        emissive: isCenterLayer ? 0x1E40AF : 0x2563EB,
        emissiveIntensity: isCenterLayer ? 0.28 : 0.03
      });

      const plateMesh = new THREE.Mesh(plateGeo, plateMat);
      plateMesh.castShadow = true;
      plateMesh.receiveShadow = true;
      layerGroup.add(plateMesh);
      this.layerMaterials.push(plateMat);

      // 2. Top Surface Precision Inlay Track
      const inlaySize = size * 0.84;
      const inlayCorner = cornerRadius * 0.80;
      const inlayGeo = this.createInlayContourGeometry(inlaySize, inlayCorner, 0.024);

      const inlayMat = new THREE.MeshPhysicalMaterial({
        color: isCenterLayer ? 0xFFFFFF : 0x2563EB,
        roughness: 0.14,
        metalness: 0.18,
        clearcoat: 1.0,
        emissive: isCenterLayer ? 0x93C5FD : 0x1D4ED8,
        emissiveIntensity: isCenterLayer ? 0.65 : 0.42
      });

      const inlayMesh = new THREE.Mesh(inlayGeo, inlayMat);
      inlayMesh.position.y = (isCenterLayer ? 0.044 : 0.034) + 0.028 + 0.005;
      layerGroup.add(inlayMesh);
      this.inlayMaterials.push(inlayMat);

      this.masterGroup.add(layerGroup);
      this.layers.push(layerGroup);
    }

    // ==========================================
    // CENTRAL SUSPENDED SAPPHIRE CORE (Crowned in the upper-center aperture)
    // ==========================================
    this.coreGroup = new THREE.Group();
    // Positioned slightly elevated so the faceted crystal is clearly visible through the top aperture
    this.coreGroup.position.y = 0.42;

    this.sapphireCoreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1D4ED8,
      emissive: 0x2563EB,
      emissiveIntensity: 0.42,
      roughness: 0.14,
      metalness: 0.22,
      clearcoat: 1.0,
      flatShading: true
    });

    const jewelGeo = new THREE.OctahedronGeometry(0.26, 0);
    jewelGeo.scale(1.0, 1.38, 1.0);
    this.innerJewelMesh = new THREE.Mesh(jewelGeo, this.sapphireCoreMaterial);
    this.innerJewelMesh.castShadow = true;
    this.coreGroup.add(this.innerJewelMesh);

    // Crisp luminous wireframe edges on the sapphire crystal
    const jewelEdgesGeo = new THREE.EdgesGeometry(jewelGeo);
    this.jewelEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0x93C5FD,
      transparent: true,
      opacity: 0.75
    });
    this.jewelEdgesMesh = new THREE.LineSegments(jewelEdgesGeo, this.jewelEdgeMaterial);
    this.innerJewelMesh.add(this.jewelEdgesMesh);

    // Subtle orbital halo ring around the crystal
    const coreRingGeo = new THREE.TorusGeometry(0.35, 0.012, 16, 80);
    coreRingGeo.rotateX(Math.PI / 2);
    const coreRingMat = new THREE.MeshBasicMaterial({
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.80
    });
    this.coreRingMesh = new THREE.Mesh(coreRingGeo, coreRingMat);
    this.coreGroup.add(this.coreRingMesh);

    this.masterGroup.add(this.coreGroup);
  }

  setupInteraction() {
    const heroSection = this.container.closest('.hero-section') || this.container;

    const onPointerMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.5;

      const nx = THREE.MathUtils.clamp((e.clientX - centerX) / (rect.width * 0.85), -1, 1);
      const ny = THREE.MathUtils.clamp(-(e.clientY - centerY) / (rect.height * 0.85), -1, 1);

      this.mouse.targetX = -ny * 0.16;
      this.mouse.targetY = nx * 0.25;
    };

    const onStageEnter = () => {
      this.isHovered = true;
    };

    const onStageLeave = () => {
      this.isHovered = false;
    };

    const onHeroLeave = () => {
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
      this.isHovered = false;
    };

    const onStageClick = () => {
      if (!this.reducedMotion) {
        this.clickPulse = 1.0;
      }
    };

    heroSection.addEventListener('pointermove', onPointerMove, { passive: true });
    heroSection.addEventListener('pointerleave', onHeroLeave, { passive: true });
    this.container.addEventListener('pointerenter', onStageEnter, { passive: true });
    this.container.addEventListener('pointerleave', onStageLeave, { passive: true });
    this.container.addEventListener('click', onStageClick);
    window.addEventListener('blur', onHeroLeave);

    this._cleanupInteraction = () => {
      heroSection.removeEventListener('pointermove', onPointerMove);
      heroSection.removeEventListener('pointerleave', onHeroLeave);
      this.container.removeEventListener('pointerenter', onStageEnter);
      this.container.removeEventListener('pointerleave', onStageLeave);
      this.container.removeEventListener('click', onStageClick);
      window.removeEventListener('blur', onHeroLeave);
    };
  }

  setupObservers() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        if (width > 0 && height > 0) {
          this.handleResize(width, height);
        }
      }
    });
    this.resizeObserver.observe(this.container);

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !this.animationFrameId) {
            this.lastTime = performance.now();
            this.animate();
          }
        });
      },
      { threshold: 0.05 }
    );
    this.intersectionObserver.observe(this.container);
  }

  handleResize(width, height) {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = width / height;

    if (width < 480) {
      this.camera.position.z = 8.0;
    } else if (width < 768) {
      this.camera.position.z = 7.6;
    } else {
      this.camera.position.z = 7.3;
    }

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  updateTheme(theme) {
    const isDark = theme === 'dark';
    this.isDark = isDark;

    if (this.scene) {
      this.scene.environment = isDark ? this.envMapDark : this.envMapLight;
    }

    // Studio Lighting Calibration
    if (this.ambientLight) {
      this.ambientLight.intensity = isDark ? 0.55 : 0.68;
      this.ambientLight.color.setHex(isDark ? 0x94A3B8 : 0xF1F5F9);
    }

    if (this.keyLight) {
      this.keyLight.intensity = isDark ? 2.7 : 2.3;
      this.keyLight.color.setHex(isDark ? 0xE2E8F0 : 0xFFFFFF);
    }

    if (this.rimLight) {
      this.rimLight.color.setHex(isDark ? 0x60A5FA : 0x2563EB);
      this.rimLight.intensity = isDark ? 2.3 : 2.0;
    }

    if (this.fillLight) {
      this.fillLight.intensity = isDark ? 0.75 : 0.90;
    }

    if (this.corePointLight) {
      this.corePointLight.intensity = isDark ? 2.8 : 2.2;
    }

    // 5-Layer Tonal Palette (Outer -> Inner -> Core -> Inner -> Outer)
    const lightLayerColors = [0xCFE2FA, 0xB4D2F8, 0x1D4ED8, 0xB8D4F8, 0xE6F0FC];
    const darkLayerColors = [0x172554, 0x1E3A8A, 0x2563EB, 0x1E3A8A, 0x1E293B];

    for (let i = 0; i < this.layerMaterials.length; i++) {
      const mat = this.layerMaterials[i];
      const isCenter = i === 2;
      mat.color.setHex(isDark ? darkLayerColors[i] : lightLayerColors[i]);
      mat.emissive.setHex(isCenter ? 0x1D4ED8 : 0x2563EB);
      mat.emissiveIntensity = isCenter ? (isDark ? 0.35 : 0.26) : (isDark ? 0.14 : 0.03);
    }

    for (let i = 0; i < this.inlayMaterials.length; i++) {
      const inMat = this.inlayMaterials[i];
      const isCenter = i === 2;
      if (isCenter) {
        inMat.color.setHex(0xFFFFFF);
        inMat.emissive.setHex(0x93C5FD);
      } else {
        inMat.color.setHex(isDark ? 0x60A5FA : 0x2563EB);
        inMat.emissive.setHex(isDark ? 0x3B82F6 : 0x1D4ED8);
      }
    }

    if (this.sapphireCoreMaterial) {
      this.sapphireCoreMaterial.color.setHex(isDark ? 0x3B82F6 : 0x1D4ED8);
      this.sapphireCoreMaterial.emissiveIntensity = isDark ? 0.55 : 0.42;
    }

    this.baseShadowOpacity = isDark ? 0.45 : 0.85;
    if (this.shadowPlane && this.shadowPlane.material) {
      this.shadowPlane.material.opacity = this.baseShadowOpacity;
    }
  }

  animate() {
    if (!this.isVisible) {
      this.animationFrameId = null;
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    // Hover & Click states
    const targetHover = this.isHovered && !this.reducedMotion ? 1.0 : 0.0;
    this.hoverBoost += (targetHover - this.hoverBoost) * 0.065;

    if (this.clickPulse > 0.001) {
      this.clickPulse *= Math.pow(0.08, delta);
    } else {
      this.clickPulse = 0;
    }

    const timeScale = this.reducedMotion ? 0.25 : 1.0 + this.hoverBoost * 0.28;
    this.elapsedTime += delta * timeScale;
    const t = this.elapsedTime;

    // --- 1. ENTRANCE ASSEMBLY ---
    let entranceScale = 1.0;
    if (!this.isAssembled && this.entranceStartTime) {
      const progress = Math.min((now - this.entranceStartTime) / (this.entranceDuration * 1000), 1.0);
      const ease = 1 - Math.pow(1 - progress, 3);
      entranceScale = 0.86 + ease * 0.14;

      if (this.renderer && this.renderer.domElement) {
        this.renderer.domElement.style.opacity = Math.min(progress * 1.25, 1.0);
      }

      if (progress >= 1.0) {
        this.isAssembled = true;
      }
    }

    // --- 2. CASCADING INERTIAL CURSOR PARALLAX PER LAYER ---
    if (!this.reducedMotion) {
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

      // Top layer reacts fastest, lower layers follow in a silky cascade
      for (let i = 0; i < 5; i++) {
        const lerpRate = 0.032 + i * 0.015;
        this.layerMouse[i].x += (this.mouse.targetX - this.layerMouse[i].x) * lerpRate;
        this.layerMouse[i].y += (this.mouse.targetY - this.layerMouse[i].y) * lerpRate;
      }
    } else {
      this.mouse.x = 0;
      this.mouse.y = 0;
    }

    // --- 3. MASTER STACK LEVITATION & ISOMETRIC TILT ---
    const stackFloatY = this.reducedMotion ? 0 : Math.sin(t * 1.05) * 0.055;

    if (this.masterGroup) {
      this.masterGroup.position.y = 0.06 + stackFloatY;
      this.masterGroup.rotation.x = this.basePitch + Math.sin(t * 0.5) * 0.025 + this.mouse.x * 0.45;
      this.masterGroup.rotation.z = this.baseRoll + Math.cos(t * 0.45) * 0.020 - this.mouse.y * 0.15;
      this.masterGroup.scale.setScalar(entranceScale);
    }

    // Sync ground shadow with vertical levitation
    if (this.shadowPlane && this.shadowPlane.material) {
      const shadowScale = 1.0 - stackFloatY * 0.45;
      this.shadowPlane.scale.setScalar(shadowScale);
      this.shadowPlane.material.opacity = this.baseShadowOpacity * (1.0 - stackFloatY * 0.75);
    }

    // --- 4. FIVE-LAYER HARMONIC WAVE, TORSION CASCADE & MICRO-ORBITAL GLIDE ---
    const dynamicGap = 0.34 + this.hoverBoost * 0.08 + Math.sin(this.clickPulse * Math.PI) * 0.09;

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      const phase = i * 0.65;

      // Vertical harmonic wave breathing across the 5 layers
      const waveY = this.reducedMotion ? 0 : Math.sin(t * 1.50 - phase) * 0.042;
      const clickHop = Math.sin(Math.max(0, this.clickPulse * Math.PI - i * 0.35)) * 0.065;
      layer.position.y = (i - 2) * dynamicGap + waveY + clickHop;

      // Subtle lateral micro-orbital glide (creates a hypnotic floating shear wave)
      const glideRadius = this.reducedMotion ? 0 : 0.055 + this.hoverBoost * 0.025;
      layer.position.x = Math.cos(t * 1.35 - phase) * glideRadius + this.layerMouse[i].y * (i - 2) * 0.08;
      layer.position.z = Math.sin(t * 1.35 - phase) * (glideRadius * 0.6);

      // Staggered Torsion Ripple (Helical twist wave from bottom to top)
      const twistAmp = this.reducedMotion ? 0.03 : 0.20 + this.hoverBoost * 0.07;
      const twistWave = Math.sin(t * 1.25 - phase) * twistAmp;
      const cursorTwist = this.layerMouse[i].y * (0.45 + i * 0.16);
      layer.rotation.y = Math.PI / 4 + twistWave + cursorTwist;

      // Subtle staggered wave tilt on X and Z
      const tiltX = this.reducedMotion ? 0 : Math.cos(t * 1.25 - phase) * 0.042;
      const tiltZ = this.reducedMotion ? 0 : Math.sin(t * 1.25 - phase) * 0.042;
      layer.rotation.x = tiltX + this.layerMouse[i].x * 0.35;
      layer.rotation.z = tiltZ;

      // Sequential luminosity pulse cascading along the 5 inlay rims
      if (this.inlayMaterials[i]) {
        const pulseWave = Math.pow(0.5 + 0.5 * Math.sin(t * 1.85 - i * 0.70), 3);
        const baseEmissive = i === 2 ? 0.65 : (this.isDark ? 0.45 : 0.36);
        this.inlayMaterials[i].emissiveIntensity = baseEmissive + pulseWave * 0.60 + this.hoverBoost * 0.22;
      }
    }

    // --- 5. CENTRAL SAPPHIRE CRYSTAL LEVITATION & ROTATION ---
    if (this.innerJewelMesh) {
      this.innerJewelMesh.rotation.y -= delta * 0.70;
      this.innerJewelMesh.position.y = Math.sin(t * 1.50) * 0.08;
      const coreScale = 1.0 + Math.sin(t * 2.2) * 0.05 + this.hoverBoost * 0.08;
      this.innerJewelMesh.scale.setScalar(coreScale);
    }

    if (this.coreRingMesh) {
      this.coreRingMesh.rotation.z += delta * 0.55;
      this.coreRingMesh.rotation.x = Math.PI / 2 + Math.sin(t * 1.4) * 0.25;
      this.coreRingMesh.position.y = this.innerJewelMesh ? this.innerJewelMesh.position.y : 0;
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    if (this._cleanupInteraction) {
      this._cleanupInteraction();
      this._cleanupInteraction = null;
    }

    if (this.pmremGenerator) {
      this.pmremGenerator.dispose();
      this.pmremGenerator = null;
    }

    if (this.envMapLight) {
      this.envMapLight.dispose();
      this.envMapLight = null;
    }

    if (this.envMapDark) {
      this.envMapDark.dispose();
      this.envMapDark = null;
    }

    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.isMesh || obj.isLineSegments) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((mat) => {
                if (mat.map) mat.map.dispose();
                mat.dispose();
              });
            } else {
              if (obj.material.map) obj.material.map.dispose();
              obj.material.dispose();
            }
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }

    this.scene = null;
    this.camera = null;
    this.masterGroup = null;
    this.layers = [];
    this.layerMaterials = [];
    this.inlayMaterials = [];
    this.coreGroup = null;
  }
}
