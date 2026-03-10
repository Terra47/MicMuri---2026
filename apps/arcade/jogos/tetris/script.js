const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
const holdCanvas = document.getElementById('holdCanvas');
const holdCtx = holdCanvas.getContext('2d');

canvas.width = 300;
canvas.height = 600;
nextCanvas.width = 120;
nextCanvas.height = 120;
holdCanvas.width = 120;
holdCanvas.height = 120;

const COLS = 10;
const ROWS = 20;
const CELL_SIZE = canvas.width / COLS;

let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let score = 0;
let lines = 0;
let level = 1;
let gameActive = false;
let gamePaused = false;
let gameOver = false;

let currentPiece = null;
let nextPiece = null;
let holdPiece = null;
let canHold = true;

let dropInterval = null;
let dropSpeed = 500;

const pieces = [
    { shape: [[1, 1, 1, 1]], color: '#00ffff' },
    { shape: [[1, 1], [1, 1]], color: '#ffff00' },
    { shape: [[1, 1, 1], [0, 1, 0]], color: '#ff00ff' },
    { shape: [[1, 1, 1], [1, 0, 0]], color: '#ff6600' },
    { shape: [[1, 1, 1], [0, 0, 1]], color: '#0000ff' },
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#00ff00' },
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#ff0000' }
];

const scoreSpan = document.getElementById('score');
const linesSpan = document.getElementById('lines');
const levelSpan = document.getElementById('level');
const pauseScreen = document.getElementById('pauseScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const finalLines = document.getElementById('finalLines');
const finalLevel = document.getElementById('finalLevel');
const restartBtn = document.getElementById('restartBtn');

function formatScore(value) {
    return value.toString().padStart(6, '0');
}

function formatLines(value) {
    return value.toString().padStart(3, '0');
}

function formatLevel(value) {
    return value.toString().padStart(2, '0');
}

function randomPiece() {
    const idx = Math.floor(Math.random() * pieces.length);
    return {
        shape: pieces[idx].shape.map(row => [...row]),
        color: pieces[idx].color,
        x: Math.floor((COLS - pieces[idx].shape[0].length) / 2),
        y: 0
    };
}

function spawnNewPiece() {
    if (!nextPiece) {
        nextPiece = randomPiece();
    }
    currentPiece = {
        shape: nextPiece.shape.map(row => [...row]),
        color: nextPiece.color,
        x: Math.floor((COLS - nextPiece.shape[0].length) / 2),
        y: 0
    };
    nextPiece = randomPiece();
    canHold = true;
    
    if (collision(currentPiece.shape, currentPiece.x, currentPiece.y)) {
        gameActive = false;
        gameOver = true;
        finalScore.textContent = `Pontuação: ${formatScore(score)}`;
        finalLines.textContent = `Linhas: ${formatLines(lines)}`;
        finalLevel.textContent = `Nível: ${formatLevel(level)}`;
        gameOverScreen.classList.remove('hidden');
        clearInterval(dropInterval);
    }
}

function collision(shape, offsetX, offsetY) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[0].length; c++) {
            if (shape[r][c] !== 0) {
                const boardX = offsetX + c;
                const boardY = offsetY + r;
                if (boardX < 0 || boardX >= COLS || boardY >= ROWS || boardY < 0) return true;
                if (boardY >= 0 && board[boardY][boardX] !== 0) return true;
            }
        }
    }
    return false;
}

function mergePiece() {
    if (!currentPiece) return;
    
    for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[0].length; c++) {
            if (currentPiece.shape[r][c] !== 0) {
                const boardX = currentPiece.x + c;
                const boardY = currentPiece.y + r;
                if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                    board[boardY][boardX] = currentPiece.color;
                }
            }
        }
    }
    
    checkLines();
    spawnNewPiece();
}

function checkLines() {
    let linesCleared = 0;
    
    for (let r = ROWS - 1; r >= 0; r--) {
        let full = true;
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === 0) {
                full = false;
                break;
            }
        }
        
        if (full) {
            linesCleared++;
            for (let r2 = r; r2 > 0; r2--) {
                board[r2] = [...board[r2 - 1]];
            }
            board[0] = Array(COLS).fill(0);
            r++;
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        const baseScore = [0, 40, 100, 300, 1200];
        const idx = Math.min(linesCleared, 4);
        score += baseScore[idx] * level;
        level = Math.floor(lines / 10) + 1;
        dropSpeed = Math.max(100, 500 - (level - 1) * 40);
        
        if (gameActive && !gamePaused && !gameOver) {
            clearInterval(dropInterval);
            dropInterval = setInterval(() => {
                if (gameActive && !gamePaused && !gameOver) movePiece('down');
            }, dropSpeed);
        }
        
        linesSpan.textContent = formatLines(lines);
        levelSpan.textContent = formatLevel(level);
        scoreSpan.textContent = formatScore(score);
    }
}

function movePiece(dir) {
    if (!gameActive || gamePaused || gameOver || !currentPiece) return;
    
    if (dir === 'left') {
        if (!collision(currentPiece.shape, currentPiece.x - 1, currentPiece.y)) {
            currentPiece.x--;
        }
    } else if (dir === 'right') {
        if (!collision(currentPiece.shape, currentPiece.x + 1, currentPiece.y)) {
            currentPiece.x++;
        }
    } else if (dir === 'down') {
        if (!collision(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
            currentPiece.y++;
        } else {
            mergePiece();
        }
    }
}

function rotatePiece() {
    if (!gameActive || gamePaused || gameOver || !currentPiece) return;
    
    const rotated = currentPiece.shape[0].map((_, idx) => 
        currentPiece.shape.map(row => row[idx]).reverse()
    );
    
    if (!collision(rotated, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = rotated;
    } else {
        if (!collision(rotated, currentPiece.x + 1, currentPiece.y)) {
            currentPiece.shape = rotated;
            currentPiece.x++;
        } else if (!collision(rotated, currentPiece.x - 1, currentPiece.y)) {
            currentPiece.shape = rotated;
            currentPiece.x--;
        }
    }
}

function hardDrop() {
    if (!gameActive || gamePaused || gameOver || !currentPiece) return;
    
    while (!collision(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y++;
    }
    mergePiece();
}

function holdCurrent() {
    if (!gameActive || gamePaused || gameOver || !canHold || !currentPiece) return;
    
    if (!holdPiece) {
        holdPiece = {
            shape: currentPiece.shape.map(row => [...row]),
            color: currentPiece.color
        };
        spawnNewPiece();
    } else {
        const temp = {
            shape: currentPiece.shape.map(row => [...row]),
            color: currentPiece.color
        };
        currentPiece = {
            shape: holdPiece.shape.map(row => [...row]),
            color: holdPiece.color,
            x: Math.floor((COLS - holdPiece.shape[0].length) / 2),
            y: 0
        };
        holdPiece = temp;
    }
    
    canHold = false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== 0) {
                ctx.fillStyle = board[r][c];
                ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
                
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.strokeRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
            } else {
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
    
    if (currentPiece && !gameOver) {
        for (let r = 0; r < currentPiece.shape.length; r++) {
            for (let c = 0; c < currentPiece.shape[0].length; c++) {
                if (currentPiece.shape[r][c] !== 0) {
                    const x = (currentPiece.x + c) * CELL_SIZE;
                    const y = (currentPiece.y + r) * CELL_SIZE;
                    ctx.fillStyle = currentPiece.color;
                    ctx.fillRect(x, y, CELL_SIZE - 1, CELL_SIZE - 1);
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, CELL_SIZE - 1, CELL_SIZE - 1);
                }
            }
        }
    }
    
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    nextCtx.fillStyle = '#000000';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (nextPiece) {
        const cellSize = nextCanvas.width / 4;
        for (let r = 0; r < nextPiece.shape.length; r++) {
            for (let c = 0; c < nextPiece.shape[0].length; c++) {
                if (nextPiece.shape[r][c] !== 0) {
                    const x = c * cellSize + (4 - nextPiece.shape[0].length) * cellSize / 2;
                    const y = r * cellSize + (4 - nextPiece.shape.length) * cellSize / 2;
                    nextCtx.fillStyle = nextPiece.color;
                    nextCtx.fillRect(x, y, cellSize - 1, cellSize - 1);
                }
            }
        }
    }
    
    holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
    holdCtx.fillStyle = '#000000';
    holdCtx.fillRect(0, 0, holdCanvas.width, holdCanvas.height);
    
    if (holdPiece) {
        const cellSize = holdCanvas.width / 4;
        for (let r = 0; r < holdPiece.shape.length; r++) {
            for (let c = 0; c < holdPiece.shape[0].length; c++) {
                if (holdPiece.shape[r][c] !== 0) {
                    const x = c * cellSize + (4 - holdPiece.shape[0].length) * cellSize / 2;
                    const y = r * cellSize + (4 - holdPiece.shape.length) * cellSize / 2;
                    holdCtx.fillStyle = holdPiece.color;
                    holdCtx.fillRect(x, y, cellSize - 1, cellSize - 1);
                }
            }
        }
    }
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    score = 0;
    lines = 0;
    level = 1;
    gameActive = true;
    gamePaused = false;
    gameOver = false;
    holdPiece = null;
    canHold = true;
    
    scoreSpan.textContent = formatScore(0);
    linesSpan.textContent = formatLines(0);
    levelSpan.textContent = formatLevel(1);
    dropSpeed = 500;
    
    nextPiece = randomPiece();
    spawnNewPiece();
    
    if (dropInterval) clearInterval(dropInterval);
    dropInterval = setInterval(() => {
        if (gameActive && !gamePaused && !gameOver) movePiece('down');
    }, dropSpeed);
    
    pauseScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (gameActive && !gameOver) {
            gamePaused = !gamePaused;
            if (gamePaused) {
                pauseScreen.classList.remove('hidden');
            } else {
                pauseScreen.classList.add('hidden');
            }
        }
    }
    
    if (!gameActive || gamePaused || gameOver) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            movePiece('left');
            break;
        case 'ArrowRight':
            e.preventDefault();
            movePiece('right');
            break;
        case 'ArrowDown':
            e.preventDefault();
            movePiece('down');
            break;
        case 'ArrowUp':
            e.preventDefault();
            rotatePiece();
            break;
        case ' ':
            e.preventDefault();
            hardDrop();
            break;
        case 'c':
        case 'C':
            e.preventDefault();
            holdCurrent();
            break;
    }
});

restartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    gameOverScreen.classList.add('hidden');
    startGame();
});

document.getElementById('backToArcade').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../index.html';
});

startGame();
gameLoop();