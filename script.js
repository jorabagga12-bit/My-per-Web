// Mobile Navigation Close Helper
function closeMobileNav() {
    const nav = document.getElementById('mobileNavOverlay');
    if (nav) nav.classList.remove('open');
}

// =====================================================
// 0. ENV CONFIGURATION LOADER (WITH AUTOMATIC FALLBACK)
// =====================================================
const ENV_CONFIG = {
    API_KEY: "sk-mani-61c508a71769d42a",
    API_ENDPOINT: "https://ai-1-ak1q.onrender.com/v1/chat/completions",
    AI_MODEL: "openai/gpt-oss-20b",
    ADMIN_USER: "bagga",
    ADMIN_PASS: "iphonex0421&"
};

async function loadEnvFile() {
    try {
        const res = await fetch('.env', { cache: 'no-store' });
        if (!res.ok) return;
        const text = await res.text();
        text.split(/\r?\n/).forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return;
            const [key, ...rest] = trimmed.split('=');
            const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
            if (key && val) {
                ENV_CONFIG[key.trim()] = val;
            }
        });
    } catch (err) {
        // Fallback values inside ENV_CONFIG are used automatically if static server blocks .env
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadEnvFile();

    // =====================================================
    // 1. UNIVERSE STARS CANVAS ANIMATION (LIGHTWEIGHT & FAST)
    // =====================================================
    const starsCanvas = document.getElementById('stars-canvas');
    if (starsCanvas) {
        const starsCtx = starsCanvas.getContext('2d');
        let stars = [];
        const isMobile = window.innerWidth <= 768;
        const STAR_COUNT = isMobile ? 80 : 160;

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
                baseX, baseY, x: baseX, y: baseY,
                radius: Math.random() * 1.3 + 0.3,
                opacity: Math.random() * 0.7 + 0.2,
                twinkleSpeed: (Math.random() * 0.012 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
                orbitRadius: Math.random() * 2.5 + 0.5,
                orbitAngle: Math.random() * Math.PI * 2,
                orbitSpeed: (Math.random() - 0.5) * 0.0025
            });
        }

        function drawStars() {
            starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
            for (let s of stars) {
                s.orbitAngle += s.orbitSpeed;
                s.x = s.baseX + Math.cos(s.orbitAngle) * s.orbitRadius;
                s.y = s.baseY + Math.sin(s.orbitAngle) * s.orbitRadius;
                s.opacity += s.twinkleSpeed;
                if (s.opacity >= 0.95 || s.opacity <= 0.15) s.twinkleSpeed *= -1;

                starsCtx.beginPath();
                starsCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                starsCtx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
                starsCtx.fill();
            }
            requestAnimationFrame(drawStars);
        }
        drawStars();
    }

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', () => mobileNavOverlay.classList.add('open'));
    if (mobileNavClose) mobileNavClose.addEventListener('click', () => mobileNavOverlay.classList.remove('open'));

    // Scroll Reveal
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active", "seen");
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal-up").forEach(el => scrollObserver.observe(el));

    // FAQ Accordion
    const faqs = document.querySelectorAll('.faq-item');
    faqs.forEach(faq => {
        faq.addEventListener('click', () => {
            const isActive = faq.classList.contains('active');
            faqs.forEach(f => { f.classList.remove('active'); f.querySelector('.faq-icon').innerText = '+'; });
            if (!isActive) { faq.classList.add('active'); faq.querySelector('.faq-icon').innerText = '×'; }
        });
    });

    // Toast Notification
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        container.innerHTML = '';
        const toast = document.createElement('div');
        toast.className = `iphone-glass toast-msg ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2200);
    }

    // Contact Form
    const contactForm = document.getElementById('leadContactForm');
    if (contactForm) {
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
    }

    // Admin Login (Connected to .env ADMIN_USER & ADMIN_PASS)
    const loginTrigger = document.getElementById('secretLoginTrigger');
    const loginModal = document.getElementById('secretLoginModal');
    const closeLogin = document.getElementById('closeLoginModal');
    const submitLogin = document.getElementById('loginSubmitBtn');
    const mainWebsite = document.getElementById('mainWebsite');
    const adminDashboard = document.getElementById('adminDashboard');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginTrigger) {
        loginTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
            document.getElementById('loginUser').value = '';
            document.getElementById('loginPass').value = '';
        });
    }
    if (closeLogin) closeLogin.addEventListener('click', () => loginModal.style.display = 'none');

    function loadAdminMessages() {
        const grid = document.getElementById('adminMessagesGrid');
        grid.innerHTML = '';
        const messages = JSON.parse(localStorage.getItem('maniLeads') || '[]');
        if (messages.length === 0) {
            grid.innerHTML = '<div class="empty-inbox">No new messages yet. Client requests will appear here.</div>';
            return;
        }
        messages.slice().reverse().forEach(msg => {
            const card = document.createElement('div');
            card.className = 'iphone-glass client-msg-card';
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

    // ========================================================
    // 2. AI CHAT ENGINE, LIVE BAR, CAMERA & SCREEN SHARE
    // ========================================================
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

    // New Live Bar Buttons (Matching 55636.jpg)
    const liveOrbUI = document.getElementById('live-orb-ui');
    const golaCamBtn = document.getElementById('gola-cam-btn');
    const golaScreenBtn = document.getElementById('gola-screen-btn');
    const golaMicBtn = document.getElementById('gola-mic-btn');
    const golaCloseBtn = document.getElementById('gola-close-btn');

    const liveCameraContainer = document.getElementById('live-camera-container');
    const switchCameraBtn = document.getElementById('switch-camera-btn');
    const closeCameraBtn = document.getElementById('close-camera-btn');
    const videoElement = document.getElementById('webcam-video');

    const btnGalleryPlus = document.getElementById('btn-gallery-plus');
    const plusMenu = document.getElementById('plus-popover-menu');
    const inputFileCamera = document.getElementById('input-file-camera');
    const inputFileGallery = document.getElementById('input-file-gallery');

    let attachedBase64Image = null;
    let attachedFileText = "";
    let currentLiveStream = null;
    let lastUserPrompt = "";
    let isLiveModeActive = false;
    let isMicMuted = false;
    let currentFacingMode = "environment";
    let isCameraVisible = false;
    let isScreenSharing = false;

    btnGalleryPlus.addEventListener('click', (e) => {
        e.stopPropagation();
        plusMenu.style.display = (plusMenu.style.display === 'flex') ? 'none' : 'flex';
    });
    document.addEventListener('click', () => { plusMenu.style.display = 'none'; });

    document.getElementById('opt-camera').addEventListener('click', () => { plusMenu.style.display = 'none'; triggerCamera(); });
    document.getElementById('opt-gallery').addEventListener('click', () => { plusMenu.style.display = 'none'; inputFileGallery.click(); });
    document.getElementById('opt-screenshare').addEventListener('click', () => { plusMenu.style.display = 'none'; triggerScreenShare(); });

    function compressImageDataUrl(dataUrl, callback) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.getElementById('capture-canvas');
            const MAX_DIM = 900;
            let w = img.width;
            let h = img.height;
            if (w > h && w > MAX_DIM) { h = Math.round(h * (MAX_DIM / w)); w = MAX_DIM; }
            else if (h > MAX_DIM) { w = Math.round(w * (MAX_DIM / h)); h = MAX_DIM; }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            callback(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.src = dataUrl;
    }

    function handleFileSelect(file) {
        if (!file) return;
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                compressImageDataUrl(evt.target.result, (compressedUri) => {
                    attachedBase64Image = compressedUri;
                    attachedFileText = "";
                    previewImg.style.display = 'block';
                    previewImg.src = attachedBase64Image;
                    previewLabel.innerText = file.name;
                    mediaPreviewContainer.style.display = 'flex';
                });
            };
            reader.readAsDataURL(file);
        } else {
            const reader = new FileReader();
            reader.onload = (evt) => {
                attachedBase64Image = null;
                attachedFileText = `\n\n[Attached File: ${file.name}]\n${String(evt.target.result || '').slice(0, 12000)}`;
                previewImg.style.display = 'none';
                previewLabel.innerText = "File: " + file.name;
                mediaPreviewContainer.style.display = 'flex';
            };
            reader.readAsText(file);
        }
    }

    inputFileCamera.addEventListener('change', (e) => handleFileSelect(e.target.files[0]));
    inputFileGallery.addEventListener('change', (e) => handleFileSelect(e.target.files[0]));

    removePreviewBtn.addEventListener('click', () => {
        attachedBase64Image = null;
        attachedFileText = "";
        mediaPreviewContainer.style.display = 'none';
    });

    // Speech Synthesis
    let availableVoices = [];
    function loadVoices() {
        if ('speechSynthesis' in window) availableVoices = window.speechSynthesis.getVoices();
    }
    loadVoices();
    if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;

    function speakText(text, onEndCallback = null) {
        if (!('speechSynthesis' in window)) { if (onEndCallback) onEndCallback(); return; }
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*#_`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        const hasHindiChars = /[\u0900-\u097F]/.test(cleanText);
        utterance.lang = hasHindiChars ? 'hi-IN' : 'en-IN';
        if (availableVoices.length === 0) loadVoices();
        if (availableVoices.length > 0) {
            const selectedVoice = availableVoices.find(v => v.lang === utterance.lang) || availableVoices.find(v => v.lang.startsWith('en'));
            if (selectedVoice) utterance.voice = selectedVoice;
        }
        utterance.onend = () => { if (onEndCallback) onEndCallback(); };
        utterance.onerror = () => { if (onEndCallback) onEndCallback(); };
        window.speechSynthesis.speak(utterance);
    }

    function getCurrentVideoFrame() {
        if (currentLiveStream && videoElement && videoElement.srcObject && videoElement.readyState >= 2) {
            const canvas = document.getElementById('capture-canvas');
            const MAX_WIDTH = 800;
            let width = videoElement.videoWidth || 640;
            let height = videoElement.videoHeight || 480;
            if (width > MAX_WIDTH) { height = Math.round(height * (MAX_WIDTH / width)); width = MAX_WIDTH; }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (currentFacingMode === "user" && !isScreenSharing) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg', 0.78);
        }
        return null;
    }

    // Speech Recognition
    let recognition = null;
    const btnMic = document.getElementById('btn-mic');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = (evt) => {
            if (isMicMuted) return;
            const transcript = evt.results[0][0].transcript;
            aiInput.value = transcript;
            btnMic.style.color = '#d1d5db';
            let currentFrame = attachedBase64Image || ((isCameraVisible || isLiveModeActive) ? getCurrentVideoFrame() : null);
            let hideImg = (isLiveModeActive || isCameraVisible) && !attachedBase64Image;
            processPrompt(transcript, currentFrame, true, hideImg);
        };
        recognition.onerror = () => {
            btnMic.style.color = '#d1d5db';
            if (isLiveModeActive && !isMicMuted) setTimeout(startLiveVoiceCycle, 1500);
        };
        recognition.onend = () => { btnMic.style.color = '#d1d5db'; };
    }

    function startLiveVoiceCycle() {
        if (!isLiveModeActive || !recognition || isMicMuted) return;
        try { recognition.start(); } catch (e) {}
    }

    function closeCameraUI() {
        if (currentLiveStream) {
            currentLiveStream.getTracks().forEach(track => track.stop());
            currentLiveStream = null;
        }
        liveCameraContainer.style.display = 'none';
        isCameraVisible = false;
        isScreenSharing = false;
        golaCamBtn.classList.remove('active-mode');
        golaScreenBtn.classList.remove('active-mode');
    }

    function stopLiveMode() {
        isLiveModeActive = false;
        liveToggleBtn.classList.remove('active-live');
        liveOrbUI.style.display = 'none';
        closeCameraUI();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (recognition) { try { recognition.stop(); } catch (e) {} }
    }

    // Toggle Live Bar (From Search Bar Live Button)
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

    // Live Bar Button 1: Camera Toggle
    golaCamBtn.addEventListener('click', () => {
        if (isCameraVisible && !isScreenSharing) {
            closeCameraUI();
        } else {
            triggerCamera();
        }
    });

    // Live Bar Button 2: Screen Share (Or File Upload fallback on mobile)
    golaScreenBtn.addEventListener('click', () => {
        if (isScreenSharing) {
            closeCameraUI();
        } else {
            triggerScreenShare();
        }
    });

    // Live Bar Button 4: Mic Mute/Unmute
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

    // Live Bar Button 5: Close Live Bar
    golaCloseBtn.addEventListener('click', stopLiveMode);

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
            golaCamBtn.classList.add('active-mode');
            golaScreenBtn.classList.remove('active-mode');
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
                golaScreenBtn.classList.add('active-mode');
                golaCamBtn.classList.remove('active-mode');
                currentLiveStream.getVideoTracks()[0].onended = () => closeCameraUI();
            } catch (err) {
                inputFileGallery.click();
            }
        } else {
            // Mobile fallback if browser doesn't support getDisplayMedia
            inputFileGallery.click();
        }
    }

    switchCameraBtn.addEventListener('click', () => {
        currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
        triggerCamera();
    });
    closeCameraBtn.addEventListener('click', closeCameraUI);

    chatHistory.addEventListener('scroll', () => {
        if (chatHistory.scrollTop + chatHistory.clientHeight < chatHistory.scrollHeight - 60) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    scrollBtn.addEventListener('click', () => chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' }));

    btnMic.addEventListener('click', () => {
        if (recognition) {
            btnMic.style.color = '#38bdf8';
            try { recognition.start(); } catch (e) {}
        }
    });

    // ========================================================
    // 3. BACKEND API CALL (CONNECTED TO .env & VISION READY)
    // ========================================================
    async function callAIAPI(promptText, base64Img = null) {
        const apiKey = ENV_CONFIG.API_KEY;
        const endpoint = ENV_CONFIG.API_ENDPOINT;
        const modelName = ENV_CONFIG.AI_MODEL || "openai/gpt-oss-20b";

        const messages = [
            { role: "system", content: "You are Mani AI, created by Money Bagga. Provide clear, helpful, and accurate answers." }
        ];

        if (base64Img) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: promptText },
                    { type: "image_url", image_url: { url: base64Img } }
                ]
            });
        } else {
            messages.push({ role: "user", content: promptText });
        }

        const requestBody = {
            model: modelName,
            messages: messages,
            max_tokens: 1536
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(typeof data.error === 'string' ? data.error : (data.error.message || "API Error"));
        }
        if (response.ok && data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        }
        throw new Error(`API Error (Status ${response.status})`);
    }

    function appendMessageBubble(sender, content, imageSrc = null, hideImage = false) {
        if (chatBoxWrapper) chatBoxWrapper.classList.add('has-messages');
        const msgWrapper = document.createElement('div');
        msgWrapper.className = `iphone-glass chat-msg-bubble ${sender}`;
        msgWrapper.style.padding = '16px 20px';
        msgWrapper.style.maxWidth = '85%';
        msgWrapper.style.fontSize = '15px';
        msgWrapper.style.lineHeight = '1.6';
        msgWrapper.style.borderRadius = '22px';
        msgWrapper.style.margin = '4px 0';

        if (sender === 'user') {
            msgWrapper.style.alignSelf = 'flex-end';
            msgWrapper.style.borderBottomRightRadius = '4px';
            msgWrapper.style.background = 'rgba(255,255,255,0.12)';
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
            msgWrapper.style.background = 'rgba(255,255,255,0.06)';
            msgWrapper.style.color = '#e2e8f0';
            const textNode = document.createElement('div');
            textNode.className = 'ai-text-content';
            textNode.style.whiteSpace = 'pre-wrap';
            textNode.innerText = content;
            msgWrapper.appendChild(textNode);

            const actionBar = document.createElement('div');
            actionBar.className = 'chat-action-bar';

            const btnSpeak = document.createElement('button');
            btnSpeak.className = 'chat-action-btn';
            btnSpeak.title = 'Listen';
            btnSpeak.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
            btnSpeak.addEventListener('click', () => speakText(content));

            const btnCopy = document.createElement('button');
            btnCopy.className = 'chat-action-btn';
            btnCopy.title = 'Copy';
            btnCopy.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
            btnCopy.addEventListener('click', () => {
                navigator.clipboard.writeText(content);
                showToast("Copied to clipboard!", "success");
            });

            const btnRefresh = document.createElement('button');
            btnRefresh.className = 'chat-action-btn';
            btnRefresh.title = 'Regenerate';
            btnRefresh.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`;
            btnRefresh.addEventListener('click', () => {
                if (lastUserPrompt) {
                    let frame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null);
                    processPrompt(lastUserPrompt, frame, false, isLiveModeActive && !attachedBase64Image);
                }
            });

            actionBar.appendChild(btnSpeak);
            actionBar.appendChild(btnCopy);
            actionBar.appendChild(btnRefresh);
            msgWrapper.appendChild(actionBar);
        }

        chatHistory.appendChild(msgWrapper);
        chatHistory.scrollTo({ top: chatHistory.scrollHeight, behavior: 'smooth' });
        return msgWrapper;
    }

    async function processPrompt(promptText, imagePayload, autoSpeak = false, hideImageInChat = false) {
        let finalPrompt = (promptText ? promptText.trim() : "") + attachedFileText;
        if (!finalPrompt && imagePayload) {
            finalPrompt = "Analyze this image/screen carefully and explain what is visible in detail.";
        } else if (!finalPrompt) {
            return;
        }

        lastUserPrompt = finalPrompt;
        appendMessageBubble('user', promptText || "Attached Media", imagePayload, hideImageInChat);
        aiInput.value = '';
        attachedBase64Image = null;
        attachedFileText = "";
        mediaPreviewContainer.style.display = 'none';

        const loadingBubble = appendMessageBubble('bot', 'Analyzing...');

        try {
            const aiReply = await callAIAPI(finalPrompt, imagePayload);
            if (loadingBubble.parentNode) chatHistory.removeChild(loadingBubble);
            appendMessageBubble('bot', aiReply);
            if (autoSpeak || isLiveModeActive || isCameraVisible) {
                speakText(aiReply, () => {
                    if (isLiveModeActive) setTimeout(startLiveVoiceCycle, 500);
                });
            }
        } catch (err) {
            if (loadingBubble.parentNode) chatHistory.removeChild(loadingBubble);
            appendMessageBubble('bot', "Error: " + err.message);
        }
    }

    document.getElementById('btn-clear').addEventListener('click', () => {
        chatHistory.innerHTML = '';
        if (chatBoxWrapper) chatBoxWrapper.classList.remove('has-messages');
    });

    sendAiBtn.addEventListener('click', () => {
        let currentFrame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null);
        let hideImg = !attachedBase64Image && !!currentFrame;
        processPrompt(aiInput.value, currentFrame, false, hideImg);
    });

    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            let currentFrame = attachedBase64Image || (isCameraVisible ? getCurrentVideoFrame() : null);
            let hideImg = !attachedBase64Image && !!currentFrame;
            processPrompt(aiInput.value, currentFrame, false, hideImg);
        }
    });
});
