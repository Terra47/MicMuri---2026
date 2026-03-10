const drives = [
    { 
        name: 'Disco Local (C:)', 
        icon: '💾', 
        size: '2,10 GB', 
        free: '1,44 GB', 
        used: '0,66 GB',
        type: 'Disco Local',
        filesystem: 'FAT32',
        volume: 'WINDOWS95'
    },
    { 
        name: 'Disco Local (D:)', 
        icon: '💾', 
        size: '80 GB', 
        free: '62,3 GB', 
        used: '17,7 GB',
        type: 'Disco Local',
        filesystem: 'NTFS',
        volume: 'DADOS'
    },
    { 
        name: 'CD-ROM (E:)', 
        icon: '💿', 
        size: '700 MB', 
        free: '0 MB', 
        used: '700 MB',
        type: 'CD-ROM',
        filesystem: 'CDFS',
        volume: 'WINDOWS95_CD'
    },
    { 
        name: 'Disquete (A:)', 
        icon: '🖱️', 
        size: '1,44 MB', 
        free: '0,8 MB', 
        used: '0,64 MB',
        type: 'Disquete',
        filesystem: 'FAT12',
        volume: 'DISCO_1'
    },
    { 
        name: 'Rede (Z:)', 
        icon: '🌐', 
        size: '---', 
        free: '---', 
        used: '---',
        type: 'Unidade de Rede',
        filesystem: '---',
        volume: 'SERVIDOR'
    },
    { 
        name: 'Painel de Controle', 
        icon: '⚙️', 
        size: '---', 
        free: '---', 
        used: '---',
        type: 'Pasta do Sistema',
        filesystem: '---',
        volume: '---'
    }
];

const drivesContainer = document.getElementById('drivesContainer');
const addressField = document.getElementById('addressField');
const goBtn = document.getElementById('goBtn');
const itemCount = document.getElementById('itemCount');
const diskSpace = document.getElementById('diskSpace');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const errorClose = document.getElementById('errorClose');
const propertiesModal = document.getElementById('propertiesModal');
const propertiesContent = document.getElementById('propertiesContent');
const propertiesClose = document.getElementById('propertiesClose');

let selectedDrive = null;

function createDrives() {
    drives.forEach(drive => {
        const driveElement = document.createElement('div');
        driveElement.className = 'drive-item';
        
        driveElement.innerHTML = `
            <div class="drive-icon">${drive.icon}</div>
            <div class="drive-label">${drive.name}</div>
            <div class="drive-info">${drive.size}</div>
        `;
        
        driveElement.addEventListener('click', (e) => {
            e.stopPropagation();
            // Remove seleção anterior
            document.querySelectorAll('.drive-item').forEach(el => {
                el.classList.remove('selected');
            });
            driveElement.classList.add('selected');
            selectedDrive = drive;
        });
        
        driveElement.addEventListener('dblclick', () => {
            if (drive.type === 'CD-ROM') {
                showError('Não é possível acessar E:\\ neste momento.\nCertifique-se de que há um disco no drive.');
            } else if (drive.type === 'Disquete') {
                showError('A unidade A: não está acessível.\nErro de dispositivo.');
            } else if (drive.type === 'Unidade de Rede') {
                showError('Caminho de rede não encontrado.\nVerifique o nome e tente novamente.');
            } else {
                addressField.value = drive.name;
                showProperties(drive);
            }
        });
        
        drivesContainer.appendChild(driveElement);
    });
    
    updateStatus();
}

function updateStatus() {
    itemCount.textContent = `${drives.length} objeto(s)`;
    const totalFree = drives
        .filter(d => d.free !== '---')
        .reduce((acc, d) => {
            const value = parseFloat(d.free.replace(',', '.').replace(' GB', ''));
            return acc + (isNaN(value) ? 0 : value);
        }, 0);
    diskSpace.textContent = `${totalFree.toFixed(2)} GB livres`;
}

function showError(message) {
    errorMessage.textContent = message;
    errorModal.classList.remove('hidden');
    
    // Efeito de erro
    errorModal.style.animation = 'errorShake 0.3s';
    setTimeout(() => {
        errorModal.style.animation = '';
    }, 300);
}

function showProperties(drive) {
    propertiesContent.innerHTML = `
        <p><strong>Tipo:</strong> ${drive.type}</p>
        <p><strong>Sistema de arquivos:</strong> ${drive.filesystem}</p>
        <p><strong>Rótulo do volume:</strong> ${drive.volume}</p>
        <p><strong>Capacidade:</strong> ${drive.size}</p>
        <p><strong>Espaço usado:</strong> ${drive.used}</p>
        <p><strong>Espaço livre:</strong> ${drive.free}</p>
        ${drive.used !== '---' ? `
        <div style="margin-top: 10px;">
            <div style="background: #c0c0c0; height: 15px; width: 100%; border: 2px inset;">
                <div style="background: #000080; height: 100%; width: ${(parseFloat(drive.used.replace(',', '.')) / parseFloat(drive.size.replace(',', '.'))) * 100}%;"></div>
            </div>
        </div>
        ` : ''}
    `;
    propertiesModal.classList.remove('hidden');
}

goBtn.addEventListener('click', () => {
    const path = addressField.value;
    const found = drives.find(d => d.name === path);
    if (found) {
        addressField.value = found.name;
        if (found.type === 'CD-ROM') {
            showError('Não é possível acessar E:\\ neste momento.\nCertifique-se de que há um disco no drive.');
        } else {
            showProperties(found);
        }
    } else {
        showError(`O caminho '${path}' não foi encontrado.\nVerifique se o nome está correto.`);
    }
});

errorClose.addEventListener('click', () => {
    errorModal.classList.add('hidden');
});

propertiesClose.addEventListener('click', () => {
    propertiesModal.classList.add('hidden');
});

// Fechar modais com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        errorModal.classList.add('hidden');
        propertiesModal.classList.add('hidden');
    }
});

// Menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const menu = item.dataset.menu;
        if (menu === 'help') {
            showError('Ajuda não disponível neste momento.');
        } else {
            showError(`Função "${item.textContent}" não implementada.`);
        }
    });
});

document.addEventListener('DOMContentLoaded', createDrives);

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