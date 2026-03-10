const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

let gameActive = false;
let gamePaused = false;
let gameOver = false;
let playerScore = 0;
let computerScore = 0;
const WIN_SCORE = 5;
let currentDifficulty = 'easy';

const difficultySettings = {
    easy: {
        computerSpeed: 3,
        ballBaseSpeed: 4,
        computerError: 0.3
    },
    medium: {
        computerSpeed: 4,
        ballBaseSpeed: 5,
        computerError: 0.1
    },
    hard: {
        computerSpeed: 5,
        ballBaseSpeed: 6,
        computerError: 0
    },
    expert: {
        computerSpeed: 7,
        ballBaseSpeed: 7,
        computerError: 0
    }
};

let player = {
    x: 20,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    speed: 8,
    dy: 0
};

let computer = {
    x: canvas.width - 30,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 5,
    speedX: 0,
    speedY: 0,
    baseSpeed: 5
};

let upPressed = false;
let downPressed = false;

const playerScoreSpan = document.getElementById('playerScore');
const computerScoreSpan = document.getElementById('computerScore');
const startScreen = document.getElementById('startScreen');
const pauseScreen = document.getElementById('pauseScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverTitle = document.getElementById('gameOverTitle');
const gameOverMessage = document.getElementById('gameOverMessage');
const restartBtn = document.getElementById('restartBtn');
const newGameBtn = document.getElementById('newGameBtn');
const startGameBtn = document.getElementById('startGameBtn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

function handleKeyDown(e) {
    if (!gameActive || gamePaused || gameOver) return;
    
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        upPressed = true;
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        downPressed = true;
    }
}

function handleKeyUp(e) {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        upPressed = false;
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        downPressed = false;
    }
}

function startGame() {
    gameActive = true;
    gamePaused = false;
    gameOver = false;
    playerScore = 0;
    computerScore = 0;
    updateScore();
    resetBall();
    player.y = canvas.height / 2 - 50;
    computer.y = canvas.height / 2 - 50;
    startScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
    let settings = difficultySettings[currentDifficulty];
    ball.baseSpeed = settings.ballBaseSpeed;
    
    let angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
    ball.speedX = ball.baseSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = ball.baseSpeed * Math.sin(angle);
}

function pauseGame() {
    if (!gameActive || gameOver) return;
    gamePaused = !gamePaused;
    if (gamePaused) {
        pauseScreen.classList.remove('hidden');
    } else {
        pauseScreen.classList.add('hidden');
    }
}

function endGame(winner) {
    gameActive = false;
    gameOver = true;
    
    gameOverTitle.textContent = winner === 'player' ? 'VOCÊ VENCEU' : 'COMPUTADOR VENCEU';
    gameOverMessage.textContent = winner === 'player' ? 'Parabéns!' : 'Tente novamente';
    gameOverScreen.classList.remove('hidden');
}

function updateScore() {
    playerScoreSpan.textContent = playerScore;
    computerScoreSpan.textContent = computerScore;
    
    if (playerScore >= WIN_SCORE) {
        endGame('player');
    } else if (computerScore >= WIN_SCORE) {
        endGame('computer');
    }
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    difficultyBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.difficulty === difficulty) {
            btn.classList.add('active');
        }
    });
    
    if (!gameActive) {
        resetBall();
    }
}

function update() {
    if (!gameActive || gamePaused || gameOver) return;
    
    let settings = difficultySettings[currentDifficulty];
    
    if (upPressed) {
        player.y -= player.speed;
    }
    if (downPressed) {
        player.y += player.speed;
    }
    
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
    
    let targetY = computer.y + computer.height/2;
    let ballY = ball.y;
    
    if (settings.computerError > 0 && Math.random() < settings.computerError) {
        ballY += (Math.random() - 0.5) * 100;
    }
    
    if (targetY < ballY) {
        computer.y += settings.computerSpeed;
    } else if (targetY > ballY) {
        computer.y -= settings.computerSpeed;
    }
    
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) computer.y = canvas.height - computer.height;
    
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY *= -1;
    }
    
    if (ball.x - ball.radius < player.x + player.width &&
        ball.x + ball.radius > player.x &&
        ball.y > player.y &&
        ball.y < player.y + player.height) {
        
        let relativePos = (ball.y - (player.y + player.height/2)) / (player.height/2);
        ball.speedY = ball.baseSpeed * relativePos * 1.5;
        ball.speedX = Math.abs(ball.speedX) * 1.05;
    }
    
    if (ball.x + ball.radius > computer.x &&
        ball.x - ball.radius < computer.x + computer.width &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height) {
        
        let relativePos = (ball.y - (computer.y + computer.height/2)) / (computer.height/2);
        ball.speedY = ball.baseSpeed * relativePos * 1.5;
        ball.speedX = -Math.abs(ball.speedX) * 1.05;
    }
    
    if (ball.x - ball.radius < 0) {
        computerScore++;
        updateScore();
        resetBall();
    }
    
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        updateScore();
        resetBall();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#ffffff';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.font = '24px "Courier New"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(playerScore, canvas.width / 4, 50);
    ctx.fillText(computerScore, (canvas.width / 4) * 3, 50);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        if (gameActive && !gameOver) {
            pauseGame();
        }
    }
    
    if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        startGame();
    }
});

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        setDifficulty(btn.dataset.difficulty);
    });
});

startGameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    startGame();
});

newGameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    startGame();
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

document.getElementById('touchUp')?.addEventListener('mousedown', (e) => {
    e.preventDefault();
    upPressed = true;
});

document.getElementById('touchUp')?.addEventListener('mouseup', (e) => {
    e.preventDefault();
    upPressed = false;
});

document.getElementById('touchUp')?.addEventListener('mouseleave', (e) => {
    e.preventDefault();
    upPressed = false;
});

document.getElementById('touchDown')?.addEventListener('mousedown', (e) => {
    e.preventDefault();
    downPressed = true;
});

document.getElementById('touchDown')?.addEventListener('mouseup', (e) => {
    e.preventDefault();
    downPressed = false;
});

document.getElementById('touchDown')?.addEventListener('mouseleave', (e) => {
    e.preventDefault();
    downPressed = false;
});

document.getElementById('touchUp')?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    upPressed = true;
});

document.getElementById('touchUp')?.addEventListener('touchend', (e) => {
    e.preventDefault();
    upPressed = false;
});

document.getElementById('touchDown')?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    downPressed = true;
});

document.getElementById('touchDown')?.addEventListener('touchend', (e) => {
    e.preventDefault();
    downPressed = false;
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
    }
}, { passive: false });

startScreen.classList.remove('hidden');
gameLoop();