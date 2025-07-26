# 🚀 部署到 GitHub 的指令

## 📋 準備完成

✅ Git 倉庫已初始化  
✅ 文件已提交到本地倉庫  
✅ 遠端 Repository 已設定

## 🔑 執行部署

請在終端機中執行以下指令：

```bash
cd /Users/leonalin/Code/starter/teleprompter-suite/02-github-pages

# 推送到您的 GitHub Repository
git push -u origin main
```

如果需要認證，系統會提示您輸入 GitHub 帳號密碼或使用 Personal Access Token。

## 🌐 啟用 GitHub Pages

部署成功後，請到 GitHub Repository 設定：

### 步驟 1: 進入設定
1. 前往 https://github.com/AtlantisHikari/teleprompter/
2. 點擊「Settings」標籤

### 步驟 2: 啟用 Pages
1. 在左側選單找到「Pages」
2. Source 選擇「Deploy from a branch」
3. Branch 選擇「main」
4. Folder 選擇「/ (root)」
5. 點擊「Save」

### 步驟 3: 等待部署
- GitHub 會自動建置和部署
- 通常需要 1-5 分鐘
- 完成後會顯示網址

## 🌟 最終網址

部署完成後，您的智慧提詞機將可在以下網址使用：

**https://atlantishikari.github.io/teleprompter/**

## 📱 測試步驟

部署成功後，請測試：

### 基本功能測試
1. 開啟網址，確認頁面載入正常
2. 點擊右上角 ⚙️ 設定按鈕
3. 測試字體大小調整
4. 測試顏色選擇功能
5. 測試文稿編輯和顯示

### 跨裝置連接測試
1. **電腦端**: 創建房間，記錄房間ID
2. **手機端**: 開啟同一網址，加入房間
3. **測試同步**: 在手機編輯文稿，確認電腦即時顯示

## 🔧 如果部署失敗

### 認證問題
如果 `git push` 失敗，可能需要：

1. **使用 GitHub CLI**:
```bash
# 安裝 GitHub CLI (如果沒有)
brew install gh

# 登入 GitHub
gh auth login

# 推送代碼
git push -u origin main
```

2. **使用 Personal Access Token**:
   - 前往 GitHub Settings → Developer settings → Personal access tokens
   - 生成新的 token
   - 推送時使用 token 作為密碼

3. **手動上傳**:
   - 直接在 GitHub 網站上傳 `index.html` 檔案
   - 其他文件可選擇性上傳

## 📊 部署內容

已準備的文件：
- ✅ `index.html` - 主要應用程式（必需）
- ✅ `README.md` - 專案說明文件
- ✅ `使用說明.md` - 詳細使用指南
- ✅ `安裝說明.md` - 安裝和部署說明
- ✅ `DEPLOYMENT.md` - 部署相關資訊

## 🎯 部署後的功能

您的線上提詞機將具備：
- 🌐 **完全線上使用**: 無需安裝任何軟體
- 📱 **跨平台相容**: 支援所有現代瀏覽器
- 🔄 **P2P 連接**: WebRTC 點對點通訊
- 🎨 **豐富自訂**: 40+ 顏色和字體調整
- 📲 **響應式設計**: 完美適配手機、平板、電腦

---

**準備就緒！請執行上述指令完成部署。** 🚀✨