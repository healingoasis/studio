#!/usr/bin/env bash
# Reports which required settings are present in .env.local WITHOUT printing values.
set -euo pipefail
cd "$(dirname "$0")/.."

required=(SHOPIFY_STORE SHOPIFY_CLIENT_ID SHOPIFY_SECRET_KEY FIREBASE_PROJECT_ID)

if [[ ! -f .env.local ]]; then
  echo "No .env.local file yet. Ask Dan for it (see .env.example for what goes in it)."
  exit 1
fi

missing=0
for var in "${required[@]}"; do
  if grep -qE "^${var}=..+" .env.local; then
    echo "  set:     ${var}"
  else
    echo "  MISSING: ${var}"
    missing=1
  fi
done

for tool in node pnpm shopify gcloud; do
  if command -v "$tool" >/dev/null 2>&1; then
    echo "  installed: ${tool}"
  else
    echo "  not installed: ${tool}"
  fi
done

if [[ $missing -eq 0 ]]; then
  echo "All required settings are present."
else
  echo "Some settings are missing. Ask Dan to fill them in."
fi
