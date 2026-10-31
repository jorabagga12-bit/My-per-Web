function closeMobileNav() {
    document.getElementById('mobileNavOverlay').classList.remove('open');
}

// =====================================================
// DIRECT .env LOADER (ZERO HARDCODING - WORKS ON GITHUB PAGES & SERVERS)
// =====================================================
const ENV_CONFIG = {
    API_KEY: "",
    API_ENDPOINT: "",
    AI_MODEL: "",
    VISION_MODEL: "",
    ADMIN_USER: "",
    ADMIN_PASS: ""
};

function parseEnvContent(rawText) {
    if (!rawText) return false;
    let text = rawText.replace(/^\uFEFF/, '').trim();
    if (!text || text.startsWith('<!DOCTYPE') || text.startsWith('<html')) return false;

    // अगर GitHub API या बैकएंड से JSON आता है
    if (text.startsWith('{')) {
        try {
            const json = JSON.parse(text);
            // GitHub Contents API Base64 .env डिकोडर
            if (json.content && json.encoding === 'base64') {
                text = atob(json.content.replace(/\s/g, ''));
            } else {
                Object.keys(json).forEach(k => {
                    if (json[k] !== undefined && json[k] !== null) {
                        ENV_CONFIG[k.trim()] = String(json[k]).trim();
                    }
                });
                if (ENV_CONFIG.API_KEY) return true;
            }
        } catch (e) {}
    }

    // सीधा .env (KEY=VALUE) पार्सर
    text.split(/\r?\n/).forEach(line => {
        let trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        if (trimmed.startsWith('export ')) trimmed = trimmed.slice(7).trim();
        if (!trimmed.includes('=')) return;
        const idx = trimmed.indexOf('=');
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (key && val) ENV_CONFIG[key] = val;
    });

    return Boolean(ENV_CONFIG.API_KEY && ENV_CONFIG.API_ENDPOINT);
}

function getEnvCandidateUrls() {
    const urls = [
        '.env',
        './.env',
        `./.env?v=${Date.now()}`,
        'env',
        '.env.txt'
    ];

    // अगर वेबसाइट GitHub Pages (*.github.io) पर है तो सीधे रिपॉजिटरी की .env से कनेक्ट करें
    const host = window.location.hostname;
    const pathParts = window.location.pathname.split('/').filter(Boolean);

    if (host.endsWith('.github.io')) {
        const owner = host.replace('.github.io', '');
        const repo = (pathParts.length > 0 && !pathParts[0].includes('.')) ? pathParts[0] : `${owner}.github.io`;
        const subDirs = pathParts.slice(1).filter(p => !p.includes('.')).join('/');
        const relEnv = subDirs ? `${subDirs}/.env` : '.env';

        urls.push(
            `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${relEnv}`,
            `https://raw.githubusercontent.com/${owner}/${repo}/main/${relEnv}`,
            `https://raw.githubusercontent.com/${owner}/${repo}/master/${relEnv}`,
            `https://raw.githubusercontent.com/${owner}/${repo}/gh-pages/${relEnv}`,
            `https://api.github.com/repos/${owner}/${repo}/contents/${relEnv}`,
            `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/.env`,
            `https://api.github.com/repos/${owner}/${repo}/contents/.env`
        );
    }

    return urls;
}

async function loadEnvConfig() {
    if (ENV_CONFIG.API_KEY && ENV_CONFIG.API_ENDPOINT) return true;

    const candidateUrls = getEnvCandidateUrls();
    for (const url of candidateUrls) {
        try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) continue;
            const text = await res.text();
            if (parseEnvContent(text)) {
                return true;
            }
        } catch (e) {
            // अगला पाथ चेक करें
        }
    }
    return false;
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadEnvConfig();

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
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2500);
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

    // Secret Login & Admin (Strictly Connected to .env)
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

    submitLogin.addEventListener('click', async () => {
        if (!ENV_CONFIG.ADMIN_USER || !ENV_CONFIG.ADMIN_PASS) {
            await loadEnvConfig();
        }
        const user = document.getElementById('loginUser').value.trim();
        const pass = document.getElementById('loginPass').value.trim();
        if (ENV_CONFIG.ADMIN_USER && user === ENV_CONFIG.ADMIN_USER && pass === ENV_CONFIG.ADMIN_PASS) {
            showToast("Admin Verified. Unlocking Panel...", "success");
            setTimeout(() => { loginModal.style.display = 'none'; mainWebsite.style.display = 'none'; adminDashboard.style.display = 'flex'; loadAdminMessages(); }, 1000);
        } else {
            showToast("Invalid User or Password!", "error");
        }
    });

    logoutBtn.addEventListener('click', () => { adminDashboard.style.display = 'none'; mainWebsite.style.display = 'block'; showToast("Logged out successfully.", "success"); window.scrollTo(0,0); });

    /* ========================================================
       AI CHAT ENGINE, GALLERY PHOTO, CAMERA & SCREEN SHARE
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

    let attachedBase64Image = null;
    let currentLiveStream = null;
    let lastUserPrompt = "";
    let isLiveModeActive = false;
    let isMicMuted = false;
    let isAISpeaking = false;
    let isProcessing = false;
    let currentFacingMode = "environment";
    let isCameraVisible = false;
    let isScreenSharing = false;

    btnGalleryPlus.addEventListener('click', (e) => {
        e.stopPropagation();
        plusMenu.style.display = (plusMenu.style.display === 'flex') ? 'none' : 'flex';
    });
    document.addEventListener('click', () => { plusMenu.style.display = 'none'; });

    document.getElementById('opt-camera').addEventListener('click', (e) => {
        e.stopPropagation();
        plusMenu.style.display = 'none';
        triggerCamera();
    });
    document.getElementById('opt-gallery').addEventListener('click', (e) => {
        e.stopPropagation();
        plusMenu.style.display = 'none';
        inputFileGallery.click();
    });
    document.getElementById('opt-screenshare').addEventListener('click', (e) => {
        e.stopPropagation();
        plusMenu.style.display = 'none';
        triggerScreenShare();
    });

    function compressGalleryImage(dataUrl, callback) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.getElementById('capture-canvas');
            const MAX_SIZE = 1024;
            let width = img.width;
            let height = img.height;
            if (width > height && width > MAX_SIZE) {
                height = Math.round(height * (MAX_SIZE / width));
                width = MAX_SIZE;
            } else if (height > MAX_SIZE) {
                width = Math.round(width * (MAX_SIZE / height));
                height = MAX_SIZE;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/jpeg', 0.84));
        };
        img.src = dataUrl;
    }

    function handleFileSelect(file) {
        if (!file) return;
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                compressGalleryImage(evt.target.result, (compressedDataUrl) => {
                    attachedBase64Image = compressedDataUrl;
                    previewImg.src = attachedBase64Image;
                    previewLabel.innerText = file.name;
                    mediaPreviewContainer.style.display = 'flex';
                });
            };
            reader.readAsDataURL(file);
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

    function getCurrentVideoFrame() {
        if (currentLiveStream && videoElement && videoElement.srcObject) {
            if (videoElement.readyState >= 2) {
                const canvas = document.getElementById('capture-canvas');
                const MAX_WIDTH = 1024;
                let width = videoElement.videoWidth || 800;
                let height = videoElement.videoHeight || 600;
                if (width > MAX_WIDTH) { height = Math.round(height * (MAX_WIDTH / width)); width = MAX_WIDTH; }
                canvas.width = width; canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (currentFacingMode === "user" && !isScreenSharing) {
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                }
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                return canvas.toDataURL('image/jpeg', 0.82);
            }
        }
        return null;
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
            if (isCameraVisible || isLiveModeActive) { currentFrame = getCurrentVideoFrame() || attachedBase64Image; }
            let hideImg = (isLiveModeActive || isCameraVisible) && !attachedBase64Image;
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
        if (currentLiveStream) { currentLiveStream.getTracks().forEach(track => track.stop()); currentLiveStream = null; }
        videoElement.srcObject = null;
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

    async function triggerCamera() {
        try {
            if (currentLiveStream) currentLiveStream.getTracks().forEach(track => track.stop());
            currentLiveStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: currentFacingMode }, audio: false });
            isScreenSharing = false;
            videoElement.srcObject = currentLiveStream;
            videoElement.style.objectFit = "cover";
            videoElement.style.transform = currentFacingMode === "user" ? "scaleX(-1)" : "scaleX(1)";
            await videoElement.play().catch(() => {});
            liveCameraContainer.style.display = 'block';
            switchCameraBtn.style.display = 'flex';
            isCameraVisible = true;
            golaCamBtn.classList.add('active-feature');
            golaScreenBtn.classList.remove('active-feature');

            setTimeout(() => {
                const frame = getCurrentVideoFrame();
                if (frame) {
                    processPrompt("Look at this live camera view and tell me what you see.", frame, true, true);
                }
            }, 900);
        } catch (err) {
            inputFileCamera.click();
        }
    }

    // FIXED SCREEN SHARE: Gallery disabled, directly shares Window / Tab / Screen
    async function triggerScreenShare() {
        const displayMediaFn = (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)
            ? navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices)
            : (navigator.getDisplayMedia ? navigator.getDisplayMedia.bind(navigator) : null);

        if (!displayMediaFn) {
            showToast("Screen sharing is not supported on this browser.", "error");
            return;
        }

        try {
            const screenStream = await displayMediaFn({
                video: { cursor: "always" },
                audio: false
            });

            if (currentLiveStream) {
                currentLiveStream.getTracks().forEach(track => track.stop());
            }

            currentLiveStream = screenStream;
            isScreenSharing = true;
            videoElement.srcObject = currentLiveStream;
            videoElement.style.objectFit = "contain";
            videoElement.style.transform = "scaleX(1)";
            liveCameraContainer.style.display = 'block';
            switchCameraBtn.style.display = 'none';
            isCameraVisible = true;
            golaScreenBtn.classList.add('active-feature');
            golaCamBtn.classList.remove('active-feature');

            await videoElement.play().catch(() => {});
            showToast("Screen sharing active!", "success");

            setTimeout(() => {
                const frame = getCurrentVideoFrame();
                if (frame) {
                    processPrompt("Analyze my shared screen and explain what is shown on it.", frame, true, true);
                }
            }, 1000);

            const videoTrack = currentLiveStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.onended = () => {
                    closeCameraUI();
                    showToast("Screen sharing stopped.", "success");
                };
            }
        } catch (err) {
            if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
                showToast("Screen share error: " + (err.message || "Permission denied"), "error");
            }
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
       API ENGINE (READS STRICTLY FROM .env CONFIG)
       ======================================================== */
    async function sendModelRequest(endpoint, apiKey, modelName, messages) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelName,
                messages: messages,
                max_tokens: 1024,
                temperature: 0.5
            })
        });
        const data = await response.json();
        return { response, data };
    }

    async function callAIAPI(promptText, base64Img = null) {
        if (!ENV_CONFIG.API_KEY || !ENV_CONFIG.API_ENDPOINT) {
            await loadEnvConfig();
        }

        const apiKey = (ENV_CONFIG.API_KEY || "").trim();
        const endpoint = (ENV_CONFIG.API_ENDPOINT || "").trim();
        const primaryModel = base64Img
            ? (ENV_CONFIG.VISION_MODEL || ENV_CONFIG.AI_MODEL).trim()
            : (ENV_CONFIG.AI_MODEL || "").trim();

        if (!apiKey || !endpoint) {
            throw new Error(".env फाइल आपके रिपॉजिटरी में नहीं मिली। कृपया सुनिश्चित करें कि .env फाइल GitHub रिपॉजिटरी में अपलोड है।");
        }

        let messages = [];
        if (base64Img) {
            messages = [
                {
                    role: "user",
                    content: [
                        { type: "text", text: promptText },
                        { type: "image_url", image_url: { url: base64Img } }
                    ]
                }
            ];
        } else {
            messages = [
                { role: "system", content: "You are Mani AI, created by Money Bagga." },
                { role: "user", content: promptText }
            ];
        }

        try {
            let { response, data } = await sendModelRequest(endpoint, apiKey, primaryModel, messages);

            if ((!response.ok || data.error) && base64Img && ENV_CONFIG.AI_MODEL && primaryModel !== ENV_CONFIG.AI_MODEL) {
                const retry = await sendModelRequest(endpoint, apiKey, ENV_CONFIG.AI_MODEL.trim(), messages);
                response = retry.response;
                data = retry.data;
            }

            if (data && data.error) {
                throw new Error(typeof data.error === 'string' ? data.error : (data.error.message || "API Error"));
            }
            if (response.ok && data && data.choices && data.choices.length > 0) {
                return data.choices[0].message.content;
            }
            if (data && (data.reply || data.response || data.content)) {
                return data.reply || data.response || data.content;
            }
            throw new Error(`API Error (Status ${response.status})`);
        } catch (e) {
            console.error("API Fetch Error:", e);
            throw new Error(e.message || "Unable to generate response. Check your .env or backend server.");
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
            btnRefresh.addEventListener('click', () => { if (lastUserPrompt) { let frame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null); processPrompt(lastUserPrompt, frame, false, isLiveModeActive && !attachedBase64Image); } });

            actionBar.appendChild(btnSpeak); actionBar.appendChild(btnCopy); actionBar.appendChild(btnShare); actionBar.appendChild(btnRefresh);
            msgWrapper.appendChild(actionBar);
        }
        chatHistory.appendChild(msgWrapper);
        chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' });
        return msgWrapper;
    }

    async function processPrompt(promptText, imagePayload, autoSpeak = false, hideImageInChat = false) {
        let finalPrompt = promptText ? promptText.trim() : "";
        if (!finalPrompt && imagePayload) { finalPrompt = "Analyze this image/screen in detail and explain what you see."; }
        else if (!finalPrompt) { return; }

        isProcessing = true;
        lastUserPrompt = finalPrompt;
        appendMessageBubble('user', finalPrompt, imagePayload, hideImageInChat);
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
        let hideImg = !attachedBase64Image && !!currentFrame;
        processPrompt(aiInput.value, currentFrame, isLiveModeActive || isCameraVisible, hideImg);
    });

    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            let currentFrame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null);
            let hideImg = !attachedBase64Image && !!currentFrame;
            processPrompt(aiInput.value, currentFrame, isLiveModeActive || isCameraVisible, hideImg);
        }
    });

});
