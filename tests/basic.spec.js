// 02-github-pages 基本驗證 — 純前端靜態頁面，沒有 relay 伺服器可跑，
// 所以不驗證跨裝置同步（那是 01-development 的任務），只驗證：
// 1) 四個頁面都能正常載入（標題正確、沒有未捕捉的 JS 例外）
// 2) 主顯示器（main.html）的播放按鈕確實有本地 DOM 反應（isPlaying/捲動位置改變）
// 3) 控制面板（control.html）在填入房間 ID 前，控制按鈕應為 disabled（未連線保護存在）
//
// main.html 原本有一個既有 bug：程式碼在三處（約第 584/1468/1721 行）呼叫
// `updateLineNumbers()`，但整份檔案裡沒有這個函式的定義（行號顯示功能先前已整個
// 移除，但呼叫點沒清乾淨），載入時會丟出 "updateLineNumbers is not defined" 的
// 未捕捉例外。已修好：移除這三處殘留呼叫（該功能的顯示邏輯已由 updateLineDisplays()
// 取代）。
const { test, expect } = require('@playwright/test');

const PAGES = [
  { path: '/index.html', title: '智慧提詞機 - 首頁導航' },
  { path: '/main.html', title: '智慧提詞機 - 主顯示器' },
  { path: '/control.html', title: '智慧提詞機 - 控制面板' },
  { path: '/network.html', title: '智慧提詞機 - 設備連線助手 (GitHub Pages)' },
];

test.describe('02-github-pages 靜態頁面基本驗證', () => {
  for (const { path, title } of PAGES) {
    test(`${path} 可正常載入且無未捕捉例外`, async ({ page }) => {
      const pageErrors = [];
      page.on('pageerror', (err) => pageErrors.push(err.message));

      const response = await page.goto(path);
      expect(response.status()).toBe(200);
      await expect(page).toHaveTitle(title);

      // 給頁面上的初始化邏輯（WebRTC/localStorage 讀寫等）一點時間跑完
      await page.waitForTimeout(300);
      expect(pageErrors, `未捕捉例外: ${pageErrors.join('; ')}`).toEqual([]);
    });
  }

  test('main.html 播放按鈕點擊後有本地 DOM 反應（isPlaying 與捲動位置改變）', async ({ page }) => {
    await page.goto('/main.html');

    // 播放按鈕在滑出式設定面板內，預設收合在可視範圍外，需先展開面板
    await page.click('.settings-toggle');
    await expect(page.locator('#settingsPanel')).toHaveClass(/open/);

    await expect.poll(() => page.evaluate(() => isPlaying)).toBe(false);

    await page.click('button:has-text("▶ 播放")');
    await expect.poll(() => page.evaluate(() => isPlaying)).toBe(true);

    const contentSelector = '#content';
    const transformBefore = await page.locator(contentSelector).evaluate((el) => el.style.transform);
    await page.waitForTimeout(400);
    const transformAfter = await page.locator(contentSelector).evaluate((el) => el.style.transform);
    expect(transformAfter).not.toBe(transformBefore);
  });

  test('control.html 未連線時控制按鈕為 disabled（防呆存在）', async ({ page }) => {
    await page.goto('/control.html');

    await expect(page.locator('.btn-play')).toBeDisabled();
    await expect(page.locator('.btn-pause')).toBeDisabled();
    await expect(page.locator('#roomIdInput')).toBeVisible();
    await expect(page.locator('#connectBtn')).toBeVisible();
  });
});
