import fs from 'node:fs';
import path from 'node:path';

export const APPLICATION_STATES = [
  'unknown','scheduled','open','full','closed','ended','postponed','cancelled'
];

export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function assertHttpsOrNull(value, label) {
  if (value == null || value === '') return;
  let url;
  try { url = new URL(value); } catch { throw new Error(`${label}: URL形式が不正です`); }
  if (url.protocol !== 'https:') throw new Error(`${label}: HTTPS URLのみ使用できます`);
}

export function formatJapaneseDate(event) {
  if (!event.date) return `${event.year}年${event.month}月`;
  const d = new Date(`${event.date}T00:00:00+09:00`);
  if (Number.isNaN(d.getTime())) throw new Error(`${event.id}: dateが不正です`);
  const weekday = new Intl.DateTimeFormat('ja-JP', { weekday: 'short', timeZone: 'Asia/Tokyo' }).format(d);
  const day = Number(event.date.slice(8, 10));
  return `${event.month}月${day}日（${weekday}）`;
}

export function resolveApplicationState(event, now = new Date()) {
  let status = event.application?.status ?? 'unknown';
  if (!APPLICATION_STATES.includes(status)) throw new Error(`${event.id}: 未対応のapplication.status=${status}`);

  const closesAt = event.application?.closesAt ? new Date(event.application.closesAt) : null;
  if (status === 'open' && closesAt && !Number.isNaN(closesAt.getTime()) && now > closesAt) status = 'closed';

  if (status === 'open' && event.date && event.endTime) {
    const end = new Date(`${event.date}T${event.endTime}:00+09:00`);
    if (!Number.isNaN(end.getTime()) && now > end) status = 'ended';
  }
  return status;
}

export function validateProject({events, content, photos, site}, {mode='preview'} = {}) {
  const errors = [];
  if (!events.primaryEventId) errors.push('events.primaryEventId が必要です');
  const primary = events.events.find(e => e.id === events.primaryEventId);
  if (!primary) errors.push('primaryEventId に一致するイベントがありません');

  for (const event of events.events) {
    if (event.timezone !== 'Asia/Tokyo') errors.push(`${event.id}: timezoneはAsia/Tokyoにしてください`);
    if (!APPLICATION_STATES.includes(event.application?.status)) errors.push(`${event.id}: application.statusが不正です`);
    try { assertHttpsOrNull(event.application?.url, `${event.id}.application.url`); } catch(e) { errors.push(e.message); }
    try { assertHttpsOrNull(event.application?.noticeUrl, `${event.id}.application.noticeUrl`); } catch(e) { errors.push(e.message); }
    if (event.date && !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) errors.push(`${event.id}: dateはYYYY-MM-DD形式にしてください`);
    for (const key of ['receptionTime','startTime','endTime']) {
      if (event[key] && !/^([01]\d|2[0-3]):[0-5]\d$/.test(event[key])) errors.push(`${event.id}.${key}: HH:mm形式にしてください`);
    }
    if (event.application?.status === 'open') {
      const required = ['date','startTime','venue','audience'];
      for (const key of required) if (!event[key]) errors.push(`${event.id}: openには${key}が必要です`);
      for (const key of ['url','checkedAt']) if (!event.application?.[key]) errors.push(`${event.id}: openにはapplication.${key}が必要です`);
    }
  }

  for (const photo of photos.photos) {
    if (photo.publicationStatus === 'published') {
      if (!photo.src || !photo.alt || !photo.width || !photo.height) errors.push(`${photo.id}: published写真にはsrc/alt/width/heightが必要です`);
      if (photo.src && /^(javascript:|data:)/i.test(photo.src)) errors.push(`${photo.id}: 危険な画像URLです`);
    }
  }

  try { assertHttpsOrNull(site.officialUrl, 'site.officialUrl'); } catch(e) { errors.push(e.message); }

  if (mode === 'production') {
    const unapprovedEnabled = content.sections.filter(s => s.enabled && s.approvalStatus !== 'approved');
    // 未承認本文は本番で非表示にするため、ここでは失敗させない。
    // 制作TODOが本文へ漏れないことはrenderer側で保証する。
    void unapprovedEnabled;
  }

  if (errors.length) throw new Error(errors.join('\n'));
  return { primary };
}

export function readJson(root, rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
}

export function statePresentation(event, status) {
  const map = {
    unknown: {label:'申込方法・受付開始日は後日公開', cta:'開催情報を見る', href:'#information', enabled:true, external:false},
    scheduled: {label:'受付開始前', cta:'申込開始の案内を見る', href:'#information', enabled:true, external:false},
    open: {label:'申込受付中', cta:'10月学校説明会に申し込む', href:event.application.url, enabled:true, external:true},
    full: {label:'定員に達しました', cta:'今後の開催予定を見る', href:'#upcoming', enabled:true, external:false},
    closed: {label:'申込受付は終了しました', cta:'今後の開催予定を見る', href:'#upcoming', enabled:true, external:false},
    ended: {label:'10月学校説明会は終了しました', cta:'今後の開催予定を見る', href:'#upcoming', enabled:true, external:false},
    postponed: {label:'開催延期・詳細は案内をご確認ください', cta:'開催に関するお知らせ', href:event.application.noticeUrl || '#information', enabled:true, external:Boolean(event.application.noticeUrl)},
    cancelled: {label:'開催中止', cta:'開催に関するお知らせ', href:event.application.noticeUrl || '#information', enabled:true, external:Boolean(event.application.noticeUrl)}
  };
  return map[status];
}

export function activeContent(content, id, mode) {
  const section = content.sections.find(s => s.sectionId === id && s.enabled);
  if (!section) return null;
  if (mode === 'production' && section.approvalStatus !== 'approved') return {sectionId:section.sectionId, enabled:true, approvalStatus:section.approvalStatus, heading:'', body:'', suppressed:true};
  return section;
}

export function photoById(photos, id) {
  return photos.photos.find(p => p.id === id) || null;
}
