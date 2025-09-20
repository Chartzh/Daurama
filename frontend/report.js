// Function to calculate statistics from history data
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
        
        // Count by type
        if (item.type && stats.itemsByType.hasOwnProperty(item.type)) {
            stats.itemsByType[item.type]++;
        }

        // Calculate environmental impact (extract numbers from string)
        if (item.eco_impact) {
            // CO2 (in grams)
            if (item.eco_impact.co2) {
                const co2Match = item.eco_impact.co2.match(/(\d+)/);
                if (co2Match) {
                    stats.totalCO2Saved += parseInt(co2Match[1]);
                }
            }

            // Energy (in hours)
            if (item.eco_impact.energy) {
                const energyMatch = item.eco_impact.energy.match(/(\d+\.?\d*)/);
                if (energyMatch) {
                    stats.totalEnergySaved += parseFloat(energyMatch[1]);
                }
            }

            // Water (in liters)
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

// Function to render the summary dashboard
function renderSummaryDashboard(stats) {
    const dashboard = document.getElementById('summary-dashboard');
    
    dashboard.innerHTML = `
        <div class="summary-card">
            <div class="summary-icon"><img src="source/icons/recycle.png" alt="Recycle Icon" style="height: 55px;"></div>
            <div class="summary-value">${stats.totalItems}</div>
            <div class="summary-label">Total Items Recycled</div>
        </div>
        <div class="summary-card">
            <div class="summary-icon"><img src="source/icons/leaf.png" alt="Leaf Icon" style="height: 55px;"></div>
            <div class="summary-value">${stats.totalCO2Saved}g</div>
            <div class="summary-label">CO₂ Saved</div>
        </div>
        <div class="summary-card">
            <div class="summary-icon"><img src="source/icons/bolt.png" alt="Bolt Icon" style="height: 55px;"></div>
            <div class="summary-value">${stats.totalEnergySaved.toFixed(1)} hours</div>
            <div class="summary-label">Energy Saved</div>
        </div>
        <div class="summary-card">
            <div class="summary-icon"><img src="source/icons/water.png" alt="Water Icon" style="height: 55px;"></div>
            <div class="summary-value">${stats.totalWaterSaved.toFixed(1)}L</div>
            <div class="summary-label">Water Saved</div>
        </div>
        <div class="summary-card">
            <div class="summary-icon"><img src="source/icons/trashcan.png" alt="Trashcan Icon" style="height: 55px;"></div>
            <div class="summary-value">${stats.itemsByType.anorganik}</div>
            <div class="summary-label">Inorganic Waste</div>
        </div>
        <div class="summary-card">
            <div class="summary-icon"><img src="source/icons/sprout.png" alt="Sprout Icon" style="height: 55px;"></div>
            <div class="summary-value">${stats.itemsByType.organik}</div>
            <div class="summary-label">Organic Waste</div>
        </div>
        <div class="summary-card">
            <div class="summary-icon"><img src="source/icons/glass_bottle.png" alt="Glass Bottle Icon" style="height: 55px;"></div>
            <div class="summary-value">${stats.itemsByType.kaca}</div>
            <div class="summary-label">Glass Waste</div>
        </div>
        <div class="summary-card">
            <div class="summary-icon"><img src="source/icons/calender.png" alt="Calender Icon" style="height: 55px;"></div>
            <div class="summary-value">${getActiveDays()}</div>
            <div class="summary-label">Active Days</div>
        </div>
    `;
}

// Function to calculate the number of active days
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

// Function to render the history list
function renderHistoryList(historyData) {
    const historyList = document.getElementById('history-list');
    
    if (historyData.length === 0) {
        historyList.innerHTML = `
            <div class="no-history">
                <div class="no-history-icon"><i class="fas fa-history"></i></div>
                <p>No recycling history yet.</p>
                <p>Start analyzing your waste to see your environmental impact!</p>
                <a href="index.html#analyze" class="back-button" style="margin-top: 2rem;">
                    <i class="fas fa-plus"></i> Start Analysis
                </a>
            </div>
        `;
        return;
    }

    // Sort by most recent timestamp
    const sortedHistory = historyData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    historyList.innerHTML = sortedHistory.map(item => `
        <div class="history-item">
            <div class="history-icon">${getTypeIcon(item.type)}</div>
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
                            <div class="impact-label">Energy</div>
                            <div class="impact-value">${item.eco_impact.energy || '-'}</div>
                        </div>
                        <div class="impact-item">
                            <div class="impact-label">Water</div>
                            <div class="impact-value">${item.eco_impact.water || '-'}</div>
                        </div>
                        <div class="impact-item">
                            <div class="impact-label">Decomposes</div>
                            <div class="impact-value">${item.eco_impact.decompose_time || '-'}</div>
                        </div>
                    ` : '<div class="impact-item"><div class="impact-value">Data not available</div></div>'}
                </div>
            </div>
            <div class="history-timestamp">${formatTimestamp(item.timestamp)}</div>
        </div>
    `).join('');
}

// Function to get an icon based on type
function getTypeIcon(type) {
    const icons = {
        'anorganik': '<img src="source/icons/plastic_bottle.png" alt="Inorganic" class="game-icon" style="height: 50px;">',
        'organik': '<img src="source/icons/box.png" alt="Organic" class="game-icon" style="height: 50px;">',
        'kaca': '<img src="source/icons/glass_bottle.png" alt="Glass" class="game-icon" style="height: 50px;">'
    };
    return icons[type] || '<img src="source/icons/trashcan_category.png" alt="Waste" class="game-icon">';
}

// Function to format the timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.round((now - date) / 1000);

    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
}

// Function to clear history
function clearHistory() {
    if (confirm('Are you sure you want to delete all history? This action cannot be undone.')) {
        localStorage.removeItem('dauramaHistory');
        location.reload(); // Refresh page
    }
}

// Function to export data
function exportData() {
    const history = loadHistory();
    
    if (history.length === 0) {
        alert('No data to export.');
        return;
    }

    // Create CSV data
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
    
    updateNavbarUI();
    renderSummaryDashboard(stats);
    renderHistoryList(historyData);
    
    if (typeof updatePetPreview === 'function') {
        updatePetPreview();
    }
    
    const petPreview = document.getElementById('pet-preview');
    if (petPreview && typeof showPetCard === 'function') {
        petPreview.addEventListener('click', showPetCard);
    }

    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
    document.getElementById('exportBtn').addEventListener('click', exportData);
}

document.addEventListener('DOMContentLoaded', initializeReportPage);