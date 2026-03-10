let targetWord = '';
let currentGuess = '';
let currentRow = 0;
let gameActive = false;
let gameWon = false;
let gameOver = false;
let maxAttempts = 6;
let wins = localStorage.getItem('termoWins') ? parseInt(localStorage.getItem('termoWins')) : 0;
let streak = localStorage.getItem('termoStreak') ? parseInt(localStorage.getItem('termoStreak')) : 0;
let attempts = 0;

const words = [
    'ABRIR', 'ACASO', 'ACIMA', 'ACUDO', 'AFETO', 'AGUDO', 'ALADO', 'ALTAR', 'AMIGO', 'AMORA',
    'ANEXO', 'ANIMA', 'ANTES', 'ANTRO', 'APOIO', 'APURO', 'ARADO', 'AREIA', 'ARGOL', 'AROMA',
    'ASSAR', 'ASTRO', 'ATIVO', 'ATLAS', 'ATUAL', 'AUDIO', 'AULAS', 'AVISO', 'AZEIS', 'AZULI',
    'BACIA', 'BALDE', 'BALSA', 'BANCO', 'BANDA', 'BANDO', 'BANHO', 'BARCO', 'BARRO', 'BASAL',
    'BATER', 'BATOM', 'BAURU', 'BAZAR', 'BEIRA', 'BEIJO', 'BELGA', 'BELOU', 'BERRO', 'BESTA',
    'BICHO', 'BILIS', 'BINGO', 'BIRRA', 'BISPO', 'BOLAS', 'BONDE', 'BORDA', 'BORRA', 'BOTAO',
    'BRAVO', 'BREVE', 'BRISA', 'BROTO', 'BRUXO', 'BUCAL', 'BUCHA', 'BUJAO', 'BULIR', 'BURRO',
    'BUSCA', 'CABRA', 'CACAU', 'CAIXA', 'CALAR', 'CALDO', 'CAMPO', 'CANAL', 'CANIL', 'CAPAZ',
    'CARNE', 'CARRO', 'CASAL', 'CASCO', 'CASPA', 'CASTO', 'CATAR', 'CAVAL', 'CEDRO', 'CEGAR',
    'CELTA', 'CENAS', 'CERCA', 'CERTO', 'CESAR', 'CHAVE', 'CHICO', 'CHINA', 'CHOCA', 'CHUVA',
    'CINCO', 'CINTA', 'CISNE', 'CLARO', 'CLUBE', 'COBRA', 'COISA', 'COLAR', 'COLHE', 'COMER',
    'CONTA', 'CORAL', 'CORPO', 'CORRE', 'CORTE', 'COSTA', 'CREME', 'CRISE', 'CRUZE', 'CUIDA',
    'CULPA', 'CURVA', 'CUSPE', 'DANOS', 'DARDO', 'DATAI', 'DECOR', 'DEDOS', 'DEIXA', 'DELTA',
    'DENTE', 'DERAM', 'DESCE', 'DESTA', 'DEUSA', 'DIETA', 'DIGNO', 'DIZER', 'DOBRA', 'DOIDO',
    'DORES', 'DOUTO', 'DRAMA', 'DRENO', 'DROGA', 'DUETO', 'DUNAS', 'DUVID', 'ECOAR', 'EDUCA',
    'EGITO', 'EIXOS', 'ELITE', 'EMAIL', 'EMOCA', 'ENFIM', 'ENJOO', 'ENTRA', 'ENVIO', 'EPOCA',
    'ERROS', 'ESCOL', 'ESPIA', 'ESTAR', 'ESTES', 'ETAPA', 'ETICA', 'EXATO', 'EXITO', 'EXTRA',
    'FALAR', 'FALHA', 'FALTA', 'FAROL', 'FARTA', 'FATOR', 'FATOS', 'FAUNA', 'FAVOR', 'FEIRA',
    'FEITO', 'FELIZ', 'FENDA', 'FERRO', 'FESTA', 'FICAR', 'FILHO', 'FINAL', 'FIRMA', 'FLORA',
    'FLUIR', 'FOCAR', 'FOICE', 'FOLHA', 'FORMA', 'FORTE', 'FOSCO', 'FRASE', 'FREIO', 'FRUTA',
    'FUGIR', 'FUNDO', 'FURIA', 'FUSCA', 'GABAR', 'GALHO', 'GANHO', 'GARFO', 'GARRA', 'GASTO',
    'GENIO', 'GERAL', 'GERIR', 'GIROU', 'GLOBO', 'GLOSA', 'GOLPE', 'GRATO', 'GRAVA', 'GRITO',
    'GRUPO', 'GUIAR', 'HABIL', 'HARPA', 'HERDA', 'HIPER', 'HISTO', 'HOMEM', 'HONRA', 'HORAS',
    'HUMOR', 'IDEAL', 'IDOSO', 'IGUAL', 'ILHAS', 'IMPAR', 'INDIO', 'INFRA', 'INPUT', 'INTER',
    'INTUI', 'IRADO', 'JANTA', 'JARDI', 'JOGAR', 'JOGOS', 'JOVEM', 'JUROS', 'JUSTO', 'LADOS',
    'LAGOS', 'LAMAS', 'LARGO', 'LARVA', 'LASER', 'LATIM', 'LAVAR', 'LEGAL', 'LEITE', 'LENDA',
    'LESMA', 'LESTE', 'LETAL', 'LETRA', 'LIVRO', 'LOUCA', 'LOUCO', 'LUGAR', 'LUTAR', 'LUZES',
    'MACHO', 'MAGIA', 'MAIOR', 'MALAS', 'MALHA', 'MANGA', 'MANHA', 'MAPAS', 'MARCA', 'MARCO',
    'MARTE', 'MASSA', 'MATAR', 'MELAO', 'MENOS', 'MENTE', 'MESAS', 'MESMO', 'METAL', 'METRO',
    'MEXER', 'MIADO', 'MILHO', 'MINHA', 'MIRAR', 'MISSA', 'MISTO', 'MITOS', 'MOLAR', 'MONTE',
    'MORAR', 'MORRO', 'MORTE', 'MOSCA', 'MOTIM', 'MOTOR', 'MOVER', 'MUDAR', 'MUITO', 'MUNDO',
    'MURAL', 'MUSGO', 'NADAR', 'NAIPE', 'NATAL', 'NAVIO', 'NEVOA', 'NINHO', 'NIVEL', 'NOBRE',
    'NOITE', 'NORMA', 'NOTAR', 'NOTAS', 'NUNCA', 'NUTRI', 'OBRAS', 'OCUPA', 'ODIAR', 'OLHAR',
    'OLHOS', 'ONCAS', 'ONDEI', 'OPACO', 'OPERA', 'OPTAR', 'ORDEM', 'ORNAR', 'OSSOS', 'OUVIR',
    'OVULO', 'PADRE', 'PAINE', 'PALCO', 'PALHA', 'PAPEL', 'PARAR', 'PARTE', 'PASMO', 'PASTA',
    'PATOS', 'PAVIO', 'PEITO', 'PEIXE', 'PENAS', 'PENTE', 'PERDA', 'PERTO', 'PESAR', 'PIANO',
    'PICAR', 'PISTA', 'PLANO', 'PLENA', 'POEMA', 'POETA', 'POLAR', 'POLVO', 'POMAR', 'PONTA',
    'PORTE', 'POSAR', 'POSTO', 'POTRO', 'PRAIA', 'PRATA', 'PRETO', 'PRIME', 'PRIOR', 'PROVA',
    'PULAR', 'PULOS', 'PUNHO', 'QUEDA', 'QUERO', 'QUINA', 'QUOTA', 'RABOS', 'RADAR', 'RAIOS',
    'RAMOS', 'RAPAZ', 'RASGO', 'RATOS', 'REINO', 'RENDA', 'RENOS', 'RESTA', 'RETRO', 'REVER',
    'RIGOR', 'RIMAS', 'RISCO', 'RITOS', 'ROCHA', 'ROLAR', 'ROMAS', 'RONCO', 'ROSAI', 'ROSTO',
    'ROTAS', 'RUBRO', 'RUINS', 'RUMOS', 'RURAL', 'RUSSO', 'SABER', 'SABIO', 'SABOR', 'SACAR',
    'SALAS', 'SALTO', 'SALVA', 'SAMBA', 'SANAR', 'SANTO', 'SAPOS', 'SARAR', 'SAUDA', 'SAUNA',
    'SEARA', 'SEIOS', 'SELAR', 'SELVA', 'SENAO', 'SENHA', 'SENOS', 'SENTE', 'SERES', 'SERIO',
    'SERRA', 'SERVE', 'SESTA', 'SETAS', 'SEVER', 'SEXTO', 'SILVA', 'SIMBO', 'SINAL', 'SINTA',
    'SIRIO', 'SOBRA', 'SOCIO', 'SOFRE', 'SOLAR', 'SOLTA', 'SONAR', 'SONHO', 'SORRI', 'SORTE',
    'SUBIR', 'SUAVE', 'SUJAR', 'SUMIR', 'SUPER', 'SURTO', 'SUTIL', 'TABUA', 'TACOS'
];

const boardElement = document.getElementById('board');
const keyboardElement = document.getElementById('keyboard');
const attemptsSpan = document.getElementById('attempts');
const winsSpan = document.getElementById('wins');
const streakSpan = document.getElementById('streak');
const victoryScreen = document.getElementById('victoryScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const victoryWord = document.getElementById('victoryWord');
const victoryAttempts = document.getElementById('victoryAttempts');
const gameOverWord = document.getElementById('gameOverWord');
const victoryRestartBtn = document.getElementById('victoryRestartBtn');
const gameOverRestartBtn = document.getElementById('gameOverRestartBtn');
const newGameBtn = document.getElementById('newGameBtn');
const hintBtn = document.getElementById('hintBtn');

const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

let keyStates = {};
let board = [];

function updateStats() {
    winsSpan.textContent = wins;
    streakSpan.textContent = streak;
}

function saveStats() {
    localStorage.setItem('termoWins', wins);
    localStorage.setItem('termoStreak', streak);
}

function newGame() {
    targetWord = words[Math.floor(Math.random() * words.length)];
    currentGuess = '';
    currentRow = 0;
    gameActive = true;
    gameWon = false;
    gameOver = false;
    attempts = 0;
    keyStates = {};
    board = Array(maxAttempts).fill().map(() => Array(5).fill({ letter: '', status: '' }));
    
    attemptsSpan.textContent = `${currentRow}/${maxAttempts}`;
    
    victoryScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    renderBoard();
    renderKeyboard();
}

function renderBoard() {
    boardElement.innerHTML = '';
    
    for (let r = 0; r < maxAttempts; r++) {
        for (let c = 0; c < 5; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            if (board[r][c].letter) {
                cell.textContent = board[r][c].letter;
                cell.classList.add('filled');
                if (board[r][c].status) {
                    cell.classList.add(board[r][c].status);
                }
            }
            
            boardElement.appendChild(cell);
        }
    }
    
    if (currentGuess.length > 0 && currentRow < maxAttempts) {
        for (let i = 0; i < currentGuess.length; i++) {
            const index = currentRow * 5 + i;
            if (index < boardElement.children.length) {
                boardElement.children[index].textContent = currentGuess[i];
                boardElement.children[index].classList.add('filled');
            }
        }
    }
}

function renderKeyboard() {
    keyboardElement.innerHTML = '';
    
    keyboardLayout.forEach(row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard-row';
        
        row.forEach(key => {
            const keyElement = document.createElement('button');
            keyElement.className = 'key';
            if (key === 'ENTER' || key === '⌫') keyElement.classList.add('special');
            keyElement.textContent = key;
            
            if (keyStates[key]) {
                keyElement.classList.add(keyStates[key]);
            }
            
            keyElement.addEventListener('click', (e) => {
                e.preventDefault();
                handleKeyClick(key);
            });
            
            keyboardRow.appendChild(keyElement);
        });
        
        keyboardElement.appendChild(keyboardRow);
    });
}

function handleKeyClick(key) {
    if (!gameActive || gameWon || gameOver) return;
    
    if (key === 'ENTER') {
        submitGuess();
    } else if (key === '⌫') {
        deleteLetter();
    } else {
        addLetter(key);
    }
}

function addLetter(letter) {
    if (currentGuess.length < 5) {
        currentGuess += letter;
        renderBoard();
    }
}

function deleteLetter() {
    if (currentGuess.length > 0) {
        currentGuess = currentGuess.slice(0, -1);
        renderBoard();
    }
}

function submitGuess() {
    if (currentGuess.length !== 5) return;
    
    const guess = currentGuess;
    const result = Array(5).fill(null);
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');
    
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            result[i] = { letter: guessLetters[i], status: 'correct' };
            targetLetters[i] = null;
        }
    }
    
    for (let i = 0; i < 5; i++) {
        if (!result[i]) {
            const index = targetLetters.indexOf(guessLetters[i]);
            if (index !== -1 && index !== i && targetLetters[index] !== null) {
                result[i] = { letter: guessLetters[i], status: 'wrong-position' };
                targetLetters[index] = null;
            } else {
                result[i] = { letter: guessLetters[i], status: 'incorrect' };
            }
        }
    }
    
    board[currentRow] = result;
    
    for (let i = 0; i < 5; i++) {
        const key = result[i].letter;
        if (result[i].status === 'correct') {
            keyStates[key] = 'correct';
        } else if (result[i].status === 'wrong-position' && keyStates[key] !== 'correct') {
            keyStates[key] = 'wrong-position';
        } else if (result[i].status === 'incorrect' && !keyStates[key]) {
            keyStates[key] = 'incorrect';
        }
    }
    
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < 5; i++) {
        const cellIndex = currentRow * 5 + i;
        if (cellIndex < cells.length) {
            setTimeout(() => {
                cells[cellIndex].classList.add(result[i].status);
            }, i * 100);
        }
    }
    
    if (guess === targetWord) {
        setTimeout(() => {
            gameActive = false;
            gameWon = true;
            wins++;
            streak++;
            saveStats();
            updateStats();
            victoryWord.textContent = `Palavra: ${targetWord}`;
            victoryAttempts.textContent = `Tentativas: ${currentRow + 1}/${maxAttempts}`;
            victoryScreen.classList.remove('hidden');
        }, 500);
    } else {
        currentRow++;
        attempts = currentRow;
        attemptsSpan.textContent = `${currentRow}/${maxAttempts}`;
        
        if (currentRow >= maxAttempts) {
            setTimeout(() => {
                gameActive = false;
                gameOver = true;
                streak = 0;
                saveStats();
                updateStats();
                gameOverWord.textContent = `A palavra era: ${targetWord}`;
                gameOverScreen.classList.remove('hidden');
            }, 500);
        }
    }
    
    currentGuess = '';
    setTimeout(() => renderBoard(), 500);
    renderKeyboard();
}

document.addEventListener('keydown', (e) => {
    if (!gameActive || gameWon || gameOver) return;
    
    const key = e.key.toUpperCase();
    
    if (key === 'ENTER') {
        e.preventDefault();
        submitGuess();
    } else if (key === 'BACKSPACE') {
        e.preventDefault();
        deleteLetter();
    } else if (key.length === 1 && key.match(/[A-ZÇ]/) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        addLetter(key);
    }
});

newGameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    newGame();
});

hintBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (!gameActive || gameWon || gameOver) return;
    
    if (currentRow < maxAttempts) {
        const firstLetter = targetWord[0];
        board[currentRow][0] = { letter: firstLetter, status: '' };
        currentGuess = firstLetter;
        renderBoard();
    }
});

victoryRestartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    victoryScreen.classList.add('hidden');
    newGame();
});

gameOverRestartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    gameOverScreen.classList.add('hidden');
    newGame();
});

document.getElementById('backToArcade').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../index.html';
});

updateStats();
newGame();