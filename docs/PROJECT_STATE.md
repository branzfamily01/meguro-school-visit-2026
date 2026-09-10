# PROJECT STATE

最終更新：2026-09-10 JST（学校案内パンフレット2027統合）

## 状態
- MASTER DESIGN SPEC v1.0：新規実装の基準として採択
- 新規GitHub：`branzfamily01/meguro-school-visit-2026`（Public）
- 旧 `branzfamily01/meguro-school-info-session`：新実装では使用しない
- Kaori Portfolioの体験骨格を再解釈した新デザイン：GitHub mainへ反映済み
- 学校案内パンフレット2027の選定写真・補助情報：GitHub mainへ反映済み
- GitHub Pages：写真統合後の自動デプロイ成功を確認
- Cloudflareデプロイ：未実施

## 実装済み
- 劇場の幕が開くHeroと奥行きのある校内ポータル
- Gallery型の場面番号 01〜09 と通常縦スクロール回遊
- Heroにパンフレット16ページの登校・来校イメージ写真
- EXPLOREにパンフレット10ページの生徒歩行写真
- MEETにパンフレット10ページの自然な生徒交流写真
- EXPERIENCEにパンフレット12ページの体育祭写真（学校説明会当日の写真ではない旨を表示）
- LEARNにパンフレット11ページの探究活動写真
- 学びの補助情報：6つの東京都指定事業、放課後20時まで利用可能な自習室、卒業生チューター制度
- 2026年3月卒（第78期生）合格大学ハイライト：国公立大学・大学校25名、早慶上理ICU46名、GMARCH170名
- 学校行事の補助表示：体育祭、修学旅行（沖縄）、目高祭、合唱祭
- 2026年度学校説明会日程：10/24（土）午後、11/21（土）午後、12/19（土）午前・午後
- 公式学校URL・所在地・電話番号をsiteデータへ登録
- PDFから写真だけを切り出す再現可能なGitHub Actions
- WebP化した5写真を `assets/images/` に生成済み
- data/events.json / content.json / photos.json / site.json
- 8状態のApplicationLink解決
- open時必須情報のビルド検証
- HTTPS URL検証
- 締切後の安全側状態変更
- preview / productionビルド分離
- build時に `assets/` 全体を `dist/` へコピー
- HTML escape
- スマホ優先responsive CSS
- prefers-reduced-motion / 手動動き軽減
- 固定CTA表示制御
- Cloudflare Static Assets設定
- Node自動テスト9本

## 確認済み
- パンフレット画像生成GitHub Actions：success
- `assets/images/hero-walk.webp`：生成済み
- `assets/images/explore-walk.webp`：生成済み
- `assets/images/students-bench.webp`：生成済み
- `assets/images/learning-inquiry.webp`：生成済み
- `assets/images/energy-sports.webp`：生成済み
- GitHub Pages build：success
- GitHub Pages deploy：success
- パンフレット由来の開催日をeventsの正本へ反映済み
- 受付時刻・申込URL等は未確認のまま維持

## 未確認
- 写真統合版のiPhone実画面での最終トリミング確認
- 320 / 375 / 390 / 430 / 768 / 1024 / 1440 / 1920 の実ブラウザ視覚確認
- iPhone safe area実機
- 200%拡大
- 公式申込URLの実経路
- Cloudflare本番URL

## 学校側TODO
- C01 受付・開始・終了時刻（開催日はパンフレットで確認済み）
- C02 対象・保護者参加・人数条件
- C03 正式申込URL・受付期間・担当
- C04 会場・当日の入口・詳細交通案内
- C05 生徒案内・応援パフォーマンス・学校説明の実施範囲
- C06 見学施設・出演団体・当日順序
- C07 注意事項・持ち物・変更取消・配慮問い合わせ
- C08 写真掲載の学校内最終確認
- C09 校章・公式色の掲載判断（公式URL・所在地・電話は確認済み）
- C10 生徒コメント（掲載する場合）
- C11 11月・12月の詳細（開催日は確認済み）
- C12 公開原稿確認者・更新担当・緊急変更経路
