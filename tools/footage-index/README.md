# Finding things in hours of footage

Built after a real failure: asked to find acupuncture needles in 63 minutes of
video, the first search sampled one frame per clip at 250px wide, found nothing,
and reported "no needles anywhere." A needle is about two pixels at that size.
The conclusion was wrong and the method could never have been right.

The problem is general and will keep coming up: *where in this pile of footage
is the moment I need?*

## The method

1. **Sample densely, seek-based.** `-ss` before `-i` decodes only from the
   nearest keyframe, so cost scales with the number of samples, not the length
   of the footage. Decoding every frame to keep one in ninety is 20x slower.
   (`-skip_frame nokey` is ignored by this HEVC, so it is not an option.)

2. **Throw away near-duplicates.** A 60-second locked-off shot gives one useful
   frame, not twenty. A difference-hash comparison against the previous kept
   frame drops the repeats, which is what makes the review set small enough to
   look at properly.

3. **Lay them out at a resolution that can actually answer the question.** The
   review surface caps around 2000px wide. Six frames across gives ~330px each,
   where fine detail is invisible. Three across gives ~660px. Fewer frames per
   sheet and more sheets beats one tidy sheet that hides the answer.

4. **Write down what is there, once.** The review pass fills a catalogue, and
   every later question is a text search against it instead of another hour of
   looking.

## Use

```bash
python3 extract.py "<footage folder>" <keyframes out> --every 3 --threshold 10
python3 sheets.py  <keyframes out> <sheets out> --cols 3 --rows 3 --tile 660
# review the sheets, then record what is in them:
python3 catalogue.py catalogue.json add C8221 12.5 "needles,equine,close-up" --note "needles being placed along the back"
python3 catalogue.py catalogue.json search "needles equine"
```

`--every` is seconds between samples. `--threshold` is how different a frame
must be to be kept (higher keeps fewer).

## Cost

63 minutes at one sample every 3 seconds is about 1,270 samples, roughly ten
minutes of extraction. Reviewing the survivors is the expensive part and is
the reason the catalogue exists: it is paid once per shoot, not once per
question.

## Lesson worth keeping

Do not report a negative from a search that could not have found the thing.
"I did not find it" and "it is not there" are different claims, and only one of
them was justified.
