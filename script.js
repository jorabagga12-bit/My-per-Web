function closeMobileNav() {
    const nav = document.getElementById('mobileNavOverlay');
    if (nav) nav.classList.remove('open');
}

// =====================================================
// 0. SAFE .env CONFIG (LOCKED & ERROR-FREE)
// =====================================================
const ENV_CONFIG = {
    API_KEY: "sk-mani-7a6ff50cf7faca43",
    API_ENDPOINT: "https://ai-1-ak1q.onrender.com/v1/chat/completions",
    AI_MODEL: "mani-core-v1.2",
    VISION_MODEL: "meta/llama-3.2-90b-vision-instruct",
    ADMIN_USER: "bagga",
    ADMIN_PASS: "iphonex0421&"
};

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
        if (key === "API_KEY" && !val.startsWith("sk-mani-")) return;
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
        // Silent fallback: ENV_CONFIG already holds valid credentials
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadEnvConfig();

    // =====================================================
    // UNIVERSE STARS CANVAS ANIMATION (Brahmand Effect)
    // =====================================================
    const starsCanvas = document.getElementById('stars-canvas');
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

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');
    if (mobileMenuBtn) { mobileMenuBtn.addEventListener('click', () => { mobileNavOverlay.classList.add('open'); }); }
    if (mobileNavClose) { mobileNavClose.addEventListener('click', () => { mobileNavOverlay.classList.remove('open'); }); }

    // SCROLL REVEAL
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                entry.target.classList.add("seen");
            } else {
                entry.target.classList.remove("active");
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
                card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0deg) scale(1)`; });
        });
    }

    // FAQ Accordion
    const faqs = document.querySelectorAll('.faq-item');
    faqs.forEach(faq => {
        faq.addEventListener('click', () => {
            const isActive = faq.classList.contains('active');
            faqs.forEach(f => { f.classList.remove('active'); f.querySelector('.faq-icon').innerText = '+'; });
            if (!isActive) { faq.classList.add('active'); faq.querySelector('.faq-icon').innerText = '×'; }
        });
    });

    // Toast
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        container.innerHTML = '';
        const toast = document.createElement('div');
        toast.className = `iphone-glass toast-msg ${type}`;
        const icon = type === 'success' ? '✔ ' : '✖ ';
        toast.innerHTML = icon + message;
        container.appendChild(toast);
        setTimeout(() => { toast.classList.add('show'); }, 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2000);
    }

    // Contact Form
    const contactForm = document.getElementById('leadContactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('leadName').value;
        const email = document.getElementById('leadEmail').value;
        const company = document.getElementById('leadCompany').value;
        const date = new Date().toLocaleString();
        let messages = JSON.parse(localStorage.getItem('maniLeads') || '[]');
        messages.push({ name, email, company, date });
        localStorage.setItem('maniLeads', JSON.stringify(messages));
        showToast("Request Sent Successfully!", "success");
        contactForm.reset();
    });

    // Secret Login & Admin
    const loginTrigger = document.getElementById('secretLoginTrigger');
    const loginModal = document.getElementById('secretLoginModal');
    const closeLogin = document.getElementById('closeLoginModal');
    const submitLogin = document.getElementById('loginSubmitBtn');
    const mainWebsite = document.getElementById('mainWebsite');
    const adminDashboard = document.getElementById('adminDashboard');
    const logoutBtn = document.getElementById('logoutBtn');

    loginTrigger.addEventListener('click', (e) => { e.preventDefault(); loginModal.style.display = 'flex'; document.getElementById('loginUser').value = ''; document.getElementById('loginPass').value = ''; });
    closeLogin.addEventListener('click', () => { loginModal.style.display = 'none'; });

    function loadAdminMessages() {
        const grid = document.getElementById('adminMessagesGrid');
        grid.innerHTML = '';
        const messages = JSON.parse(localStorage.getItem('maniLeads') || '[]');
        if (messages.length === 0) { grid.innerHTML = '<div class="empty-inbox">No new messages yet. Client requests will appear here.</div>'; return; }
        messages.slice().reverse().forEach(msg => {
            const card = document.createElement('div');
            card.className = 'iphone-glass client-msg-card';
            card.innerHTML = `<h4>${msg.name}</h4><div class="email">${msg.email}</div><div class="company"><strong>Company:</strong> ${msg.company}</div><div class="date">${msg.date}</div>`;
            grid.appendChild(card);
        });
    }

    submitLogin.addEventListener('click', () => {
        const user = document.getElementById('loginUser').value.trim();
        const pass = document.getElementById('loginPass').value.trim();
        if (user === ENV_CONFIG.ADMIN_USER && pass === ENV_CONFIG.ADMIN_PASS) {
            showToast("Admin Verified. Unlocking Panel...", "success");
            setTimeout(() => { loginModal.style.display = 'none'; mainWebsite.style.display = 'none'; adminDashboard.style.display = 'flex'; loadAdminMessages(); }, 1000);
        } else { showToast("Invalid User or Password!", "error"); }
    });

    logoutBtn.addEventListener('click', () => { adminDashboard.style.display = 'none'; mainWebsite.style.display = 'block'; showToast("Logged out successfully.", "success"); window.scrollTo(0,0); });

    /* ========================================================
       AI CHAT ENGINE, GALLERY PHOTO/VIDEO, CAMERA & SCREEN SHARE
       ======================================================== */
    const aiInput = document.getElementById('ai-chat-input');
    const sendAiBtn = document.getElementById('send-ai-btn');
    const chatHistory = document.getElementById('ai-chat-history');
    const chatBoxWrapper = document.getElementById('chat-box-wrapper');
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

    // Allow both Photos and Videos from Gallery without touching index.html
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

    btnGalleryPlus.addEventListener('click', (e) => { e.stopPropagation(); plusMenu.style.display = (plusMenu.style.display === 'flex') ? 'none' : 'flex'; });
    document.addEventListener('click', () => { plusMenu.style.display = 'none'; });

    document.getElementById('opt-camera').addEventListener('click', () => { plusMenu.style.display = 'none'; triggerCamera(); });
    document.getElementById('opt-gallery').addEventListener('click', () => { plusMenu.style.display = 'none'; inputFileGallery.click(); });
    document.getElementById('opt-screenshare').addEventListener('click', () => { plusMenu.style.display = 'none'; triggerScreenShare(); });

    // Smart Image Optimizer: Guarantees Base64 is under NVIDIA Vision's 180KB limit so it NEVER crashes
    function encodeSourceToSafeBase64(sourceEl, sourceWidth, sourceHeight, mirror = false) {
        try {
            const canvas = document.getElementById('capture-canvas');
            const ctx = canvas.getContext('2d');
            const attempts = [
                { maxDim: 720, quality: 0.76 },
                { maxDim: 600, quality: 0.70 },
                { maxDim: 480, quality: 0.65 }
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
                if (dataUrl && dataUrl.startsWith('data:image/jpeg;base64,') && dataUrl.length > 500 && dataUrl.length < 165000) {
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

    // Extract clear frame from uploaded Video file for AI Video Analysis
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

    inputFileCamera.addEventListener('change', (e) => handleFileSelect(e.target.files[0]));
    inputFileGallery.addEventListener('change', (e) => handleFileSelect(e.target.files[0]));

    let availableVoices = [];
    function loadVoices() { if ('speechSynthesis' in window) { availableVoices = window.speechSynthesis.getVoices(); } }
    loadVoices();
    if ('speechSynthesis' in window) { window.speechSynthesis.onvoiceschanged = loadVoices; }

    function speakText(text, onEndCallback = null) {
        if (!('speechSynthesis' in window)) { if(onEndCallback) onEndCallback(); return; }
        window.speechSynthesis.cancel();
        isAISpeaking = true;
        try { if (recognition) recognition.stop(); } catch(e) {}

        const cleanText = text.replace(/[*#_`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        const hasHindiChars = /[\u0900-\u097F]/.test(cleanText);
        const isHinglish = /\b(hai|kya|main|mera|karta|ho|gaya|kar|raha|hu|hain|bhai|nahi|yeh|woh|dikho|dekh)\b/i.test(cleanText);
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

    // Silently captures current Camera or Screen Share frame in the background
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
            btnMic.style.color = '#d1d5db';
            let currentFrame = attachedBase64Image;
            if (isCameraVisible) {
                currentFrame = getCurrentVideoFrame() || attachedBase64Image;
            }
            // Keep camera/screen frame hidden in background (never post image thumbnail in chat)
            let hideImg = isCameraVisible && !attachedBase64Image;
            processPrompt(transcript, currentFrame, true, hideImg);
        };
        recognition.onerror = () => {
            btnMic.style.color = '#d1d5db';
            if (isLiveModeActive && !isMicMuted && !isAISpeaking && !isProcessing) {
                setTimeout(startLiveVoiceCycle, 800);
            }
        };
        recognition.onend = () => {
            btnMic.style.color = '#d1d5db';
            if (isLiveModeActive && !isMicMuted && !isAISpeaking && !isProcessing) {
                setTimeout(startLiveVoiceCycle, 400);
            }
        };
    }

    function startLiveVoiceCycle() {
        if (!isLiveModeActive || !recognition || isMicMuted || isAISpeaking || isProcessing) return;
        try { recognition.start(); } catch(e) {}
    }

    function stopLiveMode() {
        isLiveModeActive = false;
        isAISpeaking = false;
        isProcessing = false;
        liveToggleBtn.classList.remove('active-live');
        liveOrbUI.style.display = 'none';
        closeCameraUI();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (recognition) { try { recognition.stop(); } catch(e){} }
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

    golaCamBtn.addEventListener('click', () => {
        if (isCameraVisible && !isScreenSharing) {
            closeCameraUI();
        } else {
            triggerCamera();
        }
    });

    golaScreenBtn.addEventListener('click', () => {
        if (isScreenSharing) {
            closeCameraUI();
        } else {
            triggerScreenShare();
        }
    });

    golaCloseBtn.addEventListener('click', stopLiveMode);

    golaMicBtn.addEventListener('click', () => {
        isMicMuted = !isMicMuted;
        if(isMicMuted) { golaMicBtn.classList.add('muted'); try { recognition.stop(); } catch(e){} }
        else { golaMicBtn.classList.remove('muted'); startLiveVoiceCycle(); }
    });

    // FIXED CAMERA: Does NOT auto-click or spam chat on open; keeps frame silently in background
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

    // FIXED SCREEN SHARE: Keeps screen stream silently in background and analyzes whenever you ask
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
            showToast("Screen sharing is not supported on this browser.", "error");
        }
    }

    switchCameraBtn.addEventListener('click', () => { currentFacingMode = currentFacingMode === "user" ? "environment" : "user"; triggerCamera(); });
    closeCameraBtn.addEventListener('click', () => { closeCameraUI(); });

    chatHistory.addEventListener('scroll', () => {
        if (chatHistory.scrollTop + chatHistory.clientHeight < chatHistory.scrollHeight - 60) { scrollBtn.style.display = 'flex'; } else { scrollBtn.style.display = 'none'; }
    });
    scrollBtn.addEventListener('click', () => { chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' }); });

    removePreviewBtn.addEventListener('click', () => { attachedBase64Image = null; mediaPreviewContainer.style.display = 'none'; });

    btnMic.addEventListener('click', () => { if (recognition) { btnMic.style.color = '#ff4d4d'; try { recognition.start(); } catch(e){} } });

    /* ========================================================
       CRASH-PROOF API ENGINE (AUTO-FALLBACK FOR VISION & CHAT)
       ======================================================== */
    async function sendModelRequest(endpoint, apiKey, modelName, messages) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelName,
                messages: messages,
                max_tokens: 1024,
                temperature: 0.5
            })
        });

        const rawText = await response.text();
        let data = null;
        try {
            data = JSON.parse(rawText);
        } catch (err) {
            throw new Error(`Server busy (HTTP ${response.status})`);
        }

        if (data.error) {
            throw new Error(typeof data.error === 'string' ? data.error : (data.error.message || "API Error"));
        }

        if (response.ok && data.choices && data.choices.length > 0) {
            const reply = (data.choices[0].message?.content || "").trim();
            if (reply && !reply.startsWith("System Error:")) {
                return reply;
            }
            throw new Error(reply || "Empty model response");
        }
        throw new Error(`API Status ${response.status}`);
    }

    async function callAIAPI(promptText, base64Img = null) {
        const apiKey = ENV_CONFIG.API_KEY || "sk-mani-7a6ff50cf7faca43";
        const endpoint = ENV_CONFIG.API_ENDPOINT || "https://ai-1-ak1q.onrender.com/v1/chat/completions";

        if (base64Img && base64Img.startsWith("data:image/")) {
            const visionPrompt = `Look carefully at this image/camera view and answer accurately in the same language as the user: ${promptText}`;
            const visionMessages = [
                {
                    role: "user",
                    content: [
                        { type: "text", text: visionPrompt },
                        { type: "image_url", image_url: { url: base64Img } }
                    ]
                }
            ];

            // Try primary vision models in order so it never fails
            const visionModels = [
                ENV_CONFIG.VISION_MODEL || "meta/llama-3.2-90b-vision-instruct",
                "google/diffusiongemma-26b-a4b-it",
                "mani-vision-v3.2"
            ];

            let lastErr = null;
            for (const vModel of visionModels) {
                try {
                    return await sendModelRequest(endpoint, apiKey, vModel, visionMessages);
                } catch (err) {
                    lastErr = err;
                }
            }
            throw lastErr || new Error("Vision analysis failed");
        } else {
            const textMessages = [
                { role: "system", content: "You are Mani AI, created by Money Bagga. Reply naturally and accurately." },
                { role: "user", content: promptText }
            ];
            const textModels = [
                ENV_CONFIG.AI_MODEL || "mani-core-v1.2",
                "openai/gpt-oss-20b"
            ];

            let lastErr = null;
            for (const tModel of textModels) {
                try {
                    return await sendModelRequest(endpoint, apiKey, tModel, textMessages);
                } catch (err) {
                    lastErr = err;
                }
            }
            throw lastErr || new Error("Connection failed");
        }
    }

    function appendMessageBubble(sender, content, imageSrc = null, hideImage = false) {
        if (chatBoxWrapper) { chatBoxWrapper.classList.add('has-messages'); }
        const msgWrapper = document.createElement('div');
        msgWrapper.className = `iphone-glass chat-msg-bubble ${sender}`;
        msgWrapper.style.padding = '18px 22px'; msgWrapper.style.maxWidth = '85%'; msgWrapper.style.fontSize = '15px';
        msgWrapper.style.lineHeight = '1.6'; msgWrapper.style.borderRadius = '22px'; msgWrapper.style.margin = '4px 0';

        if (sender === 'user') {
            msgWrapper.style.alignSelf = 'flex-end'; msgWrapper.style.borderBottomRightRadius = '4px';
            msgWrapper.style.background = 'rgba(255,255,255,0.12)'; msgWrapper.style.color = '#fff';
            if (imageSrc && !hideImage) { const imgEl = document.createElement('img'); imgEl.src = imageSrc; imgEl.style.maxWidth = '200px'; imgEl.style.borderRadius = '12px'; imgEl.style.display = 'block'; imgEl.style.marginBottom = '10px'; msgWrapper.appendChild(imgEl); }
            const textNode = document.createElement('div'); textNode.innerText = content; msgWrapper.appendChild(textNode);
        } else {
            msgWrapper.style.alignSelf = 'flex-start'; msgWrapper.style.borderBottomLeftRadius = '4px';
            msgWrapper.style.background = 'rgba(255,255,255,0.06)'; msgWrapper.style.color = '#e2e8f0';
            const textNode = document.createElement('div'); textNode.className = 'ai-text-content'; textNode.style.whiteSpace = 'pre-wrap'; textNode.innerText = content; msgWrapper.appendChild(textNode);

            const actionBar = document.createElement('div'); actionBar.className = 'chat-action-bar';
            const btnSpeak = document.createElement('button'); btnSpeak.className = 'chat-action-btn'; btnSpeak.title = 'Listen'; btnSpeak.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
            btnSpeak.addEventListener('click', () => { speakText(content); });

            const btnCopy = document.createElement('button'); btnCopy.className = 'chat-action-btn'; btnCopy.title = 'Copy'; btnCopy.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
            btnCopy.addEventListener('click', () => { navigator.clipboard.writeText(content); showToast("Copied to clipboard!", "success"); });

            const btnShare = document.createElement('button'); btnShare.className = 'chat-action-btn'; btnShare.title = 'Share'; btnShare.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`;
            btnShare.addEventListener('click', () => { if (navigator.share) { navigator.share({ title: "Mani's AI Response", text: content }); } else { navigator.clipboard.writeText(content); showToast("Link copied to share", "success"); } });

            const btnRefresh = document.createElement('button'); btnRefresh.className = 'chat-action-btn'; btnRefresh.title = 'Regenerate'; btnRefresh.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`;
            btnRefresh.addEventListener('click', () => { if (lastUserPrompt) { let frame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null); processPrompt(lastUserPrompt, frame, false, isCameraVisible && !attachedBase64Image); } });

            actionBar.appendChild(btnSpeak); actionBar.appendChild(btnCopy); actionBar.appendChild(btnShare); actionBar.appendChild(btnRefresh);
            msgWrapper.appendChild(actionBar);
        }
        chatHistory.appendChild(msgWrapper);
        chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' });
        return msgWrapper;
    }

    async function processPrompt(promptText, imagePayload, autoSpeak = false, hideImageInChat = false) {
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
        aiInput.value = ''; attachedBase64Image = null; mediaPreviewContainer.style.display = 'none';
        const loadingBubble = appendMessageBubble('bot', 'Analyzing...');

        try {
            const aiReply = await callAIAPI(finalPrompt, imagePayload);
            isProcessing = false;
            if (loadingBubble.parentNode) { chatHistory.removeChild(loadingBubble); }
            appendMessageBubble('bot', aiReply);
            if (autoSpeak || isLiveModeActive || isCameraVisible) {
                speakText(aiReply, () => { if (isLiveModeActive && !isMicMuted) { setTimeout(startLiveVoiceCycle, 400); } });
            }
        } catch (err) {
            isProcessing = false;
            if (loadingBubble.parentNode) { chatHistory.removeChild(loadingBubble); }
            appendMessageBubble('bot', "Error: " + err.message);
            if (isLiveModeActive && !isMicMuted) { setTimeout(startLiveVoiceCycle, 1200); }
        }
    }

    document.getElementById('btn-clear').addEventListener('click', () => { chatHistory.innerHTML = ''; if (chatBoxWrapper) { chatBoxWrapper.classList.remove('has-messages'); } });

    sendAiBtn.addEventListener('click', () => {
        let currentFrame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null);
        // If using live camera or screen share, keep image hidden in background
        let hideImg = isCameraVisible && !attachedBase64Image;
        processPrompt(aiInput.value, currentFrame, isLiveModeActive || isCameraVisible, hideImg);
    });

    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            let currentFrame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null);
            let hideImg = isCameraVisible && !attachedBase64Image;
            processPrompt(aiInput.value, currentFrame, isLiveModeActive || isCameraVisible, hideImg);
        }
    });

});
