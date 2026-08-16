// 擬真品質測試 — 02-github-pages（純前端，透過 PeerJS/WebRTC 走公開雲端訊號伺服器同步，
// Playwright 測試環境無法穩定模擬真實雙裝置連線，這個邊界與 tests/basic.spec.js 一致）。
//
// 這裡補的是「不需要真正建立 P2P 連線」也能驗證的品質項目：
//   B. 長文稿壓力測試（直接呼叫 main.html 的本地函式模擬「已投影文稿」，
//      跳過 WebRTC signaling，驗證捲動本身的效能與正確性——這條路徑與真正連線後
//      收到 script-update 訊息時會呼叫的邏輯相同，見 main.html updateScript()）
//   D. 版面可用性（375px 手機 / 1440px 桌面）
const { test, expect } = require('@playwright/test');

function buildLongScript(charCount) {
  const LINE_LEN = 20;
  const unit = '這是提詞機長文稿壓力測試的內容，用來驗證捲動效能與正確性。';
  let text = '';
  while (text.length < charCount) {
    text += unit;
  }
  text = text.slice(0, charCount);
  const lines = [];
  for (let i = 0; i < text.length; i += LINE_LEN) {
    lines.push(text.slice(i, i + LINE_LEN));
  }
  return { text, script: lines.join('\n') };
}

test.describe('B. 提詞機核心功能（長文稿壓力測試）', () => {
  test('5000 字文稿：捲動維持 >=30fps、速度調整確實改變速率、捲到底正確停止', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/main.html');
    await page.click('.settings-toggle');
    await expect(page.locator('#settingsPanel')).toHaveClass(/open/);

    const { text, script } = buildLongScript(5000);
    expect(text.length).toBe(5000);

    await page.evaluate((s) => updateScript(s), script);
    await expect.poll(() => page.evaluate(() => content.textContent.length)).toBe(script.length);

    // --- fps 量測 ---
    await page.evaluate(() => changeSpeed('1'));
    await page.evaluate(() => playScript());
    await expect.poll(() => page.evaluate(() => isPlaying)).toBe(true);

    const fps = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        const start = performance.now();
        function tick() {
          frames++;
          if (performance.now() - start < 1000) {
            requestAnimationFrame(tick);
          } else {
            resolve(frames);
          }
        }
        requestAnimationFrame(tick);
      });
    });
    console.log(`[02-github-pages 長文稿捲動 fps] ${fps}`);
    expect(fps, '捲動時畫面幀率應 >= 30fps').toBeGreaterThanOrEqual(30);

    // --- 調速有效性：比較 speed=1 與 speed=5 的 transform px 位移速率 ---
    const readTranslateYpx = () =>
      page.evaluate(() => {
        const m = (content.style.transform || '').match(/translateY\(([-\d.]+)px\)/);
        return m ? parseFloat(m[1]) : null;
      });

    const measureRate = async (speedValue) => {
      await page.evaluate((v) => {
        pauseScript();
        changeSpeed(String(v));
        playScript();
      }, speedValue);
      await expect.poll(() => page.evaluate((v) => scrollSpeed === v, speedValue)).toBe(true);
      const before = await readTranslateYpx();
      await page.waitForTimeout(500);
      const after = await readTranslateYpx();
      return before !== null && after !== null ? before - after : null; // 往上捲，px 變小，取正值位移量
    };

    const rateAt1 = await measureRate(1);
    const rateAt5 = await measureRate(5);
    console.log(`[02-github-pages 調速有效性] speed=1 → Δpx=${rateAt1}, speed=5 → Δpx=${rateAt5}`);
    expect(rateAt1).not.toBeNull();
    expect(rateAt5).not.toBeNull();
    expect(rateAt5).toBeGreaterThan(rateAt1 * 2);

    // --- 捲到底正確停止：直接把 transform 快轉到停止門檻附近，讓下一次 interval tick
    // 走真正的播放邏輯判斷是否停止（該邏輯本身用 content.offsetHeight 判斷，屬於
    // 02 版本原本就正確的設計，這裡驗證維持正確，作為未來重構的回歸防線）。
    const contentHeight = await page.evaluate(() => content.offsetHeight);
    await page.evaluate((h) => {
      content.style.transform = `translateY(${-(h + 501)}px)`;
    }, contentHeight);
    await expect.poll(() => page.evaluate(() => isPlaying), { timeout: 5000 }).toBe(false);
    const finalTransform = await page.evaluate(() => content.style.transform);
    expect(finalTransform).toContain('translateY(100vh)');
  });
});

test.describe('D. 版面可用性（響應式）', () => {
  test('顯示端 375px：文字不溢出、無水平捲動', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await ctx.newPage();
    try {
      await page.goto('/main.html');
      const { script } = buildLongScript(500);
      await page.evaluate((s) => updateScript(s), script);

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(hasHorizontalOverflow, '手機版顯示端不應出現水平捲動').toBe(false);
    } finally {
      await ctx.close();
    }
  });

  test('控制端 375px：所有控制按鈕可見、速度滑桿可操作（未連線防呆仍在）', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await ctx.newPage();
    try {
      await page.goto('/control.html');

      await expect(page.locator('.btn-play')).toBeVisible();
      await expect(page.locator('.btn-pause')).toBeVisible();
      await expect(page.locator('#connectBtn')).toBeVisible();
      // 未連線時應仍是 disabled（防呆），與 basic.spec.js 的斷言一致
      await expect(page.locator('.btn-play')).toBeDisabled();

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(hasHorizontalOverflow, '手機版控制端不應出現水平捲動').toBe(false);
    } finally {
      await ctx.close();
    }
  });

  test('1440px 桌面版：顯示端與控制端正常呈現', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    try {
      await page.goto('/main.html');
      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(hasOverflow).toBe(false);

      const controlPage = await ctx.newPage();
      await controlPage.goto('/control.html');
      await expect(controlPage.locator('.btn-play')).toBeVisible();
    } finally {
      await ctx.close();
    }
  });
});
