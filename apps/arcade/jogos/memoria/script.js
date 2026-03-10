let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let moves = 0;
let gameActive = false;
let canFlip = true;
let timerInterval = null;
let seconds = 0;
let boardSize = 4;
let totalPairs = 0;

let recordTimes = {
    4: localStorage.getItem('memoryRecord4') ? parseInt(localStorage.getItem('memoryRecord4')) : 999,
    6: localStorage.getItem('memoryRecord6') ? parseInt(localStorage.getItem('memoryRecord6')) : 999,
    8: localStorage.getItem('memoryRecord8') ? parseInt(localStorage.getItem('memoryRecord8')) : 999
};

const boardElement = document.getElementById('board');
const movesSpan = document.getElementById('moves');
const matchesSpan = document.getElementById('matches');
const scoreSpan = document.getElementById('score');
const timerSpan = document.getElementById('timer');
const recordSpan = document.getElementById('record');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const newGameBtn = document.getElementById('newGameBtn');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverTitle = document.getElementById('gameOverTitle');
const gameOverMessage = document.getElementById('gameOverMessage');
const gameOverStats = document.getElementById('gameOverStats');
const restartBtn = document.getElementById('restartBtn');

const emojis = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐸', '🐙', '🐝', '🐞',
    '🦋', '🐌', '🐢', '🐍', '🦎', '🐳', '🐬', '🐟',
    '🐠', '🐡', '🦈', '🐊', '🐘', '🦏', '🦒', '🦘'
];

function updateRecord() {
    let currentRecord = recordTimes[boardSize];
    if (currentRecord === 999) {
        recordSpan.textContent = '--:--';
    } else {
        let mins = Math.floor(currentRecord / 60);
        let secs = currentRecord % 60;
        recordSpan.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
}

function checkNewRecord() {
    if (seconds < recordTimes[boardSize] && matchedPairs === totalPairs) {
        recordTimes[boardSize] = seconds;
        localStorage.setItem(`memoryRecord${boardSize}`, seconds);
        updateRecord();
        return true;
    }
    return false;
}

function formatTime(secs) {
    let mins = Math.floor(secs / 60);
    let secondsLeft = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
}

function updateTimer() {
    seconds++;
    timerSpan.textContent = formatTime(seconds);
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    seconds = 0;
    timerSpan.textContent = '00:00';
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function createDeck() {
    totalPairs = (boardSize * boardSize) / 2;
    let selectedEmojis = emojis.slice(0, totalPairs);
    
    cards = [...selectedEmojis, ...selectedEmojis];
    
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

function renderBoard() {
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    boardElement.innerHTML = '';
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        
        card.innerHTML = `
            <div class="card-back">❓</div>
            <div class="card-front">${emoji}</div>
        `;
        
        card.addEventListener('click', (e) => {
            e.preventDefault();
            handleCardClick(index);
        });
        
        boardElement.appendChild(card);
    });
}

function revealCard(index) {
    const card = document.querySelector(`.card[data-index="${index}"]`);
    if (card) {
        card.classList.add('flipped');
    }
}

function flipBackCards() {
    canFlip = false;
    setTimeout(() => {
        flippedCards.forEach(index => {
            const card = document.querySelector(`.card[data-index="${index}"]`);
            if (card && !card.classList.contains('matched')) {
                card.classList.remove('flipped');
            }
        });
        flippedCards = [];
        canFlip = true;
    }, 800);
}

function markAsMatched(index1, index2) {
    const card1 = document.querySelector(`.card[data-index="${index1}"]`);
    const card2 = document.querySelector(`.card[data-index="${index2}"]`);
    
    card1.classList.add('matched');
    card2.classList.add('matched');
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    
    matchedPairs++;
    matchesSpan.textContent = matchedPairs;
    score += 50;
    scoreSpan.textContent = score;
    
    if (matchedPairs === totalPairs) {
        gameActive = false;
        stopTimer();
        
        let isNewRecord = checkNewRecord();
        
        gameOverTitle.textContent = 'PARABÉNS!';
        gameOverMessage.textContent = 'Você completou o jogo!';
        gameOverStats.innerHTML = `
            Tempo: ${formatTime(seconds)}<br>
            Pontos: ${score}<br>
            Jogadas: ${moves}<br>
            ${isNewRecord ? 'NOVO RECORDE!' : ''}
        `;
        gameOverScreen.classList.remove('hidden');
    }
}

function handleCardClick(index) {
    if (!gameActive || !canFlip) return;
    
    const card = document.querySelector(`.card[data-index="${index}"]`);
    
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flippedCards.includes(index)) return;
    if (flippedCards.length >= 2) return;
    
    revealCard(index);
    flippedCards.push(index);
    moves++;
    movesSpan.textContent = moves;
    
    if (flippedCards.length === 2) {
        let emoji1 = cards[flippedCards[0]];
        let emoji2 = cards[flippedCards[1]];
        
        if (emoji1 === emoji2) {
            markAsMatched(flippedCards[0], flippedCards[1]);
            flippedCards = [];
        } else {
            flipBackCards();
        }
    }
}

function newGame() {
    stopTimer();
    createDeck();
    renderBoard();
    
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    moves = 0;
    gameActive = true;
    canFlip = true;
    seconds = 0;
    
    movesSpan.textContent = '0';
    matchesSpan.textContent = '0';
    scoreSpan.textContent = '0';
    timerSpan.textContent = '00:00';
    
    updateRecord();
    startTimer();
}

function setDifficulty(size) {
    boardSize = parseInt(size);
    difficultyBtns.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.size) === boardSize) {
            btn.classList.add('active');
        }
    });
    newGame();
}

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        setDifficulty(btn.dataset.size);
    });
});

newGameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    newGame();
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

setDifficulty(4);