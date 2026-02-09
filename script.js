function createParticles() {
  const particleCount = 15;
  const colors = ['#8b5cf6', '#06b6d4', '#f43f5e', '#a78bfa'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = Math.random() * 100 + 'vh';

    const size = 2 + Math.random() * 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = 15 + Math.random() * 10 + 's';

    document.body.appendChild(particle);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  createParticles();
  document.body.classList.add('animating');

  setTimeout(() => {
    const overlay = document.getElementById('intro-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
        document.body.classList.remove('animating');
        document.body.classList.add('ready');

        document.querySelectorAll('.fade-in-link').forEach((el, i) => {
          el.style.setProperty('--delay', (i * 0.08) + 's');
          el.style.animationPlayState = 'running';
        });

        const profile = document.querySelector('.profile-pic');
        if (profile) {
          setTimeout(() => profile.classList.add('animate-float'), 500);
        }
      }, 400);
    }
  }, 800);

  hackerEffect();
  initHeroParallax();
  initButtonEffects();
  initScrollAnimations();
});

function initHeroParallax() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  const bg = hero ? hero.querySelector('.hero-bg') : null;
  const card = hero ? hero.querySelector('.hero-card') : null;
  if (!hero || !bg) return;

  let rect = hero.getBoundingClientRect();
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  const maxMove = 20;
  const ease = 0.06;

  window.addEventListener('resize', () => { rect = hero.getBoundingClientRect(); });

  hero.addEventListener('mousemove', (e) => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nx = (x / rect.width - 0.5) * 2;
    const ny = (y / rect.height - 0.5) * 2;
    targetX = nx * maxMove * -1;
    targetY = ny * maxMove * -1;

    if (card) {
      card.style.transform = `perspective(1000px) rotateY(${nx * 3}deg) rotateX(${-ny * 2}deg) translateZ(10px)`;
    }
  });

  hero.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    if (card) {
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    }
  });

  function raf() {
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    bg.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.1)`;
    requestAnimationFrame(raf);
  }
  raf();
}

function initButtonEffects() {
  const btn = document.getElementById('subscribe-btn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      background: rgba(255,255,255,0.4);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      left: ${x}px;
      top: ${y}px;
      width: 10px;
      height: 10px;
      margin-left: -5px;
      margin-top: -5px;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `@keyframes ripple { to { transform: scale(40); opacity: 0; } }`;
    document.head.appendChild(style);
  }
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'sectionEntry 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.about, .contact, .social-links, .games-links').forEach(el => {
    observer.observe(el);
  });
}

const hackerTitle = document.getElementById('hacker-title');
const pseudo = "BAUDO";
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*?<>-_";

function hackerEffect() {
  if (!hackerTitle) return;

  const delayPerLetter = 150;
  const glitchPerLetter = 8;
  const pauseAfterComplete = 3000;
  let i = 0;

  function writeNextLetter() {
    if (i < pseudo.length) {
      let glitchCount = 0;
      let letterIndex = i;
      let glitchInterval = setInterval(() => {
        if (glitchCount < glitchPerLetter) {
          let temp = [];
          for (let j = 0; j < pseudo.length; j++) {
            if (j < letterIndex) temp[j] = pseudo[j];
            else if (j === letterIndex) temp[j] = chars[Math.floor(Math.random() * chars.length)];
            else temp[j] = "\u00A0";
          }
          hackerTitle.textContent = temp.join("");
          glitchCount++;
        } else {
          let temp = [];
          for (let j = 0; j < pseudo.length; j++) {
            if (j <= letterIndex) temp[j] = pseudo[j];
            else temp[j] = "\u00A0";
          }
          hackerTitle.textContent = temp.join("");
          clearInterval(glitchInterval);
          i++;
          setTimeout(writeNextLetter, delayPerLetter);
        }
      }, Math.floor(delayPerLetter / glitchPerLetter));
    } else {
      setTimeout(() => {
        i = 0;
        hackerTitle.textContent = "";
        setTimeout(hackerEffect, 500);
      }, pauseAfterComplete);
    }
  }

  writeNextLetter();
}

function updateSubCount() {
  fetch('/api/subscribers')
    .then(res => {
      if (!res.ok) throw new Error('API non disponible');
      return res.json();
    })
    .then(data => {
      const subCount = document.getElementById('sub-count');
      if (subCount && typeof data.subscriberCount !== 'undefined') {
        subCount.textContent = Number(data.subscriberCount).toLocaleString('fr-FR') + " abonnés";
      } else if (subCount) {
        subCount.textContent = "+60k abonnés";
      }
    })
    .catch(() => {
      const subCount = document.getElementById('sub-count');
      if (subCount) subCount.textContent = "+60k abonnés";
    });
}

updateSubCount();
setInterval(updateSubCount, 120000);

document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});

console.log("%c 🎮 Bienvenue sur le site de Baudo! ", "background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: white; font-size: 1.5em; padding: 10px 20px; border-radius: 10px; font-weight: bold;");
console.log("%c Développé avec ❤️ par csc.pacman & Klaynight", "color: #a78bfa; font-size: 1em; padding: 5px;");

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
