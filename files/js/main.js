// ═══════════════════════════════════════════
// MAGNETIZM — MAIN JS
// ═══════════════════════════════════════════

// ── Custom trailing circle cursor ──
const cursors = [
  { el: null, x: 0, y: 0, size: 10, color: '#FFFFFF', delay: 0 },
  { el: null, x: 0, y: 0, size: 14, color: '#E8177A', delay: 0.12 },
  { el: null, x: 0, y: 0, size: 18, color: '#F0A500', delay: 0.24 }
];

cursors.forEach((c, i) => {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: ${c.size}px;
    height: ${c.size}px;
    border-radius: 50%;
    background: ${c.color};
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%, -50%);
    opacity: 0;
    mix-blend-mode: difference;
  `;
  document.body.appendChild(dot);
  c.el = dot;
});

let mouseX = 0, mouseY = 0;
let started = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!started) {
    started = true;
    cursors.forEach(c => c.el.style.opacity = '1');
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, input, textarea').forEach(el => el.style.cursor = 'none');
  }
});

document.addEventListener('mouseleave', () => {
  cursors.forEach(c => c.el.style.opacity = '0');
  started = false;
});

// Each cursor chases the one ahead of it with a lag
let positions = cursors.map(() => ({ x: 0, y: 0 }));

function animateCursors() {
  // First cursor snaps to mouse
  positions[0].x += (mouseX - positions[0].x) * 0.9;
  positions[0].y += (mouseY - positions[0].y) * 0.9;

  // Second and third lag behind
  positions[1].x += (positions[0].x - positions[1].x) * 0.35;
  positions[1].y += (positions[0].y - positions[1].y) * 0.35;

  positions[2].x += (positions[1].x - positions[2].x) * 0.25;
  positions[2].y += (positions[1].y - positions[2].y) * 0.25;

  cursors.forEach((c, i) => {
    c.el.style.left = positions[i].x + 'px';
    c.el.style.top = positions[i].y + 'px';
  });

  requestAnimationFrame(animateCursors);
}

animateCursors();

// ── Scroll-triggered nav ──
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight * 0.85) {
    nav.classList.add('visible');
  } else {
    nav.classList.remove('visible');
  }
});

// ── Mobile menu ──
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const burger = document.querySelector('.nav__burger');
  if (menu && burger && menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    }
  });
});

// ── Handwritten annotations — trigger on scroll into About ──
const annoMegi = document.getElementById('annoMegi');
const annoMili = document.getElementById('annoMili');
const aboutSection = document.getElementById('about');

const annoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Slight delay so user sees the section first
      setTimeout(() => annoMegi && annoMegi.classList.add('visible'), 300);
      setTimeout(() => annoMili && annoMili.classList.add('visible'), 600);
      annoObserver.unobserve(entry.target); // only trigger once
    }
  });
}, { threshold: 0.4 });

if (aboutSection) annoObserver.observe(aboutSection);

// ── Contact form submit ──
function handleSubmit(e) {
  e.preventDefault();
  const success = document.getElementById('contactSuccess');
  const btn = document.querySelector('.contact__submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Sent!';
    success.classList.add('visible');
  }, 800);
}

// ── Services cards entrance animation ──
const serviceCards = document.querySelectorAll('.service-card--anim');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.15 });

serviceCards.forEach(card => cardObserver.observe(card));

// ── Touch swipe for video slider ──
let touchStartX = 0;
let touchEndX = 0;

const sliderEl = document.querySelector('.work__slider');
if (sliderEl) {
  sliderEl.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sliderEl.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      // Swipe left = next, swipe right = prev
      changeSlide(diff > 0 ? 1 : -1);
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════
// PORTFOLIO SLIDER — YouTube IFrame API
// ═══════════════════════════════════════════

const projects = [
  { id: '3Fb7gV7Ygk8', client: 'Pulse Shake',     desc: 'High-energy social media ads built for scroll-stopping results.' },
  { id: 'C3yvWtMnA10', client: 'Mesi Medical',     desc: 'Clean, clear tutorial videos designed to educate and convert.' },
  { id: '0MZd2fIQV64', client: 'Gaia Naturelle',   desc: 'A TV commercial that brought the brand to life across the Adria region.' },
  { id: 'w6VjNqECRDQ', client: 'Car Rental Vic',   desc: 'A sharp social media ad built to drive bookings in the Slovenian market.' },
  { id: '46_-QJQiJaM', client: 'Unikatoy',         desc: 'A playful animated ad that ran across Slovenia and Croatia.' },
  { id: 'goEbPAnlKhk', client: 'Tantum Verde',     desc: 'A full TV commercial produced for the Slovenian market.' },
  { id: 'XwLivn2cUpg', client: 'Onytec',           desc: 'A polished TV commercial that put the brand front and center in Slovenia.' },
  { id: 'tCt2kP7Wxe8', client: 'Yoga Hero',        desc: 'A Kickstarter campaign video built to inspire and convert backers.' },
  { id: '5ZyBqdd6Uu4', client: 'Vita Vera',        desc: 'A TV commercial crafted to make the brand impossible to ignore.' },
  { id: 'uwtv1xtvACI', client: 'Etnobotanika',     desc: 'Performance-driven social media ads running across Google and Meta.' }
];

let currentSlide = 0;
let player = null;
let playerReady = false;
let workSectionSeen = false;

// Load YouTube IFrame API
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
document.head.appendChild(tag);

// Called automatically by YouTube API when ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytPlayer', {
    videoId: projects[0].id,
    playerVars: {
      rel: 0,
      modestbranding: 1,
      autoplay: 1,
      mute: 1,        // muted for autoplay policy on first load
      playsinline: 1
    },
    events: {
      onReady: (e) => {
        playerReady = true;
        // If user has already scrolled to work section, play immediately
        if (workSectionSeen) e.target.playVideo();
      }
    }
  });
}

// Autoplay first video when user scrolls into the Work section
const workSection = document.getElementById('work');
const workObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !workSectionSeen) {
      workSectionSeen = true;
      if (playerReady) player.playVideo();
    }
  });
}, { threshold: 0.3 });

if (workSection) workObserver.observe(workSection);

// Update info card and counter
function updateInfo() {
  const p = projects[currentSlide];
  document.querySelector('.work__info-client').textContent = p.client;
  document.querySelector('.work__info-desc').textContent = p.desc;
  const num = String(currentSlide + 1).padStart(2, '0');
  const total = String(projects.length).padStart(2, '0');
  document.getElementById('workCounter').textContent = `${num} / ${total}`;
}

// Change slide — unmuted autoplay on arrow click (user gesture)
function changeSlide(dir) {
  currentSlide = (currentSlide + dir + projects.length) % projects.length;
  if (playerReady) {
    player.loadVideoById(projects[currentSlide].id);
    player.unMute();   // unmute on user-triggered navigation
    player.playVideo();
  }
  updateInfo();
}
