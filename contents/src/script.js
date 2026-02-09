
// ============================
// LOADING SCREEN
// ============================

// Empêche la restauration automatique du scroll
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const introOverlay = document.getElementById('intro-overlay');
  if (introOverlay) {
    setTimeout(() => {
      introOverlay.style.opacity = '0';
      setTimeout(() => {
        introOverlay.style.display = 'none';
        document.body.classList.add('ready');
      }, 500);
    }, 800);
  }
});

// ============================
// NAVIGATION SCROLL EFFECT
// ============================
const nav = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// ============================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const offsetTop = target.offsetTop - 80; // Offset pour la nav fixe
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ============================
// SCROLL REVEAL ANIMATION
// ============================
const scrollRevealElements = document.querySelectorAll('.game-card, .about-section, .contact, .footer, .hero-stat');

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  const revealPoint = 150;

  scrollRevealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < windowHeight - revealPoint) {
      element.classList.add('revealed');
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ============================
// YOUTUBE SUBSCRIBER COUNT
// ============================
async function updateSubCount() {
  const subCountElement = document.querySelector('.stat-orange .hero-stat-number');

  if (!subCountElement) return;

  try {

  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés:', error);
    subCountElement.textContent = '69.4K';
  }
}

// ============================
// ANIMATE NUMBER (pour les stats)
// ============================
function animateNumber(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);

    element.textContent = formatNumber(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ============================
// FORMAT NUMBER (pour affichage)
// ============================
function formatNumber(num) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }

  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  return num.toString();
}

// ============================
// MOBILE MENU
// ============================
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const navLinksItems = document.querySelectorAll('.mobile-nav-overlay a');

  if (!mobileMenuBtn || !mobileNavOverlay) return;

  // Toggle menu mobile
  mobileMenuBtn.addEventListener('click', () => {
    mobileNavOverlay.classList.toggle('mobile-active');
    mobileMenuBtn.classList.toggle('active');

    // Changer l'icône
    if (mobileNavOverlay.classList.contains('mobile-active')) {
      mobileMenuBtn.innerHTML = '<span>✕</span>';
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenuBtn.innerHTML = '<span>☰</span>';
      document.body.style.overflow = '';
    }
  });

  // Fermer le menu quand on clique sur un lien
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-active');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.innerHTML = '<span>☰</span>';
      document.body.style.overflow = '';
    });
  });
}

// ============================
// PARALLAX EFFECT ON HERO
// ============================
const hero = document.querySelector('.hero');
const profileWrapper = document.querySelector('.hero-card');

if (hero && profileWrapper) {
  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const moveX = (mouseX - 0.5) * 20;
    const moveY = (mouseY - 0.5) * 20;

    profileWrapper.style.transform = `perspective(1000px) rotateY(${moveX * 0.5}deg) rotateX(${-moveY * 0.5}deg) translateZ(10px)`;
  });

  hero.addEventListener('mouseleave', () => {
    profileWrapper.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
  });
}

// ============================
// CARD TILT EFFECT (3D hover)
// ============================
const cards = document.querySelectorAll('.game-card');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});

// ============================
// GAME JAMS SYSTEM
// ============================
const gameJams = [
  // Exemple de structure d'une game jam (mock data pour test)
  {
    id: 1,
    name: "Ludum Dare 56",
    theme: "Tiny Creatures",
    description: "Créez un jeu complet en 72h autour du thème des créatures minuscules. Votez, jouez et partagez !",
    startDate: "2026-04-10T18:00:00",
    endDate: "2026-04-13T18:00:00",
    url: "https://ldjam.com",
    icon: "<i class=\"fa-solid fa-gamepad\"></i>"
  }
];

function getJamStatus(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now > end) return 'ended';
  return 'live';
}

function getStatusText(status) {
  const statusTexts = {
    live: '<i class="fa-solid fa-circle-dot"></i> En cours',
    upcoming: '<i class="fa-solid fa-clock"></i> À venir',
    ended: '<i class="fa-solid fa-check"></i> Terminée'
  };
  return statusTexts[status] || status;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function calculateTimeRemaining(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 24);

  if (diffDays > 0) {
    const remainingHours = diffHrs % 24;
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours}h` : ''}`;
  }
  return `${diffHrs} heures`;
}

function createJamCard(jam) {
  const status = getJamStatus(jam.startDate, jam.endDate);
  const isActive = status === 'live' || status === 'upcoming';
  const isUpcoming = status === 'upcoming';

  const card = document.createElement('div');
  card.className = 'gamejam-card';
  card.dataset.jamId = jam.id;

  const targetDate = status === 'live' ? jam.endDate : jam.startDate;
  const countdownLabel = status === 'live' ? 'Temps restant' : 'Commence dans';

  card.innerHTML = `
    <div class="jam-status ${status}">
      ${getStatusText(status)}
    </div>
    
    <div class="jam-header">
      <div class="jam-icon">${jam.icon}</div>
    </div>
    
    <div class="jam-content">
      <h3 class="jam-title">${jam.name}</h3>
      <p class="jam-theme">Thème : "${jam.theme}"</p>
      <p class="jam-description">${jam.description}</p>
      
      <div class="jam-dates">
        <div class="date-item">
          <span class="date-icon"><i class="fa-solid fa-rocket"></i></span>
          <span>Début : ${formatDate(jam.startDate)}</span>
        </div>
        <div class="date-item">
          <span class="date-icon"><i class="fa-solid fa-flag-checkered"></i></span>
          <span>Fin : ${formatDate(jam.endDate)}</span>
        </div>
      </div>
      
      ${isActive ? `
        <div class="jam-countdown" data-target="${targetDate}">
          <div class="countdown-label">${countdownLabel}</div>
          <div class="countdown-timer">
            <div class="countdown-unit">
              <span class="countdown-value days">00</span>
              <span class="countdown-unit-label">J</span>
            </div>
            <div class="countdown-unit">
              <span class="countdown-value hours">00</span>
              <span class="countdown-unit-label">H</span>
            </div>
            <div class="countdown-unit">
              <span class="countdown-value minutes">00</span>
              <span class="countdown-unit-label">Min</span>
            </div>
            <div class="countdown-unit">
              <span class="countdown-value seconds">00</span>
              <span class="countdown-unit-label">Sec</span>
            </div>
          </div>
        </div>
      ` : ''}
      
      <div class="jam-actions">
        ${isUpcoming ? `
          <button class="jam-btn jam-btn-primary discord-register" onclick="alert('Fonctionnalité Discord à venir !')">
            <i class="fa-brands fa-discord"></i> S'inscrire
          </button>
        ` : status === 'live' ? `
          <a href="${jam.url || '#'}" target="_blank" class="jam-btn jam-btn-primary">
            Participer
          </a>
        ` : `
          <a href="${jam.url || '#'}" target="_blank" class="jam-btn jam-btn-primary">
            Voir les jeux
          </a>
        `}
        <button class="jam-btn jam-btn-secondary" onclick="openJamModal(${jam.id})">
          Infos
        </button>
      </div>
    </div>
  `;

  return card;
}

function initGameJams() {
  const grid = document.getElementById('gamejamGrid');
  if (!grid) return;

  // Trier par statut (live > upcoming > ended) puis par date
  const sortedJams = gameJams.sort((a, b) => {
    const statusOrder = { live: 0, upcoming: 1, ended: 2 };
    const statusA = getJamStatus(a.startDate, a.endDate);
    const statusB = getJamStatus(b.startDate, b.endDate);

    if (statusA !== statusB) {
      return statusOrder[statusA] - statusOrder[statusB];
    }

    return new Date(a.startDate) - new Date(b.startDate);
  });

  if (sortedJams.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎮</div>
        <p>Aucune game jam en cours pour le moment</p>
      </div>
    `;
    return;
  }

  // Vider la grille
  grid.innerHTML = '';

  // Créer les cartes
  sortedJams.forEach(jam => {
    grid.appendChild(createJamCard(jam));
  });

  // Lancer le countdown
  updateCountdowns();
  setInterval(updateCountdowns, 1000);
}

function updateCountdowns() {
  const allCountdowns = document.querySelectorAll('.jam-countdown, .jam-modal-countdown');

  allCountdowns.forEach(countdown => {
    const targetDate = countdown.dataset.target;
    const timeRemaining = calculateTimeRemaining(targetDate);

    if (!timeRemaining) {
      countdown.innerHTML = '<div class="countdown-label">Terminé !</div>';
      return;
    }

    const daysEl = countdown.querySelector('.days');
    const hoursEl = countdown.querySelector('.hours');
    const minutesEl = countdown.querySelector('.minutes');
    const secondsEl = countdown.querySelector('.seconds');

    if (daysEl) daysEl.textContent = String(timeRemaining.days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(timeRemaining.hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(timeRemaining.minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(timeRemaining.seconds).padStart(2, '0');
  });
}

// ============================
// MODAL SYSTEM
// ============================
function openJamModal(jamId) {
  const jam = gameJams.find(j => j.id === jamId);
  if (!jam) return;

  const modal = document.getElementById('jamModal');
  const modalBody = modal.querySelector('.jam-modal-body');

  // (Simplifié pour l'exemple, reprendre la structure complète si besoin)
  modalBody.innerHTML = `
    <h2>${jam.name}</h2>
    <p>${jam.description}</p>
    <button onclick="closeJamModal()" class="jam-btn jam-btn-secondary">Fermer</button>
  `;

  modal.classList.add('active');
  document.body.classList.add('modal-open');
}

window.closeJamModal = function () {
  const modal = document.getElementById('jamModal');
  modal.classList.remove('active');
  document.body.classList.remove('modal-open');
}

// ============================
// ============================
const COUNTER_API_URL = "https://api.counterapi.dev/v1";
const NAMESPACE = "baudo-site";
const KEY = "visits";

async function trackVisit() {
  const el = document.querySelector('.hero-stat.stat-pink .hero-stat-number');
  // Le 4ème stat est "Visites" (pink)

  if (!el) return;

  try {
    const sessionKey = `visited_${NAMESPACE}_${KEY}`;

    let endpoint = "up"; // Default: increment
    if (sessionStorage.getItem(sessionKey)) {
      endpoint = "info"; // Just get info if already visited in this session
    }

    const res = await fetch(`${COUNTER_API_URL}/${NAMESPACE}/${KEY}/${endpoint}`);
    const data = await res.json();

    if (data && data.count !== undefined) {
      if (endpoint === "up") {
        sessionStorage.setItem(sessionKey, "true");
      }
      animateNumber(el, 0, data.count, 2000);
    } else {
      // Fallback if API fails or is new
      el.textContent = "772+";
    }

  } catch (err) {
    console.error("Analytics error:", err);
    el.textContent = "772+"; // Fallback
  }
}

// ============================
// INITIALIZATION
// ============================
document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ Portfolio fully initialized");

  trackVisit();
  updateSubCount();
  initMobileMenu();
  initGameJams();

  // Animation loop refresh
  setInterval(updateSubCount, 120000);
});
