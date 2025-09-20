let currentLang = 'id';
let draggedItem = null;

// Language switching functionality
const translations = {
    'id': {
        pageTitle: 'Pengenalan Sampah Bertenaga AI',
        heroDescription: 'Transformasi manajemen sampah Anda dengan teknologi AI cerdas. Unggah, analisis, dan dapatkan instruksi daur ulang instan untuk masa depan yang berkelanjutan.',
        uploadTitle: 'Analisis Sampah Anda',
        uploadSubtitle: 'Unggah gambar item sampah Anda dan dapatkan instruksi daur ulang instan',
        uploadText: 'Klik untuk mengunggah atau seret & lepas',
        uploadSubtext: 'Mendukung JPG, PNG, GIF hingga 10MB',
        analyzeText: 'Analisis Sampah',
        analysisResultTitle: 'Hasil Analisis',
        resultObjectLabel: 'Objek Terdeteksi:',
        resultInstructionsLabel: 'Instruksi Daur Ulang:',
        resultMaterialLabel: 'Jenis Material:',
        resultEcoImpactLabel: 'Dampak Lingkungan:',
        alert_message: 'Silakan pilih gambar terlebih dahulu!',
        analyzing_message: 'Menganalisis...',
        error_message: 'Terjadi kesalahan saat menganalisis gambar.',
        view_report: 'Lihat Laporan Dampak',
        leaderboard_title: 'Papan Peringkat Daur Ulang',
        enter_name_prompt: 'Masukkan nama Anda untuk Leaderboard:',
        submit_name: 'Kirim',
        leaderboard_rank: 'Peringkat',
        leaderboard_name: 'Nama',
        leaderboard_items: 'Item Didaur Ulang',
        leaderboard_co2: 'CO₂ Dihemat',
        leaderboard_energy: 'Energi Dihemat',
        leaderboard_water: 'Air Dihemat',
        no_leaderboard_data: 'Belum ada data di papan peringkat.',
        congratulations_title: 'Selamat!',
        correct_sort_message: 'Anda berhasil mendaur ulang item dengan benar!',
        impact_saved_message: 'Dampak lingkungan Anda telah disimpan ke laporan.',
        incorrect_sort_message: 'Salah! Coba lagi.',
        minigame_title: 'Tantangan Pemilahan',
        minigame_instruction: 'Seret item ke tempat sampah daur ulang yang benar!',
        inorganic_bin: 'Anorganik',
        organic_bin: 'Organik',
        glass_bin: 'Kaca',
    },
    'en': {
        pageTitle: 'AI-Powered Waste Recognition',
        heroDescription: 'Transform your waste management with intelligent AI technology. Upload, analyze, and get instant recycling instructions for a sustainable future.',
        uploadTitle: 'Analyze Your Waste',
        uploadSubtitle: 'Upload an image of your waste item and get instant recycling instructions',
        uploadText: 'Click to upload or drag & drop',
        uploadSubtext: 'Supports JPG, PNG, GIF up to 10MB',
        analyzeText: 'Analyze Waste',
        analysisResultTitle: 'Analysis Result',
        resultObjectLabel: 'Detected Object:',
        resultInstructionsLabel: 'Recycling Instructions:',
        resultMaterialLabel: 'Material Type:',
        resultEcoImpactLabel: 'Environmental Impact:',
        alert_message: 'Please select an image first!',
        analyzing_message: 'Analyzing...',
        error_message: 'An error occurred while analyzing the image.',
        view_report: 'View Impact Report',
        leaderboard_title: 'Recycling Leaderboard',
        enter_name_prompt: 'Enter your name for the Leaderboard:',
        submit_name: 'Submit',
        leaderboard_rank: 'Rank',
        leaderboard_name: 'Name',
        leaderboard_items: 'Items Recycled',
        leaderboard_co2: 'CO₂ Saved',
        leaderboard_energy: 'Energy Saved',
        leaderboard_water: 'Water Saved',
        no_leaderboard_data: 'No leaderboard data yet.',
        congratulations_title: 'Congratulations!',
        correct_sort_message: 'You successfully recycled the item correctly!',
        impact_saved_message: 'Your environmental impact has been saved to your report.',
        incorrect_sort_message: 'Incorrect! Try again.',
        minigame_title: 'Sorting Challenge',
        minigame_instruction: 'Drag the item to the correct recycling bin!',
        inorganic_bin: 'Inorganic',
        organic_bin: 'Organic',
        glass_bin: 'Glass',
    }
};

// Show level up notification
function showLevelUpNotification() {
    const user = loadUserData(); 
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFD700, #FFC107); color: white;
        padding: 2rem; border-radius: 15px; text-align: center; z-index: 3000;
        box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3); animation: levelUpPulse 0.5s ease-in-out;
    `;
    notification.innerHTML = `
        <i class="fas fa-star" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
        <h3>Level Up!</h3>
        <p>You've reached Level ${user.level}!</p>
    `;
    document.body.appendChild(notification);
    setTimeout(() => { notification.remove(); }, 3000);
}

function loadTranslations(lang) {
    currentLang = lang;
    const t = translations[lang];

    document.getElementById('pageTitle').textContent = t.pageTitle;
    document.getElementById('heroDescription').textContent = t.heroDescription;
    document.getElementById('uploadTitle').textContent = t.uploadTitle;
    document.getElementById('uploadSubtitle').textContent = t.uploadSubtitle;
    document.getElementById('uploadText').textContent = t.uploadText;
    document.getElementById('uploadSubtext').textContent = t.uploadSubtext;
    document.getElementById('analyzeText').textContent = t.analyzeText;
    document.getElementById('analysisResultTitle').textContent = t.analysisResultTitle;
    document.getElementById('resultObjectLabel').textContent = t.resultObjectLabel;
    document.getElementById('resultInstructionsLabel').textContent = t.resultInstructionsLabel;

    // Update labels baru
    const materialLabel = document.getElementById('resultMaterialLabel');
    const ecoImpactLabel = document.getElementById('resultEcoImpactLabel');
    const viewReportBtn = document.getElementById('viewReportBtn');
    const minigameTitle = document.querySelector('#minigame-wrapper .game-title');
    const minigameInstruction = document.querySelector('#minigame-wrapper p');
    const inorganicZoneLabel = document.querySelector('#anorganik-zone .bin-label'); // Assuming you add this label
    const organicZoneLabel = document.querySelector('#organik-zone .bin-label'); // Assuming you add this label
    const glassZoneLabel = document.querySelector('#kaca-zone .bin-label'); // Assuming you add this label
    const successPopupTitle = document.querySelector('#success-popup h3');
    const successPopupMessage1 = document.querySelector('#success-popup p:nth-of-type(1)');
    const successPopupMessage2 = document.querySelector('#success-popup p:nth-of-type(2)');
    const nameInputPrompt = document.querySelector('#name-input-popup .popup-content p');
    const submitNameBtn = document.getElementById('submitNameBtn');



    if (materialLabel) materialLabel.textContent = t.resultMaterialLabel;
    if (ecoImpactLabel) ecoImpactLabel.textContent = t.resultEcoImpactLabel;
    if (viewReportBtn) viewReportBtn.textContent = t.view_report;
    if (minigameTitle) minigameTitle.textContent = t.minigame_title;
    if (minigameInstruction) minigameInstruction.textContent = t.minigame_instruction;
    if (inorganicZoneLabel) inorganicZoneLabel.textContent = t.inorganic_bin;
    if (organicZoneLabel) organicZoneLabel.textContent = t.organic_bin;
    if (glassZoneLabel) glassZoneLabel.textContent = t.glass_bin;
    if (successPopupTitle) successPopupTitle.textContent = t.congratulations_title;
    if (successPopupMessage1) successPopupMessage1.textContent = t.correct_sort_message;
    if (successPopupMessage2) successPopupMessage2.textContent = t.impact_saved_message;
    if (nameInputPrompt) nameInputPrompt.textContent = t.enter_name_prompt;
    if (submitNameBtn) submitNameBtn.textContent = t.submit_name;

    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
}

// Event listeners
document.getElementById('lang-en').addEventListener('click', () => loadTranslations('en'));
document.getElementById('lang-id').addEventListener('click', () => loadTranslations('id'));

// Image upload functionality
const imageUpload = document.getElementById('imageUpload');
const previewContainer = document.querySelector('.preview-container'); 
const preview = document.getElementById('preview');
const analyzeBtn = document.getElementById('analyzeBtn');

imageUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            previewContainer.style.display = 'flex'; 
            analyzeBtn.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Updated analysis function dengan data yang lebih kaya
analyzeBtn.addEventListener('click', async function () {
    const file = imageUpload.files[0];
    const t = translations[currentLang];

    if (!file) {
        alert(t.alert_message);
        return;
    }

    // Show loading state
    const analyzeText = document.getElementById('analyzeText');
    analyzeText.innerHTML = '<span class="loading"></span> ' + t.analyzing_message;
    analyzeBtn.disabled = true;

    // Simulate API call delay dengan mock data yang diperkaya
    setTimeout(() => {
        // Mock results dengan data yang lebih detail
        const mockResults = [
            {
                object_name: 'Plastic Bottle',
                type: 'anorganik',
                material: 'PET (Polyethylene Terephthalate)',
                instructions: 'Remove cap and label. Rinse bottle. Place in plastic recycling bin.',
                eco_impact: {
                    co2: '250g',
                    energy: '3 jam menyalakan lampu LED',
                    water: '2.5 liter air bersih',
                    decompose_time: '450 tahun'
                },
                timestamp: new Date().toISOString()
            },
            {
                object_name: 'Glass Bottle',
                type: 'kaca',
                material: 'Kaca Soda-Lime',
                instructions: 'Remove labels. Rinse thoroughly. Place in glass recycling bin.',
                eco_impact: {
                    co2: '400g',
                    energy: '5 jam menyalakan lampu LED',
                    water: '0.5 liter air bersih',
                    decompose_time: '1000 tahun'
                },
                timestamp: new Date().toISOString()
            },
            {
                object_name: 'Cardboard Box',
                type: 'organik',
                material: 'Corrugated Cardboard',
                instructions: 'Flatten box. Remove any tape or staples. Place in paper recycling bin.',
                eco_impact: {
                    co2: '100g',
                    energy: '1 jam menyalakan lampu LED',
                    water: '5 liter air bersih',
                    decompose_time: '3 bulan'
                },
                timestamp: new Date().toISOString()
            },
            {
                object_name: 'Aluminum Can',
                type: 'anorganik',
                material: 'Aluminum Alloy 3004',
                instructions: 'Rinse can. Remove any remaining liquid. Place in metal recycling bin.',
                eco_impact: {
                    co2: '500g',
                    energy: '8 jam menyalakan lampu LED',
                    water: '1 liter air bersih',
                    decompose_time: '200 tahun'
                },
                timestamp: new Date().toISOString()
            }
        ];

        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];

        // Update tampilan hasil
        objectNameDisplay.textContent = randomResult.object_name;
        instructionsDisplay.textContent = randomResult.instructions;

        // Update tampilan material dan eco impact baru
        const materialDisplay = document.getElementById('materialDisplay');
        const ecoImpactDisplay = document.getElementById('ecoImpactDisplay');

        if (materialDisplay) {
            materialDisplay.textContent = randomResult.material;
        }

        if (ecoImpactDisplay) {
            ecoImpactDisplay.innerHTML = `
                <div class="eco-impact-item">
                    <span class="eco-label">CO₂ yang dapat dihemat:</span>
                    <span class="eco-value">${randomResult.eco_impact.co2}</span>
                </div>
                <div class="eco-impact-item">
                    <span class="eco-label">Energi yang dihemat:</span>
                    <span class="eco-value">${randomResult.eco_impact.energy}</span>
                </div>
                <div class="eco-impact-item">
                    <span class="eco-label">Air yang dihemat:</span>
                    <span class="eco-value">${randomResult.eco_impact.water}</span>
                </div>
                <div class="eco-impact-item">
                    <span class="eco-label">Waktu terurai alami:</span>
                    <span class="eco-value">${randomResult.eco_impact.decompose_time}</span>
                </div>
            `;
        }

        // Show results section
        document.getElementById('result').style.display = 'block';

        // Show view report button
        const viewReportBtn = document.getElementById('viewReportBtn');
        if (viewReportBtn) {
            viewReportBtn.style.display = 'inline-block';
        }

        // Start mini-game
        startGame(randomResult.type, randomResult);

        // Reset button state
        analyzeText.textContent = t.analyzeText;
        analyzeBtn.disabled = false;

        // Scroll to results
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
    }, 2000);
});

// Mini-game functionality dengan data storage
function startGame(itemType, resultData) {
    const gameSection = document.getElementById('minigame-wrapper');
    const itemContainer = document.getElementById('item-container');
    gameSection.style.display = 'block';

    const item = document.createElement('div');
    item.className = 'draggable-item';
    item.draggable = true;
    item.innerHTML = getItemIcon(itemType);
    item.dataset.type = itemType;
    item.dataset.result = JSON.stringify(resultData);

    itemContainer.innerHTML = '';
    itemContainer.appendChild(item);

    item.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        e.target.style.opacity = '0.5';
    });
    item.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
        draggedItem = null;
    });
}

function getItemIcon(type) {
    const icons = {
        'anorganik': '<img src="source/icons/plastic_bottle.png" alt="Anorganik" class="game-icon">',
        'organik': '<img src="source/icons/sprout.png" alt="Organik" class="game-icon">',
        'kaca': '<img src="source/icons/glass_bottle.png" alt="Kaca" class="game-icon">'
    };
    const defaultIcon = '<img src="source/icons/trashcan_category.png" alt="Sampah" class="game-icon">';
    
    return icons[type] || defaultIcon;
}

function handleDragStart(e) {
    draggedItem = this;
    this.style.opacity = '0.5';
    this.style.transform = 'rotate(5deg)';
}

function handleDragEnd(e) {
    this.style.opacity = '';
    this.style.transform = '';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = this;
    dropZone.classList.remove('drag-over');

    if (draggedItem) {
        const itemType = draggedItem.dataset.type;
        const zoneType = dropZone.id.replace('-zone', '');

        if (itemType === zoneType) {
            const resultData = JSON.parse(draggedItem.dataset.result);
            processSuccessfulSort(resultData); 
            draggedItem.remove();
        } else {
            // JIKA SALAH: Tampilkan feedback visual tanpa alert
            dropZone.classList.add('drop-incorrect');
            setTimeout(() => {
                dropZone.classList.remove('drop-incorrect');
            }, 600);
        }
    }
}

function processSuccessfulSort(resultData) {
    const user = loadUserData();
    if (user.name && user.name !== 'Anonymous') {
        saveDataAndAddExp(user.name, resultData);
        showSuccessPopup();
    } else {
        showNameInputPopup(resultData);
    }
}

function showNameInputPopup(resultData) {
    const nameInputPopup = document.getElementById('name-input-popup');
    const userNameInput = document.getElementById('userNameInput');
    const submitNameBtn = document.getElementById('submitNameBtn');
    nameInputPopup.style.display = 'flex';

    // Menggunakan { once: true } untuk mencegah listener ganda
    submitNameBtn.addEventListener('click', function handleSubmit() {
        let userName = userNameInput.value.trim() || 'Anonymous';
        const user = loadUserData();
        user.name = userName;
        saveUserData(user);
        saveDataAndAddExp(userName, resultData);
        nameInputPopup.style.display = 'none';
        showSuccessPopup();
    }, { once: true });
}

function saveDataAndAddExp(userName, resultData) {
    saveToHistory(resultData);
    updateLeaderboard(userName, resultData);
    addExp(EXP_PER_ITEM);
}

function showSuccessPopup() {
    const popup = document.getElementById('success-popup');
    const t = translations[currentLang];
    document.querySelector('#success-popup h3').textContent = t.congratulations_title;
    document.querySelector('#success-popup p:nth-of-type(1)').textContent = t.correct_sort_message;
    document.querySelector('#success-popup p:nth-of-type(2)').textContent = t.impact_saved_message;

    popup.style.display = 'flex';

    // Auto close after 3 seconds
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

// Close popup functionality
document.querySelector('.close-btn').addEventListener('click', function () {
    document.getElementById('success-popup').style.display = 'none';
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(20, 50, 30, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(20, 50, 30, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Add shake animation
const shakeKeyframes = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }`;

const style = document.createElement('style');
style.textContent = shakeKeyframes;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function () {
    loadTranslations(currentLang); 
    updateNavbarUI();

    const levelUpStyles = `
        @keyframes levelUpPulse {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;

    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => e.preventDefault());
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragenter', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    });

    const style = document.createElement('style');
    style.textContent = levelUpStyles;
    document.head.appendChild(style);
    
    const viewReportBtn = document.getElementById('viewReportBtn');
    if (viewReportBtn) {
        viewReportBtn.addEventListener('click', function() {
            window.location.href = 'report.html';
        });
    }
});

// Drag and drop for upload area
const uploadArea = document.querySelector('.upload-area');

uploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    this.style.borderColor = '#45a049';
    this.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
});

uploadArea.addEventListener('dragleave', function (e) {
    e.preventDefault();
    this.style.borderColor = '#4CAF50';
    this.style.backgroundColor = 'linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(76, 175, 80, 0.1))';
});

uploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    this.style.borderColor = '#4CAF50';
    this.style.backgroundColor = 'linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(76, 175, 80, 0.1))';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        imageUpload.files = files;
        const event = new Event('change', { bubbles: true });
        imageUpload.dispatchEvent(event);
    }
});