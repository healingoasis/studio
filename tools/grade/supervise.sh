#!/bin/bash
# Keep the grading chain alive until there is genuinely nothing left to do.
# run_all.sh retries stages internally; this catches the case where the whole
# chain is killed outright.
B="/Users/danielrivera/Documents/Claude/Photos:videos/Acupuncture /New folder"
G=/Users/danielrivera/studio/tools/grade

# Counted with find, not `ls | grep -c`: grep exits 1 on a zero count, which
# made the old version emit "0" twice and never compare equal to zero.
work_left() {
  v=$(find "$B" -maxdepth 1 -iname "*.MP4" ! -name "*_GRADED*" 2>/dev/null | wc -l | tr -d ' ')
  p=$(find "$B" -maxdepth 1 -iname "*.ARW" 2>/dev/null | wc -l | tr -d ' ')
  s=$(find "$B/save" -maxdepth 1 -iname "*.ARW" 2>/dev/null | wc -l | tr -d ' ')
  echo $((v + p + s))
}

while true; do
  left=$(work_left)
  if [ "$left" -eq 0 ]; then
    echo "[$(date '+%H:%M:%S')] supervisor: nothing left, exiting"
    break
  fi
  if ! pgrep -f "run_all.sh" > /dev/null; then
    echo "[$(date '+%H:%M:%S')] supervisor: chain not running ($left items left), starting it"
    nohup bash $G/run_all.sh >> /tmp/grade_chain.log 2>&1 &
  fi
  sleep 60
done
