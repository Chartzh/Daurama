const KEY_USER = 'dauramaUser';
const KEY_HISTORY = 'dauramaHistory';
const KEY_LEADERBOARD = 'dauramaLeaderboard';
const EXP_PER_ITEM = 25;
const EXP_TO_LEVEL_UP = 100;

/**
 * Memuat data pengguna (level, exp, nama) dari localStorage.
 * @returns {object} Objek data pengguna.
 */
function loadUserData() {
    try {
        const data = JSON.parse(localStorage.getItem(KEY_USER));
        if (data && typeof data.level === 'number' && typeof data.exp === 'number') {
            return data;
        }
    } catch (e) {
        console.error("Gagal memuat data pengguna:", e);
    }
    // Mengembalikan data default jika tidak ada atau tidak valid
    return { level: 1, exp: 0, name: '' };
}

/**
 * Menyimpan data pengguna ke localStorage.
 * @param {object} userData - Objek data pengguna untuk disimpan.
 */
function saveUserData(userData) {
    localStorage.setItem(KEY_USER, JSON.stringify(userData));
}

/**
 * Menambahkan poin pengalaman (EXP) ke pengguna dan menangani kenaikan level.
 * @param {number} amount - Jumlah EXP yang ditambahkan.
 */
function addExp(amount) {
    const user = loadUserData();
    user.exp += amount;

    while (user.exp >= EXP_TO_LEVEL_UP) {
        user.exp -= EXP_TO_LEVEL_UP;
        user.level += 1;
        console.log(`NAIK LEVEL! Mencapai level ${user.level}`);
    }
    
    saveUserData(user);
    updateNavbarUI(); // Perbarui UI setelah menambah EXP
}

/**
 * Memperbarui tampilan Level dan EXP di navbar.
 * Fungsi ini dipanggil dari setiap halaman.
 */
function updateNavbarUI() {
    const user = loadUserData();
    const userLevelEl = document.getElementById('user-level');
    const userExpEl = document.getElementById('user-exp');
    const expProgressEl = document.getElementById('exp-progress');

    if (userLevelEl) userLevelEl.textContent = user.level;
    if (userExpEl) userExpEl.textContent = user.exp;
    
    if (expProgressEl) {
        const progressPercentage = (user.exp / EXP_TO_LEVEL_UP) * 100;
        expProgressEl.style.width = `${progressPercentage}%`;
    }
}


/**
 * Memuat riwayat aktivitas dari localStorage.
 * @returns {Array} Array item riwayat.
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

        // Tambahkan timestamp jika belum ada
        if (!resultData.timestamp) {
            resultData.timestamp = new Date().toISOString();
        }

        // Tambahkan ID unik
        resultData.id = Date.now() + Math.random();

        history.push(resultData);
        localStorage.setItem(KEY_HISTORY, JSON.stringify(history));

        console.log('Data saved to history:', resultData);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Memuat data papan peringkat dari localStorage.
 * @returns {Array} Array entri papan peringkat.
 */
function loadLeaderboard() {
    try {
        return JSON.parse(localStorage.getItem(KEY_LEADERBOARD)) || [];
    } catch (error) {
        console.error('Gagal memuat papan peringkat:', error);
        return [];
    }
}

/**
 * Memperbarui papan peringkat dengan data baru.
 * @param {string} userName - Nama pengguna.
 * @param {object} resultData - Data hasil analisis.
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