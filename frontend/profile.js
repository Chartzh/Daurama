// Pet Profile System
const PET_NAMES = ['Nura', 'Luna', 'Max', 'Bella', 'Charlie'];

/**
 * Calculate pet level based on total EXP
 * @param {number} exp - Total experience points
 * @returns {number} Pet level
 */
function getPetLevel(exp) {
    return Math.floor(exp / 100) + 1;
}

/**
 * Get pet image path based on level
 * @param {number} level - Pet level
 * @returns {string} Image path
 */
function getPetImageByLevel(level) {
    if (level <= 2) {
        return 'source/pets/cat-level-1.png';
    } else if (level <= 4) {
        return 'source/pets/cat-level-3.png';
    } else if (level <= 6) {
        return 'source/pets/cat-level-5.png';
    } else {
        return 'source/pets/cat-level-7.png';
    }
}

/**
 * Get pet name based on level (or stored name)
 * @param {number} level - Pet level
 * @returns {string} Pet name
 */
function getPetName(level) {
    const storedName = localStorage.getItem('petName');
    if (storedName) {
        return storedName;
    }
    
    // Default name based on level
    const nameIndex = Math.min(level - 1, PET_NAMES.length - 1);
    return PET_NAMES[nameIndex];
}

/**
 * Get EXP needed for current level progress
 * @param {number} exp - Total experience points
 * @returns {number} EXP within current level (0-99)
 */
function getCurrentLevelExp(exp) {
    return exp % 100;
}

/**
 * Calculate recycling statistics
 * @returns {object} Stats object with items recycled and days active
 */
function calculatePetStats() {
    const history = loadHistory();
    const itemsRecycled = history.length;
    
    // Calculate unique days
    const uniqueDates = new Set();
    history.forEach(item => {
        if (item.timestamp) {
            const date = new Date(item.timestamp).toDateString();
            uniqueDates.add(date);
        }
    });
    const daysActive = uniqueDates.size;
    
    return { itemsRecycled, daysActive };
}

/**
 * Update pet preview in navbar
 */
function updatePetPreview() {
    const user = loadUserData();
    const level = getPetLevel(user.exp);
    const petPreview = document.getElementById('pet-preview');
    
    if (petPreview) {
        petPreview.src = getPetImageByLevel(level);
        petPreview.alt = `Pet Level ${level}`;
    }
}

/**
 * Render pet profile information
 */
function renderPetProfile() {
    const user = loadUserData();
    const level = getPetLevel(user.exp);
    const currentExp = getCurrentLevelExp(user.exp);
    const petName = getPetName(level);
    const stats = calculatePetStats();
    
    // Update main pet image and info
    const petImage = document.getElementById('pet-image');
    const petLevelEl = document.getElementById('pet-level');
    const petLevelDisplay = document.getElementById('pet-level-display');
    const petExpEl = document.getElementById('pet-exp');
    const petNameEl = document.getElementById('pet-name');
    const itemsRecycledEl = document.getElementById('items-recycled');
    const daysActiveEl = document.getElementById('days-active');
    const petExpProgress = document.getElementById('pet-exp-progress');
    
    if (petImage) petImage.src = getPetImageByLevel(level);
    if (petLevelEl) petLevelEl.textContent = level;
    if (petLevelDisplay) petLevelDisplay.textContent = level;
    if (petExpEl) petExpEl.textContent = currentExp;
    if (petNameEl) petNameEl.textContent = petName;
    if (itemsRecycledEl) itemsRecycledEl.textContent = stats.itemsRecycled;
    if (daysActiveEl) daysActiveEl.textContent = stats.daysActive;
    
    // Update progress bar
    if (petExpProgress) {
        const progressPercentage = (currentExp / 100) * 100;
        petExpProgress.style.width = `${progressPercentage}%`;
    }
    
    // Highlight current evolution stage
    const evolutionStages = document.querySelectorAll('.evolution-stage');
    evolutionStages.forEach(stage => {
        const stageLevel = parseInt(stage.dataset.level);
        stage.classList.remove('active', 'completed');
        
        if (level >= stageLevel) {
            if ((stageLevel === 1 && level <= 2) || 
                (stageLevel === 3 && level >= 3 && level <= 4) ||
                (stageLevel === 5 && level >= 5 && level <= 6) ||
                (stageLevel === 7 && level >= 7)) {
                stage.classList.add('active');
            } else if (stageLevel < level) {
                stage.classList.add('completed');
            }
        }
    });
    
    // Update navbar
    updateNavbarUI();
    updatePetPreview();
}

/**
 * Show pet card overlay (for navbar preview)
 */
function showPetCard() {
    const user = loadUserData();
    const level = getPetLevel(user.exp);
    const currentExp = getCurrentLevelExp(user.exp);
    const petName = getPetName(level);
    
    const overlay = document.getElementById('pet-card-overlay');
    const cardPetName = document.getElementById('card-pet-name');
    const cardPetImage = document.getElementById('card-pet-image');
    const cardPetLevel = document.getElementById('card-pet-level');
    const cardPetExp = document.getElementById('card-pet-exp');
    const cardExpProgress = document.getElementById('card-exp-progress');
    
    if (cardPetName) cardPetName.textContent = petName;
    if (cardPetImage) cardPetImage.src = getPetImageByLevel(level);
    if (cardPetLevel) cardPetLevel.textContent = level;
    if (cardPetExp) cardPetExp.textContent = currentExp;
    
    if (cardExpProgress) {
        const progressPercentage = (currentExp / 100) * 100;
        cardExpProgress.style.width = `${progressPercentage}%`;
    }
    
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

/**
 * Hide pet card overlay
 */
function hidePetCard() {
    const overlay = document.getElementById('pet-card-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

/**
 * Initialize profile page
 */
function initializeProfile() {
    renderPetProfile();
    
    // Add click event to pet preview if it exists
    const petPreview = document.getElementById('pet-preview');
    if (petPreview) {
        petPreview.addEventListener('click', showPetCard);
    }
    
    // Close pet card when clicking outside
    const overlay = document.getElementById('pet-card-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hidePetCard();
            }
        });
    }
}

/**
 * Check for level up and show notification
 * @param {number} oldExp - Previous EXP amount
 * @param {number} newExp - New EXP amount
 */
function checkLevelUp(oldExp, newExp) {
    const oldLevel = getPetLevel(oldExp);
    const newLevel = getPetLevel(newExp);
    
    if (newLevel > oldLevel) {
        showPetLevelUpNotification(newLevel);
    }
}

/**
 * Show pet level up notification
 * @param {number} newLevel - The new level achieved
 */
function showPetLevelUpNotification(newLevel) {
    const petName = getPetName(newLevel);
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #4CAF50, #45a049); color: white;
        padding: 2rem; border-radius: 15px; text-align: center; z-index: 3000;
        box-shadow: 0 20px 60px rgba(76, 175, 80, 0.3); 
        animation: petLevelUpPulse 0.5s ease-in-out;
    `;
    notification.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">
            <img src="${getPetImageByLevel(newLevel)}" alt="Pet" style="width: 80px; height: 80px; border-radius: 50%;">
        </div>
        <h3>${petName} Leveled Up!</h3>
        <p>Your pet reached Level ${newLevel}!</p>
        <p style="font-size: 0.9rem; opacity: 0.9;">Keep recycling to help ${petName} grow even more!</p>
    `;
    
    // Add animation keyframes
    if (!document.getElementById('pet-level-up-styles')) {
        const style = document.createElement('style');
        style.id = 'pet-level-up-styles';
        style.textContent = `
            @keyframes petLevelUpPulse {
                0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    setTimeout(() => { 
        if (notification.parentNode) {
            notification.remove(); 
        }
    }, 4000);
}

// Global functions for navbar integration
window.showPetCard = showPetCard;
window.hidePetCard = hidePetCard;
window.updatePetPreview = updatePetPreview;
window.checkLevelUp = checkLevelUp;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeProfile();
    
    // Update pet preview on any page load
    updatePetPreview();
});