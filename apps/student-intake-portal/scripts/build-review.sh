#!/usr/bin/env bash
#
# Builds the shareable review copy of the portal: one HTML file, no real students in it.
#
#   bash scripts/build-review.sh            # writes tmp/review/review-page.html
#   bash scripts/build-review.sh --trace    # same, but shows any error on the page
#
# Publish the result as the "Student Intake Portal" artifact. What comes out is the real
# app — same components, same tuition arithmetic — running on invented orders, with the
# programme photographs and the store's own prices carried inside the file.
#
set -euo pipefail

cd "$(dirname "$0")/.."
WORK="${REVIEW_WORK:-tmp/review}"
PORT=3141

rm -rf "$WORK"
mkdir -p "$WORK/assets" "$WORK/photos"

echo "Building with invented students..."
PORTAL_DEMO=1 NEXT_PUBLIC_PORTAL_DEMO=1 npx next build >/dev/null

PORTAL_DEMO=1 NEXT_PUBLIC_PORTAL_DEMO=1 npx next start -H 127.0.0.1 -p "$PORT" >"$WORK/server.log" 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT

for _ in $(seq 1 60); do
  curl -sf -o /dev/null "http://127.0.0.1:$PORT/review" && break
  sleep 1
done

echo "Capturing the page..."
curl -s "http://127.0.0.1:$PORT/review" > "$WORK/review.html"

if grep -q "gid://shopify/Customer/demo" "$WORK/review.html"; then
  :
else
  echo "The captured page does not look like the demo build. Stopping." >&2
  exit 1
fi

for asset in $(grep -oh '/_next/static/[^"]*\.\(css\|js\)' "$WORK/review.html" | sort -u); do
  curl -s "http://127.0.0.1:$PORT$asset" -o "$WORK/assets/$(echo "$asset" | sed 's#/#_#g')"
done

echo "Shrinking the photographs..."
for photo in $(grep -oh '/photos/[a-z0-9-]*\.jpg' "$WORK/review.html" | sed 's#/photos/##' | sort -u); do
  case "$photo" in
    *hero*) sips -Z 1400 -s format jpeg -s formatOptions 45 "public/photos/$photo" --out "$WORK/photos/$photo" >/dev/null ;;
    *)      sips -Z 800  -s format jpeg -s formatOptions 50 "public/photos/$photo" --out "$WORK/photos/$photo" >/dev/null ;;
  esac
done

REVIEW_WORK="$WORK" python3 scripts/build-review.py "$@"
REVIEW_WORK="$WORK" python3 scripts/build-review.py --file "$@"

DESKTOP="$HOME/Desktop/Student-Intake-Portal.html"
cp "$WORK/review-file.html" "$DESKTOP"
echo "Also on the Desktop: $DESKTOP"
