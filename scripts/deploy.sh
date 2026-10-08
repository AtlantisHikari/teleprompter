#!/usr/bin/env bash
# 部署到 Cloudflare Pages（teleprompter-miku）。DRY_RUN=1 只建 .deploy 並檢查，不部署。
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf .deploy && mkdir .deploy
rsync -a \
  --exclude '.git' --exclude '.claude' --exclude 'node_modules' --exclude 'tests' \
  --exclude '*.md' --exclude 'wrangler.toml' --exclude 'wrangler.json*' --exclude 'scripts' \
  --exclude '.env*' --exclude '.wrangler' --exclude '.dev.vars*' --exclude '.deploy' \
  --exclude 'package.json' --exclude 'package-lock.json' --exclude 'playwright.config.js' \
  --exclude 'test-results' --exclude 'playwright-report' --exclude '.DS_Store' --exclude '.gitignore' \
  --exclude '*.sqlite' ./ .deploy/
# 守門：不該公開的檔案
bad=$(find .deploy -mindepth 1 \( -name '.*' -o -name '*.sqlite' -o -name '*.env' -o -name 'package.json' -o -name '*.md' -o -name node_modules -o -name tests \) | grep -v '^.deploy/_headers$' || true)
if [ -n "$bad" ]; then echo "守門失敗，不應公開：" >&2; echo "$bad" >&2; exit 1; fi
if [ "${DRY_RUN:-}" = "1" ]; then echo "DRY_RUN：.deploy 已建立並通過守門"; exit 0; fi
npx wrangler pages deploy .deploy --project-name teleprompter-miku --branch main
