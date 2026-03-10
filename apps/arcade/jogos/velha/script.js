let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerWins = 0;
let computerWins = 0;
let draws = 0;
let currentDifficulty = 'easy';

const boardElement = document.getElementById('board');
const turnText = document.getElementById('turnText');
const turnLight = document.getElementById('turnLight');
const playerWinsSpan = document.getElementById('playerWins');
const computerWinsSpan = document.getElementById('computerWins');
const drawsSpan = document.getElementById('draws');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const newGameBtn = document.getElementById('newGameBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverTitle = document.getElementById('gameOverTitle');
const gameOverMessage = document.getElementById('gameOverMessage');
const restartBtn = document.getElementById('restartBtn');

function updateTurn() {
    if (currentPlayer === 'X') {
        turnText.textContent = 'SUA VEZ (X)';
        turnLight.className = 'turn-light';
    } else {
        turnText.textContent = 'COMPUTADOR (O)';
        turnLight.className = 'turn-light computer-turn';
    }
}

function updateScore() {
    playerWinsSpan.textContent = playerWins;
    computerWinsSpan.textContent = computerWins;
    drawsSpan.textContent = draws;
}

function renderBoard() {
    boardElement.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = `cell ${board[i].toLowerCase()}`;
        if (board[i] !== '' || !gameActive || currentPlayer === 'O') {
            cell.classList.add('disabled');
        }
        cell.textContent = board[i];
        cell.dataset.index = i;
        
        cell.addEventListener('click', (e) => {
            e.preventDefault();
            handleCellClick(i);
        });
        
        boardElement.appendChild(cell);
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], pattern };
        }
    }
    
    if (board.every(cell => cell !== '')) {
        return { winner: 'draw' };
    }
    
    return null;
}

function highlightWinner(pattern) {
    const cells = document.querySelectorAll('.cell');
    pattern.forEach(index => {
        cells[index].classList.add('winner');
    });
}

function endGame(result) {
    gameActive = false;
    
    if (result.winner === 'X') {
        playerWins++;
        gameOverTitle.textContent = 'VOCÊ VENCEU!';
        gameOverMessage.textContent = 'Parabéns!';
    } else if (result.winner === 'O') {
        computerWins++;
        gameOverTitle.textContent = 'COMPUTADOR VENCEU';
        gameOverMessage.textContent = 'Tente novamente.';
    } else if (result.winner === 'draw') {
        draws++;
        gameOverTitle.textContent = 'EMPATE';
        gameOverMessage.textContent = 'Fim de jogo.';
    }
    
    if (result.winner !== 'draw' && result.pattern) {
        highlightWinner(result.pattern);
    }
    
    updateScore();
    
    setTimeout(() => {
        gameOverScreen.classList.remove('hidden');
    }, 500);
}

function computerMove() {
    if (!gameActive || currentPlayer !== 'O') return;
    
    setTimeout(() => {
        let move;
        
        switch(currentDifficulty) {
            case 'easy':
                move = getEasyMove();
                break;
            case 'medium':
                move = getMediumMove();
                break;
            case 'hard':
                move = getHardMove();
                break;
            case 'impossible':
                move = getImpossibleMove();
                break;
            default:
                move = getEasyMove();
        }
        
        if (move !== undefined) {
            board[move] = 'O';
            currentPlayer = 'X';
            renderBoard();
            
            let result = checkWinner();
            if (result) {
                endGame(result);
            }
            updateTurn();
        }
    }, 500);
}

function getEasyMove() {
    let emptyCells = [];
    board.forEach((cell, index) => {
        if (cell === '') emptyCells.push(index);
    });
    
    if (emptyCells.length === 0) return undefined;
    
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getMediumMove() {
    if (Math.random() < 0.5) {
        return getEasyMove();
    } else {
        return getHardMove();
    }
}

function getHardMove() {
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let result = checkWinner();
            board[i] = '';
            if (result && result.winner === 'O') {
                return i;
            }
        }
    }
    
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            let result = checkWinner();
            board[i] = '';
            if (result && result.winner === 'X') {
                return i;
            }
        }
    }
    
    if (board[4] === '') return 4;
    
    let corners = [0, 2, 6, 8];
    let availableCorners = corners.filter(i => board[i] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    return getEasyMove();
}

function getImpossibleMove() {
    function minimax(board, depth, isMaximizing) {
        let result = checkWinner();
        
        if (result && result.winner === 'O') return 10 - depth;
        if (result && result.winner === 'X') return depth - 10;
        if (result && result.winner === 'draw') return 0;
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    let bestScore = -Infinity;
    let bestMove;
    
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let moveScore = minimax(board, 0, false);
            board[i] = '';
            
            if (moveScore > bestScore) {
                bestScore = moveScore;
                bestMove = i;
            }
        }
    }
    
    return bestMove;
}

function handleCellClick(index) {
    if (!gameActive || currentPlayer !== 'X' || board[index] !== '') return;
    
    board[index] = 'X';
    currentPlayer = 'O';
    renderBoard();
    
    let result = checkWinner();
    if (result) {
        endGame(result);
    } else {
        updateTurn();
        computerMove();
    }
}

function newGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    gameOverScreen.classList.add('hidden');
    renderBoard();
    updateTurn();
}

function resetScore() {
    playerWins = 0;
    computerWins = 0;
    draws = 0;
    updateScore();
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    difficultyBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.difficulty === difficulty) {
            btn.classList.add('active');
        }
    });
    newGame();
}

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        setDifficulty(btn.dataset.difficulty);
    });
});

newGameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    newGame();
});

resetScoreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetScore();
});

restartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    gameOverScreen.classList.add('hidden');
    newGame();
});

document.getElementById('backToArcade').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../index.html';
});

renderBoard();
updateTurn();
updateScore();