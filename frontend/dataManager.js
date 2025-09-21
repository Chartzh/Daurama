const KEY_USER = 'dauramaUser';
const KEY_HISTORY = 'dauramaHistory';
const KEY_LEADERBOARD = 'dauramaLeaderboard';
const EXP_PER_ITEM = 25;
const EXP_TO_LEVEL_UP = 100;

/**
 * Loads user data (level, exp, name, petName) from localStorage.
 * @returns {object} The user data object.
 */
function loadUserData() {
    try {
        const data = JSON.parse(localStorage.getItem(KEY_USER));
        if (data && typeof data.level === 'number' && typeof data.exp === 'number') {
            const calculatedLevel = Math.floor(data.exp / EXP_TO_LEVEL_UP) + 1;
            
            if (data.level !== calculatedLevel) {
                console.warn(
                    `Inconsistency detected! Stored level was ${data.level}, but calculated level is ${calculatedLevel}. Correcting...`
                );
                data.level = calculatedLevel; 
                saveUserData(data); 
            }

            if (!data.petName) {
                data.petName = 'Nura';
                saveUserData(data); 
            }

            return data;
        }
    } catch (e) {
        console.error("Failed to load user data:", e);
    }
    
    return { 
        level: 1, 
        exp: 0, 
        name: '', 
        petName: 'Nura' 
    };
}

/**
 * Update pet name in user data
 * @param {string} newPetName - The new pet name
 */
function updatePetName(newPetName) {
    const user = loadUserData();
    user.petName = newPetName.trim() || 'Nura'; // Fallback to default if empty
    saveUserData(user);
    
    // Update any visible pet name displays
    updatePetNameDisplays();
}

/**
 * Update pet name displays across the page
 */
function updatePetNameDisplays() {
    const user = loadUserData();
    const petNameElements = [
        document.getElementById('pet-name-display'),
        document.getElementById('card-pet-name')
    ];
    
    petNameElements.forEach(element => {
        if (element) {
            element.textContent = user.petName;
        }
    });
}

/**
 * Saves user data to localStorage.
 * @param {object} userData - The user data object to save.
 */
function saveUserData(userData) {
    localStorage.setItem(KEY_USER, JSON.stringify(userData));
}

/**
 * Adds experience points (EXP) to the user and handles leveling up.
 * @param {number} amount - The amount of EXP to add.
 */
function addExp(amount) {
    const user = loadUserData();
    user.exp += amount; 

    const newLevel = Math.floor(user.exp / EXP_TO_LEVEL_UP) + 1;
    
    if (newLevel > user.level) {
        console.log(`LEVEL UP! Reached level ${newLevel}`);
    }
    user.level = newLevel; 

    saveUserData(user); 
    updateNavbarUI(); 
}

/**
 * Updates the Level and EXP display in the navbar.
 * This function is called from every page.
 */
function updateNavbarUI() {
    const user = loadUserData();
    const userLevelEl = document.getElementById('user-level');
    const userExpEl = document.getElementById('user-exp');
    const expProgressEl = document.getElementById('exp-progress');
    const currentLevelExp = user.exp % EXP_TO_LEVEL_UP;

    if (userLevelEl) userLevelEl.textContent = user.level;
    if (userExpEl) userExpEl.textContent = currentLevelExp; 
    
    if (expProgressEl) {
        const progressPercentage = (currentLevelExp / EXP_TO_LEVEL_UP) * 100;
        expProgressEl.style.width = `${progressPercentage}%`;
    }
}


/**
 * Loads activity history from localStorage.
 * @returns {Array} Array of history items.
 */
function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem(KEY_HISTORY)) || [];
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return [];
    }
}

function saveToHistory(resultData) {
    try {
        let history = JSON.parse(localStorage.getItem(KEY_HISTORY)) || [];

        // Add a timestamp if it doesn't exist
        if (!resultData.timestamp) {
            resultData.timestamp = new Date().toISOString();
        }

        // Add a unique ID
        resultData.id = Date.now() + Math.random();

        history.push(resultData);
        localStorage.setItem(KEY_HISTORY, JSON.stringify(history));

        console.log('Data saved to history:', resultData);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Loads leaderboard data from localStorage.
 * @returns {Array} Array of leaderboard entries.
 */
function loadLeaderboard() {
    try {
        return JSON.parse(localStorage.getItem(KEY_LEADERBOARD)) || [];
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
        return [];
    }
}

/**
 * Updates the leaderboard with new data.
 * @param {string} userName - The user's name.
 * @param {object} resultData - The analysis result data.
 */
function updateLeaderboard(userName, resultData) {
    let leaderboard = JSON.parse(localStorage.getItem(KEY_LEADERBOARD)) || [];
    let userEntry = leaderboard.find(entry => entry.name === userName);

    const co2Saved = parseInt(resultData.eco_impact?.co2?.match(/(\d+)/)?.[1] || 0);
    const energySaved = parseFloat(resultData.eco_impact?.energy?.match(/(\d+\.?\d*)/)?.[1] || 0);
    const waterSaved = parseFloat(resultData.eco_impact?.water?.match(/(\d+\.?\d*)/)?.[1] || 0);

    if (userEntry) {
        userEntry.itemsRecycled = (userEntry.itemsRecycled || 0) + 1;
        userEntry.totalCO2Saved = (userEntry.totalCO2Saved || 0) + co2Saved;
        userEntry.totalEnergySaved = (userEntry.totalEnergySaved || 0) + energySaved;
        userEntry.totalWaterSaved = (userEntry.totalWaterSaved || 0) + waterSaved;
        
        userEntry.totalExp = userEntry.itemsRecycled * 25;
        userEntry.level = Math.floor(userEntry.totalExp / 100) + 1;
    } else {
        const totalExp = 25; 
        userEntry = {
            name: userName,
            itemsRecycled: 1,
            totalCO2Saved: co2Saved,
            totalEnergySaved: energySaved,
            totalWaterSaved: waterSaved,
            totalExp: totalExp,
            level: Math.floor(totalExp / 100) + 1,
        };
        leaderboard.push(userEntry);
    }

    leaderboard.sort((a, b) => {
        if (b.itemsRecycled === a.itemsRecycled) {
            return (b.level || 1) - (a.level || 1);
        }
        return b.itemsRecycled - a.itemsRecycled;
    });
    
    localStorage.setItem(KEY_LEADERBOARD, JSON.stringify(leaderboard));
}

/**
 * Get pet level based on experience points
 * @param {number} exp - Total experience points
 * @returns {number} Pet level
 */
function getPetLevel(exp) {
    return Math.floor(exp / 100) + 1;
}

/**
 * Get current level experience (0-99)
 * @param {number} exp - Total experience points  
 * @returns {number} Experience within current level
 */
function getCurrentLevelExp(exp) {
    return exp % 100;
}

/**
 * Update pet preview in navbar (if function doesn't exist in profile.js)
 */
function updatePetPreview() {
    const user = loadUserData();
    const level = getPetLevel(user.exp);
    const petPreview = document.getElementById('pet-preview');
    
    if (petPreview) {
        let imagePath;
        if (level <= 2) {
            imagePath = 'source/pets/cat-level-1.png';
        } else if (level <= 4) {
            imagePath = 'source/pets/cat-level-3.png';
        } else if (level <= 6) {
            imagePath = 'source/pets/cat-level-5.png';
        } else {
            imagePath = 'source/pets/cat-level-7.png';
        }
        
        petPreview.src = imagePath;
        petPreview.alt = `Pet Level ${level}`;
    }
}