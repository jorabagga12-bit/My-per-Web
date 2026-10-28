/* =========================================================
   MONEY SINGH — 3D PORTFOLIO
   Three.js r128 + OrbitControls + GSAP
   Replace "logo.jpg" below with your own photo file.
   ========================================================= */

const PHOTO_SRC = "logo.jpg"; // <-- put your photo in this folder with this name

/* ---------- Scene / Camera / Renderer ---------- */
const canvas = document.getElementById("stage");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 7);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

/* ---------- Lighting (cyberpunk cyan/pink rim light) ---------- */
scene.add(new THREE.AmbientLight(0x8899ff, 0.5));

const keyLight = new THREE.PointLight(0x00f0ff, 2.2, 20);
keyLight.position.set(3, 2, 4);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0xff2bd6, 2.4, 20);
rimLight.position.set(-3, -1.5, -3);
scene.add(rimLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
fillLight.position.set(0, 4, 5);
scene.add(fillLight);

/* ---------- Floating glass-framed photo card ---------- */
const group = new THREE.Group();
scene.add(group);

const loader = new THREE.TextureLoader();
const cardGeo = new THREE.PlaneGeometry(3, 3.9, 32, 32);

// Fallback gradient texture shown instantly while the real photo loads
const fallbackCanvas = document.createElement("canvas");
fallbackCanvas.width = fallbackCanvas.height = 8;
const fctx = fallbackCanvas.getContext("2d");
const grad = fctx.createLinearGradient(0, 0, 8, 8);
grad.addColorStop(0, "#0a1c2e");
grad.addColorStop(1, "#1a0a2e");
fctx.fillStyle = grad;
fctx.fillRect(0, 0, 8, 8);
const fallbackTexture = new THREE.CanvasTexture(fallbackCanvas);

const cardMat = new THREE.MeshPhysicalMaterial({
  map: fallbackTexture,
  roughness: 0.18,
  metalness: 0.1,
  clearcoat: 1,
  clearcoatRoughness: 0.12,
  transmission: 0.05,
  reflectivity: 0.6,
  emissive: 0x001820,
  emissiveIntensity: 0.25,
  side: THREE.DoubleSide,
});

const card = new THREE.Mesh(cardGeo, cardMat);
group.add(card);

loader.load(
  PHOTO_SRC,
  (tex) => {
    tex.encoding = THREE.sRGBEncoding;
    // Fit image without stretching: adjust plane aspect to the image
    const imgAspect = tex.image.width / tex.image.height;
    const targetH = 3.9;
    const targetW = targetH * imgAspect;
    card.geometry.dispose();
    card.geometry = new THREE.PlaneGeometry(
      Math.min(targetW, 3.6),
      targetH,
      32,
      32
    );
    cardMat.map = tex;
    cardMat.emissiveIntensity = 0.08;
    cardMat.needsUpdate = true;
  },
  undefined,
  () => console.warn("Photo not found: place your file as", PHOTO_SRC)
);

// Glowing glass edge frame (slightly larger, translucent, emissive border look)
const frameGeo = new THREE.PlaneGeometry(3.18, 4.08);
const frameMat = new THREE.MeshBasicMaterial({
  color: 0x00f0ff,
  transparent: true,
  opacity: 0.12,
  side: THREE.DoubleSide,
});
const frame = new THREE.Mesh(frameGeo, frameMat);
frame.position.z = -0.03;
group.add(frame);

// Thin neon outline using edges geometry
const outlineGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(3.18, 4.08));
const outlineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.8 });
const outline = new THREE.LineSegments(outlineGeo, outlineMat);
outline.position.z = -0.02;
group.add(outline);

// Soft backlight glow sprite behind the card
const glowTex = (() => {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(0,240,255,0.55)");
  g.addColorStop(1, "rgba(0,240,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
})();
const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false }));
glow.scale.set(7, 7, 1);
glow.position.z = -1.2;
group.add(glow);

/* ---------- Floating particles (ambient tech dust) ---------- */
const particleCount = 220;
const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
}
particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particleMat = new THREE.PointsMaterial({
  color: 0x66e0ff,
  size: 0.025,
  transparent: true,
  opacity: 0.6,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

/* ---------- OrbitControls (drag to rotate, like a product showcase) ---------- */
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.enableZoom = false;
controls.minPolarAngle = Math.PI / 2 - 0.6;
controls.maxPolarAngle = Math.PI / 2 + 0.6;
controls.minAzimuthAngle = -Math.PI / 2.2;
controls.maxAzimuthAngle = Math.PI / 2.2;
controls.rotateSpeed = 0.6;
controls.target.set(0, 0, 0);

let userInteracting = false;
controls.addEventListener("start", () => (userInteracting = true));
controls.addEventListener("end", () => {
  // resume auto-rotation shortly after the user lets go
  setTimeout(() => (userInteracting = false), 1200);
});

/* ---------- Click-to-zoom (cinematic GSAP camera move) ---------- */
let zoomed = false;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const defaultCamPos = camera.position.clone();

function setPointer(e) {
  const t = e.touches ? e.touches[0] : e;
  pointer.x = (t.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(t.clientY / window.innerHeight) * 2 + 1;
}

function handleTap(e) {
  setPointer(e);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(card);
  if (!hits.length) return;

  zoomed = !zoomed;

  if (zoomed) {
    gsap.to(camera.position, { x: 0, y: 0, z: 3.4, duration: 1.1, ease: "power3.inOut" });
    gsap.to(keyLight, { intensity: 3.4, duration: 1.1, ease: "power3.inOut" });
    gsap.to(rimLight, { intensity: 3.6, duration: 1.1, ease: "power3.inOut" });
    gsap.to(cardMat, { emissiveIntensity: 0.45, duration: 1.1 });
    controls.enableZoom = false;
  } else {
    gsap.to(camera.position, {
      x: defaultCamPos.x,
      y: defaultCamPos.y,
      z: defaultCamPos.z,
      duration: 1.1,
      ease: "power3.inOut",
    });
    gsap.to(keyLight, { intensity: 2.2, duration: 1.1, ease: "power3.inOut" });
    gsap.to(rimLight, { intensity: 2.4, duration: 1.1, ease: "power3.inOut" });
    gsap.to(cardMat, { emissiveIntensity: 0.08, duration: 1.1 });
  }
}
renderer.domElement.addEventListener("click", handleTap);
renderer.domElement.addEventListener("touchend", handleTap, { passive: true });

/* ---------- Subtle pointer-follow tilt (adds "alive" feel) ---------- */
let targetTiltX = 0, targetTiltY = 0;
window.addEventListener("pointermove", (e) => {
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = (e.clientY / window.innerHeight) * 2 - 1;
  targetTiltY = nx * 0.12;
  targetTiltX = -ny * 0.08;
});

/* ---------- Animate ---------- */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Continuous Puma/BMW-style slow auto-rotation when the user isn't dragging
  if (!userInteracting && !zoomed) {
    group.rotation.y += 0.0032;
  }

  // Gentle float + mouse-follow tilt
  group.position.y = Math.sin(t * 0.8) * 0.12;
  group.rotation.x += (targetTiltX - group.rotation.x) * 0.04;
  if (!userInteracting) {
    group.rotation.z += (targetTiltY * 0.3 - group.rotation.z) * 0.04;
  }

  // Drifting particles
  particles.rotation.y = t * 0.02;

  // Pulse the rim/key lights slightly for a "living" neon feel
  keyLight.intensity = (zoomed ? 3.4 : 2.2) + Math.sin(t * 2) * 0.15;
  rimLight.intensity = (zoomed ? 3.6 : 2.4) + Math.cos(t * 1.6) * 0.15;

  controls.update();
  renderer.render(scene, camera);
}
animate();

/* ---------- Resize ---------- */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* =========================================================
   UI: scroll reveals, counters, split-text hero, kinetic phone
   ========================================================= */

/* Split the H1 into per-letter spans for a staggered entrance */
(function splitHeroTitle() {
  const el = document.querySelector("[data-split]");
  if (!el) return;
  const text = el.textContent;
  el.textContent = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "ch";
    span.textContent = ch === " " ? "\u00A0" : ch;
    span.style.setProperty("--i", i);
    el.appendChild(span);
  });
  gsap.from(el.querySelectorAll(".ch"), {
    y: 60,
    opacity: 0,
    rotateX: 60,
    duration: 0.8,
    stagger: 0.03,
    ease: "power4.out",
    delay: 0.2,
  });
})();

gsap.from(".eyebrow, .sub, .cta", {
  y: 24,
  opacity: 0,
  duration: 0.8,
  stagger: 0.12,
  delay: 0.6,
  ease: "power3.out",
});

/* Kinetic glowing phone number: wrap each char for a staggered glow-in + flicker */
(function kineticPhone() {
  const el = document.querySelector("[data-phone]");
  if (!el) return;
  const text = el.textContent.trim();
  el.textContent = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "ch";
    span.style.setProperty("--i", i);
    span.textContent = ch === " " ? "\u00A0" : ch;
    el.appendChild(span);
  });
})();

/* Scroll-triggered reveal for glass panels + animated counters */
const revealEls = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
let countersRun = false;

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");

        if (!countersRun && entry.target.contains(document.querySelector("[data-count]"))) {
          countersRun = true;
          counters.forEach((c) => {
            const end = parseInt(c.dataset.count, 10);
            gsap.to(c, {
              innerText: end,
              duration: 1.4,
              ease: "power1.out",
              snap: { innerText: 1 },
              onUpdate() {
                c.innerText = Math.round(c.innerText);
              },
            });
          });
        }
      }
    });
  },
  { threshold: 0.25 }
);
revealEls.forEach((el) => io.observe(el));

/* Smooth-scroll nav links */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
