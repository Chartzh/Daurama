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
        view_report: 'Lihat Laporan Dampak'
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
        view_report: 'View Impact Report'
    }
};

// Global functions untuk localStorage
function saveToHistory(resultData) {
    try {
        let history = JSON.parse(localStorage.getItem('dauramaHistory')) || [];
        
        // Tambahkan timestamp jika belum ada
        if (!resultData.timestamp) {
            resultData.timestamp = new Date().toISOString();
        }
        
        // Tambahkan ID unik
        resultData.id = Date.now() + Math.random();
        
        history.push(resultData);
        localStorage.setItem('dauramaHistory', JSON.stringify(history));
        
        console.log('Data saved to history:', resultData);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem('dauramaHistory')) || [];
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return [];
    }
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
    
    if (materialLabel) materialLabel.textContent = t.resultMaterialLabel;
    if (ecoImpactLabel) ecoImpactLabel.textContent = t.resultEcoImpactLabel;
    if (viewReportBtn) viewReportBtn.textContent = t.view_report;

    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
}

// Event listeners
document.getElementById('lang-en').addEventListener('click', () => loadTranslations('en'));
document.getElementById('lang-id').addEventListener('click', () => loadTranslations('id'));

// Image upload functionality
const imageUpload = document.getElementById('imageUpload');
const preview = document.getElementById('preview');
const analyzeBtn = document.getElementById('analyzeBtn');
const objectNameDisplay = document.getElementById('objectNameDisplay');
const instructionsDisplay = document.getElementById('instructionsDisplay');

imageUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
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

    // Create draggable item
    const item = document.createElement('div');
    item.className = 'draggable-item';
    item.draggable = true;
    item.textContent = getItemIcon(itemType);
    item.dataset.type = itemType;
    
    // Store complete result data in dataset
    item.dataset.result = JSON.stringify(resultData);

    // Clear previous items
    itemContainer.innerHTML = '';
    itemContainer.appendChild(item);

    // Add drag event listeners
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);

    // Add drop zone listeners
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
    });

    // Scroll to game
    gameSection.scrollIntoView({ behavior: 'smooth' });
}

function getItemIcon(type) {
    const icons = {
        'anorganik': '🥤',
        'organik': '📦',
        'kaca': '🍾'
    };
    return icons[type] || '🗑️';
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
    this.classList.remove('drag-over');

    if (draggedItem) {
        const itemType = draggedItem.dataset.type;
        const zoneType = this.id.replace('-zone', '');

        if (itemType === zoneType) {
            // Correct drop - save to history
            try {
                const resultData = JSON.parse(draggedItem.dataset.result);
                saveToHistory(resultData);
                console.log('Data berhasil disimpan ke riwayat');
            } catch (error) {
                console.error('Error parsing result data:', error);
            }
            
            showSuccessPopup();
            draggedItem.style.transform = 'scale(0)';
            setTimeout(() => {
                document.getElementById('item-container').innerHTML = '<div style="color: #4CAF50; font-size: 2rem;"><i class="fas fa-check-circle"></i> Correct!</div>';
            }, 300);
        } else {
            // Incorrect drop
            draggedItem.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                draggedItem.style.animation = '';
            }, 500);
        }
    }
}

function showSuccessPopup() {
    const popup = document.getElementById('success-popup');
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

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    loadTranslations(currentLang);
    
    // Add event listener untuk tombol "View Report"
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