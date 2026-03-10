let deck = [];
let playerHand = [];
let computerHand = [];
let board = [];
let currentPlayer = 'player';
let playerScore = 0;
let gameOver = false;
let gameStarted = false;
let selectedPiece = null;
let messageTimeout = null;

const playerHandDiv = document.getElementById('playerHand');
const computerHandDiv = document.getElementById('computerHand');
const boardCenterDiv = document.getElementById('boardCenter');
const turnLight = document.getElementById('turnLight');
const turnText = document.getElementById('turnText');
const playerScoreSpan = document.getElementById('playerScore');
const remainingPiecesSpan = document.getElementById('remainingPieces');
const messageText = document.getElementById('messageText');
const drawBtn = document.getElementById('drawBtn');
const passBtn = document.getElementById('passBtn');
const newGameBtn = document.getElementById('newGameBtn');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverTitle = document.getElementById('gameOverTitle');
const gameOverMessage = document.getElementById('gameOverMessage');
const gameOverScore = document.getElementById('gameOverScore');
const restartBtn = document.getElementById('restartBtn');

function showMessage(msg, isError = false) {
    if (messageTimeout) clearTimeout(messageTimeout);
    messageText.textContent = msg;
    messageText.style.color = isError ? '#ff0000' : '#000080';
    
    messageTimeout = setTimeout(() => {
        messageText.textContent = currentPlayer === 'player' ? 'SUA VEZ' : 'COMPUTADOR JOGANDO...';
        messageText.style.color = '#000080';
    }, 2000);
}

function updateRemainingPieces() {
    remainingPiecesSpan.textContent = deck.length;
}

function createDeck() {
    deck = [];
    for (let i = 0; i <= 6; i++) {
        for (let j = i; j <= 6; j++) {
            deck.push({ left: i, right: j });
        }
    }
    shuffleDeck();
    updateRemainingPieces();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function renderPips(value) {
    let html = '<div class="pip-container">';
    for (let i = 0; i < value; i++) {
        html += '<div class="pip"></div>';
    }
    html += '</div>';
    return html;
}

function createPieceElement(piece, type, index = null) {
    const pieceDiv = document.createElement('div');
    pieceDiv.className = `domino-piece ${type}`;
    if (index !== null && selectedPiece === index && type === 'player-piece') {
        pieceDiv.classList.add('selected');
    }
    
    pieceDiv.innerHTML = `
        <div class="piece-top">${renderPips(piece.left)}</div>
        <div class="piece-bottom">${renderPips(piece.right)}</div>
    `;
    
    if (type === 'player-piece' && index !== null) {
        pieceDiv.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            selectPiece(index);
        });
    }
    
    return pieceDiv;
}

function dealPieces() {
    playerHand = [];
    computerHand = [];
    board = [];
    
    shuffleDeck();
    
    for (let i = 0; i < 7; i++) {
        playerHand.push(deck.pop());
        computerHand.push(deck.pop());
    }
    
    playerHand.sort((a, b) => (b.left + b.right) - (a.left + a.right));
    
    let firstPiece = null;
    let firstPieceIndex = -1;
    
    for (let i = 0; i < playerHand.length; i++) {
        if (playerHand[i].left === playerHand[i].right) {
            if (!firstPiece || playerHand[i].left > firstPiece.left) {
                firstPiece = playerHand[i];
                firstPieceIndex = i;
            }
        }
    }
    
    if (!firstPiece) {
        let maxSum = -1;
        for (let i = 0; i < playerHand.length; i++) {
            let sum = playerHand[i].left + playerHand[i].right;
            if (sum > maxSum) {
                maxSum = sum;
                firstPiece = playerHand[i];
                firstPieceIndex = i;
            }
        }
    }
    
    if (firstPiece) {
        board.push({ ...firstPiece });
        playerHand.splice(firstPieceIndex, 1);
    }
    
    playerScore = 0;
    updateScore();
    updateRemainingPieces();
}

function getValidMoves(piece) {
    if (board.length === 0) return { left: true, right: true };
    
    let leftBoard = board[0];
    let rightBoard = board[board.length - 1];
    
    return {
        left: piece.right === leftBoard.left || piece.left === leftBoard.left,
        right: piece.left === rightBoard.right || piece.right === rightBoard.right
    };
}

function playPiece(piece, pieceIndex, side) {
    let boardPiece = side === 'left' ? board[0] : board[board.length - 1];
    let playedPiece = { ...piece };
    
    if (side === 'left') {
        if (playedPiece.right !== boardPiece.left && playedPiece.left === boardPiece.left) {
            [playedPiece.left, playedPiece.right] = [playedPiece.right, playedPiece.left];
        }
        board.unshift(playedPiece);
    } else {
        if (playedPiece.left !== boardPiece.right && playedPiece.right === boardPiece.right) {
            [playedPiece.left, playedPiece.right] = [playedPiece.right, playedPiece.left];
        }
        board.push(playedPiece);
    }
    
    if (currentPlayer === 'player') {
        playerHand.splice(pieceIndex, 1);
        playerScore += piece.left + piece.right;
        updateScore();
    } else {
        computerHand.splice(pieceIndex, 1);
    }
    
    updateBoard();
    return true;
}

function computerPlay() {
    if (gameOver || currentPlayer !== 'computer') return;
    
    showMessage('COMPUTADOR PENSANDO...');
    
    setTimeout(() => {
        let moves = [];
        
        for (let i = 0; i < computerHand.length; i++) {
            let piece = computerHand[i];
            let validMoves = getValidMoves(piece);
            
            if (validMoves.left) moves.push({ index: i, side: 'left', piece });
            if (validMoves.right) moves.push({ index: i, side: 'right', piece });
        }
        
        if (moves.length > 0) {
            let doubleMoves = moves.filter(m => m.piece.left === m.piece.right);
            let selectedMove = doubleMoves.length > 0 ? 
                doubleMoves[Math.floor(Math.random() * doubleMoves.length)] : 
                moves[Math.floor(Math.random() * moves.length)];
            
            playPiece({ ...computerHand[selectedMove.index] }, selectedMove.index, selectedMove.side);
            showMessage('COMPUTADOR JOGOU');
            
            if (computerHand.length === 0) {
                endGame('computer');
                return;
            }
            
            currentPlayer = 'player';
            updateTurn();
            checkGameStatus();
        } else {
            if (deck.length > 0) {
                let drawnPiece = deck.pop();
                computerHand.push(drawnPiece);
                updateRemainingPieces();
                showMessage('COMPUTADOR COMPROU');
                computerPlay();
            } else {
                showMessage('COMPUTADOR PASSOU');
                currentPlayer = 'player';
                updateTurn();
                checkGameStatus();
            }
        }
    }, 600);
}

function playerPlay(side) {
    if (currentPlayer !== 'player' || gameOver || selectedPiece === null) return;
    
    let piece = playerHand[selectedPiece];
    let validMoves = getValidMoves(piece);
    
    if (!validMoves[side]) {
        showMessage('JOGADA INVÁLIDA!', true);
        return;
    }
    
    playPiece({ ...piece }, selectedPiece, side);
    selectedPiece = null;
    updateBoard();
    
    if (playerHand.length === 0) {
        endGame('player');
        return;
    }
    
    currentPlayer = 'computer';
    updateTurn();
    checkGameStatus();
    computerPlay();
}

function checkGameStatus() {
    if (gameOver) return;
    
    if (currentPlayer === 'player') {
        let hasMove = false;
        for (let piece of playerHand) {
            let valid = getValidMoves(piece);
            if (valid.left || valid.right) {
                hasMove = true;
                break;
            }
        }
        
        drawBtn.disabled = deck.length === 0;
        passBtn.disabled = hasMove || deck.length === 0;
        
        if (!hasMove && deck.length === 0) {
            showMessage('SEM JOGADAS! PASSE A VEZ', true);
        }
    }
}

function drawPiece() {
    if (currentPlayer !== 'player' || gameOver) return;
    if (deck.length === 0) {
        showMessage('SEM PEÇAS!', true);
        return;
    }
    
    let drawnPiece = deck.pop();
    playerHand.push(drawnPiece);
    playerHand.sort((a, b) => (b.left + b.right) - (a.left + a.right));
    updateBoard();
    updateRemainingPieces();
    showMessage('PEÇA COMPRADA');
    checkGameStatus();
}

function passTurn() {
    if (currentPlayer !== 'player' || gameOver) return;
    
    let hasMove = false;
    for (let piece of playerHand) {
        let valid = getValidMoves(piece);
        if (valid.left || valid.right) {
            hasMove = true;
            break;
        }
    }
    
    if (hasMove) {
        showMessage('VOCÊ TEM JOGADAS!', true);
        return;
    }
    
    if (deck.length > 0) {
        showMessage('COMPRE UMA PEÇA!', true);
        return;
    }
    
    showMessage('VOCÊ PASSOU');
    currentPlayer = 'computer';
    updateTurn();
    computerPlay();
}

function endGame(winner) {
    gameOver = true;
    gameStarted = false;
    gameOverScreen.classList.remove('hidden');
    
    if (winner === 'player') {
        gameOverTitle.textContent = 'VOCÊ VENCEU!';
        gameOverMessage.textContent = 'Parabéns!';
    } else if (winner === 'computer') {
        gameOverTitle.textContent = 'COMPUTADOR VENCEU';
        gameOverMessage.textContent = 'Tente novamente.';
    } else {
        gameOverTitle.textContent = 'EMPATE';
        gameOverMessage.textContent = 'Fim de jogo.';
    }
    
    gameOverScore.textContent = `Sua pontuação: ${playerScore}`;
}

function updateBoard() {
    playerHandDiv.innerHTML = '';
    playerHand.forEach((piece, index) => {
        playerHandDiv.appendChild(createPieceElement(piece, 'player-piece', index));
    });
    
    computerHandDiv.innerHTML = '';
    computerHand.forEach(() => {
        let pieceDiv = document.createElement('div');
        pieceDiv.className = 'computer-piece';
        computerHandDiv.appendChild(pieceDiv);
    });
    
    boardCenterDiv.innerHTML = '';
    board.forEach((piece) => {
        boardCenterDiv.appendChild(createPieceElement(piece, 'board-piece'));
    });
}

function updateTurn() {
    if (currentPlayer === 'player') {
        turnLight.className = 'turn-light';
        turnText.textContent = 'SUA VEZ';
        showMessage('SUA VEZ');
    } else {
        turnLight.className = 'turn-light computer-turn';
        turnText.textContent = 'COMPUTADOR';
        showMessage('COMPUTADOR JOGANDO...');
    }
    checkGameStatus();
}

function updateScore() {
    playerScoreSpan.textContent = playerScore;
}

function selectPiece(index) {
    if (currentPlayer !== 'player' || gameOver) return;
    
    if (selectedPiece === index) {
        selectedPiece = null;
    } else {
        selectedPiece = index;
    }
    updateBoard();
}

function newGame() {
    createDeck();
    dealPieces();
    currentPlayer = 'player';
    gameOver = false;
    gameStarted = true;
    selectedPiece = null;
    gameOverScreen.classList.add('hidden');
    updateBoard();
    updateTurn();
    showMessage('NOVO JOGO!');
}

drawBtn.addEventListener('click', (e) => {
    e.preventDefault();
    drawPiece();
});

passBtn.addEventListener('click', (e) => {
    e.preventDefault();
    passTurn();
});

newGameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    newGame();
});

restartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    newGame();
});

document.getElementById('backToArcade').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../index.html';
});

boardCenterDiv.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!gameStarted || gameOver) return;
    
    let rect = boardCenterDiv.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    
    if (clickX < rect.width / 2) {
        playerPlay('left');
    } else {
        playerPlay('right');
    }
});

newGame();