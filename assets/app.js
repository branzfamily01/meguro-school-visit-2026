(() => {
  const body = document.body;
  const reducedQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const motionToggle = document.querySelector('[data-motion-toggle]');
  const sticky = document.querySelector('[data-sticky-application]');
  const heroApplication = document.querySelector('#entrance [data-application-link]');
  const blockers = [...document.querySelectorAll('#information [data-application-link], #visit [data-application-link]')];
  let manualReduce = false;
  try { manualReduce = localStorage.getItem('meguro-motion-reduced') === '1'; } catch {}

  const applyMotion = () => {
    const reduced = Boolean(reducedQuery?.matches || manualReduce);
    body.classList.toggle('motion-reduced', reduced);
    motionToggle?.setAttribute('aria-pressed', String(reduced));
    if (motionToggle) motionToggle.textContent = reduced ? '通常の動きに戻す' : '動きを減らす';
  };
  applyMotion();
  reducedQuery?.addEventListener?.('change', applyMotion);
  motionToggle?.addEventListener('click', () => {
    if (reducedQuery?.matches) return;
    manualReduce = !manualReduce;
    try { localStorage.setItem('meguro-motion-reduced', manualReduce ? '1' : '0'); } catch {}
    applyMotion();
  });

  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('is-ready')));

  const entrance = document.querySelector('.entrance');
  const stageWorld = document.querySelector('.stage-world');
  const corridor = document.querySelector('.corridor');
  const studentShadow = document.querySelector('.student-shadow');
  const glassA = document.querySelector('.glass-a');
  const glassB = document.querySelector('.glass-b');

  const playEntrance = () => {
    if (body.classList.contains('motion-reduced') || reducedQuery?.matches) return;
    corridor?.animate([
      { transform:'scale(1.08)', filter:'blur(1px)' },
      { transform:'scale(1)', filter:'blur(0)' }
    ], {duration:1800, delay:120, easing:'cubic-bezier(.2,.8,.2,1)', fill:'both'});
    studentShadow?.animate([
      { transform:'translate3d(90px,10px,0) scale(.9)', opacity:0 },
      { offset:.55, opacity:.45 },
      { transform:'translate3d(0,0,0) scale(1)', opacity:.76 }
    ], {duration:1900, delay:650, easing:'cubic-bezier(.22,.75,.22,1)', fill:'both'});
    glassA?.animate([
      { transform:'translate3d(18px,-8px,0) rotateY(-11deg) rotateZ(3deg)', opacity:.18 },
      { transform:'translate3d(0,0,0) rotateY(-7deg) rotateZ(2deg)', opacity:1 }
    ], {duration:1600, delay:450, easing:'ease-out', fill:'both'});
    glassB?.animate([
      { transform:'translate3d(-16px,14px,0) rotateY(12deg) rotateZ(-3deg)', opacity:.1 },
      { transform:'translate3d(0,0,0) rotateY(8deg) rotateZ(-2deg)', opacity:1 }
    ], {duration:1750, delay:520, easing:'ease-out', fill:'both'});
  };
  setTimeout(playEntrance, 80);

  let stageTicking = false;
  const updateStageDepth = () => {
    stageTicking = false;
    if (!entrance || !stageWorld || body.classList.contains('motion-reduced') || innerWidth < 901) return;
    const r = entrance.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
    stageWorld.style.transform = `scale(${(1 + p * .045).toFixed(4)}) translateY(${Math.round(p * 18)}px)`;
    if (glassA) glassA.style.translate = `${Math.round(p * -16)}px ${Math.round(p * 10)}px`;
    if (glassB) glassB.style.translate = `${Math.round(p * 11)}px ${Math.round(p * -8)}px`;
  };
  addEventListener('scroll', () => {
    if (!stageTicking) { stageTicking = true; requestAnimationFrame(updateStageDepth); }
  }, {passive:true});
  addEventListener('resize', updateStageDepth, {passive:true});

  const revealTargets = document.querySelectorAll('.scene-copy, .exhibit, .walk-window, .people-portrait, .learning-wall, .ticket-layout, .upcoming-item, .energy-copy');
  revealTargets.forEach(el => el.setAttribute('data-reveal',''));
  if ('IntersectionObserver' in window && !reducedQuery?.matches) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -5% 0px'});
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  if (sticky && heroApplication && 'IntersectionObserver' in window) {
    let heroVisible = true;
    const visibleBlockers = new Set();
    const update = () => {
      const smallLandscape = matchMedia('(orientation: landscape) and (max-height: 560px)').matches;
      sticky.hidden = heroVisible || visibleBlockers.size > 0 || smallLandscape;
    };
    new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; update(); }, {threshold:.08}).observe(heroApplication);
    const blockerObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visibleBlockers.add(entry.target) : visibleBlockers.delete(entry.target));
      update();
    }, {threshold:.15});
    blockers.forEach(el => blockerObserver.observe(el));
  }
})();
