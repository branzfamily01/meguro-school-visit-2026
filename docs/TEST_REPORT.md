# TEST REPORT

実施日：2026-09-10 JST

## 自動テスト
`npm test`

- unknown状態：PASS
- open必須情報欠落の拒否：PASS
- open正常データ：PASS
- javascript URL拒否：PASS
- 締切後open→closed：PASS
- scheduledの自動open禁止：PASS
- 全8状態表示定義：PASS
- HTML escape：PASS
- 日本時間の日付が前日にずれない：PASS

合計 9/9 PASS。

## ビルド
- preview：PASS
- production：PASS
- productionで代表draftコピー抑制：PASS
- 9 section ID：PASS
- h1 1個：PASS

## 未完了
Chromium headlessによるスクリーンショット生成はこの実行環境でタイムアウト。したがって視覚的なresponsive合格は宣言しない。
