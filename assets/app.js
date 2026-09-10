(() => {
  const body = document.body;
  const reducedQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');

  const brochureCss = document.createElement('link');
  brochureCss.rel = 'stylesheet';
  brochureCss.href = 'assets/brochure.css';
  document.head.appendChild(brochureCss);

  const motionToggle = document.querySelector('[data-motion-toggle]');
  const sticky = document.querySelector('[data-sticky-application]');
  const heroApplication = document.querySelector('#entrance [data-application-link]');
  const blockers = [...document.querySelectorAll('#information [data-application-link], #visit [data-application-link]')];

  const imageBase = 'assets/images/';
  const images = {
    hero: `${imageBase}hero-walk.webp`,
    explore: `${imageBase}explore-walk.webp`,
    students: `${imageBase}students-bench.webp`,
    learning: `${imageBase}learning-inquiry.webp`,
    energy: `${imageBase}energy-sports.webp`
  };

  const addHeroPhoto = () => {
    const stage = document.querySelector('.stage-world');
    if (!stage || stage.querySelector('.hero-brochure-photo')) return;
    stage.classList.add('has-brochure-photo');
    const img = new Image();
    img.className = 'hero-brochure-photo';
    img.src = images.hero;
    img.alt = '';
    img.setAttribute('aria-hidden','true');
    stage.prepend(img);
  };

  const replacePhotoSlot = (selector, src, alt, caption) => {
    const slot = document.querySelector(selector);
    if (!slot) return null;
    slot.classList.remove('visual-placeholder');
    slot.classList.add('brochure-frame');
    slot.replaceChildren();
    const img = new Image();
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    slot.appendChild(img);
    if (caption) {
      const cap = document.createElement('span');
      cap.className = 'brochure-caption';
      cap.textContent = caption;
      slot.appendChild(cap);
    }
    return slot;
  };

  addHeroPhoto();

  replacePhotoSlot(
    '[data-photo-slot="explore-main"]',
    images.explore,
    '校内を歩く目黒高校の生徒たち',
    '学校案内パンフレット2027・高校生の1日より'
  );

  replacePhotoSlot(
    '[data-photo-slot="students-main"]',
    images.students,
    '屋外で会話する目黒高校の生徒たち',
    '学校案内パンフレット2027・高校生の1日より'
  );

  const energy = replacePhotoSlot(
    '[data-photo-slot="experience"]',
    images.energy,
    '体育祭でリレーを走る生徒たち',
    'パンフレット掲載の体育祭の一場面。学校説明会当日の写真ではありません。'
  );
  if (energy) {
    const title = document.createElement('div');
    title.className = 'energy-title';
    title.innerHTML = '<small>05 / EXPERIENCE</small><h2 id="experience-title">この活気を、<br>会場で。</h2>';
    energy.appendChild(title);
  }

  const energyCopy = document.querySelector('.energy-copy');
  if (energyCopy && !energyCopy.querySelector('.event-ribbon')) {
    const ribbon = document.createElement('div');
    ribbon.className = 'event-ribbon';
    ribbon.textContent = 'パンフレット掲載の学校行事：体育祭 / 修学旅行（沖縄） / 目高祭 / 合唱祭';
    energyCopy.appendChild(ribbon);
  }

  const learningWall = document.querySelector('.learning-wall');
  if (learningWall) {
    learningWall.classList.add('brochure-enriched');
    learningWall.innerHTML = `
      <figure class="learning-photo-card">
        <img src="${images.learning}" alt="図書室で探究活動に取り組む生徒たち" loading="lazy" decoding="async">
        <figcaption>学校案内パンフレット2027・探究活動</figcaption>
      </figure>
      <div class="school-facts">
        <div><span>01</span><b>6つの東京都指定事業</b><small>進路指導・理数研究・ICT・英語・NIE・部活動の分野で指定</small></div>
        <div><span>02</span><b>放課後20時まで利用可能な自習室</b><small>パンフレット掲載の学習環境</small></div>
        <div><span>03</span><b>卒業生チューター制度</b><small>卒業生が学習や受験をサポートする仕組み</small></div>
      </div>
      <div class="outcome-strip">
        <small>2026年3月卒（第78期生） 合格大学ハイライト / 学校案内パンフレット2027掲載</small>
        <div class="outcome-numbers">
          <div><strong>25</strong><span>国公立大学・大学校</span></div>
          <div><strong>46</strong><span>早慶上理ICU</span></div>
          <div><strong>170</strong><span>GMARCH</span></div>
        </div>
      </div>`;
  }

  const visit = document.querySelector('.visit-scene');
  if (visit && !visit.querySelector('.visit-photo-bg')) {
    visit.classList.add('has-brochure-visit');
    const img = new Image();
    img.className = 'visit-photo-bg';
    img.src = images.students;
    img.alt = '';
    img.setAttribute('aria-hidden','true');
    visit.prepend(img);
  }

  const primaryDate = '10月24日（土）';
  const primarySlot = '午後開催';
  const passDate = document.querySelector('.pass-date');
  if (passDate) passDate.textContent = `${primaryDate} · ${primarySlot}`;

  const ticketRows = [...document.querySelectorAll('#information .info-row')];
  if (ticketRows[0]) ticketRows[0].querySelector('dd').textContent = primaryDate;
  if (ticketRows.length && !document.querySelector('#information .brochure-session')) {
    const session = document.createElement('div');
    session.className = 'info-row brochure-session';
    session.innerHTML = '<dt>開催区分</dt><dd>午後</dd>';
    ticketRows[0].after(session);
  }

  const ticketInfo = document.querySelector('#information .ticket-info');
  if (ticketInfo && !ticketInfo.querySelector('.brochure-source-note')) {
    const source = document.createElement('p');
    source.className = 'brochure-source-note';
    source.textContent = '開催日は学校案内パンフレット2027掲載情報。受付時刻・申込方法は公開後に更新します。';
    ticketInfo.appendChild(source);
  }

  const upcoming = [...document.querySelectorAll('.upcoming-item')];
  const upcomingDates = ['11月21日（土）・午後', '12月19日（土）・午前／午後'];
  upcoming.forEach((item, i) => {
    const p = item.querySelector('p');
    if (p && upcomingDates[i]) p.textContent = upcomingDates[i];
  });

  const visitText = document.querySelector('.visit-content > p:not(.scene-eyebrow)');
  if (visitText) visitText.innerHTML = `${primaryDate}・${primarySlot}<br>申込方法・受付開始日は後日公開`;

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
  document.querySelectorAll('.placeholder-tag').forEach(el => { el.hidden = true; });

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
    const studentScale = innerWidth < 901 ? .7 : 1;
    studentShadow?.animate([
      { transform:`translate3d(90px,10px,0) scale(${(studentScale * .9).toFixed(2)})`, opacity:0 },
      { offset:.55, opacity:.45 },
      { transform:`translate3d(0,0,0) scale(${studentScale})`, opacity:.76 }
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
