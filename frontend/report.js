// Fungsi untuk menghitung statistik dari data riwayat
function calculateStatistics(historyData) {
    const stats = {
        totalItems: 0,
        totalCO2Saved: 0,
        totalEnergySaved: 0,
        totalWaterSaved: 0,
        itemsByType: {
            anorganik: 0,
            organik: 0,
            kaca: 0
        }
    };

    historyData.forEach(item => {
        stats.totalItems++;
        
        // Hitung berdasarkan tipe
        if (item.type && stats.itemsByType.hasOwnProperty(item.type)) {
            stats.itemsByType[item.type]++;
        }

        // Hitung dampak lingkungan (ekstrak angka dari string)
        if (item.eco_impact) {
            // CO2 (dalam gram)
            if (item.eco_impact.co2) {
                const co2Match = item.eco_impact.co2.match(/(\d+)/);
                if (co2Match) {
                    stats.totalCO2Saved += parseInt(co2Match[1]);
                }
            }

            // Energy (dalam jam)
            if (item.eco_impact.energy) {
                const energyMatch = item.eco_impact.energy.match(/(\d+\.?\d*)/);
                if (energyMatch) {
                    stats.totalEnergySaved += parseFloat(energyMatch[1]);
                }
            }

            // Water (dalam liter)
            if (item.eco_impact.water) {
                const waterMatch = item.eco_impact.water.match(/(\d+\.?\d*)/);
                if (waterMatch) {
                    stats.totalWaterSaved += parseFloat(waterMatch[1]);
                }
            }
        }
    });

    return stats;
}

// Fungsi untuk merender dashboard ringkasan
function renderSummaryDashboard(stats) {
    const dashboard = document.getElementById('summary-dashboard');
    
    dashboard.innerHTML = `
        <div class="summary-card">
            <div class="summary-icon">
                <img src="source/icons/recycle.png" alt="Recycle Icon" style="height: 55px;">
            </div>
            <div class="summary-value">${stats.totalItems}</div>
            <div class="summary-label">Total Item Didaur Ulang</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <img src="source/icons/leaf.png" alt="Leaf Icon" style="height: 55px;">
            </div>
            <div class="summary-value">${stats.totalCO2Saved}g</div>
            <div class="summary-label">CO₂ yang Dihemat</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <img src="source/icons/bolt.png" alt="Bolt Icon" style="height: 55px;">
            </div>
            <div class="summary-value">${stats.totalEnergySaved.toFixed(1)} jam</div>
            <div class="summary-label">Energi yang Dihemat</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <img src="source/icons/water.png" alt="Water Icon" style="height: 55px;">
            </div>
            <div class="summary-value">${stats.totalWaterSaved.toFixed(1)}L</div>
            <div class="summary-label">Air yang Dihemat</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <img src="source/icons/trashcan.png" alt="Trashcan Icon" style="height: 55px;">
            </div>
            <div class="summary-value">${stats.itemsByType.anorganik}</div>
            <div class="summary-label">Sampah Anorganik</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <img src="source/icons/sprout.png" alt="Sprout Icon" style="height: 55px;">
            </div>
            <div class="summary-value">${stats.itemsByType.organik}</div>
            <div class="summary-label">Sampah Organik</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <img src="source/icons/glass_bottle.png" alt="Glass Bottle Icon" style="height: 55px;">
            </div>
            <div class="summary-value">${stats.itemsByType.kaca}</div>
            <div class="summary-label">Sampah Kaca</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <img src="source/icons/calender.png" alt="Calender Icon" style="height: 55px;">
            </div>
            <div class="summary-value">${getActiveDays()}</div>
            <div class="summary-label">Hari Aktif</div>
        </div>
    `;
}

// Fungsi untuk menghitung jumlah hari aktif
function getActiveDays() {
    const history = loadHistory();
    const uniqueDates = new Set();
    
    history.forEach(item => {
        if (item.timestamp) {
            const date = new Date(item.timestamp).toDateString();
            uniqueDates.add(date);
        }
    });
    
    return uniqueDates.size;
}

// Fungsi untuk merender daftar riwayat
function renderHistoryList(historyData) {
    const historyList = document.getElementById('history-list');
    
    if (historyData.length === 0) {
        historyList.innerHTML = `
            <div class="no-history">
                <div class="no-history-icon">
                    <i class="fas fa-history"></i>
                </div>
                <p>Belum ada riwayat aktivitas daur ulang.</p>
                <p>Mulai menganalisis sampah Anda untuk melihat dampak lingkungan!</p>
                <a href="index.html#analyze" class="back-button" style="margin-top: 2rem;">
                    <i class="fas fa-plus"></i>
                    Mulai Analisis
                </a>
            </div>
        `;
        return;
    }

    // Sort berdasarkan timestamp terbaru
    const sortedHistory = historyData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    historyList.innerHTML = sortedHistory.map(item => `
        <div class="history-item">
            <div class="history-icon">
                ${getTypeIcon(item.type)}
            </div>
            <div class="history-content">
                <div class="history-title">${item.object_name || 'Unknown Item'}</div>
                <div class="history-material">Material: ${item.material || 'Unknown Material'}</div>
                <div class="history-impact">
                    ${item.eco_impact ? `
                        <div class="impact-item">
                            <div class="impact-label">CO₂</div>
                            <div class="impact-value">${item.eco_impact.co2 || '-'}</div>
                        </div>
                        <div class="impact-item">
                            <div class="impact-label">Energi</div>
                            <div class="impact-value">${item.eco_impact.energy || '-'}</div>
                        </div>
                        <div class="impact-item">
                            <div class="impact-label">Air</div>
                            <div class="impact-value">${item.eco_impact.water || '-'}</div>
                        </div>
                        <div class="impact-item">
                            <div class="impact-label">Terurai</div>
                            <div class="impact-value">${item.eco_impact.decompose_time || '-'}</div>
                        </div>
                    ` : '<div class="impact-item"><div class="impact-value">Data tidak tersedia</div></div>'}
                </div>
            </div>
            <div class="history-timestamp">
                ${formatTimestamp(item.timestamp)}
            </div>
        </div>
    `).join('');
}

// Fungsi untuk mendapatkan ikon berdasarkan tipe
function getTypeIcon(type) {
    const icons = {
        'anorganik': '<img src="source/icons/plastic_bottle.png" alt="Anorganik" class="game-icon" style="height: 50px;">',
        'organik': '<img src="source/icons/box.png" alt="Organik" class="game-icon" style="height: 50px;">',
        'kaca': '<img src="source/icons/glass_bottle.png" alt="Kaca" class="game-icon" style="height: 50px;">'
    };
    return icons[type] || '<img src="source/icons/trashcan_category.png" alt="Sampah" class="game-icon">';
}

// Fungsi untuk memformat timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Tidak diketahui';
    
    const date = new Date(timestamp);
    const now = new Date();
    
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTimestampDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.round((startOfToday - startOfTimestampDay) / (1000 * 60 * 60 * 24));

    if (diffSeconds < 60) {
        return `${diffSeconds} detik yang lalu`;
    } else if (diffMinutes < 60) {
        return `${diffMinutes} menit yang lalu`;
    } else if (diffHours < 24 && diffDays === 0) {
        return `${diffHours} jam yang lalu`;
    } else if (diffDays === 1) {
        return 'Kemarin';
    } else if (diffDays > 1 && diffDays <= 7) {
        return `${diffDays} hari yang lalu`;
    } else {
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}

// Fungsi untuk menghapus riwayat
function clearHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat? Tindakan ini tidak dapat dibatalkan.')) {
        localStorage.removeItem('dauramaHistory');
        location.reload(); // Refresh halaman
    }
}

// Fungsi untuk export data
function exportData() {
    const history = loadHistory();
    
    if (history.length === 0) {
        alert('Tidak ada data untuk diekspor.');
        return;
    }

    // Buat data CSV
    const headers = ['Timestamp', 'Object', 'Type', 'Material', 'CO2 Saved', 'Energy Saved', 'Water Saved', 'Decompose Time'];
    const csvData = [
        headers.join(','),
        ...history.map(item => [
            item.timestamp || '',
            `"${item.object_name || ''}"`,
            item.type || '',
            `"${item.material || ''}"`,
            item.eco_impact?.co2 || '',
            item.eco_impact?.energy || '',
            item.eco_impact?.water || '',
            `"${item.eco_impact?.decompose_time || ''}"`
        ].join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daurama_history_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function initializeReportPage() {
    const historyData = loadHistory();
    const stats = calculateStatistics(historyData);
    const leaderboardData = loadLeaderboard();

    renderSummaryDashboard(stats);
    renderHistoryList(historyData);
    renderLeaderboard(leaderboardData);

    if (typeof updatePetPreview === 'function') {
        updatePetPreview();
    }

    // Event listeners
    const clearBtn = document.getElementById('clearHistoryBtn');
    const exportBtn = document.getElementById('exportBtn');
    const petPreview = document.getElementById('pet-preview');
    if (petPreview && typeof showPetCard === 'function') {
        petPreview.addEventListener('click', showPetCard);
    }
    
    if (clearBtn) clearBtn.addEventListener('click', clearHistory);
    if (exportBtn) exportBtn.addEventListener('click', exportData);
}

document.addEventListener('DOMContentLoaded', initializeReportPage);

setInterval(() => {
    const currentData = JSON.stringify(loadHistory());
    if (currentData !== window.lastHistoryData) {
        window.lastHistoryData = currentData;
        initializeReportPage();
    }
}, 30000);

window.lastHistoryData = JSON.stringify(loadHistory());

function renderLeaderboard(leaderboardData) {
    const leaderboardList = document.getElementById('leaderboard-list');
    
    if (!leaderboardList) return; // Exit if element doesn't exist on this page

    if (leaderboardData.length === 0) {
        leaderboardList.innerHTML = `
            <div class="no-history">
                <div class="no-history-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <p>Belum ada data di papan peringkat.</p>
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

    // Show only top 5 in report page
    const topUsers = leaderboardData.slice(0, 5);
    
    topUsers.forEach((entry, index) => {
        const rank = index + 1;
        let rankIcon = '';
        
        if (rank === 1) rankIcon = '<i class="fas fa-trophy trophy-icon"></i>';
        else if (rank === 2) rankIcon = '<i class="fas fa-medal trophy-icon" style="color: #C0C0C0;"></i>';
        else if (rank === 3) rankIcon = '<i class="fas fa-medal trophy-icon" style="color: #CD7F32;"></i>';

        leaderboardHTML += `
            <div class="leaderboard-item">
                <div class="leaderboard-rank">${rankIcon} ${rank}</div>
                <div class="leaderboard-name">${entry.name}</div>
                <div class="leaderboard-value">${entry.itemsRecycled}</div>
                <div class="leaderboard-value">${entry.totalCO2Saved}g</div>
                <div class="leaderboard-value">${entry.totalEnergySaved.toFixed(1)} jam</div>
                <div class="leaderboard-value">${entry.totalWaterSaved.toFixed(1)}L</div>
            </div>
        `;
    });

    if (leaderboardData.length > 5) {
        leaderboardHTML += `
            <div style="text-align: center; padding: 1rem;">
                <a href="leaderboard.html" class="view-report-btn">
                    <i class="fas fa-trophy"></i>
                    Lihat Semua Peringkat
                </a>
            </div>
        `;
    }

    leaderboardList.innerHTML = leaderboardHTML;
}

function initializeReportPage() {
    const historyData = loadHistory();
    const stats = calculateStatistics(historyData);
    const leaderboardData = loadLeaderboard(); // Load leaderboard data

    updateNavbarUI();
    renderSummaryDashboard(stats);
    renderHistoryList(historyData);
    renderLeaderboard(leaderboardData); // Render leaderboard

    // Event listeners
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
    document.getElementById('exportBtn').addEventListener('click', exportData);

    // NEW: Update leaderboard and section titles with translations
    const t = translations[currentLang]; // Assuming currentLang is available
    document.getElementById('leaderboardTitle').textContent = t.leaderboard_title;
    document.getElementById('leaderboardSubtitle').textContent = t.leaderboard_subtitle;
}