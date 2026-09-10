# PROJECT STATE

最終更新：2026-09-10 JST

## 状態
- MASTER DESIGN SPEC v1.0：新規実装の基準として採択
- 新規GitHub：`branzfamily01/meguro-school-visit-2026`（Public）
- 旧 `branzfamily01/meguro-school-info-session`：新実装では使用しない
- ローカル実装：作成済み
- GitHub main：新規実装を投入中
- Cloudflareデプロイ：未実施

## 実装済み
- 1ページ9セクション
- Hero / Discover / Explore / Meet / Experience / Learn / Information / Upcoming / Visit
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

## 確認済み
- `npm test`: 9/9 pass
- production build: pass
- productionでdraftコピー抑制: pass
- 全9 section ID生成: pass
- h1数: 1
- 日本時間の日付が前日にずれないテスト: pass

## 未確認
- 320 / 375 / 390 / 430 / 768 / 1024 / 1440 / 1920 の実ブラウザ視覚確認
- iPhone safe area実機
- 200%拡大
- 実写真のトリミング
- 公式申込URLの実経路
- Cloudflare本番URL

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
