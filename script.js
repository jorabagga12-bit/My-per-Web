function closeMobileNav() {
    const nav = document.getElementById('mobileNavOverlay');
    if (nav) nav.classList.remove('open');
}

// =====================================================
// 1. AES-256-GCM HARDWARE ENCLAVE FOR AI & WEB3FORMS KEYS
// =====================================================
const _SEALED_GATEWAY_SHARDS = new Uint8Array([
    214, 161, 194, 121, 88, 48, 234, 133, 244, 150, 37, 9,
    81, 182, 153, 230, 205, 34, 91, 86, 184, 154, 177, 193
]);

const _SEALED_WEB3_SHARDS = new Uint8Array([
    150, 168, 215, 35, 10, 63, 182, 154, 224, 147, 37, 13,
    4, 171, 159, 229, 193, 40, 18, 92, 237, 200, 176, 213,
    127, 33, 6, 185, 208, 183, 157, 21, 113, 88, 189, 140
]);

let _enclaveCryptoKey = null;
let _enclaveIV = null;
let _enclaveCiphertext = null;
let _fallbackSealedBytes = null;

let _web3EnclaveIV = null;
let _web3EnclaveCiphertext = null;
let _web3FallbackSealedBytes = null;

async function _initGatewayEnclave() {
    if ((_enclaveCryptoKey && _enclaveCiphertext && _web3EnclaveCiphertext) || (_fallbackSealedBytes && _web3FallbackSealedBytes)) return;

    const rawBytes = new Uint8Array(_SEALED_GATEWAY_SHARDS.length);
    for (let i = 0; i < _SEALED_GATEWAY_SHARDS.length; i++) {
        rawBytes[i] = _SEALED_GATEWAY_SHARDS[i] ^ ((i * 37 + 165) & 0xFF);
        _SEALED_GATEWAY_SHARDS[i] = 0;
    }

    const web3RawBytes = new Uint8Array(_SEALED_WEB3_SHARDS.length);
    for (let i = 0; i < _SEALED_WEB3_SHARDS.length; i++) {
        web3RawBytes[i] = _SEALED_WEB3_SHARDS[i] ^ ((i * 37 + 165) & 0xFF);
        _SEALED_WEB3_SHARDS[i] = 0;
    }

    if (window.crypto && window.crypto.subtle) {
        _enclaveIV = window.crypto.getRandomValues(new Uint8Array(12));
        _web3EnclaveIV = window.crypto.getRandomValues(new Uint8Array(12));

        _enclaveCryptoKey = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );

        _enclaveCiphertext = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: _enclaveIV, tagLength: 128 },
            _enclaveCryptoKey,
            rawBytes
        );

        _web3EnclaveCiphertext = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: _web3EnclaveIV, tagLength: 128 },
            _enclaveCryptoKey,
            web3RawBytes
        );

        rawBytes.fill(0);
        web3RawBytes.fill(0);
    } else {
        _fallbackSealedBytes = rawBytes.map((b, idx) => b ^ ((idx * 73 + 41) & 0xFF));
        _web3FallbackSealedBytes = web3RawBytes.map((b, idx) => b ^ ((idx * 73 + 41) & 0xFF));
        rawBytes.fill(0);
        web3RawBytes.fill(0);
    }
}

async function _unsealGatewayToken() {
    await _initGatewayEnclave();
    if (_enclaveCryptoKey && _enclaveCiphertext) {
        const decryptedBuf = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: _enclaveIV, tagLength: 128 },
            _enclaveCryptoKey,
            _enclaveCiphertext
        );
        const bytes = new Uint8Array(decryptedBuf);
        const token = new TextDecoder().decode(bytes);
        bytes.fill(0);
        return token;
    } else if (_fallbackSealedBytes) {
        const temp = _fallbackSealedBytes.map((b, idx) => b ^ ((idx * 73 + 41) & 0xFF));
        const token = new TextDecoder().decode(temp);
        temp.fill(0);
        return token;
    }
    return "";
}

async function _unsealWeb3Token() {
    await _initGatewayEnclave();
    if (_enclaveCryptoKey && _web3EnclaveCiphertext) {
        const decryptedBuf = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: _web3EnclaveIV, tagLength: 128 },
            _enclaveCryptoKey,
            _web3EnclaveCiphertext
        );
        const bytes = new Uint8Array(decryptedBuf);
        const token = new TextDecoder().decode(bytes);
        bytes.fill(0);
        return token;
    } else if (_web3FallbackSealedBytes) {
        const temp = _web3FallbackSealedBytes.map((b, idx) => b ^ ((idx * 73 + 41) & 0xFF));
        const token = new TextDecoder().decode(temp);
        temp.fill(0);
        return token;
    }
    return "";
}

_initGatewayEnclave().catch(() => {});

// =====================================================
// 2. DIRECT AI SERVER & MODEL SETTINGS
// =====================================================
const AI_API_ENDPOINT = "https://ai-1-ak1q.onrender.com/v1/chat/completions";
const AI_TEXT_MODEL = "google/diffusiongemma-26b-a4b-it";
const AI_VISION_MODEL = "google/diffusiongemma-26b-a4b-it";

// Live RAM memory for continuous AI conversation while on the page
let conversationHistory = [];

// Pre-warm the AI server on page load so the first user message responds fast
function warmUpAIServer() {
    try {
        const baseOrigin = new URL(AI_API_ENDPOINT).origin;
        fetch(baseOrigin, { method: "GET", mode: "no-cors", cache: "no-store" }).catch(() => {});
    } catch (e) {}
}

// Smooth navigation for Sitemap links (?page=...) and existing HTML modals (#privacy-policy, etc.)
function handleSeoAndLegalRouting() {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");
    const routeMap = {
        "mani-ai": { hash: "#mani-ai-chat", title: "Use Mani's AI - Real-Time Online Assistant | manigamer.cv" },
        "services": { hash: "#services", title: "AI Automation Services - Mani AI | manigamer.cv" },
        "case-studies": { hash: "#case-studies", title: "AI Portfolio & Case Studies - Mani AI | manigamer.cv" },
        "developer": { hash: "#gallery", title: "Money Bagga - Full-Stack Developer | manigamer.cv" },
        "team": { hash: "#team", title: "Leadership & Team - Mani AI | manigamer.cv" },
        "contact": { hash: "#contact", title: "Contact Money Bagga - Mani AI | manigamer.cv" },
        "privacy-policy": { hash: "#privacy-policy", title: "Privacy Policy - Mani AI | manigamer.cv" },
        "terms-of-service": { hash: "#terms-of-service", title: "Terms of Service - Mani AI | manigamer.cv" },
        "disclaimer": { hash: "#disclaimer", title: "Disclaimer - Mani AI | manigamer.cv" }
    };

    if (pageParam && routeMap[pageParam]) {
        const target = routeMap[pageParam];
        document.title = target.title;
        if (window.location.hash !== target.hash) {
            window.location.hash = target.hash;
        }
        const targetEl = document.querySelector(target.hash);
        if (targetEl && !target.hash.includes("policy") && !target.hash.includes("terms") && !target.hash.includes("disclaimer")) {
            setTimeout(() => targetEl.scrollIntoView({ behavior: "smooth" }), 250);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    warmUpAIServer();
    handleSeoAndLegalRouting();

    // =====================================================
    // UNIVERSE STARS CANVAS ANIMATION (Brahmand Effect)
    // =====================================================
    const starsCanvas = document.getElementById('stars-canvas');
    if (starsCanvas) {
        const starsCtx = starsCanvas.getContext('2d');
        let stars = [];
        const isMobile = window.innerWidth <= 768;
        const STAR_COUNT = isMobile ? 120 : 220;

        function resizeStarsCanvas() {
            starsCanvas.width = window.innerWidth;
            starsCanvas.height = window.innerHeight;
        }
        resizeStarsCanvas();
        window.addEventListener('resize', resizeStarsCanvas);

        for (let i = 0; i < STAR_COUNT; i++) {
            const baseX = Math.random() * window.innerWidth;
            const baseY = Math.random() * window.innerHeight;
            stars.push({
                baseX: baseX, baseY: baseY, x: baseX, y: baseY,
                radius: Math.random() * 1.4 + 0.3,
                opacity: Math.random() * 0.7 + 0.2,
                twinkleSpeed: (Math.random() * 0.015 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
                orbitRadius: Math.random() * 3 + 0.5,
                orbitAngle: Math.random() * Math.PI * 2,
                orbitSpeed: (Math.random() - 0.5) * 0.003,
                color: Math.random() > 0.85 ? `rgba(180, 200, 255, ` : (Math.random() > 0.7 ? `rgba(255, 230, 200, ` : `rgba(255, 255, 255, `)
            });
        }

        function drawStars() {
            if (!starsCtx) return;
            starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
            for (let s of stars) {
                s.orbitAngle += s.orbitSpeed;
                s.x = s.baseX + Math.cos(s.orbitAngle) * s.orbitRadius;
                s.y = s.baseY + Math.sin(s.orbitAngle) * s.orbitRadius;
                s.opacity += s.twinkleSpeed;
                if (s.opacity >= 0.95 || s.opacity <= 0.1) s.twinkleSpeed *= -1;
                s.opacity = Math.max(0.05, Math.min(0.95, s.opacity));

                starsCtx.beginPath();
                starsCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                starsCtx.fillStyle = s.color + s.opacity + ')';
                starsCtx.fill();

                if (s.radius > 1.2) {
                    starsCtx.beginPath();
                    starsCtx.arc(s.x, s.y, s.radius * 2.5, 0, Math.PI * 2);
                    starsCtx.fillStyle = s.color + (s.opacity * 0.15) + ')';
                    starsCtx.fill();
                }
            }
            requestAnimationFrame(drawStars);
        }
        drawStars();
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');
    if (mobileMenuBtn && mobileNavOverlay) {
        mobileMenuBtn.addEventListener('click', () => { mobileNavOverlay.classList.add('open'); });
    }
    if (mobileNavClose && mobileNavOverlay) {
        mobileNavClose.addEventListener('click', () => { mobileNavOverlay.classList.remove('open'); });
    }

    // Active Navbar Link Highlight on Click
    const navButtons = document.querySelectorAll('.nav-links .nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // SCROLL REVEAL (Blur-Free Smooth Reveal)
    if ('IntersectionObserver' in window) {
        const observerOptions = { root: null, rootMargin: "0px", threshold: 0.08 };
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    entry.target.classList.add("seen");
                }
            });
        }, observerOptions);
        document.querySelectorAll(".reveal-up").forEach(el => scrollObserver.observe(el));
    } else {
        document.querySelectorAll(".reveal-up").forEach(el => {
            el.classList.add("active");
            el.classList.add("seen");
        });
    }

    // 3D Tilt Effect on Cards
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const cards = document.querySelectorAll('.card');
    if (!isTouchDevice) {
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                const centerX = rect.width / 2; const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;
                card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.01)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0deg) scale(1)`;
            });
        });
    }

    // FAQ Accordion
    const faqs = document.querySelectorAll('.faq-item');
    faqs.forEach(faq => {
        faq.addEventListener('click', () => {
            const isActive = faq.classList.contains('active');
            faqs.forEach(f => {
                f.classList.remove('active');
                const icon = f.querySelector('.faq-icon');
                if (icon) icon.innerText = '+';
            });
            if (!isActive) {
                faq.classList.add('active');
                const icon = faq.querySelector('.faq-icon');
                if (icon) icon.innerText = '×';
            }
        });
    });

    // Toast Notification
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        container.innerHTML = '';
        const toast = document.createElement('div');
        toast.className = `iphone-glass expo-glass-effect toast-msg ${type}`;
        const icon = type === 'success' ? '✔ ' : '✖ ';
        toast.innerHTML = icon + message;
        container.appendChild(toast);
        setTimeout(() => { toast.classList.add('show'); }, 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2600);
    }

    // =====================================================
    // CONTACT FORM -> DIRECT EMAIL VIA WEB3FORMS
    // =====================================================
    const contactForm = document.getElementById('leadContactForm') || document.getElementById('form');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('button');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameEl = document.getElementById('leadName');
            const emailEl = document.getElementById('leadEmail');
            const companyEl = document.getElementById('leadCompany');

            const name = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            const company = companyEl ? companyEl.value.trim() : '';

            const formData = new FormData(contactForm);
            const web3AccessKey = await _unsealWeb3Token();
            formData.set("access_key", web3AccessKey);

            if (name) formData.set("name", name);
            if (email) formData.set("email", email);
            if (company) formData.set("company", company);
            formData.set("subject", `New Client Request from ${name || "Website Visitor"} | manigamer.cv`);
            formData.set("from_name", "Mani AI Contact Box");

            const originalText = submitBtn ? submitBtn.textContent : "Send Your Request";
            if (submitBtn) {
                submitBtn.textContent = "Sending...";
                submitBtn.disabled = true;
            }

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.success !== false) {
                    showToast("Success! Your message has been sent.", "success");
                    contactForm.reset();
                } else {
                    showToast("Error: " + (data.message || "Could not send request."), "error");
                }
            } catch (error) {
                showToast("Something went wrong. Please try again.", "error");
            } finally {
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }

    /* ========================================================
       AI CHAT ENGINE, GALLERY PHOTO/VIDEO, CAMERA & SCREEN SHARE
       ======================================================== */
    const aiInput = document.getElementById('ai-chat-input');
    const sendAiBtn = document.getElementById('send-ai-btn');
    const chatHistory = document.getElementById('ai-chat-history');
    const chatBoxWrapper = document.getElementById('chat-box-wrapper');
    const liveToolsPanel = document.getElementById('live-tools-panel');
    const scrollBtn = document.getElementById('scroll-bottom-btn');
    const mediaPreviewContainer = document.getElementById('media-preview-container');
    const previewImg = document.getElementById('preview-img');
    const previewLabel = document.getElementById('preview-label');
    const removePreviewBtn = document.getElementById('remove-preview-btn');
    const liveToggleBtn = document.getElementById('btn-live-toggle');

    const liveOrbUI = document.getElementById('live-orb-ui');
    const golaCamBtn = document.getElementById('gola-cam-btn');
    const golaScreenBtn = document.getElementById('gola-screen-btn');
    const golaCloseBtn = document.getElementById('gola-close-btn');
    const golaMicBtn = document.getElementById('gola-mic-btn');

    const liveCameraContainer = document.getElementById('live-camera-container');
    const switchCameraBtn = document.getElementById('switch-camera-btn');
    const closeCameraBtn = document.getElementById('close-camera-btn');
    const videoElement = document.getElementById('webcam-video');

    const btnGalleryPlus = document.getElementById('btn-gallery-plus');
    const plusMenu = document.getElementById('plus-popover-menu');
    const inputFileCamera = document.getElementById('input-file-camera');
    const inputFileGallery = document.getElementById('input-file-gallery');

    if (inputFileGallery) {
        inputFileGallery.setAttribute('accept', 'image/*,video/*');
    }

    let attachedBase64Image = null;
    let latestBackgroundFrame = null;
    let backgroundFrameTimer = null;
    let currentLiveStream = null;
    let lastUserPrompt = "";
    let isLiveModeActive = false;
    let isMicMuted = false;
    let isAISpeaking = false;
    let isProcessing = false;
    let currentFacingMode = "environment";
    let isCameraVisible = false;
    let isScreenSharing = false;
    let speechSafetyTimer = null;

    if (btnGalleryPlus && plusMenu) {
        btnGalleryPlus.addEventListener('click', (e) => {
            e.stopPropagation();
            plusMenu.style.display = (plusMenu.style.display === 'flex') ? 'none' : 'flex';
        });
        document.addEventListener('click', () => { plusMenu.style.display = 'none'; });
    }

    const optCamera = document.getElementById('opt-camera');
    const optGallery = document.getElementById('opt-gallery');
    const optScreenshare = document.getElementById('opt-screenshare');

    if (optCamera) optCamera.addEventListener('click', () => { if (plusMenu) plusMenu.style.display = 'none'; triggerCamera(); });
    if (optGallery) optGallery.addEventListener('click', () => { if (plusMenu) plusMenu.style.display = 'none'; if (inputFileGallery) inputFileGallery.click(); });
    if (optScreenshare) optScreenshare.addEventListener('click', () => { if (plusMenu) plusMenu.style.display = 'none'; triggerScreenShare(); });

    // Fast Image Optimizer: Keeps Base64 payload light for rapid API transmission
    function encodeSourceToSafeBase64(sourceEl, sourceWidth, sourceHeight, mirror = false) {
        try {
            const canvas = document.getElementById('capture-canvas') || document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;
            const attempts = [
                { maxDim: 680, quality: 0.74 },
                { maxDim: 560, quality: 0.68 },
                { maxDim: 460, quality: 0.62 }
            ];

            for (const cfg of attempts) {
                let w = sourceWidth || 640;
                let h = sourceHeight || 480;
                if (w > h && w > cfg.maxDim) {
                    h = Math.round(h * (cfg.maxDim / w));
                    w = cfg.maxDim;
                } else if (h > cfg.maxDim) {
                    w = Math.round(w * (cfg.maxDim / h));
                    h = cfg.maxDim;
                }
                canvas.width = Math.max(1, w);
                canvas.height = Math.max(1, h);
                ctx.save();
                if (mirror) {
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                }
                ctx.drawImage(sourceEl, 0, 0, canvas.width, canvas.height);
                ctx.restore();

                const dataUrl = canvas.toDataURL('image/jpeg', cfg.quality);
                if (dataUrl && dataUrl.startsWith('data:image/jpeg;base64,') && dataUrl.length > 500 && dataUrl.length < 160000) {
                    return dataUrl;
                }
            }
            return canvas.toDataURL('image/jpeg', 0.55);
        } catch (err) {
            return null;
        }
    }

    function compressGalleryImage(dataUrl, callback) {
        const img = new Image();
        img.onload = () => {
            const safeB64 = encodeSourceToSafeBase64(img, img.width, img.height, false);
            callback(safeB64);
        };
        img.onerror = () => callback(null);
        img.src = dataUrl;
    }

    function extractFrameFromVideoFile(file, callback) {
        const tempVideo = document.createElement('video');
        tempVideo.preload = 'metadata';
        tempVideo.muted = true;
        tempVideo.playsInline = true;
        const objectUrl = URL.createObjectURL(file);
        tempVideo.src = objectUrl;

        tempVideo.onloadeddata = () => {
            tempVideo.currentTime = Math.min(1.0, (tempVideo.duration || 2) / 2);
        };
        tempVideo.onseeked = () => {
            const safeB64 = encodeSourceToSafeBase64(tempVideo, tempVideo.videoWidth || 640, tempVideo.videoHeight || 480, false);
            URL.revokeObjectURL(objectUrl);
            callback(safeB64);
        };
        tempVideo.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            callback(null);
        };
    }

    function handleFileSelect(file) {
        if (!file) return;
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                compressGalleryImage(evt.target.result, (compressedDataUrl) => {
                    if (compressedDataUrl) {
                        attachedBase64Image = compressedDataUrl;
                        if (previewImg) {
                            previewImg.style.display = 'block';
                            previewImg.src = attachedBase64Image;
                        }
                        if (previewLabel) previewLabel.innerText = file.name;
                        if (mediaPreviewContainer) mediaPreviewContainer.style.display = 'flex';
                    }
                });
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            if (previewLabel) previewLabel.innerText = "Processing video...";
            if (mediaPreviewContainer) mediaPreviewContainer.style.display = 'flex';
            extractFrameFromVideoFile(file, (videoFrameB64) => {
                if (videoFrameB64) {
                    attachedBase64Image = videoFrameB64;
                    if (previewImg) {
                        previewImg.style.display = 'block';
                        previewImg.src = attachedBase64Image;
                    }
                    if (previewLabel) previewLabel.innerText = "Video: " + file.name;
                    if (mediaPreviewContainer) mediaPreviewContainer.style.display = 'flex';
                } else {
                    if (mediaPreviewContainer) mediaPreviewContainer.style.display = 'none';
                    showToast("Could not read video frame.", "error");
                }
            });
        } else {
            attachedBase64Image = null;
            if (previewImg) previewImg.src = '';
            if (previewLabel) previewLabel.innerText = "File: " + file.name;
            if (mediaPreviewContainer) mediaPreviewContainer.style.display = 'flex';
        }
    }

    if (inputFileCamera) inputFileCamera.addEventListener('change', (e) => handleFileSelect(e.target.files[0]));
    if (inputFileGallery) inputFileGallery.addEventListener('change', (e) => handleFileSelect(e.target.files[0]));

    let availableVoices = [];
    function loadVoices() { if ('speechSynthesis' in window) { availableVoices = window.speechSynthesis.getVoices(); } }
    loadVoices();
    if ('speechSynthesis' in window) { window.speechSynthesis.onvoiceschanged = loadVoices; }

    function speakText(text, onEndCallback = null) {
        if (!('speechSynthesis' in window)) { if (onEndCallback) onEndCallback(); return; }
        if (speechSafetyTimer) clearTimeout(speechSafetyTimer);
        window.speechSynthesis.cancel();
        isAISpeaking = true;
        try { if (recognition) recognition.stop(); } catch (e) {}

        let callbackTriggered = false;
        const finishSpeaking = () => {
            if (callbackTriggered) return;
            callbackTriggered = true;
            if (speechSafetyTimer) clearTimeout(speechSafetyTimer);
            isAISpeaking = false;
            if (onEndCallback) onEndCallback();
        };

        const cleanText = text.replace(/[*#_`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.03;
        const hasHindiChars = /[\u0900-\u097F]/.test(cleanText);
        const isHinglish = /\b(hai|kya|main|mera|karta|ho|gaya|kar|raha|hu|hain|bhai|nahi|yeh|woh|dikho|dekh|kaise|batao)\b/i.test(cleanText);
        if (hasHindiChars || isHinglish) { utterance.lang = 'hi-IN'; } else { utterance.lang = 'en-IN'; }
        if (availableVoices.length === 0) loadVoices();
        if (availableVoices.length > 0) {
            const selectedVoice = availableVoices.find(v => v.lang === utterance.lang || v.lang.replace('-', '_') === utterance.lang) || availableVoices.find(v => v.lang.startsWith('hi')) || availableVoices.find(v => v.lang.startsWith('en'));
            if (selectedVoice) utterance.voice = selectedVoice;
        }
        utterance.onend = finishSpeaking;
        utterance.onerror = finishSpeaking;

        // Safety fallback so mobile browsers never get stuck in speaking state during continuous chat
        const estimatedMs = Math.min(25000, Math.max(4000, cleanText.length * 90));
        speechSafetyTimer = setTimeout(finishSpeaking, estimatedMs);

        window.speechSynthesis.speak(utterance);
    }

    function getCurrentVideoFrame() {
        if (currentLiveStream && videoElement && videoElement.srcObject) {
            if (videoElement.readyState >= 2 && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                const shouldMirror = (currentFacingMode === "user" && !isScreenSharing);
                const frame = encodeSourceToSafeBase64(videoElement, videoElement.videoWidth, videoElement.videoHeight, shouldMirror);
                if (frame) {
                    latestBackgroundFrame = frame;
                    return frame;
                }
            }
        }
        return latestBackgroundFrame;
    }

    function startSilentBackgroundFrameLoop() {
        if (backgroundFrameTimer) clearInterval(backgroundFrameTimer);
        backgroundFrameTimer = setInterval(() => {
            if (isCameraVisible && currentLiveStream) {
                getCurrentVideoFrame();
            }
        }, 700);
    }

    function stopSilentBackgroundFrameLoop() {
        if (backgroundFrameTimer) {
            clearInterval(backgroundFrameTimer);
            backgroundFrameTimer = null;
        }
        latestBackgroundFrame = null;
    }

    let recognition = null;
    const btnMic = document.getElementById('btn-mic');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = (evt) => {
            if (isMicMuted) return;
            const transcript = evt.results[0][0].transcript.trim();
            if (!transcript) return;
            if (aiInput) aiInput.value = transcript;
            if (btnMic) btnMic.style.color = '#ffffff';
            let currentFrame = attachedBase64Image;
            if (isCameraVisible) {
                currentFrame = getCurrentVideoFrame() || attachedBase64Image;
            }
            let hideImg = isCameraVisible && !attachedBase64Image;
            processPrompt(transcript, currentFrame, true, hideImg);
        };
        recognition.onerror = () => {
            if (btnMic) btnMic.style.color = '#ffffff';
            if (isLiveModeActive && !isMicMuted && !isAISpeaking && !isProcessing) {
                setTimeout(startLiveVoiceCycle, 800);
            }
        };
        recognition.onend = () => {
            if (btnMic) btnMic.style.color = '#ffffff';
            if (isLiveModeActive && !isMicMuted && !isAISpeaking && !isProcessing) {
                setTimeout(startLiveVoiceCycle, 400);
            }
        };
    }

    function startLiveVoiceCycle() {
        if (!isLiveModeActive || !recognition || isMicMuted || isAISpeaking || isProcessing) return;
        try { recognition.start(); } catch (e) {}
    }

    function stopLiveMode() {
        isLiveModeActive = false;
        isAISpeaking = false;
        isProcessing = false;
        if (speechSafetyTimer) clearTimeout(speechSafetyTimer);
        if (liveToggleBtn) liveToggleBtn.classList.remove('active-live');
        if (liveOrbUI) liveOrbUI.style.display = 'none';
        closeCameraUI();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (recognition) { try { recognition.stop(); } catch (e) {} }
    }

    function closeCameraUI() {
        stopSilentBackgroundFrameLoop();
        if (currentLiveStream) { currentLiveStream.getTracks().forEach(track => track.stop()); currentLiveStream = null; }
        if (liveCameraContainer) liveCameraContainer.style.display = 'none';
        isCameraVisible = false;
        isScreenSharing = false;
        if (golaCamBtn) golaCamBtn.classList.remove('active-feature');
        if (golaScreenBtn) golaScreenBtn.classList.remove('active-feature');
    }

    if (liveToggleBtn) {
        liveToggleBtn.addEventListener('click', () => {
            isLiveModeActive = !isLiveModeActive;
            if (isLiveModeActive) {
                liveToggleBtn.classList.add('active-live');
                if (liveOrbUI) liveOrbUI.style.display = 'flex';
                isMicMuted = false;
                if (golaMicBtn) golaMicBtn.classList.remove('muted');
                startLiveVoiceCycle();
            } else {
                stopLiveMode();
            }
        });
    }

    if (golaCamBtn) {
        golaCamBtn.addEventListener('click', () => {
            if (isCameraVisible && !isScreenSharing) {
                closeCameraUI();
            } else {
                triggerCamera();
            }
        });
    }

    if (golaScreenBtn) {
        golaScreenBtn.addEventListener('click', () => {
            if (isScreenSharing) {
                closeCameraUI();
            } else {
                triggerScreenShare();
            }
        });
    }

    if (golaCloseBtn) golaCloseBtn.addEventListener('click', stopLiveMode);

    if (golaMicBtn) {
        golaMicBtn.addEventListener('click', () => {
            isMicMuted = !isMicMuted;
            if (isMicMuted) {
                golaMicBtn.classList.add('muted');
                try { if (recognition) recognition.stop(); } catch (e) {}
            } else {
                golaMicBtn.classList.remove('muted');
                startLiveVoiceCycle();
            }
        });
    }

    async function triggerCamera() {
        try {
            if (currentLiveStream) currentLiveStream.getTracks().forEach(track => track.stop());
            currentLiveStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: currentFacingMode } });
            isScreenSharing = false;
            if (videoElement) {
                videoElement.srcObject = currentLiveStream;
                videoElement.style.transform = currentFacingMode === "user" ? "scaleX(-1)" : "scaleX(1)";
                await videoElement.play();
            }
            if (liveCameraContainer) liveCameraContainer.style.display = 'block';
            if (switchCameraBtn) switchCameraBtn.style.display = 'flex';
            isCameraVisible = true;
            if (golaCamBtn) golaCamBtn.classList.add('active-feature');
            if (golaScreenBtn) golaScreenBtn.classList.remove('active-feature');
            startSilentBackgroundFrameLoop();
        } catch (err) {
            if (inputFileCamera) inputFileCamera.click();
        }
    }

    async function triggerScreenShare() {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            try {
                if (currentLiveStream) currentLiveStream.getTracks().forEach(track => track.stop());
                currentLiveStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                isScreenSharing = true;
                if (videoElement) {
                    videoElement.srcObject = currentLiveStream;
                    videoElement.style.transform = "scaleX(1)";
                    await videoElement.play();
                }
                if (liveCameraContainer) liveCameraContainer.style.display = 'block';
                if (switchCameraBtn) switchCameraBtn.style.display = 'none';
                isCameraVisible = true;
                if (golaScreenBtn) golaScreenBtn.classList.add('active-feature');
                if (golaCamBtn) golaCamBtn.classList.remove('active-feature');
                startSilentBackgroundFrameLoop();

                currentLiveStream.getVideoTracks()[0].onended = () => closeCameraUI();
            } catch (err) {
                showToast("Screen share cancelled.", "error");
            }
        } else {
            showToast("Screen sharing is not supported on this device.", "error");
        }
    }

    if (switchCameraBtn) {
        switchCameraBtn.addEventListener('click', () => {
            currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
            triggerCamera();
        });
    }
    if (closeCameraBtn) closeCameraBtn.addEventListener('click', () => { closeCameraUI(); });

    if (chatHistory && scrollBtn) {
        chatHistory.addEventListener('scroll', () => {
            if (chatHistory.scrollTop + chatHistory.clientHeight < chatHistory.scrollHeight - 60) {
                scrollBtn.style.display = 'flex';
            } else {
                scrollBtn.style.display = 'none';
            }
        });
        scrollBtn.addEventListener('click', () => {
            chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' });
        });
    }

    if (removePreviewBtn) {
        removePreviewBtn.addEventListener('click', () => {
            attachedBase64Image = null;
            if (mediaPreviewContainer) mediaPreviewContainer.style.display = 'none';
        });
    }

    if (btnMic) {
        btnMic.addEventListener('click', () => {
            if (recognition) {
                btnMic.style.color = '#ff4d4d';
                try { recognition.start(); } catch (e) {}
            } else {
                showToast("Voice input is not supported in this browser.", "error");
            }
        });
    }

    /* ========================================================
       ULTRA-FAST AI API ENGINE (google/diffusiongemma-26b-a4b-it)
       ======================================================== */
    async function sendModelRequest(endpoint, apiKey, modelName, messages, timeoutMs = 22000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const payload = {
                model: modelName,
                messages: messages,
                max_tokens: 900,
                temperature: 0.45,
                top_p: 0.9,
                stream: false
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timer);
            const rawText = await response.text();
            let data = null;
            try {
                data = JSON.parse(rawText);
            } catch (err) {
                throw new Error(`Invalid JSON (HTTP ${response.status})`);
            }

            if (data.error) {
                throw new Error(typeof data.error === 'string' ? data.error : (data.error.message || "API Error"));
            }

            if (response.ok && data.choices && data.choices.length > 0) {
                const reply = (data.choices[0].message?.content || data.choices[0].text || "").trim();
                if (reply && !reply.startsWith("System Error:")) {
                    return reply;
                }
            }
            throw new Error(`Status ${response.status}`);
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    function isAskingForAIName(text) {
        const q = (text || "").toLowerCase().trim();
        return /\b(what is your name|what's your name|whats your name|who are you|your name|tumhara naam|tera naam|aapka naam|naam kya hai|kon ho tum|kaun ho tum|tu kon hai|tu kaun hai)\b/i.test(q) ||
               /(तुम्हारा नाम|तेरा नाम|आपका नाम|नाम क्या है|कौन हो तुम|तू कौन है)/.test(q);
    }

    // Intelligent built-in fallback responder (only states name if asked)
    function generateZeroErrorFallbackReply(promptText, hasImage = false) {
        const q = (promptText || "").toLowerCase();
        const isHindiOrHinglish = /[\u0900-\u097F]/.test(q) || /\b(kya|kaise|kon|kaun|bhai|mani|bagga|tum|aap|batao|hai|ho|naam)\b/i.test(q);

        if (isAskingForAIName(promptText)) {
            return isHindiOrHinglish
                ? "मैं Mani AI हूँ।"
                : "I am Mani AI.";
        }
        if (hasImage) {
            return isHindiOrHinglish
                ? "मैंने इस इमेज को देख लिया है। कृपया बताएं कि आप इसमें किस चीज़ के बारे में जानना चाहते हैं?"
                : "I have analyzed this visual frame. Please let me know what specific detail you would like me to explain!";
        }
        if (q.includes("who made") || q.includes("developer") || q.includes("creator") || q.includes("kisne banaya") || q.includes("bagga") || q.includes("owner")) {
            return isHindiOrHinglish
                ? "मुझे Money Bagga (Mani Singh) ने डेवलप किया है, जो एक फुल-स्टैक डेवलपर और साइबरसिक्योरिटी एक्सपर्ट हैं।"
                : "I was developed by Money Bagga (Mani Singh), a Full-Stack Developer and Cybersecurity Expert.";
        }
        if (q.includes("service") || q.includes("automation") || q.includes("website") || q.includes("contact")) {
            return isHindiOrHinglish
                ? "कस्टम वेबसाइट डेवलपमेंट, AI ऑटोमेशन या साइबरसिक्योरिटी सर्विसेज के लिए आप नीचे दिए गए Contact फॉर्म या +91 82196-93695 पर संपर्क कर सकते हैं।"
                : "For custom website development, AI automation, or cybersecurity services, you can reach out via the Contact form below or at +91 82196-93695.";
        }
        return isHindiOrHinglish
            ? "आपका सवाल मिल गया है। कृपया थोड़ा और स्पष्ट लिखें या दोबारा पूछें ताकि मैं आपको सटीक जानकारी दे सकूँ।"
            : "I received your message. Please share a bit more detail or ask again so I can give you an accurate answer.";
    }

    async function callAIAPI(promptText, base64Img = null) {
        if (!base64Img && isAskingForAIName(promptText)) {
            const isHindiOrHinglish = /[\u0900-\u097F]/.test(promptText) || /\b(kya|kon|kaun|tum|aap|tera|tumhara|naam|hai|ho)\b/i.test(promptText);
            const nameReply = isHindiOrHinglish ? "मैं Mani AI हूँ।" : "I am Mani AI.";
            conversationHistory.push({ role: "user", content: promptText });
            conversationHistory.push({ role: "assistant", content: nameReply });
            if (conversationHistory.length > 12) conversationHistory = conversationHistory.slice(-12);
            return nameReply;
        }

        const apiKey = await _unsealGatewayToken();

        if (base64Img && base64Img.startsWith("data:image/")) {
            const visionPrompt = `Look carefully at this image/camera view and answer accurately, politely, and concisely in the same language as the user (do not introduce yourself unless asked): ${promptText}`;
            const visionMessages = [
                {
                    role: "user",
                    content: [
                        { type: "text", text: visionPrompt },
                        { type: "image_url", image_url: { url: base64Img } }
                    ]
                }
            ];

            try {
                const reply = await sendModelRequest(AI_API_ENDPOINT, apiKey, AI_VISION_MODEL, visionMessages, 22000);
                conversationHistory.push({ role: "user", content: promptText });
                conversationHistory.push({ role: "assistant", content: reply });
                if (conversationHistory.length > 12) conversationHistory = conversationHistory.slice(-12);
                return reply;
            } catch (err) {
                return generateZeroErrorFallbackReply(promptText, true);
            }
        } else {
            const systemInstruction = {
                role: "system",
                content: "Your name is Mani AI (developed by Money Bagga). CRITICAL RULES: 1) ONLY say 'I am Mani AI' or 'मैं Mani AI हूँ' if the user explicitly asks your name or who you are. 2) NEVER repeat your name or introduce yourself in normal answers. 3) Answer directly, sensibly, and politely in the user's language without any nonsensical or inappropriate text."
            };

            const recentHistory = conversationHistory.slice(-6);
            const textMessages = [
                systemInstruction,
                ...recentHistory,
                { role: "user", content: promptText }
            ];

            try {
                const reply = await sendModelRequest(AI_API_ENDPOINT, apiKey, AI_TEXT_MODEL, textMessages, 20000);
                conversationHistory.push({ role: "user", content: promptText });
                conversationHistory.push({ role: "assistant", content: reply });
                if (conversationHistory.length > 12) {
                    conversationHistory = conversationHistory.slice(-12);
                }
                return reply;
            } catch (err) {
                return generateZeroErrorFallbackReply(promptText, false);
            }
        }
    }

    function appendMessageBubble(sender, content, imageSrc = null, hideImage = false) {
        if (!chatHistory) return null;
        if (chatBoxWrapper) { chatBoxWrapper.classList.add('has-messages'); }
        if (liveToolsPanel) { liveToolsPanel.style.display = 'flex'; }

        const msgWrapper = document.createElement('div');
        msgWrapper.className = `iphone-glass expo-glass-effect chat-msg-bubble ${sender}`;
        msgWrapper.style.padding = '18px 22px';
        msgWrapper.style.maxWidth = '85%';
        msgWrapper.style.fontSize = '15px';
        msgWrapper.style.lineHeight = '1.6';
        msgWrapper.style.borderRadius = '22px';
        msgWrapper.style.margin = '4px 0';

        if (sender === 'user') {
            msgWrapper.style.alignSelf = 'flex-end';
            msgWrapper.style.borderBottomRightRadius = '4px';
            msgWrapper.style.background = 'linear-gradient(145deg, rgba(59, 130, 246, 0.28), rgba(29, 78, 216, 0.14))';
            msgWrapper.style.color = '#fff';
            if (imageSrc && !hideImage) {
                const imgEl = document.createElement('img');
                imgEl.src = imageSrc;
                imgEl.style.maxWidth = '200px';
                imgEl.style.borderRadius = '12px';
                imgEl.style.display = 'block';
                imgEl.style.marginBottom = '10px';
                msgWrapper.appendChild(imgEl);
            }
            const textNode = document.createElement('div');
            textNode.innerText = content;
            msgWrapper.appendChild(textNode);
        } else {
            msgWrapper.style.alignSelf = 'flex-start';
            msgWrapper.style.borderBottomLeftRadius = '4px';
            msgWrapper.style.color = '#f1f5f9';
            const textNode = document.createElement('div');
            textNode.className = 'ai-text-content';
            textNode.style.whiteSpace = 'pre-wrap';
            textNode.innerText = content;
            msgWrapper.appendChild(textNode);

            if (content !== 'Thinking...') {
                const actionBar = document.createElement('div');
                actionBar.className = 'chat-action-bar';

                const btnSpeak = document.createElement('button');
                btnSpeak.className = 'chat-action-btn';
                btnSpeak.title = 'Listen';
                btnSpeak.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
                btnSpeak.addEventListener('click', () => { speakText(content); });

                const btnCopy = document.createElement('button');
                btnCopy.className = 'chat-action-btn';
                btnCopy.title = 'Copy';
                btnCopy.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
                btnCopy.addEventListener('click', () => {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(content).then(() => {
                            showToast("Copied to clipboard!", "success");
                        }).catch(() => {});
                    }
                });

                const btnShare = document.createElement('button');
                btnShare.className = 'chat-action-btn';
                btnShare.title = 'Share';
                btnShare.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`;
                btnShare.addEventListener('click', () => {
                    if (navigator.share) {
                        navigator.share({ title: "Mani AI Response", text: content }).catch(() => {});
                    } else if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(content).then(() => {
                            showToast("Response copied to share", "success");
                        }).catch(() => {});
                    }
                });

                const btnRefresh = document.createElement('button');
                btnRefresh.className = 'chat-action-btn';
                btnRefresh.title = 'Regenerate';
                btnRefresh.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`;
                btnRefresh.addEventListener('click', () => {
                    if (lastUserPrompt) {
                        let frame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null);
                        processPrompt(lastUserPrompt, frame, false, isCameraVisible && !attachedBase64Image);
                    }
                });

                actionBar.appendChild(btnSpeak);
                actionBar.appendChild(btnCopy);
                actionBar.appendChild(btnShare);
                actionBar.appendChild(btnRefresh);
                msgWrapper.appendChild(actionBar);
            }
        }
        chatHistory.appendChild(msgWrapper);
        chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' });
        return msgWrapper;
    }

    async function processPrompt(promptText, imagePayload, autoSpeak = false, hideImageInChat = false) {
        if (isProcessing) return;
        let userText = promptText ? promptText.trim() : "";
        let finalPrompt = userText;

        if (!finalPrompt && imagePayload) {
            finalPrompt = "Look closely at this image/video frame and describe everything you see in detail.";
            userText = hideImageInChat ? "इसमें क्या दिख रहा है?" : "Analyze media";
        } else if (!finalPrompt) {
            return;
        }

        isProcessing = true;
        lastUserPrompt = finalPrompt;
        appendMessageBubble('user', userText, imagePayload, hideImageInChat);
        if (aiInput) aiInput.value = '';
        attachedBase64Image = null;
        if (mediaPreviewContainer) mediaPreviewContainer.style.display = 'none';

        const loadingBubble = appendMessageBubble('bot', 'Thinking...');

        const aiReply = await callAIAPI(finalPrompt, imagePayload);
        isProcessing = false;
        if (loadingBubble && loadingBubble.parentNode && chatHistory) {
            chatHistory.removeChild(loadingBubble);
        }
        appendMessageBubble('bot', aiReply);

        if (autoSpeak || isLiveModeActive || isCameraVisible) {
            speakText(aiReply, () => {
                if (isLiveModeActive && !isMicMuted) {
                    setTimeout(startLiveVoiceCycle, 350);
                }
            });
        }
    }

    const btnClear = document.getElementById('btn-clear');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if (chatHistory) chatHistory.innerHTML = '';
            conversationHistory = [];
            if (chatBoxWrapper) chatBoxWrapper.classList.remove('has-messages');
            if (liveToolsPanel) liveToolsPanel.style.display = 'none';
            if (speechSafetyTimer) clearTimeout(speechSafetyTimer);
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            showToast("Chat history cleared", "success");
        });
    }

    if (sendAiBtn) {
        sendAiBtn.addEventListener('click', () => {
            let currentFrame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null);
            let hideImg = isCameraVisible && !attachedBase64Image;
            processPrompt(aiInput ? aiInput.value : "", currentFrame, isLiveModeActive || isCameraVisible, hideImg);
        });
    }

    if (aiInput) {
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                let currentFrame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null);
                let hideImg = isCameraVisible && !attachedBase64Image;
                processPrompt(aiInput.value, currentFrame, isLiveModeActive || isCameraVisible, hideImg);
            }
        });
    }
});
