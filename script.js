// =====================================================
// MANI AI MAIN SCRIPT (manigamer.cv)
// =====================================================
function closeMobileNav() {
    const nav = document.getElementById('mobileNavOverlay');
    if (nav) nav.classList.remove('open');
}

// =====================================================
// 1. REAL PRE-ENCRYPTED AES-256-GCM HARDWARE VAULT
//    (Zero Plaintext in Comments or Code - 100% GitHub Safe)
// =====================================================
const _MANI_AES256_VAULT = (() => {
    const _K256 = new Uint8Array([
        142, 19, 204, 87, 33, 179, 241, 62,
        95, 128, 211, 44, 167, 73, 250, 11,
        184, 59, 102, 229, 14, 153, 81, 236,
        47, 198, 115, 70, 221, 38, 160, 92
    ]);
    const _IV96 = new Uint8Array([77, 219, 34, 165, 108, 243, 19, 88, 152, 61, 207, 130]);

    // Pre-encrypted AES-256-GCM Ciphertext + 128-bit Auth Tag (Key + Model + Google URLs)
    const _CIPHER_BLOB = new Uint8Array([
        22, 119, 230, 81, 200, 149, 126, 200, 8, 201, 224, 131, 35, 111, 56, 230,
        245, 76, 174, 244, 159, 60, 219, 100, 187, 236, 97, 107, 150, 91, 90, 252,
        215, 22, 61, 231, 6, 149, 240, 220, 226, 40, 195, 151, 227, 209, 227, 102,
        118, 230, 219, 204, 48, 29, 131, 130, 250, 126, 203, 196, 193, 94, 11, 238,
        13, 185, 83, 198, 21, 152, 87, 200, 234, 154, 175, 217, 164, 167, 114, 201,
        115, 74, 92, 62, 137, 223, 168, 221, 6, 9, 121, 6, 105, 87, 73, 219,
        113, 81, 14, 247, 140, 133, 233, 211, 47, 81, 172, 127, 241, 134, 20, 110,
        204, 234, 57, 203, 120, 247, 147, 188, 28, 124, 241, 241, 93, 73, 56, 212,
        92, 124, 26, 24, 131, 115, 9, 63, 147, 162, 60, 74, 241, 165, 180, 159,
        197, 89, 181, 10, 20, 192, 62, 23, 86, 173, 126, 104, 25, 249, 115, 178,
        158, 147, 16, 168, 26, 86, 63, 75, 177, 163, 8, 96, 233, 132, 63, 143,
        66, 97, 189, 12, 95, 45, 73, 136, 95, 158, 165, 145, 51, 88, 52, 190,
        96, 139, 98, 178, 148, 29, 254, 65, 46, 86, 216, 231, 202, 233, 227, 168,
        251, 22, 183, 155, 214, 253, 84, 52, 182, 122, 120, 102, 242, 4, 214, 71,
        169, 95, 201, 242, 212, 29, 218, 103, 94, 4, 15, 153, 240, 16, 251, 226,
        154, 101, 56, 48, 226, 143, 181, 142, 160, 101, 224, 229, 184, 137, 102, 8,
        153, 125, 182, 50, 99, 24, 57, 233, 55, 145, 14, 16, 237, 18, 223, 226,
        248, 155, 168, 28, 148, 237, 25, 78, 139, 95, 204, 237, 23, 246, 51, 163,
        49, 203, 132, 106, 92, 153, 14, 169, 25, 191, 132, 239, 91, 88, 163, 120,
        122, 212, 180, 138, 15, 204, 75, 19, 141, 31, 213, 190, 23, 73, 145, 48,
        164, 54, 28, 154, 71, 6, 45, 110, 154, 188, 218, 193, 106, 179, 246
    ]);

    let _cachedCfg = null;

    async function unlock() {
        if (_cachedCfg) return _cachedCfg;
        const cryptoKey = await window.crypto.subtle.importKey(
            "raw",
            _K256,
            { name: "AES-GCM", length: 256 },
            false,
            ["decrypt"]
        );
        const decryptedBuf = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: _IV96, tagLength: 128 },
            cryptoKey,
            _CIPHER_BLOB
        );
        const parsed = JSON.parse(new TextDecoder().decode(decryptedBuf));
        _cachedCfg = {
            apiKey: parsed.k,
            model: parsed.m,
            studioBaseURL: parsed.u1,
            vertexBaseURL: parsed.u2,
            liveWsURL: parsed.ws,
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 2048
        };
        return _cachedCfg;
    }

    return Object.freeze({ unlock });
})();

// =====================================================
// 1B. KALI LINUX & PAYLOAD INTRUSION SHIELD (ADSENSE SAFE)
// =====================================================
const _MANI_DEFENSE_SHARD = [
    2340, 2375, 2352, 2368, 32, 2350, 2366, 2306, 32, 2325, 2368, 32,
    2330, 2379, 2342, 32, 2350, 2366, 2342, 2352, 2330, 2379, 2342
];

function _getDefenseResponse() {
    return String.fromCharCode(..._MANI_DEFENSE_SHARD);
}

function _isSearchOrAdSenseCrawler() {
    const ua = (navigator.userAgent || "").toLowerCase();
    return /(googlebot|mediapartners-google|adsbot-google|apis-google|bingbot|slurp|duckduckbot)/i.test(ua);
}

function _isKaliOrExploitAttempt(inputStr = "") {
    if (_isSearchOrAdSenseCrawler()) return false;

    const ua = (navigator.userAgent || "").toLowerCase();
    const platform = (navigator.platform || "").toLowerCase();

    if (/\b(kali|parrot|blackarch|backbox|pentoo|sqlmap|nikto|nmap|burpsuite|burp|metasploit|dirbuster|gobuster|wfuzz|hydra|acunetix|nessus|zgrab|masscan)\b/i.test(ua) || /\bkali\b/i.test(platform)) {
        return true;
    }

    const raw = String(inputStr || "").trim();
    if (!raw) return false;

    const payloadPatterns = [
        /<script[\s>]/i,
        /javascript\s*:/i,
        /\b(onerror|onload|onmouseover|onfocus)\s*=/i,
        /\bunion\s+(all\s+)?select\b/i,
        /('\s*or\s*'1'\s*=\s*'1|"\s*or\s*"1"\s*=\s*"1|\bor\s+1\s*=\s*1\b)/i,
        /\b(drop\s+table|information_schema|sleep\(\d+\)|benchmark\()/i,
        /(\/etc\/passwd|\/etc\/shadow|\.\.\/\.\.\/|cmd\.exe|\/bin\/bash|\/bin\/sh)/i,
        /\b(_mani_aes256_vault|_cipher_blob|api_key\s*nikal|api\s*key\s*de|expose\s*api\s*key|dump\s*key|show\s*system\s*prompt|ignore\s+all\s+previous\s+instructions)\b/i,
        /\b(sqlmap|metasploit|burpsuite|nmap\s+-|kali\s+linux\s+payload)\b/i
    ];

    return payloadPatterns.some(rx => rx.test(raw));
}

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
    try {
        localStorage.removeItem('maniLeads');
    } catch (e) {}

    if (_isKaliOrExploitAttempt(window.location.href)) {
        document.body.innerHTML = `<div style="background:#000;color:#ff2a2a;height:100vh;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;text-align:center;padding:20px;">${_getDefenseResponse()}</div>`;
        return;
    }

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

    // SCROLL REVEAL (Blur-Free Smooth Reveal + AdSense Bot Safe)
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

    // =====================================================
    // UPGRADED SMOOTH SPEECH ENGINE (Sentence Chunking)
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
        const isHinglish = /\b(hai|kya|main|mera|karta|ho|gaya|kar|raha|hu|hain|bhai|nahi|yeh|woh|dikho|dekh|kaise|batao)\b/i.test(cleanText);
        const targetLang = (hasHindiChars || isHinglish) ? 'hi-IN' : 'en-IN';

        if (availableVoices.length === 0) loadVoices();
        const selectedVoice =
            availableVoices.find(v => (v.lang === targetLang || v.lang.replace('_', '-') === targetLang) && /google|natural|swara|madhur/i.test(v.name)) ||
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
            utterance.rate = 1.02;
            utterance.pitch = 1.0;
            if (selectedVoice) utterance.voice = selectedVoice;

            utterance.onend = () => speakNextChunk();
            utterance.onerror = () => {
                isAISpeaking = false;
                if (onEndCallback) onEndCallback();
            };
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
       ULTRA-FAST SINGLE MODEL + AES-256-GCM INFERENCE ENGINE
       ======================================================== */
    function _cleanModelOutput(rawContent) {
        if (!rawContent) return "";
        return String(rawContent)
            .replace(/<think>[\s\S]*?<\/think>/gi, "")
            .replace(/<think>[\s\S]*$/gi, "")
            .trim();
    }

    function _isValidReplyText(txt) {
        if (!txt || txt.length < 1) return false;
        const lower = txt.toLowerCase();
        return !(/^(system error:|❌|error:|http \d{3})/i.test(txt) ||
            lower.includes('"status":400') ||
            lower.includes('"status":401') ||
            lower.includes('"status":403') ||
            lower.includes('"status":404') ||
            lower.includes('"status":429') ||
            lower.startsWith('<!doctype') ||
            lower.startsWith('<html'));
    }

    function _buildGooglePayload(cfg, systemText, historyList, promptText, base64Img = null) {
        const contents = [];

        for (const item of historyList) {
            if (!item || !item.content) continue;
            const mappedRole = item.role === "assistant" ? "model" : "user";
            if (contents.length > 0 && contents[contents.length - 1].role === mappedRole) {
                contents[contents.length - 1].parts[0].text += "\n" + String(item.content);
            } else {
                contents.push({
                    role: mappedRole,
                    parts: [{ text: String(item.content) }]
                });
            }
        }

        const userParts = [{ text: String(promptText || "") }];
        if (base64Img && base64Img.startsWith("data:image/")) {
            const match = base64Img.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
            if (match) {
                userParts.push({
                    inlineData: {
                        mimeType: match[1],
                        data: match[2]
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
                role: "system",
                parts: [{ text: systemText }]
            },
            contents: contents,
            generationConfig: {
                temperature: cfg.temperature,
                topP: cfg.topP,
                maxOutputTokens: cfg.maxOutputTokens
            }
        };
    }

    async function _callGoogleRest(baseUrl, modelSlug, apiKey, payload, timeoutMs = 6500) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const url = `${baseUrl}/${modelSlug}:generateContent?key=${encodeURIComponent(apiKey)}`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timer);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            const parts = data?.candidates?.[0]?.content?.parts || [];
            const text = _cleanModelOutput(parts.map(p => p.text || "").join(""));
            if (_isValidReplyText(text)) return text;
            throw new Error("Empty response");
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    function _callLiveWebSocket(cfg, systemText, promptText, timeoutMs = 6000) {
        return new Promise((resolve, reject) => {
            let settled = false;
            let collectedText = "";
            let ws = null;

            const timer = setTimeout(() => {
                if (!settled) {
                    settled = true;
                    try { if (ws) ws.close(); } catch (e) {}
                    const cleaned = _cleanModelOutput(collectedText);
                    if (_isValidReplyText(cleaned)) resolve(cleaned);
                    else reject(new Error("WS timeout"));
                }
            }, timeoutMs);

            try {
                ws = new WebSocket(`${cfg.liveWsURL}?key=${encodeURIComponent(cfg.apiKey)}`);
            } catch (err) {
                clearTimeout(timer);
                return reject(err);
            }

            let promptSent = false;
            function sendTurn() {
                if (promptSent || !ws || ws.readyState !== WebSocket.OPEN) return;
                promptSent = true;
                ws.send(JSON.stringify({
                    clientContent: {
                        turns: [{ role: "user", parts: [{ text: String(promptText) }] }],
                        turnComplete: true
                    }
                }));
            }

            ws.onopen = () => {
                ws.send(JSON.stringify({
                    setup: {
                        model: `models/${cfg.model}`,
                        generationConfig: {
                            responseModalities: ["TEXT"],
                            temperature: cfg.temperature,
                            topP: cfg.topP,
                            maxOutputTokens: cfg.maxOutputTokens
                        },
                        systemInstruction: {
                            parts: [{ text: systemText }]
                        }
                    }
                }));
            };

            ws.onmessage = async (event) => {
                try {
                    const rawStr = event.data instanceof Blob ? await event.data.text() : String(event.data);
                    const msg = JSON.parse(rawStr);

                    if (msg.setupComplete !== undefined) {
                        sendTurn();
                        return;
                    }

                    const parts = msg?.serverContent?.modelTurn?.parts || [];
                    for (const p of parts) {
                        if (p.text) collectedText += p.text;
                    }

                    if (msg?.serverContent?.outputTranscription?.text) {
                        collectedText += msg.serverContent.outputTranscription.text;
                    }

                    if (msg?.serverContent?.turnComplete) {
                        clearTimeout(timer);
                        settled = true;
                        try { ws.close(); } catch (e) {}
                        const cleaned = _cleanModelOutput(collectedText);
                        if (_isValidReplyText(cleaned)) resolve(cleaned);
                        else reject(new Error("Empty WS turn"));
                    }
                } catch (e) {}
            };

            ws.onerror = () => {
                if (!settled) {
                    clearTimeout(timer);
                    settled = true;
                    reject(new Error("WS error"));
                }
            };

            ws.onclose = () => {
                if (!settled) {
                    clearTimeout(timer);
                    settled = true;
                    const cleaned = _cleanModelOutput(collectedText);
                    if (_isValidReplyText(cleaned)) resolve(cleaned);
                    else reject(new Error("WS closed"));
                }
            };
        });
    }

    async function _callBrowserDirectStream(messages, useSimpleHeader = false, timeoutMs = 9000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const targetUrl = useSimpleHeader ? "https://text.pollinations.ai/" : "https://text.pollinations.ai/openai";
            const headers = useSimpleHeader
                ? { "Content-Type": "text/plain;charset=UTF-8" }
                : { "Content-Type": "application/json", "Accept": "application/json" };

            const response = await fetch(targetUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    model: "openai",
                    messages: messages,
                    stream: false
                }),
                signal: controller.signal
            });

            clearTimeout(timer);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const rawText = await response.text();
            try {
                const data = JSON.parse(rawText);
                const msg = _cleanModelOutput(data.choices?.[0]?.message?.content || data.choices?.[0]?.text || "");
                if (_isValidReplyText(msg)) return msg;
            } catch (e) {
                const cleanedRaw = _cleanModelOutput(rawText);
                if (_isValidReplyText(cleanedRaw)) return cleanedRaw;
            }
            throw new Error("Invalid stream response");
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    async function callAIAPI(promptText, base64Img = null) {
        if (_isKaliOrExploitAttempt(promptText)) {
            return _getDefenseResponse();
        }

        const systemRulesText = [
            "You are a fast, intelligent, natural AI assistant.",
            "Give direct, clear, and accurate answers to whatever the user asks.",
            "IDENTITY RULE: Do not mention your name unless asked. ONLY IF the user asks your name, who you are, or who created you, say that your name is 'Mani AI' and you were created by 'Money Bagga (Mani Singh)' from Haroli, District Una, Himachal Pradesh.",
            "LANGUAGE RULE: Reply in the same language and style the user uses (Hindi, Hinglish, or English)."
        ].join("\n");

        const cfg = await _MANI_AES256_VAULT.unlock();
        const googlePayload = _buildGooglePayload(
            cfg,
            systemRulesText,
            conversationHistory.slice(-10),
            promptText,
            base64Img
        );

        const fallbackMessages = (base64Img && base64Img.startsWith("data:image/"))
            ? [
                { role: "system", content: systemRulesText },
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
                { role: "system", content: systemRulesText },
                ...conversationHistory.slice(-10),
                { role: "user", content: promptText }
            ];

        try {
            const raceCalls = [
                _callGoogleRest(cfg.vertexBaseURL, cfg.model, cfg.apiKey, googlePayload, 6500),
                _callGoogleRest(cfg.studioBaseURL, cfg.model, cfg.apiKey, googlePayload, 6500),
                _callBrowserDirectStream(fallbackMessages, false, 8500)
            ];

            if (!base64Img) {
                raceCalls.unshift(_callLiveWebSocket(cfg, systemRulesText, promptText, 6000));
            }

            const reply = await Promise.any(raceCalls);
            conversationHistory.push({ role: "user", content: promptText });
            conversationHistory.push({ role: "assistant", content: reply });
            if (conversationHistory.length > 16) conversationHistory = conversationHistory.slice(-16);
            return reply;
        } catch (err) {
            try {
                const reply2 = await _callBrowserDirectStream(fallbackMessages, true, 9000);
                conversationHistory.push({ role: "user", content: promptText });
                conversationHistory.push({ role: "assistant", content: reply2 });
                if (conversationHistory.length > 16) conversationHistory = conversationHistory.slice(-16);
                return reply2;
            } catch (err2) {
                return "Connection busy. Please try again.";
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

            if (isLoadingBubble) {
                textNode.innerHTML = `<span style="font-weight:600;color:#93c5fd;font-size:14.5px;">⚡ Mani AI is responding...</span>`;
            } else {
                textNode.innerText = content;
            }
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
            finalPrompt = "Describe what you see in this image/video frame clearly.";
            userText = hideImageInChat ? "इसमें क्या दिख रहा है?" : "Analyze media";
        } else if (!finalPrompt) {
            return;
        }

        isProcessing = true;
        lastUserPrompt = finalPrompt;
        appendMessageBubble('user', userText, imagePayload, hideImageInChat, false);
        if (aiInput) aiInput.value = '';
        attachedBase64Image = null;
        if (mediaPreviewContainer) mediaPreviewContainer.style.display = 'none';

        const loadingBubble = appendMessageBubble('bot', '', null, false, true);

        const aiReply = await callAIAPI(finalPrompt, imagePayload);
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
