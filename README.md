# Three.js GLBアニメーション - スクロール連動デモ

GLBファイルを読み込み、スクロールに応じてアニメーションを切り替えるThree.jsデモプロジェクト。

## 概要

- GLBモデルをGLTFLoaderで読み込み、Draco圧縮に対応
- GLB内に複数のアニメーションクリップを埋め込み可能
- スクロール位置（セクション）に応じてアニメーションを自動切り替え
- Lenisによるスムーズスクロール＋セクションスナップ機能

## 技術スタック

| 用途 | ライブラリ |
|------|-----------|
| 3Dレンダリング | Three.js (WebGPU renderer) |
| スムーズスクロール | Lenis |
| アニメーション | GSAP |
| ビルドツール | Vite + TypeScript |
| テンプレートエンジン | Handlebars |
| スタイル | SCSS |

## セットアップ

```bash
pnpm install
pnpm dev
```

## ビルド

```bash
pnpm build
```

## GLBモデルの差し替え

`public/assets/model/anim_test.glb` を差し替えることでモデルを変更できる。

GLB内のアニメーションクリップ数とHTMLの `.section` 要素数を合わせること（セクション0番 → クリップ0番が再生される）。

## ディレクトリ構成

```
src/
├── ts/
│   ├── main.ts          # エントリポイント・スクロール制御
│   ├── core/WebGL.ts    # Three.jsシーン・カメラ・レンダラー初期化
│   ├── mesh/boxMesh.ts  # GLBロード・AnimationMixer設定
│   └── utils/           # GUI・マウス・OrbitControls等のユーティリティ
├── scss/                # SCSSスタイル
└── index.html
```
