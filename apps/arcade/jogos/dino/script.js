const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 200;

const GROUND_Y = 170;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 20;
const PLAYER_X = 50;

let score = 0;
let highScore = localStorage.getItem('patoHighScore') || 0;
let gameStarted = false;
let gameOver = false;
let zone = 1;
let frameCounter = 0;
let spawnTimer = 0;
let legFrame = 0;
let lastObstacleX = 0;

let player = {
    x: PLAYER_X,
    y: GROUND_Y - PLAYER_HEIGHT,
    vy: 0,
    gravity: 0.9,
    jumpForce: -11,
    isJumping: false,
    isDucking: false,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT
};

let obstacles = [];

let speed = 5;

document.getElementById('highScore').textContent = String(highScore).padStart(4, '0');

function jump() {
    if (!gameStarted || gameOver || player.isDucking) return;
    if (!player.isJumping) {
        player.isJumping = true;
        player.vy = player.jumpForce;
    }
}

function duck() {
    if (!gameStarted || gameOver) return;
    if (!player.isJumping) {
        player.isDucking = true;
        player.height = 15;
        player.y = GROUND_Y - 15;
    }
}

function stand() {
    player.isDucking = false;
    player.height = PLAYER_HEIGHT;
    if (!player.isJumping) {
        player.y = GROUND_Y - PLAYER_HEIGHT;
    }
}

function startGame() {
    gameStarted = true;
    gameOver = false;
    score = 0;
    zone = 1;
    speed = 5;
    obstacles = [];
    player.y = GROUND_Y - player.height;
    player.vy = 0;
    player.isJumping = false;
    player.isDucking = false;
    player.height = PLAYER_HEIGHT;
    frameCounter = 0;
    spawnTimer = 0;
    lastObstacleX = 0;
    document.getElementById('score').textContent = '0000';
    document.getElementById('zone').textContent = '1';
    document.getElementById('startMessage').classList.add('hidden');
    document.getElementById('gameOverMessage').classList.add('hidden');
}

function gameOverF() {
    gameOver = true;
    gameStarted = false;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('patoHighScore', highScore);
        document.getElementById('highScore').textContent = String(highScore).padStart(4, '0');
    }
    
    document.getElementById('gameOverMessage').classList.remove('hidden');
}

function createCactus() {
    obstacles.push({
        x: canvas.width,
        y: GROUND_Y - 22,
        width: 10,
        height: 22,
        color1: '#2E7D32',
        color2: '#1B5E20',
        type: 'cactus'
    });
}

function createDoubleCactus() {
    obstacles.push({
        x: canvas.width,
        y: GROUND_Y - 22,
        width: 22,
        height: 22,
        color1: '#2E7D32',
        color2: '#1B5E20',
        type: 'double'
    });
}

function createTripleCactus() {
    obstacles.push({
        x: canvas.width,
        y: GROUND_Y - 22,
        width: 34,
        height: 22,
        color1: '#2E7D32',
        color2: '#1B5E20',
        type: 'triple'
    });
}

function createStone() {
    obstacles.push({
        x: canvas.width,
        y: GROUND_Y - 10,
        width: 18,
        height: 10,
        color1: '#757575',
        color2: '#616161',
        type: 'stone'
    });
}

function createBird() {
    let heights = [GROUND_Y - 70, GROUND_Y - 55, GROUND_Y - 40];
    let randomHeight = heights[Math.floor(Math.random() * heights.length)];
    
    obstacles.push({
        x: canvas.width,
        y: randomHeight,
        width: 16,
        height: 12,
        color1: '#C62828',
        color2: '#B71C1C',
        type: 'bird',
        wingPos: 0
    });
}

function createLowBird() {
    obstacles.push({
        x: canvas.width,
        y: GROUND_Y - 30,
        width: 16,
        height: 12,
        color1: '#C62828',
        color2: '#B71C1C',
        type: 'bird',
        wingPos: 0
    });
}

function canSpawn() {
    if (obstacles.length === 0) return true;
    
    let lastObstacle = obstacles[obstacles.length - 1];
    
    let distanceFromEnd = canvas.width - lastObstacle.x;
    
    let minSpacing = 120 + (zone * 10);
    
    return distanceFromEnd > minSpacing;
}

function update() {
    if (!gameStarted || gameOver) return;
    
    frameCounter++;
    legFrame = (legFrame + 1) % 10;
    
    if (frameCounter % 2 === 0) {
        score += 2;
        document.getElementById('score').textContent = String(score).padStart(4, '0');
    }
    
    if (score > 600) zone = 6;
    else if (score > 450) zone = 5;
    else if (score > 300) zone = 4;
    else if (score > 180) zone = 3;
    else if (score > 80) zone = 2;
    document.getElementById('zone').textContent = zone;
    
    speed = 5 + (zone * 0.4);
    
    if (player.isJumping) {
        player.vy += player.gravity;
        player.y += player.vy;
        
        if (player.y >= GROUND_Y - player.height) {
            player.y = GROUND_Y - player.height;
            player.isJumping = false;
            player.vy = 0;
        }
    }
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= speed;
        
        if (obstacles[i].type === 'bird') {
            obstacles[i].wingPos = (obstacles[i].wingPos + 1) % 8;
        }
        
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
    
    spawnTimer++;
    let spawnDelay = Math.max(35, 50 - zone * 2);
    
    if (spawnTimer > spawnDelay && canSpawn()) {
        let rand = Math.random();
        
        if (zone >= 5 && rand < 0.15) {
            createLowBird();
        } else if (zone >= 4 && rand < 0.2) {
            createBird();
        } else if (zone >= 3 && rand < 0.25) {
            createTripleCactus();
        } else if (zone >= 2 && rand < 0.3) {
            createDoubleCactus();
        } else if (rand < 0.35) {
            createStone();
        } else {
            createCactus();
        }
        
        spawnTimer = 0;
    }
    
    for (let obs of obstacles) {
        if (player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {
            gameOverF();
            break;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(100 + frameCounter % 400, 40, 20, 0, Math.PI * 2);
    ctx.arc(120 + frameCounter % 400, 40, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, GROUND_Y, canvas.width, 8);
    
    ctx.fillStyle = '#A0522D';
    for (let i = 0; i < canvas.width; i += 20) {
        let x = (i - frameCounter * speed * 0.5) % (canvas.width + 20) - 20;
        ctx.fillRect(x, GROUND_Y + 2, 5, 4);
    }
    
    ctx.fillStyle = '#FFF';
    for (let i = 0; i < canvas.width; i += 40) {
        let x = (i - frameCounter * speed) % (canvas.width + 40) - 40;
        ctx.fillRect(x, GROUND_Y - 4, 20, 2);
    }
    
    obstacles.forEach(obs => {
        if (obs.type === 'bird') {

            ctx.fillStyle = obs.color1;
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            
            ctx.fillStyle = '#FFF';
            ctx.fillRect(obs.x + 10, obs.y + 2, 3, 3);
            ctx.fillStyle = '#000';
            ctx.fillRect(obs.x + 11, obs.y + 3, 1, 1);
            
            ctx.fillStyle = obs.color2;
            if (obs.wingPos < 4) {
                ctx.fillRect(obs.x - 4, obs.y + 3, 4, 4);
            } else {
                ctx.fillRect(obs.x - 4, obs.y + 6, 4, 4);
            }
            
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(obs.x + 14, obs.y + 4, 3, 2);
            
        } else if (obs.type === 'stone') {

            ctx.fillStyle = obs.color1;
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            
            ctx.fillStyle = obs.color2;
            ctx.fillRect(obs.x + 3, obs.y + 2, 4, 2);
            ctx.fillRect(obs.x + 10, obs.y + 5, 3, 3);
            
        } else if (obs.type === 'triple') {

            ctx.fillStyle = obs.color1;
            ctx.fillRect(obs.x, obs.y, 8, obs.height);
            ctx.fillRect(obs.x + 12, obs.y - 3, 8, obs.height + 3);
            ctx.fillRect(obs.x + 24, obs.y, 8, obs.height);
            
            ctx.fillStyle = '#FF69B4';
            ctx.fillRect(obs.x + 3, obs.y - 4, 3, 3);
            ctx.fillRect(obs.x + 15, obs.y - 7, 3, 3);
            ctx.fillRect(obs.x + 27, obs.y - 4, 3, 3);
            
        } else if (obs.type === 'double') {
            ctx.fillStyle = obs.color1;
            ctx.fillRect(obs.x, obs.y, 8, obs.height);
            ctx.fillRect(obs.x + 12, obs.y - 2, 8, obs.height + 2);
            
            ctx.fillStyle = '#FF69B4';
            ctx.fillRect(obs.x + 2, obs.y - 4, 3, 3);
            ctx.fillRect(obs.x + 15, obs.y - 6, 3, 3);
            
        } else {
            ctx.fillStyle = obs.color1;
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            
            ctx.fillStyle = obs.color2;
            ctx.fillRect(obs.x + 2, obs.y - 2, 2, 2);
            ctx.fillRect(obs.x + 5, obs.y - 3, 2, 2);
            
            ctx.fillStyle = '#FF69B4';
            ctx.fillRect(obs.x + 3, obs.y - 5, 3, 2);
        }
    });
    
    let playerY = player.y;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(player.x, GROUND_Y, player.width, 3);
    
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(player.x, playerY, 15, 15);
    
    ctx.fillStyle = '#FFE55C';
    ctx.fillRect(player.x + 10, playerY - 5, 8, 8);
    
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x + 14, playerY - 3, 2, 2);
    
    ctx.fillStyle = '#FFF';
    ctx.fillRect(player.x + 15, playerY - 4, 1, 1);
    
    ctx.fillStyle = '#FFA500';
    ctx.fillRect(player.x + 18, playerY - 3, 4, 3);
    
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(player.x + 2, playerY + 3, 4, 6);
    
    ctx.fillStyle = '#CD853F';
    if (player.isJumping) {
        ctx.fillRect(player.x + 2, playerY + 15, 3, 6);
        ctx.fillRect(player.x + 8, playerY + 15, 3, 6);
    } else if (player.isDucking) {
        ctx.fillRect(player.x + 3, playerY + 13, 3, 3);
        ctx.fillRect(player.x + 9, playerY + 13, 3, 3);
    } else {
        if (legFrame < 5) {
            ctx.fillRect(player.x + 2, playerY + 15, 3, 5);
            ctx.fillRect(player.x + 8, playerY + 18, 3, 5);
        } else {
            ctx.fillRect(player.x + 2, playerY + 18, 3, 5);
            ctx.fillRect(player.x + 8, playerY + 15, 3, 5);
        }
    }
    
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(player.x + 2, playerY + 20, 3, 2);
    ctx.fillRect(player.x + 8, playerY + 20, 3, 2);
    
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(player.x - 3, playerY + 8, 3, 4);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted && !gameOver) {
            startGame();
        } else {
            jump();
        }
    }
    
    if (e.code === 'ArrowDown') {
        e.preventDefault();
        duck();
    }
    
    if (e.code === 'KeyR') {
        e.preventDefault();
        startGame();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') {
        e.preventDefault();
        stand();
    }
});

document.getElementById('restartBtn').addEventListener('click', startGame);

document.getElementById('backToArcade')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../index.html';
});

document.getElementById('jumpBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!gameStarted && !gameOver) startGame();
    else jump();
});

document.getElementById('duckBtn')?.addEventListener('mousedown', (e) => {
    e.preventDefault();
    duck();
});

document.getElementById('duckBtn')?.addEventListener('mouseup', (e) => {
    e.preventDefault();
    stand();
});

document.getElementById('duckBtn')?.addEventListener('mouseleave', (e) => {
    e.preventDefault();
    stand();
});

document.getElementById('duckBtn')?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    duck();
});

document.getElementById('duckBtn')?.addEventListener('touchend', (e) => {
    e.preventDefault();
    stand();
});

document.getElementById('duckBtn')?.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    stand();
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!gameStarted && !gameOver) startGame();
    else jump();
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch.clientY > canvas.height / 2) duck();
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    stand();
});

canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    stand();
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'KeyR') {
        e.preventDefault();
    }
}, { passive: false });

document.getElementById('startMessage').classList.remove('hidden');
document.getElementById('gameOverMessage').classList.add('hidden');
gameLoop();