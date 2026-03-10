let grid = [];
let score = 0;
let highScore = 0;
let gameOver = false;
let gameWon = false;
let bestTile = 0;
let moveCount = 0;
let gridSize = 4;
let isAnimating = false;
let lastMoveTime = 0;
const MOVE_COOLDOWN = 150;

function loadHighScore() {
    const saved = localStorage.getItem('2048_highscore');
    if (saved) highScore = parseInt(saved);
    updateHighScore();
}

function saveHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('2048_highscore', highScore.toString());
        updateHighScore();
    }
}

function updateHighScore() {
    document.getElementById('highScore').textContent = highScore;
}

function initGrid() {
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    score = 0;
    gameOver = false;
    gameWon = false;
    bestTile = 0;
    moveCount = 0;
    updateScore();
    updateBestTile();
    updateMoveCount();
    addNewTile();
    addNewTile();
    renderGrid();
}

function addNewTile() {
    let emptyCells = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({x: i, y: j});
            }
        }
    }
    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        return randomCell;
    }
    return null;
}

function renderGrid() {
    const container = document.getElementById('gridContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.setAttribute('data-value', grid[i][j]);
            tile.textContent = grid[i][j] === 0 ? '' : grid[i][j];
            container.appendChild(tile);
        }
    }
    if (checkGameOver()) {
        gameOver = true;
        setTimeout(() => showGameOver(), 500);
    }
}

function move(direction) {
    const now = Date.now();
    if (gameOver || gameWon || isAnimating || (now - lastMoveTime < MOVE_COOLDOWN)) return;
    lastMoveTime = now;
    isAnimating = true;
    let moved = false;
    let newGrid = JSON.parse(JSON.stringify(grid));
    switch(direction) {
        case 'up': moved = moveDirection(newGrid, 'up'); break;
        case 'down': moved = moveDirection(newGrid, 'down'); break;
        case 'left': moved = moveDirection(newGrid, 'left'); break;
        case 'right': moved = moveDirection(newGrid, 'right'); break;
    }
    if (moved) {
        moveCount++;
        updateMoveCount();
        grid = newGrid;
        renderGrid();
        setTimeout(() => {
            addNewTile();
            renderGrid();
            updateBestTile();
            saveHighScore();
            if (!gameWon && checkWin()) {
                gameWon = true;
                setTimeout(() => showVictory(), 200);
            }
        }, 100);
    }
    isAnimating = false;
}

function moveDirection(grid, dir) {
    let moved = false;
    const size = gridSize;
    for (let i = 0; i < size; i++) {
        let line = [];
        for (let j = 0; j < size; j++) {
            if (dir === 'left' || dir === 'right') {
                line.push(grid[i][j]);
            } else {
                line.push(grid[j][i]);
            }
        }
        if (dir === 'right' || dir === 'down') {
            line.reverse();
        }
        let newLine = [];
        for (let j = 0; j < size; j++) {
            if (line[j] !== 0) newLine.push(line[j]);
        }
        for (let j = 0; j < newLine.length - 1; j++) {
            if (newLine[j] === newLine[j+1]) {
                newLine[j] *= 2;
                score += newLine[j];
                newLine.splice(j+1, 1);
                moved = true;
            }
        }
        while (newLine.length < size) {
            newLine.push(0);
        }
        if (dir === 'right' || dir === 'down') {
            newLine.reverse();
        }
        for (let j = 0; j < size; j++) {
            if (dir === 'left' || dir === 'right') {
                if (grid[i][j] !== newLine[j]) moved = true;
                grid[i][j] = newLine[j];
            } else {
                if (grid[j][i] !== newLine[j]) moved = true;
                grid[j][i] = newLine[j];
            }
        }
    }
    updateScore();
    return moved;
}

function checkGameOver() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) return false;
            if (j < gridSize-1 && grid[i][j] === grid[i][j+1]) return false;
            if (i < gridSize-1 && grid[i][j] === grid[i+1][j]) return false;
        }
    }
    return true;
}

function checkWin() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 2048) return true;
        }
    }
    return false;
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateBestTile() {
    let max = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] > max) max = grid[i][j];
        }
    }
    bestTile = max;
    document.getElementById('bestTile').textContent = bestTile;
}

function updateMoveCount() {
    document.getElementById('moveCount').textContent = moveCount;
}

function showGameOver() {
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay';
    overlay.innerHTML = `
        <div class="overlay-title">GAME OVER</div>
        <div class="overlay-score">SCORE: ${score}</div>
        <div class="overlay-score">MELHOR PEÇA: ${bestTile}</div>
        <button class="overlay-button" id="overlayRestart">JOGAR NOVAMENTE</button>
    `;
    document.body.appendChild(overlay);
    document.getElementById('overlayRestart').addEventListener('click', () => {
        overlay.remove();
        initGrid();
    });
}

function showVictory() {
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay';
    overlay.innerHTML = `
        <div class="overlay-title">VOCÊ VENCEU!</div>
        <div class="overlay-score">SCORE: ${score}</div>
        <button class="overlay-button" id="overlayContinue">CONTINUAR</button>
    `;
    document.body.appendChild(overlay);
    document.getElementById('overlayContinue').addEventListener('click', () => {
        overlay.remove();
        gameWon = false;
    });
}

document.addEventListener('keydown', (e) => {
    if (gameOver || gameWon) return;
    const key = e.key;
    e.preventDefault();
    switch(key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
    }
});

document.getElementById('touchUp')?.addEventListener('click', () => move('up'));
document.getElementById('touchDown')?.addEventListener('click', () => move('down'));
document.getElementById('touchLeft')?.addEventListener('click', () => move('left'));
document.getElementById('touchRight')?.addEventListener('click', () => move('right'));

document.getElementById('newGameBtn')?.addEventListener('click', initGrid);
document.getElementById('restartBtn')?.addEventListener('click', initGrid);

document.getElementById('backToArcade')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../index.html';
});

function handleResize() {
    const isMobile = window.innerWidth <= 600;
    const touchControls = document.querySelector('.touch-controls');
    if (touchControls) {
        touchControls.style.display = isMobile ? 'flex' : 'none';
    }
}

window.addEventListener('resize', handleResize);

document.addEventListener('DOMContentLoaded', () => {
    loadHighScore();
    initGrid();
    handleResize();
});