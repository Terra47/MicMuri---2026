// ===== CATEGORIAS E ITENS =====
const categories = {
    system: {
        name: 'Sistema',
        icon: '🖥️',
        items: [
            { name: 'Sistema', icon: '🖥️', desc: 'Informações do computador' },
            { name: 'Gerenciador de Dispositivos', icon: '⚙️', desc: 'Configurar hardware' },
            { name: 'Performance', icon: '📊', desc: 'Desempenho do sistema' },
            { name: 'Atualizações', icon: '🔄', desc: 'Atualizações do Windows' }
        ]
    },
    hardware: {
        name: 'Hardware',
        icon: '🖱️',
        items: [
            { name: 'Mouse', icon: '🖱️', desc: 'Configurar botões e velocidade' },
            { name: 'Teclado', icon: '⌨️', desc: 'Configurar teclado' },
            { name: 'Som', icon: '🔊', desc: 'Configurar dispositivos de áudio' },
            { name: 'Impressoras', icon: '🖨️', desc: 'Adicionar/remover impressoras' },
            { name: 'Modem', icon: '📞', desc: 'Configurar conexão discada' }
        ]
    },
    appearance: {
        name: 'Aparência',
        icon: '🎨',
        items: [
            { name: 'Tela', icon: '🖥️', desc: 'Configurar resolução e cores' },
            { name: 'Tela de fundo', icon: '🖼️', desc: 'Alterar papel de parede' },
            { name: 'Proteção de tela', icon: '🌀', desc: 'Configurar descanso de tela' },
            { name: 'Temas', icon: '🎭', desc: 'Escolher tema do Windows' },
            { name: 'Cores', icon: '🎨', desc: 'Configurar cores da interface' }
        ]
    },
    network: {
        name: 'Rede',
        icon: '🌐',
        items: [
            { name: 'Conexões de rede', icon: '🌐', desc: 'Configurar adaptadores' },
            { name: 'Internet', icon: '📡', desc: 'Configurar acesso à internet' },
            { name: 'Compartilhamento', icon: '🔄', desc: 'Configurar rede doméstica' },
            { name: 'Firewall', icon: '🛡️', desc: 'Configurar proteção' }
        ]
    },
    programs: {
        name: 'Programas',
        icon: '📦',
        items: [
            { name: 'Adicionar/Remover Programas', icon: '➕', desc: 'Instalar/desinstalar software' },
            { name: 'Programas Iniciar', icon: '🚀', desc: 'Programas na inicialização' },
            { name: 'Compatibilidade', icon: '🔄', desc: 'Configurar compatibilidade' }
        ]
    },
    users: {
        name: 'Usuários',
        icon: '👥',
        items: [
            { name: 'Contas de usuário', icon: '👤', desc: 'Adicionar/remover usuários' },
            { name: 'Senhas', icon: '🔒', desc: 'Alterar senhas' },
            { name: 'Controle dos Pais', icon: '👪', desc: 'Restrições de uso' }
        ]
    }
};

// ===== ELEMENTOS =====
const systemItems = document.getElementById('systemItems');
const hardwareItems = document.getElementById('hardwareItems');
const appearanceItems = document.getElementById('appearanceItems');
const networkItems = document.getElementById('networkItems');
const programsItems = document.getElementById('programsItems');
const usersItems = document.getElementById('usersItems');
const propertyModal = document.getElementById('propertyModal');
const propertyTitle = document.getElementById('propertyTitle');
const propertyContent = document.getElementById('propertyContent');
const propertyClose = document.getElementById('propertyClose');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const errorClose = document.getElementById('errorClose');
const itemCount = document.getElementById('itemCount');

// ===== VARIÁVEIS =====
let selectedItem = null;

// ===== FUNÇÕES =====
function showError(message) {
    errorMessage.textContent = message;
    errorModal.classList.remove('hidden');
    
    errorModal.style.animation = 'errorShake 0.3s';
    setTimeout(() => {
        errorModal.style.animation = '';
    }, 300);
}

function showProperties(item, category) {
    let content = '';
    
    switch(item.name) {
        case 'Sistema':
            content = `
                <div class="property-tabs">
                    <span class="property-tab active">Geral</span>
                    <span class="property-tab">Hardware</span>
                    <span class="property-tab">Avançado</span>
                </div>
                <div class="property-field">
                    <label>Sistema:</label>
                    <input type="text" value="Windows 95 [Version 4.00.950]" readonly>
                </div>
                <div class="property-field">
                    <label>Registrado para:</label>
                    <input type="text" value="Visitante" readonly>
                </div>
                <div class="property-field">
                    <label>Computador:</label>
                    <input type="text" value="Intel 80486 DX2 66MHz" readonly>
                </div>
                <div class="property-field">
                    <label>Memória RAM:</label>
                    <input type="text" value="16 MB" readonly>
                </div>
            `;
            break;
            
        case 'Mouse':
            content = `
                <div class="property-tabs">
                    <span class="property-tab active">Botões</span>
                    <span class="property-tab">Movimento</span>
                    <span class="property-tab">Hardware</span>
                </div>
                <div class="property-field">
                    <label>Configuração dos botões:</label>
                    <select>
                        <option>Destro</option>
                        <option>Canhoto</option>
                    </select>
                </div>
                <div class="property-field">
                    <label>Velocidade do clique duplo:</label>
                    <input type="range" min="0" max="100" value="50">
                </div>
            `;
            break;
            
        case 'Tela':
            content = `
                <div class="property-tabs">
                    <span class="property-tab active">Configurações</span>
                    <span class="property-tab">Cores</span>
                    <span class="property-tab">Avançado</span>
                </div>
                <div class="property-field">
                    <label>Resolução da tela:</label>
                    <select>
                        <option>640 x 480 pixels</option>
                        <option>800 x 600 pixels</option>
                        <option selected>1024 x 768 pixels</option>
                    </select>
                </div>
                <div class="property-field">
                    <label>Qualidade de cor:</label>
                    <select>
                        <option>16 cores</option>
                        <option>256 cores</option>
                        <option selected>16 bits (Milhares)</option>
                        <option>24 bits (Milhões)</option>
                    </select>
                </div>
            `;
            break;
            
        default:
            content = `
                <p style="text-align: center; margin: 30px 0;">Configurações de ${item.name}</p>
                <p style="text-align: center; color: #808080;">${item.desc}</p>
                <div class="property-field">
                    <label>Status:</label>
                    <input type="text" value="Não configurado" readonly>
                </div>
            `;
    }
    
    propertyTitle.textContent = `Propriedades de ${item.name}`;
    propertyContent.innerHTML = content;
    propertyModal.classList.remove('hidden');
}

function loadCategoryItems() {
    let totalItems = 0;
    
    // System
    categories.system.items.forEach(item => {
        const itemEl = createCategoryItem(item);
        systemItems.appendChild(itemEl);
        totalItems++;
    });
    
    // Hardware
    categories.hardware.items.forEach(item => {
        const itemEl = createCategoryItem(item);
        hardwareItems.appendChild(itemEl);
        totalItems++;
    });
    
    // Appearance
    categories.appearance.items.forEach(item => {
        const itemEl = createCategoryItem(item);
        appearanceItems.appendChild(itemEl);
        totalItems++;
    });
    
    // Network
    categories.network.items.forEach(item => {
        const itemEl = createCategoryItem(item);
        networkItems.appendChild(itemEl);
        totalItems++;
    });
    
    // Programs
    categories.programs.items.forEach(item => {
        const itemEl = createCategoryItem(item);
        programsItems.appendChild(itemEl);
        totalItems++;
    });
    
    // Users
    categories.users.items.forEach(item => {
        const itemEl = createCategoryItem(item);
        usersItems.appendChild(itemEl);
        totalItems++;
    });
    
    itemCount.textContent = `${totalItems} objeto(s) no Painel de Controle`;
}

function createCategoryItem(item) {
    const div = document.createElement('div');
    div.className = 'category-item';
    div.innerHTML = `
        <span class="item-icon">${item.icon}</span>
        <span>${item.name}</span>
    `;
    
    div.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.category-item').forEach(el => {
            el.classList.remove('selected');
        });
        div.classList.add('selected');
        selectedItem = item;
    });
    
    div.addEventListener('dblclick', () => {
        let category = '';
        for (const [key, cat] of Object.entries(categories)) {
            if (cat.items.some(i => i.name === item.name)) {
                category = key;
                break;
            }
        }
        showProperties(item, category);
    });
    
    return div;
}

// ===== EVENT LISTENERS =====
document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', () => {
        const category = header.dataset.category;
        showError(`Não é possível abrir categoria "${categories[category].name}" diretamente.`);
    });
});

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const menu = item.dataset.menu;
        if (menu === 'help') {
            showError('Ajuda do Painel de Controle não disponível.');
        } else {
            showError(`Função "${item.textContent}" não implementada.`);
        }
    });
});

propertyClose.addEventListener('click', () => {
    propertyModal.classList.add('hidden');
});

errorClose.addEventListener('click', () => {
    errorModal.classList.add('hidden');
});

// Fechar modais com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        propertyModal.classList.add('hidden');
        errorModal.classList.add('hidden');
    }
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', loadCategoryItems);

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