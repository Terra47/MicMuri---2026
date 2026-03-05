// ===== ESTRUTURA DE PASTAS =====
const folderStructure = {
    'Área de Trabalho': {
        icon: '🖥️',
        path: 'C:\\Windows\\Desktop',
        items: [
            { name: 'Meu Computador', type: 'pasta', icon: '🖥️', size: '---', modified: '10/03/2026' },
            { name: 'Meus Documentos', type: 'pasta', icon: '📁', size: '---', modified: '10/03/2026' },
            { name: 'Lixeira', type: 'pasta', icon: '🗑️', size: '---', modified: '10/03/2026' },
            { name: 'Internet Explorer', type: 'programa', icon: '🌐', size: '245 KB', modified: '09/03/2026' },
            { name: 'Microsoft Word', type: 'programa', icon: '📄', size: '1,2 MB', modified: '08/03/2026' },
            { name: 'Bloco de Notas', type: 'programa', icon: '📝', size: '32 KB', modified: '10/03/2026' }
        ]
    },
    'Meu Computador': {
        icon: '🖥️',
        path: 'C:\\',
        items: [
            { name: 'Disco Local (C:)', type: 'drive', icon: '💾', size: '2,10 GB', modified: '---' },
            { name: 'Disco Local (D:)', type: 'drive', icon: '💾', size: '80 GB', modified: '---' },
            { name: 'CD-ROM (E:)', type: 'drive', icon: '💿', size: '700 MB', modified: '---' },
            { name: 'Painel de Controle', type: 'pasta', icon: '⚙️', size: '---', modified: '10/03/2026' }
        ]
    },
    'Meus Documentos': {
        icon: '📁',
        path: 'C:\\Windows\\Documents',
        items: [
            { name: 'Documentos', type: 'pasta', icon: '📁', size: '---', modified: '10/03/2026' },
            { name: 'Imagens', type: 'pasta', icon: '🖼️', size: '---', modified: '09/03/2026' },
            { name: 'Músicas', type: 'pasta', icon: '🎵', size: '---', modified: '08/03/2026' },
            { name: 'Vídeos', type: 'pasta', icon: '🎬', size: '---', modified: '07/03/2026' },
            { name: 'Projeto.txt', type: 'arquivo', icon: '📄', size: '12 KB', modified: '10/03/2026' },
            { name: 'Relatório.doc', type: 'arquivo', icon: '📄', size: '245 KB', modified: '09/03/2026' }
        ]
    },
    'Lixeira': {
        icon: '🗑️',
        path: 'C:\\RECYCLED',
        items: [
            { name: 'Arquivo Antigo.txt', type: 'arquivo', icon: '📄', size: '5 KB', modified: '05/03/2026' },
            { name: 'Foto.bmp', type: 'arquivo', icon: '🖼️', size: '128 KB', modified: '04/03/2026' },
            { name: 'Instalador.exe', type: 'programa', icon: '⚙️', size: '1,5 MB', modified: '03/03/2026' }
        ]
    }
};

// ===== ELEMENTOS =====
const folderTree = document.getElementById('folderTree');
const folderItems = document.getElementById('folderItems');
const currentFolder = document.getElementById('currentFolder');
const itemCount = document.getElementById('itemCount');
const diskSpace = document.getElementById('diskSpace');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const errorClose = document.querySelector('.error-close');
const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
const largeIcons = document.getElementById('largeIcons');
const detailsView = document.getElementById('detailsView');

// ===== VARIÁVEIS =====
let selectedFolder = 'Área de Trabalho';
let selectedItem = null;
let isResizing = false;
let startX = 0;
let startWidth = 0;
let currentView = 'icons'; // 'icons' ou 'details'
const folderTreeElement = document.querySelector('.folder-tree');
const splitter = document.querySelector('.splitter');

// ===== FUNÇÕES =====
function showError(message) {
    errorMessage.textContent = message;
    errorModal.classList.remove('hidden');
    
    errorModal.style.animation = 'errorShake 0.3s';
    setTimeout(() => {
        errorModal.style.animation = '';
    }, 300);
}

function showConfirm(message, callback) {
    confirmMessage.textContent = message;
    confirmModal.classList.remove('hidden');
    
    confirmYes.onclick = () => {
        callback(true);
        confirmModal.classList.add('hidden');
    };
    
    confirmNo.onclick = () => {
        callback(false);
        confirmModal.classList.add('hidden');
    };
}

function createFolderTree() {
    folderTree.innerHTML = '';
    
    Object.keys(folderStructure).forEach(folderName => {
        const folder = folderStructure[folderName];
        const treeItem = document.createElement('div');
        treeItem.className = 'tree-item';
        if (folderName === selectedFolder) {
            treeItem.classList.add('selected');
        }
        
        treeItem.innerHTML = `
            <span class="tree-item-icon">${folder.icon}</span>
            <span>${folderName}</span>
        `;
        
        treeItem.addEventListener('click', () => {
            document.querySelectorAll('.tree-item').forEach(el => {
                el.classList.remove('selected');
            });
            treeItem.classList.add('selected');
            selectedFolder = folderName;
            loadFolderContents(folderName);
        });
        
        folderTree.appendChild(treeItem);
    });
}

function loadFolderContents(folderName) {
    const folder = folderStructure[folderName];
    if (!folder) {
        showError(`A pasta '${folderName}' não pode ser acessada.\nAcesso negado.`);
        return;
    }
    
    currentFolder.textContent = folderName;
    folderItems.innerHTML = '';
    folderItems.className = currentView === 'icons' ? 'content-items' : 'content-items details-view';
    
    folder.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'content-item';
        
        if (currentView === 'icons') {
            itemElement.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
            `;
        } else {
            itemElement.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-details">
                    <span>${item.size}</span>
                    <span>${item.modified}</span>
                </div>
            `;
        }
        
        itemElement.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.content-item').forEach(el => {
                el.classList.remove('selected');
            });
            itemElement.classList.add('selected');
            selectedItem = item;
        });
        
        itemElement.addEventListener('dblclick', () => {
            if (item.type === 'pasta') {
                if (folderStructure[item.name]) {
                    selectedFolder = item.name;
                    loadFolderContents(item.name);
                } else {
                    showError(`A pasta '${item.name}' não pode ser aberta.\nErro de acesso.`);
                }
            } else if (item.type === 'arquivo') {
                showError(`Não foi possível abrir '${item.name}'.\nArquivo corrompido ou incompatível.`);
            } else if (item.type === 'programa') {
                showError(`O programa '${item.name}' não pode ser executado.\nErro de aplicativo.`);
            } else if (item.type === 'drive') {
                if (item.name.includes('CD-ROM')) {
                    showError('Não é possível acessar E:\\ neste momento.\nCertifique-se de que há um disco no drive.');
                } else {
                    showError(`O disco ${item.name} não está acessível.\nErro de leitura.`);
                }
            }
        });
        
        folderItems.appendChild(itemElement);
    });
    
    updateStatus(folder.items.length);
}

function updateStatus(count) {
    itemCount.textContent = `${count} objeto(s)`;
    diskSpace.textContent = '1,44 GB livres (Disco C:)';
}

// ===== EVENT LISTENERS =====
splitter.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = folderTreeElement.offsetWidth;
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (isResizing) {
        const newWidth = startWidth + (e.clientX - startX);
        if (newWidth >= 100 && newWidth <= 400) {
            folderTreeElement.style.width = newWidth + 'px';
        }
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
});

largeIcons.addEventListener('click', () => {
    currentView = 'icons';
    loadFolderContents(selectedFolder);
});

detailsView.addEventListener('click', () => {
    currentView = 'details';
    loadFolderContents(selectedFolder);
});

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const menu = item.dataset.menu;
        if (menu === 'file') {
            if (selectedItem) {
                showConfirm(`Tem certeza que deseja excluir '${selectedItem.name}'?`, (confirmed) => {
                    if (confirmed) {
                        showError(`Erro ao excluir '${selectedItem.name}'.\nArquivo em uso por outro programa.`);
                    }
                });
            } else {
                showError('Selecione um arquivo ou pasta primeiro.');
            }
        } else if (menu === 'help') {
            showError('A ajuda do Windows não está disponível no momento.');
        } else {
            showError(`Função "${item.textContent}" não implementada.`);
        }
    });
});

errorClose.addEventListener('click', () => {
    errorModal.classList.add('hidden');
});

// Fechar modais com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        errorModal.classList.add('hidden');
        confirmModal.classList.add('hidden');
    }
    
    // Delete key
    if (e.key === 'Delete' && selectedItem) {
        showConfirm(`Tem certeza que deseja excluir '${selectedItem.name}'?`, (confirmed) => {
            if (confirmed) {
                showError(`Erro ao excluir '${selectedItem.name}'.\nArquivo em uso por outro programa.`);
            }
        });
    }
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    createFolderTree();
    loadFolderContents(selectedFolder);
});

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