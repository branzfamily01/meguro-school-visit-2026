import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  escapeHtml, readJson, validateProject, resolveApplicationState,
  statePresentation, activeContent, photoById, formatJapaneseDate
} from './lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const modeArg = process.argv.find(a => a.startsWith('--mode='));
const mode = modeArg?.split('=')[1] || 'preview';
if (!['preview','production'].includes(mode)) throw new Error('modeはpreviewまたはproduction');

const data = {
  events: readJson(root, 'data/events.json'),
  content: readJson(root, 'data/content.json'),
  photos: readJson(root, 'data/photos.json'),
  site: readJson(root, 'data/site.json')
};
const { primary } = validateProject(data, {mode});
const status = resolveApplicationState(primary);
const app = statePresentation(primary, status);
const sections = Object.fromEntries(data.content.sections.map(s => [s.sectionId, activeContent(data.content, s.sectionId, mode)]));

const safeHeadings = {
  entrance:'2026年10月 学校説明会', discover:'学校説明会について', explore:'校内見学について',
  students:'学校生活について', experience:'当日の内容について', learning:'学校説明について',
  information:'10月 学校説明会', upcoming:'今後の開催予定', visit:'ご来校を検討される方へ'
};
const heading = (id, fallback) => escapeHtml(sections[id]?.suppressed ? (safeHeadings[id] || fallback) : (sections[id]?.heading || fallback));
const body = (id, fallback='') => escapeHtml(sections[id]?.suppressed ? fallback : (sections[id]?.body || fallback));
const dateLabel = formatJapaneseDate(primary);
const dateDetail = primary.date ? escapeHtml(dateLabel) : '2026年10月 ・ 日程の詳細は後日公開';

function applicationLink(placement, extraClass='') {
  const ext = app.external ? ' data-external="true"' : '';
  const note = app.external ? '<small class="external-note">正式な申込ページへ移動します</small>' : '';
  return `<div class="cta-wrap ${extraClass}"><a class="primary-cta" href="${escapeHtml(app.href)}" data-application-link data-placement="${escapeHtml(placement)}"${ext}>${escapeHtml(app.cta)}<span aria-hidden="true">↗</span></a>${note}</div>`;
}

function photoMarkup(id, className='', label='写真準備中', micro='PHOTO PREVIEW') {
  const p = photoById(data.photos, id);
  const published = p?.publicationStatus === 'published' && p.src;
  if (published) {
    return `<figure class="photo ${className}"><img src="${escapeHtml(p.src)}" alt="${escapeHtml(p.alt)}" width="${p.width}" height="${p.height}" loading="${id==='hero'?'eager':'lazy'}" decoding="async" style="--focal-mobile:${escapeHtml(p.focalMobile)};--focal-desktop:${escapeHtml(p.focalDesktop)}">${p.caption?`<figcaption>${escapeHtml(p.caption)}</figcaption>`:''}</figure>`;
  }
  const visible = mode === 'preview' ? `<span>${escapeHtml(micro)}</span><small>${escapeHtml(label)}</small>` : '';
  return `<div class="photo-placeholder ${className}" role="img" aria-label="${escapeHtml(label)}">${visible}</div>`;
}

function heroMedia() {
  const p = photoById(data.photos, 'hero');
  if (!(p?.publicationStatus === 'published' && p.src)) return '';
  return `<figure class="hero-photo"><img src="${escapeHtml(p.src)}" alt="${escapeHtml(p.alt)}" width="${p.width}" height="${p.height}" loading="eager" decoding="async" style="--focal-mobile:${escapeHtml(p.focalMobile)};--focal-desktop:${escapeHtml(p.focalDesktop)}">${p.caption?`<figcaption>${escapeHtml(p.caption)}</figcaption>`:''}</figure>`;
}

function informationRows() {
  const rows = [
    ['開催日', primary.date ? dateLabel : '詳細は後日公開'],
    ['受付時間', primary.receptionTime || '詳細は後日公開'],
    ['開始・終了予定', primary.startTime ? `${primary.startTime}${primary.endTime ? `〜${primary.endTime}` : '〜'}` : '詳細は後日公開'],
    ['場所', primary.venue || '詳細は後日公開'],
    ['対象', primary.audience || '詳細は後日公開'],
    ['申込状況', app.label],
    ['情報更新', data.site.updatedAt ? new Intl.DateTimeFormat('ja-JP',{dateStyle:'medium',timeZone:'Asia/Tokyo'}).format(new Date(data.site.updatedAt)) : '未設定']
  ];
  return rows.map(([k,v]) => `<div class="info-row"><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`).join('');
}

const upcoming = data.events.events.filter(e => e.id !== data.events.primaryEventId).map(e => `
  <article class="upcoming-item"><p class="month">${e.month}月</p><div><h3>${escapeHtml(e.title)}</h3><p>${e.date ? escapeHtml(formatJapaneseDate(e)) : '詳細は後日公開'}</p></div></article>`).join('');
const discoverItems = (sections.discover?.items || []).map((item,i) => `
  <a class="discover-row" href="#${escapeHtml(item.target)}"><span class="discover-no">0${i+1}</span><span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.text)}</small></span><span aria-hidden="true">↓</span></a>`).join('');
const themes = (sections.learning?.themes || []).filter(t => t.enabled).map(t => `<li>${escapeHtml(t.label)}</li>`).join('');

const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#ffffff">
<meta name="description" content="東京都立目黒高等学校 2026年10月学校説明会。目黒高校をひと足先に体験する特設サイトです。">
<title>学校説明会 2026｜東京都立目黒高等学校</title>
<link rel="stylesheet" href="assets/style.css">
<script src="assets/app.js" defer></script>
</head>
<body data-build-mode="${mode}">
<a class="skip-link" href="#main">本文へ移動</a>
<header class="site-header" id="top"><div class="header-inner"><a class="school-name" href="#top"><strong>${escapeHtml(data.site.schoolName)}</strong><span>MEGURO HIGH SCHOOL / 2026</span></a><nav aria-label="主要メニュー"><a href="#discover">体験内容</a><a href="#information">開催情報</a><a href="#information">申込案内</a></nav></div></header>
<main id="main">
<section class="hero section" id="entrance" aria-labelledby="hero-title">
  <div class="hero-copy"><p class="eyebrow">SCHOOL INFORMATION SESSION 2026</p><div class="hero-status"><strong>2026年10月 学校説明会</strong><span class="status-pill">${escapeHtml(app.label)}</span></div><h1 id="hero-title">${heading('entrance','目黒高校を、ひと足先に歩いてみよう。')}</h1><p class="lead">${body('entrance','目黒高校の雰囲気を、学校説明会で。')}</p><div class="hero-actions">${applicationLink('hero')}<a class="text-link" href="#discover">説明会でできることを見る ↓</a></div></div>
  <div class="hero-visual"><div class="hero-portal" role="img" aria-label="学校写真を配置するための空間">${heroMedia()}<div class="portal-depth" aria-hidden="true"><i class="portal-frame"></i><i class="portal-frame"></i><i class="portal-frame"></i><i class="portal-frame"></i><i class="portal-floor"></i><i class="portal-light"></i></div><span class="hero-scene-label" aria-hidden="true">A STEP INTO MEGURO</span><div class="glass-guide" aria-hidden="true"><span>ENTRANCE</span><i></i></div></div><aside class="event-glass" aria-label="開催概要"><div class="event-mini"><span>2026 OCTOBER</span><span>01 / ENTRANCE</span></div><strong>${primary.date ? escapeHtml(dateLabel) : '日程の詳細は後日公開'}</strong><p>日時・対象・正式申込ページは、確認でき次第ここから更新します。</p></aside></div>
</section>

<section class="section discover" id="discover" aria-labelledby="discover-title"><header class="section-head"><span class="section-label">DISCOVER / 02</span><h2 id="discover-title">${heading('discover','学校説明会で、出会えること。')}</h2></header><div class="discover-list">${discoverItems || '<p class="pending-copy">体験内容は確認後に公開します。</p>'}</div></section>

<section class="section explore" id="explore" aria-labelledby="explore-title"><header class="section-head"><span class="section-label">EXPLORE / 03</span><h2 id="explore-title">${heading('explore','生徒の案内で、校内へ。')}</h2></header><div class="explore-grid"><div>${photoMarkup('explore-main','photo-main','生徒による校内案内の写真をここへ','WALK WITH STUDENTS')}</div><div class="copy-column"><p>${body('explore','校内見学の内容は確認後に掲載します。')}</p><p class="pending-copy">見学施設・実施範囲は確認後に掲載します。</p><a class="text-link" href="#information">開催情報を見る ↓</a></div><div class="explore-sub">${photoMarkup('explore-sub','photo-sub','校内の日常写真をここへ','DAILY SCENE')}</div></div></section>

<section class="section students" id="students" aria-labelledby="students-title"><div class="students-grid"><div class="copy-column"><span class="section-label">MEET / 04</span><h2 id="students-title">${heading('students','目高をつくる、生徒たち。')}</h2><p>${body('students','目黒高校、通称「目高」。')}</p><p class="nickname-note">目黒高校、通称「目高」。</p></div>${photoMarkup('students-main','students-photo','生徒の自然な学校生活写真をここへ','MEET THE STUDENTS')}</div></section>

<section class="experience" id="experience" aria-labelledby="experience-title"><div class="experience-head section"><span class="section-label">EXPERIENCE / 05</span><h2 id="experience-title">${heading('experience','この活気を、会場で。')}</h2></div>${photoMarkup('experience','experience-photo','応援パフォーマンスの大写真をここへ','LIVE ENERGY')}<div class="experience-copy section"><p>${body('experience','応援パフォーマンスの詳細は確認後に掲載します。')}</p><p class="pending-copy">出演団体・披露内容・時間は確認後に掲載します。</p><a class="text-link" href="#information">10月の開催情報へ ↓</a></div></section>

<section class="section learning" id="learning" aria-labelledby="learning-title"><div class="learning-grid"><div><span class="section-label">LEARN / 06</span><h2 id="learning-title">${heading('learning','学びも、その先も。')}</h2><p>${body('learning','学校説明の内容は確認後に掲載します。')}</p></div><div>${themes?`<ul class="theme-list">${themes}</ul>`:'<div class="quiet-panel"><strong>学校説明の内容</strong><p>教育・学校生活・進路・入試など、当日扱うテーマは学校確認後に掲載します。</p></div>'}</div></div></section>

<section class="section information" id="information" aria-labelledby="information-title"><div class="info-date"><span class="section-label">INFORMATION / 07</span><p class="big-month">10</p><small>OCTOBER 2026</small></div><div class="info-body"><h2 id="information-title">${heading('information','10月 学校説明会')}</h2><p>${body('information','参加に必要な情報をここにまとめます。')}</p><dl>${informationRows()}</dl>${applicationLink('information','info-cta')}<p class="status-caution">受付開始後は、正式な申込ページへ直接案内します。</p></div></section>

<section class="section upcoming" id="upcoming" aria-labelledby="upcoming-title"><header class="section-head"><span class="section-label">UPCOMING / 08</span><h2 id="upcoming-title">${heading('upcoming','11月・12月の開催予定')}</h2></header><div class="upcoming-list">${upcoming}</div></section>

<section class="section visit" id="visit" aria-labelledby="visit-title"><div>${photoMarkup('visit','visit-photo','入口または生徒の写真をここへ','SEE YOU AT MEGURO')}</div><div class="visit-copy"><span class="section-label">VISIT / 09</span><h2 id="visit-title">${heading('visit','次は、目黒高校で会いましょう。')}</h2><p>${body('visit','実際の目黒高校で。')}</p><p class="visit-status">${dateDetail}<br>${escapeHtml(app.label)}</p>${applicationLink('visit')}</div></section>
</main>
<div class="sticky-application" data-sticky-application hidden>${applicationLink('sticky')}</div>
<footer class="site-footer"><div><strong>${escapeHtml(data.site.schoolName)}</strong><p>学校説明会特設サイト</p></div><div class="footer-actions">${data.site.officialUrl?`<a href="${escapeHtml(data.site.officialUrl)}">公式学校サイト</a>`:''}<button type="button" data-motion-toggle aria-pressed="false">動きを減らす</button></div><small>更新：${escapeHtml(data.site.updatedAt.slice(0,10))}</small></footer>
</body></html>`;

const dist = path.join(root, 'dist');
fs.rmSync(dist, {recursive:true, force:true});
fs.mkdirSync(path.join(dist,'assets'), {recursive:true});
fs.writeFileSync(path.join(dist,'index.html'), html);
fs.copyFileSync(path.join(root,'assets','style.css'), path.join(dist,'assets','style.css'));
fs.copyFileSync(path.join(root,'assets','app.js'), path.join(dist,'assets','app.js'));
// GitHub Pagesは制作プレビューとしてroot/index.htmlを使う。production buildでは上書きしない。
if (mode === 'preview') fs.writeFileSync(path.join(root,'index.html'), html);
console.log(`build complete: mode=${mode}, status=${status}`);
