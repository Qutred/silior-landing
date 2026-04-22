/* ============================================================
   SILIOR.STORE — Main JavaScript
   Handles: header scroll, mobile menu, particles,
            scroll reveal, reviews slider, FAQ accordion,
            brand filter tabs, infinite column loop
   ============================================================ */

(function () {
  'use strict';

  /* ─── DOM REFERENCES ─────────────────────────────────────── */
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const particles = document.getElementById('particles');
  const reviewTrack = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');
  const dotsWrap = document.getElementById('reviewsDots');
  const faqItems = document.querySelectorAll('.faq__item');
  const brandTabs = document.querySelectorAll('.brand-tab');
  const productCards = document.querySelectorAll('.product-card');
  const reveals = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('section[id]');

  /* ─── HEADER SCROLL ──────────────────────────────────────── */
  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ─── ACTIVE NAV LINK (Intersection Observer) ────────────── */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`,
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ─── MOBILE MENU ────────────────────────────────────────── */
  function closeMobileMenu() {
    burger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* ─── FLOATING PARTICLES ─────────────────────────────────── */
  function createParticles(count = 35) {
    if (!particles) return;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';

      const size = Math.random() * 3 + 1.5;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const dur = Math.random() * 12 + 10;
      const drift = (Math.random() - 0.5) * 120 + 'px';
      const opacity = Math.random() * 0.4 + 0.15;

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        animation-duration: ${dur}s;
        animation-delay: -${delay}s;
        opacity: ${opacity};
        --drift: ${drift};
      `;

      particles.appendChild(p);
    }
  }

  createParticles();

  /* ─── SCROLL REVEAL (Intersection Observer) ─────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' },
  );

  reveals.forEach((el) => revealObserver.observe(el));

  /* ─── INFINITE COLUMN CLONE (seamless loop) ─────────────── */
  // Clone card children so columns scroll infinitely
  document.querySelectorAll('.products__col').forEach((col) => {
    const cards = [...col.children];
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      col.appendChild(clone);
    });
  });

  /* ─── BRAND FILTER TABS ──────────────────────────────────── */
  brandTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      brandTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const brand = tab.dataset.brand;

      productCards.forEach((card) => {
        if (brand === 'all' || card.dataset.brand === brand) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ─── REVIEWS SLIDER ─────────────────────────────────────── */
  const REVIEW_CARDS_VISIBLE = () => {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  let reviewIndex = 0;
  const reviewCards = document.querySelectorAll('.review-card');
  const totalReviews = reviewCards.length;

  function getMaxIndex() {
    return totalReviews - REVIEW_CARDS_VISIBLE();
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const max = getMaxIndex() + 1;
    for (let i = 0; i <= getMaxIndex(); i++) {
      const dot = document.createElement('button');
      dot.className = 'reviews__dot' + (i === reviewIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Відгук ${i + 1}`);
      dot.addEventListener('click', () => goToReview(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goToReview(index) {
    reviewIndex = Math.min(Math.max(index, 0), getMaxIndex());
    const cardWidth = reviewCards[0].offsetWidth + 24; // card + gap
    reviewTrack.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;

    // Update dots
    document
      .querySelectorAll('.reviews__dot')
      .forEach((d, i) => d.classList.toggle('active', i === reviewIndex));
  }

  prevBtn.addEventListener('click', () => goToReview(reviewIndex - 1));
  nextBtn.addEventListener('click', () => goToReview(reviewIndex + 1));

  buildDots();

  // Auto-play
  let autoPlay = setInterval(() => {
    goToReview(reviewIndex < getMaxIndex() ? reviewIndex + 1 : 0);
  }, 5000);

  reviewTrack.addEventListener('mouseenter', () => clearInterval(autoPlay));
  reviewTrack.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      goToReview(reviewIndex < getMaxIndex() ? reviewIndex + 1 : 0);
    }, 5000);
  });

  // Touch swipe
  let touchStartX = 0;

  reviewTrack.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true },
  );

  reviewTrack.addEventListener(
    'touchend',
    (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goToReview(diff > 0 ? reviewIndex + 1 : reviewIndex - 1);
      }
    },
    { passive: true },
  );

  // Rebuild on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goToReview(reviewIndex);
    }, 250);
  });

  /* ─── FAQ ACCORDION ──────────────────────────────────────── */
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq__q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach((i) => {
        i.classList.remove('open');
        i.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ─── SMOOTH ANCHOR SCROLL ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset =
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              '--header-h',
            ),
          ) || 72;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── WHY ICONS HOVER STAGGER ────────────────────────────── */
  const whyIcons = document.querySelectorAll('.why__icon');
  whyIcons.forEach((icon, i) => {
    icon.style.transitionDelay = `${i * 60}ms`;
  });

  /* ─── ADVANTAGE CARDS STAGGER ON REVEAL ─────────────────── */
  const advCards = document.querySelectorAll('.adv-card');
  advCards.forEach((card, i) => {
    card.style.setProperty('--delay', `${i * 80}ms`);
  });

  /* ─── PARALLAX on hero (subtle) ──────────────────────────── */
  const heroContent = document.querySelector('.hero__content');

  function onParallaxScroll() {
    const scrollY = window.scrollY;
    if (heroContent && scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.18}px)`;
      heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.85);
    }
  }

  window.addEventListener('scroll', onParallaxScroll, { passive: true });

  /* ─── STEP ICONS ANIMATE ON ENTER ────────────────────────── */
  const stepIcons = document.querySelectorAll('.step__icon');
  const stepObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${idx * 150}ms`;
          entry.target.classList.add('step-icon--visible');
          stepObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  stepIcons.forEach((icon) => stepObserver.observe(icon));

  /* ─── INIT COMPLETE ──────────────────────────────────────── */
  console.log(
    '%c✦ silior.store loaded',
    'color: #592b52; font-size: 14px; font-weight: bold;',
  );
})();
