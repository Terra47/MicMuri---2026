let credits = 3;
const password = 'drakon267';
const STORAGE_KEY = 'arcade_credits';

const creditDisplay = document.getElementById('creditDisplay');
const creditCounter = document.getElementById('creditCounter');
const passwordInput = document.getElementById('passwordInput');
const passwordButton = document.getElementById('passwordButton');

function loadCredits() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
        credits = parseInt(saved);
    } else {
        credits = 3;
        localStorage.setItem(STORAGE_KEY, credits);
    }
    updateCredits();
}

function saveCredits() {
    localStorage.setItem(STORAGE_KEY, credits);
}

function updateCredits() {
    creditDisplay.textContent = credits.toString().padStart(2, '0');
    creditCounter.textContent = credits + ' crédito' + (credits !== 1 ? 's' : '');
    
    const buttons = document.querySelectorAll('.play-button');
    buttons.forEach(btn => {
        btn.disabled = credits === 0;
    });
    
    saveCredits();
}

function spendCredit() {
    if (credits > 0) {
        credits--;
        updateCredits();
        return true;
    }
    return false;
}

function addCredits(amount) {
    credits += amount;
    updateCredits();
}

passwordButton.onclick = function() {
    if (passwordInput.value === password) {
        addCredits(3);
        passwordInput.value = '';
    }
};

passwordInput.onkeypress = function(e) {
    if (e.key === 'Enter') {
        if (passwordInput.value === password) {
            addCredits(3);
            passwordInput.value = '';
        }
    }
};

const gameCards = document.querySelectorAll('.game-card');
gameCards.forEach(card => {
    const button = card.querySelector('.play-button');
    const gameId = card.dataset.game;
    
    button.onclick = function(e) {
        e.preventDefault();
        if (spendCredit()) {
            window.location.href = 'jogos/' + gameId + '/';
        }
    };
});

loadCredits();

window.resetArcadeCredits = function() {
    credits = 3;
    saveCredits();
    updateCredits();
};