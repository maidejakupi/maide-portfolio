'use strict';

// ── Animated background canvas ────────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let W, H;

    const orbs = [
        { x: 0.12, y: 0.18, r: 380, c: '139,92,246', p: 0 },
        { x: 0.88, y: 0.78, r: 310, c: '45,212,191', p: 2.09 },
        { x: 0.52, y: 0.48, r: 220, c: '96,165,250', p: 4.18 },
    ];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function draw(t) {
        ctx.clearRect(0, 0, W, H);
        orbs.forEach(o => {
            const x = o.x * W + Math.sin(t * 0.00034 + o.p) * 55;
            const y = o.y * H + Math.cos(t * 0.00027 + o.p) * 40;
            const g = ctx.createRadialGradient(x, y, 0, x, y, o.r);
            g.addColorStop(0,   `rgba(${o.c},0.1)`);
            g.addColorStop(0.5, `rgba(${o.c},0.04)`);
            g.addColorStop(1,   `rgba(${o.c},0)`);
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(x, y, o.r, 0, Math.PI * 2); ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
})();

// ── NumQuest thumbnail mini-canvas ────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('thumbCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    const particles = Array.from({ length: 28 }, () => ({
        x: Math.random(), y: Math.random(),
        r: 1 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        hue: Math.random() > 0.5 ? '139,92,246' : '45,212,191',
        a: 0.3 + Math.random() * 0.5,
    }));

    function draw() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // gradient bg
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, 'rgba(109,40,217,0.18)');
        bg.addColorStop(1, 'rgba(29,78,216,0.1)');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        particles.forEach(p => {
            p.x += p.vx * 0.003;
            p.y += p.vy * 0.003;
            if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
            if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.hue},${p.a})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    new ResizeObserver(resize).observe(canvas);
    resize();
    draw();
})();

// ── Typewriter ────────────────────────────────────────────────────────────────
(function () {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const words = ['CS student.', 'web developer.', 'problem solver.', 'game builder.', 'lifelong learner.'];
    let wi = 0, ci = 0, deleting = false;

    function tick() {
        const w = words[wi];
        if (!deleting) {
            ci++;
            el.textContent = w.slice(0, ci);
            if (ci === w.length) { deleting = true; setTimeout(tick, 1500); return; }
            setTimeout(tick, 75);
        } else {
            ci--;
            el.textContent = w.slice(0, ci);
            if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 380); return; }
            setTimeout(tick, 42);
        }
    }

    setTimeout(tick, 900);
})();

// ── Burger menu ───────────────────────────────────────────────────────────────
(function () {
    const btn   = document.getElementById('navBurger');
    const links = document.getElementById('navLinks');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open);
    });

    // close on link click
    links.querySelectorAll('.nav-link').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            btn.classList.remove('open');
        });
    });
})();

// ── Scroll reveal + skill bars ────────────────────────────────────────────────
(function () {
    const all = document.querySelectorAll('.reveal');

    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.classList.add('visible');

            // animate skill fill bar when its card becomes visible
            const fill = e.target.querySelector('.skill-fill');
            if (fill) {
                setTimeout(() => { fill.style.width = fill.style.getPropertyValue('--pct') || '0%'; }, 100);
            }

            io.unobserve(e.target);
        });
    }, { threshold: 0.12 });

    all.forEach(el => io.observe(el));
})();

// ── Active nav on scroll ──────────────────────────────────────────────────────
(function () {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');

    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            links.forEach(l => l.classList.remove('active'));
            const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
            if (a) a.classList.add('active');
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => io.observe(s));
})();
