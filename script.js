// =========================================================================
// CREATE PDF — POWERED BY MONEY (manigamer.cv)
// 100% Hardcoded Client-Side Image (JPG / PNG / WebP / Any Photo) to PDF Engine
// Zero API Keys • Zero Server Storage • Max 5 MB Per Photo • Auto-Download
// =========================================================================

function closeMobileNav() {
    const nav = document.getElementById('mobileNavOverlay');
    if (nav) nav.classList.remove('open');
}

// =========================================================================
// HARDCODED BINARY PDF 1.4 BUILDER (NO EXTERNAL LIBRARY REQUIRED)
// Converts 1 or more Canvas JPEG DataURLs into a real, multi-page .PDF file
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

    // Object ID layout:
    // 1: Catalog
    // 2: Pages
    // For each page i (0..N-1):
    //   Page Obj ID     = 3 + i * 3
    //   Content Obj ID  = 4 + i * 3
    //   Image XObj ID   = 5 + i * 3
    const numPages = imagesList.length;
    const totalObjects = 2 + numPages * 3;
    const offsets = new Array(totalObjects + 1).fill(0);

    // PDF Header (with binary comment)
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

    // 3..N: Page, Content Stream, and JPEG XObject for each uploaded photo
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

        // Content Stream (Draws Image onto Page)
        const streamCmd = `q\n${drawW.toFixed(2)} 0 0 ${drawH.toFixed(2)} ${drawX.toFixed(2)} ${drawY.toFixed(2)} cm\n${imgName} Do\nQ\n`;
        const streamBytes = encoder.encode(streamCmd);
        offsets[contentObjId] = byteOffset;
        pushStr(`${contentObjId} 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n`);
        pushBytes(streamBytes);
        pushStr("\nendstream\nendobj\n");

        // Image XObject (Baseline JPEG Stream)
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
// MAIN DOM CONTROLLER & UI WORKFLOW
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // Strict 5 MB Limit
    let uploadedImages = [];
    let generatedPdfUrl = null;
    let generatedPdfFilename = "Money-Bagga-Document.pdf";

    // Toast Helper
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        container.innerHTML = '';
        const toast = document.createElement('div');
        toast.className = `iphone-glass expo-glass-effect paper-card toast-msg ${type}`;
        toast.textContent = (type === 'success' ? '✓ ' : '⚠ ') + message;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 350);
        }, 2600);
    }

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');
    if (mobileMenuBtn && mobileNavOverlay) {
        mobileMenuBtn.addEventListener('click', () => mobileNavOverlay.classList.add('open'));
    }
    if (mobileNavClose && mobileNavOverlay) {
        mobileNavClose.addEventListener('click', () => mobileNavOverlay.classList.remove('open'));
    }

    // Elements for Multi-Step PDF Tool
    const fileInput = document.getElementById('pdf-file-input');
    const selectImagesBtn = document.getElementById('select-images-btn');
    const uploadDropzone = document.getElementById('upload-dropzone');
    const addMoreImagesBtn = document.getElementById('add-more-images-btn');
    const workspaceBackBtn = document.getElementById('workspace-back-btn');
    const convertToPdfBtn = document.getElementById('convert-to-pdf-btn');
    const previewGrid = document.getElementById('pdf-preview-grid');
    const imageCountBadge = document.getElementById('image-count-badge');
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
                return reject(new Error(`"${file.name}" is not a valid photo!`));
            }
            if (file.size > MAX_FILE_SIZE_BYTES) {
                return reject(new Error(`"${file.name}" exceeds the 5 MB limit!`));
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const maxDim = 1800;
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
                    // Fill crisp white paper background so transparent PNGs look clean
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);

                    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
                    resolve({
                        id: Date.now() + Math.random(),
                        name: file.name,
                        width: w,
                        height: h,
                        jpegDataUrl: jpegDataUrl
                    });
                };
                img.onerror = () => reject(new Error(`Could not decode image "${file.name}".`));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error("File read error."));
            reader.readAsDataURL(file);
        });
    }

    function renderWorkspaceCards() {
        if (!previewGrid) return;
        previewGrid.innerHTML = '';

        uploadedImages.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'preview-paper-sheet';

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
            nameEl.textContent = item.name;

            card.appendChild(removeBtn);
            card.appendChild(thumbFrame);
            card.appendChild(nameEl);
            previewGrid.appendChild(card);
        });

        if (imageCountBadge) {
            imageCountBadge.textContent = String(uploadedImages.length);
        }
    }

    async function handleSelectedFiles(fileList) {
        if (!fileList || fileList.length === 0) return;
        let addedCount = 0;

        for (const file of Array.from(fileList)) {
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
            showToast(`${addedCount} photo(s) ready for PDF!`, "success");
        }
    }

    if (selectImagesBtn && fileInput) {
        selectImagesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
    }
    if (uploadDropzone && fileInput) {
        uploadDropzone.addEventListener('click', () => fileInput.click());
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
        addMoreImagesBtn.addEventListener('click', () => fileInput.click());
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

    // Convert to PDF -> 1.6s Paper Loading Animation -> Auto-Download -> Done Screen
    if (convertToPdfBtn) {
        convertToPdfBtn.addEventListener('click', () => {
            if (uploadedImages.length === 0) {
                showToast("Please select at least 1 photo!", "error");
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
                    generatedPdfFilename = `${baseName}-Money-PDF.pdf`;

                    showStage('done');
                    triggerBrowserDownload(generatedPdfUrl, generatedPdfFilename);
                    showToast("PDF Downloaded to your device!", "success");
                } catch (err) {
                    showStage('workspace');
                    showToast("Error generating PDF. Try another image.", "error");
                }
            }, 1600);
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

    function resetConverter() {
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
            showToast("Cleared from browser memory!", "success");
        });
    }
    if (doneCopyLinkBtn) {
        doneCopyLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.origin + "/#create-pdf");
            showToast("Create PDF link copied!", "success");
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
                if (icon) icon.textContent = '+';
            });
            if (!isActive) {
                faq.classList.add('active');
                const icon = faq.querySelector('.faq-icon');
                if (icon) icon.textContent = '−';
            }
        });
    });

    // Contact Form
    const contactForm = document.getElementById('leadContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("Message sent to Money Bagga!", "success");
            contactForm.reset();
        });
    }
});
