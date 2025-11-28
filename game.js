// ===================================
// GAME STATE & CONFIGURATION
// ===================================
const CONFIG = {
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 600,
    PADDLE_WIDTH: 15,
    PADDLE_HEIGHT: 100,
    BALL_SIZE: 15,
    PADDLE_SPEED: 8,
    BALL_SPEED: 5,
    BALL_SPEED_INCREMENT: 0.001, // Speed increase per frame
    MAX_BALL_SPEED: 12, // Maximum ball speed
    WINNING_SCORE: 10,
    FPS: 60
};

const GAME_STATE = {
    isHost: false,
    isConnected: false,
    peer: null,
    connection: null,
    roomCode: null,
    gameStarted: false,
    player1Score: 0,
    player2Score: 0,
    paddle1Y: CONFIG.CANVAS_HEIGHT / 2 - CONFIG.PADDLE_HEIGHT / 2,
    paddle2Y: CONFIG.CANVAS_HEIGHT / 2 - CONFIG.PADDLE_HEIGHT / 2,
    ballX: CONFIG.CANVAS_WIDTH / 2,
    ballY: CONFIG.CANVAS_HEIGHT / 2,
    ballVelocityX: CONFIG.BALL_SPEED,
    ballVelocityY: CONFIG.BALL_SPEED,
    ballSpeed: CONFIG.BALL_SPEED, // Current ball speed
    gameTime: 0, // Track game time for speed increase
    keys: {},
    touchActive: {}, // Track active touch controls
    animationId: null
};

// ===================================
// DOM ELEMENTS
// ===================================
const elements = {
    // Screens
    mainMenu: document.getElementById('mainMenu'),
    hostScreen: document.getElementById('hostScreen'),
    joinScreen: document.getElementById('joinScreen'),
    howToPlayScreen: document.getElementById('howToPlayScreen'),
    gameScreen: document.getElementById('gameScreen'),
    gameOverScreen: document.getElementById('gameOverScreen'),

    // Buttons
    hostBtn: document.getElementById('hostBtn'),
    joinBtn: document.getElementById('joinBtn'),
    howToPlayBtn: document.getElementById('howToPlayBtn'),
    hostBackBtn: document.getElementById('hostBackBtn'),
    joinBackBtn: document.getElementById('joinBackBtn'),
    howToPlayBackBtn: document.getElementById('howToPlayBackBtn'),
    copyCodeBtn: document.getElementById('copyCodeBtn'),
    connectBtn: document.getElementById('connectBtn'),
    quitBtn: document.getElementById('quitBtn'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    mainMenuBtn: document.getElementById('mainMenuBtn'),

    // Display elements
    roomCode: document.getElementById('roomCode'),
    connectionStatus: document.getElementById('connectionStatus'),
    codeInput: document.getElementById('codeInput'),
    joinStatus: document.getElementById('joinStatus'),
    score1: document.getElementById('score1'),
    score2: document.getElementById('score2'),
    gameStatus: document.getElementById('gameStatus'),
    finalScore1: document.getElementById('finalScore1'),
    finalScore2: document.getElementById('finalScore2'),
    gameOverTitle: document.getElementById('gameOverTitle'),

    // Canvas
    canvas: document.getElementById('gameCanvas'),
    ctx: null
};

// Initialize canvas context
elements.ctx = elements.canvas.getContext('2d', { alpha: false }); // Disable alpha for better performance
elements.canvas.width = CONFIG.CANVAS_WIDTH;
elements.canvas.height = CONFIG.CANVAS_HEIGHT;

// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// ===================================
// SCREEN NAVIGATION
// ===================================
function showScreen(screenName) {
    // Hide all screens
    elements.mainMenu.classList.remove('active');
    elements.hostScreen.classList.remove('active');
    elements.joinScreen.classList.remove('active');
    elements.howToPlayScreen.classList.remove('active');
    elements.gameScreen.classList.remove('active');
    elements.gameOverScreen.classList.remove('active');

    // Show requested screen
    switch (screenName) {
        case 'main':
            elements.mainMenu.classList.add('active');
            break;
        case 'host':
            elements.hostScreen.classList.add('active');
            break;
        case 'join':
            elements.joinScreen.classList.add('active');
            break;
        case 'howToPlay':
            elements.howToPlayScreen.classList.add('active');
            break;
        case 'game':
            elements.gameScreen.classList.add('active');
            break;
        case 'gameOver':
            elements.gameOverScreen.classList.add('active');
            break;
    }
}

// ===================================
// ROOM CODE GENERATION
// ===================================
function generateRoomCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ===================================
// PEER CONNECTION (HOST)
// ===================================
function hostGame() {
    GAME_STATE.isHost = true;
    GAME_STATE.roomCode = generateRoomCode();

    elements.roomCode.textContent = GAME_STATE.roomCode;
    elements.connectionStatus.textContent = 'Waiting for player...';

    showScreen('host');

    // Initialize PeerJS
    GAME_STATE.peer = new Peer(GAME_STATE.roomCode, {
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        }
    });

    GAME_STATE.peer.on('open', (id) => {
        console.log('Peer opened with ID:', id);
        elements.connectionStatus.textContent = 'Ready! Waiting for player 2...';
    });

    GAME_STATE.peer.on('connection', (conn) => {
        GAME_STATE.connection = conn;

        conn.on('open', () => {
            GAME_STATE.isConnected = true;
            elements.connectionStatus.textContent = 'Player 2 connected!';

            setTimeout(() => {
                startGame();
            }, 1000);
        });

        conn.on('data', (data) => {
            handlePeerData(data);
        });

        conn.on('close', () => {
            handleDisconnect();
        });
    });

    GAME_STATE.peer.on('error', (err) => {
        console.error('Peer error:', err);
        elements.connectionStatus.textContent = 'Connection error. Please try again.';
    });
}

// ===================================
// PEER CONNECTION (CLIENT)
// ===================================
function joinGame(roomCode) {
    GAME_STATE.isHost = false;

    elements.joinStatus.textContent = 'Connecting...';
    elements.joinStatus.className = 'join-status';

    // Initialize PeerJS
    GAME_STATE.peer = new Peer({
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        }
    });

    GAME_STATE.peer.on('open', () => {
        // Connect to host
        GAME_STATE.connection = GAME_STATE.peer.connect(roomCode);

        GAME_STATE.connection.on('open', () => {
            GAME_STATE.isConnected = true;
            elements.joinStatus.textContent = 'Connected! Starting game...';
            elements.joinStatus.className = 'join-status success';

            setTimeout(() => {
                startGame();
            }, 1000);
        });

        GAME_STATE.connection.on('data', (data) => {
            handlePeerData(data);
        });

        GAME_STATE.connection.on('close', () => {
            handleDisconnect();
        });

        GAME_STATE.connection.on('error', (err) => {
            console.error('Connection error:', err);
            elements.joinStatus.textContent = 'Failed to connect. Check the room code.';
            elements.joinStatus.className = 'join-status error';
        });
    });

    GAME_STATE.peer.on('error', (err) => {
        console.error('Peer error:', err);
        elements.joinStatus.textContent = 'Connection error. Please try again.';
        elements.joinStatus.className = 'join-status error';
    });
}

// ===================================
// HANDLE PEER DATA
// ===================================
function handlePeerData(data) {
    switch (data.type) {
        case 'gameState':
            // Update game state from host
            if (!GAME_STATE.isHost) {
                GAME_STATE.player1Score = data.player1Score;
                GAME_STATE.player2Score = data.player2Score;
                GAME_STATE.ballX = data.ballX;
                GAME_STATE.ballY = data.ballY;
                GAME_STATE.paddle1Y = data.paddle1Y;
                GAME_STATE.ballSpeed = data.ballSpeed;
            }
            break;

        case 'paddleMove':
            // Update opponent's paddle position
            if (GAME_STATE.isHost) {
                GAME_STATE.paddle2Y = data.paddleY;
            } else {
                GAME_STATE.paddle1Y = data.paddleY;
            }
            break;

        case 'gameOver':
            endGame(data.winner);
            break;

        case 'playAgain':
            resetGame();
            startGame();
            break;
    }
}

// ===================================
// SEND DATA TO PEER
// ===================================
function sendData(data) {
    if (GAME_STATE.connection && GAME_STATE.connection.open) {
        GAME_STATE.connection.send(data);
    }
}

// ===================================
// HANDLE DISCONNECT
// ===================================
function handleDisconnect() {
    GAME_STATE.isConnected = false;

    if (GAME_STATE.gameStarted) {
        alert('Opponent disconnected!');
        returnToMainMenu();
    }
}

// ===================================
// START GAME
// ===================================
function startGame() {
    showScreen('game');
    resetGame();
    GAME_STATE.gameStarted = true;
    elements.gameStatus.textContent = 'Playing';

    // Start game loop
    gameLoop();
}

// ===================================
// RESET GAME
// ===================================
function resetGame() {
    GAME_STATE.player1Score = 0;
    GAME_STATE.player2Score = 0;
    GAME_STATE.paddle1Y = CONFIG.CANVAS_HEIGHT / 2 - CONFIG.PADDLE_HEIGHT / 2;
    GAME_STATE.paddle2Y = CONFIG.CANVAS_HEIGHT / 2 - CONFIG.PADDLE_HEIGHT / 2;
    GAME_STATE.ballSpeed = CONFIG.BALL_SPEED; // Reset ball speed
    GAME_STATE.gameTime = 0; // Reset game time
    resetBall();
    updateScoreDisplay();
}

// ===================================
// RESET BALL
// ===================================
function resetBall() {
    GAME_STATE.ballX = CONFIG.CANVAS_WIDTH / 2;
    GAME_STATE.ballY = CONFIG.CANVAS_HEIGHT / 2;

    // Don't reset ball speed on point scored - keeps progressive difficulty
    // Random direction
    const angle = (Math.random() * Math.PI / 4) - Math.PI / 8; // -22.5 to 22.5 degrees
    const direction = Math.random() < 0.5 ? 1 : -1;

    GAME_STATE.ballVelocityX = Math.cos(angle) * GAME_STATE.ballSpeed * direction;
    GAME_STATE.ballVelocityY = Math.sin(angle) * GAME_STATE.ballSpeed;
}

// ===================================
// GAME LOOP
// ===================================
function gameLoop() {
    if (!GAME_STATE.gameStarted) return;

    update();
    render();

    GAME_STATE.animationId = requestAnimationFrame(gameLoop);
}

// ===================================
// UPDATE GAME STATE
// ===================================
function update() {
    // Increase ball speed over time (host only)
    if (GAME_STATE.isHost && GAME_STATE.gameStarted) {
        GAME_STATE.gameTime++;
        GAME_STATE.ballSpeed = Math.min(
            CONFIG.MAX_BALL_SPEED,
            CONFIG.BALL_SPEED + (GAME_STATE.gameTime * CONFIG.BALL_SPEED_INCREMENT)
        );
    }

    // Only host updates ball physics
    if (GAME_STATE.isHost) {
        updateBall();
        checkCollisions();
        checkScore();

        // Send game state to client
        sendData({
            type: 'gameState',
            player1Score: GAME_STATE.player1Score,
            player2Score: GAME_STATE.player2Score,
            ballX: GAME_STATE.ballX,
            ballY: GAME_STATE.ballY,
            paddle1Y: GAME_STATE.paddle1Y,
            ballSpeed: GAME_STATE.ballSpeed
        });
    }

    // Update own paddle
    updatePaddle();
}

// ===================================
// UPDATE BALL (HOST ONLY)
// ===================================
function updateBall() {
    GAME_STATE.ballX += GAME_STATE.ballVelocityX;
    GAME_STATE.ballY += GAME_STATE.ballVelocityY;

    // Top and bottom wall collision
    if (GAME_STATE.ballY <= CONFIG.BALL_SIZE / 2 ||
        GAME_STATE.ballY >= CONFIG.CANVAS_HEIGHT - CONFIG.BALL_SIZE / 2) {
        GAME_STATE.ballVelocityY *= -1;
    }
}

// ===================================
// CHECK COLLISIONS (HOST ONLY)
// ===================================
function checkCollisions() {
    // Left paddle collision
    if (GAME_STATE.ballX - CONFIG.BALL_SIZE / 2 <= CONFIG.PADDLE_WIDTH &&
        GAME_STATE.ballY >= GAME_STATE.paddle1Y &&
        GAME_STATE.ballY <= GAME_STATE.paddle1Y + CONFIG.PADDLE_HEIGHT) {

        const hitPos = (GAME_STATE.ballY - GAME_STATE.paddle1Y) / CONFIG.PADDLE_HEIGHT;
        const angle = (hitPos - 0.5) * Math.PI / 3; // -60 to 60 degrees

        GAME_STATE.ballVelocityX = Math.abs(GAME_STATE.ballVelocityX);
        GAME_STATE.ballVelocityY = Math.sin(angle) * GAME_STATE.ballSpeed;
        GAME_STATE.ballX = CONFIG.PADDLE_WIDTH + CONFIG.BALL_SIZE / 2;
    }

    // Right paddle collision
    if (GAME_STATE.ballX + CONFIG.BALL_SIZE / 2 >= CONFIG.CANVAS_WIDTH - CONFIG.PADDLE_WIDTH &&
        GAME_STATE.ballY >= GAME_STATE.paddle2Y &&
        GAME_STATE.ballY <= GAME_STATE.paddle2Y + CONFIG.PADDLE_HEIGHT) {

        const hitPos = (GAME_STATE.ballY - GAME_STATE.paddle2Y) / CONFIG.PADDLE_HEIGHT;
        const angle = (hitPos - 0.5) * Math.PI / 3;

        GAME_STATE.ballVelocityX = -Math.abs(GAME_STATE.ballVelocityX);
        GAME_STATE.ballVelocityY = Math.sin(angle) * GAME_STATE.ballSpeed;
        GAME_STATE.ballX = CONFIG.CANVAS_WIDTH - CONFIG.PADDLE_WIDTH - CONFIG.BALL_SIZE / 2;
    }
}

// ===================================
// CHECK SCORE (HOST ONLY)
// ===================================
function checkScore() {
    // Player 2 scores
    if (GAME_STATE.ballX <= 0) {
        GAME_STATE.player2Score++;
        updateScoreDisplay();
        resetBall();

        if (GAME_STATE.player2Score >= CONFIG.WINNING_SCORE) {
            endGame(2);
        }
    }

    // Player 1 scores
    if (GAME_STATE.ballX >= CONFIG.CANVAS_WIDTH) {
        GAME_STATE.player1Score++;
        updateScoreDisplay();
        resetBall();

        if (GAME_STATE.player1Score >= CONFIG.WINNING_SCORE) {
            endGame(1);
        }
    }
}

// ===================================
// UPDATE PADDLE
// ===================================
function updatePaddle() {
    // Player 1 controls (W/S or touch)
    if (GAME_STATE.isHost) {
        if (GAME_STATE.keys['w'] || GAME_STATE.keys['W'] || GAME_STATE.touchActive['w']) {
            GAME_STATE.paddle1Y = Math.max(0, GAME_STATE.paddle1Y - CONFIG.PADDLE_SPEED);
        }
        if (GAME_STATE.keys['s'] || GAME_STATE.keys['S'] || GAME_STATE.touchActive['s']) {
            GAME_STATE.paddle1Y = Math.min(CONFIG.CANVAS_HEIGHT - CONFIG.PADDLE_HEIGHT,
                GAME_STATE.paddle1Y + CONFIG.PADDLE_SPEED);
        }

        // Send paddle position to opponent
        sendData({
            type: 'paddleMove',
            paddleY: GAME_STATE.paddle1Y
        });
    } else {
        // Player 2 controls (Arrow keys or touch)
        if (GAME_STATE.keys['ArrowUp'] || GAME_STATE.touchActive['ArrowUp']) {
            GAME_STATE.paddle2Y = Math.max(0, GAME_STATE.paddle2Y - CONFIG.PADDLE_SPEED);
        }
        if (GAME_STATE.keys['ArrowDown'] || GAME_STATE.touchActive['ArrowDown']) {
            GAME_STATE.paddle2Y = Math.min(CONFIG.CANVAS_HEIGHT - CONFIG.PADDLE_HEIGHT,
                GAME_STATE.paddle2Y + CONFIG.PADDLE_SPEED);
        }

        // Send paddle position to opponent
        sendData({
            type: 'paddleMove',
            paddleY: GAME_STATE.paddle2Y
        });
    }
}

// ===================================
// RENDER GAME
// ===================================
function render() {
    const ctx = elements.ctx;

    // Clear canvas
    ctx.fillStyle = '#13131a';
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Draw center line
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(CONFIG.CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    // Player 1 paddle (cyan)
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 20;
    ctx.fillRect(0, GAME_STATE.paddle1Y, CONFIG.PADDLE_WIDTH, CONFIG.PADDLE_HEIGHT);

    // Player 2 paddle (magenta)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.fillRect(CONFIG.CANVAS_WIDTH - CONFIG.PADDLE_WIDTH, GAME_STATE.paddle2Y,
        CONFIG.PADDLE_WIDTH, CONFIG.PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(GAME_STATE.ballX, GAME_STATE.ballY, CONFIG.BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
}

// ===================================
// UPDATE SCORE DISPLAY
// ===================================
function updateScoreDisplay() {
    elements.score1.textContent = GAME_STATE.player1Score;
    elements.score2.textContent = GAME_STATE.player2Score;
}

// ===================================
// END GAME
// ===================================
function endGame(winner) {
    GAME_STATE.gameStarted = false;

    if (GAME_STATE.animationId) {
        cancelAnimationFrame(GAME_STATE.animationId);
    }

    // Update final scores
    elements.finalScore1.textContent = GAME_STATE.player1Score;
    elements.finalScore2.textContent = GAME_STATE.player2Score;
    elements.gameOverTitle.textContent = `Player ${winner} Wins!`;

    // Send game over to opponent if host
    if (GAME_STATE.isHost) {
        sendData({
            type: 'gameOver',
            winner: winner
        });
    }

    showScreen('gameOver');
}

// ===================================
// RETURN TO MAIN MENU
// ===================================
function returnToMainMenu() {
    GAME_STATE.gameStarted = false;

    if (GAME_STATE.animationId) {
        cancelAnimationFrame(GAME_STATE.animationId);
    }

    // Close connections
    if (GAME_STATE.connection) {
        GAME_STATE.connection.close();
    }
    if (GAME_STATE.peer) {
        GAME_STATE.peer.destroy();
    }

    // Reset state
    GAME_STATE.isHost = false;
    GAME_STATE.isConnected = false;
    GAME_STATE.peer = null;
    GAME_STATE.connection = null;
    GAME_STATE.roomCode = null;

    showScreen('main');
}

// ===================================
// EVENT LISTENERS
// ===================================

// Main menu buttons
elements.hostBtn.addEventListener('click', hostGame);
elements.joinBtn.addEventListener('click', () => showScreen('join'));
elements.howToPlayBtn.addEventListener('click', () => showScreen('howToPlay'));

// Back buttons
elements.hostBackBtn.addEventListener('click', () => {
    if (GAME_STATE.peer) {
        GAME_STATE.peer.destroy();
    }
    showScreen('main');
});

elements.joinBackBtn.addEventListener('click', () => showScreen('main'));
elements.howToPlayBackBtn.addEventListener('click', () => showScreen('main'));

// Copy room code
elements.copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(GAME_STATE.roomCode).then(() => {
        elements.copyCodeBtn.innerHTML = '<span>✓ Copied!</span>';
        setTimeout(() => {
            elements.copyCodeBtn.innerHTML = '<span>📋 Copy Code</span>';
        }, 2000);
    });
});

// Code input validation
elements.codeInput.addEventListener('input', (e) => {
    const value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
    elements.connectBtn.disabled = value.length !== 6;
    elements.joinStatus.textContent = '';
});

// Connect button
elements.connectBtn.addEventListener('click', () => {
    const roomCode = elements.codeInput.value;
    if (roomCode.length === 6) {
        joinGame(roomCode);
    }
});

// Quit game
elements.quitBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to quit?')) {
        returnToMainMenu();
    }
});

// Play again
elements.playAgainBtn.addEventListener('click', () => {
    sendData({ type: 'playAgain' });
    resetGame();
    startGame();
});

// Main menu from game over
elements.mainMenuBtn.addEventListener('click', returnToMainMenu);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    GAME_STATE.keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    GAME_STATE.keys[e.key] = false;
});

// Prevent arrow key scrolling
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.key)) {
        e.preventDefault();
    }
});

// ===================================
// MOBILE TOUCH CONTROLS
// ===================================
function setupTouchControls() {
    const touchControls = document.getElementById('touchControls');
    const touchButtons = document.querySelectorAll('.touch-btn');

    // Show touch controls on mobile
    if (isMobile) {
        touchControls.classList.add('active');
    }

    touchButtons.forEach(btn => {
        const key = btn.getAttribute('data-key');

        // Touch start
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            GAME_STATE.touchActive[key] = true;
            btn.style.transform = 'scale(0.9)';
        });

        // Touch end
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            GAME_STATE.touchActive[key] = false;
            btn.style.transform = 'scale(1)';
        });

        // Touch cancel
        btn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            GAME_STATE.touchActive[key] = false;
            btn.style.transform = 'scale(1)';
        });

        // Mouse events for desktop testing
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            GAME_STATE.touchActive[key] = true;
        });

        btn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            GAME_STATE.touchActive[key] = false;
        });
    });
}

// Initialize touch controls
setupTouchControls();

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================
// Disable context menu on long press (mobile)
document.addEventListener('contextmenu', (e) => {
    if (isMobile) {
        e.preventDefault();
    }
});

// Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ===================================
// INITIALIZE
// ===================================
console.log('Neon Pong initialized!');
console.log('Mobile device:', isMobile);
