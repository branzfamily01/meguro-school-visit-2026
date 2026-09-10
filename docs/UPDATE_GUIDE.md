# 更新ガイド

## 1. 日程・会場・対象を更新
`data/events.json` の `meguro-2026-10` を編集する。

未定は `null` のままにする。推測値や `10/00` のようなダミー値は禁止。

## 2. 申込受付を開始
`application.status` を `open` にする前に次を揃える。

- date
- startTime
- venue
- audience
- application.url（httpsのみ）
- application.checkedAt

不足すると本番ビルドを失敗させる。

## 3. 状態変更
利用可能な状態：

- unknown
- scheduled
- open
- full
- closed
- ended
- postponed
- cancelled

満席はfull、締切はclosed。混同しない。

## 4. 原稿を公開
`data/content.json` の対象セクションで内容を確認し、学校承認後に `approvalStatus` を `approved` にする。

## 5. 写真を公開
配信用画像を `assets/images/` 等へ置き、`data/photos.json` にsrc / width / height / alt / focalMobile / focalDesktopを入力し、`publicationStatus` を `published` にする。

人物の承諾資料そのものは公開リポジトリへ置かない。

## 6. ビルド

```bash
npm test
npm run build:preview
npm run build:production
```

## 7. プレビュー確認
日付変更時はHero / Information / Visit / 固定CTAが同じ内容になっているか確認する。

## 8. 公開
Cloudflareへ公開する場合は、最新mainでテスト後に本番ビルドし、`dist/` をStatic Assetsとして配信する。

```bash
npm run deploy
```

秘密情報はこのサイトでは使用しない。将来認証等を追加する場合は別設計とする。
