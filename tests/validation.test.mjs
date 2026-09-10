import test from 'node:test';
import assert from 'node:assert/strict';
import {validateProject, resolveApplicationState, statePresentation, escapeHtml, formatJapaneseDate} from '../scripts/lib.mjs';

const base = () => ({
  events:{primaryEventId:'e10',events:[{id:'e10',year:2026,month:10,date:null,timezone:'Asia/Tokyo',receptionTime:null,startTime:null,endTime:null,venue:null,audience:null,application:{status:'unknown',url:null,opensAt:null,closesAt:null,checkedAt:null,noticeUrl:null}}]},
  content:{sections:[]}, photos:{photos:[]}, site:{officialUrl:null}
});

test('unknownは未定情報のまま有効', () => assert.doesNotThrow(() => validateProject(base())));

test('openは必須情報が欠けると失敗', () => {
  const d=base(); d.events.events[0].application.status='open'; d.events.events[0].application.url='https://example.jp/apply';
  assert.throws(() => validateProject(d), /openにはdateが必要/);
});

test('openは必要情報とHTTPS URLが揃えば有効', () => {
  const d=base(), e=d.events.events[0]; Object.assign(e,{date:'2026-10-24',startTime:'14:00',venue:'体育館',audience:'中学生・保護者'}); Object.assign(e.application,{status:'open',url:'https://example.jp/apply',checkedAt:'2026-10-01T09:00:00+09:00'});
  assert.doesNotThrow(() => validateProject(d));
});

test('javascript URLを拒否', () => {
  const d=base(), e=d.events.events[0]; Object.assign(e,{date:'2026-10-24',startTime:'14:00',venue:'体育館',audience:'中学生'}); Object.assign(e.application,{status:'open',url:'javascript:alert(1)',checkedAt:'2026-10-01T09:00:00+09:00'});
  assert.throws(() => validateProject(d), /HTTPS URLのみ/);
});

test('受付終了時刻後のopenはclosedへ安全側変更', () => {
  const e=base().events.events[0]; e.application.status='open'; e.application.closesAt='2026-10-01T00:00:00+09:00';
  assert.equal(resolveApplicationState(e,new Date('2026-10-02T00:00:00+09:00')),'closed');
});

test('自動的にscheduledからopenへはしない', () => {
  const e=base().events.events[0]; e.application.status='scheduled'; e.application.opensAt='2026-09-01T00:00:00+09:00';
  assert.equal(resolveApplicationState(e,new Date('2026-10-01T00:00:00+09:00')),'scheduled');
});

test('全8状態に表示定義がある', () => {
  const e=base().events.events[0];
  for(const s of ['unknown','scheduled','open','full','closed','ended','postponed','cancelled']) assert.ok(statePresentation(e,s));
});

test('HTML escape', () => assert.equal(escapeHtml('<script>"x"</script>'),'&lt;script&gt;&quot;x&quot;&lt;/script&gt;'));

test('日本時間の日付表示が前日にずれない', () => {
  const e=base().events.events[0]; e.date='2026-10-24';
  assert.match(formatJapaneseDate(e), /^10月24日/);
});
