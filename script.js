// ─── YEAR ───
document.getElementById('current-year').textContent = new Date().getFullYear();

// ─── CUSTOM CURSOR ───
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});

function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .skill-tag, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
});

// ─── PARTICLE CANVAS BACKGROUND ───
(function() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: -9999, y: -9999 };

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', () => { resize(); init(); });
    resize();

    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    const COLORS = ['rgba(0,255,249,', 'rgba(191,0,255,', 'rgba(0,255,136,'];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 1.5 + 0.3;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha = Math.random() * 0.5 + 0.1;
            this.life = Math.random() * 300 + 200;
            this.age = 0;
        }
        update() {
            this.age++;
            if (this.age > this.life) { this.reset(); return; }
            // mouse repel
            const dx = this.x - mouse.x, dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120 * 0.8;
                this.vx += (dx / dist) * force;
                this.vy += (dy / dist) * force;
            }
            this.vx *= 0.99; this.vy *= 0.99;
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0) this.x = W;
            if (this.x > W) this.x = 0;
            if (this.y < 0) this.y = H;
            if (this.y > H) this.y = 0;
        }
        draw() {
            const fade = this.age < 30 ? this.age / 30 : this.age > this.life - 30 ? (this.life - this.age) / 30 : 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + (this.alpha * fade) + ')';
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        const count = Math.min(Math.floor((W * H) / 8000), 200);
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    init();

    // connection lines
    function drawLines() {
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.06;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0,255,249,${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // slow moving nebula blobs
    let t = 0;
    function drawNebula() {
        t += 0.002;
        const blobs = [
            { x: W * 0.2 + Math.sin(t) * W * 0.05, y: H * 0.3 + Math.cos(t * 0.7) * H * 0.05, r: W * 0.25, c: 'rgba(99,0,255,' },
            { x: W * 0.8 + Math.cos(t * 0.6) * W * 0.04, y: H * 0.6 + Math.sin(t * 0.9) * H * 0.04, r: W * 0.3, c: 'rgba(0,180,200,' },
            { x: W * 0.5 + Math.sin(t * 0.5) * W * 0.06, y: H * 0.8, r: W * 0.2, c: 'rgba(0,255,100,' },
        ];
        blobs.forEach(b => {
            const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
            grad.addColorStop(0, b.c + '0.025)');
            grad.addColorStop(1, b.c + '0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        drawNebula();
        drawLines();
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }
    loop();
})();

// ─── TYPING EFFECT ───
const roles = ["Electrical Engineer", "SCADA & Automation", "PLC Programming", "OT Engineer", "Python Developer"];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typingElement = document.querySelector('.typing-text');

function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    let speed = isDeleting ? 40 : 90;
    if (!isDeleting && charIndex === currentRole.length) { speed = 2000; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; speed = 400; }
    setTimeout(type, speed);
}
document.addEventListener("DOMContentLoaded", () => { if (roles.length) setTimeout(type, 600); });

// ─── NAVBAR SCROLL ───
window.addEventListener('scroll', () => {
    document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 50);
    fadeElements();
});

// ─── FADE-IN ───
const fadeElements = () => {
    document.querySelectorAll('.fade-in').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('visible');
    });
};
fadeElements();

// ─── MOBILE MENU ───
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
});

// ─── CONTACT FORM ───
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting...';
        btn.style.opacity = '0.7';
        fetch('https://formsubmit.co/ajax/govindkumarplc1@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                _subject: 'New Portfolio Message from ' + document.getElementById('name').value + '!'
            })
        })
        .then(r => r.json())
        .then(() => {
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
            btn.style.background = 'rgba(0,255,136,0.1)';
            btn.style.borderColor = 'var(--neon-green)';
            btn.style.color = 'var(--neon-green)';
            btn.style.boxShadow = '0 0 20px rgba(0,255,136,0.2)';
            btn.style.opacity = '1';
            contactForm.reset();
            setTimeout(() => { btn.innerHTML = originalHTML; btn.style = ''; }, 5000);
        })
        .catch(() => {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Network Error';
            btn.style.borderColor = '#ef4444';
            btn.style.color = '#ef4444';
            btn.style.opacity = '1';
            setTimeout(() => { btn.innerHTML = originalHTML; btn.style = ''; }, 5000);
        });
    });
}
