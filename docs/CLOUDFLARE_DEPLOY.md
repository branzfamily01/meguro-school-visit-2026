# Cloudflare Deploy Guide

確認日：2026-09-10 JST

## 採用方式
Cloudflare Workers Static Assets + Workers Builds。

GitHub:
- repository: `branzfamily01/meguro-school-visit-2026`
- production branch: `main`

## Cloudflare設定

Worker name:
`meguro-school-visit-2026`

Build command:
`npm run build:production`

Deploy command:
`npx wrangler deploy`

Wrangler config:
`wrangler.jsonc`

Static assets directory:
`./dist`

## 根拠
Cloudflare Workers BuildsはGitリポジトリ接続時に、Build commandの後にDeploy commandを実行する。Deploy commandの既定値は `npx wrangler deploy`。

Workers Static Assetsは `wrangler.jsonc` の `assets.directory` で配信フォルダを指定する。今回の正本は `./dist`。

## 初回公開後の確認
- workers.dev URLでトップが表示される
- CSS / JSが404にならない
- 9セクションが存在する
- 10月の未定表示が安全に出る
- 申込URL未設定のため外部申込へ遷移しない
- 375 / 390 / 430pxで横スクロールがない
- PCで見出し・情報・写真領域の重なりがない
- 「動きを減らす」が動作する

## 現在の注意
写真、10月の正式日程、対象、会場、申込URLは未入力。初回公開は情報・レイアウト確認用であり、完成版とは扱わない。
