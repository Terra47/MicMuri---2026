const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

let gameActive = false;
let gamePaused = false;
let gameOver = false;
let victory = false;
let levelComplete = false;
let score = 0;
let lives = 3;
let currentLevel = 1;
let currentDifficulty = 'medium';
let stars = [];
let explosions = [];

for (let i = 0; i < 80; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 1 + 0.5
    });
}

const difficultySettings = {
    easy: { enemySpeed: 0.5, enemyShootRate: 0.008, playerSpeed: 5, enemyHealth: 1 },
    medium: { enemySpeed: 0.8, enemyShootRate: 0.015, playerSpeed: 4.5, enemyHealth: 1 },
    hard: { enemySpeed: 1.2, enemyShootRate: 0.025, playerSpeed: 4, enemyHealth: 2 },
    nightmare: { enemySpeed: 1.8, enemyShootRate: 0.04, playerSpeed: 3.5, enemyHealth: 2 }
};

let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 70,
    width: 50,
    height: 30,
    health: 5,
    maxHealth: 5,
    invulnerable: false,
    invulTimer: 0,
    trail: []
};

let playerBullets = [];
let enemyBullets = [];
let enemies = [];
let enemyDirection = 1;
let enemyMoveCounter = 0;
const ENEMY_MOVE_DELAY = 22;

let leftPressed = false;
let rightPressed = false;
let spacePressed = false;
let canShoot = true;
let shootTimer = 0;
const SHOOT_COOLDOWN = 12;

const scoreSpan = document.getElementById('score');
const livesSpan = document.getElementById('lives');
const levelSpan = document.getElementById('level');
const startScreen = document.getElementById('startScreen');
const pauseScreen = document.getElementById('pauseScreen');
const levelCompleteScreen = document.getElementById('levelCompleteScreen');
const victoryScreen = document.getElementById('victoryScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverScore = document.getElementById('gameOverScore');
const gameOverLevel = document.getElementById('gameOverLevel');
const victoryScore = document.getElementById('victoryScore');
const nextLevelSpan = document.getElementById('nextLevel');
const startGameBtn = document.getElementById('startGameBtn');
const newGameBtn = document.getElementById('newGameBtn');
const restartBtn = document.getElementById('restartBtn');
const victoryRestartBtn = document.getElementById('victoryRestartBtn');
const continueBtn = document.getElementById('continueBtn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

function updateLivesDisplay() {
    let html = '';
    for (let i = 0; i < lives; i++) html += '▲';
    livesSpan.textContent = html;
}

function initLevel() {
    let settings = difficultySettings[currentDifficulty];
    enemies = [];
    
    let rows = 3 + Math.floor((currentLevel - 1) * 0.5);
    let cols = 5 + Math.floor((currentLevel - 1) * 0.5);
    rows = Math.min(rows, 6);
    cols = Math.min(cols, 8);
    
    let startX = (canvas.width - (cols * 45)) / 2;
    let startY = 40;
    
    let colors = ['#ff0', '#f0f', '#0ff', '#f90', '#f00'];
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            enemies.push({
                x: startX + col * 45,
                y: startY + row * 35,
                width: 35,
                height: 25,
                health: settings.enemyHealth,
                maxHealth: settings.enemyHealth,
                color: colors[row % colors.length],
                alive: true,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    playerBullets = [];
    enemyBullets = [];
    player.x = canvas.width / 2 - 25;
    player.health = player.maxHealth;
    player.invulnerable = false;
    player.trail = [];
    enemyDirection = 1;
    enemyMoveCounter = 0;
    
    updateScore();
    updateLivesDisplay();
    levelSpan.textContent = currentLevel.toString().padStart(2, '0');
}

function updateScore() {
    scoreSpan.textContent = score.toString().padStart(4, '0');
}

function playerHit() {
    if (player.invulnerable) return;
    
    player.health--;
    player.invulnerable = true;
    player.invulTimer = 0;
    
    for (let i = 0; i < 8; i++) {
        explosions.push({
            x: player.x + player.width/2 + (Math.random() - 0.5) * 30,
            y: player.y + player.height/2 + (Math.random() - 0.5) * 20,
            size: Math.random() * 8 + 3,
            alpha: 1,
            color: '#ff0'
        });
    }
    
    if (player.health <= 0) {
        lives--;
        updateLivesDisplay();
        
        if (lives > 0) {
            player.health = player.maxHealth;
            enemyBullets = [];
            for (let i = 0; i < 15; i++) {
                explosions.push({
                    x: player.x + player.width/2 + (Math.random() - 0.5) * 40,
                    y: player.y + player.height/2 + (Math.random() - 0.5) * 30,
                    size: Math.random() * 12 + 5,
                    alpha: 1,
                    color: '#f00'
                });
            }
            
            player.invulnerable = true;
            player.invulTimer = 0;
        } else {
            endGame();
            return;
        }
    }
}

function startGame() {
    currentLevel = 1;
    score = 0;
    lives = 3;
    player.maxHealth = 5;
    player.health = 5;
    explosions = [];
    initLevel();
    gameActive = true;
    gamePaused = false;
    gameOver = false;
    victory = false;
    levelComplete = false;
    startScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    levelCompleteScreen.classList.add('hidden');
    victoryScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
}

function nextLevel() {
    currentLevel++;
    initLevel();
    gameActive = true;
    levelComplete = false;
    levelCompleteScreen.classList.add('hidden');
}

function endGame() {
    gameActive = false;
    gameOver = true;
    gameOverScore.textContent = score.toString().padStart(4, '0');
    gameOverLevel.textContent = currentLevel.toString().padStart(2, '0');
    gameOverScreen.classList.remove('hidden');
}

function winGame() {
    gameActive = false;
    victory = true;
    victoryScore.textContent = score.toString().padStart(4, '0');
    victoryScreen.classList.remove('hidden');
}

function resetGame() {
    startGame();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        leftPressed = true;
    }
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        rightPressed = true;
    }
    if (e.key === ' ') {
        e.preventDefault();
        spacePressed = true;
    }
    if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (gameActive && !gameOver && !victory && !levelComplete) {
            gamePaused = !gamePaused;
            if (gamePaused) pauseScreen.classList.remove('hidden');
            else pauseScreen.classList.add('hidden');
        }
    }
    if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetGame();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        leftPressed = false;
    }
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        rightPressed = false;
    }
    if (e.key === ' ') {
        e.preventDefault();
        spacePressed = false;
    }
});

function update() {
    if (!gameActive || gamePaused || gameOver || victory || levelComplete) return;
    
    let settings = difficultySettings[currentDifficulty];
    
    stars.forEach(s => {
        s.y += s.speed;
        if (s.y > canvas.height) {
            s.y = 0;
            s.x = Math.random() * canvas.width;
        }
    });
    
    player.trail.push({ x: player.x, y: player.y });
    if (player.trail.length > 4) player.trail.shift();
    
    if (leftPressed && player.x > 5) player.x -= settings.playerSpeed;
    if (rightPressed && player.x + player.width < canvas.width - 5) player.x += settings.playerSpeed;
    
    if (!canShoot) {
        shootTimer++;
        if (shootTimer > SHOOT_COOLDOWN) {
            canShoot = true;
            shootTimer = 0;
        }
    }
    
    if (spacePressed && canShoot) {
        playerBullets.push({ 
            x: player.x + player.width/2 - 2, 
            y: player.y - 10, 
            width: 4, 
            height: 12,
            trail: []
        });
        canShoot = false;
    }
    
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        let bullet = playerBullets[i];
        bullet.trail.push({ x: bullet.x, y: bullet.y });
        if (bullet.trail.length > 3) bullet.trail.shift();
        bullet.y -= 7;
        
        if (bullet.y < 0) {
            playerBullets.splice(i, 1);
            continue;
        }
        
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (!enemies[j].alive) continue;
            
            if (bullet.x < enemies[j].x + enemies[j].width &&
                bullet.x + bullet.width > enemies[j].x &&
                bullet.y < enemies[j].y + enemies[j].height &&
                bullet.y + bullet.height > enemies[j].y) {
                
                enemies[j].health--;
                playerBullets.splice(i, 1);
                
                explosions.push({
                    x: bullet.x,
                    y: bullet.y,
                    size: 6,
                    alpha: 1,
                    color: '#ff0'
                });
                
                if (enemies[j].health <= 0) {
                    enemies[j].alive = false;
                    score += 10 * currentLevel;
                    updateScore();
                    
                    for (let k = 0; k < 6; k++) {
                        explosions.push({
                            x: enemies[j].x + enemies[j].width/2 + (Math.random() - 0.5) * 20,
                            y: enemies[j].y + enemies[j].height/2 + (Math.random() - 0.5) * 15,
                            size: Math.random() * 8 + 3,
                            alpha: 1,
                            color: enemies[j].color
                        });
                    }
                }
                break;
            }
        }
    }
    
    enemies = enemies.filter(e => e.alive);
    
    if (enemies.length === 0) {
        if (currentLevel >= 8) winGame();
        else {
            levelComplete = true;
            gameActive = false;
            nextLevelSpan.textContent = (currentLevel + 1).toString().padStart(2, '0');
            levelCompleteScreen.classList.remove('hidden');
        }
        return;
    }
    
    enemyMoveCounter++;
    if (enemyMoveCounter >= ENEMY_MOVE_DELAY) {
        enemyMoveCounter = 0;
        
        let changeDirection = false;
        for (let enemy of enemies) {
            enemy.pulse += 0.1;
            if (enemy.x + enemy.width > canvas.width - 20 || enemy.x < 20) changeDirection = true;
        }
        
        if (changeDirection) {
            enemyDirection *= -1;
            for (let enemy of enemies) enemy.y += 12;
        } else {
            for (let enemy of enemies) enemy.x += enemyDirection * settings.enemySpeed * 3;
        }
    }
    
    for (let enemy of enemies) {
        if (Math.random() < settings.enemyShootRate) {
            enemyBullets.push({
                x: enemy.x + enemy.width/2 - 2,
                y: enemy.y + enemy.height,
                width: 4,
                height: 10
            });
        }
    }
    
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].y += 5;
        if (enemyBullets[i].y > canvas.height) {
            enemyBullets.splice(i, 1);
            continue;
        }
        
        if (!player.invulnerable &&
            enemyBullets[i].x < player.x + player.width &&
            enemyBullets[i].x + enemyBullets[i].width > player.x &&
            enemyBullets[i].y < player.y + player.height &&
            enemyBullets[i].y + enemyBullets[i].height > player.y) {
            
            explosions.push({
                x: enemyBullets[i].x,
                y: enemyBullets[i].y,
                size: 8,
                alpha: 1,
                color: '#f00'
            });
            
            enemyBullets.splice(i, 1);
            playerHit();
        }
    }
    
    if (player.invulnerable) {
        player.invulTimer++;
        if (player.invulTimer > 70) player.invulnerable = false;
    }
    
    explosions = explosions.filter(e => {
        e.alpha -= 0.02;
        return e.alpha > 0;
    });
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(s => {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.7})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
    });
    
    explosions.forEach(e => {
        ctx.save();
        ctx.globalAlpha = e.alpha;
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
    
    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        
        ctx.save();
        ctx.shadowColor = enemy.color;
        ctx.shadowBlur = 10;
        
        let pulse = Math.sin(enemy.pulse) * 2;
        
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.moveTo(enemy.x + 5, enemy.y);
        ctx.lineTo(enemy.x + enemy.width - 5, enemy.y);
        ctx.lineTo(enemy.x + enemy.width, enemy.y + 8);
        ctx.lineTo(enemy.x + enemy.width - 3, enemy.y + enemy.height - 3);
        ctx.lineTo(enemy.x + 3, enemy.y + enemy.height - 3);
        ctx.lineTo(enemy.x, enemy.y + 8);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(enemy.x + 8, enemy.y + 6, 2 + pulse * 0.1, 0, Math.PI * 2);
        ctx.arc(enemy.x + enemy.width - 8, enemy.y + 6, 2 + pulse * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        if (enemy.maxHealth > 1) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#f00';
            ctx.fillRect(enemy.x + 2, enemy.y - 6, 31, 3);
            ctx.fillStyle = '#0f0';
            ctx.fillRect(enemy.x + 2, enemy.y - 6, 31 * (enemy.health / enemy.maxHealth), 3);
        }
        
        ctx.restore();
    });
    
    player.trail.forEach((pos, i) => {
        let alpha = i / player.trail.length * 0.3;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(pos.x, pos.y, player.width, player.height);
        ctx.restore();
    });
    
    if (!player.invulnerable || (player.invulTimer % 8 < 4)) {
        ctx.save();
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15;
        
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(player.x + 8, player.y);
        ctx.lineTo(player.x + player.width - 8, player.y);
        ctx.lineTo(player.x + player.width, player.y + 8);
        ctx.lineTo(player.x + player.width - 3, player.y + player.height - 3);
        ctx.lineTo(player.x + 3, player.y + player.height - 3);
        ctx.lineTo(player.x, player.y + 8);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    playerBullets.forEach(bullet => {
        bullet.trail.forEach((pos, i) => {
            let alpha = i / bullet.trail.length * 0.5;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(pos.x, pos.y, bullet.width, bullet.height);
            ctx.restore();
        });
        
        ctx.save();
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.restore();
    });
    
    enemyBullets.forEach(bullet => {
        ctx.save();
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.restore();
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        difficultyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDifficulty = btn.dataset.difficulty;
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

continueBtn.addEventListener('click', (e) => {
    e.preventDefault();
    nextLevel();
});

victoryRestartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    victoryScreen.classList.add('hidden');
    resetGame();
});

document.getElementById('backToArcade').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../index.html';
});

document.getElementById('touchLeft')?.addEventListener('mousedown', (e) => {
    e.preventDefault();
    leftPressed = true;
});
document.getElementById('touchLeft')?.addEventListener('mouseup', (e) => {
    e.preventDefault();
    leftPressed = false;
});
document.getElementById('touchLeft')?.addEventListener('mouseleave', (e) => {
    e.preventDefault();
    leftPressed = false;
});

document.getElementById('touchRight')?.addEventListener('mousedown', (e) => {
    e.preventDefault();
    rightPressed = true;
});
document.getElementById('touchRight')?.addEventListener('mouseup', (e) => {
    e.preventDefault();
    rightPressed = false;
});
document.getElementById('touchRight')?.addEventListener('mouseleave', (e) => {
    e.preventDefault();
    rightPressed = false;
});

document.getElementById('touchFire')?.addEventListener('mousedown', (e) => {
    e.preventDefault();
    spacePressed = true;
});
document.getElementById('touchFire')?.addEventListener('mouseup', (e) => {
    e.preventDefault();
    spacePressed = false;
});
document.getElementById('touchFire')?.addEventListener('mouseleave', (e) => {
    e.preventDefault();
    spacePressed = false;
});

document.getElementById('touchLeft')?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    leftPressed = true;
});
document.getElementById('touchLeft')?.addEventListener('touchend', (e) => {
    e.preventDefault();
    leftPressed = false;
});
document.getElementById('touchRight')?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    rightPressed = true;
});
document.getElementById('touchRight')?.addEventListener('touchend', (e) => {
    e.preventDefault();
    rightPressed = false;
});
document.getElementById('touchFire')?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    spacePressed = true;
});
document.getElementById('touchFire')?.addEventListener('touchend', (e) => {
    e.preventDefault();
    spacePressed = false;
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
    }
}, { passive: false });

gameLoop();