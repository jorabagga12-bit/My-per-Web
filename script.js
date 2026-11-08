// =========================================================================
// PDF — MANI DEVELOPER (manigamer.cv)
// 100% Hardcoded Client-Side 150-Page Image (JPG / PNG / WebP) to PDF Engine
// Zero API Keys • Up to 150 Pages at Once • Only Button Opens Gallery
// =========================================================================

function closeMobileNav() {
    const nav = document.getElementById('mobileNavOverlay');
    if (nav) nav.classList.remove('open');
}

// =========================================================================
// HARDCODED BINARY PDF 1.4 BUILDER (SUPPORTS UP TO 150 PAGES AT ONCE)
// Converts 1 to 150 Canvas JPEG DataURLs into a single multi-page .PDF file
// =========================================================================
function buildHardcodedPdfBlob(imagesList, pageSizeMode = 'a4', orientationMode = 'portrait') {
    const chunks = [];
    let byteOffset = 0;
    const encoder = new TextEncoder();

    function pushStr(str) {
        const bytes = encoder.encode(str);
        chunks.push(bytes);
        byteOffset += bytes.length;
    }

    function pushBytes(uint8) {
        chunks.push(uint8);
        byteOffset += uint8.length;
    }

    function base64ToUint8Array(dataUrl) {
        const base64 = dataUrl.split(',')[1] || '';
        const binStr = atob(base64);
        const len = binStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binStr.charCodeAt(i);
        }
        return bytes;
    }

    const numPages = imagesList.length;
    const totalObjects = 2 + numPages * 3;
    const offsets = new Array(totalObjects + 1).fill(0);

    // PDF 1.4 Header
    pushStr("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");

    // 1. Catalog Object
    offsets[1] = byteOffset;
    pushStr("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

    // 2. Pages Tree Object
    const kidsRefs = [];
    for (let i = 0; i < numPages; i++) {
        kidsRefs.push(`${3 + i * 3} 0 R`);
    }
    offsets[2] = byteOffset;
    pushStr(`2 0 obj\n<< /Type /Pages /Kids [ ${kidsRefs.join(' ')} ] /Count ${numPages} >>\nendobj\n`);

    // 3..N: Page, Content Stream, and JPEG XObject for each uploaded photo (1..150)
    for (let i = 0; i < numPages; i++) {
        const item = imagesList[i];
        const pageObjId = 3 + i * 3;
        const contentObjId = 4 + i * 3;
        const imgObjId = 5 + i * 3;
        const imgName = `/Im${i + 1}`;

        const imgW = Math.max(1, item.width);
        const imgH = Math.max(1, item.height);

        let pageW = 595.28; // A4 Portrait Width (pt)
        let pageH = 841.89; // A4 Portrait Height (pt)
        let drawX = 0, drawY = 0, drawW = pageW, drawH = pageH;

        if (pageSizeMode === 'fit') {
            pageW = imgW * 0.75;
            pageH = imgH * 0.75;
            if (pageW < 200) {
                const s = 595.28 / pageW;
                pageW *= s;
                pageH *= s;
            }
            drawW = pageW;
            drawH = pageH;
        } else {
            if (orientationMode === 'landscape') {
                pageW = 841.89;
                pageH = 595.28;
            }
            const margin = 24;
            const availW = pageW - margin * 2;
            const availH = pageH - margin * 2;
            const scale = Math.min(availW / imgW, availH / imgH);
            drawW = +(imgW * scale).toFixed(2);
            drawH = +(imgH * scale).toFixed(2);
            drawX = +((pageW - drawW) / 2).toFixed(2);
            drawY = +((pageH - drawH) / 2).toFixed(2);
        }

        // Page Object
        offsets[pageObjId] = byteOffset;
        pushStr(
            `${pageObjId} 0 obj\n` +
            `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW.toFixed(2)} ${pageH.toFixed(2)}] ` +
            `/Resources << /XObject << ${imgName} ${imgObjId} 0 R >> >> ` +
            `/Contents ${contentObjId} 0 R >>\nendobj\n`
        );

        // Content Stream
        const streamCmd = `q\n${drawW.toFixed(2)} 0 0 ${drawH.toFixed(2)} ${drawX.toFixed(2)} ${drawY.toFixed(2)} cm\n${imgName} Do\nQ\n`;
        const streamBytes = encoder.encode(streamCmd);
        offsets[contentObjId] = byteOffset;
        pushStr(`${contentObjId} 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n`);
        pushBytes(streamBytes);
        pushStr("\nendstream\nendobj\n");

        // Image XObject
        const jpegBytes = base64ToUint8Array(item.jpegDataUrl);
        offsets[imgObjId] = byteOffset;
        pushStr(
            `${imgObjId} 0 obj\n` +
            `<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} ` +
            `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
        );
        pushBytes(jpegBytes);
        pushStr("\nendstream\nendobj\n");
    }

    // XREF Table
    const xrefStart = byteOffset;
    pushStr(`xref\n0 ${totalObjects + 1}\n`);
    pushStr("0000000000 65535 f \n");
    for (let id = 1; id <= totalObjects; id++) {
        const offStr = String(offsets[id]).padStart(10, '0');
        pushStr(`${offStr} 00000 n \n`);
    }

    // Trailer
    pushStr(
        `trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\n` +
        `startxref\n${xrefStart}\n%%EOF`
    );

    return new Blob(chunks, { type: "application/pdf" });
}

// =========================================================================
// MAIN DOM CONTROLLER & 150-PAGE BATCH WORKFLOW
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB Per Photo Limit
    const MAX_PAGES_LIMIT = 150;                 // Supports 100, 120, up to 150 Pages at Once
    let uploadedImages = [];
    let generatedPdfUrl = null;
    let generatedPdfFilename = "Mani-Developer-Document.pdf";

    // =====================================================================
    // SHOW NAVBAR ONLY WHEN SCROLLING DOWN (HIDDEN AT TOP)
    // =====================================================================
    const scrollNavbarWrapper = document.getElementById('scrollNavbarWrapper');
    function updateNavbarOnScroll() {
        if (!scrollNavbarWrapper) return;
        const currentScrollY = window.scrollY || window.pageYOffset || 0;
        if (currentScrollY > 40) {
            scrollNavbarWrapper.classList.remove('nav-hidden-top');
            scrollNavbarWrapper.classList.add('nav-visible-scroll');
        } else {
            scrollNavbarWrapper.classList.remove('nav-visible-scroll');
            scrollNavbarWrapper.classList.add('nav-hidden-top');
        }
    }
    updateNavbarOnScroll();
    window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });

    // Toast Helper (Zero Emoji)
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        container.innerHTML = '';
        const toast = document.createElement('div');
        toast.className = `iphone-glass expo-glass-effect toast-msg ${type}`;
        toast.textContent = (type === 'success' ? '[OK] ' : '[!] ') + message;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 350);
        }, 2500);
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');
    if (mobileMenuBtn && mobileNavOverlay) {
        mobileMenuBtn.addEventListener('click', () => mobileNavOverlay.classList.add('open'));
    }
    if (mobileNavClose && mobileNavOverlay) {
        mobileNavClose.addEventListener('click', () => mobileNavOverlay.classList.remove('open'));
    }

    // Active Navbar Link Highlight
    const navButtons = document.querySelectorAll('.nav-links .nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Animated Count-Up Starting from 1 (1 -> Target)
    const countElements = document.querySelectorAll('.count-up');
    if ('IntersectionObserver' in window && countElements.length > 0) {
        const countObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target') || '1', 10);
                const suffix = el.getAttribute('data-suffix') || '';
                let current = 1;
                el.textContent = `${current}${suffix}`;
                if (target > 1) {
                    const duration = 900;
                    const steps = target - 1;
                    const stepTime = Math.max(18, Math.floor(duration / steps));
                    const timer = setInterval(() => {
                        current += Math.max(1, Math.ceil((target - current) / 8));
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = `${current}${suffix}`;
                    }, stepTime);
                }
                obs.unobserve(el);
            });
        }, { threshold: 0.3 });
        countElements.forEach(el => countObserver.observe(el));
    }

    // Secret Login Modal
    const secretLoginTrigger = document.getElementById('secretLoginTrigger');
    const secretLoginModal = document.getElementById('secretLoginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    if (secretLoginTrigger && secretLoginModal) {
        secretLoginTrigger.addEventListener('dblclick', (e) => {
            e.preventDefault();
            secretLoginModal.style.display = 'flex';
        });
    }
    if (closeLoginModal && secretLoginModal) {
        closeLoginModal.addEventListener('click', () => {
            secretLoginModal.style.display = 'none';
        });
    }

    // Elements for Multi-Step 150-Page PDF Tool
    const fileInput = document.getElementById('pdf-file-input');
    const selectImagesBtn = document.getElementById('select-images-btn');
    const uploadDropzone = document.getElementById('upload-dropzone');
    const addMoreImagesBtn = document.getElementById('add-more-images-btn');
    const workspaceBackBtn = document.getElementById('workspace-back-btn');
    const convertToPdfBtn = document.getElementById('convert-to-pdf-btn');
    const previewGrid = document.getElementById('pdf-preview-grid');
    const imageCountBadge = document.getElementById('image-count-badge');
    const queueLimitIndicator = document.getElementById('queue-limit-indicator');
    const pageSizeSelect = document.getElementById('pdf-page-size');
    const orientationSelect = document.getElementById('pdf-orientation');

    const stepUpload = document.getElementById('pdf-step-upload');
    const stepWorkspace = document.getElementById('pdf-step-workspace');
    const stepLoading = document.getElementById('pdf-step-loading');
    const stepDone = document.getElementById('pdf-step-done');

    const downloadPdfAgainBtn = document.getElementById('download-pdf-again-btn');
    const doneBackBtn = document.getElementById('done-back-btn');
    const doneDeleteBtn = document.getElementById('done-delete-btn');
    const doneCopyLinkBtn = document.getElementById('done-copy-link-btn');

    function showStage(stageName) {
        if (stepUpload) stepUpload.style.display = stageName === 'upload' ? 'block' : 'none';
        if (stepWorkspace) stepWorkspace.style.display = stageName === 'workspace' ? 'block' : 'none';
        if (stepLoading) stepLoading.style.display = stageName === 'loading' ? 'block' : 'none';
        if (stepDone) stepDone.style.display = stageName === 'done' ? 'block' : 'none';
    }

    // Normalize ANY Image (JPG, PNG, WebP, GIF, BMP) onto a White Paper Canvas
    function normalizeImageFileToJpeg(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(file.name)) {
                return reject(new Error(`"${file.name}" is not a valid photo.`));
            }
            if (file.size > MAX_FILE_SIZE_BYTES) {
                return reject(new Error(`"${file.name}" exceeds the 5 MB limit.`));
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const maxDim = 1650;
                    let w = img.naturalWidth || img.width || 800;
                    let h = img.naturalHeight || img.height || 1000;
                    if (w > maxDim || h > maxDim) {
                        if (w > h) {
                            h = Math.round(h * (maxDim / w));
                            w = maxDim;
                        } else {
                            w = Math.round(w * (maxDim / h));
                            h = maxDim;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);

                    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.88);
                    resolve({
                        id: Date.now() + Math.random(),
                        name: file.name,
                        width: w,
                        height: h,
                        jpegDataUrl: jpegDataUrl
                    });
                };
                img.onerror = () => reject(new Error(`Could not read image "${file.name}".`));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error("File read error."));
            reader.readAsDataURL(file);
        });
    }

    // Render Uploaded Cards with Sequential Numbering Starting from 1 (01..150)
    function renderWorkspaceCards() {
        if (!previewGrid) return;
        previewGrid.innerHTML = '';

        uploadedImages.forEach((item, index) => {
            const pageNum = index + 1;
            const paddedNum = String(pageNum).padStart(2, '0');

            const card = document.createElement('div');
            card.className = 'preview-paper-sheet';

            const numBadge = document.createElement('span');
            numBadge.className = 'sheet-page-num';
            numBadge.textContent = `Page ${paddedNum}`;

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-sheet-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.title = 'Remove Photo';
            removeBtn.addEventListener('click', () => {
                uploadedImages.splice(index, 1);
                if (uploadedImages.length === 0) {
                    showStage('upload');
                } else {
                    renderWorkspaceCards();
                }
            });

            const thumbFrame = document.createElement('div');
            thumbFrame.className = 'preview-thumb-frame';
            const imgEl = document.createElement('img');
            imgEl.src = item.jpegDataUrl;
            imgEl.alt = item.name;
            thumbFrame.appendChild(imgEl);

            const nameEl = document.createElement('div');
            nameEl.className = 'preview-file-name';
            nameEl.textContent = `${pageNum}. ${item.name}`;

            card.appendChild(numBadge);
            card.appendChild(removeBtn);
            card.appendChild(thumbFrame);
            card.appendChild(nameEl);
            previewGrid.appendChild(card);
        });

        const total = uploadedImages.length;
        if (imageCountBadge) {
            imageCountBadge.textContent = String(total);
        }
        if (queueLimitIndicator) {
            queueLimitIndicator.textContent = `${String(total).padStart(2, '0')} / ${MAX_PAGES_LIMIT} Pages Selected`;
        }
    }

    async function handleSelectedFiles(fileList) {
        if (!fileList || fileList.length === 0) return;
        let addedCount = 0;

        for (const file of Array.from(fileList)) {
            if (uploadedImages.length >= MAX_PAGES_LIMIT) {
                showToast(`Maximum ${MAX_PAGES_LIMIT} pages allowed in one PDF batch`, "error");
                break;
            }
            try {
                const normalized = await normalizeImageFileToJpeg(file);
                uploadedImages.push(normalized);
                addedCount++;
            } catch (err) {
                showToast(err.message || "Invalid photo", "error");
            }
        }

        if (fileInput) fileInput.value = '';

        if (uploadedImages.length > 0 && addedCount > 0) {
            renderWorkspaceCards();
            showStage('workspace');
            showToast(`${uploadedImages.length} / ${MAX_PAGES_LIMIT} page(s) ready to Convert PDF`, "success");
        }
    }

    // ONLY THE RED "CONVERT PDF" BUTTON OPENS THE GALLERY (Touching card does NOT open gallery!)
    if (selectImagesBtn && fileInput) {
        selectImagesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click();
        });
    }

    // Drag & Drop support on desktop (without click-to-open on box)
    if (uploadDropzone) {
        uploadDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadDropzone.classList.add('dragover');
        });
        uploadDropzone.addEventListener('dragleave', () => uploadDropzone.classList.remove('dragover'));
        uploadDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadDropzone.classList.remove('dragover');
            handleSelectedFiles(e.dataTransfer.files);
        });
    }

    if (addMoreImagesBtn && fileInput) {
        addMoreImagesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (uploadedImages.length >= MAX_PAGES_LIMIT) {
                showToast(`${MAX_PAGES_LIMIT}-Page limit reached! Click Convert PDF now.`, "error");
                return;
            }
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => handleSelectedFiles(e.target.files));
    }

    if (workspaceBackBtn) {
        workspaceBackBtn.addEventListener('click', () => {
            uploadedImages = [];
            showStage('upload');
        });
    }

    function triggerBrowserDownload(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Convert PDF -> 1.5s Paper Loading Animation -> Auto-Download -> Done Screen
    if (convertToPdfBtn) {
        convertToPdfBtn.addEventListener('click', () => {
            if (uploadedImages.length === 0) {
                showToast("Please select at least 1 photo", "error");
                return;
            }

            showStage('loading');

            setTimeout(() => {
                try {
                    const pageSize = pageSizeSelect ? pageSizeSelect.value : 'a4';
                    const orientation = orientationSelect ? orientationSelect.value : 'portrait';
                    const pdfBlob = buildHardcodedPdfBlob(uploadedImages, pageSize, orientation);

                    if (generatedPdfUrl) URL.revokeObjectURL(generatedPdfUrl);
                    generatedPdfUrl = URL.createObjectURL(pdfBlob);

                    const baseName = uploadedImages[0].name.replace(/\.[^/.]+$/, "");
                    generatedPdfFilename = `${baseName}-Mani-PDF.pdf`;

                    showStage('done');
                    triggerBrowserDownload(generatedPdfUrl, generatedPdfFilename);
                    showToast(`${uploadedImages.length}-Page PDF Downloaded!`, "success");
                } catch (err) {
                    showStage('workspace');
                    showToast("Error generating PDF. Try another image.", "error");
                }
            }, 1500);
        });
    }

    if (downloadPdfAgainBtn) {
        downloadPdfAgainBtn.addEventListener('click', () => {
            if (generatedPdfUrl) {
                triggerBrowserDownload(generatedPdfUrl, generatedPdfFilename);
                showToast("Downloading PDF...", "success");
            }
        });
    }

    // Memory Wipe on Reset/Delete
    function resetConverter() {
        uploadedImages.forEach(item => { item.jpegDataUrl = ""; });
        uploadedImages = [];
        if (generatedPdfUrl) {
            URL.revokeObjectURL(generatedPdfUrl);
            generatedPdfUrl = null;
        }
        showStage('upload');
    }

    if (doneBackBtn) doneBackBtn.addEventListener('click', resetConverter);
    if (doneDeleteBtn) {
        doneDeleteBtn.addEventListener('click', () => {
            resetConverter();
            showToast("Session memory cleared!", "success");
        });
    }
    if (doneCopyLinkBtn) {
        doneCopyLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.origin + "/#create-pdf");
            showToast("PDF link copied", "success");
        });
    }

    // FAQ Toggle Boxes
    const faqs = document.querySelectorAll('.faq-item');
    faqs.forEach(faq => {
        faq.addEventListener('click', () => {
            const isActive = faq.classList.contains('active');
            faqs.forEach(f => {
                f.classList.remove('active');
                const icon = f.querySelector('.faq-icon');
                if (icon) icon.textContent = '+';
            });
            if (!isActive) {
                faq.classList.add('active');
                const icon = faq.querySelector('.faq-icon');
                if (icon) icon.textContent = '×';
            }
        });
    });

    // Contact Form
    const contactForm = document.getElementById('leadContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("Request Sent Successfully", "success");
            contactForm.reset();
        });
    }
});
