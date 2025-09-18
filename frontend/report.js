// Fungsi untuk memuat data riwayat dari localStorage
function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem('dauramaHistory')) || [];
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return [];
    }
}

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
                <i class="fas fa-recycle"></i>
            </div>
            <div class="summary-value">${stats.totalItems}</div>
            <div class="summary-label">Total Item Didaur Ulang</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <i class="fas fa-leaf"></i>
            </div>
            <div class="summary-value">${stats.totalCO2Saved}g</div>
            <div class="summary-label">CO₂ yang Dihemat</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <i class="fas fa-bolt"></i>
            </div>
            <div class="summary-value">${stats.totalEnergySaved.toFixed(1)} jam</div>
            <div class="summary-label">Energi yang Dihemat</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <i class="fas fa-tint"></i>
            </div>
            <div class="summary-value">${stats.totalWaterSaved.toFixed(1)}L</div>
            <div class="summary-label">Air yang Dihemat</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <i class="fas fa-trash-alt"></i>
            </div>
            <div class="summary-value">${stats.itemsByType.anorganik}</div>
            <div class="summary-label">Sampah Anorganik</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <i class="fas fa-seedling"></i>
            </div>
            <div class="summary-value">${stats.itemsByType.organik}</div>
            <div class="summary-label">Sampah Organik</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <i class="fas fa-wine-bottle"></i>
            </div>
            <div class="summary-value">${stats.itemsByType.kaca}</div>
            <div class="summary-label">Sampah Kaca</div>
        </div>

        <div class="summary-card">
            <div class="summary-icon">
                <i class="fas fa-calendar-day"></i>
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
        'anorganik': '<i class="fas fa-bottle-water"></i>',
        'organik': '<i class="fas fa-leaf"></i>',
        'kaca': '<i class="fas fa-wine-bottle"></i>'
    };
    return icons[type] || '<i class="fas fa-recycle"></i>';
}

// Fungsi untuk memformat timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Tidak diketahui';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Kemarin';
    } else if (diffDays <= 7) {
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

// Fungsi utama untuk menginisialisasi halaman
function initializeReportPage() {
    const historyData = loadHistory();
    const stats = calculateStatistics(historyData);
    
    renderSummaryDashboard(stats);
    renderHistoryList(historyData);
    
    // Event listeners
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
    document.getElementById('exportBtn').addEventListener('click', exportData);
}

// Jalankan ketika DOM sudah loaded
document.addEventListener('DOMContentLoaded', initializeReportPage);

// Auto-refresh data setiap 30 detik jika ada perubahan
setInterval(() => {
    const currentData = JSON.stringify(loadHistory());
    if (currentData !== window.lastHistoryData) {
        window.lastHistoryData = currentData;
        initializeReportPage();
    }
}, 30000);

// Store initial data
window.lastHistoryData = JSON.stringify(loadHistory());

function loadLeaderboard() {
    try {
        return JSON.parse(localStorage.getItem('dauramaLeaderboard')) || [];
    } catch (error) {
        console.error('Error loading leaderboard from localStorage:', error);
        return [];
    }
}

// NEW: Fungsi untuk menyimpan data leaderboard ke localStorage
function saveLeaderboard(leaderboardData) {
    try {
        localStorage.setItem('dauramaLeaderboard', JSON.stringify(leaderboardData));
    } catch (error) {
        console.error('Error saving leaderboard to localStorage:', error);
    }
}

// NEW: Fungsi untuk memperbarui leaderboard dengan data baru
function updateLeaderboard(userName, resultData) {
    let leaderboard = loadLeaderboard();
    let userEntry = leaderboard.find(entry => entry.name === userName);

    // Extract numeric values from eco_impact
    const co2Saved = parseInt(resultData.eco_impact?.co2?.match(/(\d+)/)?.[1] || 0);
    const energySaved = parseFloat(resultData.eco_impact?.energy?.match(/(\d+\.?\d*)/)?.[1] || 0);
    const waterSaved = parseFloat(resultData.eco_impact?.water?.match(/(\d+\.?\d*)/)?.[1] || 0);

    if (userEntry) {
        userEntry.itemsRecycled = (userEntry.itemsRecycled || 0) + 1;
        userEntry.totalCO2Saved = (userEntry.totalCO2Saved || 0) + co2Saved;
        userEntry.totalEnergySaved = (userEntry.totalEnergySaved || 0) + energySaved;
        userEntry.totalWaterSaved = (userEntry.totalWaterSaved || 0) + waterSaved;
    } else {
        userEntry = {
            name: userName,
            itemsRecycled: 1,
            totalCO2Saved: co2Saved,
            totalEnergySaved: energySaved,
            totalWaterSaved: waterSaved,
        };
        leaderboard.push(userEntry);
    }

    // Sort leaderboard by itemsRecycled (descending)
    leaderboard.sort((a, b) => b.itemsRecycled - a.itemsRecycled);
    saveLeaderboard(leaderboard);
    console.log('Leaderboard updated:', leaderboard);
}

// NEW: Fungsi untuk merender leaderboard
function renderLeaderboard(leaderboardData) {
    const leaderboardList = document.getElementById('leaderboard-list');
    const t = translations[currentLang]; // Assuming currentLang is available or passed

    if (leaderboardData.length === 0) {
        leaderboardList.innerHTML = `
            <div class="no-history">
                <div class="no-history-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <p>${t.no_leaderboard_data}</p>
            </div>
        `;
        return;
    }

    let leaderboardHTML = `
        <div class="leaderboard-header">
            <div>${t.leaderboard_rank}</div>
            <div>${t.leaderboard_name}</div>
            <div>${t.leaderboard_items}</div>
            <div>${t.leaderboard_co2}</div>
            <div>${t.leaderboard_energy}</div>
            <div>${t.leaderboard_water}</div>
        </div>
    `;

    leaderboardData.forEach((entry, index) => {
        leaderboardHTML += `
            <div class="leaderboard-item">
                <div class="leaderboard-rank">${index + 1}</div>
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

// NEW: Fungsi utama untuk menginisialisasi halaman laporan
function initializeReportPage() {
    const historyData = loadHistory();
    const stats = calculateStatistics(historyData);
    const leaderboardData = loadLeaderboard(); // Load leaderboard data

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