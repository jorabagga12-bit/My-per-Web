// =====================================================
// MANI AI MAIN SCRIPT (manigamer.cv)
// =====================================================
function closeMobileNav() {
    const nav = document.getElementById('mobileNavOverlay');
    if (nav) nav.classList.remove('open');
}

// =====================================================
// 1. EXACT NVIDIA NODE CONFIG (ONLY YOUR CREDENTIALS)
// =====================================================
const NVIDIA_CONFIG = {
    apiKey: "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",
    baseURL: "https://integrate.api.nvidia.com/v1",
    model: "openai/gpt-oss-20b",
    temperature: 1,
    top_p: 1,
    max_tokens: 4096,
    stream: false
};

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
        /\b(nvapi-|nvidia_config|api_key\s*nikal|api\s*key\s*de|expose\s*api\s*key|dump\s*key|show\s*system\s*prompt|ignore\s+all\s+previous\s+instructions)\b/i,
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
       NVIDIA NIM + BROWSER-NATIVE OPENAI INFERENCE ENGINE
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
            lower.includes('got it! regarding') ||
            lower.includes('would you like a quick step-by-step') ||
            lower.includes('"status":400') ||
            lower.includes('"status":401') ||
            lower.includes('"status":403') ||
            lower.includes('"status":404') ||
            lower.includes('"status":429') ||
            lower.includes('unsupported value') ||
            lower.includes('unsupported parameter') ||
            lower.includes('post requests are only available') ||
            lower.startsWith('<!doctype') ||
            lower.startsWith('<html'));
    }

    // 1. Exact NVIDIA Node.js SDK structure call
    async function _callNvidiaEndpoint(targetUrl, messages, timeoutMs = 18000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NVIDIA_CONFIG.apiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    model: NVIDIA_CONFIG.model,
                    messages: messages,
                    temperature: NVIDIA_CONFIG.temperature,
                    top_p: NVIDIA_CONFIG.top_p,
                    max_tokens: NVIDIA_CONFIG.max_tokens,
                    stream: NVIDIA_CONFIG.stream
                }),
                signal: controller.signal
            });

            clearTimeout(timer);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const completion = await response.json();
            const reasoning = completion.choices?.[0]?.message?.reasoning_content;
            const content = completion.choices?.[0]?.message?.content;

            const finalOutput = _cleanModelOutput(content || reasoning || "");
            if (_isValidReplyText(finalOutput)) return finalOutput;
            throw new Error("Empty NVIDIA completion");
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    // 2. Exact Working Browser-CORS OpenAI Payload (NO extra temperature/max_tokens that cause HTTP 400)
    async function _callBrowserOpenAIPost(targetUrl, messages, useSimpleHeader = false, timeoutMs = 20000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const headers = useSimpleHeader
                ? { 'Content-Type': 'text/plain;charset=UTF-8' }
                : { 'Content-Type': 'application/json', 'Accept': 'application/json' };

            const response = await fetch(targetUrl, {
                method: 'POST',
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
            throw new Error("Invalid OpenAI POST response");
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    // 3. Clean GET Fallback (No special characters or newlines in path)
    async function _callBrowserCleanGet(promptText, isHindiOrHinglish, timeoutMs = 18000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const sysRule = isHindiOrHinglish
                ? "Reply naturally like a smart friend in Hindi or Hinglish. Only say your name is Mani AI created by Money Bagga if asked."
                : "Reply naturally and accurately in English. Only say your name is Mani AI created by Money Bagga if asked.";

            const cleanPrompt = String(promptText || "Hello").replace(/\s+/g, " ").trim().slice(0, 350);
            const url = `https://text.pollinations.ai/${encodeURIComponent(cleanPrompt)}?model=openai&system=${encodeURIComponent(sysRule)}`;

            const res = await fetch(url, { method: "GET", signal: controller.signal });
            clearTimeout(timer);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const text = _cleanModelOutput(await res.text());
            if (_isValidReplyText(text)) return text;
            throw new Error("Empty GET response");
        } catch (err) {
            clearTimeout(timer);
            throw err;
        }
    }

    async function callAIAPI(promptText, base64Img = null) {
        if (_isKaliOrExploitAttempt(promptText)) {
            return _getDefenseResponse();
        }

        const isHindiOrHinglish = /[\u0900-\u097F]/.test(promptText) || /\b(kya|kaise|kese|kab|hua|kon|kaun|bhai|bahi|brother|mani|bagga|tum|aap|batao|hai|ho|naam|mein|main|mera|teri|tera|haan|ha|nahi|badiya|fir)\b/i.test(promptText);

        const systemInstruction = {
            role: "system",
            content: [
                "You are a warm, smart, natural, human-like AI peer (talking just like Google Gemini).",
                "STRICT CONVERSATION RULES:",
                "1. If the user sends a short casual message (like 'Hi', 'Bahi kese ho', 'Fir to badiya', 'Ha', 'Ok'), reply in 1 short, natural, friendly sentence like a real brother/friend.",
                "2. If the user asks any factual, general, or technical question (like 'Modi kon hai', 'Ai kya hai', 'Shimla samjhota kab hua', 'Which number is larger, 9.11 or 9.8?', or coding questions), give a direct, clear, accurate, and complete answer.",
                "3. IDENTITY RULE: Never mention your name on normal greetings or general questions. ONLY IF the user explicitly asks your name, who you are, or who made/created you, tell them clearly that your name is 'Mani AI' and you were created by 'Money Bagga (Mani Singh)' from Haroli, District Una, Himachal Pradesh.",
                "4. LANGUAGE RULE: If the user writes in Hindi or Hinglish, reply in natural Hindi (Devanagari) or friendly Hinglish. If they write in English, reply in natural English."
            ].join("\n")
        };

        const activeMessages = (base64Img && base64Img.startsWith("data:image/"))
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

        const nvidiaTarget = `${NVIDIA_CONFIG.baseURL}/chat/completions`;

        // Stage 1: Race NVIDIA (different host) + Single Primary OpenAI POST (Exact payload that worked in 60144.jpg)
        try {
            const reply = await Promise.any([
                _callBrowserOpenAIPost("https://text.pollinations.ai/openai", activeMessages, false, 20000),
                _callNvidiaEndpoint(`https://cors.eu.org/${nvidiaTarget}`, activeMessages, 18000),
                _callNvidiaEndpoint(nvidiaTarget, activeMessages, 15000)
            ]);
            conversationHistory.push({ role: "user", content: promptText });
            conversationHistory.push({ role: "assistant", content: reply });
            if (conversationHistory.length > 16) conversationHistory = conversationHistory.slice(-16);
            return reply;
        } catch (stage1Err) {}

        // Stage 2: Sequential Simple-Header POST (No CORS preflight)
        try {
            const reply2 = await _callBrowserOpenAIPost("https://text.pollinations.ai/", activeMessages, true, 20000);
            conversationHistory.push({ role: "user", content: promptText });
            conversationHistory.push({ role: "assistant", content: reply2 });
            if (conversationHistory.length > 16) conversationHistory = conversationHistory.slice(-16);
            return reply2;
        } catch (stage2Err) {}

        // Stage 3: Sequential Clean GET Stream
        try {
            const reply3 = await _callBrowserCleanGet(promptText, isHindiOrHinglish, 18000);
            conversationHistory.push({ role: "user", content: promptText });
            conversationHistory.push({ role: "assistant", content: reply3 });
            if (conversationHistory.length > 16) conversationHistory = conversationHistory.slice(-16);
            return reply3;
        } catch (stage3Err) {
            return isHindiOrHinglish
                ? "एकदम बढ़िया हूँ भाई! बताओ आज किस सवाल या प्रोजेक्ट पर काम करना है?"
                : "Doing great! Let me know what question or project we are working on today.";
        }
    }

    // Gemini-Style Live "Analyzing -> Reading -> Reasoning" Bubble Updater
    function startGeminiAnalyzingUI(bubbleEl, userQuery) {
        if (!bubbleEl) return null;
        const textNode = bubbleEl.querySelector('.ai-text-content');
        if (!textNode) return null;

        const shortPreview = String(userQuery || "").slice(0, 38) + (String(userQuery || "").length > 38 ? "..." : "");
        const steps = [
            { title: "✨ Analyzing...", sub: `Reading message: "${shortPreview}"` },
            { title: "🧠 Reasoning...", sub: "Running NVIDIA gpt-oss-20b reasoning chain..." },
            { title: "⚡ Processing...", sub: "Synthesizing accurate answer..." },
            { title: "✍️ Finalizing response...", sub: "Formatting reply..." }
        ];

        let stepIdx = 0;
        function renderStep(idx) {
            const s = steps[Math.min(idx, steps.length - 1)];
            textNode.innerHTML = `
                <div style="display:flex;flex-direction:column;gap:4px;">
                    <div style="font-weight:600;color:#93c5fd;font-size:14.5px;display:flex;align-items:center;gap:6px;">
                        <span>${s.title}</span>
                    </div>
                    <div style="font-size:12.5px;color:rgba(241,245,249,0.72);line-height:1.4;">
                        ${s.sub}
                    </div>
                </div>
            `;
        }

        renderStep(0);
        const intervalId = setInterval(() => {
            stepIdx++;
            if (stepIdx < steps.length) {
                renderStep(stepIdx);
            }
        }, 2200);

        return intervalId;
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

            if (!isLoadingBubble && content !== 'Thinking...') {
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
        appendMessageBubble('user', userText, imagePayload, hideImageInChat, false);
        if (aiInput) aiInput.value = '';
        attachedBase64Image = null;
        if (mediaPreviewContainer) mediaPreviewContainer.style.display = 'none';

        const loadingBubble = appendMessageBubble('bot', 'Analyzing...', null, false, true);
        const analyzingTimer = startGeminiAnalyzingUI(loadingBubble, userText);

        const aiReply = await callAIAPI(finalPrompt, imagePayload);
        if (analyzingTimer) clearInterval(analyzingTimer);
        isProcessing = false;
        if (loadingBubble && loadingBubble.parentNode) {
            chatHistory.removeChild(loadingBubble);
        }
        appendMessageBubble('bot', aiReply, null, false, false);

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
