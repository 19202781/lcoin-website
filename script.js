// ============================================
// FONDO DE UNIVERSO CON ESTRELLAS Y COMETAS (UNO A LA VEZ)
// ============================================
(function(){
    const canvas = document.getElementById('bubbles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // ---------- ESTRELLAS ----------
    const STAR_COUNT = 100;
    const MAX_STAR_RADIUS = 1.2;
    const STAR_COLORS = ['#FFFFFF', '#C0C0C0', '#00F0FF', '#1E90FF'];
    let stars = [];

    function createStar() {
        const radius = Math.random() * MAX_STAR_RADIUS + 0.3;
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: radius,
            speedX: (Math.random() - 0.5) * 0.15,
            speedY: (Math.random() - 0.5) * 0.15 - 0.05,
            color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
            opacity: Math.random() * 0.4 + 0.1,
            twinkleSpeed: 0.01 + Math.random() * 0.03,
            twinkleOffset: Math.random() * Math.PI * 2
        };
    }

    for (let i = 0; i < STAR_COUNT; i++) stars.push(createStar());

    // ---------- COMETAS (UNO A LA VEZ) ----------
    let activeComet = null;   // cometa actual en pantalla
    let cometTimer = null;    // temporizador para lanzar el siguiente

    function spawnComet() {
        if (activeComet) return; // si ya hay uno, no hacemos nada
        const fromEdge = Math.floor(Math.random() * 4);
        let x, y, vx, vy;
        const speed = 1.5 + Math.random() * 2;
        const angle = Math.random() * Math.PI * 2;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        if (fromEdge === 0) { x = -10; y = Math.random() * height; }
        else if (fromEdge === 1) { x = width + 10; y = Math.random() * height; }
        else if (fromEdge === 2) { x = Math.random() * width; y = -10; }
        else { x = Math.random() * width; y = height + 10; }
        activeComet = {
            x, y,
            vx, vy,
            trail: []
        };
    }

    function removeComet() {
        activeComet = null;
        // programar el próximo cometa con un retraso aleatorio entre 4 y 8 segundos
        const delay = 4000 + Math.random() * 4000;
        if (cometTimer) clearTimeout(cometTimer);
        cometTimer = setTimeout(spawnComet, delay);
    }

    // lanzar el primer cometa al inicio
    spawnComet();

    // ---------- DIBUJAR ESTRELLAS ----------
    function drawStars() {
        for (let s of stars) {
            s.x += s.speedX;
            s.y += s.speedY;
            if (s.x < -s.radius) s.x = width + s.radius;
            if (s.x > width + s.radius) s.x = -s.radius;
            if (s.y < -s.radius) s.y = height + s.radius;
            if (s.y > height + s.radius) s.y = -s.radius;

            const twinkle = Math.sin(Date.now() * 0.001 * s.twinkleSpeed + s.twinkleOffset) * 0.15;
            const currentOpacity = Math.min(1, Math.max(0, s.opacity + twinkle));

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            const r = parseInt(s.color.slice(1,3),16);
            const g = parseInt(s.color.slice(3,5),16);
            const b = parseInt(s.color.slice(5,7),16);
            ctx.fillStyle = `rgba(${r},${g},${b},${currentOpacity})`;
            ctx.fill();
        }
    }

    // ---------- DIBUJAR COMETAS ----------
    function drawComets() {
        if (!activeComet) return;
        const c = activeComet;
        c.x += c.vx;
        c.y += c.vy;
        c.trail.push({ x: c.x, y: c.y, opacity: 0.8 });
        if (c.trail.length > 15) c.trail.shift();
        for (let j = 0; j < c.trail.length; j++) {
            const t = c.trail[j];
            const alpha = t.opacity * (j / c.trail.length) * 0.6;
            ctx.beginPath();
            ctx.arc(t.x, t.y, 2, 0, Math.PI*2);
            ctx.fillStyle = `rgba(30,144,255,${alpha})`;
            ctx.fill();
        }
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(Math.atan2(c.vy, c.vx));
        ctx.beginPath();
        ctx.moveTo(5,0);
        ctx.lineTo(-3,-2);
        ctx.lineTo(-3,2);
        ctx.closePath();
        ctx.fillStyle = '#1E90FF';
        ctx.shadowColor = 'rgba(0,240,255,0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
        // si sale de la pantalla, lo eliminamos y programamos otro
        if (c.x < -20 || c.x > width+20 || c.y < -20 || c.y > height+20) {
            removeComet();
        }
    }

    // ---------- BUCLE PRINCIPAL ----------
    function animate() {
        ctx.clearRect(0, 0, width, height);
        drawStars();
        drawComets();
        requestAnimationFrame(animate);
    }
    animate();
})();

// ============================================
// FAQ ACCORDION
// ============================================
function toggleFAQ(button) {
    const answer = button.nextElementSibling;
    const icon = button.querySelector('.faq-icon');
    if (answer.style.display === 'none' || answer.style.display === '') {
        answer.style.display = 'block';
        icon.textContent = '-';
    } else {
        answer.style.display = 'none';
        icon.textContent = '+';
    }
}