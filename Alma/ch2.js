// Alma — Chapter Two : ch2.js
(function () {
  'use strict';

  /* ============================================================
     MIST PARTICLES (replaces ember for ch2 atmosphere)
  ============================================================ */
  const mistContainer = document.getElementById('mistContainer');

  function createMist() {
    if (!mistContainer) return;
    const mist = document.createElement('div');
    mist.className = 'mist-particle';

    const size = Math.random() * 120 + 60;
    const left = Math.random() * 110 - 5;
    const bottom = Math.random() * 50;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 10;
    const driftX = (Math.random() - 0.4) * 200;
    const driftY = -(Math.random() * 150 + 50);

    mist.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}vw;
      bottom: ${bottom}vh;
      --drift-x: ${driftX}px;
      --drift-y: ${driftY}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    mistContainer.appendChild(mist);

    setTimeout(() => {
      if (mist.parentNode) mist.parentNode.removeChild(mist);
    }, (duration + delay) * 1000 + 500);
  }

  // Spawn mist
  for (let i = 0; i < 5; i++) setTimeout(createMist, i * 600);
  setInterval(createMist, 3000);

  /* ============================================================
     ROOT LINES SVG in cover
  ============================================================ */
  const rootContainer = document.getElementById('rootLines');
  if (rootContainer) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0.06;';

    const centerX = 50;
    const centerY = 55;
    const branches = [
      [centerX, centerY, 50, 85, 35, 82],
      [centerX, centerY, 60, 90, 65, 88],
      [centerX, centerY, 40, 88, 42, 95],
      [centerX, centerY, 70, 80, 80, 85],
      [centerX, centerY, 30, 82, 20, 88],
      [centerX, centerY, 50, 95, 55, 100],
    ];

    branches.forEach(([x1, y1, x2, y2, x3, y3]) => {
      const path = document.createElementNS(svgNS, 'path');
      const cx1 = (x1 + x2) / 2 + (Math.random() - 0.5) * 10;
      const cy1 = (y1 + y2) / 2 + (Math.random() - 0.5) * 5;
      path.setAttribute('d', `M${x1},${y1} Q${cx1},${cy1} ${x2},${y2} Q${x2},${y2} ${x3},${y3}`);
      path.setAttribute('stroke', '#5aabab');
      path.setAttribute('stroke-width', '0.3');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-dasharray', '0.5 1');
      svg.appendChild(path);

      // Sub branches
      const branchPath = document.createElementNS(svgNS, 'path');
      const bx = x2 + (Math.random() - 0.5) * 15;
      const by = y2 + Math.random() * 8;
      branchPath.setAttribute('d', `M${x2},${y2} Q${(x2+bx)/2},${(y2+by)/2} ${bx},${by}`);
      branchPath.setAttribute('stroke', '#5aabab');
      branchPath.setAttribute('stroke-width', '0.15');
      branchPath.setAttribute('fill', 'none');
      svg.appendChild(branchPath);
    });

    rootContainer.appendChild(svg);
  }

  /* ============================================================
     PROGRESS BAR — teal for ch2
  ============================================================ */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #254848, #3d7a7a, #5aabab);
    z-index: 9998;
    transition: width 0.2s ease;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });

  /* ============================================================
     SCROLL REVEAL
  ============================================================ */
  const revealEls = document.querySelectorAll(
    '.prose-block, .act-marker, .dialogue-block, .inner-voice, ' +
    '.scene-break, .three-questions, .kel-observation, .element-compare, ' +
    '.warning-block, .training-log, .alma-teaching, .meditation-split, ' +
    '.atmosphere-note, .npc-encounter, .daily-routine, .intel-block, ' +
    '.final-question-block, .chapter-closing, .smile-note, .thought-block'
  );

  revealEls.forEach(el => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ============================================================
     THREE QUESTIONS — stagger reveal
  ============================================================ */
  const qCards = document.querySelectorAll('.question-card');
  qCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateX(-12px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const qSection = document.querySelector('.three-questions');
  if (qSection) {
    const qObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        qCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
          }, i * 200 + 100);
        });
        qObs.unobserve(qSection);
      }
    }, { threshold: 0.3 });
    qObs.observe(qSection);
  }

  /* ============================================================
     MEDITATION SPLIT — fade in both sides
  ============================================================ */
  const medSplit = document.querySelector('.meditation-split');
  if (medSplit) {
    const rPov = medSplit.querySelector('.raina-pov');
    const kPov = medSplit.querySelector('.kel-pov');
    if (rPov) { rPov.style.opacity = '0'; rPov.style.transition = 'opacity 0.8s ease'; }
    if (kPov) { kPov.style.opacity = '0'; kPov.style.transition = 'opacity 0.8s ease 0.4s'; }

    const medObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (rPov) rPov.style.opacity = '1';
        if (kPov) kPov.style.opacity = '1';
        medObs.unobserve(medSplit);
      }
    }, { threshold: 0.2 });
    medObs.observe(medSplit);
  }

  /* ============================================================
     FINAL QUESTION — answers slide up
  ============================================================ */
  const fqAnswers = document.querySelectorAll('.fq-answer');
  fqAnswers.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const fqBlock = document.querySelector('.final-question-block');
  if (fqBlock) {
    const fqObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fqAnswers.forEach((el, i) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 250 + 400);
        });
        fqObs.unobserve(fqBlock);
      }
    }, { threshold: 0.4 });
    fqObs.observe(fqBlock);
  }

  /* ============================================================
     ALMA TEACHING — teach blocks stagger
  ============================================================ */
  const teachBlocks = document.querySelectorAll('.teach-block');
  teachBlocks.forEach((block, i) => {
    block.style.opacity = '0';
    block.style.transform = 'translateY(10px)';
    block.style.transition = `opacity 0.5s ease ${i * 0.18}s, transform 0.5s ease ${i * 0.18}s`;
  });

  const almaTeach = document.querySelector('.alma-teaching');
  if (almaTeach) {
    const atObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        teachBlocks.forEach(block => {
          block.style.opacity = '1';
          block.style.transform = 'translateY(0)';
        });
        atObs.unobserve(almaTeach);
      }
    }, { threshold: 0.15 });
    atObs.observe(almaTeach);
  }

  /* ============================================================
     BEGIN BUTTON
  ============================================================ */
  const beginBtn = document.getElementById('beginBtn');
  const story = document.getElementById('story');
  if (beginBtn && story) {
    beginBtn.addEventListener('click', () => {
      story.scrollIntoView({ behavior: 'smooth' });
    });
  }

})();