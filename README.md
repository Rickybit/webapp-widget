# webapp-widget
iphoneのスタンバイモードから着想を得たシンプルなウィジェット表示webアプリ  

実装済みの機能はパタパタ時計とニュースの表示 

## 使用技術
vite + react + tailwindcss + motion + date-fns

## 作り方

### 1. プロジェクト作成
```bash
npm create vite@latest standby-app -- --template react
cd standby-app
```

### 2. Tailwind v4 と Motion のインストール

```bash
npm install motion @tailwindcss/vite date-fns

```

### 3. 設定ファイルの修正

'vite.config.js' 'Tailwind CSS v4'を使うための設定をする


### 4. 開発サーバー起動（確認用）

```bash
npm run dev
```

## 今後の予定
1. ウィジェットを自動で表示するように実装   
2. ニュースの表示をスクロール表示へ改善する  
3. 天気の表示を実装する  
4. メディアプレイヤーの表示  
5. google calenderとの連携   
6. 家の温度湿度の表示  
7. mcpなどを用いたAIエージェントの実装  
