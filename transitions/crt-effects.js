// ===== EFEITOS CRT =====

class CRTEffects {
    constructor() {
        this.intervals = [];
    }
    
    start() {
        // Estática periódica
        this.intervals.push(setInterval(() => {
            if (Math.random() > 0.7) {
                this.addStatic();
            }
        }, 5000));
        
        // Glitch periódico
        this.intervals.push(setInterval(() => {
            if (Math.random() > 0.8) {
                this.addGlitch();
            }
        }, 8000));
    }
    
    stop() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }
    
    addStatic() {
        const static_ = document.createElement('div');
        static_.className = 'crt-static-burst';
        document.body.appendChild(static_);
        setTimeout(() => static_.remove(), 200);
    }
    
    addGlitch() {
        const glitch = document.createElement('div');
        glitch.className = 'crt-glitch-burst';
        document.body.appendChild(glitch);
        setTimeout(() => glitch.remove(), 100);
    }
    
    addWave() {
        const wave = document.createElement('div');
        wave.className = 'crt-wave';
        document.body.appendChild(wave);
        setTimeout(() => wave.remove(), 1000);
    }
}

// Adiciona estilos dinâmicos
const style = document.createElement('style');
style.textContent = `
    .crt-static-burst {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.1);
        pointer-events: none;
        z-index: 9999;
        animation: staticBurst 0.1s infinite;
    }
    
    @keyframes staticBurst {
        0% { opacity: 0.1; transform: translate(0,0); }
        25% { opacity: 0.2; transform: translate(-5px,5px); }
        50% { opacity: 0.1; transform: translate(5px,-5px); }
        75% { opacity: 0.2; transform: translate(-5px,-5px); }
        100% { opacity: 0.1; transform: translate(0,0); }
    }
    
    .crt-glitch-burst {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, rgba(255,0,255,0.1), rgba(0,255,255,0.1));
        pointer-events: none;
        z-index: 9999;
        animation: glitchBurst 0.1s infinite;
    }
    
    @keyframes glitchBurst {
        0% { opacity: 0.2; filter: hue-rotate(0deg); }
        50% { opacity: 0.3; filter: hue-rotate(90deg); }
        100% { opacity: 0.2; filter: hue-rotate(0deg); }
    }
    
    .crt-wave {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 50% 50%, rgba(0,255,0,0.1), transparent 70%);
        pointer-events: none;
        z-index: 9999;
        animation: waveExpand 1s ease-out;
    }
    
    @keyframes waveExpand {
        0% { transform: scale(0); opacity: 0.5; }
        100% { transform: scale(2); opacity: 0; }
    }
`;
document.head.appendChild(style);

const crtEffects = new CRTEffects();