/**
 * DAURAMA TRASH HOOPS - GAME LOGIC & PHYSICS ENGINE (SLINGSHOT REFRACTORED)
 * Angry Birds style charge-and-release mechanic.
 */

// Global Game Variables
let kategoriSampahAI = "anorganik";
let activeResultData = null;
let trashHoopsScore = 0;
let isBallFlying = false;
let power = 0;
let animationFrameId = null;
let isGameActive = true;

// Slingshot dragging variables
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let defaultBallLeft = 0;
let defaultBallTop = 0;
const maxDragDistance = 120; // in pixels
let dragDx = 0;
let dragDy = 0;

// Physics coordinates and velocities
let px = 0;
let py = 0;
let vx = 0;
let vy = 0;
const gravity = 0.45; // Gravity acceleration per frame
let ballRotation = 0;

// Launch parameters
const minLaunchVelocity = 8;
const maxLaunchVelocity = 24;

// Load Active Game Data from LocalStorage (Fallback to Mock if opened directly)
function loadGameData() {
    try {
        const savedGame = localStorage.getItem('dauramaActiveGame');
        if (savedGame) {
            activeResultData = JSON.parse(savedGame);
            kategoriSampahAI = activeResultData.type;
        } else {
            // Default Fallback Mock Data
            activeResultData = {
                object_name: 'Plastic Bottle',
                type: 'anorganik',
                material: 'PET Plastic',
                instructions: 'Remove cap. Place in plastic bin.',
                eco_impact: {
                    co2: '250g',
                    energy: '3 hours LED',
                    water: '2.5 liters',
                    decompose_time: '450 years'
                }
            };
            kategoriSampahAI = "anorganik";
        }

        // Sync with window.kategoriSampahAI if provided
        if (window.kategoriSampahAI) {
            kategoriSampahAI = window.kategoriSampahAI;
        }
    } catch (e) {
        console.error("Failed to load game data:", e);
    }
}

// Update HUD elements with active game data
function setupHUD() {
    const itemNameEl = document.getElementById('retro-item-name');
    const targetEl = document.getElementById('retro-target');
    const ballEl = document.getElementById('trash-ball');

    if (itemNameEl) itemNameEl.textContent = activeResultData.object_name.toUpperCase();
    
    // Set Target label (kaca maps to GLASS, organik to ORGANIC, anorganik to INORGANIC)
    if (targetEl) {
        let displayTarget = kategoriSampahAI.toUpperCase();
        if (displayTarget === 'KACA') displayTarget = 'GLASS';
        if (displayTarget === 'ORGANIK') displayTarget = 'ORGANIC';
        if (displayTarget === 'ANORGANIK') displayTarget = 'INORGANIC';
        targetEl.textContent = displayTarget;
    }

    // Set active item photo preview or icon on the trash ball
    if (ballEl) {
        const savedPreview = localStorage.getItem('dauramaActivePreview');
        if (savedPreview && savedPreview !== "") {
            ballEl.innerHTML = `<img src="${savedPreview}" alt="Trash" class="physics-ball-img-preview">`;
        } else {
            ballEl.innerHTML = getItemIcon(kategoriSampahAI);
        }
    }

    // Update scoreboard
    updateScoreboard();
}

function getItemIcon(type) {
    const icons = {
        'anorganik': '<img src="source/icons/plastic_bottle.png" alt="Inorganic" class="physics-ball-icon">',
        'organik': '<img src="source/icons/box.png" alt="Organic" class="physics-ball-icon">',
        'kaca': '<img src="source/icons/glass_bottle.png" alt="Glass" class="physics-ball-icon">'
    };
    return icons[type] || '<img src="source/icons/trashcan_category.png" alt="Waste" class="physics-ball-icon">';
}

function updateScoreboard() {
    const scoreEl = document.getElementById('retro-score');
    if (scoreEl) {
        scoreEl.textContent = String(trashHoopsScore).padStart(5, '0');
    }
}

// Slingshot drag functions
function startDragging(clientX, clientY) {
    if (isBallFlying || !isGameActive || isDragging) return;

    const ballWrapper = document.getElementById('trash-ball-wrapper');
    const court = document.getElementById('retro-physics-court');
    if (!ballWrapper || !court) return;

    isDragging = true;
    dragStartX = clientX;
    dragStartY = clientY;

    // Get current ball position relative to court before dragging starts
    const ballRect = ballWrapper.getBoundingClientRect();
    const courtRect = court.getBoundingClientRect();
    defaultBallLeft = ballRect.left - courtRect.left;
    defaultBallTop = ballRect.top - courtRect.top;

    // Disable transition
    ballWrapper.style.transition = 'none';

    // Show prediction dots container
    const container = document.getElementById('trajectory-dots-container');
    if (container) container.style.display = 'block';

    const shootBtn = document.getElementById('shoot-btn');
    if (shootBtn) shootBtn.textContent = "AIMING...";

    // Draw initial slingshot bands
    drawSlingshotBands(defaultBallLeft + 30, defaultBallTop + 30);
}

function handleDragging(clientX, clientY) {
    if (!isDragging) return;

    const ballWrapper = document.getElementById('trash-ball-wrapper');
    if (!ballWrapper) return;

    dragDx = clientX - dragStartX;
    dragDy = clientY - dragStartY;

    let dist = Math.sqrt(dragDx * dragDx + dragDy * dragDy);
    if (dist > maxDragDistance) {
        dragDx = (dragDx / dist) * maxDragDistance;
        dragDy = (dragDy / dist) * maxDragDistance;
        dist = maxDragDistance;
    }

    // Update ball visual position
    ballWrapper.style.left = `${defaultBallLeft + dragDx}px`;
    ballWrapper.style.top = `${defaultBallTop + dragDy}px`;

    // Calculate power (0% to 100%)
    power = (dist / maxDragDistance) * 100;
    updatePowerBarUI();

    // Calculate opposite velocity vector for prediction and launch
    if (dist > 0) {
        const speed = minLaunchVelocity + (power / 100) * (maxLaunchVelocity - minLaunchVelocity);
        vx = speed * (-dragDx / dist);
        vy = speed * (-dragDy / dist);
    } else {
        vx = 0;
        vy = 0;
    }

    // Draw updated slingshot bands
    drawSlingshotBands(defaultBallLeft + dragDx + 30, defaultBallTop + dragDy + 30);

    // Update trajectory visualization
    updateTrajectoryPrediction();
}

function endDragging() {
    if (!isDragging) return;
    isDragging = false;

    // Hide prediction dots
    const container = document.getElementById('trajectory-dots-container');
    if (container) container.style.display = 'none';

    const shootBtn = document.getElementById('shoot-btn');
    if (shootBtn) shootBtn.textContent = "DRAG BALL TO AIM";

    // Hide slingshot bands
    drawSlingshotBands();

    // Launch or reset ball based on power threshold
    if (power > 10) {
        shootBall();
    } else {
        resetBall();
    }
}

function updatePowerBarUI() {
    // Power bar has been removed from UI
}

function drawSlingshotBands(bx, by) {
    const line1 = document.getElementById('slingshot-line1');
    const line2 = document.getElementById('slingshot-line2');
    const court = document.getElementById('retro-physics-court');
    if (!line1 || !line2 || !court) return;

    const courtHeight = court.clientHeight;
    // Stand prongs are roughly at x=128 and x=164 relative to the court left edge.
    // anchorY is bottom = 128px (courtHeight - 128px).
    const anchorY = courtHeight - 128;

    if (isDragging) {
        line1.setAttribute('x1', '128');
        line1.setAttribute('y1', String(anchorY));
        line1.setAttribute('x2', String(bx));
        line1.setAttribute('y2', String(by));

        line2.setAttribute('x1', '164');
        line2.setAttribute('y1', String(anchorY));
        line2.setAttribute('x2', String(bx));
        line2.setAttribute('y2', String(by));

        line1.style.display = 'block';
        line2.style.display = 'block';
    } else {
        line1.style.display = 'none';
        line2.style.display = 'none';
    }
}

// Calculate and render parabolic trajectory dots starting from currently dragged position
function updateTrajectoryPrediction() {
    const court = document.getElementById('retro-physics-court');
    const ballWrapper = document.getElementById('trash-ball-wrapper');
    if (!court || !ballWrapper) return;

    const courtRect = court.getBoundingClientRect();
    const ballRect = ballWrapper.getBoundingClientRect();

    // Start coordinates (center of launcher ball in its current position)
    const startX = ballRect.left - courtRect.left + 30;
    const startY = ballRect.top - courtRect.top + 30;

    const dots = document.querySelectorAll('.trajectory-dot-pred');
    dots.forEach((dot, index) => {
        // Step time in frames
        const t = (index + 1) * 2.8;
        const dx = vx * t;
        const dy = vy * t + 0.5 * gravity * t * t;

        // Position prediction dot
        dot.style.left = `${startX + dx - 4}px`;
        dot.style.top = `${startY + dy - 4}px`;
        dot.style.display = 'block';
    });
}

// Shoot Ball Physics Loop
function shootBall() {
    isBallFlying = true;

    const ballWrapper = document.getElementById('trash-ball-wrapper');
    const ballInner = document.getElementById('trash-ball');
    const court = document.getElementById('retro-physics-court');

    if (!ballWrapper || !ballInner || !court) return;

    const courtRect = court.getBoundingClientRect();
    const ballRect = ballWrapper.getBoundingClientRect();

    // Starting positions relative to container
    px = ballRect.left - courtRect.left;
    py = ballRect.top - courtRect.top;

    ballRotation = 0;

    runPhysicsLoop();
}

function runPhysicsLoop() {
    const court = document.getElementById('retro-physics-court');
    const ballWrapper = document.getElementById('trash-ball-wrapper');
    const ballInner = document.getElementById('trash-ball');

    if (!court || !ballWrapper || !ballInner) return;

    const courtWidth = court.clientWidth;
    const courtHeight = court.clientHeight;

    // Update positions
    px += vx;
    py += vy;
    vy += gravity;

    // Apply translations
    ballWrapper.style.left = `${px}px`;
    ballWrapper.style.top = `${py}px`;

    // Rotate inner ball
    ballRotation += 6;
    ballInner.style.transform = `rotate(${ballRotation}deg)`;

    // Check rim collisions
    const collision = checkHoopCollisions(px + 30, py + 30);
    if (collision) {
        cancelAnimationFrame(animationFrameId);
        handleLanding(collision.binId, collision.isCorrect);
        return;
    }

    // Check floor collision (replaces dashed line)
    // Floor is at bottom (height - 48px dirt ground - 60px ball)
    // Only check if moving downward to avoid false triggers during release pull-backs
    if (vy > 0 && py >= courtHeight - 108) {
        cancelAnimationFrame(animationFrameId);
        handleFloorLanding();
        return;
    }

    // Right wall bounce
    if (px >= courtWidth - 60) {
        px = courtWidth - 60;
        vx = -vx * 0.4;
    }

    animationFrameId = requestAnimationFrame(runPhysicsLoop);
}

function checkHoopCollisions(bx, by) {
    const court = document.getElementById('retro-physics-court');
    const courtRect = court.getBoundingClientRect();
    const bins = document.querySelectorAll('.retro-physics-bin');

    for (let bin of bins) {
        const binRect = bin.getBoundingClientRect();
        const rimWidth = 66;
        const rimLeft = (binRect.left - courtRect.left) + (binRect.width / 2) - (rimWidth / 2);
        const rimRight = rimLeft + rimWidth;
        const rimTop = (binRect.top - courtRect.top) + 25; // 25px offset inside bin

        // Ball is falling (vy > 0) crossing rim top level
        if (vy > 0 && Math.abs(by - rimTop) <= Math.max(12, vy) && bx >= rimLeft && bx <= rimRight) {
            const binCategory = bin.dataset.category;
            const isCorrect = (binCategory === kategoriSampahAI) || 
                              (binCategory === 'organik' && kategoriSampahAI === 'organic') ||
                              (binCategory === 'anorganik' && kategoriSampahAI === 'inorganic') ||
                              (binCategory === 'kaca' && (kategoriSampahAI === 'B3' || kategoriSampahAI === 'glass'));

            return { binId: bin.id, isCorrect: isCorrect };
        }
    }
    return null;
}

function handleLanding(binId, isCorrect) {
    const bin = document.getElementById(binId);
    const binRect = bin.getBoundingClientRect();
    const court = document.getElementById('retro-physics-court');
    const courtRect = court.getBoundingClientRect();
    
    const ballWrapper = document.getElementById('trash-ball-wrapper');
    const ballInner = document.getElementById('trash-ball');

    const targetX = (binRect.left - courtRect.left) + (binRect.width / 2) - 30;
    const targetY = (binRect.top - courtRect.top) + 65;

    // Slide ball straight down
    ballWrapper.style.transition = 'left 0.4s ease-out, top 0.4s ease-out';
    ballWrapper.style.left = `${targetX}px`;
    ballWrapper.style.top = `${targetY}px`;

    ballInner.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
    ballInner.style.transform += ' scale(0.1)';
    ballInner.style.opacity = '0';

    if (isCorrect) {
        showFeedbackText("SWISH! +10 PTS", "feedback-swish");

        const binImg = bin.querySelector('.physics-bin-img');
        if (binImg) {
            binImg.style.transform = 'scale(1.2)';
            setTimeout(() => binImg.style.transform = 'scale(1)', 350);
        }

        trashHoopsScore += 10;
        updateScoreboard();

        isGameActive = false;
        setTimeout(() => {
            processSuccessfulSort();
        }, 1000);
    } else {
        // Wrong Bin: Bounce out and fail
        setTimeout(() => {
            bounceOffBin(targetX, targetY - 30, "WRONG BIN!");
        }, 100);
    }
}

function handleFloorLanding() {
    // Check if the launch was too short or too long to give feedback
    let feedback = "MISS! TRY AGAIN";
    if (px < 320) {
        feedback = "TOO SHORT!";
    } else if (px > 780) {
        feedback = "TOO LONG!";
    }
    showFeedbackText(feedback, "feedback-miss");
    triggerFailureEffect();
}

function bounceOffBin(tx, ty, msg) {
    const ballWrapper = document.getElementById('trash-ball-wrapper');
    const ballInner = document.getElementById('trash-ball');

    ballWrapper.style.transition = 'left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)';
    ballWrapper.style.left = `${tx - 60}px`;
    ballWrapper.style.top = `${ty + 85}px`;

    ballInner.style.transition = 'transform 0.4s ease-out, opacity 0.4s';
    ballInner.style.transform = 'rotate(240deg) scale(0.8)';

    showFeedbackText(msg, "feedback-miss");
    triggerFailureEffect();
}

function triggerFailureEffect() {
    const overlay = document.getElementById('retro-failure-overlay');
    const court = document.getElementById('retro-physics-court');

    if (overlay) {
        overlay.classList.add('flash-active');
        setTimeout(() => overlay.classList.remove('flash-active'), 500);
    }

    if (court) {
        court.classList.add('shake-active');
        setTimeout(() => court.classList.remove('shake-active'), 500);
    }

    setTimeout(() => {
        resetBall();
    }, 600);
}

function resetBall() {
    const ballWrapper = document.getElementById('trash-ball-wrapper');
    const ballInner = document.getElementById('trash-ball');

    if (ballWrapper && ballInner) {
        ballWrapper.style.transition = 'none';
        ballWrapper.style.left = '';
        ballWrapper.style.top = '';

        ballInner.style.transition = 'none';
        ballInner.style.transform = 'none';
        ballInner.style.opacity = '1';

        isBallFlying = false;
        power = 0;
        updatePowerBarUI();
    }
}

function showFeedbackText(text, className) {
    const feedback = document.getElementById('retro-feedback');
    if (feedback) {
        feedback.textContent = text;
        feedback.className = `retro-feedback ${className}`;
        feedback.style.display = 'block';

        setTimeout(() => {
            feedback.style.display = 'none';
            feedback.className = 'retro-feedback';
        }, 800);
    }
}

// Data synchronization and popup triggers
function processSuccessfulSort() {
    const user = loadUserData();
    const oldExp = user.exp;

    if (user.name && user.name !== 'Anonymous') {
        saveDataAndAddExp(user.name, activeResultData);
        showSuccessPopup();
    } else {
        showNameInputPopup(oldExp);
    }
}

function showNameInputPopup(oldExp) {
    const popup = document.getElementById('name-input-popup');
    const input = document.getElementById('userNameInput');
    const submitBtn = document.getElementById('submitNameBtn');

    if (!popup || !input || !submitBtn) return;

    popup.style.display = 'flex';

    const freshBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(freshBtn, submitBtn);

    freshBtn.addEventListener('click', () => {
        const userName = input.value.trim() || 'Anonymous';
        const user = loadUserData();
        user.name = userName;
        saveUserData(user);
        saveDataAndAddExp(userName, activeResultData);

        popup.style.display = 'none';
        showSuccessPopup();
    });
}

function saveDataAndAddExp(userName, resultData) {
    saveToHistory(resultData);
    updateLeaderboard(userName, resultData);
    addExp(EXP_PER_ITEM);
}

function showSuccessPopup() {
    const popup = document.getElementById('success-popup');
    if (popup && activeResultData) {
        const co2El = document.getElementById('retro-impact-co2');
        const energyEl = document.getElementById('retro-impact-energy');
        const waterEl = document.getElementById('retro-impact-water');
        const decomposeEl = document.getElementById('retro-impact-decompose');

        if (co2El) co2El.textContent = activeResultData.eco_impact?.co2 || '-';
        if (energyEl) energyEl.textContent = activeResultData.eco_impact?.energy || '-';
        if (waterEl) waterEl.textContent = activeResultData.eco_impact?.water || '-';
        if (decomposeEl) decomposeEl.textContent = activeResultData.eco_impact?.decompose_time || '-';

        popup.style.display = 'flex';
    }
}

// Setup Event Listeners for Slingshot Inputs
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
    setupHUD();

    const shootBtn = document.getElementById('shoot-btn');
    if (shootBtn) {
        shootBtn.textContent = "DRAG BALL TO AIM";
        shootBtn.style.cursor = 'default';
    }

    // 1. Mouse/Touch Listeners on Ball (Initialize Slingshot dragging)
    const ballContainer = document.getElementById('trash-ball');
    if (ballContainer) {
        ballContainer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startDragging(e.clientX, e.clientY);
        });

        ballContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                e.preventDefault();
                startDragging(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
    }

    // 2. Global dragging movement listeners
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            handleDragging(e.clientX, e.clientY);
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length > 0) {
            handleDragging(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    // 3. Global release listeners
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            endDragging();
        }
    });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            endDragging();
        }
    });

    // Return button callback
    const returnBtn = document.getElementById('return-btn');
    if (returnBtn) {
        returnBtn.addEventListener('click', () => {
            localStorage.setItem('dauramaShowResult', 'true');
            window.location.href = 'index.html';
        });
    }
});
