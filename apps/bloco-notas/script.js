// ===== ELEMENTOS =====
const editor = document.getElementById('editor');
const cursorPos = document.getElementById('cursorPos');
const charCount = document.getElementById('charCount');
const fileModal = document.getElementById('fileModal');
const fileTitle = document.getElementById('fileTitle');
const fileName = document.getElementById('fileName');
const fileLocation = document.getElementById('fileLocation');
const fileOk = document.getElementById('fileOk');
const fileCancel = document.getElementById('fileCancel');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const errorClose = document.getElementById('errorClose');

// ===== VARIÁVEIS =====
let currentFile = 'Sem título.txt';
let isModified = false;

// ===== FUNÇÕES =====
function showError(message) {
    errorMessage.textContent = message;
    errorModal.classList.remove('hidden');
    
    errorModal.style.animation = 'errorShake 0.3s';
    setTimeout(() => {
        errorModal.style.animation = '';
    }, 300);
}

function updateCursorPosition() {
    const text = editor.value;
    const pos = editor.selectionStart;
    const lines = text.substr(0, pos).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    
    cursorPos.textContent = `Ln ${line}, Col ${col}`;
    charCount.textContent = `${text.length} caracteres`;
}

function showFileDialog(title, action) {
    fileTitle.textContent = title;
    fileName.value = currentFile;
    fileModal.classList.remove('hidden');
    
    fileOk.onclick = () => {
        if (action === 'save') {
            if (fileName.value === currentFile) {
                showError(`Não foi possível salvar o arquivo.\nAcesso negado.`);
            } else {
                currentFile = fileName.value;
                isModified = false;
            }
        } else if (action === 'open') {
            showError(`Não foi possível abrir o arquivo.\nArquivo não encontrado.`);
        }
        fileModal.classList.add('hidden');
    };
    
    fileCancel.onclick = () => {
        fileModal.classList.add('hidden');
    };
}

// ===== EVENT LISTENERS =====
editor.addEventListener('input', () => {
    isModified = true;
    updateCursorPosition();
});

editor.addEventListener('click', updateCursorPosition);
editor.addEventListener('keyup', updateCursorPosition);

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const menu = item.dataset.menu;
        
        if (menu === 'file') {
            if (item.textContent === 'Novo') {
                if (isModified) {
                    showError('Salve as alterações antes de criar um novo arquivo.');
                } else {
                    editor.value = '';
                    currentFile = 'Sem título.txt';
                    isModified = false;
                    updateCursorPosition();
                }
            } else if (item.textContent === 'Abrir') {
                showFileDialog('Abrir', 'open');
            } else if (item.textContent === 'Salvar') {
                if (currentFile === 'Sem título.txt') {
                    showFileDialog('Salvar Como', 'save');
                } else {
                    showError(`Erro ao salvar ${currentFile}.\nDisco cheio ou protegido.`);
                }
            } else if (item.textContent === 'Salvar Como') {
                showFileDialog('Salvar Como', 'save');
            }
        } else if (menu === 'edit') {
            if (item.textContent === 'Recortar') {
                document.execCommand('cut');
            } else if (item.textContent === 'Copiar') {
                document.execCommand('copy');
            } else if (item.textContent === 'Colar') {
                document.execCommand('paste');
            } else {
                showError(`Função "${item.textContent}" não implementada.`);
            }
        } else if (menu === 'format') {
            showError(`Formatação não disponível no Bloco de Notas.`);
        } else if (menu === 'help') {
            showError('Ajuda do Bloco de Notas não disponível.');
        }
    });
});

errorClose.addEventListener('click', () => {
    errorModal.classList.add('hidden');
});

// Fechar modais com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fileModal.classList.add('hidden');
        errorModal.classList.add('hidden');
    }
    
    // Ctrl+S para salvar
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (currentFile === 'Sem título.txt') {
            showFileDialog('Salvar Como', 'save');
        } else {
            showError(`Erro ao salvar ${currentFile}.\nDisco cheio ou protegido.`);
        }
    }
});

// ===== INICIALIZAÇÃO =====
updateCursorPosition();

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