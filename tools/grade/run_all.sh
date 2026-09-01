#!/bin/bash
# Video first, then the photos, unattended. Each stage is resumable.
cd /Users/danielrivera/studio/tools/grade
D="/Users/danielrivera/Documents/Claude/Photos:videos/Acupuncture /New folder"
while pgrep -f run_folder.py > /dev/null; do sleep 30; done
echo "=== VIDEO STAGE FINISHED, STARTING PHOTOS ==="
python3 -u run_photos.py "$D" --log /Users/danielrivera/studio/tools/grade/photos_progress.jsonl
echo "=== ALL DONE ==="
