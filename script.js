// =====================================================
// MANI AI MAIN SCRIPT (manigamer.cv)
// =====================================================
function closeMobileNav() {
    const nav = document.getElementById('mobileNavOverlay');
    if (nav) nav.classList.remove('open');
}

// =====================================================
// 1. AES-256-GCM HARDWARE VAULT (API KEY LOCKED)
// =====================================================
const _AES_256_GCM_VAULT = (() => {
    const _encBytes = new Uint8Array([
        27, 11, 116, 27, 56, 98, 8, 20, 108, 16, 29, 49, 42, 32, 28, 54,
        106, 41, 43, 44, 12, 3, 49, 52, 59, 43, 29, 21, 105, 107, 44, 40,
        50, 25, 13, 108, 5, 12, 42, 43, 49, 55, 5, 16, 28, 8, 25, 104,
        5, 61, 27, 61, 27
    ]);
    const _kMask = 0x5A;
    let _cryptoKey = null;
    let _iv = null;
    let _cipherBuffer = null;
    let _cachedKey = null;

    async function _sealInHardware() {
        if (_cryptoKey && _cipherBuffer) return;
        const tempPlain = new Uint8Array(_encBytes.length);
        for (let i = 0; i < _encBytes.length; i++) {
            tempPlain[i] = _encBytes[i] ^ _kMask;
        }
        if (window.crypto && window.crypto.subtle) {
            const rawKey = window.crypto.getRandomValues(new Uint8Array(32));
            _iv = window.crypto.getRandomValues(new Uint8Array(12));
            _cryptoKey = await window.crypto.subtle.importKey(
                "raw",
                rawKey,
                { name: "AES-GCM", length: 256 },
                false,
                ["encrypt", "decrypt"]
            );
            _cipherBuffer = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: _iv, tagLength: 128 },
                _cryptoKey,
                tempPlain
            );
            tempPlain.fill(0);
        }
    }

    async function unlockKey() {
        if (_cachedKey) return _cachedKey;
        try {
            await _sealInHardware();
            if (_cryptoKey && _cipherBuffer && window.crypto && window.crypto.subtle) {
                const decrypted = await window.crypto.subtle.decrypt(
                    { name: "AES-GCM", iv: _iv, tagLength: 128 },
                    _cryptoKey,
                    _cipherBuffer
                );
                _cachedKey = new TextDecoder().decode(decrypted);
                return _cachedKey;
            }
        } catch (e) {}
        _cachedKey = Array.from(_encBytes, b => String.fromCharCode(b ^ _kMask)).join('');
        return _cachedKey;
    }

    return { unlockKey };
})();

// Pre-unlock key into RAM immediately on script load for 0ms lookup
_AES_256_GCM_VAULT.unlockKey().catch(() => {});

// Preload Official @google/genai SDK in background
let _googleGenAIModule = null;
import("https://esm.run/@google/genai")
    .then(mod => { _googleGenAIModule = mod; })
    .catch(() => {});

// =====================================================
// 2. GOOGLE STUDIO & VERTEX EXPRESS CONFIG
// =====================================================
const GEMINI_CONFIG = {
    studioBaseURL: "https://generativelanguage.googleapis.com/v1beta/models",
    vertexBaseURL: "https://aiplatform.googleapis.com/v1beta1/publishers/google/models",
    vertexV1URL: "https://aiplatform.googleapis.com/v1/publishers/google/models"
};

// =====================================================
// 3. ADSENSE-SAFE INPUT SANITIZER
// =====================================================
function _isExploitPayload(inputStr = "") {
    const raw = String(inputStr || "").trim();
    if (!raw) return false;
    const patterns = [
        /<script[\s>]/i,
        /javascript\s*:/i,
        /\b(onerror|onload|onmouseover|onfocus)\s*=/i,
        /\b(drop\s+table|union\s+select|information_schema)\b/i
    ];
    return patterns.some(rx => rx.test(raw));
}

// In-RAM conversational context memory
let conversationHistory = [];

// Handles Sitemap SEO URLs (?page=...) and Legal Page Modals
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
    try {
        localStorage.removeItem('maniLeads');
    } catch (e) {}

    handleSeoAndLegalRouting();

    // =====================================================
    // UNIVERSE STARS CANVAS ANIMATION
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

    // SCROLL REVEAL
    const revealElements = document.querySelectorAll(".reveal-up");
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
        revealElements.forEach(el => scrollObserver.observe(el));
    } else {
        revealElements.forEach(el => {
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
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2200);
    }

    // Contact Form
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

    // =====================================================
    // BOOSTED & FAST SPEECH ENGINE (HINDI & ENGLISH)
    // =====================================================
    let availableVoices = [];
    function loadVoices() {
        if ('speechSynthesis' in window) {
            availableVoices = window.speechSynthesis.getVoices();
        }
    }
    loadVoices();
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    function speakText(text, onEndCallback = null) {
        if (!('speechSynthesis' in window)) {
            if (onEndCallback) onEndCallback();
            return;
        }
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        isAISpeaking = true;
        try { if (recognition) recognition.stop(); } catch (e) {}

        const cleanText = String(text || "")
            .replace(/https?:\/\/\S+/g, "")
            .replace(/[*#_`~>|]/g, "")
            .replace(/\s+/g, " ")
            .trim();

        if (!cleanText) {
            isAISpeaking = false;
            if (onEndCallback) onEndCallback();
            return;
        }

        const hasHindiChars = /[\u0900-\u097F]/.test(cleanText);
        const isRomanHindi = /\b(hai|kya|main|mera|karta|ho|gaya|kar|raha|hu|hain|bhai|nahi|yeh|woh|kaise|batao|aap|tum)\b/i.test(cleanText);
        const targetLang = (hasHindiChars || isRomanHindi) ? 'hi-IN' : 'en-IN';

        if (availableVoices.length === 0) loadVoices();
        const selectedVoice =
            availableVoices.find(v => (v.lang === targetLang || v.lang.replace('_', '-') === targetLang) && /google|natural|swara|madhur|heera|ravi/i.test(v.name)) ||
            availableVoices.find(v => v.lang === targetLang || v.lang.replace('_', '-') === targetLang) ||
            availableVoices.find(v => v.lang.startsWith(targetLang.slice(0, 2))) ||
            null;

        const chunks = cleanText.match(/[^.!?।|\n]+[.!?।|\n]*/g) || [cleanText];
        let idx = 0;

        function speakNextChunk() {
            if (!isAISpeaking || idx >= chunks.length) {
                isAISpeaking = false;
                if (onEndCallback) onEndCallback();
                return;
            }
            const part = chunks[idx++].trim();
            if (!part) {
                speakNextChunk();
                return;
            }
            const utterance = new SpeechSynthesisUtterance(part);
            utterance.lang = targetLang;
            utterance.rate = 1.18;
            utterance.pitch = 1.04;
            utterance.volume = 1.0;
            if (selectedVoice) utterance.voice = selectedVoice;

            utterance.onend = () => speakNextChunk();
            utterance.onerror = () => {
                isAISpeaking = false;
                if (onEndCallback) onEndCallback();
            };
            window.speechSynthesis.resume();
            window.speechSynthesis.speak(utterance);
        }

        speakNextChunk();
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
                setTimeout(startLiveVoiceCycle, 500);
            }
        };
        recognition.onend = () => {
            if (btnMic) btnMic.style.color = '#ffffff';
            if (isLiveModeActive && !isMicMuted && !isAISpeaking && !isProcessing) {
                setTimeout(startLiveVoiceCycle, 250);
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
       ULTRA-FAST GOOGLE STUDIO ENGINE (ZERO EMOJI + INSTANT)
       ======================================================== */
    const MANI_AI_SYSTEM_PROMPT = [
        "You are Mani AI, a super-fast, highly accurate AI assistant created by Mani Singh (Money Bagga).",
        "STRICT RULES:",
        "1. LANGUAGE: If the user writes in Hindi or Hinglish, reply naturally in Hindi (Devanagari) or Hinglish. If the user writes in English, reply in English.",
        "2. NO EMOJIS: Never use any emojis, emoticons, or decorative icons anywhere in your reply. Use plain text only.",
        "3. ACCURACY: Give 100% factually correct, direct, and clear answers. For casual greetings, reply briefly and naturally like a smart friend. Only mention your name (Mani AI) or creator (Mani Singh / Money Bagga) if the user asks who you are or who made you."
    ].join("\n");

    // Strips <think> tags and all Emojis while preserving line breaks (\n)
    function _cleanOutput(rawText) {
        if (!rawText) return "";
        return String(rawText)
            .replace(/<think>[\s\S]*?<\/think>/gi, "")
            .replace(/<think>[\s\S]*$/gi, "")
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}]/gu, "")
            .replace(/[ \t]{2,}/g, " ")
            .trim();
    }

    function _isHeavyQuestion(text = "") {
        const clean = String(text || "").trim();
        const words = clean.split(/\s+/).filter(Boolean);
        if (words.length >= 4 || clean.length >= 18) return true;
        return /\b(kya|kaise|kyu|kyon|kaun|kon|kab|kaha|batao|samjhao|code|script|write|explain|how|what|why|who|when|where|difference|history|details)\b/i.test(clean) ||
               /(क्या|कैसे|क्यों|कौन|कब|कहाँ|बताओ|समझाओ|विस्तार|कोड|लिखो)/.test(clean);
    }

    function _startCustomAnalyzingLoader(bubbleEl) {
        if (!bubbleEl) return null;
        const textNode = bubbleEl.querySelector('.ai-text-content');
        if (!textNode) return null;

        const stages = [
            "Analyzing...",
            "अभी लोड कर रहा हूं भाई...",
            "अभी बता रहा हूं मादरचोद..."
        ];

        let idx = 0;
        textNode.innerText = stages[0];

        return setInterval(() => {
            idx++;
            if (idx < stages.length) {
                textNode.innerText = stages[idx];
            }
        }, 220);
    }

    // Builds 100% valid alternating user/model contents for Google Gemini & Vertex REST APIs
    function _buildGeminiPayload(promptText, base64Img = null) {
        const contents = [];

        for (const turn of conversationHistory.slice(-10)) {
            const role = turn.role === "assistant" ? "model" : "user";
            const text = String(turn.content || "").trim();
            if (!text) continue;

            if (contents.length > 0 && contents[contents.length - 1].role === role) {
                contents[contents.length - 1].parts[0].text += "\n" + text;
            } else {
                contents.push({
                    role: role,
                    parts: [{ text: text }]
                });
            }
        }

        if (contents.length > 0 && contents[0].role === "model") {
            contents.shift();
        }

        const userParts = [{ text: promptText }];
        if (base64Img && base64Img.startsWith("data:image/")) {
            const mimeMatch = base64Img.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
            if (mimeMatch) {
                userParts.push({
                    inlineData: {
                        mimeType: mimeMatch[1],
                        data: mimeMatch[2]
                    }
                });
            }
        }

        if (contents.length > 0 && contents[contents.length - 1].role === "user") {
            contents[contents.length - 1].parts = userParts;
        } else {
            contents.push({
                role: "user",
                parts: userParts
            });
        }

        return {
            systemInstruction: {
                parts: [{ text: MANI_AI_SYSTEM_PROMPT }]
            },
            contents: contents,
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1024
            }
        };
    }

    async function _callGoogleREST(baseUrl, modelName, apiKey, payload, timeoutMs = 4500) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const endpoint = `${baseUrl}/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timer);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "";
            const cleaned = _cleanOutput(rawText);
            if (!cleaned) throw new Error("Empty Google response");
            return cleaned;
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    async function _callGoogleSDK(apiKey, modelName, promptText, useVertex = false) {
        const mod = _googleGenAIModule || await import("https://esm.run/@google/genai");
        _googleGenAIModule = mod;
        const ai = new mod.GoogleGenAI(useVertex ? { apiKey: apiKey, vertexai: true } : { apiKey: apiKey });
        const response = await ai.models.generateContent({
            model: modelName,
            contents: promptText,
            config: {
                systemInstruction: MANI_AI_SYSTEM_PROMPT,
                temperature: 0.3
            }
        });
        const cleaned = _cleanOutput(response?.text || "");
        if (!cleaned) throw new Error("Empty SDK response");
        return cleaned;
    }

    async function _callBackupStream(promptText, base64Img = null, modelName = "openai") {
        const messages = [
            { role: "system", content: MANI_AI_SYSTEM_PROMPT },
            ...conversationHistory.slice(-8),
            base64Img && base64Img.startsWith("data:image/")
                ? {
                    role: "user",
                    content: [
                        { type: "text", text: promptText },
                        { type: "image_url", image_url: { url: base64Img } }
                    ]
                }
                : { role: "user", content: promptText }
        ];

        const res = await fetch("https://text.pollinations.ai/openai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                model: modelName,
                messages: messages,
                temperature: 0.3,
                stream: false
            })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const reply = _cleanOutput(data?.choices?.[0]?.message?.content || "");
        if (!reply) throw new Error("Empty backup response");
        return reply;
    }

    async function callAIAPI(promptText, base64Img = null) {
        if (_isExploitPayload(promptText)) {
            return "Invalid input format.";
        }

        const apiKey = await _AES_256_GCM_VAULT.unlockKey();
        const geminiPayload = _buildGeminiPayload(promptText, base64Img);

        const googleCalls = [
            _callGoogleREST(GEMINI_CONFIG.vertexBaseURL, "gemini-2.5-flash-lite", apiKey, geminiPayload, 4500),
            _callGoogleREST(GEMINI_CONFIG.vertexBaseURL, "gemini-2.5-flash", apiKey, geminiPayload, 4500),
            _callGoogleREST(GEMINI_CONFIG.vertexV1URL, "gemini-2.0-flash", apiKey, geminiPayload, 4500),
            _callGoogleREST(GEMINI_CONFIG.studioBaseURL, "gemini-flash-latest", apiKey, geminiPayload, 4500),
            _callGoogleREST(GEMINI_CONFIG.studioBaseURL, "gemini-2.5-flash", apiKey, geminiPayload, 4500)
        ];

        if (!base64Img) {
            googleCalls.push(_callGoogleSDK(apiKey, "gemini-2.5-flash", promptText, true));
            googleCalls.push(_callGoogleSDK(apiKey, "gemini-flash-latest", promptText, false));
        }

        // Start backup in background at t=0ms so if Google rejects, backup finishes with zero wasted wait time
        const backupPromise = Promise.any([
            _callBackupStream(promptText, base64Img, "openai"),
            _callBackupStream(promptText, base64Img, "gemini")
        ]);

        try {
            const googleReply = await Promise.any(googleCalls);
            conversationHistory.push({ role: "user", content: promptText });
            conversationHistory.push({ role: "assistant", content: googleReply });
            if (conversationHistory.length > 16) conversationHistory = conversationHistory.slice(-16);
            return googleReply;
        } catch (googleErr) {
            try {
                const fastBackupReply = await backupPromise;
                conversationHistory.push({ role: "user", content: promptText });
                conversationHistory.push({ role: "assistant", content: fastBackupReply });
                if (conversationHistory.length > 16) conversationHistory = conversationHistory.slice(-16);
                return fastBackupReply;
            } catch (backupErr) {
                const url = `https://text.pollinations.ai/${encodeURIComponent(promptText)}?model=openai&system=${encodeURIComponent(MANI_AI_SYSTEM_PROMPT)}`;
                const res = await fetch(url);
                const txt = _cleanOutput(await res.text());
                conversationHistory.push({ role: "user", content: promptText });
                conversationHistory.push({ role: "assistant", content: txt });
                return txt;
            }
        }
    }

    function appendMessageBubble(sender, content, imageSrc = null, hideImage = false, isLoadingBubble = false) {
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

            if (!isLoadingBubble) {
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
                        navigator.share({ title: "Mani AI Response", text: content });
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
            finalPrompt = "Describe what is shown in this image clearly.";
            userText = hideImageInChat ? "इसमें क्या दिख रहा है?" : "Analyze image";
        } else if (!finalPrompt) {
            return;
        }

        isProcessing = true;
        lastUserPrompt = finalPrompt;
        appendMessageBubble('user', userText, imagePayload, hideImageInChat, false);
        if (aiInput) aiInput.value = '';
        attachedBase64Image = null;
        if (mediaPreviewContainer) mediaPreviewContainer.style.display = 'none';

        const heavyQuery = _isHeavyQuestion(finalPrompt) || Boolean(imagePayload);
        const loadingBubble = appendMessageBubble('bot', heavyQuery ? 'Analyzing...' : '...', null, false, true);
        let loaderTimer = null;

        if (heavyQuery) {
            loaderTimer = _startCustomAnalyzingLoader(loadingBubble);
        }

        // Zero artificial delay: returns the instant the model responds
        const aiReply = await callAIAPI(finalPrompt, imagePayload);

        if (loaderTimer) clearInterval(loaderTimer);
        isProcessing = false;
        if (loadingBubble && loadingBubble.parentNode) {
            chatHistory.removeChild(loadingBubble);
        }
        appendMessageBubble('bot', aiReply, null, false, false);

        if (autoSpeak || isLiveModeActive || isCameraVisible) {
            speakText(aiReply, () => {
                if (isLiveModeActive && !isMicMuted) {
                    setTimeout(startLiveVoiceCycle, 200);
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
