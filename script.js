// Effet d'écriture lettre par lettre pour les .description sauf celle de la 2ème partie (main-text)

document.addEventListener('DOMContentLoaded', function() {
  const descriptions = document.querySelectorAll('.description');
  descriptions.forEach(description => {
    // On ne fait PAS l'effet si c'est la description de la 2ème partie
    if (description.classList.contains('main-text')) return;
    // On récupère le HTML d'origine
    const fullHTML = description.innerHTML;
    // On extrait le texte sans balises
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = fullHTML;
    const fullText = tempDiv.textContent || tempDiv.innerText || '';
    description.textContent = '';
    let i = 0;
    function typeDescription() {
      if (i <= fullText.length) {
        description.textContent = fullText.slice(0, i);
        i++;
        setTimeout(typeDescription, 40);
      } else {
        // description.innerHTML = fullHTML; // décommente si tu veux remettre le HTML après l'effet
      }
    }
    typeDescription();
  });
});

// Animation orbitale pour la section skills
(function() {
  const orbitalIcons = document.querySelectorAll('.skills-orbital-small-icons img');
  if (!orbitalIcons.length) return;
  const centerX = 450;
  const centerY = 253;
  const orbits = [
    { rx: 420, ry: 120 }, // large ellipse
    { rx: 350, ry: 100 }, // medium ellipse
    { rx: 280, ry: 80 },  // small ellipse
  ];
  // Assignation manuelle des positions initiales
  const iconData = [
    { el: orbitalIcons[0], orbit: 0, left: 810, top: 160 },
    { el: orbitalIcons[1], orbit: 0, left: 860, top: 130 },
    { el: orbitalIcons[2], orbit: 0, left: 860, top: 190 },
    { el: orbitalIcons[3], orbit: 0, left: 780, top: 180 },
    { el: orbitalIcons[4], orbit: 0, left: 460, top: 320 },
    { el: orbitalIcons[5], orbit: 1, left: 280, top: 280 },
    { el: orbitalIcons[6], orbit: 1, left: 320, top: 320 },
    { el: orbitalIcons[7], orbit: 1, left: 350, top: 220 },
    { el: orbitalIcons[8], orbit: 1, left: 180, top: 320 },
    { el: orbitalIcons[9], orbit: 1, left: 230, top: 300 },
    { el: orbitalIcons[10], orbit: 2, left: 600, top: 350 },
    { el: orbitalIcons[11], orbit: 0, left: 700, top: 100 }, // React
    { el: orbitalIcons[12], orbit: 0, left: 750, top: 120 }, // Node.js
    { el: orbitalIcons[13], orbit: 1, left: 900, top: 200 }, // Git
    { el: orbitalIcons[14], orbit: 1, left: 900, top: 250 }, // Figma
    { el: orbitalIcons[15], orbit: 2, left: 700, top: 350 }, // Bootstrap
    { el: orbitalIcons[16], orbit: 2, left: 800, top: 370 }, // Sass
  ];
  function getAngleFromPosition(left, top, rx, ry) {
    const x = left;
    const y = top;
    const cosT = (x - centerX) / rx;
    const sinT = (y - centerY) / ry;
    return Math.atan2(sinT, cosT);
  }
  iconData.forEach(data => {
    const { el, orbit, left, top } = data;
    const { rx, ry } = orbits[orbit];
    data.angle = getAngleFromPosition(left, top, rx, ry);
  });
  let lastTimestamp = null;
  function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) / 1000; // seconds
    lastTimestamp = timestamp;
    iconData.forEach(data => {
      // Rotate each icon slowly around its ellipse
      const speed = 0.3 / (data.orbit + 1); // radians per second
      data.angle += speed * delta;
      const { rx, ry } = orbits[data.orbit];
      const x = centerX + rx * Math.cos(data.angle);
      const y = centerY + ry * Math.sin(data.angle);
      data.el.style.left = `${x}px`;
      data.el.style.top = `${y}px`;
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();

// Starfield background for skills section
(function() {
  const canvas = document.querySelector('.skills-stars-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w = 0, h = 0, dpr = window.devicePixelRatio || 1;
  const STAR_COUNT = 120;
  function resize() {
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  function randomStar() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.1 + 0.3,
      alpha: Math.random() * 0.5 + 0.5,
      twinkle: Math.random() * 0.04 + 0.01,
      phase: Math.random() * Math.PI * 2
    };
  }
  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(randomStar());
    }
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let star of stars) {
      star.phase += star.twinkle;
      let a = star.alpha + Math.sin(star.phase) * 0.25;
      ctx.globalAlpha = Math.max(0, Math.min(1, a));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }
  function animate() {
    draw();
    requestAnimationFrame(animate);
  }
  function onResize() {
    resize();
    createStars();
  }
  window.addEventListener('resize', onResize);
  // Init
  setTimeout(() => {
    resize();
    createStars();
    animate();
  }, 100);
})();

// Menu burger responsive et scroll fluide
(function() {
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const links = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  if (!burger || !mobileMenu) return;
  burger.addEventListener('click', function() {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  links.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
  // Scroll fluide pour tous les liens d'ancre
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// --- Effet lumineux cyclique sur le cercle central ---
document.addEventListener('DOMContentLoaded', function() {
  const orb = document.querySelector('.skills-central-orb');
  if (!orb) return;
  setInterval(() => {
    orb.classList.add('orb-flash');
    setTimeout(() => {
      orb.classList.remove('orb-flash');
    }, 500);
  }, 3000);
});

document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.portfolio-section .card');
  cards.forEach((card, i) => {
    card.classList.add('card-appear');
  });
  function revealCardsOnScroll() {
    const triggerBottom = window.innerHeight * 0.92;
    cards.forEach((card, i) => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
        setTimeout(() => {
          card.classList.add('card-visible');
        }, i * 120);
      }
    });
  }
  window.addEventListener('scroll', revealCardsOnScroll);
  revealCardsOnScroll();
});
