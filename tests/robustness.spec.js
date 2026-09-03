// 強韌性測試 — 02-github-pages（輸入邊界、行模式注入、控制面板持久化損毀降級）
//
// 本輪（2026-09-04）偵錯新增，覆蓋先前測試未涵蓋的區域。撰寫時以下測試全部是紅燈
// （即：都是既有真 bug 的重現步驟），修復後轉綠，保留作回歸防線：
//   1. main.html changeSpeed()/changeFontSize() 對 0/負值/NaN/超界值完全不驗證
//      （遠端 speed-change 訊息或損毀設定都能送進來）。負值速度會讓內容往畫面下方
//      飛出且永不停止（捲到底判斷 newY < -height 永遠不成立）；NaN 會讓 transform
//      失效整個卡住。
//   2. main.html displayCurrentLine() 把文稿行未轉義直接塞進 innerHTML——文稿內容
//      含 HTML 時會被當成標籤解析（注入），含 < 的普通行也會顯示錯誤。
//   3. control.html loadSettings() 的 JSON.parse 沒有 try/catch（main.html 的同名函式
//      早就有包）——localStorage 損毀時 load handler 直接丟出未捕捉例外，之後的
//      loadScriptHistory() 被跳過，文稿歷史載不進來。
const { test, expect } = require('@playwright/test');

test.describe('02-github-pages 強韌性', () => {
  test('速度/字級輸入邊界：0、負值、NaN、超界值不得進入內部狀態', async ({ page }) => {
    await page.goto('/main.html');
    const out = await page.evaluate(() => {
      const r = {};
      changeSpeed('0'); r.speedZero = scrollSpeed;
      changeSpeed('-3'); r.speedNeg = scrollSpeed;
      changeSpeed('abc'); r.speedNaN = scrollSpeed;
      changeSpeed('999'); r.speedHuge = scrollSpeed;
      changeFontSize('abc'); r.fontNaN = fontSize;
      changeFontSize('99'); r.fontHuge = fontSize;
      return r;
    });
    for (const [k, v] of Object.entries(out)) {
      expect(Number.isFinite(v), `${k} 應為有限數值，實得 ${v}`).toBe(true);
    }
    expect(out.speedZero).toBeGreaterThanOrEqual(0.1);
    expect(out.speedNeg).toBeGreaterThanOrEqual(0.1);
    expect(out.speedHuge).toBeLessThanOrEqual(5);
    expect(out.fontNaN).toBeGreaterThanOrEqual(1);
    expect(out.fontNaN).toBeLessThanOrEqual(10);
    expect(out.fontHuge).toBeLessThanOrEqual(10);
  });

  test('行模式顯示：文稿行不得被當成 HTML 解析（注入防護）', async ({ page }) => {
    await page.goto('/main.html');
    const payload = '第一行\n<img src=x onerror="window.__pwned=true">\n第三行';
    await page.evaluate((p) => {
      updateScript(p);
      jumpToLine(2);
    }, payload);
    const inj = await page.evaluate(() => ({
      hasImg: !!document.querySelector('#content img'),
      text: document.getElementById('content').textContent,
    }));
    expect(inj.hasImg, '文稿行內的 HTML 不得變成真實元素').toBe(false);
    expect(inj.text).toContain('<img'); // 原文應以文字原樣呈現
  });

  test('控制面板 localStorage 損毀時載入流程不得中斷', async ({ browser }) => {
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => {
      window.localStorage.setItem('teleprompter-control-settings', '{這不是合法JSON');
    });
    const page = await ctx.newPage();
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(String(err)));
    await page.goto('/control.html');
    await expect(page.locator('#speedSlider')).toBeVisible();
    // 損毀的設定只該被丟棄；load handler 不得丟出未捕捉例外（否則 loadScriptHistory 被跳過）
    expect(pageErrors, `不應有未捕捉例外：${pageErrors.join(' | ')}`).toHaveLength(0);
    await ctx.close();
  });
});
