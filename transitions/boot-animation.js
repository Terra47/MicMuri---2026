// ===== ANIMAÇÃO DE BOOT PERFEITA =====

class BootAnimation {
    constructor() {
        this.bootMessages = [
            "Iniciando Windows 95...",
            "Carregando configuração do sistema...",
            "Verificando memória... 16MB OK",
            "Inicializando dispositivos...",
            "Carregando driver de mouse... OK",
            "Carregando driver de teclado... OK",
            "Inicializando rede...",
            "Configurando Plug and Play...",
            "Carregando interface gráfica...",
            "Preparando área de trabalho..."
        ];
        
        this.dosCommands = [
            "MS-DOS Version 6.22",
            "Copyright (c) Microsoft Corp 1981-1994",
            "",
            "HIMEM.SYS is testing extended memory... done.",
            "EMM386.EXE successfully installed.",
            "",
            "Configuração do sistema:",
            "Processador: Intel 80486 DX2 66MHz",
            "Memória: 16MB RAM",
            "Disco rígido: 540MB",
            "",
            "Carregando drivers:",
            "MOUSE.SYS................................ [ OK ]",
            "SMARTDRV.EXE.............................. [ OK ]",
            "MSCDEX.EXE................................ [ OK ]",
            "DOSKEY.EXE................................ [ OK ]",
            "",
            "Verificando integridade do sistema...",
            "Verificando disco C: ........................... [ 540MB OK ]",
            "",
            "Inicializando rede...",
            "Protocolo TCP/IP configurado",
            "Endereço IP: 192.168.0.15",
            "Gateway: 192.168.0.1",
            "Conexão estabelecida",
            "",
            "Carregando Windows 3.11 for Workgroups...",
            "Carregando KERNEL.EXE",
            "Carregando USER.EXE",
            "Carregando GDI.EXE",
            "",
            "Windows 95 iniciado com sucesso."
        ];
        
        this.messageIndex = 0;
        this.dosIndex = 0;
    }
    
    startBoot(progressBar, messagesDiv, dosTerminal, dosContent, callback) {
        this.progressBar = progressBar;
        this.messagesDiv = messagesDiv;
        this.dosTerminal = dosTerminal;
        this.dosContent = dosContent;
        this.callback = callback;
        
        // Limpa o terminal
        this.dosContent.innerHTML = '';
        
        // Inicia a sequência de boot
        this.messageIndex = 0;
        this.dosIndex = 0;
        
        // Sequência de progresso (15 segundos)
        this.progressBar.style.animation = 'bootProgress 15s linear forwards';
        
        // Mensagens de boot (a cada 1.5s)
        this.messageInterval = setInterval(() => {
            if (this.messageIndex < this.bootMessages.length) {
                this.messagesDiv.querySelector('.boot-message').textContent = 
                    this.bootMessages[this.messageIndex];
                this.messageIndex++;
            } else {
                clearInterval(this.messageInterval);
            }
        }, 1500);
        
        // Terminal DOS aparece aos 4s e roda automático
        setTimeout(() => {
            this.dosTerminal.classList.remove('hidden');
            this.typeDOSLine();
        }, 4000);
    }
    
    typeDOSLine() {
        if (this.dosIndex < this.dosCommands.length) {
            const line = document.createElement('div');
            line.className = 'dos-line';
            
            // Formatação com cores
            if (this.dosCommands[this.dosIndex].includes('OK')) {
                line.style.color = '#00ff00';
                line.style.fontWeight = 'bold';
            } else if (this.dosCommands[this.dosIndex].includes('Configuração') || 
                       this.dosCommands[this.dosIndex].includes('Verificando')) {
                line.style.color = '#ffff00';
            } else if (this.dosCommands[this.dosIndex].includes('Windows')) {
                line.style.color = '#00ffff';
                line.style.fontWeight = 'bold';
            }
            
            line.textContent = this.dosCommands[this.dosIndex];
            this.dosContent.appendChild(line);
            
            // SCROLL AUTOMÁTICO FORÇADO
            this.dosTerminal.scrollTop = this.dosTerminal.scrollHeight;
            
            this.dosIndex++;
            
            // Velocidade da digitação
            setTimeout(() => this.typeDOSLine(), 100);
        } else {
            // Terminal completo, adiciona cursor
            const cursorLine = document.createElement('div');
            cursorLine.className = 'dos-line';
            cursorLine.style.color = '#00ff00';
            cursorLine.innerHTML = 'C:\\> <span class="dos-cursor"></span>';
            this.dosContent.appendChild(cursorLine);
            this.dosTerminal.scrollTop = this.dosTerminal.scrollHeight;
            
            // Aguarda o fim da barra de progresso (15s)
            const timeLeft = 15000 - (Date.now() - this.startTime);
            setTimeout(() => {
                this.callback();
            }, Math.max(1000, timeLeft));
        }
    }
}

const bootAnimation = new BootAnimation();