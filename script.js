// ==========================================================================
// Thippeswamy K R — Portfolio interactions
// Restrained by design: nav state, mobile menu, scroll reveal, row click-through.
// No motion here exists purely for decoration.
// ==========================================================================

(function () {
  'use strict';

  /* ---------- Sticky nav state ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* ---------- Scroll reveal (IntersectionObserver, one-shot) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Slider ("More Work") ----------
     Pages by one full viewport width at a time, so it always slides
     exactly as many cards as are visible (3 desktop / 2 tablet / 1 mobile)
     without hardcoding a card count. Works with any number of cards. */
  const slider = document.getElementById('workSlider');
  if (slider) {
    const viewport = slider.querySelector('.slider-viewport');
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const countEl = document.getElementById('sliderCount');

    let offset = 0;

    const maxOffset = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

    const render = () => {
      const max = maxOffset();
      offset = Math.min(Math.max(offset, 0), max);
      track.style.transform = `translateX(-${offset}px)`;

      const step = viewport.clientWidth || 1;
      const totalPages = Math.max(1, Math.ceil((max + step) / step));
      const currentPage = Math.min(totalPages, Math.round(offset / step) + 1);
      countEl.textContent = `${currentPage} / ${totalPages}`;

      prevBtn.disabled = offset <= 0;
      nextBtn.disabled = offset >= max - 1;
    };

    prevBtn.addEventListener('click', () => {
      offset -= viewport.clientWidth;
      render();
    });
    nextBtn.addEventListener('click', () => {
      offset += viewport.clientWidth;
      render();
    });
    window.addEventListener('resize', render);

    render();
  }

  /* ---------- Smooth-scroll to section ----------
     Offset is handled by `scroll-margin-top` in CSS (see section[id]),
     so this just needs to trigger the native smooth scroll. */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();