// ===== ANIMAÇÃO DE DESLIGAMENTO =====

class ShutdownAnimation {
    constructor() {
        this.shutdownTime = 3000;
    }
    
    startShutdown(onComplete) {
        if (window.crtEffects) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    window.crtEffects.addGlitch();
                    window.crtEffects.screenBlink();
                }, i * 200);
            }
        }
        
        const overlay = document.createElement('div');
        overlay.className = 'shutdown-overlay';
        
        const glitch = document.createElement('div');
        glitch.className = 'shutdown-glitch';
        overlay.appendChild(glitch);
        
        const text = document.createElement('div');
        text.className = 'shutdown-text';
        text.textContent = 'SYSTEM SHUTDOWN';
        overlay.appendChild(text);
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.remove();
            onComplete();
        }, this.shutdownTime);
    }
}

const shutdownAnimation = new ShutdownAnimation();

// Adiciona estilos
const style = document.createElement('style');
style.textContent = `
    .shutdown-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        z-index: 11000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: shutdownFade 3s forwards;
    }

    @keyframes shutdownFade {
        0% { opacity: 0; }
        20% { opacity: 0.3; filter: brightness(2); }
        40% { opacity: 0.6; filter: brightness(1.5); }
        60% { opacity: 0.8; filter: brightness(1); }
        80% { opacity: 0.9; filter: brightness(0.5); }
        100% { opacity: 1; filter: brightness(0); }
    }

    .shutdown-glitch {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
        animation: shutdownGlitch 0.3s infinite;
    }

    @keyframes shutdownGlitch {
        0%, 100% { transform: translateX(0); opacity: 0.3; }
        25% { transform: translateX(-20px); opacity: 0.5; }
        50% { transform: translateX(20px); opacity: 0.4; }
        75% { transform: translateX(-10px); opacity: 0.5; }
    }

    .shutdown-text {
        position: relative;
        color: #ffffff;
        font-size: 3rem;
        font-family: 'VT323', monospace;
        z-index: 10;
        text-transform: uppercase;
        animation: textShutdown 2s infinite;
    }

    @keyframes textShutdown {
        0%, 100% { opacity: 1; text-shadow: 0 0 10px #ffffff; }
        50% { opacity: 0.5; text-shadow: 0 0 30px #ffffff; }
    }
`;
document.head.appendChild(style);