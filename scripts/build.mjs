import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml, readJson, validateProject, resolveApplicationState, statePresentation, formatJapaneseDate } from './lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const modeArg = process.argv.find(a => a.startsWith('--mode='));
const mode = modeArg?.split('=')[1] || 'preview';
if (!['preview','production'].includes(mode)) throw new Error('modeはpreviewまたはproduction');

const data = {
  events: readJson(root,'data/events.json'),
  content: readJson(root,'data/content.json'),
  photos: readJson(root,'data/photos.json'),
  site: readJson(root,'data/site.json')
};
const { primary } = validateProject(data,{mode});
const status = resolveApplicationState(primary);
const app = statePresentation(primary,status);
const withSession = (event, label) => event.sessionLabel ? `${label}・${event.sessionLabel}` : label;
const dateDetail = primary.date
  ? withSession(primary, formatJapaneseDate(primary))
  : '2026年10月 ・ 日程の詳細は後日公開';
const updated = data.site.updatedAt ? data.site.updatedAt.slice(0,10) : '未設定';
const externalNote = app.external ? '<small class="external-note">正式な申込ページへ移動します</small>' : '';

const infoRows = [
  ['開催日', primary.date ? formatJapaneseDate(primary) : '詳細は後日公開'],
  ['開催区分', primary.sessionLabel || '詳細は後日公開'],
  ['受付時間', primary.receptionTime || '詳細は後日公開'],
  ['開始・終了予定', primary.startTime ? `${primary.startTime}${primary.endTime ? `〜${primary.endTime}` : '〜'}` : '詳細は後日公開'],
  ['場所', primary.venue || '詳細は後日公開'],
  ['対象', primary.audience || '詳細は後日公開'],
  ['申込状況', app.label],
  ['情報更新', data.site.updatedAt ? new Intl.DateTimeFormat('ja-JP',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Tokyo'}).format(new Date(data.site.updatedAt)) : '未設定']
].map(([k,v]) => `<div class="info-row"><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`).join('');

const upcoming = data.events.events.filter(e => e.id !== data.events.primaryEventId).map(e => `
  <article class="upcoming-item">
    <strong>${e.month}</strong>
    <div><h3>${escapeHtml(e.title)}</h3><p>${e.date ? escapeHtml(withSession(e, formatJapaneseDate(e))) : '詳細は後日公開'}</p></div>
    <span>2026 / ${String(e.month).padStart(2,'0')}</span>
  </article>`).join('');

let html = fs.readFileSync(path.join(root,'templates/index.html'),'utf8');
const replacements = {
  BUILD_MODE: mode,
  SCHOOL_NAME: escapeHtml(data.site.schoolName),
  DATE_DETAIL: escapeHtml(dateDetail),
  STATUS_LABEL: escapeHtml(app.label),
  CTA_HREF: escapeHtml(app.href),
  CTA_LABEL: escapeHtml(app.cta),
  EXTERNAL_NOTE: externalNote,
  INFO_ROWS: infoRows,
  UPCOMING: upcoming,
  UPDATED_DATE: escapeHtml(updated)
};
for (const [key,value] of Object.entries(replacements)) html = html.replaceAll(`{{${key}}}`, value);
if (/{{[A-Z_]+}}/.test(html)) throw new Error('テンプレートの未解決トークンがあります');

const dist = path.join(root,'dist');
fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(dist,{recursive:true});
fs.writeFileSync(path.join(dist,'index.html'),html);
fs.cpSync(path.join(root,'assets'),path.join(dist,'assets'),{recursive:true});

// GitHub Pagesはデザインレビュー用。previewビルド時だけルートへ同期する。
if (mode === 'preview') fs.writeFileSync(path.join(root,'index.html'),html);
console.log(`build complete: mode=${mode}, status=${status}`);
