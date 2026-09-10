# 東京都立目黒高等学校 学校説明会特設サイト 2026

2026年10月の学校説明会を主役にした、スマートフォン優先の静的Webサイトです。

このプロジェクトは旧 `meguro-school-info-session` の実装を流用せず、2026-09-10の新しい MASTER DESIGN SPEC v1.0 を起点に新規構築しています。

## 現在の状態

- 制作プレビュー：生成可能
- 10月の正確な日付・受付時間・会場・対象・申込URL：未入力
- 11月・12月：月のみ表示、詳細は後日公開
- 写真：未登録。プレビューのみ「写真準備中」領域を表示
- 本番ビルド：未承認の仮コピーを自動で抑制
- 公開：未実施

## ファイル構成

```text
index.html                 # 最新プレビュー。解凍後すぐ閲覧可能
assets/
  style.css                # Visual System / responsive / glass / motion
  app.js                   # 固定CTA、動き軽減、少量のスクロール演出
data/
  events.json              # 日程・状態・申込URLの正本
  content.json             # セクション原稿と承認状態
  photos.json              # 写真とalt・焦点位置・公開可否
  site.json                # 学校名・公式URL・更新日など
scripts/
  build.mjs                # 静的HTML生成
  lib.mjs                  # 検証・状態解決・escape
 tests/
  validation.test.mjs      # 状態・URL・期限境界テスト
dist/                      # Cloudflare配信用生成物
docs/
  MASTER_DESIGN_SPEC.md
  REQUIREMENTS.md
  DECISIONS.md
  PROJECT_STATE.md
  UPDATE_GUIDE.md
  TEST_REPORT.md
AGENTS.md
wrangler.jsonc
package.json
```

## ローカル確認

Node.js 20以上を推奨。

```bash
npm test
npm run build:preview
```

`index.html` または `dist/index.html` を開きます。

## 本番用ビルド

```bash
npm run build:production
```

本番モードでは `approvalStatus: "approved"` 以外の提案コピーを出力しません。未確認事項は「詳細は後日公開」など安全な表示になります。

## Cloudflare Workers Static Assets

`wrangler.jsonc` は `dist` を配信対象にしています。2026-09-10時点のCloudflare公式仕様に合わせ、Workers SitesではなくStatic Assetsを利用する構成です。

公開操作はまだ行っていません。

## GitHubへ入れるもの

このフォルダの**中身すべて**を新規リポジトリ `meguro-school-visit-2026` のルートへ置きます。ZIPファイルそのものをGitHubへ置く必要はありません。
