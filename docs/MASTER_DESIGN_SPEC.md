# 東京都立目黒高等学校 学校説明会特設サイト
# MASTER DESIGN SPEC v1.0 — IMPLEMENTATION BASELINE

設計日：2026-09-10 JST
実装基準化：2026-09-10 JST

> 本ファイルは、同日ユーザー提示のMASTER DESIGN SPEC v1.0を実装用の正本として整理したもの。旧リポジトリの実装は設計根拠にしない。

## 1. DESIGN CONCEPT
**目黒高校を、ひと足先に歩いてみよう。**

写真と短い言葉で「来校前の小さな学校体験」を作る。体験の主役は生徒。Glass/3Dは生徒のいる場所へ近づく空間表現と校内案内表示のためだけに使う。

固定原則：写真で空気、短文で意味、開催情報で安心。1場面1メッセージ。ワクワク60／信頼40を目安とするが正確性を最優先する。

## 2. EXPERIENCE STORY
入口 → 体験予告 → 校内 → 生徒 → 活気 → 学校説明 → 開催情報 → 正式申込。

実際の校内見学経路・当日順序を推測して再現しない。Web編集上の順序として扱う。

## 3. SITE MAP
1ページ9場面：
1. entrance / ENTRANCE
2. discover / DISCOVER
3. explore / EXPLORE
4. students / MEET
5. experience / EXPERIENCE
6. learning / LEARN
7. information / INFORMATION
8. upcoming / UPCOMING EVENTS
9. visit / VISIT

初版でログイン、フォーム、写真モーダル、別探検ページを作らない。

## 4. SECTION DESIGN
### ENTRANCE
正式校名、2026年10月説明会、日付または未定、申込状態、Heroコピー、主CTA、体験リンク。PCは写真と情報を横配置、スマホは情報を写真より先にDOM配置。

### DISCOVER
「生徒と校内」「応援パフォーマンス」「学校の学び」の3項目。カード化せず罫線と番号で構成。

### EXPLORE
生徒による施設案内を最初の大きな体験として扱う。公開初版写真最大3枚。場所や見学範囲は確認後。

### MEET
建物から人へ視点を移す。自然なやり取りの写真を優先。架空の生徒コメントは作らない。

### EXPERIENCE
応援パフォーマンスを全幅大写真で扱う。出演団体・内容・時間は確認後。自動再生動画や音声なし。

### LEARN
白背景の静かな情報場面。学校説明で扱うテーマは確認済みのものだけ公開。

### INFORMATION
日付・受付・開始終了・場所・対象・注意事項・申込期間・状態・更新日を一か所へ集約。未確定必須項目は「詳細は後日公開」。

### UPCOMING
11月・12月は写真なしの静かな2行。10月より視覚的優先度を下げる。

### VISIT
実際の来校へつなげる締め。Heroと同じ場所の別写真推奨。状態に応じCTA文言も変える。

## 5. HERO
PCは12列、主コピー5〜6列、写真側を広く。64〜88px見出し。高さ固定による欠落は禁止。

スマホ375〜430px基準：正式校名 → 2026年10月説明会 → 日付/未定＋状態 → 主コピー → CTA → 写真。主CTA48px以上。

3層：Background=実写、Midground=案内Glass、Foreground=コピー・日時・CTA。

## 6. GLASS / 3D
Glassは高不透明度の情報面、短い写真キャプション、装飾面1枚程度に限定。スマホ同一画面backdrop-filter原則1面。本文・日付・リンクを傾けない。

液体ガラス、虹反射、浮遊球体、常時光走りは禁止。スマホではrotateY/translateZなし。

## 7. PHOTO DIRECTION
広い場所 → 人との距離が近い場所 → 活気 → 入口、という距離変化を編集する。

優先写真：Hero、生徒案内、自然な生徒、応援パフォーマンス、学校の日常、終盤。公開初版6〜9枚、最大10枚。

実写のみ。別イベント写真を今年の実績と誤認させない。人物の利用許諾を学校運用に沿って確認する。

## 8. TYPOGRAPHY / COLOR
surface #FFFFFF / canvas #F6F5F1 / ink #142738 / body #26323B / muted #52616B / line #D9DEE0 / provisional accent #245F56 / focus #A94618。

Noto Sans JPを主候補、system-ui fallback。本文16px以上。写真角丸0、Glass8、button6。

## 9. MOTION
入口へ近づく、章が変わる、操作結果が分かる、の3用途だけ。

PC Hero scale最大1.025/Y12px、Explore Y24px程度。スマホ写真は原則静止。全要素fade-inは禁止。prefers-reduced-motionでtransform/scroll-linkedを停止。

## 10. MOBILE UX
320/375/390/430/768/1024/1440/1920pxを対象。主CTA48px、他44px、間隔8px以上。

固定CTAはHero CTAが外れた後に表示し、Information/Visit CTA表示中は隠す。横向き高さ500px以下では表示しない。

JS無効、写真失敗、低速回線でも見出し・日時・状態・リンクを利用可能にする。

## 11. APPLICATION CTA
Hero / Information / Visit / 条件付き固定CTAは同じprimaryEventIdから生成。

状態：unknown, scheduled, open, full, closed, ended, postponed, cancelled。

openだけ正式申込URLへ直接遷移。full/closed/endedはupcomingへ。postponed/cancelledはnoticeUrlがある場合のみそこへ。

端末から満席等を推測しない。scheduledから自動openにはしない。締切後openの残留は安全側へ変更する。

## 12. CONTENT REQUIREMENTS
C01〜C12を学校側TODOとして管理。先行必須はC01〜C05と主役写真。未確定でもレイアウト実装可だが、未確認情報を確定原稿に変えない。

## 13. TECH STACK
静的HTML/CSS、Vanilla JS、Node事前生成。React/Vite/GSAP/Three.js/CMS/DB/認証/PWAは新規導入しない。

スマホ初期転送500KB目標、CSS gzip35KB、JS gzip25KB、全写真2MB目標。Heroだけeager、他lazy。

## 14. IMPLEMENTATION RULES
正本：data/events.json, content.json, photos.json, site.json。

日付YYYY-MM-DD、時刻HH:mm、timezone Asia/Tokyo。URLはHTTPS。原稿を任意HTMLとして挿入せずescapeする。

生成：data → validate → template → static HTML。dist/index.htmlを公開起点とする。

## 15. DO / DON'T
DO：日時・状態・次行動を冒頭表示、人のいる実写、Glass限定使用、未定を正直に表示、普通の外部リンク、状態一括更新。

DON'T：英字だけのHero、架空生徒、全部カード、全画面Glass、横スクロール強制、仮URL、モーダルで申込解放、JS起動まで本文非表示。

## 16. SELF REVIEW
A 中学生が行きたいか / B 保護者が信頼できるか / C 日時・申込が分かるか / D 空間体験に意味があるか / E Glassが役割を持つか / F スマホで使いやすいか / G AI LPの定型に見えないか、を実装後に判定する。

最大依存要素は実写真。弱い写真を装飾で補わず、撮り直し・別カットを優先する。

## 17. HANDOFF / ACCEPTANCE
実装順：データ/検証 → 390px → 全9章 → 375/430/320 → 768/PC → Glass/motion → 公開素材 → 受入確認。

受入：5秒確認、全8状態、締切境界、同一申込URL、データ一括更新、8幅、200%拡大、keyboard、safe area、motion reduction、JSなし、写真条件、性能予算、承認済み原稿。
