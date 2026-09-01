#!/bin/bash
# Video, then the photos, then Daniel's selects in the 'save' subfolder.
# Each stage is resumable and none of them deletes anything unverified.
cd /Users/danielrivera/studio/tools/grade
B="/Users/danielrivera/Documents/Claude/Photos:videos/Acupuncture /New folder"
G=/Users/danielrivera/studio/tools/grade

while pgrep -f run_folder.py > /dev/null; do sleep 30; done
echo "=== VIDEO FINISHED, STARTING PHOTOS ==="
python3 -u run_photos.py "$B" --log $G/photos_progress.jsonl

echo "=== MAIN PHOTOS DONE, STARTING THE 'save' SELECTS ==="
python3 -u run_photos.py "$B/save" --log $G/photos_save_progress.jsonl

echo "=== ALL DONE ==="
