const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const GRID_SIZE = 20;
const CELL_SIZE = canvas.width / GRID_SIZE;
const GAME_SPEED = 150;

let snake = [];
let food = {};
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameActive = false;
let gamePaused = false;
let gameOver = false;
let gameInterval = null;
let currentMode = 'classic';

const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('highScore');
const startScreen = document.getElementById('startScreen');
const pauseScreen = document.getElementById('pauseScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverScore = document.getElementById('gameOverScore');
const gameOverHighScore = document.getElementById('gameOverHighScore');
const startGameBtn = document.getElementById('startGameBtn');
const newGameBtn = document.getElementById('newGameBtn');
const restartBtn = document.getElementById('restartBtn');
const modeBtns = document.querySelectorAll('.mode-btn');

highScoreSpan.textContent = highScore;

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    score = 0;
    scoreSpan.textContent = score;
    generateFood();
}

function generateFood() {
    let validPosition = false;
    let attempts = 0;
    
    while (!validPosition && attempts < 1000) {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        
        validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
        attempts++;
    }
    
    if (!validPosition) {
        gameOver = true;
        endGame();
    }
}

function changeDirection(newDir) {
    if (!gameActive || gamePaused || gameOver) return;
    
    if (
        (direction === 'RIGHT' && newDir !== 'LEFT') ||
        (direction === 'LEFT' && newDir !== 'RIGHT') ||
        (direction === 'UP' && newDir !== 'DOWN') ||
        (direction === 'DOWN' && newDir !== 'UP')
    ) {
        nextDirection = newDir;
    }
}

function startGame() {
    initGame();
    gameActive = true;
    gamePaused = false;
    gameOver = false;
    startScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(update, GAME_SPEED);
}

function pauseGame() {
    if (!gameActive || gameOver) return;
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        clearInterval(gameInterval);
        pauseScreen.classList.remove('hidden');
    } else {
        gameInterval = setInterval(update, GAME_SPEED);
        pauseScreen.classList.add('hidden');
    }
}

function endGame() {
    gameActive = false;
    gameOver = true;
    
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreSpan.textContent = highScore;
    }
    
    gameOverScore.textContent = `Pontuação: ${score}`;
    gameOverHighScore.textContent = `Recorde: ${highScore}`;
    gameOverScreen.classList.remove('hidden');
}

function resetGame() {
    if (gameInterval) clearInterval(gameInterval);
    startGame();
}

function update() {
    if (!gameActive || gamePaused || gameOver) return;
    
    direction = nextDirection;
    
    let newHead = { ...snake[0] };
    
    switch (direction) {
        case 'RIGHT': newHead.x++; break;
        case 'LEFT': newHead.x--; break;
        case 'UP': newHead.y--; break;
        case 'DOWN': newHead.y++; break;
    }
    
    if (currentMode === 'classic') {
        if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
        if (newHead.x >= GRID_SIZE) newHead.x = 0;
        if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
        if (newHead.y >= GRID_SIZE) newHead.y = 0;
    } else if (currentMode === 'walls') {
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
            endGame();
            return;
        }
    }
    
    let ateFood = (newHead.x === food.x && newHead.y === food.y);
    
    snake.unshift(newHead);
    if (!ateFood) {
        snake.pop();
    } else {
        score += 10;
        scoreSpan.textContent = score;
        generateFood();
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            endGame();
            return;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.strokeStyle = '#333333';
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }
    
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#00ff00';
        } else {
            ctx.fillStyle = '#00aa00';
        }
        ctx.fillRect(
            segment.x * CELL_SIZE + 1,
            segment.y * CELL_SIZE + 1,
            CELL_SIZE - 2,
            CELL_SIZE - 2
        );
    });
    
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE/2,
        food.y * CELL_SIZE + CELL_SIZE/2,
        CELL_SIZE/2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            changeDirection('UP');
            break;
        case 'ArrowDown':
            e.preventDefault();
            changeDirection('DOWN');
            break;
        case 'ArrowLeft':
            e.preventDefault();
            changeDirection('LEFT');
            break;
        case 'ArrowRight':
            e.preventDefault();
            changeDirection('RIGHT');
            break;
        case ' ':
            e.preventDefault();
            if (gameActive && !gameOver) {
                pauseGame();
            }
            break;
        case 'r':
        case 'R':
            e.preventDefault();
            resetGame();
            break;
    }
});

modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        resetGame();
    });
});

startGameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    startGame();
});

newGameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetGame();
});

restartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    gameOverScreen.classList.add('hidden');
    resetGame();
});

document.getElementById('backToArcade').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../index.html';
});

document.getElementById('touchUp')?.addEventListener('click', (e) => {
    e.preventDefault();
    changeDirection('UP');
});

document.getElementById('touchDown')?.addEventListener('click', (e) => {
    e.preventDefault();
    changeDirection('DOWN');
});

document.getElementById('touchLeft')?.addEventListener('click', (e) => {
    e.preventDefault();
    changeDirection('LEFT');
});

document.getElementById('touchRight')?.addEventListener('click', (e) => {
    e.preventDefault();
    changeDirection('RIGHT');
});

document.getElementById('touchUp')?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    changeDirection('UP');
});

document.getElementById('touchDown')?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    changeDirection('DOWN');
});

document.getElementById('touchLeft')?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    changeDirection('LEFT');
});

document.getElementById('touchRight')?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    changeDirection('RIGHT');
});

window.addEventListener('keydown', (e) => {
    if (e.key.startsWith('Arrow') || e.key === ' ') {
        e.preventDefault();
    }
}, { passive: false });

initGame();
gameLoop();