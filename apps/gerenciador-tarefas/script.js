let applications = [
    { name: 'Meu Computador', status: 'Executando', cpu: '02', memory: '1,2 MB' },
    { name: 'Windows Explorer', status: 'Executando', cpu: '08', memory: '3,4 MB' },
    { name: 'Bloco de Notas', status: 'Executando', cpu: '01', memory: '0,8 MB' },
    { name: 'Calculadora', status: 'Executando', cpu: '01', memory: '0,6 MB' },
    { name: 'Museu da Matemática', status: 'Executando', cpu: '12', memory: '4,1 MB' },
    { name: 'Museu da Programação', status: 'Em segundo plano', cpu: '03', memory: '2,2 MB' },
    { name: 'Arcade', status: 'Não respondendo', cpu: '25', memory: '5,3 MB' }
];

let processes = [
    { name: 'SYSTEM', pid: '0001', cpu: '02', memory: '1,2 MB', threads: '16' },
    { name: 'EXPLORER.EXE', pid: '0123', cpu: '08', memory: '3,4 MB', threads: '8' },
    { name: 'WINWORD.EXE', pid: '0456', cpu: '12', memory: '4,1 MB', threads: '4' },
    { name: 'CALC.EXE', pid: '0789', cpu: '01', memory: '0,8 MB', threads: '2' },
    { name: 'NOTEPAD.EXE', pid: '0345', cpu: '03', memory: '1,1 MB', threads: '3' },
    { name: 'KERNEL32.DLL', pid: '0002', cpu: '05', memory: '2,3 MB', threads: '12' },
    { name: 'USER32.DLL', pid: '0003', cpu: '04', memory: '1,7 MB', threads: '9' },
    { name: 'GDI32.DLL', pid: '0004', cpu: '03', memory: '1,4 MB', threads: '7' },
    { name: 'MSGSRV32.EXE', pid: '0234', cpu: '01', memory: '0,9 MB', threads: '5' },
    { name: 'SPOOL32.EXE', pid: '0567', cpu: '02', memory: '1,3 MB', threads: '4' },
    { name: 'MPREXE.EXE', pid: '0890', cpu: '01', memory: '0,7 MB', threads: '3' },
    { name: 'MMTASK.TSK', pid: '0901', cpu: '02', memory: '1,1 MB', threads: '4' }
];

const tabApps = document.getElementById('tabApps');
const tabProcesses = document.getElementById('tabProcesses');
const tabPerformance = document.getElementById('tabPerformance');
const appsContent = document.getElementById('appsContent');
const processesContent = document.getElementById('processesContent');
const performanceContent = document.getElementById('performanceContent');
const appsList = document.getElementById('appsList');
const processesList = document.getElementById('processesList');
const endTaskBtn = document.getElementById('endTaskBtn');
const endProcessBtn = document.getElementById('endProcessBtn');
const switchToBtn = document.getElementById('switchToBtn');
const newTaskBtn = document.getElementById('newTaskBtn');
const priorityBtn = document.getElementById('priorityBtn');

// Status bar elements
const statusProcesses = document.getElementById('statusProcesses');
const statusCPU = document.getElementById('statusCPU');
const statusMem = document.getElementById('statusMem');

// Performance elements
const cpuBar = document.getElementById('cpuBar');
const cpuValue = document.getElementById('cpuValue');
const cpuHistory = document.getElementById('cpuHistory');
const memBar = document.getElementById('memBar');
const memValue = document.getElementById('memValue');
const memInfo = document.getElementById('memInfo');
const memFree = document.getElementById('memFree');
const processCount = document.getElementById('processCount');
const uptime = document.getElementById('uptime');

// Modals
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const errorClose = document.querySelector('.error-close');
const newTaskModal = document.getElementById('newTaskModal');
const taskInput = document.getElementById('taskInput');
const taskOk = document.getElementById('taskOk');
const taskCancel = document.getElementById('taskCancel');
const priorityModal = document.getElementById('priorityModal');
const priorityProcess = document.getElementById('priorityProcess');
const priorityOk = document.getElementById('priorityOk');
const priorityCancel = document.getElementById('priorityCancel');

let selectedApp = null;
let selectedProcess = null;
let cpuHistoryArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let startTime = Date.now();

function showError(message) {
    errorMessage.textContent = message;
    errorModal.classList.remove('hidden');
    
    errorModal.style.animation = 'errorShake 0.3s';
    setTimeout(() => {
        errorModal.style.animation = '';
    }, 300);
}

function loadApps() {
    appsList.innerHTML = '';
    
    applications.forEach(app => {
        const appElement = document.createElement('div');
        appElement.className = 'app-item';
        
        let statusClass = 'running';
        if (app.status === 'Não respondendo') statusClass = 'not-responding';
        
        appElement.innerHTML = `
            <span>${app.name}</span>
            <span class="status ${statusClass}">${app.status}</span>
            <span>${app.cpu}%</span>
            <span>${app.memory}</span>
        `;
        
        appElement.addEventListener('click', () => {
            document.querySelectorAll('.app-item').forEach(el => {
                el.classList.remove('selected');
            });
            appElement.classList.add('selected');
            selectedApp = app;
        });
        
        appsList.appendChild(appElement);
    });
}

function loadProcesses() {
    processesList.innerHTML = '';
    
    processes.forEach(proc => {
        const procElement = document.createElement('div');
        procElement.className = 'process-item';
        
        const cpuClass = parseInt(proc.cpu) > 20 ? 'high-cpu' : '';
        
        procElement.innerHTML = `
            <span>${proc.name}</span>
            <span>${proc.pid}</span>
            <span class="${cpuClass}">${proc.cpu}%</span>
            <span>${proc.memory}</span>
            <span>${proc.threads}</span>
        `;
        
        procElement.addEventListener('click', () => {
            document.querySelectorAll('.process-item').forEach(el => {
                el.classList.remove('selected');
            });
            procElement.classList.add('selected');
            selectedProcess = proc;
        });
        
        processesList.appendChild(procElement);
    });
}

function updatePerformance() {
    // Simula variações realistas
    const cpu = Math.floor(Math.random() * 60) + 10;
    const mem = Math.floor(Math.random() * 50) + 30;
    const memUsed = (mem / 100 * 16).toFixed(1);
    const memFreeVal = (16 - memUsed).toFixed(1);
    
    // Update CPU
    cpuBar.style.width = cpu + '%';
    cpuValue.textContent = cpu + '%';
    statusCPU.textContent = cpu + '%';
    
    // CPU history
    cpuHistoryArray.shift();
    cpuHistoryArray.push(Math.floor(cpu / 10));
    cpuHistory.textContent = cpuHistoryArray.map(v => '█'.repeat(v) + '░'.repeat(10-v)).join('');
    
    // Update Memory
    memBar.style.width = mem + '%';
    memValue.textContent = mem + '%';
    memInfo.textContent = `${memUsed} MB / 16 MB`;
    statusMem.textContent = `${memUsed} MB / 16 MB`;
    memFree.textContent = memFreeVal + ' MB';
    
    // Update processes count
    const procCount = processes.length + Math.floor(Math.random() * 3);
    statusProcesses.textContent = procCount;
    processCount.textContent = procCount;
    
    // Update uptime
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    uptime.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

tabApps.addEventListener('click', () => {
    tabApps.classList.add('active');
    tabProcesses.classList.remove('active');
    tabPerformance.classList.remove('active');
    
    appsContent.classList.remove('hidden');
    processesContent.classList.add('hidden');
    performanceContent.classList.add('hidden');
});

tabProcesses.addEventListener('click', () => {
    tabProcesses.classList.add('active');
    tabApps.classList.remove('active');
    tabPerformance.classList.remove('active');
    
    processesContent.classList.remove('hidden');
    appsContent.classList.add('hidden');
    performanceContent.classList.add('hidden');
});

tabPerformance.addEventListener('click', () => {
    tabPerformance.classList.add('active');
    tabApps.classList.remove('active');
    tabProcesses.classList.remove('active');
    
    performanceContent.classList.remove('hidden');
    appsContent.classList.add('hidden');
    processesContent.classList.add('hidden');
});

endTaskBtn.addEventListener('click', () => {
    if (selectedApp) {
        if (selectedApp.name === 'Arcade') {
            showError(`O aplicativo '${selectedApp.name}' não está respondendo.\nDeseja enviar relatório de erro?`);
        } else {
            showError(`Erro ao finalizar tarefa '${selectedApp.name}'.\nAcesso negado.`);
        }
    } else {
        showError('Selecione uma tarefa primeiro.');
    }
});

endProcessBtn.addEventListener('click', () => {
    if (selectedProcess) {
        if (selectedProcess.name.includes('SYSTEM') || selectedProcess.name.includes('KERNEL')) {
            showError(`Não é possível finalizar o processo '${selectedProcess.name}'.\nProcesso crítico do sistema.`);
        } else {
            showError(`Erro ao finalizar processo '${selectedProcess.name}'.\nProcesso em uso por outro programa.`);
        }
    } else {
        showError('Selecione um processo primeiro.');
    }
});

switchToBtn.addEventListener('click', () => {
    if (selectedApp) {
        showError(`Não foi possível alternar para '${selectedApp.name}'.\nJanela não responde.`);
    } else {
        showError('Selecione uma tarefa primeiro.');
    }
});

newTaskBtn.addEventListener('click', () => {
    newTaskModal.classList.remove('hidden');
    taskInput.value = '';
    taskInput.focus();
});

priorityBtn.addEventListener('click', () => {
    if (selectedProcess) {
        priorityProcess.textContent = `Processo: ${selectedProcess.name}`;
        priorityModal.classList.remove('hidden');
    } else {
        showError('Selecione um processo primeiro.');
    }
});

taskOk.addEventListener('click', () => {
    const task = taskInput.value.trim();
    if (task) {
        showError(`Não foi possível encontrar '${task}'.\nVerifique o nome e tente novamente.`);
    } else {
        showError('Digite um nome de programa.');
    }
    newTaskModal.classList.add('hidden');
});

taskCancel.addEventListener('click', () => {
    newTaskModal.classList.add('hidden');
});

priorityOk.addEventListener('click', () => {
    const selected = document.querySelector('input[name="priority"]:checked');
    if (selected && selectedProcess) {
        showError(`Não foi possível alterar a prioridade de '${selectedProcess.name}'.\nAcesso negado.`);
    }
    priorityModal.classList.add('hidden');
});

priorityCancel.addEventListener('click', () => {
    priorityModal.classList.add('hidden');
});

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const menu = item.dataset.menu;
        if (menu === 'help') {
            showError('A ajuda do Gerenciador de Tarefas não está disponível.');
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
        newTaskModal.classList.add('hidden');
        priorityModal.classList.add('hidden');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadApps();
    loadProcesses();
    updatePerformance();
    
    // Atualiza desempenho a cada 2 segundos
    setInterval(updatePerformance, 2000);
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