# 2026 馬上發財 Pinkoi 神馬龍舞 - 春酒抽獎系統

專為 Pinkoi 2026 春酒活動設計的互動式抽獎系統，具備流暢的轉盤動畫與完整的獎項管理功能。

## 線上體驗

**GitHub Pages：** [https://pochun26.github.io/spring-lucky-draw-2026/](https://pochun26.github.io/spring-lucky-draw-2026/)

## 功能特色

- **動態轉盤抽獎** — 慣性滾輪動畫 + 磁性停止效果，營造緊張刺激的抽獎氛圍
- **一次抽 1 或 2 人** — 可選擇單人或雙人模式，雙人時並排顯示兩台轉盤同步滾動
- **快速模式** — 縮短動畫時間（2–3 秒）與彩帶效果，適合快速連抽場景
- **多獎項管理** — 支援多個獎項，每個獎項可設定數量，抽完自動標記
- **批次匯入獎項** — 在設定視窗一次貼入多個獎項
- **固定參與者名單** — 名單硬編碼於程式中，每次啟動隨機洗牌
- **中獎紀錄** — 自動記錄所有中獎者，包含獎項名稱與時間戳記
- **慶祝彩帶** — 中獎時播放多波次全螢幕彩帶動畫
- **本地儲存** — 使用 LocalStorage 自動儲存獎項設定與中獎紀錄

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 啟動（Vite 預設埠號）。

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

### 建置 GitHub Pages 版本

```bash
npm run build:gh-pages
```

## 使用說明

### 1. 設定獎項

1. 點擊右上角的「⚙️ 設定」按鈕
2. 在「批次匯入獎項」文字框中輸入獎項資訊，格式：`獎項名稱,數量`
   ```
   特等獎: 10萬現金,1
   一等獎: iPhone 16,3
   二等獎: AirPods Pro,5
   ```
3. 點擊「匯入獎項」按鈕

### 2. 選擇抽取人數

在右上角切換 **1人 / 2人** 模式：
- **1人**：單台轉盤，抽出一位得獎者
- **2人**：並排兩台轉盤同時滾動，各自停在不同的得獎者

### 3. 開始抽獎

1. 從下拉選單選擇要抽的獎項
2. 點擊「開始抽獎」按鈕
3. 等待轉盤動畫完成
4. 中獎者會顯示在畫面上，並自動記錄到中獎紀錄

### 4. 快速模式

點擊右上角 **⚡** 按鈕開關快速模式：
- 轉盤動畫縮短至 2–3 秒（正常為 15–20 秒）
- 彩帶效果簡化為單次爆發
- 適合需要快速連續抽獎的場景

### 5. 查看中獎紀錄

頁面下方的「得獎紀錄」區塊顯示所有中獎者，包含姓名、獎項與抽獎時間。

## 技術棧

- **React 19** — UI 框架
- **TypeScript** — 型別安全
- **Vite** — 建置工具
- **Tailwind CSS** — 樣式框架
- **Lucide React** — 圖示庫
- **Canvas Confetti** — 彩帶動畫效果

## 專案結構

```
spring-lucky-draw-2026/
├── index.html               # HTML 範本（Vite 標準位置）
├── vite.config.ts           # Vite 設定檔
├── tsconfig.json            # TypeScript 設定檔
├── package.json
├── src/
│   ├── main.tsx             # 應用程式進入點
│   ├── App.tsx              # 主應用程式元件
│   ├── types.ts             # TypeScript 型別定義
│   ├── components/
│   │   └── SlotMachine.tsx  # 轉盤動畫元件
│   ├── assets/
│   │   └── images/          # 背景、裝飾、按鈕等圖片資源
│   │       └── index.ts     # 圖片資源匯出
│   └── vite-env.d.ts        # Vite 型別宣告
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages 自動部署工作流程
└── README.md
```

## 部署到 GitHub Pages

專案已設定自動部署，推送到 `main` 分支時會自動觸發 GitHub Actions 工作流程。

如需手動觸發：

1. 前往 GitHub 專案的 Actions 頁面
2. 選擇「Deploy to GitHub Pages」工作流程
3. 點擊「Run workflow」

## 授權

此專案為 Pinkoi 內部使用專案。

---

**祝大家抽獎好運！**
