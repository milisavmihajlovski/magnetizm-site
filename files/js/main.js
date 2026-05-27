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
const burgerBtn = document.querySelector('.nav__burger');
if (burgerBtn) burgerBtn.addEventListener('click', toggleMenu);

document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));
});

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

// ── Cookie consent ──
function loadYouTube() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

function showVideoDeclinedMessage() {
  const playerWrap = document.querySelector('.work__player-wrap');
  if (playerWrap) {
    playerWrap.innerHTML = '';
    const msgDiv = document.createElement('div');
    msgDiv.className = 'work__cookie-msg';
    const p = document.createElement('p');
    p.textContent = 'Video playback is disabled.';
    const btn = document.createElement('button');
    btn.textContent = 'Accept cookies to watch';
    btn.addEventListener('click', () => setCookieConsent('accepted'));
    msgDiv.appendChild(p);
    msgDiv.appendChild(btn);
    playerWrap.appendChild(msgDiv);
  }
}

function setCookieConsent(value) {
  localStorage.setItem('cookieConsent', value);
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.classList.remove('visible');
  if (value === 'accepted') {
    loadYouTube();
  } else {
    showVideoDeclinedMessage();
  }
}

const existingConsent = localStorage.getItem('cookieConsent');
if (!existingConsent) {
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.classList.add('visible');
} else if (existingConsent === 'accepted') {
  loadYouTube();
} else {
  showVideoDeclinedMessage();
}

const cookieDeclineBtn = document.getElementById('cookieDecline');
const cookieAcceptBtn = document.getElementById('cookieAccept');
if (cookieDeclineBtn) cookieDeclineBtn.addEventListener('click', () => setCookieConsent('declined'));
if (cookieAcceptBtn) cookieAcceptBtn.addEventListener('click', () => setCookieConsent('accepted'));

// Called automatically by YouTube API when ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytPlayer', {
    host: 'https://www.youtube-nocookie.com',
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

const workPrevBtn = document.getElementById('workPrev');
const workNextBtn = document.getElementById('workNext');
if (workPrevBtn) workPrevBtn.addEventListener('click', () => changeSlide(-1));
if (workNextBtn) workNextBtn.addEventListener('click', () => changeSlide(1));

// ── Testimonials carousel ──
const testimonialsData = [
  {
    quote: "Working with the MagnetiZm team was truly exceptional. Every challenge along the way was simply an opportunity for a creative solution. The entire journey to the final video was marked by professional expertise, genuine warmth, and creative spark — and the end result was outstanding. I'm so grateful for this experience and for getting to work with you. Highly recommend! 🏆",
    name: "Sabina Gombač",
    photo: "images/1. sabina.jpg"
  },
  {
    quote: "Working with the MagnetiZm team was OUTSTANDING! The entire process moved incredibly fast and smoothly — they handled everything professionally from the initial prep all the way to delivering the final videos. It was a true pleasure. We could fully trust that everything would be filmed and edited at the highest level, and they brought an incredible level of dedication to the project. Even during prep it was clear they knew their craft and took it seriously. On set they were sharp on every single detail, they really felt the project and knew how to adapt. We were also blown away by how fast the editing was turned around. In short — more than highly recommended!",
    name: "Urška Repnik Ferk",
    photo: "images/2. urska.jpg"
  },
  {
    quote: "So incredibly happy and grateful we decided to work together — I couldn't have imagined anything better. An excellent, professional, and warm team that truly listens to what you want, dives deep into your story, and makes the absolute most of it. I recommend them from the bottom of my heart. You're the best!",
    name: "Vesna Ambrožič Bregar",
    photo: "images/3. vesna.jpg"
  },
  {
    quote: "Dynamic team, friendly people, and an amazing job. I'm super happy with the result. Totally recommended.",
    name: "Giacomo Pazzarelli",
    photo: "images/4. giacomo.jpg"
  },
  {
    quote: "Thinking outside the box is one thing — actually pulling off something that seems 'impossible' is a whole other level. And that's exactly what Megi & Co are about! Always positive, they take even the wildest ideas and turn them into incredible, extraordinary stories. I've worked with them on many projects and the final results always knock my socks off. Bravo & keep up the awesome work! ❤",
    name: "Tjaša Lapornik",
    photo: "images/5. tjasa.jpg"
  }
];

let currentTestimonial = 0;
const testimonialsTrack = document.getElementById('testimonialsTrack');
const testimonialsDots = document.getElementById('testimonialsDots');

if (testimonialsTrack) {
  testimonialsData.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card' + (i === 0 ? ' active' : '');
    card.innerHTML = `
      <blockquote class="testimonial-card__quote">${t.quote}</blockquote>
      <div class="testimonial-card__author">
        <img src="${t.photo}" alt="${t.name}" class="testimonial-card__photo" />
        <span class="testimonial-card__name">${t.name}</span>
      </div>
    `;
    testimonialsTrack.appendChild(card);

    const dot = document.createElement('button');
    dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => { goToTestimonial(i); resetTestimonialTimer(); });
    testimonialsDots.appendChild(dot);
  });
}

function goToTestimonial(index) {
  if (!testimonialsTrack) return;
  const cards = testimonialsTrack.querySelectorAll('.testimonial-card');
  const dots = testimonialsDots.querySelectorAll('.testimonials__dot');
  cards[currentTestimonial].classList.remove('active');
  dots[currentTestimonial].classList.remove('active');
  currentTestimonial = ((index % testimonialsData.length) + testimonialsData.length) % testimonialsData.length;
  cards[currentTestimonial].classList.add('active');
  dots[currentTestimonial].classList.add('active');
  recalcTestimonialsHeight();
}

function changeTestimonial(dir) {
  goToTestimonial(currentTestimonial + dir);
  resetTestimonialTimer();
}

// Set track to the height of the tallest card so the section never shifts.
// Must run after images load so photo heights are included in the measurement.
function recalcTestimonialsHeight() {
  if (!testimonialsTrack) return;
  testimonialsTrack.style.height = '';
  if (window.innerWidth <= 768) {
    const activeCard = testimonialsTrack.querySelector('.testimonial-card.active');
    if (activeCard) testimonialsTrack.style.height = activeCard.offsetHeight + 'px';
  } else {
    const allCards = testimonialsTrack.querySelectorAll('.testimonial-card');
    let maxHeight = 0;
    allCards.forEach(card => { maxHeight = Math.max(maxHeight, card.offsetHeight); });
    testimonialsTrack.style.height = maxHeight + 'px';
  }
}

window.addEventListener('load', recalcTestimonialsHeight);
window.addEventListener('resize', recalcTestimonialsHeight);

const testimonialPrevBtn = document.getElementById('testimonialPrev');
const testimonialNextBtn = document.getElementById('testimonialNext');
if (testimonialPrevBtn) testimonialPrevBtn.addEventListener('click', () => { changeTestimonial(-1); resetTestimonialTimer(); });
if (testimonialNextBtn) testimonialNextBtn.addEventListener('click', () => { changeTestimonial(1); resetTestimonialTimer(); });

let testimonialTimer = setInterval(() => changeTestimonial(1), 5000);

function resetTestimonialTimer() {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(() => changeTestimonial(1), 5000);
}

const testimonialsSliderEl = document.querySelector('.testimonials__slider');
if (testimonialsSliderEl) {
  let tStartX = 0;
  testimonialsSliderEl.addEventListener('touchstart', e => { tStartX = e.changedTouches[0].screenX; }, { passive: true });
  testimonialsSliderEl.addEventListener('touchend', e => {
    const diff = tStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) changeTestimonial(diff > 0 ? 1 : -1);
  }, { passive: true });
}

// ── Reels underline animation ──
const reelsUnderline = document.querySelector('.reels__underline');
const reelsSection = document.getElementById('reels');

const underlineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      reelsUnderline.classList.add('in-view');
      underlineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

if (reelsSection) underlineObserver.observe(reelsSection);

// ═══════════════════════════════════════════
// REEL LIGHTBOX
// ═══════════════════════════════════════════

const reelSources = [
  'video/etnobotanika.mp4',
  'video/megi.mp4',
  'video/jana.mp4',
  'video/neja.mp4'
];

let currentReel = 0;
const reelModal = document.getElementById('reelModal');
const reelModalVideo = document.getElementById('reelModalVideo');
const reelModalCounter = document.getElementById('reelModalCounter');
const gridVideos = document.querySelectorAll('.reel-item__video');

document.querySelectorAll('.reel-item').forEach((item, index) => {
  item.addEventListener('click', () => openReelModal(index));
});

function openReelModal(index) {
  currentReel = index;
  reelModalVideo.src = reelSources[currentReel];
  reelModalVideo.currentTime = 0;
  reelModalVideo.play();
  updateReelCounter();
  reelModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  gridVideos.forEach(v => v.pause());
}

function closeReelModal() {
  reelModal.classList.remove('open');
  reelModalVideo.pause();
  reelModalVideo.src = '';
  document.body.style.overflow = '';
  gridVideos.forEach(v => v.play());
}

function changeReelSlide(dir) {
  currentReel = (currentReel + dir + reelSources.length) % reelSources.length;
  reelModalVideo.src = reelSources[currentReel];
  reelModalVideo.currentTime = 0;
  reelModalVideo.play();
  updateReelCounter();
}

function updateReelCounter() {
  const num = String(currentReel + 1).padStart(2, '0');
  reelModalCounter.textContent = `${num} / 0${reelSources.length}`;
}

const reelModalOverlay = document.getElementById('reelModalOverlay');
const reelModalCloseBtn = document.getElementById('reelModalClose');
const reelPrevBtn = document.getElementById('reelPrev');
const reelNextBtn = document.getElementById('reelNext');
if (reelModalOverlay) reelModalOverlay.addEventListener('click', closeReelModal);
if (reelModalCloseBtn) reelModalCloseBtn.addEventListener('click', closeReelModal);
if (reelPrevBtn) reelPrevBtn.addEventListener('click', () => changeReelSlide(-1));
if (reelNextBtn) reelNextBtn.addEventListener('click', () => changeReelSlide(1));

document.addEventListener('keydown', (e) => {
  if (!reelModal.classList.contains('open')) return;
  if (e.key === 'Escape') closeReelModal();
  if (e.key === 'ArrowLeft') changeReelSlide(-1);
  if (e.key === 'ArrowRight') changeReelSlide(1);
});

// ── Contact form ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    const btn = contactForm.querySelector('.contact__submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
  });
}
