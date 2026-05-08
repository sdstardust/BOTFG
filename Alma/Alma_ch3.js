// Alma — Chapter Three : ch3.js
(function () {
  'use strict';

  /* ============================================================
     SPARK PARTICLES (lightning/electric atmosphere)
  ============================================================ */
  const sparkContainer = document.getElementById('sparkContainer');

  function createSpark() {
    if (!sparkContainer) return;
    const spark = document.createElement('div');
    spark.className = 'spark-particle';

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const bottom = Math.random() * 30;
    const duration = Math.random() * 1.5 + 0.8;
    const delay = Math.random() * 5;
    const sx = (Math.random() - 0.5) * 100;
    const sy = -(Math.random() * 200 + 80);

    spark.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}vw;
      bottom: ${bottom}vh;
      --sx: ${sx}px;
      --sy: ${sy}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    sparkContainer.appendChild(spark);
    setTimeout(() => {
      if (spark.parentNode) spark.parentNode.removeChild(spark);
    }, (duration + delay) * 1000 + 300);
  }

  // Sparse at first, burst on lightning-burst section
  for (let i = 0; i < 3; i++) setTimeout(createSpark, i * 800);
  const sparksBase = setInterval(createSpark, 2500);

  // Burst more sparks when lightning section is visible
  const lbSection = document.querySelector('.lightning-burst');
  if (lbSection) {
    const lbObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        for (let i = 0; i < 12; i++) setTimeout(createSpark, i * 100);
        // Continue more frequent sparks for a while
        let bursts = 0;
        const burst = setInterval(() => {
          createSpark();
          bursts++;
          if (bursts > 30) clearInterval(burst);
        }, 200);
      }
    }, { threshold: 0.3 });
    lbObs.observe(lbSection);
  }

  /* ============================================================
     COVER LIGHTNING LINES (arena SVG)
  ============================================================ */
  const arenaContainer = document.getElementById('arenaLines');
  if (arenaContainer) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0.05;';

    // Ground perspective lines
    const lines = [
      [50, 50, 0, 100], [50, 50, 20, 100], [50, 50, 40, 100],
      [50, 50, 60, 100], [50, 50, 80, 100], [50, 50, 100, 100],
    ];
    lines.forEach(([x1, y1, x2, y2]) => {
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', x1); line.setAttribute('y1', y1);
      line.setAttribute('x2', x2); line.setAttribute('y2', y2);
      line.setAttribute('stroke', '#c8a040');
      line.setAttribute('stroke-width', '0.15');
      svg.appendChild(line);
    });

    // Jagged lightning bolt
    const bolt = document.createElementNS(svgNS, 'path');
    bolt.setAttribute('d', 'M50,5 L47,32 L53,32 L44,60 L52,60 L42,95');
    bolt.setAttribute('stroke', 'rgba(200,160,64,0.5)');
    bolt.setAttribute('stroke-width', '0.4');
    bolt.setAttribute('fill', 'none');
    svg.appendChild(bolt);

    arenaContainer.appendChild(svg);
  }

  /* ============================================================
     PROGRESS BAR — gold for ch3
  ============================================================ */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #7a5e20, #c8a040, #e8c060);
    z-index: 9998;
    transition: width 0.2s ease;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });

  /* ============================================================
     SCROLL REVEAL
  ============================================================ */
  const revealEls = document.querySelectorAll(
    '.prose-block, .act-marker, .dialogue-block, .inner-voice, ' +
    '.scene-break, .weapon-choice, .golem-block, .combat-log, ' +
    '.sereth-entrance, .lightning-burst, .memory-surface, ' +
    '.compass-explanation, .world-update, .element-training, ' +
    '.departure-block, .sereth-farewell, .ch3-closing, ' +
    '.atmosphere-note, .thought-block, .intel-block'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

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
     LIGHTNING BURST — stagger reactions
  ============================================================ */
  const lbrItems = document.querySelectorAll('.lbr-item');
  lbrItems.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const lbBlock = document.querySelector('.lightning-burst');
  if (lbBlock) {
    const lbItemObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        lbrItems.forEach((el, i) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 200 + 600);
        });
        lbItemObs.unobserve(lbBlock);
      }
    }, { threshold: 0.4 });
    lbItemObs.observe(lbBlock);
  }

  /* ============================================================
     DEPARTURE GIFTS — slide up
  ============================================================ */
  const depGifts = document.querySelectorAll('.dep-gift');
  depGifts.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const depBlock = document.querySelector('.departure-block');
  if (depBlock) {
    const depObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        depGifts.forEach((el, i) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 250 + 300);
        });
        depObs.unobserve(depBlock);
      }
    }, { threshold: 0.3 });
    depObs.observe(depBlock);
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
