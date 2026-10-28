// --- Three.js 3D Showcase Scene Setup ---
const container = document.getElementById('webgl-container');

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.03);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Orbit Controls for smooth 360 rotation & inspection
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 10;
controls.minDistance = 3;

// --- Cinematic Lighting (BMW / Puma style spotlight effects) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const spotlight1 = new THREE.SpotLight(0x00ffcc, 5);
spotlight1.position.set(5, 5, 5);
spotlight1.angle = Math.PI / 4;
scene.add(spotlight1);

const spotlight2 = new THREE.SpotLight(0x3366ff, 3);
spotlight2.position.set(-5, -3, 4);
scene.add(spotlight2);

// --- Centerpiece: Interactive 3D Card / Frame (Developer Photo Display) ---
const geometry = new THREE.BoxGeometry(2.2, 3, 0.15);

// Creating a sleek canvas texture as placeholder for developer photo/card design
const canvasTex = document.createElement('canvas');
canvasTex.width = 512;
canvasTex.height = 768;
const ctx = canvasTex.getContext('2d');

// Draw stylish card face design
ctx.fillStyle = '#0f1015';
ctx.fillRect(0, 0, 512, 768);
ctx.strokeStyle = '#00ffcc';
ctx.lineWidth = 8;
ctx.strokeRect(15, 15, 482, 738);

ctx.fillStyle = '#ffffff';
ctx.font = 'bold 36px "Space Grotesk", sans-serif';
ctx.fillText('MONEY SINGH', 50, 100);

ctx.fillStyle = '#00ffcc';
ctx.font = '20px sans-serif';
ctx.fillText('FULL-STACK & 3D DEV', 50, 140);

// Placeholder silhouette graphic for developer photo zone
ctx.fillStyle = '#1a1c23';
ctx.fillRect(50, 180, 412, 450);
ctx.fillStyle = '#555';
ctx.font = '24px sans-serif';
ctx.fillText('[ DEVELOPER PHOTO ]', 120, 410);

const texture = new THREE.CanvasTexture(canvasTex);

const material = [
    new THREE.MeshStandardMaterial({ color: 0x111111 }), // Right
    new THREE.MeshStandardMaterial({ color: 0x111111 }), // Left
    new THREE.MeshStandardMaterial({ color: 0x111111 }), // Top
    new THREE.MeshStandardMaterial({ color: 0x111111 }), // Bottom
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.2, metalness: 0.8 }), // Front (Photo Card)
    new THREE.MeshStandardMaterial({ color: 0x1a1c23 })  // Back
];

const photoCard = new THREE.Mesh(geometry, material);
scene.add(photoCard);

// --- Continuous 360-degree rotation when idle ---
let isUserInteracting = false;
controls.onStart = () => { isUserInteracting = true; };
controls.onEnd = () => { setTimeout(() => { isUserInteracting = false; }, 2000); };

// --- Click to Zoom Feature (GSAP Animation) ---
let isZoomed = window.innerWidth <= 768 ? false : false;

window.addEventListener('click', (event) => {
    // Prevent zoom if clicking UI elements
    if(event.target.closest('.header') || event.target.closest('.hero-content') || event.target.closest('.footer-bar')) return;

    isZoomed = !isZoomed;
    
    gsap.to(camera.position, {
        z: isZoomed ? 4.2 : 7,
        y: isZoomed ? 0.5 : 0,
        duration: 1.2,
        ease: 'power3.inOut'
    });

    gsap.to(photoCard.rotation, {
        y: isZoomed ? photoCard.rotation.y + Math.PI * 2 : photoCard.rotation.y,
        duration: 1.5,
        ease: 'power2.out'
    });
});

// --- Render Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Auto rotate slowly if user is not actively dragging
    if (!isUserInteracting && !isZoomed) {
        photoCard.rotation.y += 0.005;
        photoCard.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

// --- Responsive Window Resize Handling ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
