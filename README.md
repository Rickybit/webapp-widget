# webapp-widget
iphoneのスタンバイモードから着想を得たシンプルなウィジェット表示webアプリ  

実装した機能はパタパタ時計とニュースと天気の表示

![standby-app0](https://github.com/user-attachments/assets/74550360-f583-4a89-b3e7-227eee55e156)


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
天気の情報についてはOpenWeatherを使用する
.envファイルを用意し、VITE_OPENWEATHER_API_KEY=を設定する
ここには、OpenWeatherのAPIキーを設定する
あとVITE_WEATHER_CITY=地域名を設定する

### 5. 開発サーバー起動（確認用）

```bash
npm run dev
```

また、天気の背景色については以下のサイトを参照  
https://claude.ai/public/artifacts/6650b6a4-f4a2-407c-ba9a-6b9716accb4e

公開中のサイト  
https://webapp-widget.pages.dev/

## 今後の予定
1. メディアプレイヤーの実装  
2. google calenderとの連携   
3. 家の温度湿度の表示  
4. mcpなどを用いたAIエージェントの実装  
