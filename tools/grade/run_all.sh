#!/bin/bash
# Grade everything, unattended, and keep going if a stage dies.
#
# The first version of this simply waited for the video process to disappear and
# then moved on to the photos. That is wrong: a crash looks exactly like
# finishing, so a mid-run failure would have silently skipped the rest of the
# video. Each stage now runs until its folder is genuinely empty of work.

cd /Users/danielrivera/studio/tools/grade
B="/Users/danielrivera/Documents/Claude/Photos:videos/Acupuncture /New folder"
G=/Users/danielrivera/studio/tools/grade
MAX_TRIES=40

# grep -c exits 1 when it counts zero, so `|| echo 0` fired ON TOP of the "0"
# grep had already printed -- the variable became "0\n0", which is not -eq 0,
# and the stage looped forever instead of finishing. Count with find instead.
remaining_video() {
  find "$B" -maxdepth 1 -iname "*.MP4" ! -name "*_GRADED*" 2>/dev/null | wc -l | tr -d ' '
}
remaining_photos() {
  find "$1" -maxdepth 1 -iname "*.ARW" 2>/dev/null | wc -l | tr -d ' '
}

log() { echo "[$(date '+%H:%M:%S')] $*"; }

# --- stage 1: video ---
while pgrep -f run_folder.py > /dev/null; do sleep 30; done
for try in $(seq 1 $MAX_TRIES); do
  left=$(remaining_video)
  [ "$left" -eq 0 ] 2>/dev/null && { log "video complete"; break; }
  log "video: $left clips left (attempt $try)"
  python3 -u run_folder.py "$B" --log $G/acupuncture_progress.jsonl
  sleep 5
done

# --- stage 2: the photos ---
for try in $(seq 1 $MAX_TRIES); do
  left=$(remaining_photos "$B")
  [ "$left" -eq 0 ] 2>/dev/null && { log "photos complete"; break; }
  log "photos: $left left (attempt $try)"
  python3 -u run_photos.py "$B" --log $G/photos_progress.jsonl
  sleep 5
done

# --- stage 3: Daniel's selects ---
for try in $(seq 1 $MAX_TRIES); do
  left=$(remaining_photos "$B/save")
  [ "$left" -eq 0 ] 2>/dev/null && { log "selects complete"; break; }
  log "selects: $left left (attempt $try)"
  python3 -u run_photos.py "$B/save" --log $G/photos_save_progress.jsonl
  sleep 5
done

log "=== ALL DONE ==="
