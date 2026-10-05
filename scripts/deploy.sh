#!/usr/bin/env bash
# 02-github-pages → Cloudflare Pages（白名單：只同步 4 個網頁檔）
# 用法：bash scripts/deploy.sh   （需 npx wrangler login 過一次）
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf .deploy && mkdir -p .deploy
cp index.html main.html control.html network.html .deploy/
echo "==> .deploy/ 檔案清單："; (cd .deploy && find . -type f | sort)
npx wrangler pages deploy .deploy --project-name teleprompter-suite --branch main
