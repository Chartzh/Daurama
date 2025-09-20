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
                <div class="no-history-icon"><i class="fas fa-trophy"></i></div>
                <p>No data on the leaderboard yet.</p>
                <p>Be the first by starting to recycle!</p>
                <a href="index.html#analyze" class="back-button" style="margin-top: 2rem;">
                    <i class="fas fa-plus"></i> Start Analysis
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
            <div>Pet & Name</div>
            <div>Level</div>
            <div>Items</div>
            <div>CO² Saved</div>
            <div>Energy</div>
            <div>Water</div>
        </div>
    `;

    enhancedData.forEach((entry, index) => {
        const rank = index + 1;
        let rankIcon = '';
        let userTitle = 'Eco Warrior';

        if (rank === 1) {
            rankIcon = '<i class="fas fa-trophy trophy-icon" style="color: #FFD700;"></i>';
        } else if (rank === 2) {
            rankIcon = '<i class="fas fa-medal trophy-icon" style="color: #C0C0C0;"></i>';
        } else if (rank === 3) {
            rankIcon = '<i class="fas fa-medal trophy-icon" style="color: #CD7F32;"></i>';
        }

        if (entry.level >= 7) {
            userTitle = 'Eco Master';
        } else if (entry.level >= 5) {
            userTitle = 'Eco Champion';
        } else if (entry.level >= 3) {
            userTitle = 'Eco Enthusiast';
        }

        leaderboardHTML += `
            <div class="leaderboard-item rank-${rank}">
                <div class="leaderboard-rank">${rankIcon} ${rank}</div>
                <div class="leaderboard-user-info">
                    <div class="user-pet-preview">
                        <img src="${entry.petImage}" alt="Pet Level ${entry.level}" class="leaderboard-pet-image">
                    </div>
                    <div class="user-name-info">
                        <span class="user-name">${entry.name}</span>
                        <span class="user-title">${userTitle}</span>
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
                <div class="leaderboard-value">${entry.totalEnergySaved.toFixed(1)} hours</div>
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
}

document.addEventListener('DOMContentLoaded', initializeLeaderboard);