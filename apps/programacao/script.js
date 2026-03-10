let virusCanvas, virusCtx, matrixCanvas, matrixCtx, glitchCanvas, glitchCtx;
let virusCells = [];
let epidemicDots = [];
let dnaBases = [];
let alerts = [];
let corruptionInterval;
let epidemicInterval;

function init() {
    virusCanvas = document.getElementById('virusCanvas');
    virusCtx = virusCanvas.getContext('2d');
    matrixCanvas = document.getElementById('matrixCanvas');
    matrixCtx = matrixCanvas.getContext('2d');
    glitchCanvas = document.getElementById('glitchCanvas');
    glitchCtx = glitchCanvas.getContext('2d');
    
    resizeCanvases();
    createVirusGrid();
    createEpidemic();
    createDna();
    startMatrix();
    startCorruption();
    
    window.addEventListener('resize', resizeCanvases);
}

function resizeCanvases() {
    [virusCanvas, matrixCanvas, glitchCanvas].forEach(canvas => {
        if (canvas) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
    });
}

function createVirusGrid() {
    let grid = document.getElementById('virusGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    virusCells = [];
    
    for (let i = 0; i < 9; i++) {
        let cell = document.createElement('div');
        cell.className = 'virus-cell';
        cell.innerHTML = ['🦠', '🧬', '💻', '⚡', '🌀', '🔮', '🧪', '🔬', '🧫'][i];
        cell.dataset.index = i;
        
        cell.addEventListener('click', () => {
            cell.classList.toggle('infected');
            if (cell.classList.contains('infected')) {
                addAlert(`⚠️ VÍRUS ${cell.innerHTML} ATIVADO`);
                createVirusSpread(i);
                // Envia comando para o desktop com sequência de efeitos
                window.parent.postMessage({ type: 'VIRUS', name: 'MEMZ', stage: 'start' }, '*');
            } else {
                addAlert(`✅ VÍRUS ${cell.innerHTML} CONTIDO`);
            }
        });
        
        grid.appendChild(cell);
        virusCells.push(cell);
    }
}

function createVirusSpread(index) {
    let canvas = virusCanvas;
    let ctx = virusCtx;
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let particles = [];
    
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: x,
            y: y,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 2 + 1,
            life: 100
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#f00';
        particles.forEach(p => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.life--;
            
            ctx.globalAlpha = p.life / 100;
            ctx.fillRect(p.x, p.y, 3, 3);
        });
        
        particles = particles.filter(p => p.life > 0 && p.x > 0 && p.x < canvas.width && p.y > 0 && p.y < canvas.height);
        
        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#f00';
            ctx.font = '20px monospace';
            ctx.fillText('🦠 INFECTADO', 50, canvas.height / 2);
        }
    }
    
    animate();
}

function createEpidemic() {
    let container = document.getElementById('epidemic');
    if (!container) return;
    
    container.innerHTML = '';
    epidemicDots = [];
    
    for (let i = 0; i < 100; i++) {
        let dot = document.createElement('div');
        dot.className = 'epidemic-dot healthy';
        dot.style.left = Math.random() * 100 + '%';
        dot.style.top = Math.random() * 100 + '%';
        container.appendChild(dot);
        epidemicDots.push(dot);
    }
}

document.getElementById('infectBtn')?.addEventListener('click', () => {
    if (epidemicInterval) clearInterval(epidemicInterval);
    
    epidemicInterval = setInterval(() => {
        let sick = epidemicDots.filter(d => d.classList.contains('sick')).length;
        if (sick === 0) {
            epidemicDots[Math.floor(Math.random() * epidemicDots.length)].classList.add('sick');
        }
        
        epidemicDots.forEach(dot => {
            if (dot.classList.contains('sick')) {
                let near = epidemicDots.filter(d => {
                    let dx = parseFloat(d.style.left) - parseFloat(dot.style.left);
                    let dy = parseFloat(d.style.top) - parseFloat(dot.style.top);
                    return Math.sqrt(dx*dx + dy*dy) < 10 && !d.classList.contains('sick');
                });
                
                near.forEach(n => {
                    if (Math.random() > 0.7) {
                        n.classList.add('sick');
                        addAlert(`⚠️ NOVO CASO: ${Math.floor(Math.random() * 100)}`);
                    }
                });
            }
        });
        
        addAlert(`⚠️ CASOS: ${epidemicDots.filter(d => d.classList.contains('sick')).length}`);
    }, 500);
    
    window.parent.postMessage({ type: 'VIRUS', name: 'BLSTER', stage: 'start' }, '*');
});

document.getElementById('corruptBtn')?.addEventListener('click', () => {
    let corrupt = document.getElementById('corruption');
    if (!corrupt) return;
    
    let data = corrupt.innerHTML;
    let corrupted = '';
    
    for (let char of data) {
        if (Math.random() > 0.7) {
            corrupted += String.fromCharCode(char.charCodeAt(0) + Math.floor(Math.random() * 10));
        } else {
            corrupted += char;
        }
    }
    
    corrupt.innerHTML = corrupted;
    addAlert('⚠️ DADOS CORROMPIDOS');
    window.parent.postMessage({ type: 'VIRUS', name: 'CIH', stage: 'start' }, '*');
});

function createDna() {
    let helix = document.getElementById('dnaHelix');
    if (!helix) return;
    
    let bases = ['A', 'T', 'C', 'G'];
    dnaBases = [];
    
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 2; j++) {
            let base = document.createElement('div');
            base.className = `dna-base ${bases[Math.floor(Math.random() * bases.length)].toLowerCase()}`;
            base.textContent = bases[Math.floor(Math.random() * bases.length)];
            base.style.left = (j * 100 + 30) + 'px';
            base.style.top = (i * 30 + 20) + 'px';
            base.dataset.index = i;
            
            base.addEventListener('mouseenter', () => {
                if (Math.random() > 0.9) {
                    base.classList.remove(base.classList[1]);
                    base.classList.add(bases[Math.floor(Math.random() * bases.length)].toLowerCase());
                    base.textContent = bases[Math.floor(Math.random() * bases.length)];
                    addAlert('🧬 MUTAÇÃO ESPONTÂNEA');
                }
            });
            
            helix.appendChild(base);
            dnaBases.push(base);
        }
    }
    
    for (let i = 0; i < 20; i++) {
        let line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.width = '2px';
        line.style.height = '30px';
        line.style.background = '#0f0';
        line.style.left = '100px';
        line.style.top = (i * 30 + 35) + 'px';
        line.style.opacity = '0.3';
        helix.appendChild(line);
    }
}

document.getElementById('mutateDna')?.addEventListener('click', () => {
    dnaBases.forEach(base => {
        if (Math.random() > 0.7) {
            base.classList.remove(base.classList[1]);
            base.classList.add(['a','t','c','g'][Math.floor(Math.random() * 4)]);
            base.textContent = ['A','T','C','G'][Math.floor(Math.random() * 4)];
        }
    });
    addAlert('🧬 DNA MUTADO');
    window.parent.postMessage({ type: 'VIRUS', name: 'MELISSA', stage: 'start' }, '*');
});

document.getElementById('replicateDna')?.addEventListener('click', () => {
    let helix = document.getElementById('dnaHelix');
    if (!helix) return;
    
    let newBases = [];
    dnaBases.forEach(base => {
        let clone = base.cloneNode(true);
        clone.style.left = (parseFloat(base.style.left) + 200) + 'px';
        helix.appendChild(clone);
        newBases.push(clone);
    });
    dnaBases = [...dnaBases, ...newBases];
    addAlert('🧬 DNA REPLICADO');
    window.parent.postMessage({ type: 'VIRUS', name: 'ILOVEYOU', stage: 'start' }, '*');
});

document.getElementById('corruptDna')?.addEventListener('click', () => {
    dnaBases.forEach(base => {
        if (Math.random() > 0.5) {
            base.style.transform = `rotate(${Math.random() * 360}deg)`;
            base.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        }
    });
    addAlert('⚠️ DNA CORROMPIDO');
    window.parent.postMessage({ type: 'VIRUS', name: 'CHERNOBYL', stage: 'start' }, '*');
});

function startMatrix() {
    if (!matrixCanvas || !matrixCtx) return;
    
    let chars = '0101010101010101'.split('');
    let drops = [];
    
    for (let i = 0; i < 50; i++) {
        drops.push({
            x: Math.random() * matrixCanvas.width,
            y: Math.random() * matrixCanvas.height,
            speed: Math.random() * 3 + 1,
            chars: chars
        });
    }
    
    function animate() {
        if (!matrixCtx || !matrixCanvas) return;
        
        matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        matrixCtx.fillStyle = '#0f0';
        matrixCtx.font = '12px monospace';
        
        drops.forEach(drop => {
            drop.y += drop.speed;
            if (drop.y > matrixCanvas.height) {
                drop.y = 0;
                drop.x = Math.random() * matrixCanvas.width;
            }
            
            for (let i = 0; i < 10; i++) {
                matrixCtx.fillText(chars[Math.floor(Math.random() * chars.length)], drop.x, drop.y - i * 15);
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

document.getElementById('glitchMatrix')?.addEventListener('click', () => {
    if (!matrixCanvas) return;
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            matrixCanvas.style.filter = `hue-rotate(${Math.random() * 360}deg) invert(${Math.random()})`;
        }, i * 100);
    }
    addAlert('⚡ MATRIX GLITCH');
    window.parent.postMessage({ type: 'VIRUS', name: 'GLITCH', stage: 'start' }, '*');
});

document.getElementById('crashMatrix')?.addEventListener('click', () => {
    if (!matrixCanvas) return;
    
    matrixCanvas.style.display = 'none';
    setTimeout(() => {
        matrixCanvas.style.display = 'block';
        matrixCanvas.style.filter = 'none';
    }, 2000);
    addAlert('💥 MATRIX CRASH');
    window.parent.postMessage({ type: 'VIRUS', name: 'BLUE_SCREEN', stage: 'start' }, '*');
});

document.getElementById('glitchImage')?.addEventListener('click', () => {
    if (!glitchCtx || !glitchCanvas) return;
    
    glitchCtx.fillStyle = '#000';
    glitchCtx.fillRect(0, 0, glitchCanvas.width, glitchCanvas.height);
    
    for (let i = 0; i < 100; i++) {
        glitchCtx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
        glitchCtx.fillRect(
            Math.random() * glitchCanvas.width,
            Math.random() * glitchCanvas.height,
            Math.random() * 50 + 10,
            Math.random() * 50 + 10
        );
    }
    addAlert('⚡ IMAGEM GLITCHADA');
    window.parent.postMessage({ type: 'VIRUS', name: 'CORRUPT', stage: 'start' }, '*');
});

document.getElementById('corruptPixels')?.addEventListener('click', () => {
    if (!glitchCtx || !glitchCanvas) return;
    
    let imgData = glitchCtx.getImageData(0, 0, glitchCanvas.width, glitchCanvas.height);
    
    for (let i = 0; i < imgData.data.length; i += 4) {
        if (Math.random() > 0.9) {
            imgData.data[i] = Math.random() * 255;
            imgData.data[i+1] = Math.random() * 255;
            imgData.data[i+2] = Math.random() * 255;
        }
    }
    
    glitchCtx.putImageData(imgData, 0, 0);
    addAlert('⚠️ PIXELS CORROMPIDOS');
    window.parent.postMessage({ type: 'VIRUS', name: 'PIXEL', stage: 'start' }, '*');
});

document.getElementById('destroyImage')?.addEventListener('click', () => {
    if (!glitchCtx || !glitchCanvas) return;
    
    let intensity = 0;
    let interval = setInterval(() => {
        intensity += 10;
        glitchCtx.fillStyle = `rgba(255, 0, 0, ${intensity/100})`;
        glitchCtx.fillRect(0, 0, glitchCanvas.width, glitchCanvas.height);
        
        if (intensity >= 100) {
            clearInterval(interval);
            glitchCtx.fillStyle = '#f00';
            glitchCtx.fillRect(0, 0, glitchCanvas.width, glitchCanvas.height);
            addAlert('💥 IMAGEM DESTRUÍDA');
        }
    }, 100);
    window.parent.postMessage({ type: 'VIRUS', name: 'DESTROY', stage: 'start' }, '*');
});

function startCorruption() {
    let corrupt = document.getElementById('corruption');
    if (!corrupt) return;
    
    let data = '01010101010101010101010101010101';
    corrupt.innerHTML = data;
    
    corruptionInterval = setInterval(() => {
        let pos = Math.floor(Math.random() * data.length);
        data = data.substring(0, pos) + (Math.random() > 0.5 ? '1' : '0') + data.substring(pos + 1);
        corrupt.innerHTML = data;
    }, 100);
}

document.querySelectorAll('.experiment-item').forEach(item => {
    item.addEventListener('click', () => {
        let exp = item.dataset.exp;
        let messages = {
            worm: '🪱 WORM: AUTO-REPLICAÇÃO INICIADA',
            trojan: '🐴 TROJAN: ACESSO REMOTO CONCEDIDO',
            ransomware: '💰 RANSOMWARE: ARQUIVOS CRIPTOGRAFADOS',
            bootkit: '💾 BOOTKIT: MBR MODIFICADO',
            rootkit: '🌲 ROOTKIT: ACESSO ROOT OBTIDO',
            keylogger: '⌨️ KEYLOGGER: TECLAS SENDO REGISTRADAS'
        };
        
        addAlert(`⚠️ ${messages[exp]}`);
        
        let virusMap = {
            worm: 'WORM',
            trojan: 'TROJAN',
            ransomware: 'RANSOM',
            bootkit: 'BOOTKIT',
            rootkit: 'ROOTKIT',
            keylogger: 'KEYLOGGER'
        };
        window.parent.postMessage({ type: 'VIRUS', name: virusMap[exp], stage: 'start' }, '*');
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                addAlert(`⚠️ ${messages[exp].substring(0, 20)}... ${Math.floor(Math.random() * 100)}%`);
            }, i * 300);
        }
    });
});

function addAlert(message) {
    let alertsDiv = document.getElementById('alerts');
    if (!alertsDiv) return;
    
    let alert = document.createElement('div');
    alert.className = 'alert-item';
    alert.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    alertsDiv.appendChild(alert);
    alertsDiv.scrollTop = alertsDiv.scrollHeight;
    
    if (alertsDiv.children.length > 10) {
        alertsDiv.removeChild(alertsDiv.children[0]);
    }
}

function startMutationGraph() {
    let graph = document.getElementById('mutationGraph');
    if (!graph) return;
    
    setInterval(() => {
        graph.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            let bar = document.createElement('div');
            bar.style.position = 'absolute';
            bar.style.bottom = '0';
            bar.style.left = (i * 5) + '%';
            bar.style.width = '4%';
            bar.style.height = (Math.random() * 100) + '%';
            bar.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            graph.appendChild(bar);
        }
    }, 500);
}

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));
        let viewId = tab.dataset.view + 'View';
        document.getElementById(viewId)?.classList.add('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    init();
    startMutationGraph();
    
    setInterval(() => {
        addAlert(`🧬 MUTAÇÃO ${Math.floor(Math.random() * 100)} DETECTADA`);
    }, 5000);
});