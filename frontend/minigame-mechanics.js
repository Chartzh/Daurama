// File: minigame-mechanics.js

// Fungsi utama untuk memuat HTML mini-game
async function loadMinigameHTML() {
    try {
        const response = await fetch('./minigame.html');
        if (!response.ok) {
            throw new Error('Failed to load minigame HTML.');
        }
        const htmlContent = await response.text();
        
        const wrapper = document.getElementById('minigame-wrapper');
        wrapper.innerHTML = htmlContent;

        // Panggil fungsi setup setelah HTML disuntikkan
        setupMinigameMechanics();

    } catch (error) {
        console.error('Error loading minigame:', error);
    }
}

// Logika dan event listeners untuk mini-game
function setupMinigameMechanics() {
    const draggableItem = document.getElementById('draggable-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    const resultMessage = document.getElementById('result-message');
    const successPopup = document.getElementById('success-popup');
    const closeBtn = document.querySelector('.close-btn');
    
    if (!draggableItem) {
        console.error('Draggable item not found. Minigame setup failed.');
        return;
    }

    // Fungsi untuk memulai permainan
    window.startGame = function(itemType) {
        const validTypes = ['anorganik', 'organik', 'kaca'];
        if (!validTypes.includes(itemType)) {
            resultMessage.innerText = 'Item tidak dapat dimainkan.';
            draggableItem.style.display = 'none';
            return;
        }

        draggableItem.dataset.type = itemType;
        draggableItem.innerText = itemType.toUpperCase();
        draggableItem.style.display = 'flex';
        resultMessage.innerText = '';
        
        // Atur warna atau style sesuai tipe
        if (itemType === 'anorganik') { draggableItem.style.backgroundColor = '#f1c40f'; }
        else if (itemType === 'organik') { draggableItem.style.backgroundColor = '#2ecc71'; }
        else if (itemType === 'kaca') { draggableItem.style.backgroundColor = '#3498db'; }
    };

    // Logika Drag & Drop
    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.type);
        event.target.classList.add('dragging');
    }

    function handleDragEnd(event) {
        event.target.classList.remove('dragging');
    }

    function handleDragOver(event) {
        event.preventDefault();
        event.target.classList.add('drag-over');
    }

    function handleDragLeave(event) {
        event.preventDefault();
        event.target.classList.remove('drag-over');
    }

    function handleDrop(event) {
        event.preventDefault();
        event.target.classList.remove('drag-over');

        const draggedItemType = event.dataTransfer.getData('text/plain');
        const droppedZoneId = event.target.id;
        const droppedZoneType = droppedZoneId.split('-')[0];

        if (draggedItemType === droppedZoneType) {
            handleCorrectDrop();
        } else {
            handleIncorrectDrop();
        }
    }

    function handleCorrectDrop() {
        resultMessage.innerText = 'Benar!';
        resultMessage.className = 'result-message correct';
        draggableItem.style.display = 'none';

        // Panggil fungsi untuk menampilkan pop-up
        showSuccessPopup();
    }

    function handleIncorrectDrop() {
        resultMessage.innerText = 'Salah, coba lagi!';
        resultMessage.className = 'result-message incorrect';
    }

    function showSuccessPopup() {
        successPopup.style.display = 'flex';
    }

    // Fungsi untuk menyembunyikan pop-up
    function hideSuccessPopup() {
        successPopup.style.display = 'none';
    }

    // Menambahkan event listener untuk menutup pop-up
    if (closeBtn) {
        closeBtn.addEventListener('click', hideSuccessPopup);
        window.addEventListener('click', (event) => {
            if (event.target == successPopup) {
                hideSuccessPopup();
            }
        });
    }

    // Menambahkan event listeners
    draggableItem.addEventListener('dragstart', handleDragStart);
    draggableItem.addEventListener('dragend', handleDragEnd);

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}