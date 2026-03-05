// ===== ELEMENTOS =====
const aboutOk = document.getElementById('aboutOk');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const errorClose = document.getElementById('errorClose');

// ===== FUNÇÕES =====
function showError(message) {
    errorMessage.textContent = message;
    errorModal.classList.remove('hidden');
    
    errorModal.style.animation = 'errorShake 0.3s';
    setTimeout(() => {
        errorModal.style.animation = '';
    }, 300);
}

// ===== EVENT LISTENERS =====
aboutOk.addEventListener('click', () => {
    // Fecha a janela (simulado)
    showError('Não foi possível fechar a janela.\nAplicativo ocupado.');
});

errorClose.addEventListener('click', () => {
    errorModal.classList.add('hidden');
});

// Fechar com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        errorModal.classList.add('hidden');
    }
});

// ===== INICIALIZAÇÃO =====
// Atualiza informações do sistema
const memInfo = document.querySelector('.system-info');
const freeMem = Math.floor(Math.random() * 5) + 6;
memInfo.textContent = `Memória disponível: ${freeMem},${Math.floor(Math.random() * 9)} MB`;

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