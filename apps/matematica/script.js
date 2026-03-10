let scene, camera, renderer;
let objects = [];
let currentDimension = '3d';
let currentFractal = 'julia';
let animationId;

const threeCanvas = document.getElementById('threeCanvas');
const infoPanel = document.getElementById('infoPanel');
const infoTitle = document.getElementById('infoTitle');
const infoContent = document.getElementById('infoContent');
const infoClose = document.getElementById('infoClose');

if (typeof THREE === 'undefined') {
    console.error('Three.js não carregado!');
    showError('Erro ao carregar bibliotecas 3D. Recarregue a página.');
}

function initThree() {
    if (!threeCanvas) return;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    const width = threeCanvas.clientWidth || 800;
    const height = threeCanvas.clientHeight || 600;
    
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(5, 3, 10);
    camera.lookAt(0, 0, 0);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    threeCanvas.innerHTML = ''; 
    threeCanvas.appendChild(renderer.domElement);
    

    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00ffff, 1.5, 30);
    pointLight1.position.set(3, 3, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00ff, 1.5, 30);
    pointLight2.position.set(-3, -2, 5);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0xffff00, 1, 30);
    pointLight3.position.set(0, 4, 2);
    scene.add(pointLight3);
    

    createStars();
    

    createJulia3D();
    
    animate();
}

function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 1500;
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i += 3) {

        const r = 50 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        starsPositions[i] = r * Math.sin(phi) * Math.cos(theta);
        starsPositions[i+1] = r * Math.sin(phi) * Math.sin(theta);
        starsPositions[i+2] = r * Math.cos(phi);

        const color = new THREE.Color().setHSL(Math.random(), 0.5, 0.5);
        starsColors[i] = color.r;
        starsColors[i+1] = color.g;
        starsColors[i+2] = color.b;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
    
    const starsMaterial = new THREE.PointsMaterial({ 
        size: 0.2, 
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function createMandelbrot3D() {
    clearObjects();
    
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    for (let i = 0; i < 20000; i++) {
        const x = (Math.random() - 0.5) * 6;
        const y = (Math.random() - 0.5) * 6;
        let zx = 0, zy = 0;
        let iteration = 0;
        const maxIterations = 100;
        
        while (zx*zx + zy*zy < 4 && iteration < maxIterations) {
            const xtemp = zx*zx - zy*zy + x;
            zy = 2*zx*zy + y;
            zx = xtemp;
            iteration++;
        }
        
        if (iteration < maxIterations) {
            const z = Math.sin(iteration * 0.2) * 3;
            vertices.push(x, y, z);
            
            const hue = (iteration / maxIterations) * 360;
            const color = new THREE.Color(`hsl(${hue}, 100%, 60%)`);
            colors.push(color.r, color.g, color.b);
        }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({ 
        size: 0.15, 
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    objects.push(points);
}

function createJulia3D() {
    clearObjects();
    
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    const c = new THREE.Vector2(-0.7269, 0.1889);
    
    for (let i = 0; i < 20000; i++) {
        const x = (Math.random() - 0.5) * 5;
        const y = (Math.random() - 0.5) * 5;
        let zx = x, zy = y;
        let iteration = 0;
        const maxIterations = 50;
        
        while (zx*zx + zy*zy < 4 && iteration < maxIterations) {
            const xtemp = zx*zx - zy*zy + c.x;
            zy = 2*zx*zy + c.y;
            zx = xtemp;
            iteration++;
        }
        
        const z = Math.sin(iteration * 0.3) * 2.5;
        vertices.push(x, y, z);
        
        const hue = (iteration / maxIterations) * 360;
        const color = new THREE.Color(`hsl(${hue}, 100%, 60%)`);
        colors.push(color.r, color.g, color.b);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({ 
        size: 0.15, 
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    objects.push(points);
}

function createSierpinski() {
    clearObjects();
    
    function addTetrahedron(p1, p2, p3, p4, depth) {
        if (depth === 0) {
            const geometry = new THREE.TetrahedronGeometry(0.4);
            const color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: 0x222222,
                shininess: 30,
                transparent: true,
                opacity: 0.8
            });
            const tetra = new THREE.Mesh(geometry, material);
            
            tetra.position.set(
                (p1.x + p2.x + p3.x + p4.x) / 4,
                (p1.y + p2.y + p3.y + p4.y) / 4,
                (p1.z + p2.z + p3.z + p4.z) / 4
            );
            
            scene.add(tetra);
            objects.push(tetra);
            return;
        }
        
        const mid12 = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const mid13 = new THREE.Vector3().addVectors(p1, p3).multiplyScalar(0.5);
        const mid14 = new THREE.Vector3().addVectors(p1, p4).multiplyScalar(0.5);
        const mid23 = new THREE.Vector3().addVectors(p2, p3).multiplyScalar(0.5);
        const mid24 = new THREE.Vector3().addVectors(p2, p4).multiplyScalar(0.5);
        const mid34 = new THREE.Vector3().addVectors(p3, p4).multiplyScalar(0.5);
        
        addTetrahedron(p1, mid12, mid13, mid14, depth - 1);
        addTetrahedron(p2, mid12, mid23, mid24, depth - 1);
        addTetrahedron(p3, mid13, mid23, mid34, depth - 1);
        addTetrahedron(p4, mid14, mid24, mid34, depth - 1);
    }
    
    const p1 = new THREE.Vector3(0, 2, 0);
    const p2 = new THREE.Vector3(-1.732, -1, 1);
    const p3 = new THREE.Vector3(1.732, -1, 1);
    const p4 = new THREE.Vector3(0, -1, -2);
    
    addTetrahedron(p1, p2, p3, p4, 3);
}

function createDragonCurve() {
    clearObjects();
    
    const points = [];
    let x = 0, y = 0, z = 0;
    let direction = 0;
    const directions = [
        [1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, -1, 0],
        [0, 0, 1], [0, 0, -1]
    ];
    
    function dragon(n, dir) {
        if (n === 0) {
            points.push(new THREE.Vector3(x, y, z));
            x += directions[dir][0];
            y += directions[dir][1];
            z += directions[dir][2];
            points.push(new THREE.Vector3(x, y, z));
        } else {
            dragon(n - 1, (dir + 1) % 6);
            dragon(n - 1, dir);
            dragon(n - 1, (dir + 5) % 6);
        }
    }
    
    dragon(7, 0);
    
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    points.forEach(p => vertices.push(p.x, p.y, p.z));
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const colors = [];
    for (let i = 0; i < points.length - 1; i++) {
        const color = new THREE.Color().setHSL(i / points.length, 1, 0.5);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
    }
    
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 2 });
    const line = new THREE.LineSegments(geometry, material);
    scene.add(line);
    objects.push(line);
}

function createKoch() {
    clearObjects();
    
    function kochLine(p1, p2, depth) {
        if (depth === 0) {
            const geometry = new THREE.BufferGeometry();
            const vertices = [p1.x, p1.y, p1.z, p2.x, p2.y, p2.z];
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            
            const color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
            const colors = [color.r, color.g, color.b, color.r, color.g, color.b];
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            
            const material = new THREE.LineBasicMaterial({ vertexColors: true });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            objects.push(line);
            return;
        }
        
        const v = new THREE.Vector3().subVectors(p2, p1);
        const length = v.length();
        v.normalize();
        
        const pA = new THREE.Vector3().copy(p1).addScaledVector(v, length / 3);
        const pB = new THREE.Vector3().copy(p1).addScaledVector(v, 2 * length / 3);

        const perp = new THREE.Vector3(-v.y, v.x, v.z * 0.5);
        perp.normalize();
        const pMid = new THREE.Vector3().copy(pA).addScaledVector(v, length / 6).addScaledVector(perp, length * 0.2887);
        
        kochLine(p1, pA, depth - 1);
        kochLine(pA, pMid, depth - 1);
        kochLine(pMid, pB, depth - 1);
        kochLine(pB, p2, depth - 1);
    }
    
    const size = 3;
    const points = [
        new THREE.Vector3(size, 0, 0),
        new THREE.Vector3(-size/2, size * 0.866, 0),
        new THREE.Vector3(-size/2, -size * 0.866, 0)
    ];
    
    kochLine(points[0], points[1], 3);
    kochLine(points[1], points[2], 3);
    kochLine(points[2], points[0], 3);
}

function createFractalTree() {
    clearObjects();
    
    function drawBranch(pos, dir, length, thickness, depth) {
        if (depth === 0) return;
        
        const end = new THREE.Vector3().copy(pos).addScaledVector(dir, length);
        
        const geometry = new THREE.BufferGeometry();
        const vertices = [pos.x, pos.y, pos.z, end.x, end.y, end.z];
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        const color = new THREE.Color().setHSL(0.1 + depth * 0.1, 1, 0.5);
        const colors = [color.r, color.g, color.b, color.r, color.g, color.b];
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: thickness });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        objects.push(line);
        
        const newDir1 = new THREE.Vector3().copy(dir);
        newDir1.applyEuler(new THREE.Euler(0.3, 0.3, 0));
        
        const newDir2 = new THREE.Vector3().copy(dir);
        newDir2.applyEuler(new THREE.Euler(-0.3, -0.3, 0));
        
        drawBranch(end, newDir1, length * 0.7, thickness * 0.7, depth - 1);
        drawBranch(end, newDir2, length * 0.7, thickness * 0.7, depth - 1);
    }
    
    const start = new THREE.Vector3(0, -2, 0);
    const dir = new THREE.Vector3(0, 1, 0);
    drawBranch(start, dir, 1.5, 5, 8);
}

function createTesseract() {
    clearObjects();
    
    const points = [];
    for (let i = 0; i < 16; i++) {
        const x = (i & 1) ? 1.5 : -1.5;
        const y = (i & 2) ? 1.5 : -1.5;
        const z = (i & 4) ? 1.5 : -1.5;
        const w = (i & 8) ? 1.5 : -1.5;
        

        const angle = Date.now() * 0.001;
        const w1 = w * Math.cos(angle) - x * Math.sin(angle);
        const x1 = w * Math.sin(angle) + x * Math.cos(angle);
        

        const distance = 4;
        const scale = distance / (distance + w1 * 0.3);
        points.push(new THREE.Vector3(x1 * scale, y * scale, z * scale));
    }
    
    const edges = [];
    for (let i = 0; i < 16; i++) {
        for (let j = i + 1; j < 16; j++) {

            const diff = i ^ j;
            if (diff === 1 || diff === 2 || diff === 4 || diff === 8) {
                edges.push([i, j]);
            }
        }
    }

    const lineGeometry = new THREE.BufferGeometry();
    const lineVertices = [];
    edges.forEach(edge => {
        lineVertices.push(points[edge[0]].x, points[edge[0]].y, points[edge[0]].z);
        lineVertices.push(points[edge[1]].x, points[edge[1]].y, points[edge[1]].z);
    });
    
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
    
    const lineColors = [];
    for (let i = 0; i < edges.length * 2; i++) {
        const color = new THREE.Color().setHSL(i / edges.length, 1, 0.5);
        lineColors.push(color.r, color.g, color.b);
    }
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, linewidth: 1 });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
    objects.push(lines);

    const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    points.forEach((p, i) => {
        const color = new THREE.Color().setHSL(i / 16, 1, 0.6);
        const sphereMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            emissive: 0x222222,
            shininess: 50
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(p);
        scene.add(sphere);
        objects.push(sphere);
    });
}

function clearObjects() {
    objects.forEach(obj => {
        if (obj.parent) scene.remove(obj);
    });
    objects = [];
}

function animate() {
    if (!scene || !camera || !renderer) return;
    
    animationId = requestAnimationFrame(animate);
    
    objects.forEach(obj => {
        if (currentDimension === '4d' || currentDimension === '5d') {
            obj.rotation.y += 0.002;
            obj.rotation.x += 0.001;
        } else {
            obj.rotation.y += 0.001;
            obj.rotation.x += 0.0005;
        }
    });
    
    renderer.render(scene, camera);
}

const constants = {
    pi: {
        title: 'π (Pi)',
        value: '3.14159265358979323846...',
        desc: 'A razão entre a circunferência de um círculo e seu diâmetro. ' +
              'É uma constante irracional e transcendental que aparece em ' +
              'inúmeras fórmulas da matemática, física e engenharia.',
        funFact: 'O recorde de memorização de dígitos de π é de 70.000 dígitos!'
    },
    e: {
        title: 'e (Número de Euler)',
        value: '2.71828182845904523536...',
        desc: 'Base dos logaritmos naturais. Aparece em crescimento exponencial, ' +
              'juros compostos, probabilidade e muitas outras áreas.',
        funFact: 'e é às vezes chamado de "número de Euler" em homenagem ao matemático suíço Leonhard Euler.'
    },
    phi: {
        title: 'φ (Número de Ouro)',
        value: '1.61803398874989484820...',
        desc: 'A proporção áurea, encontrada na arte, arquitetura e natureza. ' +
              'Dois números estão em proporção áurea se a razão entre a soma ' +
              'e o maior é igual à razão entre o maior e o menor.',
        funFact: 'O Parthenon na Grécia foi construído usando a proporção áurea.'
    },
    i: {
        title: 'i (Unidade Imaginária)',
        value: '√-1',
        desc: 'A unidade imaginária, definida como a raiz quadrada de -1. ' +
              'É a base dos números complexos e fundamental para a engenharia elétrica.',
        funFact: 'i² = -1, i³ = -i, i⁴ = 1. Este ciclo de 4 é usado em várias aplicações.'
    },
    tau: {
        title: 'τ (Tau)',
        value: '6.283185307179586...',
        desc: 'Tau é definido como 2π, a razão entre a circunferência e o raio. ' +
              'Muitos matemáticos argumentam que τ é mais natural que π.',
        funFact: 'τ radianos = uma volta completa no círculo (360°).'
    }
};

const theories = {
    goldbach: {
        title: 'Conjectura de Goldbach',
        desc: 'Todo número par maior que 2 pode ser escrito como a soma de dois números primos.',
        example: 'Exemplos: 4 = 2+2, 6 = 3+3, 8 = 3+5, 10 = 3+7 = 5+5',
        status: 'Não provada (desde 1742)'
    },
    riemann: {
        title: 'Hipótese de Riemann',
        desc: 'Todos os zeros não triviais da função zeta de Riemann têm parte real igual a 1/2.',
        example: 'Relação com a distribuição dos números primos',
        status: 'Um dos Problemas do Milênio (não resolvido)'
    },
    twin: {
        title: 'Primos Gêmeos',
        desc: 'Pares de números primos que diferem por 2.',
        example: '(3,5), (5,7), (11,13), (17,19), (41,43)',
        status: 'Conjectura dos primos gêmeos (infinitos? não provado)'
    },
    perfect: {
        title: 'Números Perfeitos',
        desc: 'Números iguais à soma de seus divisores próprios (excluindo ele mesmo).',
        example: '6 = 1+2+3, 28 = 1+2+4+7+14, 496, 8128',
        status: 'Relação com primos de Mersenne: 2^(p-1) × (2^p - 1)'
    }
};

function showConstantInfo(constant) {
    const info = constants[constant];
    if (!info) return;
    
    infoTitle.textContent = `🌀 ${info.title}`;
    infoContent.innerHTML = `
        <p><strong>Valor:</strong> <span style="color: #00ffff;">${info.value}</span></p>
        <p>${info.desc}</p>
        <p><strong>✨ Curiosidade:</strong> ${info.funFact}</p>
        <p style="color: #ff00ff; margin-top: 15px;">Clique em outros elementos para descobrir mais!</p>
    `;
    infoPanel.classList.add('visible');
    createParticles(20);
}

function showTheoryInfo(theory) {
    const info = theories[theory];
    if (!info) return;
    
    infoTitle.textContent = `🌀 ${info.title}`;
    infoContent.innerHTML = `
        <p><strong>${info.desc}</strong></p>
        <p><span style="color: #00ffff;">Exemplo:</span> ${info.example}</p>
        <p><span style="color: #ff00ff;">Status:</span> ${info.status}</p>
        <p style="color: #00ffff; margin-top: 15px;">🔍 Clique para explorar mais!</p>
    `;
    infoPanel.classList.add('visible');
    createParticles(15);
}

function createParticles(count = 10) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = particle.style.height = (Math.random() * 20 + 10) + 'px';
        particle.style.background = `radial-gradient(circle, hsl(${Math.random()*360}, 100%, 50%), transparent)`;
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) particle.remove();
        }, 2000);
    }
}

function showError(message) {
    const errorModal = document.createElement('div');
    errorModal.className = 'error-modal';
    errorModal.innerHTML = `
        <div class="error-title">Erro</div>
        <div class="error-content">
            <span class="error-icon">❌</span>
            <span class="error-message">${message}</span>
        </div>
        <button class="error-close">✕</button>
    `;
    document.body.appendChild(errorModal);
    
    errorModal.querySelector('.error-close').addEventListener('click', () => {
        errorModal.remove();
    });
    
    setTimeout(() => errorModal.remove(), 3000);
}

function generatePrimes() {
    const container = document.getElementById('primeSpiral');
    if (!container) return;
    
    container.innerHTML = '';
    
    const primes = [];
    for (let i = 2; i <= 200; i++) {
        let isPrime = true;
        for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) primes.push(i);
    }
    
    primes.forEach((prime, index) => {
        const angle = index * 2.39996; 
        const radius = 5 + index * 0.8;
        const x = 100 + Math.cos(angle) * radius * 5;
        const y = 100 + Math.sin(angle) * radius * 5;
        
        const el = document.createElement('div');
        el.className = 'prime-number prime';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.textContent = prime;
        
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            infoTitle.textContent = `🌀 Número Primo: ${prime}`;

            const isTwin = primes.includes(prime-2) || primes.includes(prime+2);
            const isCousin = primes.includes(prime-4) || primes.includes(prime+4);
            const isSexy = primes.includes(prime-6) || primes.includes(prime+6);
            
            infoContent.innerHTML = `
                <p><strong style="color: #ff00ff; font-size: 18px;">${prime}</strong> é um número primo!</p>
                <p>Números primos são maiores que 1 e só podem ser divididos por 1 e por eles mesmos.</p>
                <p><strong>Propriedades:</strong></p>
                <ul style="margin-left: 20px;">
                    <li>${isTwin ? '✅ É primo gêmeo' : '❌ Não é primo gêmeo'}</li>
                    <li>${isCousin ? '✅ É primo primo' : '❌ Não é primo primo'}</li>
                    <li>${isSexy ? '✅ É primo sexy' : '❌ Não é primo sexy'}</li>
                </ul>
                <p><strong>Posição:</strong> ${index+1}º primo</p>
                <p style="color: #00ffff;">${prime % 4 === 1 ? '✨ Pode ser escrito como soma de dois quadrados!' : '⚡ Não pode ser escrito como soma de dois quadrados.'}</p>
            `;
            infoPanel.classList.add('visible');
            createParticles(10);
        });
        
        container.appendChild(el);
    });
}

function generateFibonacci() {
    const container = document.getElementById('fibonacciNumbers');
    const spiralContainer = document.getElementById('fibonacciSpiral');
    if (!container || !spiralContainer) return;
    
    container.innerHTML = '';
    spiralContainer.innerHTML = '';
    
    let a = 0, b = 1;
    const fibNumbers = [];
    for (let i = 0; i < 20; i++) {
        fibNumbers.push(a);
        const temp = a + b;
        a = b;
        b = temp;
    }
    
    fibNumbers.forEach((num, index) => {
        const el = document.createElement('span');
        el.className = 'fibonacci-number';
        el.textContent = num;
        
        el.addEventListener('click', () => {
            infoTitle.textContent = `🌀 Número de Fibonacci: F${index} = ${num}`;
            
            const ratio = index > 0 ? (num / fibNumbers[index-1]).toFixed(6) : '---';
            
            infoContent.innerHTML = `
                <p><strong style="color: #00ffff;">F${index} = ${num}</strong></p>
                <p>A sequência de Fibonacci começa com 0 e 1, e cada número é a soma dos dois anteriores.</p>
                <p><strong>Fórmula:</strong> F${index} = F${index-1} + F${index-2}</p>
                <p><strong>Razão áurea (φ):</strong> ${ratio} ${index > 5 ? '(próximo de 1.618)' : ''}</p>
                <p><strong>Na natureza:</strong> Aparece em conchas, flores, galáxias e no corpo humano!</p>
            `;
            infoPanel.classList.add('visible');
            createParticles(8);
        });
        
        container.appendChild(el);
    });
    
    a = 0, b = 1;
    let x = 60, y = 60;
    let direction = 0;
    
    for (let i = 0; i < 10; i++) {
        const size = b * 3;
        const rect = document.createElement('div');
        rect.style.position = 'absolute';
        rect.style.border = '2px solid #00ffff';
        rect.style.boxShadow = '0 0 10px cyan';
        
        switch(direction % 4) {
            case 0: 
                rect.style.left = x + 'px';
                rect.style.top = y - size + 'px';
                rect.style.width = size + 'px';
                rect.style.height = size + 'px';
                x += size;
                break;
            case 1: 
                rect.style.left = x - size + 'px';
                rect.style.top = y - size + 'px';
                rect.style.width = size + 'px';
                rect.style.height = size + 'px';
                y -= size;
                break;
            case 2: 
                rect.style.left = x - size + 'px';
                rect.style.top = y + 'px';
                rect.style.width = size + 'px';
                rect.style.height = size + 'px';
                x -= size;
                break;
            case 3: 
                rect.style.left = x + 'px';
                rect.style.top = y + 'px';
                rect.style.width = size + 'px';
                rect.style.height = size + 'px';
                y += size;
                break;
        }
        

        const arc = document.createElement('div');
        arc.style.position = 'absolute';
        arc.style.border = '2px solid #ff00ff';
        arc.style.borderRadius = '50%';
        arc.style.boxShadow = '0 0 15px magenta';
        
        switch(direction % 4) {
            case 0:
                arc.style.left = (x - size) + 'px';
                arc.style.top = (y - size) + 'px';
                arc.style.width = (size * 2) + 'px';
                arc.style.height = (size * 2) + 'px';
                break;
            case 1:
                arc.style.left = x + 'px';
                arc.style.top = y + 'px';
                arc.style.width = (size * 2) + 'px';
                arc.style.height = (size * 2) + 'px';
                break;
            case 2:
                arc.style.left = x + 'px';
                arc.style.top = y + 'px';
                arc.style.width = (size * 2) + 'px';
                arc.style.height = (size * 2) + 'px';
                break;
            case 3:
                arc.style.left = (x - size) + 'px';
                arc.style.top = (y - size) + 'px';
                arc.style.width = (size * 2) + 'px';
                arc.style.height = (size * 2) + 'px';
                break;
        }
        
        spiralContainer.appendChild(rect);
        spiralContainer.appendChild(arc);
        
        const temp = a + b;
        a = b;
        b = temp;
        direction++;
    }
}

function initPythagoras() {
    const canvas = document.getElementById('pythagorasCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const inputA = document.getElementById('pythagorasA');
    const inputB = document.getElementById('pythagorasB');
    const resultC = document.getElementById('pythagorasC');
    const aValue = document.getElementById('aValue');
    const bValue = document.getElementById('bValue');
    
    function drawTriangle() {
        const a = parseFloat(inputA.value);
        const b = parseFloat(inputB.value);
        const c = Math.sqrt(a*a + b*b).toFixed(2);
        
        resultC.textContent = c;
        if (aValue) aValue.textContent = a;
        if (bValue) bValue.textContent = b;
        
        ctx.clearRect(0, 0, 200, 200);
        

        ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.fillRect(10, 190 - a*12, 12, a*12);
        ctx.strokeRect(10, 190 - a*12, 12, a*12);
        

        ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';
        ctx.strokeStyle = '#ff00ff';
        ctx.fillRect(10, 190 - b*12, b*12, 12);
        ctx.strokeRect(10, 190 - b*12, b*12, 12);
        

        ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
        ctx.strokeStyle = '#ffff00';
        ctx.save();
        ctx.translate(10, 190);
        ctx.rotate(Math.atan2(b, a));
        ctx.fillRect(0, -12, c*12, 12);
        ctx.strokeRect(0, -12, c*12, 12);
        ctx.restore();
        

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(10, 190);
        ctx.lineTo(10 + a*12, 190);
        ctx.lineTo(10, 190 - b*12);
        ctx.closePath();
        ctx.stroke();
        

        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 10px "MS Sans Serif"';
        ctx.fillText(`${a}`, 10 + a*6, 200);
        ctx.fillText(`${b}`, 25, 190 - b*6);
        
        ctx.fillStyle = '#ffff00';
        ctx.fillText(`${c}`, 10 + a*6, 170 - b*6);
    }
    
    inputA.addEventListener('input', drawTriangle);
    inputB.addEventListener('input', drawTriangle);
    
    drawTriangle();
}


if (infoClose) {
    infoClose.addEventListener('click', () => {
        infoPanel.classList.remove('visible');
    });
}


document.querySelectorAll('.dimension-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.dimension-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const dim = btn.dataset.dim;
        currentDimension = dim;
        
        if (dim === '4d' || dim === '5d') {
            createTesseract();
        } else {

            switch(currentFractal) {
                case 'mandelbrot': createMandelbrot3D(); break;
                case 'julia': createJulia3D(); break;
                case 'sierpinski': createSierpinski(); break;
                case 'dragon': createDragonCurve(); break;
                case 'koch': createKoch(); break;
                case 'tree': createFractalTree(); break;
                default: createJulia3D();
            }
        }
        
        infoTitle.textContent = `🌀 Dimensão ${dim.toUpperCase()}`;
        infoContent.innerHTML = dim === '4d' || dim === '5d' ? 
            '<p>Bem-vindo à 4ª dimensão! Aqui você pode ver um Tesseract (hipercubo).</p><p>Um cubo 4D tem 16 vértices, 32 arestas e 8 células cúbicas.</p>' +
            '<p><strong>Curiosidade:</strong> Na 5ª dimensão, existem 32 vértices!</p>' :
            `<p>Explorando o fractal na dimensão ${dim.toUpperCase()}.</p>`;
        infoPanel.classList.add('visible');
        createParticles(15);
    });
});


document.querySelectorAll('.fractal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.fractal-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const fractal = btn.dataset.fractal;
        currentFractal = fractal;
        
        if (currentDimension === '4d' || currentDimension === '5d') {
            document.querySelectorAll('.dimension-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-dim="3d"]').classList.add('active');
            currentDimension = '3d';
        }
        
        switch(fractal) {
            case 'mandelbrot': createMandelbrot3D(); break;
            case 'julia': createJulia3D(); break;
            case 'sierpinski': createSierpinski(); break;
            case 'dragon': createDragonCurve(); break;
            case 'koch': createKoch(); break;
            case 'tree': createFractalTree(); break;
        }
        
        infoTitle.textContent = `🌀 ${btn.textContent}`;
        infoContent.innerHTML = getFractalInfo(fractal);
        infoPanel.classList.add('visible');
        createParticles(12);
    });
});

function getFractalInfo(fractal) {
    const infos = {
        mandelbrot: `
            <p><strong style="color: #ff00ff;">Conjunto de Mandelbrot</strong> - O fractal mais famoso da matemática.</p>
            <p>Definido por z = z² + c, onde c é um ponto no plano complexo.</p>
            <p>Se a sequência não divergir, o ponto pertence ao conjunto.</p>
            <p>Quanto mais você amplia, mais detalhes infinitos aparecem!</p>
            <p><strong>Dimensão fractal:</strong> ≈ 2</p>
        `,
        julia: `
            <p><strong style="color: #ff00ff;">Conjunto de Julia</strong> - Parente próximo do Mandelbrot.</p>
            <p>Definido por z = z² + c, onde c é uma constante fixa.</p>
            <p>Cada constante gera um fractal diferente - são infinitos!</p>
            <p>O exemplo atual usa c = -0.7269 + 0.1889i</p>
            <p><strong>Conectividade:</strong> Conectado se c pertence ao Mandelbrot</p>
        `,
        sierpinski: `
            <p><strong style="color: #ff00ff;">Tetraedro de Sierpinski</strong> - Versão 3D do triângulo de Sierpinski.</p>
            <p>Comece com um tetraedro e remova repetidamente o tetraedro central.</p>
            <p><strong>Dimensão fractal:</strong> ≈ 2.3219</p>
            <p><strong>Volume:</strong> Tendendo a zero, mas área superficial infinita!</p>
        `,
        dragon: `
            <p><strong style="color: #ff00ff;">Curva do Dragão</strong> - Aparece em dobraduras de papel.</p>
            <p>Dobre uma tira de papel ao meio repetidamente e desdobre em ângulos retos.</p>
            <p>Nunca se auto-intersecta e preenche o espaço de forma fascinante!</p>
            <p><strong>Dimensão fractal:</strong> ≈ 1.5236</p>
        `,
        koch: `
            <p><strong style="color: #ff00ff;">Floco de Koch</strong> - Curva contínua mas não diferenciável.</p>
            <p>Começa com um triângulo equilátero e adiciona triângulos menores em cada lado.</p>
            <p><strong>Dimensão fractal:</strong> ≈ 1.2619</p>
            <p><strong>Perímetro:</strong> Infinito! Área: Finita.</p>
        `,
        tree: `
            <p><strong style="color: #ff00ff;">Árvore Fractal</strong> - Modela o crescimento de plantas e árvores.</p>
            <p>Cada ramo se divide em dois menores, seguindo um padrão recursivo.</p>
            <p><strong>Na natureza:</strong> Brônquios, vasos sanguíneos, raízes.</p>
            <p><strong>Dimensão fractal:</strong> Varia conforme o ângulo de bifurcação.</p>
        `
    };
    return infos[fractal] || '<p>Explore este fractal fascinante!</p>';
}


document.getElementById('minimizeBtn')?.addEventListener('click', () => {

    document.querySelector('.museum-content').style.display = 'none';
    setTimeout(() => {
        document.querySelector('.museum-content').style.display = 'flex';
    }, 5000);
});

document.getElementById('maximizeBtn')?.addEventListener('click', () => {

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

document.getElementById('closeBtn')?.addEventListener('click', () => {

    window.parent.postMessage('closeApp', '*');
});


document.addEventListener('click', (e) => {
    if (infoPanel && !infoPanel.contains(e.target) && 
        !e.target.closest('.constant-item') && 
        !e.target.closest('.prime-number') && 
        !e.target.closest('.fibonacci-number') &&
        !e.target.closest('.theory-item') &&
        !e.target.closest('.dimension-btn') &&
        !e.target.closest('.fractal-btn')) {
        infoPanel.classList.remove('visible');
    }
});


window.addEventListener('resize', () => {
    if (renderer && camera) {
        const width = threeCanvas.clientWidth || 800;
        const height = threeCanvas.clientHeight || 600;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
});

window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        initThree();
        generatePrimes();
        generateFibonacci();
        initPythagoras();
        
        if (!scene) {
            setTimeout(initThree, 500);
        }
    }, 100);
});