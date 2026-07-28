// Playwright 設定 — 僅供 tests/ 內的靜態頁面基本驗證使用
// 02-github-pages 是純前端靜態網頁（無 build 步驟、無同步用的後端伺服器），
// 這裡只驗證頁面可載入、基本操作有 DOM 反應；不驗證跨裝置同步（本版本本來就沒有
// 對應的 relay 伺服器可跑，AGENTS.md 已註明架構是純前端 WebRTC）。
const { defineConfig } = require('@playwright/test');

const TEST_PORT = 8093;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 20000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${TEST_PORT}`,
    headless: true,
  },
  webServer: {
    command: `python3 -m http.server ${TEST_PORT}`,
    port: TEST_PORT,
    reuseExistingServer: false,
    timeout: 10000,
  },
});
