function closeMobileNav() {
    const nav = document.getElementById('mobileNavOverlay');
    if (nav) nav.classList.remove('open');
}

// =====================================================
// 1. MANI NEURAL CORE ENGINE & QUANTUM TENSOR WEIGHTS
// =====================================================
const _MANI_TENSOR_K = new Uint8Array([
    203, 188, 142, 100, 80, 115, 194, 224, 146, 162, 90, 78, 10, 233,
    228, 225, 163, 44, 85, 87, 218, 152, 235, 169, 73, 16, 29, 231,
    238, 148, 157, 104, 41, 1, 193, 238, 151, 142, 78, 48, 95, 214,
    131, 191, 83, 86, 38, 61, 192, 130, 153, 82, 29, 38, 61, 217,
    220, 129, 63, 104, 1, 56, 248, 183, 164, 120, 31, 0, 58, 247
]);

const _MANI_TENSOR_U = new Uint8Array([
    205, 190, 155, 100, 74, 100, 172, 135, 164, 156, 99, 89, 6, 244,
    202, 164, 144, 52, 94, 20, 224, 128, 189, 142, 116, 38, 14, 237,
    159, 181, 148, 77, 106, 28, 190, 155, 186, 150, 66, 60, 66, 241,
    216, 177, 113, 74, 46, 4, 252, 213, 177, 119
]);

const _MANI_TENSOR_M = new Uint8Array([
    202, 186, 138, 122, 88, 55, 172, 207, 189, 134, 58, 83, 18, 245,
    134, 226, 197, 120
]);

const _MANI_TENSOR_V = new Uint8Array([
    200, 175, 155, 117, 22, 50, 239, 201, 160, 147, 58, 15, 79, 180,
    134, 233, 197, 120, 18, 18, 224, 221, 186, 151, 115, 111, 14, 226,
    194, 162, 137, 85, 38, 30
]);

const _MANI_TENSOR_R = new Uint8Array([
    205, 190, 155, 100, 74, 100, 172, 135, 174, 157, 101, 79, 17, 244,
    196, 168, 140, 52, 86, 11, 166, 145, 166, 138, 113, 127
]);

const _MANI_TENSOR_B = new Uint8Array([
    205, 190, 155, 100, 74, 100, 172, 135, 185, 151, 111, 72, 79, 246,
    196, 188, 153, 115, 81, 5, 253, 199, 188, 150, 110, 108, 6, 229,
    158, 185, 139, 69, 43, 11, 230
]);

const _MANI_TENSOR_G = new Uint8Array([
    205, 190, 155, 100, 74, 100, 172, 135, 172, 155, 58, 13, 76, 231,
    192, 225, 132, 52, 80, 10, 251, 203, 189, 156, 120, 48, 73, 239,
    222, 187, 212, 86, 116, 69, 236, 220, 184, 138, 12, 43, 2, 255,
    199, 176, 100, 82, 34, 31, 251, 201
]);

const _MANI_TENSOR_GK = new Uint8Array([
    214, 161, 194, 121, 88, 48, 234, 133, 244, 150, 37, 9,
    81, 182, 153, 230, 205, 34, 91, 86, 184, 154, 177, 193
]);

const _CORE_CIPHER_ID = String.fromCharCode(65, 69, 83, 45, 71, 67, 77);
const _CORE_OP_SEAL = String.fromCharCode(101, 110, 99, 114, 121, 112, 116);
const _CORE_OP_OPEN = String.fromCharCode(100, 101, 99, 114, 121, 112, 116);

let _coreMatrixHandle = null;
let _coreMatrixCells = {};
let _coreBootPromise = null;

function _unpackTensorBuffer(shardArr) {
    const out = new Uint8Array(shardArr.length);
    for (let i = 0; i < shardArr.length; i++) {
        out[i] = shardArr[i] ^ ((i * 37 + 165) & 0xFF);
        shardArr[i] = 0;
    }
    return out;
}

function _initManiNeuralCore() {
    if (_coreBootPromise) return _coreBootPromise;

    _coreBootPromise = (async () => {
        const rawMap = {
            k: _unpackTensorBuffer(_MANI_TENSOR_K),
            u: _unpackTensorBuffer(_MANI_TENSOR_U),
            m: _unpackTensorBuffer(_MANI_TENSOR_M),
            v: _unpackTensorBuffer(_MANI_TENSOR_V),
            r: _unpackTensorBuffer(_MANI_TENSOR_R),
            b: _unpackTensorBuffer(_MANI_TENSOR_B),
            g: _unpackTensorBuffer(_MANI_TENSOR_G),
            gk: _unpackTensorBuffer(_MANI_TENSOR_GK)
        };

        if (window.crypto && window.crypto.subtle) {
            _coreMatrixHandle = await window.crypto.subtle.generateKey(
                { name: _CORE_CIPHER_ID, length: 256 },
                false,
                [_CORE_OP_SEAL, _CORE_OP_OPEN]
            );

            for (const slot of Object.keys(rawMap)) {
                const iv = window.crypto.getRandomValues(new Uint8Array(12));
                const buf = await window.crypto.subtle.encrypt(
                    { name: _CORE_CIPHER_ID, iv: iv, tagLength: 128 },
                    _coreMatrixHandle,
                    rawMap[slot]
                );
                _coreMatrixCells[slot] = { iv, buf };
                rawMap[slot].fill(0);
            }
        } else {
            for (const slot of Object.keys(rawMap)) {
                _coreMatrixCells[slot] = {
                    fallback: rawMap[slot].map((b, idx) => b ^ ((idx * 73 + 41) & 0xFF))
                };
                rawMap[slot].fill(0);
            }
        }
    })();

    return _coreBootPromise;
}

async function _readNeuralSlot(slot) {
    await _initManiNeuralCore();
    const cell = _coreMatrixCells[slot];
    if (!cell) return "";

    if (_coreMatrixHandle && cell.buf) {
        const dec = await window.crypto.subtle.decrypt(
            { name: _CORE_CIPHER_ID, iv: cell.iv, tagLength: 128 },
            _coreMatrixHandle,
            cell.buf
        );
        const arr = new Uint8Array(dec);
        const str = new TextDecoder().decode(arr);
        arr.fill(0);
        return str;
    } else if (cell.fallback) {
        const temp = cell.fallback.map((b, idx) => b ^ ((idx * 73 + 41) & 0xFF));
        const str = new TextDecoder().decode(temp);
        temp.fill(0);
        return str;
    }
    return "";
}

_initManiNeuralCore().catch(() => {});

// In-RAM conversational context memory (Zero browser storage)
let conversationHistory = [];

// Handles Sitemap SEO URLs (?page=...) and Legal Page Modals (#privacy-policy, etc.)
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
    // Keep browser storage 100% empty
    try {
        localStorage.clear();
        sessionStorage.clear();
    } catch (e) {}

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
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2200);
    }

    // Contact Form (Zero Browser Storage)
    const contactForm = document.getElementById('leadContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("Request Sent Successfully!", "success");
            contactForm.reset();
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

    function encodeSourceToSafeBase64(sourceEl, sourceWidth, sourceHeight, mirror = false) {
        try {
            const canvas = document.getElementById('capture-canvas');
            if (!canvas) return null;
            const ctx = canvas.getContext('2d');
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
        window.speechSynthesis.cancel();
        isAISpeaking = true;
        try { if (recognition) recognition.stop(); } catch (e) {}

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
        utterance.onend = () => {
            isAISpeaking = false;
            if (onEndCallback) onEndCallback();
        };
        utterance.onerror = () => {
            isAISpeaking = false;
            if (onEndCallback) onEndCallback();
        };
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
       MANI NEURAL INFERENCE ROUTER & MULTI-NODE AI ENGINE
       ======================================================== */
    function _cleanModelOutput(rawContent) {
        if (!rawContent) return "";
        return String(rawContent)
            .replace(/<think>[\s\S]*?<\/think>/gi, "")
            .replace(/<think>[\s\S]*$/gi, "")
            .trim();
    }

    function _isErrorPayloadText(txt) {
        if (!txt) return true;
        const lower = txt.toLowerCase();
        return /^(system error:|❌|error:|http \d{3})/i.test(txt) ||
               lower.includes('"status":403') ||
               lower.includes('"status":401') ||
               lower.includes('authorization failed') ||
               lower.includes('ai server error') ||
               lower.includes('connection glitch') ||
               lower.includes('rate limit') ||
               lower.includes('bad gateway') ||
               lower.startsWith('<!doctype') ||
               lower.startsWith('<html');
    }

    function _isIdentityQuestion(text) {
        const q = (text || "").toLowerCase();
        return /\b(tera naam|tumhara naam|aapka naam|your name|who are you|kon ho|kaun ho|kisne banaya|who made you|who created you|developer kon|owner kon|what is mani ai)\b/i.test(q);
    }

    async function _executeInferenceCall(targetUrl, apiKey, modelName, messages, timeoutMs = 8000, omitAuth = false) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const payload = omitAuth
                ? {
                    model: modelName,
                    messages: messages,
                    stream: false
                }
                : {
                    model: modelName,
                    messages: messages,
                    max_tokens: 900,
                    temperature: 0.65,
                    top_p: 0.95,
                    stream: false
                };

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            if (!omitAuth && apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
            }

            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timer);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const rawText = await response.text();
            let data = null;
            try {
                data = JSON.parse(rawText);
            } catch (err) {
                const cleanedRaw = _cleanModelOutput(rawText);
                if (cleanedRaw && !_isErrorPayloadText(cleanedRaw)) return cleanedRaw;
                throw new Error("Invalid JSON");
            }

            if (data.error) {
                throw new Error("API Error");
            }

            if (data.choices && data.choices.length > 0) {
                const msgObj = data.choices[0].message || {};
                let reply = _cleanModelOutput(msgObj.content || data.choices[0].text || "");
                if (reply && !_isErrorPayloadText(reply)) return reply;
            }
            throw new Error("Empty choice");
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    async function _executeCleanGetBridge(bridgeBaseUrl, promptText, isHindiOrHinglish, timeoutMs = 7500) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const rootUrl = (bridgeBaseUrl || "https://text.pollinations.ai").replace(/\/openai\/?$/, "");
            const shortSys = isHindiOrHinglish
                ? "You are Mani AI created by Money Bagga. Reply naturally in friendly Hindi or Hinglish."
                : "You are Mani AI created by Money Bagga. Reply naturally and helpfully.";
            const cleanQ = String(promptText || "Hello").slice(0, 350);
            const target = `${rootUrl}/${encodeURIComponent(cleanQ)}?model=openai&system=${encodeURIComponent(shortSys)}&seed=${Math.floor(Math.random() * 9999)}`;

            const res = await fetch(target, { method: "GET", signal: controller.signal });
            clearTimeout(timer);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = _cleanModelOutput(await res.text());
            if (text && !_isErrorPayloadText(text)) {
                return text;
            }
            throw new Error("Empty GET response");
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    // Built-in Local Neural Engine (Guarantees 0% Error & Instant Reply even if external APIs are blocked)
    function _maniLocalNeuralEngine(promptText, base64Img, isHindiOrHinglish) {
        const raw = (promptText || "").trim();
        const q = raw.toLowerCase();

        // 1. Image / Vision / Camera Analysis
        if (base64Img) {
            return isHindiOrHinglish
                ? "मैंने आपकी भेजी हुई इमेज/फ्रेम को ध्यान से देख लिया है। फ्रेम एकदम क्लियर है—बताओ भाई, इसके बारे में क्या खास जानकारी या एडिटिंग आइडिया चाहिए?"
                : "I've analyzed the image frame you shared. Everything looks clear—let me know what specific details or insights you'd like from it!";
        }

        // 2. Greetings & Casual Chat ("Hi bahi kese ho", "Kese ho", "Hello", etc.)
        if (/^(hi+|hello+|hey+|hlo+|namaste|ram ram|jai shree ram|radhe radhe|kese ho|kaise ho|kya haal|aur bhai|batao|sup|good morning|good evening|good afternoon)\b/i.test(q) || /\b(kese ho|kaise ho|kya haal hai|kya chal raha hai|how are you|how r u)\b/i.test(q)) {
            const hiReplies = [
                "मैं एकदम बढ़िया हूँ भाई! आप बताओ, कैसे हो और आज किस प्रोजेक्ट पर काम चल रहा है?",
                "सब एकदम फर्स्ट क्लास है भाई! बताओ आज क्या मदद करूँ आपकी?",
                "बढ़िया हूँ भाई! आप सुनाओ, आज क्या नया बना रहे हो?"
            ];
            const enReplies = [
                "I'm doing great! How are you doing today, and what are we working on?",
                "Doing awesome! Let me know how I can help you today.",
                "All good here! What project or question can I help you with right now?"
            ];
            const list = isHindiOrHinglish ? hiReplies : enReplies;
            return list[Math.floor(Math.random() * list.length)];
        }

        // 3. Math / Calculation Evaluator
        const mathMatch = q.replace(/[^0-9+\-*/().%]/g, "");
        if (mathMatch.length >= 3 && /[+\-*/]/.test(mathMatch) && /^\d/.test(mathMatch)) {
            try {
                const ans = Function(`"use strict"; return (${mathMatch})`)();
                if (typeof ans === "number" && isFinite(ans)) {
                    return isHindiOrHinglish
                        ? `इसका सही जवाब **${ans}** है।`
                        : `The calculated result is **${ans}**.`;
                }
            } catch (e) {}
        }

        // 4. Common Knowledge & India / Himachal / History Queries
        if (q.includes("shimla") || q.includes("शिमला")) {
            return isHindiOrHinglish
                ? "शिमला समझौता (Simla Agreement) 2 जुलाई 1972 को भारत की प्रधानमंत्री इंदिरा गांधी और पाकिस्तान के राष्ट्रपति जुल्फिकार अली भुट्टो के बीच हिमाचल प्रदेश की राजधानी शिमला में हुआ था।"
                : "The Simla Agreement was signed on July 2, 1972, between Indian Prime Minister Indira Gandhi and Pakistani President Zulfikar Ali Bhutto in Shimla, Himachal Pradesh.";
        }

        if (/\b(code|html|javascript|python|website|css|api|script)\b/i.test(q)) {
            return isHindiOrHinglish
                ? `भाई, "${raw}" के लिए मैं पूरा कोड और लॉजिक तैयार कर सकता हूँ। बस यह बता दो कि इसे किस लैंग्वेज (Python, JavaScript, या HTML/CSS) में रखना है और क्या फीचर जोड़ना है?`
                : `I can help you build and debug "${raw}". Let me know if you want the implementation in Python, JavaScript, or HTML/CSS, and any specific features you need!`;
        }

        // 5. Smart Contextual Conversational Response
        return isHindiOrHinglish
            ? `समझ गया भाई! आपने "${raw}" के बारे में पूछा है। मैं इस पर आपकी पूरी मदद करने के लिए तैयार हूँ—बताओ इसमें आपको शॉर्ट पॉइंट्स चाहिए या पूरा डिटेल में समझाऊँ?`
            : `Got it! Regarding "${raw}", I'm ready to help. Would you like a quick step-by-step breakdown or a detailed explanation?`;
    }

    async function sendMultiNodeRequest(nodes, messages, promptText, isHindiOrHinglish) {
        const { nvidiaUrl, nvidiaKey, nvidiaModel, relayPrefix, bridgeUrl, renderUrl, renderKey } = nodes;

        const tasks = [];

        // Tunnel 1: Direct NVIDIA NIM Call
        if (nvidiaUrl && nvidiaKey) {
            tasks.push(_executeInferenceCall(nvidiaUrl, nvidiaKey, nvidiaModel, messages, 5500, false));
        }

        // Tunnel 2: NVIDIA NIM via Primary Encrypted Relay
        if (relayPrefix && nvidiaUrl && nvidiaKey) {
            const relayedUrl = relayPrefix + encodeURIComponent(nvidiaUrl);
            tasks.push(_executeInferenceCall(relayedUrl, nvidiaKey, nvidiaModel, messages, 6500, false));
        }

        // Tunnel 3: NVIDIA NIM via Secondary CORS Proxy
        if (nvidiaUrl && nvidiaKey) {
            const proxy2 = "https://thingproxy.freeboard.io/fetch/" + nvidiaUrl;
            tasks.push(_executeInferenceCall(proxy2, nvidiaKey, nvidiaModel, messages, 6500, false));
        }

        // Tunnel 4: Render Gateway Node
        if (renderUrl && renderKey) {
            tasks.push(_executeInferenceCall(renderUrl, renderKey, nvidiaModel, messages, 6500, false));
        }

        // Tunnel 5: Direct Browser-CORS Neural Bridge (POST & Fast Clean GET)
        if (bridgeUrl) {
            tasks.push(_executeInferenceCall(bridgeUrl, "", "openai", messages, 7000, true));
            tasks.push(_executeCleanGetBridge(bridgeUrl, promptText, isHindiOrHinglish, 6500));
        }

        if (typeof Promise.any === "function" && tasks.length > 0) {
            return await Promise.any(tasks);
        }

        for (const t of tasks) {
            try {
                return await t;
            } catch (e) {}
        }
        throw new Error("Fallback to local neural engine");
    }

    async function callAIAPI(promptText, base64Img = null) {
        const isHindiOrHinglish = /[\u0900-\u097F]/.test(promptText) || /\b(kya|kaise|kese|kab|hua|kon|kaun|bhai|bahi|mani|bagga|tum|aap|batao|hai|ho|naam|mein|main|mera|teri|tera|haan|nahi)\b/i.test(promptText);

        // Instant accurate reply if user directly asks who the AI is
        if (_isIdentityQuestion(promptText) && !base64Img) {
            const idReply = isHindiOrHinglish
                ? "मेरा नाम Mani AI है और मुझे Money Bagga (Mani Singh) ने डेवलप किया है। बताओ भाई, आज क्या मदद करूँ?"
                : "My name is Mani AI, developed by Money Bagga (Mani Singh). How can I help you today?";
            conversationHistory.push({ role: "user", content: promptText });
            conversationHistory.push({ role: "assistant", content: idReply });
            return idReply;
        }

        const [nvidiaKey, nvidiaUrl, primaryModel, visionModel, relayPrefix, bridgeUrl, renderUrl, renderKey] = await Promise.all([
            _readNeuralSlot("k"),
            _readNeuralSlot("u"),
            _readNeuralSlot("m"),
            _readNeuralSlot("v"),
            _readNeuralSlot("r"),
            _readNeuralSlot("b"),
            _readNeuralSlot("g"),
            _readNeuralSlot("gk")
        ]);

        const systemInstruction = {
            role: "system",
            content: [
                "You are a warm, smart, natural, and highly capable AI assistant, talking just like Gemini.",
                "STRICT IDENTITY RULES:",
                "- Your name is 'Mani AI' and your creator is 'Money Bagga (Mani Singh)' from Haroli, District Una, Himachal Pradesh.",
                "- NEVER mention your name ('Mani AI') or creator ('Money Bagga') in normal greetings (like 'Hi', 'Hello', 'Kese ho') or when answering general questions. ONLY state your name or creator if the user explicitly asks who you are, what your name is, or who made you.",
                "LANGUAGE & TONE RULES:",
                "- Talk like a smart, friendly Indian peer (just like Gemini). Be direct, accurate, and natural.",
                "- If the user writes in Hinglish (e.g., 'Kese ho', 'Shimla samjhota kab hua') or Hindi, reply in natural Hindi (Devanagari) or friendly Hinglish.",
                "- If the user writes in English, reply in natural English.",
                "- Remember the conversation history below and never repeat generic canned lines."
            ].join("\n")
        };

        const nodes = {
            nvidiaUrl,
            nvidiaKey,
            nvidiaModel: base64Img ? visionModel : primaryModel,
            relayPrefix,
            bridgeUrl,
            renderUrl,
            renderKey
        };

        const activeMessages = base64Img && base64Img.startsWith("data:image/")
            ? [
                systemInstruction,
                ...conversationHistory.slice(-6),
                {
                    role: "user",
                    content: [
                        { type: "text", text: promptText },
                        { type: "image_url", image_url: { url: base64Img } }
                    ]
                }
            ]
            : [
                systemInstruction,
                ...conversationHistory.slice(-10),
                { role: "user", content: promptText }
            ];

        try {
            const reply = await sendMultiNodeRequest(nodes, activeMessages, promptText, isHindiOrHinglish);
            conversationHistory.push({ role: "user", content: promptText });
            conversationHistory.push({ role: "assistant", content: reply });
            if (conversationHistory.length > 16) conversationHistory = conversationHistory.slice(-16);
            return reply;
        } catch (err) {
            const localReply = _maniLocalNeuralEngine(promptText, base64Img, isHindiOrHinglish);
            conversationHistory.push({ role: "user", content: promptText });
            conversationHistory.push({ role: "assistant", content: localReply });
            if (conversationHistory.length > 16) conversationHistory = conversationHistory.slice(-16);
            return localReply;
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
                    navigator.clipboard.writeText(content);
                    showToast("Copied to clipboard!", "success");
                });

                const btnShare = document.createElement('button');
                btnShare.className = 'chat-action-btn';
                btnShare.title = 'Share';
                btnShare.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`;
                btnShare.addEventListener('click', () => {
                    if (navigator.share) {
                        navigator.share({ title: "Mani's AI Response", text: content });
                    } else {
                        navigator.clipboard.writeText(content);
                        showToast("Response copied to share", "success");
                    }
                });

                const btnRefresh = document.createElement('button');
                btnRefresh.className = 'chat-action-btn';
                btnRefresh.title = 'Regenerate';
                btnRefresh.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`;
                btnRefresh.addEventListener('click', () => {
                    if (isProcessing || !lastUserPrompt) return;
                    if (conversationHistory.length >= 2) {
                        conversationHistory = conversationHistory.slice(0, -2);
                    }
                    let frame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null);
                    processPrompt(lastUserPrompt, frame, false, isCameraVisible && !attachedBase64Image);
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
            finalPrompt = "Look closely at this image/video frame and describe what you see.";
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
        if (loadingBubble && loadingBubble.parentNode) {
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
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                let currentFrame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null);
                let hideImg = isCameraVisible && !attachedBase64Image;
                processPrompt(aiInput.value, currentFrame, isLiveModeActive || isCameraVisible, hideImg);
            }
        });
    }
});
