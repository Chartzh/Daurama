let draggedItem = null;
let isGameActive = false; 

// Global variables for Daurama Trash Hoops
let kategoriSampahAI = "anorganik";
let trashHoopsScore = 0;
let isBallFlying = false;
let activeResultData = null;

// Show level up notification
function showLevelUpNotification() {
    const user = loadUserData(); 
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFD700, #FFC107); color: white;
        padding: 2rem; border-radius: 15px; text-align: center; z-index: 3000;
        box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3); animation: levelUpPulse 0.5s ease-in-out;
    `;
    notification.innerHTML = `
        <i class="fas fa-star" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
        <h3>Level Up!</h3>
        <p>You've reached Level ${user.level}!</p>
    `;
    document.body.appendChild(notification);
    setTimeout(() => { notification.remove(); }, 3000);
}

function initializeHamburgerMenu() {
    console.log('Initializing hamburger menu...');
    
    // Gunakan setTimeout untuk memastikan DOM sudah siap
    setTimeout(() => {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        console.log('Hamburger element found:', hamburger !== null);
        console.log('Nav menu element found:', navMenu !== null);
        
        if (!hamburger || !navMenu) {
            console.error('Hamburger menu elements not found!');
            console.log('Available elements with ID hamburger:', document.querySelectorAll('#hamburger'));
            console.log('Available elements with class nav-menu:', document.querySelectorAll('.nav-menu'));
            return;
        }
        
        // Remove existing event listeners to prevent duplicates
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        // Get the new element reference
        const freshHamburger = document.getElementById('hamburger');
        
        freshHamburger.addEventListener('click', function(e) {
            console.log('Hamburger clicked!');
            e.stopPropagation(); 
            navMenu.classList.toggle('active');
            freshHamburger.classList.toggle('toggle');
            console.log('Menu is now:', navMenu.classList.contains('active') ? 'open' : 'closed');
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                freshHamburger.classList.remove('toggle');
            });
        });

        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = freshHamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                freshHamburger.classList.remove('toggle');
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                freshHamburger.classList.remove('toggle');
            }
        });
        
        console.log('Hamburger menu initialized successfully!');
    }, 100);
}

// Image upload functionality - with null checks
function initializeImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    const previewContainer = document.querySelector('.preview-container'); 
    const preview = document.getElementById('preview');
    const analyzeBtn = document.getElementById('analyzeBtn');

    if (!imageUpload || !previewContainer || !preview || !analyzeBtn) {
        console.log('Image upload elements not found - probably not on index page');
        return;
    }

    imageUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                previewContainer.style.display = 'flex'; 
                analyzeBtn.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Initialize analyze button functionality
function initializeAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const imageUpload = document.getElementById('imageUpload');
    
    if (!analyzeBtn || !imageUpload) {
        console.log('Analyze button elements not found - probably not on index page');
        return;
    }

    // Updated analysis function with rich data
    analyzeBtn.addEventListener('click', async function () {
        const file = imageUpload.files[0];

        if (!file) {
            alert('Please select an image first!');
            return;
        }

        // Show loading state
        const analyzeText = document.getElementById('analyzeText');
        if (analyzeText) {
            analyzeText.innerHTML = '<span class="loading"></span> Analyzing...';
        }
        analyzeBtn.disabled = true;

        // Simulate API call delay with enriched mock data
        setTimeout(() => {
            // Mock results with more detailed data
            const mockResults = [
                {
                    object_name: 'Plastic Bottle',
                    type: 'anorganik',
                    material: 'PET (Polyethylene Terephthalate)',
                    instructions: 'Remove cap and label. Rinse bottle. Place in plastic recycling bin.',
                    eco_impact: {
                        co2: '250g',
                        energy: '3 hours of LED light',
                        water: '2.5 liters of clean water',
                        decompose_time: '450 years'
                    },
                    timestamp: new Date().toISOString()
                },
                {
                    object_name: 'Glass Bottle',
                    type: 'kaca',
                    material: 'Soda-Lime Glass',
                    instructions: 'Remove labels. Rinse thoroughly. Place in glass recycling bin.',
                    eco_impact: {
                        co2: '400g',
                        energy: '5 hours of LED light',
                        water: '0.5 liters of clean water',
                        decompose_time: '1000 years'
                    },
                    timestamp: new Date().toISOString()
                },
                {
                    object_name: 'Cardboard Box',
                    type: 'organik',
                    material: 'Corrugated Cardboard',
                    instructions: 'Flatten box. Remove any tape or staples. Place in paper recycling bin.',
                    eco_impact: {
                        co2: '100g',
                        energy: '1 hour of LED light',
                        water: '5 liters of clean water',
                        decompose_time: '3 months'
                    },
                    timestamp: new Date().toISOString()
                },
                {
                    object_name: 'Aluminum Can',
                    type: 'anorganik',
                    material: 'Aluminum Alloy 3004',
                    instructions: 'Rinse can. Remove any remaining liquid. Place in metal recycling bin.',
                    eco_impact: {
                        co2: '500g',
                        energy: '8 hours of LED light',
                        water: '1 liter of clean water',
                        decompose_time: '200 years'
                    },
                    timestamp: new Date().toISOString()
                }
            ];

            const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];

            // Save active game data to localStorage for the fullscreen game page
            localStorage.setItem('dauramaActiveGame', JSON.stringify(randomResult));
            const preview = document.getElementById('preview');
            if (preview && preview.src && preview.src !== "" && preview.parentNode.style.display !== 'none') {
                localStorage.setItem('dauramaActivePreview', preview.src);
            } else {
                localStorage.removeItem('dauramaActivePreview');
            }

            // Reset analyze button state
            if (analyzeText) {
                analyzeText.textContent = 'Analyze Waste';
            }
            analyzeBtn.disabled = false;

            // Redirect to the fullscreen game page
            window.location.href = 'game.html';
        }, 2000);
    });
}

// Initialize drag and drop for upload area
function initializeDragAndDrop() {
    const uploadArea = document.querySelector('.upload-area');
    const imageUpload = document.getElementById('imageUpload');
    
    if (!uploadArea || !imageUpload) {
        console.log('Drag and drop elements not found - probably not on index page');
        return;
    }

    uploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.style.borderColor = '#45a049';
        this.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    });

    uploadArea.addEventListener('dragleave', function (e) {
        e.preventDefault();
        this.style.borderColor = '#4CAF50';
        this.style.backgroundColor = 'linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(76, 175, 80, 0.1))';
    });

    uploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        this.style.borderColor = '#4CAF50';
        this.style.backgroundColor = 'linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(76, 175, 80, 0.1))';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            imageUpload.files = files;
            const event = new Event('change', { bubbles: true });
            imageUpload.dispatchEvent(event);
        }
    });
}

// Check if we just returned from a successful game and should display results
function checkGameReturn() {
    const showResultFlag = localStorage.getItem('dauramaShowResult');
    if (showResultFlag === 'true') {
        localStorage.removeItem('dauramaShowResult');
        
        try {
            const activeGameData = JSON.parse(localStorage.getItem('dauramaActiveGame'));
            if (activeGameData) {
                // Populate result card elements
                const objectNameDisplay = document.getElementById('objectNameDisplay');
                const instructionsDisplay = document.getElementById('instructionsDisplay');
                const materialDisplay = document.getElementById('materialDisplay');
                const ecoImpactDisplay = document.getElementById('ecoImpactDisplay');
                const resultSection = document.getElementById('result');
                const preview = document.getElementById('preview');
                const previewContainer = document.querySelector('.preview-container');
                const viewReportBtn = document.getElementById('viewReportBtn');

                if (objectNameDisplay) objectNameDisplay.textContent = activeGameData.object_name;
                if (instructionsDisplay) instructionsDisplay.textContent = activeGameData.instructions;
                if (materialDisplay) materialDisplay.textContent = activeGameData.material;
                
                if (ecoImpactDisplay) {
                    ecoImpactDisplay.innerHTML = `
                        <div class="eco-impact-item">
                            <span class="eco-label">CO² Saved:</span>
                            <span class="eco-value">${activeGameData.eco_impact.co2}</span>
                        </div>
                        <div class="eco-impact-item">
                            <span class="eco-label">Energy Saved:</span>
                            <span class="eco-value">${activeGameData.eco_impact.energy}</span>
                        </div>
                        <div class="eco-impact-item">
                            <span class="eco-label">Water Saved:</span>
                            <span class="eco-value">${activeGameData.eco_impact.water}</span>
                        </div>
                        <div class="eco-impact-item">
                            <span class="eco-label">Natural Decompose Time:</span>
                            <span class="eco-value">${activeGameData.eco_impact.decompose_time}</span>
                        </div>
                    `;
                }

                // Restore image preview if available
                const savedPreview = localStorage.getItem('dauramaActivePreview');
                if (savedPreview && preview && previewContainer) {
                    preview.src = savedPreview;
                    previewContainer.style.display = 'flex';
                }

                // Display result section and scroll to it
                if (resultSection) {
                    resultSection.style.display = 'block';
                    setTimeout(() => {
                        resultSection.scrollIntoView({ behavior: 'smooth' });
                    }, 400);
                }

                if (viewReportBtn) {
                    viewReportBtn.style.display = 'inline-block';
                }
            }
        } catch (e) {
            console.error("Failed to parse game return data:", e);
        }
    }
}

function startGame() {}
function initializeTrashHoops() {}
function initializePopups() {}

// Initialize view report button
function initializeViewReportButton() {
    const viewReportBtn = document.getElementById('viewReportBtn');
    if (viewReportBtn) {
        viewReportBtn.addEventListener('click', function() {
            window.location.href = 'report.html';
        });
    }
}

// Smooth scrolling function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navbar scroll effect
function initializeNavbarScrollEffect() {
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(20, 50, 30, 0.98)';
                navbar.style.backdropFilter = 'blur(15px)';
            } else {
                navbar.style.background = 'rgba(20, 50, 30, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        }
    });
}

// Main initialization function
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded - Initializing all components...');
    
    // Initialize global components (present on all pages)
    initializeHamburgerMenu();
    updateNavbarUI();
    initializeNavbarScrollEffect();
    
    // Initialize pet preview if function exists
    if (typeof updatePetPreview === 'function') {
        updatePetPreview();
    }

    // Initialize pet card functionality
    const petPreview = document.getElementById('pet-preview');
    if (petPreview && typeof showPetCard === 'function') {
        petPreview.addEventListener('click', showPetCard);
    }

    // Initialize page-specific components (only if elements exist)
    initializeImageUpload();
    initializeAnalyzeButton();
    initializeDragAndDrop();
    initializeTrashHoops();
    initializePopups();
    initializeViewReportButton();
    checkGameReturn();
    
    console.log('All components initialized successfully!');
});

// Make scrollToSection available globally
window.scrollToSection = scrollToSection;