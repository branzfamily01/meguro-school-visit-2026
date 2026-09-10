(() => {
  const root = document.documentElement;
  const body = document.body;
  const reducedQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('[data-motion-toggle]');
  const sticky = document.querySelector('[data-sticky-application]');
  const heroLink = document.querySelector('#entrance [data-application-link]');
  const infoLinks = [...document.querySelectorAll('#information [data-application-link], #visit [data-application-link]')];

  let manualReduce = false;
  try { manualReduce = localStorage.getItem('meguro-motion-reduced') === '1'; } catch {}

  function applyMotionPreference() {
    const reduced = Boolean(reducedQuery?.matches || manualReduce);
    body.classList.toggle('motion-reduced', reduced);
    toggle?.setAttribute('aria-pressed', String(reduced));
    if (toggle) toggle.textContent = reduced ? '通常の動きに戻す' : '動きを減らす';
  }
  applyMotionPreference();
  reducedQuery?.addEventListener?.('change', applyMotionPreference);
  toggle?.addEventListener('click', () => {
    if (reducedQuery?.matches) return;
    manualReduce = !manualReduce;
    try { localStorage.setItem('meguro-motion-reduced', manualReduce ? '1' : '0'); } catch {}
    applyMotionPreference();
  });

  if (sticky && heroLink && 'IntersectionObserver' in window) {
    let heroVisible = true;
    let blockingVisible = false;
    const updateSticky = () => {
      const smallLandscape = matchMedia('(orientation: landscape) and (max-height: 500px)').matches;
      sticky.hidden = heroVisible || blockingVisible || smallLandscape;
    };
    new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; updateSticky(); }, {threshold:0.05}).observe(heroLink);
    const blocker = new IntersectionObserver(entries => {
      blockingVisible = entries.some(e => e.isIntersecting);
      updateSticky();
    }, {threshold:0.2});
    infoLinks.forEach(el => blocker.observe(el));
  }

  const canAnimate = () => !body.classList.contains('motion-reduced') && innerWidth >= 1024;
  let ticking = false;
  const updateParallax = () => {
    ticking = false;
    if (!canAnimate()) return;
    const hero = document.querySelector('.hero-photo');
    const explore = document.querySelector('.photo-main');
    if (hero) {
      const r = hero.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, 1 - r.top / innerHeight));
      hero.style.transform = `translateY(${Math.round(p*12)}px) scale(${(1 + p*0.025).toFixed(4)})`;
    }
    if (explore) {
      const r = explore.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, 1 - r.top / innerHeight));
      explore.style.transform = `translateY(${Math.round((p-.5)*24)}px)`;
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); } }, {passive:true});
  addEventListener('resize', updateParallax, {passive:true});
  updateParallax();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      const id = a.getAttribute('href')?.slice(1);
      if (!id) return;
      document.getElementById(id)?.setAttribute('tabindex','-1');
    });
  });

  // analytics.enabled=false が初期値。個人情報や申込IDは一切保存しない。
  void root;
})();
