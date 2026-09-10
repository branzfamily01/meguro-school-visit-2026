import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));

test('学校説明会の日程はeventsデータに一元化されている', () => {
  const { events } = readJson('data/events.json');
  const byId = Object.fromEntries(events.map(event => [event.id, event]));
  assert.equal(byId['meguro-2026-10'].date, '2026-10-24');
  assert.equal(byId['meguro-2026-10'].sessionLabel, '午後');
  assert.equal(byId['meguro-2026-11'].date, '2026-11-21');
  assert.equal(byId['meguro-2026-11'].sessionLabel, '午後');
  assert.equal(byId['meguro-2026-12'].date, '2026-12-19');
  assert.equal(byId['meguro-2026-12'].sessionLabel, '午前・午後');

  const appJs = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
  for (const text of ['10月24日（土）', '11月21日（土）', '12月19日（土）']) {
    assert.equal(appJs.includes(text), false, `${text} をapp.jsへ重複直書きしない`);
  }
});

test('パンフレット採用写真は公開可能なWebPとして揃っている', () => {
  const { photos } = readJson('data/photos.json');
  const requiredIds = ['hero','explore-main','students-main','experience','culture','club','learning','visit'];
  const byId = Object.fromEntries(photos.map(photo => [photo.id, photo]));

  for (const id of requiredIds) {
    const photo = byId[id];
    assert.ok(photo, `${id} がphotos.jsonに必要`);
    assert.equal(photo.publicationStatus, 'published');
    assert.match(photo.src, /^assets\/images\/.+\.webp$/);
    assert.ok(photo.alt && photo.alt.length > 0, `${id} にaltが必要`);
    assert.ok(Number.isInteger(photo.sourcePage) && photo.sourcePage >= 1 && photo.sourcePage <= 16);

    const absolute = path.join(root, photo.src);
    assert.ok(fs.existsSync(absolute), `${photo.src} が存在すること`);
    assert.ok(fs.statSync(absolute).size > 1000, `${photo.src} が空画像でないこと`);
  }
});

test('学校生活写真を学校説明会当日の写真と誤認させない注記を保持する', () => {
  const appJs = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
  assert.match(appJs, /学校説明会当日の写真ではありません/);
  assert.match(appJs, /学校案内パンフレット2027/);
});
