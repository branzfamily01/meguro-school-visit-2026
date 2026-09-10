# AGENTS.md

## Source of truth
- docs/MASTER_DESIGN_SPEC.md
- docs/REQUIREMENTS.md
- docs/DECISIONS.md
- docs/PROJECT_STATE.md

## Do not inherit
旧 `meguro-school-info-session` の実装を参照・コピー・移植しない。

## Implementation rules
- 生徒を主役にする。
- 10月を主、11月・12月を従にする。
- 正式申込は外部の正式ページへリンクする。
- 未確認の学校情報を創作しない。
- 日付・URL・状態をHTMLやJSへ重複直書きしない。
- JSなしでも主要情報を読める。
- スマホ優先。
- Glassとmotionは情報の可読性より優先しない。
- 新しいDB、認証、CMS、Cron、外部解析を独断で追加しない。

## Autonomous changes allowed
- 余白・タイポグラフィの微調整
- 写真焦点位置
- responsiveの軽微なCSS修正
- accessibility修正
- テスト追加
- 性能改善

## Escalate before changing
- サイト全体構成
- データ正本
- 認証・DB・同期
- 公開レベル
- 申込状態の意味
- 生徒主役の体験構成
