#!/bin/bash
# Keep the grading chain alive until there is genuinely nothing left to do.
# run_all.sh retries stages internally; this catches the case where the whole
# chain is killed outright.
B="/Users/danielrivera/Documents/Claude/Photos:videos/Acupuncture /New folder"
G=/Users/danielrivera/studio/tools/grade

work_left() {
  v=$(ls "$B"/*.MP4 2>/dev/null | grep -vc "_GRADED")
  p=$(ls "$B"/*.ARW 2>/dev/null | wc -l | tr -d ' ')
  s=$(ls "$B/save"/*.ARW 2>/dev/null | wc -l | tr -d ' ')
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
