// ===== ELEMENTOS =====
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

// ===== VARIÁVEIS =====
let isPoweredOn = false;
let isLoggedIn = false;
let windowState = 'normal';
let openApps = [];
let nextZIndex = 2000;
let windowPosition = { x: 100, y: 100 };
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// ===== FUNÇÕES =====
function powerOn() {
    if (isPoweredOn) return;
    isPoweredOn = true;
    
    powerOffScreen.style.opacity = '0';
    
    setTimeout(() => {
        powerOffScreen.classList.add('hidden');
        bootScreen.classList.remove('hidden');
        
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
    }, 1000);
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
                    }, 1000);
                }, { once: true });
            }, 2000);
        }
    }, 300);
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
    windowContent.innerHTML = `<iframe src="${app.path}" title="${app.title}"></iframe>`;
    
    appWindow.classList.remove('hidden');
    appWindow.style.zIndex = nextZIndex++;
    
    bringToFront();
    addToTaskbar(app.title);
}

function addToTaskbar(title) {
    // Remove se já existir
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

// ===== EVENT LISTENERS =====
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

// Drag da janela
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

// Redimensionamento
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

// Relógio
setInterval(updateClock, 1000);
updateClock();