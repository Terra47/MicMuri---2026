const display = document.getElementById('display');
const mc = document.getElementById('mc');
const mr = document.getElementById('mr');
const ms = document.getElementById('ms');
const mplus = document.getElementById('mplus');
const mminus = document.getElementById('mminus');
const clear = document.getElementById('clear');
const equals = document.getElementById('equals');
const memIndicator = document.getElementById('memIndicator');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const errorClose = document.getElementById('errorClose');

let currentInput = '0';
let previousInput = '';
let operation = null;
let memory = 0;
let resetNext = false;

function showError(message) {
    errorMessage.textContent = message;
    errorModal.classList.remove('hidden');
    
    errorModal.style.animation = 'errorShake 0.3s';
    setTimeout(() => {
        errorModal.style.animation = '';
    }, 300);
}

function updateDisplay() {
    display.value = currentInput;
}

function updateMemoryIndicator() {
    if (memory !== 0) {
        memIndicator.textContent = 'M';
    } else {
        memIndicator.textContent = '';
    }
}

function inputNumber(num) {
    if (resetNext) {
        currentInput = '';
        resetNext = false;
    }
    
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else {
        // Evita múltiplos pontos decimais
        if (num === '.' && currentInput.includes('.')) return;
        
        // Limita tamanho
        if (currentInput.length < 15) {
            currentInput += num;
        }
    }
    updateDisplay();
}

function inputOperator(op) {
    if (operation !== null && !resetNext) {
        calculate();
    }
    
    previousInput = currentInput;
    operation = op;
    resetNext = true;
}

function calculate() {
    if (operation === null || resetNext) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(curr)) {
        showError('Operação inválida');
        clearAll();
        return;
    }
    
    switch(operation) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            if (curr === 0) {
                showError('Divisão por zero');
                clearAll();
                return;
            }
            result = prev / curr;
            break;
        default:
            return;
    }

    if (!isFinite(result) || isNaN(result)) {
        showError('Resultado indefinido');
        clearAll();
        return;
    }
    
    currentInput = result.toString().substring(0, 15);
    operation = null;
    resetNext = true;
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    resetNext = false;
    updateDisplay();
}

document.querySelectorAll('.calc-btn[data-value]').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.dataset.value;
        inputNumber(value);
    });
});

document.querySelectorAll('.calc-btn.operator[data-value]').forEach(btn => {
    btn.addEventListener('click', () => {
        const op = btn.dataset.value;
        inputOperator(op);
    });
});

equals.addEventListener('click', calculate);

clear.addEventListener('click', clearAll);

mc.addEventListener('click', () => {
    memory = 0;
    updateMemoryIndicator();
});

mr.addEventListener('click', () => {
    currentInput = memory.toString();
    resetNext = true;
    updateDisplay();
});

ms.addEventListener('click', () => {
    memory = parseFloat(currentInput) || 0;
    updateMemoryIndicator();
});

mplus.addEventListener('click', () => {
    memory += parseFloat(currentInput) || 0;
    updateMemoryIndicator();
});

mminus.addEventListener('click', () => {
    memory -= parseFloat(currentInput) || 0;
    updateMemoryIndicator();
});

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const menu = item.dataset.menu;
        
        if (menu === 'edit') {
            if (item.textContent === 'Copiar') {
                navigator.clipboard?.writeText(currentInput);
            } else if (item.textContent === 'Colar') {
                navigator.clipboard?.readText().then(text => {
                    if (!isNaN(parseFloat(text))) {
                        currentInput = text;
                        updateDisplay();
                    }
                }).catch(() => {
                    showError('Não foi possível colar');
                });
            } else {
                showError(`Função "${item.textContent}" não implementada.`);
            }
        } else if (menu === 'help') {
            showError('Ajuda da Calculadora não disponível.');
        } else {
            showError(`Função "${item.textContent}" não implementada.`);
        }
    });
});

errorClose.addEventListener('click', () => {
    errorModal.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        inputNumber(e.key);
    } else if (e.key === '.') {
        inputNumber('.');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        inputOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape') {
        clearAll();
    } else if (e.key === 'Escape') {
        errorModal.classList.add('hidden');
    }
});

updateDisplay();
updateMemoryIndicator();

// Adiciona animação de erro
const style = document.createElement('style');
style.textContent = `
    @keyframes errorShake {
        0%, 100% { transform: translate(-50%, -50%); }
        25% { transform: translate(-50%, -50%) translateX(-10px); }
        50% { transform: translate(-50%, -50%) translateX(10px); }
        75% { transform: translate(-50%, -50%) translateX(-5px); }
    }
`;
document.head.appendChild(style);