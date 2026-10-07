import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { cloudinaryUrl } from "../lib/cloudinary";
import { commonImages, weddingGalleries } from "../data/images";
import { useSanityDoc } from "../lib/useSanityDoc";

/*
  THE DARKROOM
  ------------
*/

const CATEGORIES = [
  { id: "street", label: "Street", code: "S", hue: 206, sat: 12, count: 8, anchor: [-4.2, 0, -1.4] },
  { id: "nature", label: "Nature", code: "N", hue: 96, sat: 18, count: 8, anchor: [4.2, 0, -1.4] },
  { id: "portrait", label: "Portrait", code: "P", hue: 28, sat: 30, count: 8, anchor: [0, 0, 3.2] },
];

const THEMES = {
  dark: {
    name: "darkroom",
    void: 0x0a0a0d,
    voidCss: "#0a0a0d",
    paper: 0xece7dc,
    paperCss: "#ece7dc",
    ink: "#ece7dc",
    inkMuted: "rgba(236,231,220,0.55)",
    inkFaint: "rgba(236,231,220,0.28)",
    accentCss: "#a8331a",
    accent: 0xa8331a,
    dust: 0xffdccb,
    overlay: "rgba(6,6,7,0.86)",
    entryGradient: "radial-gradient(ellipse at center, rgba(20,14,13,0.65) 0%, #0a0a0d 78%)",
    navBg: "rgba(10,10,13,0.4)",
  },
  light: {
    name: "light table",
    void: 0xf2ede2,
    voidCss: "#f2ede2",
    paper: 0x201d1a,
    paperCss: "#201d1a",
    ink: "#201d1a",
    inkMuted: "rgba(32,29,26,0.55)",
    inkFaint: "rgba(32,29,26,0.25)",
    accentCss: "#a8331a",
    accent: 0xa8331a,
    dust: 0x8c8074,
    overlay: "rgba(242,237,226,0.92)",
    entryGradient: "radial-gradient(ellipse at center, rgba(255,250,240,0.8) 0%, #f2ede2 78%)",
    navBg: "rgba(242,237,226,0.55)",
  },
};

const getPhotoForCategory = (catId, index) => {
    let list = [];
    if (catId === 'street') {
        list = commonImages.instagram || [];
    } else if (catId === 'nature') {
        list = commonImages.testimonials || [];
    } else {
        list = weddingGalleries.map(w => w.coverImage).filter(Boolean);
    }
    if (list.length === 0) return cloudinaryUrl("logo.png");
    const imgName = list[index % list.length];
    // Request maximum quality but cap width to 1920px to prevent VRAM crashes (24 images * 4k = 2GB VRAM!)
    return cloudinaryUrl(imgName, "f_auto,q_100,w_1920,c_limit");
};

function makeFrameTexture(category, index) {
  const photoUrl = getPhotoForCategory(category.id, index);
  const tex = new THREE.TextureLoader().load(photoUrl);
  tex.colorSpace = THREE.SRGBColorSpace;
  // Maximize clarity in 3D
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return { texture: tex, dataUrl: photoUrl };
}

function makeDustTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,235,225,0.9)");
  g.addColorStop(1, "rgba(255,235,225,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function makeLabelSprite(text, inkCss) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2.4, 0.6, 1);
  sprite.renderOrder = 2;
  sprite.userData.canvas = canvas;
  sprite.userData.ctx = ctx;
  sprite.userData.text = text;
  paintLabel(sprite, inkCss);
  return sprite;
}

function paintLabel(sprite, inkCss) {
  const { canvas, ctx, text } = sprite.userData;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "italic 500 56px 'Cormorant', serif";
  ctx.fillStyle = inkCss;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 64);
  sprite.material.map.needsUpdate = true;
}

function playShutterClick(audioCtx) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(1200, t);
  osc.frequency.exponentialRampToValueAtTime(180, t + 0.05);
  gain.gain.setValueAtTime(0.05, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + 0.07);
}

export default function CandidGallery() {
  const mountRef = useRef(null);
  const stateRef = useRef(null);
  const closeBtnRef = useRef(null);
  
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(false);
  const [supported, setSupported] = useState(true);
  const [themeName, setThemeName] = useState("dark");
  const [pulling, setPulling] = useState(false);
  
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  // Universe content from Sanity with built-in fallbacks (never throws).
  const { data: pageData } = useSanityDoc('universePage');
  const { data: settings } = useSanityDoc('siteSettings');
  // Category labels can be renamed in Sanity; layout stays from the built-in table.
  const catLabel = (c) => pageData?.categories?.find((sc) => (sc.id || sc.title || '').toLowerCase() === c.id)?.title || c.label;
  
  const mutedRef = useRef(false);
  const isMobileRef = useRef(false);
  const theme = THEMES[themeName];

  useEffect(() => {
    const checkMobile = () => {
      const match = window.innerWidth < 768;
      setIsMobile(match);
      isMobileRef.current = match;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer;
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) throw new Error("no webgl context");
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
      setSupported(false);
      return;
    }

    const scene = new THREE.Scene();
    // Use clear background, let CSS handle the color so mobile overlay blends smoothly
    renderer.setClearColor(0x000000, 0); 
    scene.fog = new THREE.FogExp2(THEMES.dark.void, 0.045);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const safelight = new THREE.PointLight(THEMES.dark.accent, 2.2, 30, 2);
    safelight.position.set(0, 2.5, 6);
    scene.add(safelight);
    scene.add(new THREE.AmbientLight(0x22181a, 1.1));

    const dustCount = reducedMotion ? 0 : 420;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 26;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 26;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.045,
      map: makeDustTexture(),
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: THEMES.dark.dust,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    const photoMeshes = [];
    const categoryGroups = {};
    const labelSprites = {};
    const frames = {}; 

    CATEGORIES.forEach((cat) => {
      const group = new THREE.Group();
      group.position.set(...cat.anchor);
      scene.add(group);
      categoryGroups[cat.id] = group;

      const label = makeLabelSprite(cat.label, THEMES.dark.ink);
      label.position.set(cat.anchor[0], cat.anchor[1] + 1.9, cat.anchor[2]);
      label.material.opacity = 0;
      label.userData = { ...label.userData, isLabel: true, categoryId: cat.id };
      scene.add(label);
      labelSprites[cat.id] = label;

      const n = cat.count;
      const turns = 1.4;
      const helixRadius = 1.7;
      const helixHeight = 2.6;

      for (let i = 0; i < n; i++) {
        const { texture, dataUrl } = makeFrameTexture(cat, i);

        const frameW = 1.15, frameH = 0.82;
        const backingGeo = new THREE.PlaneGeometry(frameW + 0.08, frameH + 0.08);
        const backingMat = new THREE.MeshBasicMaterial({ color: THEMES.dark.paper });
        const backing = new THREE.Mesh(backingGeo, backingMat);

        const photoGeo = new THREE.PlaneGeometry(frameW, frameH);
        const photoMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const photo = new THREE.Mesh(photoGeo, photoMat);
        photo.position.z = 0.005;
        backing.add(photo);

        const t = i / n;
        const angle = t * Math.PI * 2 * turns;
        const helixPos = new THREE.Vector3(
          Math.cos(angle) * helixRadius,
          t * helixHeight - helixHeight / 2,
          Math.sin(angle) * helixRadius
        );

        const cols = 4;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const gridPos = new THREE.Vector3(
          (col - (cols - 1) / 2) * 1.42,
          (1 - row) * 1.0 + 0.1,
          2.6
        );

        backing.position.copy(helixPos);
        backing.lookAt(new THREE.Vector3(0, helixPos.y, 0).add(group.position).multiplyScalar(0));
        backing.lookAt(helixPos.clone().multiplyScalar(2));

        const frameData = {
          categoryId: cat.id,
          index: i,
          dataUrl,
          code: `${cat.code}-${String(i + 1).padStart(2, "0")}`,
        };
        frames[`${cat.id}-${i}`] = frameData;

        backing.userData = {
          ...frameData,
          helixPos,
          gridPos,
          helixQuat: null,
          gridQuat: new THREE.Quaternion(),
          baseScale: 1,
        };
        backing.quaternion.copy(new THREE.Quaternion());
        const outwardTarget = helixPos.clone().multiplyScalar(2);
        const tmp = new THREE.Object3D();
        tmp.position.copy(helixPos);
        tmp.lookAt(outwardTarget);
        backing.userData.helixQuat = tmp.quaternion.clone();
        backing.quaternion.copy(backing.userData.helixQuat);

        group.add(backing);
        photoMeshes.push(backing);
      }
    });

    const camState = {
      azimuth: 0.5,
      elevation: 0.28,
      radius: 11,
      lookAt: new THREE.Vector3(0, 0, 0),
      targetLookAt: new THREE.Vector3(0, 0, 0),
      targetRadius: 11,
    };

    const pointer = { down: false, lastX: 0, lastY: 0, moved: false };
    const ndc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const pickables = photoMeshes.concat(Object.values(labelSprites));
    let hovered = null;
    let audioCtx = null;
    
    function clickSound() {
      if (mutedRef.current) return;
      try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        playShutterClick(audioCtx);
      } catch (err) {}
    }

    function updateCamera() {
      camState.lookAt.lerp(camState.targetLookAt, 0.06);
      camState.radius += (camState.targetRadius - camState.radius) * 0.06;
      const x = camState.lookAt.x + camState.radius * Math.cos(camState.elevation) * Math.sin(camState.azimuth);
      const y = camState.lookAt.y + camState.radius * Math.sin(camState.elevation);
      const z = camState.lookAt.z + camState.radius * Math.cos(camState.elevation) * Math.cos(camState.azimuth);
      camera.position.set(x, y, z);
      camera.lookAt(camState.lookAt);
    }

    function onPointerDown(e) {
      if (isMobileRef.current && stateRef.current?.activeCategory) return;
      pointer.down = true;
      pointer.moved = false;
      pointer.lastX = e.clientX;
      pointer.lastY = e.clientY;
    }
    function updateHover(e) {
      if (isMobileRef.current && stateRef.current?.activeCategory) return;
      const rect = renderer.domElement.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        hovered = null;
        dom.style.cursor = pointer.down ? "grabbing" : "grab";
        return;
      }
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(pickables, false);
      hovered = hits.length ? hits[0].object : null;
      dom.style.cursor = pointer.down ? "grabbing" : hovered ? "pointer" : "grab";
    }
    function onPointerMove(e) {
      if (pointer.down) {
        const dx = e.clientX - pointer.lastX;
        const dy = e.clientY - pointer.lastY;
        if (Math.abs(dx) + Math.abs(dy) > 3) pointer.moved = true;
        camState.azimuth -= dx * 0.0045;
        camState.elevation = Math.max(-0.6, Math.min(0.9, camState.elevation + dy * 0.0035));
        pointer.lastX = e.clientX;
        pointer.lastY = e.clientY;
      }
      updateHover(e);
    }
    function onPointerUp(e) {
      if (isMobileRef.current && stateRef.current?.activeCategory) return;
      pointer.down = false;
      if (!pointer.moved) handleClick(e);
    }
    function onWheel(e) {
      if (isMobileRef.current && stateRef.current?.activeCategory) return;
      e.preventDefault();
      camState.targetRadius = Math.max(3.2, Math.min(16, camState.targetRadius + e.deltaY * 0.01));
    }

    function handleClick(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(pickables, false);
      const active = stateRef.current.activeCategory;

      if (hits.length === 0) {
        if (active) stateRef.current.requestCategory(null);
        return;
      }
      const hit = hits[0].object;
      const data = hit.userData;

      if (data.isLabel) {
        stateRef.current.requestCategory(data.categoryId);
        return;
      }
      if (!active) {
        stateRef.current.requestCategory(data.categoryId);
      } else if (data.categoryId === active) {
        stateRef.current.requestPhoto(data);
      } else {
        stateRef.current.requestCategory(data.categoryId);
      }
    }

    const dom = renderer.domElement;
    dom.style.touchAction = "none";
    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    function resize() {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    stateRef.current = {
      activeCategory: null,
      frames,
      requestCategory: (id) => {
        clickSound();
        stateRef.current.activeCategory = id;
        setActiveCategory(id);
        const cat = CATEGORIES.find((c) => c.id === id);
        if (isMobileRef.current) {
          // Keep camera static on mobile, letting HTML overlay take over
          camState.targetLookAt = new THREE.Vector3(0, 0, 0);
          camState.targetRadius = 11;
        } else {
          camState.targetLookAt = cat ? new THREE.Vector3(...cat.anchor) : new THREE.Vector3(0, 0, 0);
          camState.targetRadius = cat ? 5.6 : 11;
        }
      },
      requestPhoto: (data) => {
        clickSound();
        setSelectedPhoto(data);
      },
      applyTheme: (t) => {
        scene.fog.color.set(t.void);
        dustMat.color.set(t.dust);
        safelight.color.set(t.accent);
        photoMeshes.forEach((m) => m.material.color.set(t.paper));
        Object.values(labelSprites).forEach((label) => paintLabel(label, t.ink));
      },
    };

    let raf = null;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const active = stateRef.current.activeCategory;
      const isMob = isMobileRef.current;

      // Rotate camera if idle and not looking at a category
      if (!active && !pointer.down && !reducedMotion && !isMob) {
        camState.azimuth += dt * 0.035;
      }
      if (isMob && !pointer.down) {
         camState.azimuth += dt * 0.02; // Always slow spin on mobile background
      }
      if (!reducedMotion) {
        dust.rotation.y += dt * 0.01;
      }

      CATEGORIES.forEach((cat) => {
        const group = categoryGroups[cat.id];
        const isActive = active === cat.id;
        
        // Coils drift unless actively being viewed on desktop
        group.rotation.y += ((isActive && !isMob) ? 0 : dt * 0.05) * (reducedMotion ? 0 : 1);

        group.children.forEach((mesh) => {
          const d = mesh.userData;
          // Only uncoil to gridPos on Desktop. On mobile, stay in helix.
          const targetPos = (isActive && !isMob) ? d.gridPos : d.helixPos;
          const targetQuat = (isActive && !isMob) ? d.gridQuat : d.helixQuat;
          
          mesh.position.lerp(targetPos, 1 - Math.pow(0.001, dt));
          mesh.quaternion.slerp(targetQuat, 1 - Math.pow(0.001, dt));
          
          // Fade out other categories when one is active on desktop
          const targetOpacity = (active && !isActive && !isMob) ? 0.08 : 1;
          mesh.children[0].material.opacity += (targetOpacity - mesh.children[0].material.opacity) * 0.08;
          
          // On mobile, hide 3D frames entirely when a category is selected so the HTML grid shines
          if (isMob && active) {
            mesh.visible = false;
          } else {
            mesh.visible = mesh.children[0].material.opacity > 0.02 || !active || isActive;
          }

          const targetScale = mesh === hovered ? 1.12 : 1;
          const s = mesh.scale.x + (targetScale - mesh.scale.x) * 0.15;
          mesh.scale.set(s, s, s);
        });

        const label = labelSprites[cat.id];
        // Hide labels if a category is active or if we are on mobile (we have HTML buttons)
        const labelTarget = (active || isMob) ? 0 : 0.85;
        label.material.opacity += (labelTarget - label.material.opacity) * 0.08;
      });

      updateCamera();
      renderer.render(scene, camera);
    }
    animate();
    setReady(true);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      dom.removeEventListener("wheel", onWheel);
      renderer.dispose();
      photoMeshes.forEach((m) => {
        m.children[0].material.map?.dispose();
        m.children[0].material.dispose();
        m.geometry.dispose();
        m.children[0].geometry.dispose();
      });
      Object.values(labelSprites).forEach((label) => {
        label.material.map?.dispose();
        label.material.dispose();
      });
      if (audioCtx) audioCtx.close().catch(() => {});
      if (mount.contains(dom)) mount.removeChild(dom);
    };
  }, []);

  const goBack = () => stateRef.current && stateRef.current.requestCategory(null);
  const pick = (id) => stateRef.current && stateRef.current.requestCategory(id);

  const changePhoto = (delta) => {
    if (!selectedPhoto || !stateRef.current) return;
    const cat = CATEGORIES.find((c) => c.id === selectedPhoto.categoryId);
    const nextIndex = (selectedPhoto.index + delta + cat.count) % cat.count;
    setSelectedPhoto(stateRef.current.frames[`${cat.id}-${nextIndex}`]);
  };

  useEffect(() => {
    if (!selectedPhoto) return;
    closeBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedPhoto(null);
      else if (e.key === "ArrowRight") changePhoto(1);
      else if (e.key === "ArrowLeft") changePhoto(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPhoto]);

  const toggleMute = () => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
  };

  const toggleTheme = () => {
    const next = themeName === "dark" ? "light" : "dark";
    setThemeName(next);
    stateRef.current?.applyTheme(THEMES[next]);
    setPulling(true);
    setTimeout(() => setPulling(false), 420);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - touchStart;
    if (dx > 50) changePhoto(-1);
    else if (dx < -50) changePhoto(1);
    setTouchStart(null);
  };

  if (!supported) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          background: theme.voidCss,
          color: theme.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 10,
          fontFamily: "'IBM Plex Sans', sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div style={{ fontSize: 22, fontFamily: "'Cormorant', serif", fontStyle: "italic" }}>
          {pageData?.title || 'Unrehearsed'}
        </div>
        <div style={{ fontSize: 14, opacity: 0.7, maxWidth: 360 }}>
          This showcase needs WebGL, which your browser or device doesn't
          currently support. Try a recent version of Chrome, Firefox, Edge,
          or Safari.
        </div>
      </div>
    );
  }

  return (
    <div
      className="cg-root"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: theme.ink,
        background: theme.voidCss,
        transition: "background 0.5s ease, color 0.5s ease",
        "--cg-ink": theme.ink,
        "--cg-ink-muted": theme.inkMuted,
        "--cg-ink-faint": theme.inkFaint,
        "--cg-accent": theme.accentCss,
        "--cg-overlay": theme.overlay,
        "--cg-paper": theme.paperCss,
        "--cg-entry-gradient": theme.entryGradient,
        "--cg-nav-bg": theme.navBg,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

        .cg-root { height: 100vh; }
        @supports (height: 100dvh) { .cg-root { height: 100dvh; } }

        .cg-serif { font-family: 'Cormorant', serif; }

        .cg-btn {
          background: transparent;
          border: 1px solid var(--cg-ink-faint);
          color: var(--cg-ink);
          padding: 9px 18px;
          border-radius: 2px;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 13px;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }
        .cg-btn:hover, .cg-btn:focus-visible { border-color: var(--cg-accent); background: rgba(168,51,26,0.12); }
        .cg-btn.active { border-color: var(--cg-accent); background: rgba(168,51,26,0.18); }
        .cg-btn:focus-visible { outline: 2px solid var(--cg-accent); outline-offset: 2px; }

        .cg-fade { animation: cgfade 0.35s ease; }
        @keyframes cgfade { from { opacity: 0; } to { opacity: 1; } }

        .cg-icon-btn {
          background: transparent;
          border: 1px solid var(--cg-ink-faint);
          color: var(--cg-ink);
          width: 34px;
          height: 34px;
          border-radius: 2px;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cg-icon-btn:hover, .cg-icon-btn:focus-visible { border-color: var(--cg-accent); background: rgba(168,51,26,0.12); }
        .cg-icon-btn:focus-visible { outline: 2px solid var(--cg-accent); outline-offset: 2px; }

        .cg-nav-arrow {
          background: var(--cg-nav-bg);
          border: 1px solid var(--cg-ink-faint);
          color: var(--cg-ink);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
        }
        .cg-nav-arrow:hover, .cg-nav-arrow:focus-visible { border-color: var(--cg-accent); }
        .cg-nav-arrow.cg-prev { left: 4%; }
        .cg-nav-arrow.cg-next { right: 4%; }

        .cg-entry-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 22px;
          background: var(--cg-entry-gradient);
          transition: opacity 0.7s ease;
          z-index: 50;
          text-align: center;
          padding: 24px;
        }

        .cg-header {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: max(28px, env(safe-area-inset-top)) 28px 28px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 30;
          pointer-events: none;
        }
        .cg-header > * { pointer-events: auto; }

        .cg-title-stack { display: flex; flex-direction: column; align-items: flex-start; }
        .cg-title-main { font-size: clamp(22px, 5vw, 28px); font-style: italic; line-height: 1; }
        .cg-title-sub { font-size: 12px; opacity: 0.55; margin-top: 6px; }
        .cg-byline {
          margin-top: 10px;
          font-size: 11px;
          color: var(--cg-ink);
          opacity: 0.6;
          text-decoration: none;
          border-bottom: 1px solid var(--cg-ink-faint);
          padding-bottom: 2px;
          transition: opacity 0.2s;
        }
        .cg-byline:hover { opacity: 1; }

        .cg-controls { display: flex; gap: 14px; align-items: flex-start; }
        .cg-hint { font-size: 11px; color: var(--cg-ink-muted); text-align: right; pointer-events: none; margin-top: 2px; }
        
        .cg-rope-wrap { display: flex; flex-direction: column; align-items: center; margin-right: 8px; }
        .cg-rope { width: 2px; height: 22px; background: var(--cg-ink-faint); transition: height 0.18s ease; }
        .cg-rope-wrap.cg-pulling .cg-rope { height: 32px; }
        .cg-pill {
          margin-top: -1px; width: 54px; height: 26px; border-radius: 999px;
          border: 1px solid var(--cg-ink-faint); background: transparent;
          display: flex; align-items: center; padding: 2px; cursor: pointer;
          transition: transform 0.18s ease, border-color 0.2s ease;
        }
        .cg-rope-wrap.cg-pulling .cg-pill { transform: translateY(6px); }
        .cg-pill:hover, .cg-pill:focus-visible { border-color: var(--cg-accent); }
        .cg-pill:focus-visible { outline: 2px solid var(--cg-accent); outline-offset: 2px; }
        .cg-pill-thumb {
          width: 20px; height: 20px; border-radius: 50%; background: var(--cg-accent);
          color: #f2ede2; font-size: 11px; display: flex; align-items: center; justify-content: center;
          transition: transform 0.25s ease;
        }
        .cg-pill.cg-pill-light .cg-pill-thumb { transform: translateX(26px); }
        .cg-rope-label { margin-top: 4px; font-size: 10px; letter-spacing: 0.04em; color: var(--cg-ink-muted); }

        .cg-category-bar {
          position: absolute;
          bottom: max(30px, env(safe-area-inset-bottom));
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          gap: 10px;
          z-index: 30;
          width: max-content;
          max-width: 90vw;
        }

        /* --- MOBILE SPECIFIC CSS --- */
        .cg-mobile-contact-sheet {
          position: absolute;
          top: 90px;
          bottom: 90px;
          left: 0;
          right: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px;
          padding-bottom: max(32px, env(safe-area-inset-bottom));
          z-index: 15;
          -webkit-overflow-scrolling: touch;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, var(--cg-nav-bg) 100%);
        }
        
        .cg-mobile-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          max-width: 600px;
          margin: 0 auto;
        }

        .cg-mobile-frame {
          background: var(--cg-paper);
          padding: 6px;
          border-radius: 2px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transform: translateZ(0);
        }
        
        .cg-mobile-frame:active {
          transform: scale(0.98);
        }

        .cg-mobile-frame img {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          display: block;
        }

        .cg-mobile-code {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          text-align: right;
          color: var(--cg-ink);
          mix-blend-mode: difference;
          opacity: 0.65;
          margin-top: 4px;
        }

        @media (max-width: 767px) {
          .cg-header { padding: max(16px, env(safe-area-inset-top)) 16px 16px; }
          .cg-title-sub { display: none; }
          .cg-hint { display: none; }
          .cg-byline { margin-top: 6px; font-size: 10px; }
          
          .cg-rope { height: 16px; }
          .cg-rope-wrap.cg-pulling .cg-rope { height: 24px; }
          .cg-rope-label { display: none; }
          .cg-controls { gap: 8px; }
          
          .cg-category-bar {
            bottom: max(16px, env(safe-area-inset-bottom));
            gap: 6px;
            overflow-x: auto;
            justify-content: flex-start;
            padding: 0 4px;
            scroll-snap-type: x mandatory;
          }
          .cg-category-bar::-webkit-scrollbar { display: none; }
          .cg-category-bar .cg-btn { 
            padding: 8px 14px; 
            font-size: 12px; 
            scroll-snap-align: center;
          }

          .cg-nav-arrow { width: 34px; height: 34px; font-size: 16px; }
          .cg-nav-arrow.cg-prev { left: 8px; }
          .cg-nav-arrow.cg-next { right: 8px; }
          
          .cg-entry-overlay .cg-serif { font-size: 32px !important; }
          .cg-lightbox-caption { display: none !important; }
          
          .cg-lightbox-img {
             max-width: 90vw !important;
             max-height: 70vh !important;
             border-width: 6px !important;
          }
        }
        
        @media (max-width: 370px) {
           .cg-mobile-grid { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>

      <div
        ref={mountRef}
        style={{
          position: "absolute",
          inset: 0,
          cursor: "grab",
          opacity: ready ? 1 : 0,
          transition: "opacity 1s ease",
          pointerEvents: entered && !isMobile ? "auto" : "none",
        }}
      />

      {ready && !entered && (
        <div className="cg-entry-overlay">
          <div>
            <div className="cg-serif" style={{ fontSize: 40, fontStyle: "italic", lineHeight: 1 }}>
              {pageData?.title || 'Unrehearsed'}
            </div>
            <div style={{ fontSize: 13, opacity: 0.6, margin: "10px auto 0", maxWidth: 320 }}>
              {pageData?.description || 'candid photography, still on the reel — three rolls of film drifting in the dark, waiting to be opened'}
            </div>
          </div>
          <button
            className="cg-btn active"
            style={{ padding: "12px 26px", fontSize: 14 }}
            onClick={() => setEntered(true)}
            autoFocus
          >
            step into the darkroom
          </button>
        </div>
      )}

      {/* Header */}
      <header className="cg-header">
        <div className="cg-title-stack">
          <div className="cg-serif cg-title-main">{pageData?.title || 'Unrehearsed'}</div>
          <div className="cg-title-sub">{pageData?.description || 'candid photography, still on the reel'}</div>
          <a href={`mailto:${settings?.contactEmail || 'hello@dknott.com'}`} className="cg-byline">
            Alpha — get in touch
          </a>
        </div>
        <div className="cg-controls">
          <div className="cg-hint">
            drag to look around<br />
            scroll to move closer<br />
            click a reel to open it
          </div>
          <div className={`cg-rope-wrap${pulling ? " cg-pulling" : ""}`}>
            <div className="cg-rope" />
            <button
              className={`cg-pill${themeName === "light" ? " cg-pill-light" : ""}`}
              onClick={toggleTheme}
              aria-label="Switch theme"
            >
              <span className="cg-pill-thumb">{themeName === "dark" ? "🌙" : "☀︎"}</span>
            </button>
            <span className="cg-rope-label">{theme.name}</span>
          </div>
          <button
            className="cg-icon-btn"
            onClick={toggleMute}
            aria-label="Toggle sound"
          >
            {muted ? "🔇" : "🔈"}
          </button>
        </div>
      </header>

      {/* Mobile HTML Grid Gallery */}
      {isMobile && activeCategory && stateRef.current && (
        <div className="cg-mobile-contact-sheet cg-fade">
          <div className="cg-mobile-grid">
            {Array.from({ length: CATEGORIES.find(c => c.id === activeCategory).count }).map((_, i) => {
              const frame = stateRef.current.frames[`${activeCategory}-${i}`];
              if (!frame) return null;
              return (
                <div key={i} className="cg-mobile-frame" onClick={() => stateRef.current.requestPhoto(frame)}>
                  <img src={frame.dataUrl} alt={`Frame ${frame.code}`} loading="lazy" />
                  <div className="cg-mobile-code">{frame.code}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category selector / back */}
      <div className="cg-category-bar">
        {activeCategory ? (
          <button className="cg-btn active" onClick={goBack}>
            ← back to the reels
          </button>
        ) : (
          CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`cg-btn${activeCategory === c.id ? " active" : ""}`}
              onClick={() => pick(c.id)}
            >
              {catLabel(c)}
            </button>
          ))
        )}
      </div>

      {!ready && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            opacity: 0.5,
          }}
        >
          loading the darkroom…
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="cg-fade"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPhoto(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            position: "absolute",
            inset: 0,
            background: theme.overlay,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
          }}
        >
          <button
            className="cg-nav-arrow cg-prev"
            onClick={(e) => {
              e.stopPropagation();
              changePhoto(-1);
            }}
          >
            ‹
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              padding: "0 40px",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            <img
              className="cg-lightbox-img"
              src={selectedPhoto.dataUrl}
              alt={`Frame ${selectedPhoto.code}`}
              style={{
                maxWidth: "min(74vw, 800px)",
                maxHeight: "56vh",
                border: `10px solid ${theme.paperCss}`,
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                objectFit: "contain"
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div style={{ fontSize: 13, opacity: 0.7 }}>frame {selectedPhoto.code}</div>
            <div
              className="cg-lightbox-caption"
              style={{ fontSize: 12, opacity: 0.5, fontStyle: "italic", maxWidth: 360, textAlign: "center" }}
            >
              a one-line story for this frame goes here — where it was shot, or why it stuck with you
            </div>
            <button
              ref={closeBtnRef}
              className="cg-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
            >
              close
            </button>
          </div>

          <button
            className="cg-nav-arrow cg-next"
            onClick={(e) => {
              e.stopPropagation();
              changePhoto(1);
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
