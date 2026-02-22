# 🎉 2026 馬上發財 Pinkoi 神馬龍舞 - 春酒抽獎系統

一個專為 Pinkoi 2026 春酒活動設計的互動式抽獎系統，具有精美的動畫效果和完整的獎項管理功能。

## 🌐 線上體驗

**GitHub Pages:** [https://pochun26.github.io/spring-lucky-draw-2026/](https://pochun26.github.io/spring-lucky-draw-2026/)

## ✨ 功能特色

- 🎰 **動態轉盤抽獎** - 流暢的滾輪動畫效果，營造緊張刺激的抽獎氛圍
- 🎁 **多獎項管理** - 支援多個獎項設定，每個獎項可設定數量
- 📋 **批次匯入名單** - 快速匯入參與者名單，每行一個人名
- 🏆 **中獎紀錄** - 自動記錄所有中獎者資訊，包含獎項名稱和時間戳記
- 🎊 **慶祝動畫** - 中獎時自動播放彩帶動畫效果
- 💾 **本地儲存** - 使用 LocalStorage 自動儲存名單、獎項和中獎紀錄
- 📱 **響應式設計** - 完美支援桌面和行動裝置

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用程式將在 `http://localhost:3000` 啟動

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

## 📖 使用說明

### 1. 匯入參與者名單

1. 點擊右上角的「設定」按鈕
2. 在「批次匯入名單」文字框中貼上參與者名單（每行一個人）
3. 點擊「匯入名單」按鈕

### 2. 設定獎項

1. 在設定視窗的「批次匯入獎項」文字框中輸入獎項資訊
2. 格式：`獎項名稱,數量`
   - 範例：
     ```
     特等獎: 10萬現金, 1
     一等獎: iPhone 15, 3
     二等獎: AirPods Pro, 5
     ```
3. 點擊「匯入名單」按鈕

### 3. 開始抽獎

1. 從下拉選單中選擇要抽的獎項
2. 點擊「開始抽獎」按鈕
3. 等待轉盤動畫完成
4. 中獎者會自動顯示，並記錄到中獎紀錄中

### 4. 查看中獎紀錄

在中獎紀錄區塊可以查看所有已抽出的中獎者資訊，包含：
- 中獎者姓名
- 獲得的獎項
- 抽獎時間

## 🛠️ 技術棧

- **React 19** - UI 框架
- **TypeScript** - 型別安全
- **Vite** - 建置工具
- **Tailwind CSS** - 樣式框架
- **Lucide React** - 圖示庫
- **Canvas Confetti** - 彩帶動畫效果

## 📁 專案結構

```
spring-lucky-draw-2026/
├── src/
│   ├── App.tsx              # 主應用程式元件
│   ├── components/
│   │   └── SlotMachine.tsx  # 轉盤抽獎元件
│   └── types.ts             # TypeScript 型別定義
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages 部署工作流程
├── vite.config.ts           # Vite 設定檔
├── package.json             # 專案依賴與腳本
└── README.md               # 專案說明文件
```

## 🔧 開發

### 程式碼檢查

```bash
npm run lint
```

### 部署到 GitHub Pages

專案已設定自動部署，當推送到 `main` 分支時會自動觸發 GitHub Actions 工作流程，將應用程式部署到 GitHub Pages。

如需手動觸發部署：

1. 前往 GitHub 專案的 Actions 頁面
2. 選擇 "Deploy to GitHub Pages" 工作流程
3. 點擊 "Run workflow"

## 📝 授權

此專案為 Pinkoi 內部使用專案。

## 👥 貢獻者

- Pinkoi Team

---

**祝大家抽獎好運！🎊**
