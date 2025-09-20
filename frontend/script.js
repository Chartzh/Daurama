let draggedItem = null;
let isGameActive = false; // Flag untuk melacak status mini-game

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

// Updated analysis function with rich data
analyzeBtn.addEventListener('click', async function () {
    const file = imageUpload.files[0];

    if (!file) {
        alert('Please select an image first!');
        return;
    }

    // Show loading state
    const analyzeText = document.getElementById('analyzeText');
    analyzeText.innerHTML = '<span class="loading"></span> Analyzing...';
    analyzeBtn.disabled = true;

    // Simulate API call delay with enriched mock data
    setTimeout(() => {
        // Mock results with more detailed data
        const mockResults = [
            {
                object_name: 'Plastic Bottle',
                type: 'anorganik',
                material: 'PET (Polyethylene Terephthalate)',
                instructions: 'Remove cap and label. Rinse bottle. Place in plastic recycling bin.',
                eco_impact: {
                    co2: '250g',
                    energy: '3 hours of LED light',
                    water: '2.5 liters of clean water',
                    decompose_time: '450 years'
                },
                timestamp: new Date().toISOString()
            },
            {
                object_name: 'Glass Bottle',
                type: 'kaca',
                material: 'Soda-Lime Glass',
                instructions: 'Remove labels. Rinse thoroughly. Place in glass recycling bin.',
                eco_impact: {
                    co2: '400g',
                    energy: '5 hours of LED light',
                    water: '0.5 liters of clean water',
                    decompose_time: '1000 years'
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
                    energy: '1 hour of LED light',
                    water: '5 liters of clean water',
                    decompose_time: '3 months'
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
                    energy: '8 hours of LED light',
                    water: '1 liter of clean water',
                    decompose_time: '200 years'
                },
                timestamp: new Date().toISOString()
            }
        ];

        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];

        // Update result display
        objectNameDisplay.textContent = randomResult.object_name;
        instructionsDisplay.textContent = randomResult.instructions;

        // Update new material and eco impact display
        const materialDisplay = document.getElementById('materialDisplay');
        const ecoImpactDisplay = document.getElementById('ecoImpactDisplay');

        if (materialDisplay) {
            materialDisplay.textContent = randomResult.material;
        }

        if (ecoImpactDisplay) {
            ecoImpactDisplay.innerHTML = `
                <div class="eco-impact-item">
                    <span class="eco-label">CO₂ Saved:</span>
                    <span class="eco-value">${randomResult.eco_impact.co2}</span>
                </div>
                <div class="eco-impact-item">
                    <span class="eco-label">Energy Saved:</span>
                    <span class="eco-value">${randomResult.eco_impact.energy}</span>
                </div>
                <div class="eco-impact-item">
                    <span class="eco-label">Water Saved:</span>
                    <span class="eco-value">${randomResult.eco_impact.water}</span>
                </div>
                <div class="eco-impact-item">
                    <span class="eco-label">Natural Decompose Time:</span>
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
        analyzeText.textContent = 'Analyze Waste';
        analyzeBtn.disabled = false;

        // Scroll to results
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
    }, 2000);
});

// Mini-game functionality with data storage
function startGame(itemType, resultData) {
    const gameSection = document.getElementById('minigame-wrapper');
    const itemContainer = document.getElementById('item-container');
    
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

    isGameActive = true; // PERBAIKAN: Set game menjadi aktif
    gameSection.style.display = 'block'; // Tampilkan sesi game
}

function getItemIcon(type) {
    const icons = {
        'anorganik': '<img src="source/icons/plastic_bottle.png" alt="Inorganic" class="game-icon">',
        'organik': '<img src="source/icons/box.png" alt="Organic" class="game-icon">',
        'kaca': '<img src="source/icons/glass_bottle.png" alt="Glass" class="game-icon">'
    };
    const defaultIcon = '<img src="source/icons/trashcan_category.png" alt="Waste" class="game-icon">';
    
    return icons[type] || defaultIcon;
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = this;
    dropZone.classList.remove('drag-over');

    // PERBAIKAN: Hanya proses jika item ada dan game sedang aktif
    if (draggedItem && isGameActive) {
        const itemType = draggedItem.dataset.type;
        const zoneType = dropZone.id.replace('-zone', '');

        if (itemType === zoneType) {
            // JIKA BENAR
            isGameActive = false; // PERBAIKAN: Langsung nonaktifkan game untuk mencegah input ganda

            const resultData = JSON.parse(draggedItem.dataset.result);
            processSuccessfulSort(resultData); 
            
            draggedItem.remove(); // Hapus item dari DOM

            // PERBAIKAN: Sembunyikan sesi game setelah berhasil
            const gameSection = document.getElementById('minigame-wrapper');
            setTimeout(() => {
                gameSection.style.display = 'none';
            }, 500);

        } else {
            // JIKA SALAH: Tampilkan feedback visual
            dropZone.classList.add('drop-incorrect');
            setTimeout(() => {
                dropZone.classList.remove('drop-incorrect');
            }, 600);
        }
    }
}

function processSuccessfulSort(resultData) {
    const user = loadUserData();
    const oldExp = user.exp;
    
    if (user.name && user.name !== 'Anonymous') {
        saveDataAndAddExp(user.name, resultData);
        
        const newUser = loadUserData();
        checkLevelUp(oldExp, newUser.exp);
        
        showSuccessPopup();
    } else {
        showNameInputPopup(resultData, oldExp);
    }
}

function showNameInputPopup(resultData, oldExp) {
    const nameInputPopup = document.getElementById('name-input-popup');
    const userNameInput = document.getElementById('userNameInput');
    const submitNameBtn = document.getElementById('submitNameBtn');
    nameInputPopup.style.display = 'flex';

    submitNameBtn.addEventListener('click', function handleSubmit() {
        let userName = userNameInput.value.trim() || 'Anonymous';
        const user = loadUserData();
        user.name = userName;
        saveUserData(user);
        saveDataAndAddExp(userName, resultData);
        
        const newUser = loadUserData();
        checkLevelUp(oldExp, newUser.exp);
        
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
    popup.style.display = 'flex';

    // Auto close after 3 seconds
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

// Close popup functionality
document.querySelector('#success-popup .close-btn').addEventListener('click', function () {
    document.getElementById('success-popup').style.display = 'none';
});

document.querySelector('#name-input-popup .close-btn').addEventListener('click', function () {
    document.getElementById('name-input-popup').style.display = 'none';
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

document.addEventListener('DOMContentLoaded', function () {
    updateNavbarUI();
    updatePetPreview();

    const petPreview = document.getElementById('pet-preview');
    if (petPreview) {
        petPreview.addEventListener('click', showPetCard);
    }

    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => e.preventDefault());
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragenter', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    });
    
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