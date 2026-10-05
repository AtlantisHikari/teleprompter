# HANDOFF — 02-github-pages
更新：2026-10-05／claude

## Cloudflare Pages 線上版
- 正式網址：**https://teleprompter-suite.pages.dev/**（專案名 teleprompter-suite）
- 部署：`bash scripts/deploy.sh`（白名單只複製 index/main/control/network.html 到 `.deploy/` 並印清單，再 `wrangler pages deploy`）。專案建立一次性：`npx wrangler pages project create teleprompter-suite --production-branch main --force`。
- 此為巢狀 repo（remote 是 AtlantisHikari/teleprompter，ssh 金鑰為 AtlantisHikari 帳號；建 PR 用 `GH_TOKEN=$(gh auth token --user AtlantisHikari)`）。
- 實測：main.html 貼 60 行文稿、播放、調速 1.0→4.0，捲動速度約 10→125 px/s；桌機 1280x800／手機 390x844 皆 0 console error。
- 順手修：network.html 手機寬度水平捲動（action-section 改 minmax(0,1fr)）。
- 已知：PeerJS 仍由 unpkg CDN 載入；network.html 內仍寫死 atlantishikari.github.io 的分享網址（未改）。
