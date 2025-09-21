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
 * Initialize pet name editing functionality
 */
function initializePetNameEditing() {
    const editBtn = document.getElementById('edit-pet-name-btn');
    const saveBtn = document.getElementById('save-pet-name-btn');
    const cancelBtn = document.getElementById('cancel-pet-name-btn');
    const nameDisplay = document.getElementById('pet-name-display');
    const nameForm = document.getElementById('pet-name-edit-form');
    const nameInput = document.getElementById('pet-name-input');
    
    if (!editBtn || !saveBtn || !cancelBtn || !nameDisplay || !nameForm || !nameInput) {
        return; // Elements not found, probably not on profile page
    }
    
    // Edit button click handler
    editBtn.addEventListener('click', function() {
        const user = loadUserData();
        nameInput.value = user.petName || 'Nura';
        nameDisplay.style.display = 'none';
        editBtn.style.display = 'none';
        nameForm.style.display = 'flex';
        nameInput.focus();
        nameInput.select();
    });
    
    // Save button click handler
    saveBtn.addEventListener('click', function() {
        const newName = nameInput.value.trim();
        if (newName.length === 0) {
            alert('Pet name cannot be empty!');
            return;
        }
        if (newName.length > 20) {
            alert('Pet name must be 20 characters or less!');
            return;
        }
        
        // Update pet name in data
        updatePetName(newName);
        
        // Hide form and show display
        nameForm.style.display = 'none';
        nameDisplay.style.display = 'inline';
        editBtn.style.display = 'inline-block';
        
        // Show success feedback
        showPetNameUpdateSuccess(newName);
    });
    
    // Cancel button click handler
    cancelBtn.addEventListener('click', function() {
        nameForm.style.display = 'none';
        nameDisplay.style.display = 'inline';
        editBtn.style.display = 'inline-block';
    });
    
    // Handle Enter key in input
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveBtn.click();
        }
        if (e.key === 'Escape') {
            cancelBtn.click();
        }
    });
}

/**
 * Show success message when pet name is updated
 * @param {string} newName - The new pet name
 */
function showPetNameUpdateSuccess(newName) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 3000;
        background: linear-gradient(135deg, #4CAF50, #45a049); color: white;
        padding: 1rem 1.5rem; border-radius: 10px; 
        box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-check-circle"></i>
            <span>Pet name updated to "${newName}"!</span>
        </div>
    `;
    
    // Add animation keyframes if not exists
    if (!document.getElementById('pet-name-success-styles')) {
        const style = document.createElement('style');
        style.id = 'pet-name-success-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    setTimeout(() => { 
        if (notification.parentNode) {
            notification.remove(); 
        }
    }, 3000);
}

/**
 * Render pet profile information
 */
function renderPetProfile() {
    const user = loadUserData();
    const level = getPetLevel(user.exp);
    const currentExp = getCurrentLevelExp(user.exp);
    const petName = user.petName || 'Nura'; // Get pet name from user data
    const stats = calculatePetStats();
    
    // Update main pet image and info
    const petImage = document.getElementById('pet-image');
    const petLevelEl = document.getElementById('pet-level');
    const petLevelDisplay = document.getElementById('pet-level-display');
    const petExpEl = document.getElementById('pet-exp');
    const petNameDisplay = document.getElementById('pet-name-display');
    const itemsRecycledEl = document.getElementById('items-recycled');
    const daysActiveEl = document.getElementById('days-active');
    const petExpProgress = document.getElementById('pet-exp-progress');
    
    if (petImage) petImage.src = getPetImageByLevel(level);
    if (petLevelEl) petLevelEl.textContent = level;
    if (petLevelDisplay) petLevelDisplay.textContent = level;
    if (petExpEl) petExpEl.textContent = currentExp;
    if (petNameDisplay) petNameDisplay.textContent = petName; // Use stored pet name
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
    const petName = user.petName || 'Nura'; // Use stored pet name
    
    const overlay = document.getElementById('pet-card-overlay');
    const cardPetName = document.getElementById('card-pet-name');
    const cardPetImage = document.getElementById('card-pet-image');
    const cardPetLevel = document.getElementById('card-pet-level');
    const cardPetExp = document.getElementById('card-pet-exp');
    const cardExpProgress = document.getElementById('card-exp-progress');
    
    if (cardPetName) cardPetName.textContent = petName; // Use stored pet name
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
    
    // Initialize pet name editing (only on profile page)
    initializePetNameEditing();
    
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