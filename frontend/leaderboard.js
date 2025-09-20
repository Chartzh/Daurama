// Save leaderboard data to localStorage
function saveLeaderboard(leaderboardData) {
    try {
        localStorage.setItem('dauramaLeaderboard', JSON.stringify(leaderboardData));
    } catch (error) {
        console.error('Error saving leaderboard to localStorage:', error);
    }
}

/**
 * Calculate and display pet level distribution
 */
function renderPetLevelDistribution(enhancedData) {
    const distribution = {
        'level-1-2': 0,
        'level-3-4': 0,
        'level-5-6': 0,
        'level-7-plus': 0
    };
    
    enhancedData.forEach(entry => {
        if (entry.level <= 2) {
            distribution['level-1-2']++;
        } else if (entry.level <= 4) {
            distribution['level-3-4']++;
        } else if (entry.level <= 6) {
            distribution['level-5-6']++;
        } else {
            distribution['level-7-plus']++;
        }
    });
    
    // Update display
    Object.keys(distribution).forEach(key => {
        const element = document.getElementById(`${key}-count`);
        if (element) {
            const count = distribution[key];
            element.textContent = `${count} ${count === 1 ? 'User' : 'Users'}`;
            
            // Add visual indicator for most popular level
            const parentStat = element.closest('.level-stat');
            if (parentStat) {
                parentStat.classList.remove('most-popular');
                if (count === Math.max(...Object.values(distribution)) && count > 0) {
                    parentStat.classList.add('most-popular');
                }
            }
        }
    });
}

function enhanceLeaderboardData(leaderboardData) {
    return leaderboardData.map(entry => {
        const totalExp = entry.itemsRecycled * 25;
        const level = Math.floor(totalExp / 100) + 1;

        let petImage;
        if (level <= 2) {
            petImage = 'source/pets/cat-level-1.png';
        } else if (level <= 4) {
            petImage = 'source/pets/cat-level-3.png';
        } else if (level <= 6) {
            petImage = 'source/pets/cat-level-5.png';
        } else {
            petImage = 'source/pets/cat-level-7.png';
        }

        return {
            ...entry,
            level: level,
            totalExp: totalExp,
            petImage: petImage
        };
    });
}

// Render leaderboard
function renderLeaderboard(leaderboardData) {
    const leaderboardList = document.getElementById('leaderboard-list');
    
    if (leaderboardData.length === 0) {
        leaderboardList.innerHTML = `
            <div class="no-history">
                <div class="no-history-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <p>Belum ada data di papan peringkat.</p>
                <p>Jadilah yang pertama dengan mulai mendaur ulang!</p>
                <a href="index.html#analyze" class="back-button" style="margin-top: 2rem;">
                    <i class="fas fa-plus"></i>
                    Mulai Analisis
                </a>
            </div>
        `;
        return;
    }

    const enhancedData = enhanceLeaderboardData(leaderboardData);
    renderPetLevelDistribution(enhancedData);

    let leaderboardHTML = `
        <div class="leaderboard-header-row">
            <div>Rank</div>
            <div>Pet & Nama</div>
            <div>Level</div>
            <div>Items</div>
            <div>CO<sup>2</sup> Saved</div>
            <div>Energy</div>
            <div>Water</div>
        </div>
    `;

    enhancedData.forEach((entry, index) => {
        const rank = index + 1;
        let rankIcon = '';
        
        // Add trophy icons for top 3
        if (rank === 1) rankIcon = '<i class="fas fa-trophy trophy-icon"></i>';
        else if (rank === 2) rankIcon = '<i class="fas fa-medal trophy-icon" style="color: #C0C0C0;"></i>';
        else if (rank === 3) rankIcon = '<i class="fas fa-medal trophy-icon" style="color: #CD7F32;"></i>';

        leaderboardHTML += `
            <div class="leaderboard-item">
                <div class="leaderboard-rank">
                    ${rankIcon} ${rank}
                </div>
                <div class="leaderboard-user-info">
                    <div class="user-pet-preview">
                        <img src="${entry.petImage}" alt="Pet Level ${entry.level}" class="leaderboard-pet-image">
                    </div>
                    <div class="user-name-info">
                        <span class="user-name">${entry.name}</span>
                        <span class="user-title">Eco Warrior</span>
                    </div>
                </div>
                <div class="leaderboard-level">
                    <div class="level-badge-small">
                        <i class="fas fa-star"></i>
                        <span>${entry.level}</span>
                    </div>
                </div>
                <div class="leaderboard-value">${entry.itemsRecycled}</div>
                <div class="leaderboard-value">${entry.totalCO2Saved}g</div>
                <div class="leaderboard-value">${entry.totalEnergySaved.toFixed(1)} jam</div>
                <div class="leaderboard-value">${entry.totalWaterSaved.toFixed(1)}L</div>
            </div>
        `;
    });

    leaderboardList.innerHTML = leaderboardHTML;
}

// Initialize leaderboard page
function initializeLeaderboard() {
    const leaderboardData = loadLeaderboard();
    renderLeaderboard(leaderboardData);
    updateNavbarUI();

    if (typeof updatePetPreview === 'function') {
        updatePetPreview();
    }

    const petPreview = document.getElementById('pet-preview');
    if (petPreview && typeof showPetCard === 'function') {
        petPreview.addEventListener('click', showPetCard);
    }
    
    setInterval(() => {
        const currentData = JSON.stringify(loadLeaderboard());
        if (currentData !== window.lastLeaderboardData) {
            window.lastLeaderboardData = currentData;
            initializeLeaderboard();
        }
    }, 30000);
}

// Store initial data for comparison
window.lastLeaderboardData = JSON.stringify(loadLeaderboard());

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLeaderboard);