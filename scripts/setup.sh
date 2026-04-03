#!/usr/bin/env bash
set -e

echo ""
echo "🥱 Monyawn — dev setup"
echo "────────────────────────────"

# Node version check
REQUIRED_NODE=20
CURRENT_NODE=$(node -e "process.stdout.write(process.versions.node.split('.')[0])" 2>/dev/null || echo "0")
if [ "$CURRENT_NODE" -lt "$REQUIRED_NODE" ]; then
  echo "❌  Node $REQUIRED_NODE+ required (found $CURRENT_NODE). Install via https://nodejs.org"
  exit 1
fi
echo "✅  Node $CURRENT_NODE"

# Install dependencies
echo "📦  Installing dependencies..."
pnpm install

# Bootstrap .env
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "📋  Created .env from .env.example — fill in values as needed"
else
  echo "✅  .env already exists"
fi

# Husky hooks
echo "🪝  Installing git hooks..."
npx husky install 2>/dev/null || true

echo ""
echo "✅  Setup complete. Next steps:"
echo "   npm run dev          — start local dev server"
echo "   npm run verify       — run full verification suite"
echo "   npm run test:unit    — run unit tests with coverage"
echo ""
echo "🥱 Finna get to the monyawn."
