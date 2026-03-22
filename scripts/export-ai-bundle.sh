#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -d node_modules/archiver ]]; then
  echo "Installing archiver (npm install)…"
  npm install
fi

echo "Running AI export bundle…"
node scripts/export-ai-bundle.js

echo
echo "Output:"
echo "  $(pwd)/appmonster-ai-export/"
echo "  $(pwd)/appmonster-ai-export.zip"
