# GitHub Pages 部署說明

由於 GitHub CLI 未安裝，請手動執行以下步驟部署到 GitHub Pages：

## 📝 部署步驟

### 1. 創建 GitHub Repository
1. 前往 [GitHub](https://github.com)
2. 點擊右上角 "+" → "New Repository"  
3. Repository 名稱：`teleprompter-web`
4. 描述：`智慧提詞機 - 網頁版，支援跨裝置 P2P 連接的專業提詞機應用`
5. 設為 Public
6. 點擊 "Create repository"

### 2. 推送程式碼
在本地執行以下命令：

```bash
cd /Users/leonalin/Code/starter/teleprompter-suite/02-github-pages

# 設定 GitHub 遠端倉庫（請將 YOUR_USERNAME 替換為您的 GitHub 使用者名稱）
git remote add origin https://github.com/YOUR_USERNAME/teleprompter-web.git

# 推送程式碼
git push -u origin main
```

### 3. 啟用 GitHub Pages
1. 在 GitHub Repository 頁面點擊 "Settings"
2. 在左側選單找到 "Pages"
3. Source 選擇 "Deploy from a branch"
4. Branch 選擇 "main"
5. Folder 選擇 "/ (root)"
6. 點擊 "Save"

### 4. 訪問網站
幾分鐘後，您的網站將可在以下網址訪問：
`https://YOUR_USERNAME.github.io/teleprompter-web/`

## 📁 已準備的檔案

- `index.html` - 主要應用程式檔案
- `README.md` - 專案說明文件
- `DEPLOYMENT.md` - 部署相關資訊

## ⚡ 快速測試

部署完成後，您可以：
1. 在電腦開啟網頁版本
2. 在手機開啟同一個網址
3. 創建房間進行跨裝置測試

---

完成部署後，您將擁有一個功能完整的線上提詞機！