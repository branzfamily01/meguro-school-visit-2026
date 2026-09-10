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
