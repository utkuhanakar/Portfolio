'use strict';

/* ═══════════════════════════════════════════
   PORTFOLIO — script.js
   Minimal. Clean. No entry systems. No modes.
═══════════════════════════════════════════ */


/* ── 1. SCROLL PROGRESS ── */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });
})();


/* ── 2. NAVBAR SCROLL STYLE ── */
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const observer = new IntersectionObserver(
    ([entry]) => nav.classList.toggle('scrolled', !entry.isIntersecting),
    { rootMargin: '-1px 0px 0px 0px', threshold: 0 }
  );
  const hero = document.getElementById('hero');
  if (hero) observer.observe(hero);

  // Hamburger
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.querySelectorAll('.nav-link').forEach(l =>
      l.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }
})();


/* ── 3. SCROLL REVEAL ── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .tl-item').forEach(el => obs.observe(el));
})();


/* ── 4. ACTIVE NAV LINK (IntersectionObserver) ── */
(function () {
  const sections = document.querySelectorAll('section[id], div[id]');
  const links    = document.querySelectorAll('.nav-link');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
      });
    });
  }, { threshold: 0.4 });
  sections.forEach(s => obs.observe(s));
})();


/* ── 5. PARTICLES ── */
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dots;

  function init() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79,140,255,0.55)';
      ctx.fill();
    });

    // Connect close dots
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(79,140,255,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', init, { passive: true });
})();


/* ── 6. TERMINAL ── */
(function () {
  const body  = document.getElementById('terminal-body');
  const input = document.getElementById('terminal-live-input');
  if (!body || !input) return;

  const CMDS = {
    whoami:   () => [['key', 'name:'], ['val', 'Utkuhan Akar'], ['key', 'role:'], ['val', 'Junior developer'], ['key', 'focus:', ], ['val', 'Systems, AI, Web']],
    skills:   () => [['key', 'languages:'], ['val', 'C, Python, HTML/CSS, JS (learning)'], ['key', 'tools:'], ['val', 'Git, GitHub, VS Code, Linux']],
    focus:    () => [['val', 'Performance. Minimal design. AI tooling.'], ['val', 'Build intentionally, not by trend.']],
    experience:()=>[['key', '2020:'], ['val', 'Minecraft servers'], ['key', '2022:'], ['val', 'Python (first code)'], ['key', '2023:'], ['val', 'C programming'], ['key', '2026:'], ['val', 'Unity, web development']],
    clear:    null,
    help:     () => [['info', 'Commands: whoami · skills · focus · experience · clear']]
  };

  function line(type, text) {
    const el = document.createElement('div');
    el.className = 'tl-item'; // reuse for animation simplicity
    el.style.cssText = 'display:flex;gap:8px;margin-bottom:2px;';
    const span = document.createElement('span');
    span.className = type === 'key' ? 't-key'
                   : type === 'val' ? 't-val'
                   : type === 'info' ? 't-info' : 't-err';
    span.textContent = text;
    el.appendChild(span);
    return el;
  }

  function prompt(cmd) {
    const row = document.createElement('div');
    row.className = 't-line';
  
    const promptSpan = document.createElement('span');
    promptSpan.className = 't-prompt-green';
    promptSpan.textContent = '❯ ';
  
    const cmdSpan = document.createElement('span');
    cmdSpan.className = 't-cmd';
    cmdSpan.textContent = cmd; // İşte burası güvenliği sağlar!
  
    row.appendChild(promptSpan);
    row.appendChild(cmdSpan);
    body.appendChild(row);
 }

  function run(cmd) {
    const key = cmd.trim().toLowerCase();
    prompt(cmd);
    if (key === 'clear') { body.innerHTML = ''; return; }
    const fn = CMDS[key];
    if (!fn) {
      body.appendChild(line('err', `command not found: ${cmd}. Type "help"`));
    } else {
      fn().forEach(([type, text]) => body.appendChild(line(type, text)));
    }
    body.scrollTop = body.scrollHeight;
  }

  // Boot sequence
  setTimeout(() => run('whoami'), 600);

  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const val = input.value.trim();
    if (val) { run(val); input.value = ''; }
  });
})();


/* ── 7. SEARCH ── */
(function () {
  const overlay = document.getElementById('terminal-overlay');
  const inp     = document.getElementById('terminal-input');
  const results = document.getElementById('ts-results');
  const openBtn = document.getElementById('search-btn');
  const closeBtn= document.getElementById('close-terminal');
  if (!overlay) return;

  const PAGES = [
    { label: 'Hero',     id: 'hero' },
    { label: 'About',    id: 'about' },
    { label: 'Skills',   id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Timeline', id: 'timeline' },
    { label: 'Contact',  id: 'contact' },
  ];

  const open  = () => { overlay.classList.remove('hidden'); inp?.focus(); };
  const close = () => { overlay.classList.add('hidden'); if (inp) inp.value = ''; if (results) results.innerHTML = ''; };

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
    if (e.key === 'Escape') close();
  });

  inp?.addEventListener('input', () => {
    const q = inp.value.toLowerCase();
    if (!results) return;
    results.innerHTML = '';
    if (!q) return;
    PAGES.filter(p => p.label.toLowerCase().includes(q)).forEach(p => {
      const item = document.createElement('div');
      item.className = 'ts-result-item';
      item.textContent = p.label;
      item.addEventListener('click', () => {
        document.getElementById(p.id)?.scrollIntoView({ behavior: 'smooth' });
        close();
      });
      results.appendChild(item);
    });
  });
})();


/* ── 8. PROJECT CARD GLOW (mouse tracking) ── */
(function () {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top)  + 'px');
    });
  });
})();


/* ── 9. EMAIL COPY ── */
(function () {
  const btn  = document.getElementById('email-btn');
  const hint = document.getElementById('copy-hint');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const email = btn.dataset.email || '';
    navigator.clipboard.writeText(email).then(() => {
      if (hint) { hint.textContent = 'Copied!'; setTimeout(() => { hint.textContent = 'Click to copy'; }, 2000); }
    });
  });
})();
