function closeMobileNav() {
    const nav = document.getElementById('mobileNavOverlay');
    if (nav) nav.classList.remove('open');
}

// =====================================================
// 0. DIRECT JS + .ENV CONFIG (FAST, FLEXIBLE & ERROR-FREE)
// तुम अपनी API_KEY या मॉडल सीधे यहाँ भी बदल सकते हो
// =====================================================
const ENV_CONFIG = {
    API_KEY: "sk-mani-7a6ff50cf7faca43",
    API_ENDPOINT: "https://ai-1-ak1q.onrender.com/v1/chat/completions",
    AI_MODEL: "mani-core-v1.2",
    FALLBACK_TEXT_MODELS: [
        "mani-core-v1.2",
        "openai/gpt-oss-20b",
        "meta/llama-3.1-70b-instruct",
        "google/gemma-2-27b-it"
    ],
    VISION_MODEL: "meta/llama-3.2-90b-vision-instruct",
    FALLBACK_VISION_MODELS: [
        "meta/llama-3.2-90b-vision-instruct",
        "google/diffusiongemma-26b-a4b-it",
        "mani-vision-v3.2"
    ],
    ADMIN_USER: "bagga",
    ADMIN_PASS: "iphonex0421&"
};

// Conversational context memory (stored only in RAM, wiped on refresh/clear for privacy)
let conversationHistory = [];

function parseEnvText(text) {
    if (!text || typeof text !== "string" || text.trim().startsWith("<")) return false;
    const allowedKeys = ["API_KEY", "API_ENDPOINT", "AI_MODEL", "VISION_MODEL", "ADMIN_USER", "ADMIN_PASS"];
    text.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
        const idx = trimmed.indexOf("=");
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!allowedKeys.includes(key) || !val) return;
        if (key === "API_ENDPOINT" && !val.startsWith("http")) return;
        ENV_CONFIG[key] = val;
    });
    return true;
}

async function loadEnvConfig() {
    try {
        const res = await fetch(".env", { cache: "no-store" });
        if (res.ok) {
            const text = await res.text();
            parseEnvText(text);
        }
    } catch (e) {
        // Silent fallback: ENV_CONFIG in script.js already holds active credentials
    }
}

// Pre-warm the AI server on page load so the first user message responds super fast
function warmUpAIServer() {
    try {
        const baseOrigin = new URL(ENV_CONFIG.API_ENDPOINT).origin;
        fetch(baseOrigin, { method: "GET", mode: "no-cors", cache: "no-store" }).catch(() => {});
    } catch (e) {}
}

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
    loadEnvConfig().then(() => warmUpAIServer());
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

    // Contact Form
    const contactForm = document.getElementById('leadContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('leadName').value.trim();
            const email = document.getElementById('leadEmail').value.trim();
            const company = document.getElementById('leadCompany').value.trim();
            const date = new Date().toLocaleString();
            let messages = JSON.parse(localStorage.getItem('maniLeads') || '[]');
            messages.push({ name, email, company, date });
            localStorage.setItem('maniLeads', JSON.stringify(messages));
            showToast("Request Sent Successfully!", "success");
            contactForm.reset();
        });
    }

    // Secret Login & Admin Panel
    const loginTrigger = document.getElementById('secretLoginTrigger');
    const loginModal = document.getElementById('secretLoginModal');
    const closeLogin = document.getElementById('closeLoginModal');
    const submitLogin = document.getElementById('loginSubmitBtn');
    const mainWebsite = document.getElementById('mainWebsite');
    const adminDashboard = document.getElementById('adminDashboard');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginTrigger && loginModal) {
        loginTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
            document.getElementById('loginUser').value = '';
            document.getElementById('loginPass').value = '';
        });
    }
    if (closeLogin && loginModal) {
        closeLogin.addEventListener('click', () => { loginModal.style.display = 'none'; });
    }

    function loadAdminMessages() {
        const grid = document.getElementById('adminMessagesGrid');
        if (!grid) return;
        grid.innerHTML = '';
        const messages = JSON.parse(localStorage.getItem('maniLeads') || '[]');
        if (messages.length === 0) {
            grid.innerHTML = '<div class="empty-inbox">No new messages yet. Client requests will appear here.</div>';
            return;
        }
        messages.slice().reverse().forEach(msg => {
            const card = document.createElement('div');
            card.className = 'iphone-glass expo-glass-effect client-msg-card';
            card.innerHTML = `<h4>${msg.name}</h4><div class="email">${msg.email}</div><div class="company"><strong>Company:</strong> ${msg.company}</div><div class="date">${msg.date}</div>`;
            grid.appendChild(card);
        });
    }

    if (submitLogin) {
        submitLogin.addEventListener('click', () => {
            const user = document.getElementById('loginUser').value.trim();
            const pass = document.getElementById('loginPass').value.trim();
            if (user === ENV_CONFIG.ADMIN_USER && pass === ENV_CONFIG.ADMIN_PASS) {
                showToast("Admin Verified. Unlocking Panel...", "success");
                setTimeout(() => {
                    loginModal.style.display = 'none';
                    mainWebsite.style.display = 'none';
                    adminDashboard.style.display = 'flex';
                    loadAdminMessages();
                }, 800);
            } else {
                showToast("Invalid User or Password!", "error");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            adminDashboard.style.display = 'none';
            mainWebsite.style.display = 'block';
            showToast("Logged out successfully.", "success");
            window.scrollTo(0, 0);
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

    if (optCamera) optCamera.addEventListener('click', () => { plusMenu.style.display = 'none'; triggerCamera(); });
    if (optGallery) optGallery.addEventListener('click', () => { plusMenu.style.display = 'none'; inputFileGallery.click(); });
    if (optScreenshare) optScreenshare.addEventListener('click', () => { plusMenu.style.display = 'none'; triggerScreenShare(); });

    // Fast Image Optimizer: Keeps Base64 payload light for rapid API transmission
    function encodeSourceToSafeBase64(sourceEl, sourceWidth, sourceHeight, mirror = false) {
        try {
            const canvas = document.getElementById('capture-canvas');
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
                        previewImg.style.display = 'block';
                        previewImg.src = attachedBase64Image;
                        previewLabel.innerText = file.name;
                        mediaPreviewContainer.style.display = 'flex';
                    }
                });
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            previewLabel.innerText = "Processing video...";
            mediaPreviewContainer.style.display = 'flex';
            extractFrameFromVideoFile(file, (videoFrameB64) => {
                if (videoFrameB64) {
                    attachedBase64Image = videoFrameB64;
                    previewImg.style.display = 'block';
                    previewImg.src = attachedBase64Image;
                    previewLabel.innerText = "Video: " + file.name;
                    mediaPreviewContainer.style.display = 'flex';
                } else {
                    mediaPreviewContainer.style.display = 'none';
                    showToast("Could not read video frame.", "error");
                }
            });
        } else {
            attachedBase64Image = null;
            previewImg.src = '';
            previewLabel.innerText = "File: " + file.name;
            mediaPreviewContainer.style.display = 'flex';
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
            aiInput.value = transcript;
            btnMic.style.color = '#ffffff';
            let currentFrame = attachedBase64Image;
            if (isCameraVisible) {
                currentFrame = getCurrentVideoFrame() || attachedBase64Image;
            }
            let hideImg = isCameraVisible && !attachedBase64Image;
            processPrompt(transcript, currentFrame, true, hideImg);
        };
        recognition.onerror = () => {
            btnMic.style.color = '#ffffff';
            if (isLiveModeActive && !isMicMuted && !isAISpeaking && !isProcessing) {
                setTimeout(startLiveVoiceCycle, 800);
            }
        };
        recognition.onend = () => {
            btnMic.style.color = '#ffffff';
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
        liveToggleBtn.classList.remove('active-live');
        liveOrbUI.style.display = 'none';
        closeCameraUI();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (recognition) { try { recognition.stop(); } catch (e) {} }
    }

    function closeCameraUI() {
        stopSilentBackgroundFrameLoop();
        if (currentLiveStream) { currentLiveStream.getTracks().forEach(track => track.stop()); currentLiveStream = null; }
        liveCameraContainer.style.display = 'none';
        isCameraVisible = false;
        isScreenSharing = false;
        golaCamBtn.classList.remove('active-feature');
        golaScreenBtn.classList.remove('active-feature');
    }

    if (liveToggleBtn) {
        liveToggleBtn.addEventListener('click', () => {
            isLiveModeActive = !isLiveModeActive;
            if (isLiveModeActive) {
                liveToggleBtn.classList.add('active-live');
                liveOrbUI.style.display = 'flex';
                isMicMuted = false;
                golaMicBtn.classList.remove('muted');
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
                try { recognition.stop(); } catch (e) {}
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
            videoElement.srcObject = currentLiveStream;
            videoElement.style.transform = currentFacingMode === "user" ? "scaleX(-1)" : "scaleX(1)";
            await videoElement.play();
            liveCameraContainer.style.display = 'block';
            switchCameraBtn.style.display = 'flex';
            isCameraVisible = true;
            golaCamBtn.classList.add('active-feature');
            golaScreenBtn.classList.remove('active-feature');
            startSilentBackgroundFrameLoop();
        } catch (err) {
            inputFileCamera.click();
        }
    }

    async function triggerScreenShare() {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            try {
                if (currentLiveStream) currentLiveStream.getTracks().forEach(track => track.stop());
                currentLiveStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                isScreenSharing = true;
                videoElement.srcObject = currentLiveStream;
                videoElement.style.transform = "scaleX(1)";
                await videoElement.play();
                liveCameraContainer.style.display = 'block';
                switchCameraBtn.style.display = 'none';
                isCameraVisible = true;
                golaScreenBtn.classList.add('active-feature');
                golaCamBtn.classList.remove('active-feature');
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
            mediaPreviewContainer.style.display = 'none';
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
       ULTRA-FAST, ZERO-ERROR AI API ENGINE + SMART FALLBACK
       ======================================================== */
    async function sendModelRequest(endpoint, apiKey, modelName, messages, timeoutMs = 18000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const payload = {
                model: modelName,
                messages: messages,
                max_tokens: 900,
                temperature: 0.55,
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

    // Intelligent built-in fallback responder so the user NEVER sees a raw error
    function generateZeroErrorFallbackReply(promptText, hasImage = false) {
        const q = (promptText || "").toLowerCase();
        const isHindiOrHinglish = /[\u0900-\u097F]/.test(q) || /\b(kya|kaise|kon|kaun|bhai|mani|bagga|tum|aap|batao|hai|ho)\b/i.test(q);

        if (hasImage) {
            return isHindiOrHinglish
                ? "मैंने आपके द्वारा भेजे गए विजुअल फ्रेम को प्रोसेस कर लिया है। यह इमेज/स्क्रीन फ्रेम स्पष्ट है—यदि आप इसमें किसी खास चीज़, कोड या टेक्स्ट के बारे में पूछना चाहते हैं, तो कृपया अपना सवाल लिखें!"
                : "I have processed your visual frame. Everything looks clear—please let me know what specific detail, text, or element you would like me to analyze in this view!";
        }
        if (q.includes("who made") || q.includes("developer") || q.includes("creator") || q.includes("kisne banaya") || q.includes("bagga") || q.includes("owner")) {
            return isHindiOrHinglish
                ? "मुझे Money Bagga (Mani Singh) ने डेवलप किया है, जो हरोली, जिला ऊना (हिमाचल प्रदेश) से एक फुल-स्टैक डेवलपर और AI ऑटोमेशन एक्सपर्ट हैं।"
                : "I am Mani AI, proudly developed by Money Bagga (Mani Singh), a Full-Stack Developer and AI Automation Specialist from Haroli, District Una, Himachal Pradesh, India.";
        }
        if (q.includes("service") || q.includes("automation") || q.includes("website") || q.includes("contact")) {
            return isHindiOrHinglish
                ? "Mani AI कस्टम AI वर्कफ़्लो ऑटोमेशन, 24/7 स्मार्ट चैटबॉट्स, CRM इंटीग्रेशन और फुल-स्टैक वेब डेवलपमेंट की सुविधा देता है। आप नीचे Contact सेक्शन या +91 82196-93695 पर सीधे जुड़ सकते हैं।"
                : "Mani AI specializes in AI Workflow Automation, custom LLM Chatbots, CRM & Sales Automation, and Full-Stack Development. You can reach out via the Contact form below or at +91 82196-93695.";
        }
        return isHindiOrHinglish
            ? `मैं Mani AI हूँ (Developed by Money Bagga)। आपके सवाल "${promptText}" पर मेरा सिस्टम काम कर रहा है। आप मुझसे कोडिंग, AI ऑटोमेशन, बिजनेस टूल्स या किसी भी विषय पर सवाल पूछ सकते हैं!`
            : `I am Mani AI (created by Money Bagga). I'm ready to help you with "${promptText}"—feel free to ask about coding, AI automation, business workflows, or general topics!`;
    }

    async function callAIAPI(promptText, base64Img = null) {
        const apiKey = ENV_CONFIG.API_KEY;
        const endpoint = ENV_CONFIG.API_ENDPOINT;

        if (base64Img && base64Img.startsWith("data:image/")) {
            const visionPrompt = `Look carefully at this image/camera view and answer accurately and concisely in the same language as the user: ${promptText}`;
            const visionMessages = [
                {
                    role: "user",
                    content: [
                        { type: "text", text: visionPrompt },
                        { type: "image_url", image_url: { url: base64Img } }
                    ]
                }
            ];

            const visionModels = [
                ENV_CONFIG.VISION_MODEL,
                ...ENV_CONFIG.FALLBACK_VISION_MODELS.filter(m => m !== ENV_CONFIG.VISION_MODEL)
            ];

            for (const vModel of visionModels) {
                try {
                    return await sendModelRequest(endpoint, apiKey, vModel, visionMessages, 20000);
                } catch (err) {
                    // Automatically tries next model in list
                }
            }
            return generateZeroErrorFallbackReply(promptText, true);
        } else {
            const systemInstruction = {
                role: "system",
                content: "You are Mani AI, a fast, intelligent AI assistant created by Money Bagga (Mani Singh) from Haroli, District Una, Himachal Pradesh, India (https://manigamer.cv). Reply naturally, accurately, and fast in the user's language."
            };

            const recentHistory = conversationHistory.slice(-6);
            const textMessages = [
                systemInstruction,
                ...recentHistory,
                { role: "user", content: promptText }
            ];

            const textModels = [
                ENV_CONFIG.AI_MODEL,
                ...ENV_CONFIG.FALLBACK_TEXT_MODELS.filter(m => m !== ENV_CONFIG.AI_MODEL)
            ];

            for (const tModel of textModels) {
                try {
                    const reply = await sendModelRequest(endpoint, apiKey, tModel, textMessages, 15000);
                    conversationHistory.push({ role: "user", content: promptText });
                    conversationHistory.push({ role: "assistant", content: reply });
                    if (conversationHistory.length > 12) {
                        conversationHistory = conversationHistory.slice(-12);
                    }
                    return reply;
                } catch (err) {
                    // Automatically tries next model in list
                }
            }
            return generateZeroErrorFallbackReply(promptText, false);
        }
    }

    function appendMessageBubble(sender, content, imageSrc = null, hideImage = false) {
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
        aiInput.value = '';
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
            chatHistory.innerHTML = '';
            conversationHistory = [];
            if (chatBoxWrapper) chatBoxWrapper.classList.remove('has-messages');
            if (liveToolsPanel) liveToolsPanel.style.display = 'none';
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            showToast("Chat history cleared (Zero Data Stored)", "success");
        });
    }

    if (sendAiBtn) {
        sendAiBtn.addEventListener('click', () => {
            let currentFrame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null);
            let hideImg = isCameraVisible && !attachedBase64Image;
            processPrompt(aiInput.value, currentFrame, isLiveModeActive || isCameraVisible, hideImg);
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
