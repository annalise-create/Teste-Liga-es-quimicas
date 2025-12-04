// Configura canvas full screen
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Atualiza tamanho do canvas ao redimensionar
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ---------------------------
// CONFIGURAÇÃO DAS PARTÍCULAS
// ---------------------------
const particles = [];
const particleCount = 150;

for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `hsl(${Math.random()*360}, 100%, 50%)`,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5
    });
}

// ---------------------------
// CONFIGURAÇÃO DOS ORBITAIS
// ---------------------------
const orbitals = [
    { radius: 60, speed: 0.02, angle: Math.random() * Math.PI*2 },
    { radius: 100, speed: -0.015, angle: Math.random() * Math.PI*2 },
    { radius: 140, speed: 0.01, angle: Math.random() * Math.PI*2 }
];

// ---------------------------
// FUNÇÃO DE DESENHO
// ---------------------------
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo escuro semi-transparente para efeito glow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar partículas neon
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.closePath();
    });

    // Desenhar núcleo central
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI*2);
    ctx.fillStyle = '#A7FF1A'; // neon lime
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#A7FF1A';
    ctx.fill();
    ctx.closePath();

    // Desenhar orbitais e elétrons
    orbitals.forEach(o => {
        o.angle += o.speed;

        // Traço do orbital
        ctx.beginPath();
        ctx.arc(centerX, centerY, o.radius, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();

        // Elétron
        const electronX = centerX + o.radius * Math.cos(o.angle);
        const electronY = centerY + o.radius * Math.sin(o.angle);

        ctx.beginPath();
        ctx.arc(electronX, electronY, 6, 0, Math.PI*2);
        ctx.fillStyle = '#00F0FF'; // neon cyan
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00F0FF';
        ctx.fill();
        ctx.closePath();
    });

    requestAnimationFrame(animate);
}

// Iniciar animação
animate();
