/* =========================================================
   DESKRIPLY
   Generator Deskripsi Produk Neubrutalism
   File: script.js
========================================================= */

"use strict";

/* =========================================================
   1. KONFIGURASI GOOGLE SHEETS
========================================================= */

/*
    Masukkan URL Web App Google Apps Script di bawah ini.

    Contoh:
    const GOOGLE_SHEETS_WEB_APP_URL ="https://script.google.com/macros/s/AKfycbxazQUQ9Kyy9Qf5CUx2hYjsEPBoTcllV6MaX0cwS_gkoJ3rf9hNn1vTamWnqSZx6_pD/exec";

    Biarkan kosong apabila belum menghubungkan Google Sheets.
*/

const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwuLV8Oxbr3d0bOp8LmWJtnH0HDYoc1VJHVcEemiE3HDuHF01zPs8tG1PBG9Rx0KLY4/exec";

/* =========================================================
   2. DOM ELEMENTS
========================================================= */

const productForm = document.getElementById("productForm");

const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productFeatures = document.getElementById("productFeatures");
const productPrice = document.getElementById("productPrice");
const targetMarket = document.getElementById("targetMarket");
const writingStyle = document.getElementById("writingStyle");
const platform = document.getElementById("platform");
const keywords = document.getElementById("keywords");

const includeEmoji = document.getElementById("includeEmoji");
const includeHashtag = document.getElementById("includeHashtag");
const includeCallToAction = document.getElementById(
    "includeCallToAction"
);

const featureCounter = document.getElementById("featureCounter");

const generateButton = document.getElementById("generateButton");
const resetButton = document.getElementById("resetButton");

const emptyResult = document.getElementById("emptyResult");
const generatedResult = document.getElementById("generatedResult");
const resultText = document.getElementById("resultText");
const resultStatus = document.getElementById("resultStatus");
const wordCounter = document.getElementById("wordCounter");

const copyButton = document.getElementById("copyButton");
const saveButton = document.getElementById("saveButton");
const downloadButton = document.getElementById("downloadButton");

const loadingOverlay = document.getElementById("loadingOverlay");
const loadingProgress = document.getElementById("loadingProgress");

const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");
const toastClose = document.getElementById("toastClose");

const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

const themeButton = document.getElementById("themeButton");

const templateButtons = document.querySelectorAll(
    ".use-template-button"
);

const templateGrid = document.getElementById("templateGrid");
const templatePrevious = document.getElementById(
    "templatePrevious"
);
const templateNext = document.getElementById("templateNext");

const historyEmpty = document.getElementById("historyEmpty");
const historyList = document.getElementById("historyList");
const clearHistoryButton = document.getElementById(
    "clearHistoryButton"
);

const currentYear = document.getElementById("currentYear");

/* =========================================================
   3. GLOBAL STATE
========================================================= */

const HISTORY_STORAGE_KEY = "deskriply_history";
const THEME_STORAGE_KEY = "deskriply_theme";
const MAX_HISTORY = 10;

let currentDescription = "";
let currentProductData = null;
let toastTimer = null;
let isGenerating = false;

/* =========================================================
   4. TEMPLATE DATA
========================================================= */

const productTemplates = {
    beauty: {
        name: "Lip Cream Velvet",
        category: "Kecantikan",
        features:
            "Tekstur ringan, warna intens, hasil akhir velvet, tahan lama hingga 12 jam, nyaman digunakan, tidak membuat bibir kering",
        price: 50000,
        target:
            "Mahasiswa, pekerja, remaja, dan pecinta produk kecantikan",
        style: "Elegan",
        platform: "Marketplace",
        keywords:
            "premium, tahan lama, warna cantik, ringan, best seller",
        emoji: true,
        hashtag: true,
        callToAction: true
    },

    food: {
        name: "Keripik Pedas Premium",
        category: "Makanan dan Minuman",
        features:
            "Terbuat dari bahan pilihan, tekstur renyah, rasa pedas gurih, tanpa pengawet berbahaya, kemasan praktis, cocok untuk camilan",
        price: 25000,
        target:
            "Pelajar, mahasiswa, pekerja, dan pencinta makanan pedas",
        style: "Santai",
        platform: "TikTok Shop",
        keywords:
            "renyah, pedas, gurih, camilan kekinian, bikin nagih",
        emoji: true,
        hashtag: true,
        callToAction: true
    },

    fashion: {
        name: "Oversized T-Shirt Premium",
        category: "Fashion",
        features:
            "Bahan cotton combed, lembut dan adem, jahitan kuat, desain modern, ukuran oversized, nyaman digunakan sepanjang hari",
        price: 89000,
        target:
            "Remaja, mahasiswa, dan pencinta fashion kasual",
        style: "Ceria",
        platform: "Instagram",
        keywords:
            "oversized, streetwear, outfit kekinian, nyaman, premium",
        emoji: true,
        hashtag: true,
        callToAction: true
    },

    technology: {
        name: "Wireless Headphone Pro",
        category: "Elektronik",
        features:
            "Koneksi Bluetooth stabil, suara jernih, bass kuat, baterai tahan lama, desain ergonomis, mikrofon berkualitas tinggi",
        price: 275000,
        target:
            "Pelajar, mahasiswa, gamer, pekerja, dan pencinta musik",
        style: "Profesional",
        platform: "Marketplace",
        keywords:
            "wireless, bluetooth, suara jernih, bass kuat, modern",
        emoji: true,
        hashtag: false,
        callToAction: true
    }
};

/* =========================================================
   5. DATA BERDASARKAN KATEGORI
========================================================= */

const categoryData = {
    Kecantikan: {
        emoji: "💄",
        opening:
            "Saatnya tampil lebih percaya diri dengan",
        benefit:
            "dirancang untuk menunjang penampilan sekaligus memberikan kenyamanan dalam setiap pemakaian"
    },

    Fashion: {
        emoji: "👕",
        opening:
            "Lengkapi gaya terbaikmu bersama",
        benefit:
            "memadukan kenyamanan, kualitas, dan desain modern untuk berbagai aktivitas"
    },

    Elektronik: {
        emoji: "🎧",
        opening:
            "Nikmati pengalaman teknologi yang lebih praktis bersama",
        benefit:
            "menghadirkan performa optimal dengan fitur modern yang dapat diandalkan"
    },

    "Makanan dan Minuman": {
        emoji: "🍿",
        opening:
            "Temani waktu santaimu dengan kelezatan",
        benefit:
            "dibuat untuk memberikan pengalaman rasa yang lezat, nikmat, dan sulit dilupakan"
    },

    Kesehatan: {
        emoji: "🌿",
        opening:
            "Jaga kenyamanan aktivitas harianmu bersama",
        benefit:
            "dirancang dengan perhatian terhadap kualitas, keamanan, dan kebutuhan sehari-hari"
    },

    "Perawatan Tubuh": {
        emoji: "🧴",
        opening:
            "Berikan perawatan terbaik untuk tubuhmu bersama",
        benefit:
            "membantu menjaga kenyamanan dan membuat rutinitas perawatan menjadi lebih menyenangkan"
    },

    "Perlengkapan Rumah": {
        emoji: "🏠",
        opening:
            "Buat aktivitas di rumah semakin praktis dengan",
        benefit:
            "menghadirkan fungsi, kenyamanan, dan desain yang cocok untuk kebutuhan rumah modern"
    },

    Aksesoris: {
        emoji: "⌚",
        opening:
            "Sempurnakan penampilanmu dengan",
        benefit:
            "menjadi sentuhan pelengkap yang menarik untuk berbagai gaya dan suasana"
    },

    "Produk Digital": {
        emoji: "💻",
        opening:
            "Tingkatkan produktivitasmu menggunakan",
        benefit:
            "memberikan solusi praktis, efisien, dan mudah digunakan untuk kebutuhan digital"
    },

    Lainnya: {
        emoji: "✨",
        opening:
            "Temukan pengalaman baru bersama",
        benefit:
            "hadir dengan berbagai keunggulan untuk mendukung kebutuhan dan aktivitas sehari-hari"
    }
};

/* =========================================================
   6. GAYA BAHASA
========================================================= */

const writingStyleData = {
    Persuasif: {
        introduction:
            "Produk ini bukan sekadar pilihan biasa, tetapi solusi tepat untuk kamu yang mengutamakan kualitas.",
        closing:
            "Jangan lewatkan kesempatan untuk memiliki produk berkualitas ini."
    },

    Profesional: {
        introduction:
            "Produk ini dikembangkan dengan memperhatikan kualitas, fungsi, dan kenyamanan pengguna.",
        closing:
            "Pilihan ideal bagi konsumen yang membutuhkan produk berkualitas dan dapat diandalkan."
    },

    Santai: {
        introduction:
            "Cari produk yang praktis, cakep, dan nyaman digunakan? Ini jawabannya.",
        closing:
            "Cocok banget buat nemenin aktivitasmu setiap hari."
    },

    Elegan: {
        introduction:
            "Hadir dengan sentuhan istimewa yang memadukan kualitas, kenyamanan, dan keindahan.",
        closing:
            "Sebuah pilihan berkelas untuk melengkapi setiap momen spesialmu."
    },

    Ceria: {
        introduction:
            "Bikin hari-harimu jadi lebih seru, berwarna, dan pastinya lebih menyenangkan.",
        closing:
            "Yuk, jadikan aktivitasmu makin seru dengan produk pilihan ini."
    },

    Minimalis: {
        introduction:
            "Sederhana, berkualitas, dan tepat guna.",
        closing:
            "Pilihan praktis untuk kebutuhan sehari-hari."
    }
};

/* =========================================================
   7. INISIALISASI APLIKASI
========================================================= */

document.addEventListener("DOMContentLoaded", initializeApplication);

function initializeApplication() {
    setCurrentYear();
    initializeTheme();
    initializeNavigation();
    initializeFeatureCounter();
    initializeForm();
    initializeResultActions();
    initializeTemplates();
    initializeHistory();
    initializeToast();
    initializeSectionObserver();
}

/* =========================================================
   8. CURRENT YEAR
========================================================= */

function setCurrentYear() {
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

/* =========================================================
   9. THEME
========================================================= */

function initializeTheme() {
    if (!themeButton) return;

    const savedTheme = getStorageItem(THEME_STORAGE_KEY);
    const systemDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    const shouldUseDarkMode =
        savedTheme === "dark" ||
        (!savedTheme && systemDarkMode);

    document.body.classList.toggle(
        "dark-mode",
        shouldUseDarkMode
    );

    updateThemeIcon();

    themeButton.addEventListener("click", toggleTheme);
}

function toggleTheme() {
    const darkModeActive = document.body.classList.toggle(
        "dark-mode"
    );

    setStorageItem(
        THEME_STORAGE_KEY,
        darkModeActive ? "dark" : "light"
    );

    updateThemeIcon();

    showToast(
        darkModeActive ? "Dark Mode Aktif" : "Light Mode Aktif",
        darkModeActive
            ? "Tampilan gelap berhasil digunakan."
            : "Tampilan terang berhasil digunakan.",
        "success"
    );
}

function updateThemeIcon() {
    if (!themeButton) return;

    const icon = themeButton.querySelector("i");
    const darkModeActive = document.body.classList.contains(
        "dark-mode"
    );

    if (!icon) return;

    icon.className = darkModeActive
        ? "ri-sun-line"
        : "ri-moon-clear-line";

    themeButton.setAttribute(
        "aria-label",
        darkModeActive
            ? "Aktifkan tema terang"
            : "Aktifkan tema gelap"
    );
}

/* =========================================================
   10. MOBILE NAVIGATION
========================================================= */

function initializeNavigation() {
    if (!menuButton || !navMenu) return;

    menuButton.addEventListener("click", () => {
        const isActive = navMenu.classList.toggle("active");

        updateMenuButton(isActive);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            updateMenuButton(false);
        });
    });

    document.addEventListener("click", (event) => {
        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedMenuButton = menuButton.contains(event.target);

        if (!clickedInsideMenu && !clickedMenuButton) {
            navMenu.classList.remove("active");
            updateMenuButton(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            navMenu.classList.remove("active");
            updateMenuButton(false);
        }
    });
}

function updateMenuButton(isActive) {
    const icon = menuButton?.querySelector("i");

    if (!icon) return;

    icon.className = isActive
        ? "ri-close-line"
        : "ri-menu-3-line";

    menuButton.setAttribute(
        "aria-label",
        isActive ? "Tutup navigasi" : "Buka navigasi"
    );
}

/* =========================================================
   11. ACTIVE NAVIGATION ON SCROLL
========================================================= */

function initializeSectionObserver() {
    const sections = document.querySelectorAll(
        "main section[id]"
    );

    if (!sections.length || !("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const sectionId = entry.target.id;

                navLinks.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${sectionId}`
                    );
                });
            });
        },
        {
            root: null,
            threshold: 0.3,
            rootMargin: "-20% 0px -55% 0px"
        }
    );

    sections.forEach((section) => observer.observe(section));
}

/* =========================================================
   12. FEATURE CHARACTER COUNTER
========================================================= */

function initializeFeatureCounter() {
    if (!productFeatures || !featureCounter) return;

    updateFeatureCounter();

    productFeatures.addEventListener("input", updateFeatureCounter);
}

function updateFeatureCounter() {
    const currentLength = productFeatures.value.length;
    const maximumLength =
        Number(productFeatures.getAttribute("maxlength")) || 300;

    featureCounter.textContent =
        `${currentLength}/${maximumLength}`;

    if (currentLength >= maximumLength) {
        featureCounter.style.background = "var(--red)";
    } else if (currentLength >= maximumLength * 0.8) {
        featureCounter.style.background = "var(--yellow)";
    } else {
        featureCounter.style.background = "var(--white-pure)";
    }
}

/* =========================================================
   13. FORM INITIALIZATION
========================================================= */

function initializeForm() {
    if (!productForm) return;

    productForm.addEventListener("submit", handleGenerateDescription);
    productForm.addEventListener("reset", handleResetForm);
}

/* =========================================================
   14. GENERATE DESCRIPTION
========================================================= */

async function handleGenerateDescription(event) {
    event.preventDefault();

    if (isGenerating) return;

    const formIsValid = productForm.checkValidity();

    if (!formIsValid) {
        productForm.reportValidity();

        showToast(
            "Data Belum Lengkap",
            "Lengkapi semua kolom yang wajib diisi.",
            "warning"
        );

        return;
    }

    const productData = collectProductData();

    if (!productData.features.length) {
        showToast(
            "Fitur Produk Kosong",
            "Tuliskan minimal satu fitur atau keunggulan produk.",
            "warning"
        );

        productFeatures.focus();
        return;
    }

    isGenerating = true;
    currentProductData = productData;

    setGenerateButtonLoading(true);
    showLoadingOverlay();

    try {
        await simulateGenerationProcess();

        currentDescription = buildProductDescription(productData);

        displayGeneratedDescription(currentDescription);
        saveDescriptionToHistory(productData, currentDescription);

        showToast(
            "Deskripsi Berhasil Dibuat",
            `${productData.name} siap digunakan untuk ${productData.platform}.`,
            "success"
        );
    } catch (error) {
        console.error("Generate description error:", error);

        updateResultStatus("Gagal", "error");

        showToast(
            "Generate Gagal",
            "Terjadi kesalahan ketika membuat deskripsi.",
            "error"
        );
    } finally {
        hideLoadingOverlay();
        setGenerateButtonLoading(false);
        isGenerating = false;
    }
}

/* =========================================================
   15. COLLECT FORM DATA
========================================================= */

function collectProductData() {
    const rawFeatures = productFeatures.value
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean);

    const rawKeywords = keywords.value
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

    return {
        name: productName.value.trim(),
        category: productCategory.value,
        features: rawFeatures,
        rawFeatures: productFeatures.value.trim(),
        price: Number(productPrice.value),
        target: targetMarket.value.trim(),
        style: writingStyle.value,
        platform: platform.value,
        keywords: rawKeywords,
        rawKeywords: keywords.value.trim(),
        includeEmoji: includeEmoji.checked,
        includeHashtag: includeHashtag.checked,
        includeCallToAction: includeCallToAction.checked,
        createdAt: new Date().toISOString()
    };
}

/* =========================================================
   16. BUILD PRODUCT DESCRIPTION
========================================================= */

function buildProductDescription(data) {
    const selectedCategory =
        categoryData[data.category] || categoryData.Lainnya;

    const selectedStyle =
        writingStyleData[data.style] ||
        writingStyleData.Persuasif;

    const emoji = data.includeEmoji
        ? `${selectedCategory.emoji} `
        : "";

    const sparkle = data.includeEmoji ? "✨ " : "";
    const checkIcon = data.includeEmoji ? "✅ " : "• ";
    const moneyIcon = data.includeEmoji ? "💰 " : "";
    const targetIcon = data.includeEmoji ? "🎯 " : "";
    const cartIcon = data.includeEmoji ? "🛒 " : "";

    const formattedPrice = formatRupiah(data.price);

    const featureList = data.features
        .map((feature) => `${checkIcon}${capitalizeFirstLetter(feature)}`)
        .join("\n");

    const keywordSentence = buildKeywordSentence(data.keywords);

    const platformSentence = buildPlatformSentence(
        data.platform,
        data.name
    );

    const callToAction = data.includeCallToAction
        ? buildCallToAction(data.style, data.name, cartIcon)
        : "";

    const hashtags = data.includeHashtag
        ? buildHashtags(data)
        : "";

    const descriptionParts = [
        `${emoji}${data.name.toUpperCase()}`,
        "",
        `${selectedCategory.opening} ${data.name}. ${selectedStyle.introduction}`,
        "",
        `${data.name} ${selectedCategory.benefit}. Produk ini cocok digunakan oleh ${data.target}.`,
        "",
        `${sparkle}KEUNGGULAN PRODUK`,
        featureList,
        "",
        keywordSentence,
        "",
        `${moneyIcon}Harga: ${formattedPrice}`,
        `${targetIcon}Cocok untuk: ${data.target}`,
        "",
        platformSentence,
        "",
        selectedStyle.closing
    ];

    if (callToAction) {
        descriptionParts.push("", callToAction);
    }

    if (hashtags) {
        descriptionParts.push("", hashtags);
    }

    return descriptionParts
        .filter((part, index, array) => {
            if (
                part === "" &&
                index > 0 &&
                array[index - 1] === ""
            ) {
                return false;
            }

            return part !== null && part !== undefined;
        })
        .join("\n")
        .trim();
}

/* =========================================================
   17. DESCRIPTION HELPERS
========================================================= */

function buildKeywordSentence(keywordList) {
    if (!keywordList.length) {
        return "Dibuat untuk memberikan pengalaman penggunaan yang praktis, nyaman, dan memuaskan.";
    }

    if (keywordList.length === 1) {
        return `Keunggulan utama produk ini adalah ${keywordList[0]}.`;
    }

    const lastKeyword = keywordList[keywordList.length - 1];
    const initialKeywords = keywordList.slice(0, -1).join(", ");

    return (
        `Produk ini menawarkan kualitas ${initialKeywords}, ` +
        `serta ${lastKeyword} dalam satu pilihan terbaik.`
    );
}

function buildPlatformSentence(selectedPlatform, name) {
    const platformSentences = {
        Marketplace:
            `${name} siap menjadi pilihan menarik untuk kebutuhan belanja online dengan informasi produk yang jelas dan meyakinkan.`,

        Instagram:
            `${name} hadir dengan tampilan dan keunggulan yang cocok dibagikan melalui konten Instagram yang menarik.`,

        "TikTok Shop":
            `${name} cocok untuk kamu yang mencari produk kekinian, praktis, dan menarik melalui TikTok Shop.`,

        WhatsApp:
            `${name} dapat dipesan dengan mudah melalui WhatsApp untuk proses pembelian yang lebih cepat dan praktis.`,

        Website:
            `${name} tersedia melalui website dengan informasi yang mudah dipahami dan proses pemesanan yang praktis.`,

        Katalog:
            `${name} menjadi salah satu pilihan unggulan dalam katalog produk kami.`
    };

    return (
        platformSentences[selectedPlatform] ||
        `${name} tersedia dan siap memenuhi kebutuhanmu.`
    );
}

function buildCallToAction(style, name, cartIcon) {
    const callToActions = {
        Persuasif:
            `${cartIcon}Pesan ${name} sekarang sebelum kehabisan dan rasakan sendiri semua keunggulannya!`,

        Profesional:
            `${cartIcon}Dapatkan ${name} sekarang dan nikmati produk berkualitas untuk menunjang kebutuhanmu.`,

        Santai:
            `${cartIcon}Tunggu apa lagi? Yuk, langsung checkout ${name} sekarang juga!`,

        Elegan:
            `${cartIcon}Miliki ${name} sekarang dan hadirkan sentuhan istimewa dalam setiap aktivitasmu.`,

        Ceria:
            `${cartIcon}Yuk, bikin harimu makin seru dengan memesan ${name} sekarang!`,

        Minimalis:
            `${cartIcon}Pesan ${name} sekarang. Praktis, berkualitas, dan siap digunakan.`
    };

    return callToActions[style] || callToActions.Persuasif;
}

function buildHashtags(data) {
    const hashtagSet = new Set();

    hashtagSet.add(convertToHashtag(data.name));
    hashtagSet.add(convertToHashtag(data.category));
    hashtagSet.add("#ProdukPilihan");
    hashtagSet.add("#BelanjaOnline");

    data.keywords.slice(0, 4).forEach((keyword) => {
        hashtagSet.add(convertToHashtag(keyword));
    });

    return [...hashtagSet]
        .filter((hashtag) => hashtag.length > 1)
        .join(" ");
}

function convertToHashtag(text) {
    const cleanedText = text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .trim()
        .split(/\s+/)
        .map(capitalizeFirstLetter)
        .join("");

    return cleanedText ? `#${cleanedText}` : "";
}

function capitalizeFirstLetter(text) {
    if (!text) return "";

    return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatRupiah(number) {
    const validNumber = Number.isFinite(number) ? number : 0;

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(validNumber);
}

/* =========================================================
   18. LOADING SIMULATION
========================================================= */

function simulateGenerationProcess() {
    return new Promise((resolve) => {
        let progress = 0;

        if (loadingProgress) {
            loadingProgress.style.width = "0%";
        }

        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 13) + 7;

            if (progress >= 90) {
                progress = 90;
                clearInterval(interval);
            }

            if (loadingProgress) {
                loadingProgress.style.width = `${progress}%`;
            }
        }, 160);

        setTimeout(() => {
            clearInterval(interval);

            if (loadingProgress) {
                loadingProgress.style.width = "100%";
            }

            setTimeout(resolve, 250);
        }, 1450);
    });
}

function showLoadingOverlay() {
    if (!loadingOverlay) return;

    loadingOverlay.classList.add("show");
    loadingOverlay.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");
}

function hideLoadingOverlay() {
    if (!loadingOverlay) return;

    loadingOverlay.classList.remove("show");
    loadingOverlay.setAttribute("aria-hidden", "true");

    document.body.classList.remove("no-scroll");

    setTimeout(() => {
        if (loadingProgress) {
            loadingProgress.style.width = "0%";
        }
    }, 300);
}

function setGenerateButtonLoading(isLoading) {
    if (!generateButton) return;

    const buttonText = generateButton.querySelector(".button-text");
    const buttonIcon = generateButton.querySelector(".button-icon i");

    generateButton.disabled = isLoading;

    if (buttonText) {
        buttonText.textContent = isLoading
            ? "Sedang Generate..."
            : "Generate Deskripsi";
    }

    if (buttonIcon) {
        buttonIcon.className = isLoading
            ? "ri-loader-4-line"
            : "ri-sparkling-2-fill";
    }
}

/* =========================================================
   19. DISPLAY RESULT
========================================================= */

function displayGeneratedDescription(description) {
    if (!resultText || !generatedResult || !emptyResult) return;

    resultText.textContent = description;

    emptyResult.hidden = true;
    generatedResult.hidden = false;

    updateWordCounter(description);
    updateResultStatus("Berhasil", "success");

    generatedResult.classList.remove("fade-in");
    void generatedResult.offsetWidth;
    generatedResult.classList.add("fade-in");

    setTimeout(() => {
        resultText.focus({
            preventScroll: true
        });
    }, 100);
}

function updateWordCounter(description) {
    if (!wordCounter) return;

    const totalWords = description
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

    wordCounter.textContent = `${totalWords} kata`;
}

function updateResultStatus(statusText, statusType = "") {
    if (!resultStatus) return;

    resultStatus.innerHTML = `
        <span></span>
        ${escapeHTML(statusText)}
    `;

    resultStatus.classList.remove("success", "error");

    if (statusType) {
        resultStatus.classList.add(statusType);
    }
}

/* =========================================================
   20. RESULT ACTIONS
========================================================= */

function initializeResultActions() {
    copyButton?.addEventListener("click", copyCurrentDescription);
    saveButton?.addEventListener("click", saveCurrentDescriptionToSheets);
    downloadButton?.addEventListener(
        "click",
        downloadCurrentDescription
    );
}

/* =========================================================
   21. COPY DESCRIPTION
========================================================= */

async function copyCurrentDescription() {
    if (!currentDescription) {
        showToast(
            "Belum Ada Deskripsi",
            "Generate deskripsi produk terlebih dahulu.",
            "warning"
        );

        return;
    }

    try {
        await copyTextToClipboard(currentDescription);

        const originalContent = copyButton.innerHTML;

        copyButton.innerHTML = `
            <i class="ri-check-double-line"></i>
            Berhasil Disalin
        `;

        showToast(
            "Berhasil Disalin",
            "Deskripsi produk sudah masuk ke clipboard.",
            "success"
        );

        setTimeout(() => {
            copyButton.innerHTML = originalContent;
        }, 1700);
    } catch (error) {
        console.error("Copy error:", error);

        showToast(
            "Gagal Menyalin",
            "Browser tidak memberikan izin untuk menyalin teks.",
            "error"
        );
    }
}

async function copyTextToClipboard(text) {
    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const temporaryTextarea = document.createElement("textarea");

    temporaryTextarea.value = text;
    temporaryTextarea.style.position = "fixed";
    temporaryTextarea.style.opacity = "0";
    temporaryTextarea.style.pointerEvents = "none";

    document.body.appendChild(temporaryTextarea);

    temporaryTextarea.focus();
    temporaryTextarea.select();

    const success = document.execCommand("copy");

    temporaryTextarea.remove();

    if (!success) {
        throw new Error("Copy command failed.");
    }
}

/* =========================================================
   22. DOWNLOAD DESCRIPTION
========================================================= */

function downloadCurrentDescription() {
    if (!currentDescription || !currentProductData) {
        showToast(
            "Belum Ada Deskripsi",
            "Generate deskripsi sebelum mengunduh hasil.",
            "warning"
        );

        return;
    }

    const fileContent = [
        "DESKRIPSI PRODUK",
        "==============================",
        "",
        `Nama Produk : ${currentProductData.name}`,
        `Kategori    : ${currentProductData.category}`,
        `Harga       : ${formatRupiah(currentProductData.price)}`,
        `Platform    : ${currentProductData.platform}`,
        "",
        currentDescription,
        "",
        "==============================",
        "Dibuat menggunakan Deskriply."
    ].join("\n");

    const blob = new Blob([fileContent], {
        type: "text/plain;charset=utf-8"
    });

    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = downloadUrl;
    anchor.download =
        `${createFileName(currentProductData.name)}-deskripsi.txt`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(downloadUrl);

    showToast(
        "File Berhasil Diunduh",
        "Deskripsi disimpan dalam format TXT.",
        "success"
    );
}

function createFileName(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

/* =========================================================
   23. GOOGLE SHEETS
========================================================= */

async function saveCurrentDescriptionToSheets() {
    if (!currentDescription || !currentProductData) {
        showToast(
            "Belum Ada Data",
            "Generate deskripsi sebelum menyimpan ke Google Sheets.",
            "warning"
        );

        return;
    }

    if (!GOOGLE_SHEETS_WEB_APP_URL.trim()) {
        showToast(
            "Google Sheets Belum Terhubung",
            "Masukkan URL Google Apps Script pada file script.js.",
            "warning"
        );

        return;
    }

    const originalContent = saveButton.innerHTML;

    saveButton.disabled = true;
    saveButton.innerHTML = `
        <i class="ri-loader-4-line"></i>
        Menyimpan...
    `;

    const sheetsPayload = {
        action: "create",
        nama_produk: currentProductData.name,
        kategori: currentProductData.category,
        fitur: currentProductData.rawFeatures,
        harga: currentProductData.price,
        target_pasar: currentProductData.target,
        gaya_bahasa: currentProductData.style,
        platform: currentProductData.platform,
        kata_kunci: currentProductData.rawKeywords,
        deskripsi: currentDescription,
        tanggal: formatDateTime(new Date())
    };

    try {
        await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(sheetsPayload)
        });

        saveButton.innerHTML = `
            <i class="ri-check-double-line"></i>
            Tersimpan
        `;

        showToast(
            "Tersimpan ke Google Sheets",
            "Data produk berhasil dikirim ke spreadsheet.",
            "success"
        );
    } catch (error) {
        console.error("Google Sheets error:", error);

        saveButton.innerHTML = `
            <i class="ri-error-warning-line"></i>
            Gagal
        `;

        showToast(
            "Gagal Menyimpan",
            "Periksa URL Google Apps Script dan koneksi internet.",
            "error"
        );
    } finally {
        setTimeout(() => {
            saveButton.disabled = false;
            saveButton.innerHTML = originalContent;
        }, 1800);
    }
}

/* =========================================================
   24. FORM RESET
========================================================= */

function handleResetForm() {
    setTimeout(() => {
        currentDescription = "";
        currentProductData = null;

        if (resultText) {
            resultText.textContent = "";
        }

        if (generatedResult) {
            generatedResult.hidden = true;
        }

        if (emptyResult) {
            emptyResult.hidden = false;
        }

        if (wordCounter) {
            wordCounter.textContent = "0 kata";
        }

        updateFeatureCounter();
        updateResultStatus("Menunggu");

        showToast(
            "Form Direset",
            "Semua informasi produk berhasil dibersihkan.",
            "success"
        );
    }, 0);
}

/* =========================================================
   25. PRODUCT TEMPLATES
========================================================= */

function initializeTemplates() {
    templateButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const templateName = button.dataset.template;

            applyProductTemplate(templateName);
        });
    });

    templatePrevious?.addEventListener("click", () => {
        templateGrid?.scrollBy({
            left: -330,
            behavior: "smooth"
        });
    });

    templateNext?.addEventListener("click", () => {
        templateGrid?.scrollBy({
            left: 330,
            behavior: "smooth"
        });
    });
}

function applyProductTemplate(templateName) {
    const selectedTemplate = productTemplates[templateName];

    if (!selectedTemplate) {
        showToast(
            "Template Tidak Ditemukan",
            "Data template produk tidak tersedia.",
            "error"
        );

        return;
    }

    productName.value = selectedTemplate.name;
    productCategory.value = selectedTemplate.category;
    productFeatures.value = selectedTemplate.features;
    productPrice.value = selectedTemplate.price;
    targetMarket.value = selectedTemplate.target;
    writingStyle.value = selectedTemplate.style;
    platform.value = selectedTemplate.platform;
    keywords.value = selectedTemplate.keywords;

    includeEmoji.checked = selectedTemplate.emoji;
    includeHashtag.checked = selectedTemplate.hashtag;
    includeCallToAction.checked =
        selectedTemplate.callToAction;

    updateFeatureCounter();

    document.getElementById("generator")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    setTimeout(() => {
        productName.focus();
    }, 700);

    showToast(
        "Template Digunakan",
        `Template ${selectedTemplate.name} berhasil dimasukkan.`,
        "success"
    );
}

/* =========================================================
   26. HISTORY
========================================================= */

function initializeHistory() {
    renderHistory();

    historyList?.addEventListener("click", handleHistoryAction);
    clearHistoryButton?.addEventListener("click", clearAllHistory);
}

function saveDescriptionToHistory(productData, description) {
    const history = getDescriptionHistory();

    const historyItem = {
        id: generateUniqueId(),
        name: productData.name,
        category: productData.category,
        price: productData.price,
        platform: productData.platform,
        description,
        productData,
        createdAt: new Date().toISOString()
    };

    history.unshift(historyItem);

    const limitedHistory = history.slice(0, MAX_HISTORY);

    setStorageItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(limitedHistory)
    );

    renderHistory();
}

function getDescriptionHistory() {
    const savedHistory = getStorageItem(HISTORY_STORAGE_KEY);

    if (!savedHistory) return [];

    try {
        const parsedHistory = JSON.parse(savedHistory);

        return Array.isArray(parsedHistory)
            ? parsedHistory
            : [];
    } catch (error) {
        console.error("History parse error:", error);

        return [];
    }
}

function renderHistory() {
    if (!historyList || !historyEmpty) return;

    const history = getDescriptionHistory();

    if (!history.length) {
        historyEmpty.hidden = false;
        historyList.hidden = true;
        historyList.innerHTML = "";

        return;
    }

    historyEmpty.hidden = true;
    historyList.hidden = false;

    historyList.innerHTML = history
        .map((item) => createHistoryItemHTML(item))
        .join("");
}

function createHistoryItemHTML(item) {
    const category =
        categoryData[item.category] || categoryData.Lainnya;

    const descriptionPreview = truncateText(
        item.description.replace(/\n/g, " "),
        100
    );

    return `
        <article class="history-item" data-id="${escapeHTML(item.id)}">
            <div class="history-item-icon">
                <span aria-hidden="true">
                    ${category.emoji}
                </span>
            </div>

            <div class="history-item-content">
                <h4>${escapeHTML(item.name)}</h4>

                <p>
                    ${escapeHTML(descriptionPreview)}
                </p>

                <small>
                    ${escapeHTML(item.category)}
                    •
                    ${escapeHTML(formatRupiah(Number(item.price)))}
                    •
                    ${escapeHTML(formatRelativeDate(item.createdAt))}
                </small>
            </div>

            <div class="history-item-actions">
                <button
                    type="button"
                    data-action="view"
                    title="Lihat hasil"
                    aria-label="Lihat hasil ${escapeHTML(item.name)}"
                >
                    <i class="ri-eye-line"></i>
                </button>

                <button
                    type="button"
                    data-action="copy"
                    title="Salin deskripsi"
                    aria-label="Salin deskripsi ${escapeHTML(item.name)}"
                >
                    <i class="ri-file-copy-line"></i>
                </button>

                <button
                    type="button"
                    data-action="delete"
                    title="Hapus riwayat"
                    aria-label="Hapus riwayat ${escapeHTML(item.name)}"
                >
                    <i class="ri-delete-bin-6-line"></i>
                </button>
            </div>
        </article>
    `;
}

function handleHistoryAction(event) {
    const actionButton = event.target.closest(
        "button[data-action]"
    );

    if (!actionButton) return;

    const historyItemElement = actionButton.closest(".history-item");
    const historyId = historyItemElement?.dataset.id;
    const action = actionButton.dataset.action;

    if (!historyId) return;

    const history = getDescriptionHistory();
    const selectedItem = history.find(
        (item) => item.id === historyId
    );

    if (!selectedItem) {
        showToast(
            "Data Tidak Ditemukan",
            "Riwayat produk tersebut sudah tidak tersedia.",
            "error"
        );

        return;
    }

    switch (action) {
        case "view":
            viewHistoryItem(selectedItem);
            break;

        case "copy":
            copyHistoryDescription(selectedItem);
            break;

        case "delete":
            deleteHistoryItem(historyId);
            break;

        default:
            break;
    }
}

function viewHistoryItem(item) {
    currentDescription = item.description;
    currentProductData = item.productData || {
        name: item.name,
        category: item.category,
        price: item.price,
        platform: item.platform
    };

    displayGeneratedDescription(item.description);

    document.getElementById("generator")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    showToast(
        "Riwayat Dibuka",
        `Deskripsi ${item.name} ditampilkan kembali.`,
        "success"
    );
}

async function copyHistoryDescription(item) {
    try {
        await copyTextToClipboard(item.description);

        showToast(
            "Berhasil Disalin",
            `Deskripsi ${item.name} sudah disalin.`,
            "success"
        );
    } catch (error) {
        console.error("History copy error:", error);

        showToast(
            "Gagal Menyalin",
            "Deskripsi tidak berhasil disalin.",
            "error"
        );
    }
}

function deleteHistoryItem(historyId) {
    const history = getDescriptionHistory();

    const updatedHistory = history.filter(
        (item) => item.id !== historyId
    );

    setStorageItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(updatedHistory)
    );

    renderHistory();

    showToast(
        "Riwayat Dihapus",
        "Satu deskripsi berhasil dihapus dari riwayat.",
        "success"
    );
}

function clearAllHistory() {
    const history = getDescriptionHistory();

    if (!history.length) {
        showToast(
            "Riwayat Sudah Kosong",
            "Belum ada deskripsi yang perlu dihapus.",
            "warning"
        );

        return;
    }

    const confirmed = window.confirm(
        "Hapus seluruh riwayat deskripsi produk?"
    );

    if (!confirmed) return;

    removeStorageItem(HISTORY_STORAGE_KEY);
    renderHistory();

    showToast(
        "Semua Riwayat Dihapus",
        "Riwayat deskripsi berhasil dibersihkan.",
        "success"
    );
}

/* =========================================================
   27. TOAST
========================================================= */

function initializeToast() {
    toastClose?.addEventListener("click", hideToast);
}

function showToast(title, message, type = "success") {
    if (!toast || !toastTitle || !toastMessage) return;

    clearTimeout(toastTimer);

    toast.classList.remove("success", "error", "warning");

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    const toastIcon = toast.querySelector(".toast-icon i");

    if (type === "error") {
        toast.classList.add("error");

        if (toastIcon) {
            toastIcon.className = "ri-error-warning-fill";
        }
    } else if (type === "warning") {
        toast.classList.add("warning");

        if (toastIcon) {
            toastIcon.className = "ri-alert-fill";
        }
    } else {
        toast.classList.add("success");

        if (toastIcon) {
            toastIcon.className = "ri-checkbox-circle-fill";
        }
    }

    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        hideToast();
    }, 3500);
}

function hideToast() {
    if (!toast) return;

    toast.classList.remove("show");
    clearTimeout(toastTimer);
}

/* =========================================================
   28. STORAGE HELPERS
========================================================= */

function getStorageItem(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(`Unable to read storage key "${key}":`, error);

        return null;
    }
}

function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, value);

        return true;
    } catch (error) {
        console.error(`Unable to save storage key "${key}":`, error);

        return false;
    }
}

function removeStorageItem(key) {
    try {
        localStorage.removeItem(key);

        return true;
    } catch (error) {
        console.error(`Unable to remove storage key "${key}":`, error);

        return false;
    }
}

/* =========================================================
   29. GENERAL HELPERS
========================================================= */

function generateUniqueId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 9)
    );
}

function truncateText(text, maximumLength) {
    if (text.length <= maximumLength) return text;

    return `${text.slice(0, maximumLength).trim()}...`;
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);
}

function formatRelativeDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Tanggal tidak diketahui";
    }

    const now = new Date();
    const differenceInMilliseconds = now - date;
    const differenceInMinutes = Math.floor(
        differenceInMilliseconds / 60000
    );

    if (differenceInMinutes < 1) {
        return "Baru saja";
    }

    if (differenceInMinutes < 60) {
        return `${differenceInMinutes} menit lalu`;
    }

    const differenceInHours = Math.floor(
        differenceInMinutes / 60
    );

    if (differenceInHours < 24) {
        return `${differenceInHours} jam lalu`;
    }

    const differenceInDays = Math.floor(
        differenceInHours / 24
    );

    if (differenceInDays < 7) {
        return `${differenceInDays} hari lalu`;
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date);
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}