# PROJECT STATE

最終更新：2026-09-10 JST

## 状態
- MASTER DESIGN SPEC v1.0：新規実装の基準として採択
- 新規GitHub：`branzfamily01/meguro-school-visit-2026`（Public）
- 旧 `branzfamily01/meguro-school-info-session`：新実装では使用しない
- GitHub main：新規実装一式の投入済み
- GitHub Pages用root：体験設計の再実装版へ更新済み
- Cloudflareデプロイ：未実施

## 2026-09-10 UI再実装
ユーザー実機スクリーンショットで、初回UIがMASTER DESIGN SPECの意図から大きく外れていることを確認。情報の正確性を守るためのproduction抑制が、同時にクリエイティブコピーまで消し、一般的な白い情報LPへ退化させていた。

修正済み：
- Heroコピーを「目黒高校を、ひと足先に歩いてみよう。」へ復元
- Heroの大きな情報重複と無意味な空白を削減
- 写真未投入でも奥行きを確認できる抽象的な校内入口表現をCSSで実装
- HeroにGlass開催案内を配置
- DISCOVERを3つの体験導線として表示
- MEETを生徒主役の暗色セクションとして再構成
- EXPERIENCEを全幅写真前提の強い場面へ変更
- LEARNは静かな情報面を維持
- INFORMATIONは日時・条件・申込状態の正本表示に専念
- VISITで再び来校へ感情を接続
- `data/content.json` のクリエイティブコピーをapprovedへ変更
- root `index.html` / `assets/style.css` / `dist/` を更新
- `scripts/build.mjs` を更新し、次回buildで旧UIに戻らないよう修正
- production buildではGitHub Pages用rootを上書きしないよう変更

## 実装済み基盤
- 1ページ9セクション
- data/events.json / content.json / photos.json / site.json
- 8状態のApplicationLink解決
- open時必須情報のビルド検証
- HTTPS URL検証
- 締切後の安全側状態変更
- preview / productionビルド分離
- HTML escape
- スマホ優先responsive CSS
- PC限定の軽い写真パララックス
- prefers-reduced-motion / 手動動き軽減
- 固定CTA表示制御
- Cloudflare Static Assets設定
- Node自動テスト9本

## 既確認
- `npm test`: 9/9 pass（UI再実装前のロジックテスト。ロジック自体は未変更）
- 全9 section ID生成
- h1数: 1
- 日本時間の日付が前日にずれないテスト
- GitHub mainに必要ファイル・フォルダが存在
- `wrangler.jsonc` の assets.directory = `./dist`

## 再確認が必要
- UI再実装後の375 / 390 / 430px実機視覚確認
- 320 / 768 / 1024 / 1440 / 1920px
- iPhone safe area
- 200%拡大
- 正式写真投入後のトリミング
- 公式申込URLの実経路
- Cloudflare本番URL

## 写真について
現在の幾何学・奥行き表現は学校の偽写真ではなく、写真未投入時の制作プレビュー。最終品質の最大依存要素は実写であり、Hero、生徒案内、生徒、応援パフォーマンス、終盤の写真を順次差し替える。

## 学校側TODO
- C01 10月正式開催日・受付・開始・終了
- C02 対象・保護者参加・人数条件
- C03 正式申込URL・受付期間・担当
- C04 会場・住所・交通・入口
- C05 生徒案内・応援パフォーマンス・学校説明の実施範囲
- C06 見学施設・出演団体・当日順序
- C07 注意事項・持ち物・変更取消・配慮問い合わせ
- C08 公開可能な写真とalt情報
- C09 公式URL・校章・公式色
- C10 生徒コメント（掲載する場合）
- C11 11月・12月詳細
- C12 公開原稿確認者・更新担当・緊急変更経路
