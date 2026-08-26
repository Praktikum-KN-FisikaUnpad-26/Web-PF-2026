/**
 * script.js — Praktikum Komputasi Numerik 2026
 * Modules:
 *   1. Star Canvas Background
 *   2. Navbar Scroll Behavior + Hamburger Menu
 *   3. Scroll Reveal Animation
 *   4. Typewriter Effect
 *   5. Number Counter Animation
 *   6. Ripple Effect on Buttons
 *   7. Interactive Calendar
 *   8. Card Magnetic Hover
 *   9. Smooth Active Nav Link Highlighting
 */

/* ================================================================
   UTILITY: Run after DOM ready
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initStarCanvas();
  initNavbar();
  initScrollReveal();
  initTypewriter();
  initCounters();
  initRipple();
  initMagneticCards();
  initActiveNav();
  initBinaryRain();
  checkPopupFlip();
  initParallax();
});



/* ================================================================
   1. STAR CANVAS BACKGROUND
   Lightweight star field — uses requestAnimationFrame but is very
   efficient (only redraws moving stars).
================================================================ */
function initStarCanvas() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, stars;

  const STAR_COUNT = 110;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random(),        // current alpha
      da: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1), // delta alpha
      speed: Math.random() * 0.08 + 0.02,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    stars.forEach(s => {
      // Twinkle
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;

      // Slow drift upward
      s.y -= s.speed;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 130, 250, ${s.a * 0.7})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();

  window.addEventListener('resize', () => { resize(); createStars(); });
}

/* ================================================================
   BINARY RAIN BACKGROUND
================================================================ */
function initBinaryRain() {
  const container = document.getElementById('binaryRain');
  if (!container) return;

  const COLS = 28;   // jumlah kolom — naikin untuk lebih rapat
  const ROWS = 18;   // karakter per kolom

  for (let i = 0; i < COLS; i++) {
    const col = document.createElement('div');
    col.className = 'binary-col';

    // Posisi horizontal acak
    col.style.left = `${(i / COLS) * 100 + Math.random() * 2}%`;

    // Durasi & delay acak biar gak serentak
    const dur = 8 + Math.random() * 14;   // 8–22 detik
    const delay = Math.random() * 12;        // 0–12 detik delay awal
    col.style.animationDuration = `${dur}s`;
    col.style.animationDelay = `-${delay}s`;

    // Isi kolom dengan 0 dan 1
    for (let j = 0; j < ROWS; j++) {
      const span = document.createElement('span');
      span.textContent = Math.random() > 0.5 ? '1' : '0';

      // Beberapa karakter lebih terang
      if (Math.random() > 0.75) span.classList.add('bright');

      // Kedip acak tiap karakter
      span.style.animationDelay = `${Math.random() * 2}s`;
      span.style.animationDuration = `${1 + Math.random() * 2}s`;

      col.appendChild(span);
    }

    container.appendChild(col);
  }

  // Ganti angka secara berkala biar berasa "hidup"
  setInterval(() => {
    const spans = container.querySelectorAll('span');
    const randomCount = Math.floor(spans.length * 0.15); // ganti 15% sekaligus
    for (let i = 0; i < randomCount; i++) {
      const el = spans[Math.floor(Math.random() * spans.length)];
      el.textContent = Math.random() > 0.5 ? '1' : '0';
    }
  }, 600);
}

/* ================================================================
   2. NAVBAR — Scroll shadow + Hamburger menu
================================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!navbar) return;

  // Scroll: add "scrolled" class
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      mobileMenu.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-hidden', !open);
      navbar.classList.toggle('open', open);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', true);
      });
    });
  }
}


/* ================================================================
   3. SCROLL REVEAL
   Uses IntersectionObserver — zero performance cost.
================================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}


/* ================================================================
   4. TYPEWRITER EFFECT
   Writes the hero title text character by character.
================================================================ */
function initTypewriter() {
  const target = document.getElementById('typedText');
  if (!target) return;

  const phrases = [
    'Praktikum Pemrograman Fisika',
    'Physics Programming',
    'Code. Simulate. Visualize.',
    'for t in range(steps): update()',
    'import numpy as np',
    'plt.plot(t, v)',
    '> Running simulation...',
    'Compiling Python...',
    '> Output: Hello, Fisika!',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  // Insert cursor span
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  target.parentElement.appendChild(cursor);

  function type() {
    const current = phrases[phraseIdx];

    if (paused) {
      paused = false;
      setTimeout(type, deleting ? 60 : 1800);
      return;
    }

    if (!deleting) {
      charIdx++;
      target.textContent = current.slice(0, charIdx);
      target.className = 'gradient-text';

      if (charIdx === current.length) {
        deleting = true;
        paused = true;
      }
    } else {
      charIdx--;
      target.textContent = current.slice(0, charIdx);

      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    const speed = deleting ? 45 : (Math.random() * 40 + 55);
    setTimeout(type, paused ? 1800 : speed);
  }

  // Small delay before starting
  setTimeout(type, 600);
}


/* ================================================================
   5. NUMBER COUNTER ANIMATION
   Counts up from 0 to data-target when element enters view.
================================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur = 1400; // ms
      const step = 16;   // ~60fps
      const inc = target / (dur / step);
      let current = 0;

      const tick = setInterval(() => {
        current += inc;
        if (current >= target) {
          el.textContent = target;
          clearInterval(tick);
        } else {
          el.textContent = Math.floor(current);
        }
      }, step);

      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}


/* ================================================================
   6. RIPPLE EFFECT ON BUTTONS
   Adds a ripple circle at click position.
================================================================ */
function initRipple() {
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ring = document.createElement('span');
      ring.className = 'ripple-ring';
      ring.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
      `;

      this.appendChild(ring);
      ring.addEventListener('animationend', () => ring.remove());
    });
  });
}


/* ================================================================
   7. INTERACTIVE CALENDAR
================================================================ */
function initCalendar() {
  const grid = document.getElementById('calGrid');
  const label = document.getElementById('calMonthLabel');
  const prevBtn = document.getElementById('calPrev');
  const nextBtn = document.getElementById('calNext');

  if (!grid) return;

  // ★ EDIT EVENTS HERE
  // Format: 'YYYY-M-D': 'class-name'
  // Classes: collect | deadline | exam
  const events = {
    '2026-2-7': 'collect',
    '2026-2-14': 'deadline',
    '2026-2-21': 'exam',
    '2026-2-28': 'collect',
    '2026-3-7': 'collect',
    '2026-3-14': 'deadline',
    '2026-3-18': 'exam',
    '2026-3-28': 'collect',
    '2026-4-4': 'collect',
    '2026-4-11': 'deadline',
  };

  const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const today = new Date();
  let current = new Date(2026, 1, 1); // Feb 2026

  function render() {
    const y = current.getFullYear();
    const m = current.getMonth();
    label.textContent = `${MONTH_NAMES[m]} ${y}`;

    grid.innerHTML = '';

    // Day name headers
    DAY_NAMES.forEach(name => {
      const el = document.createElement('div');
      el.className = 'cal-day-name';
      el.textContent = name;
      grid.appendChild(el);
    });

    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'cal-day empty';
      el.setAttribute('aria-hidden', 'true');
      grid.appendChild(el);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      const key = `${y}-${m + 1}-${d}`;
      let cls = 'cal-day';

      const isToday = (
        today.getFullYear() === y &&
        today.getMonth() === m &&
        today.getDate() === d
      );

      if (isToday) cls += ' today';
      else if (events[key]) cls += ` ${events[key]}`;

      el.className = cls;
      el.textContent = d;
      el.setAttribute('role', 'gridcell');
      el.setAttribute('aria-label', `${d} ${MONTH_NAMES[m]} ${y}${isToday ? ' (hari ini)' : ''}`);

      // Satisfying click pop
      el.addEventListener('click', () => {
        if (el.classList.contains('empty')) return;
        el.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.25)' },
          { transform: 'scale(1)' },
        ], { duration: 280, easing: 'cubic-bezier(0.34,1.56,0.64,1)' });
      });

      grid.appendChild(el);
    }
  }

  // Nav buttons with satisfying click
  function animateNav(btn) {
    btn.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0.88)' },
      { transform: 'scale(1)' },
    ], { duration: 220, easing: 'cubic-bezier(0.34,1.56,0.64,1)' });
  }

  prevBtn && prevBtn.addEventListener('click', () => {
    animateNav(prevBtn);
    current.setMonth(current.getMonth() - 1);
    render();
  });

  nextBtn && nextBtn.addEventListener('click', () => {
    animateNav(nextBtn);
    current.setMonth(current.getMonth() + 1);
    render();
  });

  render();
}


/* ================================================================
   8. MAGNETIC CARD HOVER
   Cards subtly tilt toward cursor — very satisfying on glass cards.
================================================================ */
function initMagneticCards() {
  const cards = document.querySelectorAll(
    '.asisten-card, .modul-pair, .template-card'
  );

  // Reduced motion check
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      const tiltX = dy * -5;   // max 5deg
      const tiltY = dx * 5;

      card.style.transform = `
        perspective(800px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
        translateY(-6px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

document.querySelectorAll('.shelf-book').forEach(book => {
  const link = book.dataset.link;
  if (!link) return;

  book.style.cursor = "pointer";

  book.addEventListener('click', (e) => {
    // Biar gak ganggu hover popup
    e.stopPropagation();
    window.open(link, "_blank");
  });
});

function checkPopupFlip() {
  document.querySelectorAll('.shelf-book').forEach(book => {
    const popup = book.querySelector('.book-popup');
    if (!popup) return;

    // Reset dulu
    book.classList.remove('popup-flip');

    const bookRect = book.getBoundingClientRect();
    const popupWidth = popup.offsetWidth || 175;
    const gap = 14;

    // Kalau popup akan melewati tepi kanan viewport → flip ke kiri
    if (bookRect.right + gap + popupWidth > window.innerWidth) {
      book.classList.add('popup-flip');
    }
  });
}

// Jalankan saat load & resize
window.addEventListener('load', checkPopupFlip);
window.addEventListener('resize', checkPopupFlip);

/* ================================================================
   9. ACTIVE NAV LINK HIGHLIGHTING
   Highlights the nav link for the section currently in view.
================================================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id;
      navLinks.forEach(a => {
        const isActive = a.getAttribute('href') === `#${id}`;
        a.style.color = isActive ? 'var(--clr-primary)' : '';
      });
    });
  }, { threshold: 0.40 });

  sections.forEach(s => io.observe(s));
}

/* ================================================================
   10. PARALLAX BACKGROUND
   Depth effect on the grid/orbs/arcs while scrolling.
================================================================ */
function initParallax() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // Note: individual .orb elements already animate their own `transform`
  // via the orbFloat keyframes, so parallax is applied to the shared
  // .bg-orbs wrapper instead (avoids fighting over the same property).
  const layers = [
    { el: document.querySelector('.bg-grid'),    speed: 0.05 },
    { el: document.querySelector('.arc-ring-1'), speed: 0.10 },
    { el: document.querySelector('.arc-ring-2'), speed: 0.06 },
    { el: document.querySelector('.bg-orbs'),    speed: 0.16 },
    { el: document.querySelector('.bg-flash'),   speed: 0.22 },
  ].filter(layer => layer.el);

  if (!layers.length) return;

  let ticking = false;

  function apply() {
    const y = window.scrollY;
    layers.forEach(({ el, speed }) => {
      el.style.transform = `translateY(${y * speed}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(apply);
      ticking = true;
    }
  }, { passive: true });
}
