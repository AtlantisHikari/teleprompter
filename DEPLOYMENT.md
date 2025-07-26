# GitHub Pages 部署指南

## 步驟 1: 創建 GitHub 倉庫

1. 登入 GitHub (https://github.com)
2. 點擊右上角的 "+" 按鈕，選擇 "New repository"
3. 填寫倉庫資訊：
   - Repository name: `teleprompter`
   - Description: `智能提詞機 - 支援跨裝置連接的現代化 Web 提詞機應用`
   - 選擇 "Public" (讓 GitHub Pages 可以使用)
   - 不要勾選 "Initialize with README" (因為我們已經有了)
4. 點擊 "Create repository"

## 步驟 2: 推送代碼到 GitHub

在終端機中執行以下命令：

```bash
cd /Users/leonalin/Code/starter/teleprompter-github
git remote add origin https://github.com/YOUR_USERNAME/teleprompter.git
git branch -M main
git push -u origin main
```

**記得將 `YOUR_USERNAME` 替換為您的 GitHub 用戶名**

## 步驟 3: 啟用 GitHub Pages

1. 進入您的 GitHub 倉庫頁面
2. 點擊 "Settings" 選項卡
3. 在左側選單中找到 "Pages"
4. 在 "Source" 部分：
   - 選擇 "Deploy from a branch"
   - Branch 選擇 "main"
   - Folder 選擇 "/ (root)"
5. 點擊 "Save"

## 步驟 4: 等待部署完成

- GitHub Pages 需要幾分鐘時間完成部署
- 部署完成後，您的應用將可在以下網址訪問：
  `https://YOUR_USERNAME.github.io/teleprompter/`

## 步驟 5: 測試功能

1. **主顯示器**: 訪問 `https://YOUR_USERNAME.github.io/teleprompter/`
2. **控制面板**: 訪問 `https://YOUR_USERNAME.github.io/teleprompter/control.html`

## 使用說明

### 跨裝置連接
1. 在主顯示器上點擊右上角⚙️圖標
2. 點擊"創建房間"，記下房間ID
3. 在控制設備上輸入房間ID並點擊"連接"
4. 現在可以從控制面板遠程控制主顯示器了！

### 注意事項
- 首次連接可能需要等待幾秒鐘來建立 P2P 連接
- 建議在同一網路環境下使用以獲得最佳效果
- 如果連接失敗，請重新整理頁面並重試

## 故障排除

### 無法連接
1. 確保兩個設備都有網路連接
2. 嘗試關閉瀏覽器的廣告攔截器
3. 清除瀏覽器緩存並重新載入

### PeerJS 服務器問題
如果 PeerJS 免費服務器不穩定，可以：
1. 等待片刻後重試
2. 使用本地版本（Node.js 版本）
3. 設置自己的 PeerJS 服務器

---

**部署完成後，您就擁有了一個完全免費的線上提詞機服務！** 🎉