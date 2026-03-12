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

## pulse担当の追加実装（monitoring）

`src/pulse/*` にシステム監視モジュールを追加済み。

- `monitor.ts`
  - CPU / MEM / DISK 使用率取得
  - Gateway (127.0.0.1:18789) 疎通チェック
  - Agent heartbeat（sessions.json mtime）集計
  - ログローテーション状態（100MB超ログ検知）
  - ディスク使用率トレンド配列生成
- `alerts.ts`
  - 監視結果から warn / critical アラート判定
  - 重大アラート時の bell トリガ判定
- `panels/SystemHealthPanel.tsx`
  - Ink描画用パネル（バー表示 + Gateway/Alerts/Logs要約）

統合側は `collectMonitoringSnapshot()` → `applyAlerts()` を1秒〜数秒周期で呼ぶだけで利用できます。

## 次フェーズ

- GitHub Issues API連携
- OpenClaw Gateway API連携
- blessed-contribグラフを使ったメトリクス描画
- コマンドパレット実行（Issue作成/更新）
