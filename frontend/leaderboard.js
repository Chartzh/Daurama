// Save leaderboard data to localStorage
function saveLeaderboard(leaderboardData) {
    try {
        localStorage.setItem('dauramaLeaderboard', JSON.stringify(leaderboardData));
    } catch (error) {
        console.error('Error saving leaderboard to localStorage:', error);
    }
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

    let leaderboardHTML = `
        <div class="leaderboard-header-row">
            <div>Rank</div>
            <div>Nama</div>
            <div>Items</div>
            <div>CO₂ Saved</div>
            <div>Energy</div>
            <div>Water</div>
        </div>
    `;

    leaderboardData.forEach((entry, index) => {
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
                <div class="leaderboard-name">${entry.name}</div>
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