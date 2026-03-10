const powerOffScreen = document.getElementById('power-off-screen');
const bootScreen = document.getElementById('boot-screen');
const bootProgressBar = document.getElementById('bootProgressBar');
const bootMessages = document.getElementById('bootMessages');
const dosTerminal = document.getElementById('dosTerminal');
const dosContent = document.getElementById('dosContent');
const loginScreen = document.getElementById('login-screen');
const passwordField = document.getElementById('passwordField');
const loginStatus = document.getElementById('loginStatus');
const loginButton = document.getElementById('loginButton');
const desktop = document.getElementById('desktop');
const appWindow = document.getElementById('app-window');
const windowTitle = document.getElementById('windowTitle');
const windowContent = document.getElementById('windowContent');
const closeWindow = document.getElementById('closeWindow');
const shutdownTray = document.getElementById('shutdownTray');
const shutdownMenuItem = document.getElementById('shutdownMenuItem');
const startButton = document.getElementById('startButton');
const startMenu = document.getElementById('startMenu');
const taskbarApps = document.getElementById('taskbarApps');
const clock = document.getElementById('clock');
const minimizeBtn = document.querySelector('.window-minimize');
const maximizeBtn = document.querySelector('.window-maximize');
const desktopIcons = document.querySelectorAll('.desktop-icon');
const startItems = document.querySelectorAll('.start-item:not(#shutdownMenuItem)');

let isPoweredOn = false;
let isLoggedIn = false;
let windowState = 'normal';
let openApps = [];
let nextZIndex = 2000;
let windowPosition = { x: 100, y: 100 };
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Virus simulation
let infectionLevel = 0;
const MAX_INFECTION = 15;
const originalDesktopBg = '#008080';
const originalTaskbarBg = '#c0c0c0';

function powerOn() {
    if (isPoweredOn) return;
    isPoweredOn = true;
    
    // Garante que todas as telas estão no estado correto
    powerOffScreen.classList.add('hidden');
    bootScreen.classList.remove('hidden');
    loginScreen.classList.add('hidden');
    desktop.classList.add('hidden');
    
    // Reseta o boot
    bootProgressBar.style.width = '0%';
    bootMessages.innerHTML = '<div class="boot-message">Iniciando Windows 95...</div>';
    bootMessages.classList.remove('hidden');
    dosTerminal.classList.add('hidden');
    dosContent.innerHTML = '';
    
    if (window.crtEffects) {
        window.crtEffects.start();
    }
    
    bootAnimation.startBoot(
        bootProgressBar,
        bootMessages,
        dosTerminal,
        dosContent,
        () => {
            setTimeout(() => {
                bootScreen.style.opacity = '0';
                
                setTimeout(() => {
                    bootScreen.classList.add('hidden');
                    loginScreen.classList.remove('hidden');
                    animateLogin();
                }, 1000);
            }, 1000);
        }
    );
}

function animateLogin() {
    let dots = '';
    const password = '********';
    let index = 0;
    
    const interval = setInterval(() => {
        if (index < password.length) {
            dots += '*';
            passwordField.value = dots;
            index++;
        } else {
            clearInterval(interval);
            loginStatus.textContent = 'Verificando credenciais...';
            
            setTimeout(() => {
                loginStatus.textContent = 'Bem-vindo ao Windows 95!';
                loginButton.disabled = false;
                
                loginButton.addEventListener('click', () => {
                    loginScreen.style.opacity = '0';
                    
                    setTimeout(() => {
                        loginScreen.classList.add('hidden');
                        desktop.classList.remove('hidden');
                        isLoggedIn = true;
                        
                        if (window.crtEffects) {
                            window.crtEffects.addWave();
                        }
                        
                        // Reseta créditos do arcade ao ligar
                        resetArcadeCredits();
                    }, 1000);
                }, { once: true });
            }, 2000);
        }
    }, 300);
}

function resetArcadeCredits() {
    const arcadeFrame = document.getElementById('arcade-frame');
    if (arcadeFrame && arcadeFrame.contentWindow && arcadeFrame.contentWindow.resetArcadeCredits) {
        arcadeFrame.contentWindow.resetArcadeCredits();
    }
    
    localStorage.removeItem('arcade_credits');
    sessionStorage.setItem('pc_boot_sequence', 'true');
}

function openApp(appName) {
    if (!isLoggedIn) return;
    
    const apps = {
        'computador': { title: 'Meu Computador', path: 'apps/computador/index.html' },
        'explorer': { title: 'Windows Explorer', path: 'apps/explorer/index.html' },
        'matematica': { title: 'Museu da Matemática', path: 'apps/matematica/index.html' },
        'programacao': { title: 'Museu da Programação', path: 'apps/programacao/index.html' },
        'arcade': { title: 'Arcade', path: 'apps/arcade/index.html' },
        'gerenciador-tarefas': { title: 'Gerenciador de Tarefas', path: 'apps/gerenciador-tarefas/index.html' },
        'painel-controle': { title: 'Painel de Controle', path: 'apps/painel-controle/index.html' },
        'bloco-notas': { title: 'Bloco de Notas', path: 'apps/bloco-notas/index.html' },
        'calculadora': { title: 'Calculadora', path: 'apps/calculadora/index.html' },
        'sobre': { title: 'Sobre', path: 'apps/sobre/index.html' }
    };
    
    const app = apps[appName];
    if (!app) return;
    
    windowTitle.textContent = app.title;
    windowContent.innerHTML = `<iframe src="${app.path}" title="${app.title}" style="width:100%; height:100%; border:none;"></iframe>`;
    
    appWindow.classList.remove('hidden');
    appWindow.style.zIndex = nextZIndex++;
    
    bringToFront();
    addToTaskbar(app.title);
}

function addToTaskbar(title) {
    const existing = document.querySelector(`.taskbar-app[data-title="${title}"]`);
    if (existing) existing.remove();
    
    const button = document.createElement('button');
    button.className = 'taskbar-app';
    button.setAttribute('data-title', title);
    button.textContent = title;
    
    button.addEventListener('click', () => {
        if (appWindow.classList.contains('hidden')) {
            appWindow.classList.remove('hidden');
            appWindow.style.zIndex = nextZIndex++;
        } else {
            appWindow.classList.add('hidden');
        }
    });
    
    taskbarApps.appendChild(button);
}

function removeFromTaskbar() {
    const title = windowTitle.textContent;
    const button = document.querySelector(`.taskbar-app[data-title="${title}"]`);
    if (button) button.remove();
}

function closeApp() {
    removeFromTaskbar();
    appWindow.classList.add('hidden');
    windowContent.innerHTML = '';
}

function minimizeApp() {
    appWindow.classList.add('hidden');
}

function toggleMaximize() {
    if (windowState === 'normal') {
        appWindow.style.width = '100%';
        appWindow.style.height = 'calc(100% - 50px)';
        appWindow.style.top = '0';
        appWindow.style.left = '0';
        windowState = 'maximized';
    } else {
        appWindow.style.width = '700px';
        appWindow.style.height = '500px';
        appWindow.style.top = windowPosition.y + 'px';
        appWindow.style.left = windowPosition.x + 'px';
        windowState = 'normal';
    }
}

function bringToFront() {
    appWindow.style.zIndex = nextZIndex++;
}

function shutdown() {
    if (!isPoweredOn) return;
    
    isPoweredOn = false;
    isLoggedIn = false;
    
    if (window.crtEffects) {
        window.crtEffects.stop();
    }
    
    if (window.shutdownAnimation) {
        window.shutdownAnimation.start(() => {
            desktop.classList.add('hidden');
            loginScreen.classList.add('hidden');
            bootScreen.classList.add('hidden');
            dosTerminal.classList.add('hidden');
            
            powerOffScreen.classList.remove('hidden');
            powerOffScreen.style.opacity = '1';
            
            // Limpa tudo
            taskbarApps.innerHTML = '';
            openApps = [];
        });
    }
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clock.textContent = `${hours}:${minutes}`;
}

document.addEventListener('keydown', (e) => {
    if (!isPoweredOn && !powerOffScreen.classList.contains('hidden')) {
        powerOn();
    }
});

powerOffScreen.addEventListener('click', powerOn);

desktopIcons.forEach(icon => {
    icon.addEventListener('dblclick', () => {
        const app = icon.dataset.app;
        openApp(app);
    });
});

startItems.forEach(item => {
    item.addEventListener('click', () => {
        const app = item.dataset.app;
        openApp(app);
        startMenu.classList.add('hidden');
    });
});

if (shutdownMenuItem) {
    shutdownMenuItem.addEventListener('click', shutdown);
}

if (shutdownTray) {
    shutdownTray.addEventListener('click', shutdown);
}

startButton.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
        startMenu.classList.add('hidden');
    }
});

closeWindow.addEventListener('click', closeApp);

if (minimizeBtn) {
    minimizeBtn.addEventListener('click', minimizeApp);
}

if (maximizeBtn) {
    maximizeBtn.addEventListener('click', toggleMaximize);
}

const titleBar = appWindow.querySelector('.window-title-bar');

titleBar.addEventListener('mousedown', (e) => {
    if (windowState === 'maximized') return;
    
    isDragging = true;
    dragOffset.x = e.clientX - appWindow.offsetLeft;
    dragOffset.y = e.clientY - appWindow.offsetTop;
    
    bringToFront();
});

document.addEventListener('mousemove', (e) => {
    if (isDragging && windowState === 'normal') {
        appWindow.style.left = (e.clientX - dragOffset.x) + 'px';
        appWindow.style.top = (e.clientY - dragOffset.y) + 'px';
        
        windowPosition.x = parseInt(appWindow.style.left);
        windowPosition.y = parseInt(appWindow.style.top);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

const resizeHandle = appWindow.querySelector('.window-resize-handle');
let isResizing = false;
let startSize = { w: 0, h: 0 };
let startPos = { x: 0, y: 0 };

resizeHandle.addEventListener('mousedown', (e) => {
    if (windowState === 'maximized') return;
    
    isResizing = true;
    startSize.w = appWindow.offsetWidth;
    startSize.h = appWindow.offsetHeight;
    startPos.x = e.clientX;
    startPos.y = e.clientY;
    
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (isResizing) {
        const newWidth = Math.max(300, startSize.w + (e.clientX - startPos.x));
        const newHeight = Math.max(200, startSize.h + (e.clientY - startPos.y));
        
        appWindow.style.width = newWidth + 'px';
        appWindow.style.height = newHeight + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
});

setInterval(updateClock, 1000);
updateClock();

// ============================================
// SISTEMA DE VÍRUS E CRASH
// ============================================

window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'VIRUS') {
        const virusName = event.data.name;
        console.log(`🧬 VÍRUS DETECTADO: ${virusName}`);

        infectionLevel++;
        updateInfectionUI();

        showVirusAlert(`⚠️ ${virusName} ativado! (Nível ${infectionLevel}/${MAX_INFECTION})`);

        applyVirusEffects(virusName);

        if (infectionLevel >= MAX_INFECTION) {
            triggerBlueScreenAndShutdown();
        }
    }
});

function updateInfectionUI() {
    const statusBar = document.querySelector('.status-bar');
    if (statusBar) {
        let infector = document.getElementById('infection-indicator');
        if (!infector) {
            infector = document.createElement('span');
            infector.id = 'infection-indicator';
            infector.style.marginLeft = '20px';
            infector.style.color = '#ff0000';
            infector.style.fontWeight = 'bold';
            statusBar.appendChild(infector);
        }
        infector.textContent = `⚠️ INFECÇÃO: ${infectionLevel}/${MAX_INFECTION}`;
    }
}

function showVirusAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.style.position = 'fixed';
    alertDiv.style.bottom = '80px';
    alertDiv.style.right = '20px';
    alertDiv.style.backgroundColor = '#000';
    alertDiv.style.color = '#ff0000';
    alertDiv.style.border = '2px solid #ff0000';
    alertDiv.style.padding = '10px 20px';
    alertDiv.style.zIndex = '999999';
    alertDiv.style.fontFamily = 'Courier New';
    alertDiv.style.fontSize = '14px';
    alertDiv.style.boxShadow = '0 0 20px #ff0000';
    alertDiv.style.animation = 'alertPulse 0.5s infinite';
    alertDiv.textContent = message;

    alertDiv.innerHTML = `⚠️ ${message}`;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        if (alertDiv.parentNode) alertDiv.remove();
    }, 3000);
}

function applyVirusEffects(virusName) {
    const desktop = document.getElementById('desktop');
    const taskbar = document.querySelector('.taskbar');
    const icons = document.querySelectorAll('.desktop-icon');

    switch(virusName) {
        case 'MEMZ':
            desktop.style.animation = 'bgPulse 0.2s infinite';
            break;
        case 'BLSTER':
            taskbar.style.backgroundColor = '#ff0000';
            break;
        case 'CIH':
            icons.forEach(icon => {
                icon.style.filter = 'hue-rotate(180deg)';
            });
            break;
        case 'MELISSA':
            for (let i = 0; i < 3; i++) {
                setTimeout(() => showVirusAlert('📧 MELISSA: Mensagem ' + (i+1)), i * 800);
            }
            break;
        case 'ILOVEYOU':
            desktop.style.background = '#ff69b4';
            break;
        case 'CHERNOBYL':
            document.body.style.filter = 'hue-rotate(90deg) brightness(1.5)';
            break;
        case 'GLITCH':
            document.body.style.animation = 'glitchFlash 0.1s infinite';
            break;
        case 'BLUE_SCREEN':
            break;
        case 'CORRUPT':
            document.querySelectorAll('.icon-label').forEach(label => {
                label.textContent = label.textContent.split('').map(c => 
                    Math.random() > 0.5 ? c : String.fromCharCode(c.charCodeAt(0)+1)
                ).join('');
            });
            break;
        case 'PIXEL':
            for (let i = 0; i < 10; i++) {
                createFloatingPixel();
            }
            break;
        case 'DESTROY':
            break;
        default:
            desktop.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 25%)`;
    }
}

function createFloatingPixel() {
    const pixel = document.createElement('div');
    pixel.style.position = 'fixed';
    pixel.style.width = '5px';
    pixel.style.height = '5px';
    pixel.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 50%)`;
    pixel.style.left = Math.random() * 100 + '%';
    pixel.style.top = Math.random() * 100 + '%';
    pixel.style.zIndex = '99999';
    pixel.style.pointerEvents = 'none';
    pixel.style.boxShadow = '0 0 10px currentColor';
    document.body.appendChild(pixel);

    setTimeout(() => {
        if (pixel.parentNode) pixel.remove();
    }, 2000);
}

function triggerBlueScreenAndShutdown() {
    document.querySelectorAll('[style*="z-index: 999999"]').forEach(el => el.remove());

    const bsod = document.createElement('div');
    bsod.style.position = 'fixed';
    bsod.style.top = '0';
    bsod.style.left = '0';
    bsod.style.width = '100%';
    bsod.style.height = '100%';
    bsod.style.backgroundColor = '#0000aa';
    bsod.style.color = '#ffffff';
    bsod.style.fontFamily = 'Courier New';
    bsod.style.fontSize = '24px';
    bsod.style.padding = '50px';
    bsod.style.zIndex = '1000000';
    bsod.style.whiteSpace = 'pre-wrap';
    bsod.style.boxSizing = 'border-box';
    bsod.innerHTML = `
        SYSTEM CRASH
        <br><br>
        A fatal exception 0E has occurred at 0028:C0011E36.
        The current application will be terminated.
        <br><br>
        * Press any key to terminate the current application
        * Press CTRL+ALT+DEL to restart your computer.
        <br><br>
        Error: 0E : 016F : BFF9B3D4
        <br><br>
        Infecção crítica: O sistema foi comprometido.
    `;
    document.body.appendChild(bsod);

    document.body.style.pointerEvents = 'none';

    setTimeout(() => {
        bsod.remove();
        document.body.style.pointerEvents = 'auto';
        resetInfection();
        rebootComputer(); // Agora chama reboot ao invés de shutdown direto
    }, 5000);
}

function rebootComputer() {
    // Força desligamento completo
    isPoweredOn = false;
    isLoggedIn = false;
    
    desktop.classList.add('hidden');
    loginScreen.classList.add('hidden');
    bootScreen.classList.add('hidden');
    dosTerminal.classList.add('hidden');
    
    powerOffScreen.classList.remove('hidden');
    powerOffScreen.style.opacity = '1';
    
    taskbarApps.innerHTML = '';
    openApps = [];
    
    // Reseta tudo
    resetInfection();
    
    // Limpa qualquer estado residual
    appWindow.classList.add('hidden');
    windowContent.innerHTML = '';
    
    // Volta para tela de boot em vez de precisar F5
    setTimeout(() => {
        powerOffScreen.classList.add('hidden');
        powerOn();
    }, 2000);
}

function resetInfection() {
    infectionLevel = 0;

    const indicator = document.getElementById('infection-indicator');
    if (indicator) indicator.remove();

    const desktop = document.getElementById('desktop');
    const taskbar = document.querySelector('.taskbar');
    if (desktop) {
        desktop.style.background = originalDesktopBg;
        desktop.style.animation = '';
        desktop.style.filter = '';
    }
    if (taskbar) taskbar.style.backgroundColor = originalTaskbarBg;

    document.body.style.filter = '';
    document.body.style.animation = '';

    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.style.filter = '';
    });
}