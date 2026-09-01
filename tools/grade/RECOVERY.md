# If the grading stops and nobody is around

Everything is resumable and nothing is deleted before its replacement is verified.
Restarting is always safe.

## Restart everything

```bash
nohup bash /Users/danielrivera/studio/tools/grade/supervise.sh > /tmp/grade_supervisor.log 2>&1 &
```

The supervisor starts the chain; the chain runs video, then photos, then the
`save` selects, retrying any stage that dies until its folder is empty of work.

## Where to look

| What | Where |
|------|-------|
| What the chain is doing | `/tmp/grade_chain.log` |
| Video, one line per clip | `tools/grade/acupuncture_progress.jsonl` |
| Photos | `tools/grade/photos_progress.jsonl` |
| The `save` selects | `tools/grade/photos_save_progress.jsonl` |

Any entry whose `status` is not `done` kept its original. Nothing is lost.

## The rule that must not be broken

An original is deleted **only** after its graded version passes verification
(right duration or resolution, decodes cleanly, sensible size). There is no
backup of this footage and no room on the disk to hold one. If a fix is
uncertain, keep the original.

## If the grade itself looks wrong

Stop the run. Do not let a bad setting consume more originals — that has already
cost one clip (C8185, graded too dark before the exposure logic was corrected).
A stopped run costs time; a bad one costs footage.

## Lessons already paid for

- **Exposure is a correction, not a normaliser.** Forcing every clip to the same
  average brightness pushed dim rooms 6x and washed them out. Clamped to 0.7-2.2.
- **Numeric targets mislead.** The shadow target from the old arena job made
  contrasty scenes milky. Look at a frame before trusting a number.
- **A crash looks like completion.** Stages now finish when their folder is empty,
  not when a process disappears.
- **Bitrate must follow the format.** One flat rate turned a 1.07 GB 1080p clip
  into a 909 MB file, saving nothing.
