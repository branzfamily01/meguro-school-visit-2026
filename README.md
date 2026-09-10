# 東京都立目黒高等学校 学校説明会特設サイト 2026

2026年10月の学校説明会を主役にした、スマートフォン優先の静的Webサイトです。

このプロジェクトは旧 `meguro-school-info-session` の実装を流用せず、2026-09-10の新しい MASTER DESIGN SPEC v1.0 を起点に新規構築しています。

## 現在の状態

- GitHub: `branzfamily01/meguro-school-visit-2026`
- mainへの新規実装一式アップロード：完了
- `npm test`: 9/9 PASS
- production build：PASS
- 10月の正確な日付・受付時間・会場・対象・申込URL：未入力
- 11月・12月：月のみ表示、詳細は後日公開
- 写真：未登録
- Cloudflare公開：未実施

## ファイル構成

```text
index.html                 # 生成済みproductionページ
assets/
  style.css                # Visual System / responsive / glass / motion
  app.js                   # 固定CTA、動き軽減、少量のスクロール演出
  images/                  # 公開可能な実写真

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
  CLOUDFLARE_DEPLOY.md
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

## 本番用ビルド

```bash
npm run build:production
```

本番モードでは `approvalStatus: "approved"` 以外の提案コピーを抑制し、未確認情報は安全な表示へフォールバックします。

## Cloudflare Workers Static Assets

`wrangler.jsonc` は `dist` を配信対象にしています。

Workers BuildsでGitHub `main` を接続する場合：

```text
Build command: npm run build:production
Deploy command: npx wrangler deploy
Production branch: main
```

詳細は `docs/CLOUDFLARE_DEPLOY.md` を参照してください。

## 重要

- 旧 `meguro-school-info-session` のコードは使わない。
- 日程、対象、会場、申込URL、実施内容を推測しない。
- 写真は公開可能な目黒高校の実写のみ使用する。
- ZIPそのものをGitHubへアップロードする必要はない。
