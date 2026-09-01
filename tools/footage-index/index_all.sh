#!/bin/bash
# Index every programme folder so any of them can be pulled from later.
#
# Grading is NOT run here. Only the acupuncture shoot was S-Log3; CE,
# Conference, VSMT and VMRT are ordinary footage that is already correct, and
# putting them through the log grade would damage them. detect.py is the guard.

G=/Users/danielrivera/studio/tools/footage-index
P="/Users/danielrivera/Documents/Claude/Photos:videos"
OUT="$G/index"
mkdir -p "$OUT"

index_one () {
  name="$1"; folder="$2"
  slug=$(echo "$name" | tr -d ' ' | tr 'A-Z' 'a-z')
  echo "=== $name ==="
  python3 -u $G/detect.py "$folder" --limit 6 | tail -2
  python3 -u $G/extract.py "$folder" "$OUT/$slug/keyframes" \
      --every 4 --width 1100 --threshold 10 --pattern-any
  python3 -u $G/sheets.py "$OUT/$slug/keyframes" "$OUT/$slug/sheets" \
      --cols 4 --rows 3 --tile 500
  echo "--- $name done ---"
}

index_one "CE"         "$P/CE"
index_one "Conference" "$P/Conference "
index_one "VSMT"       "$P/VSMT "
index_one "VMRT"       "$P/VMRT"
echo "=== ALL FOLDERS INDEXED ==="
