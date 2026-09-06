#!/bin/bash
# Keep the CE grading alive until the folder has no ungraded originals left.
G=/Users/danielrivera/studio/tools/grade
P="/Users/danielrivera/Documents/Claude/Photos:videos/CE/videos"
LOG=$G/ce_progress.jsonl
left() { find "$P" -maxdepth 1 -iname "*.MP4" ! -name "*_GRADED*" 2>/dev/null | wc -l | tr -d ' '; }
while true; do
  n=$(left)
  if [ "$n" -eq 0 ]; then echo "[$(date '+%H:%M:%S')] CE complete"; break; fi
  if ! pgrep -f run_flat_folder.py > /dev/null; then
    echo "[$(date '+%H:%M:%S')] restarting ($n clips left)"
    cd $G && nohup python3 -u run_flat_folder.py "$P" --log "$LOG" >> /tmp/ce_run.log 2>&1 &
    sleep 5
    pid=$(pgrep -f run_flat_folder.py | head -1)
    [ -n "$pid" ] && nohup caffeinate -i -w $pid > /dev/null 2>&1 &
  fi
  sleep 60
done
