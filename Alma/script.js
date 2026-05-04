// Alma — Chapter One : Interactive Script

(function () {
  'use strict';

  /* ============================================================
     BEGIN BUTTON — scroll to story
  ============================================================ */
  const beginBtn = document.getElementById('beginBtn');
  const story = document.getElementById('story');

  if (beginBtn && story) {
    beginBtn.addEventListener('click', () => {
      story.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ============================================================
     EMBER PARTICLES
  ============================================================ */
  const emberContainer = document.getElementById('embers');
  const MAX_EMBERS = 18;

  function createEmber() {
    if (!emberContainer) return;
    const ember = document.createElement('div');
    ember.className = 'ember-particle';

    const size = Math.random() * 3 + 1.5;
    const left = Math.random() * 100;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 6;
    const drift = (Math.random() - 0.5) * 120;

    ember.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}vw;
      bottom: -10px;
      --drift: ${drift}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    emberContainer.appendChild(ember);

    setTimeout(() => {
      if (ember.parentNode) ember.parentNode.removeChild(ember);
    }, (duration + delay) * 1000 + 500);
  }

  // Spawn embers periodically — more when near cover fire scene
  let emberInterval = setInterval(createEmber, 900);

  // Initial burst
  for (let i = 0; i < 6; i++) {
    setTimeout(createEmber, i * 200);
  }

  /* ============================================================
     SCROLL REVEAL
  ============================================================ */
  const revealElements = document.querySelectorAll(
    '.prose-block, .act-marker, .dialogue-block, .inner-voice, ' +
    '.char-intro, .sound-effect-sequence, .thought-block, ' +
    '.alma-reveal, .lie-reveal, .inventory-block, .letter-block, ' +
    '.char-entrance, .chapter-end, .chapter-footer, .scene-break'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  /* ============================================================
     EMBER INTENSITY — ramp up near act1 (fire scene)
  ============================================================ */
  const act1 = document.getElementById('act1');

  const intensityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        clearInterval(emberInterval);
        emberInterval = setInterval(createEmber, 400);
      } else {
        clearInterval(emberInterval);
        emberInterval = setInterval(createEmber, 1400);
      }
    });
  }, { threshold: 0.1 });

  if (act1) intensityObserver.observe(act1);

  /* ============================================================
     READING PROGRESS
  ============================================================ */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #8a3a16, #d4622a, #f08050);
    z-index: 9998;
    transition: width 0.2s ease;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(progress, 100) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ============================================================
     SOUND EFFECT STAGGER ANIMATION
  ============================================================ */
  const soundSeqs = document.querySelectorAll('.sound-effect-sequence');

  soundSeqs.forEach(seq => {
    const items = seq.querySelectorAll('.sound-effect, .sound-desc');
    items.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      item.style.transform = 'translateX(-10px)';
    });

    const seqObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, i * 180);
        });
        seqObserver.unobserve(seq);
      }
    }, { threshold: 0.3 });

    seqObserver.observe(seq);
  });

  /* ============================================================
     ALMA SHIMMER — click to pulse
  ============================================================ */
  const almaReveals = document.querySelectorAll('.alma-reveal');
  almaReveals.forEach(el => {
    el.style.cursor = 'default';
    el.addEventListener('click', () => {
      const text = el.querySelector('.alma-text');
      if (!text) return;
      text.style.transition = 'text-shadow 0.1s ease';
      text.style.textShadow = '0 0 80px rgba(212, 98, 42, 1), 0 0 40px rgba(240, 128, 80, 0.8)';
      setTimeout(() => {
        text.style.textShadow = '';
      }, 600);
    });
  });

  /* ============================================================
     LETTER UNFOLD ANIMATION
  ============================================================ */
  const letterBlock = document.querySelector('.letter-block');
  if (letterBlock) {
    letterBlock.style.opacity = '0';
    letterBlock.style.transform = 'translateY(8px) rotate(-0.3deg)';
    letterBlock.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    const letterObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        letterBlock.style.opacity = '1';
        letterBlock.style.transform = 'translateY(0) rotate(0deg)';
        letterObs.unobserve(letterBlock);
      }
    }, { threshold: 0.2 });

    letterObs.observe(letterBlock);
  }

  /* ============================================================
     PLACE REVEAL ANIMATION
  ============================================================ */
  const placeReveal = document.querySelector('.place-reveal-name');
  if (placeReveal) {
    placeReveal.style.opacity = '0';
    placeReveal.style.letterSpacing = '0.6em';
    placeReveal.style.transition = 'opacity 1s ease, letter-spacing 1s ease, text-shadow 1s ease';

    const placeObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          placeReveal.style.opacity = '1';
          placeReveal.style.letterSpacing = '0.3em';
          placeReveal.style.textShadow = '0 0 30px rgba(90, 48, 96, 0.5)';
        }, 300);
        placeObs.unobserve(placeReveal);
      }
    }, { threshold: 0.5 });

    placeObs.observe(placeReveal);
  }

})();
