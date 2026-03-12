# OpenClaw Mission Control TUI (Skeleton)

Ink + TypeScriptベースの Mission Control TUI スケルトン。

## 起動

```bash
npm install
npm run dev
```

## キーバインド

- `tab` / `shift+tab`: フォーカス切替
- `h/j/k/l`: パネル移動（Vim風）
- `t`: テーマ切替（cyberpunk / retro / minimal）
- `:`: コマンドパレット開閉
- `q` または `ctrl+c`: 終了

## 実装済み（dev担当スケルトン）

- メインレイアウト（Agent Status / Task Board / Activity Log / System Health / Command Input）
- キーボードナビゲーション
- テーマシステム
- 疑似リアルタイムデータストリーミング層（1秒tick）
- コマンドパレット（入力だけ、実行は次フェーズ）

## 次フェーズ

- GitHub Issues API連携
- OpenClaw Gateway API連携
- blessed-contribグラフを使ったメトリクス描画
- コマンドパレット実行（Issue作成/更新）
