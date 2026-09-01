# What is in the footage, and where

One index per programme folder. The point is that the expensive part -- looking
through hours of video -- happens once, and every later question is a lookup.

## Coverage

| Folder | Clips | Keyframes | Sheets | Graded? |
|--------|-------|-----------|--------|---------|
| Acupuncture | 99 | 1,130 | 95 | **yes** -- S-Log3, done |
| CE | 121 | 1,142 | 96 | no -- but it is flat and should be, see below |
| Conference | 155 | 1,226 | 103 | no -- already correct |
| VSMT | 311 | 787 | 66 | no -- already correct |
| VMRT | 46 | ~130 | -- | no -- already correct |

## Which footage is which

Only the acupuncture shoot was S-Log3 (10-bit 4:2:2 full-range XAVC). Everything
else is ordinary footage, already converted, and putting it through the log
grade would damage it. `detect.py` checks this automatically and is the guard
against doing it by accident.

**CE is the exception worth knowing about.** It is not log, but it is flat:
contrast spread measures ~79 against ~190 for Conference and VMRT. It looks
hazy. A light curve plus a little saturation transforms it -- greens come back,
the horses get their colour. It is also recorded at ~169 Mbps for 1080p, about
ten times what it needs, so grading it would also reclaim roughly 35 GB of the
45 GB it occupies.

## Searching it

```bash
python3 catalogue.py acupuncture_catalogue.json search "needles equine"
```

The catalogue is filled by reviewing sheets. It currently holds the acupuncture
needling moments -- 11 entries covering both the canine session (C8192, from
about 3:10) and the equine one (C8188, from about 0:45). Both were missed
entirely by the first, cruder search.

Other folders have sheets built but no catalogue entries yet: reviewing 630+
clips of sheets up front is a poor use of effort when most of it will never be
asked for. Fill a folder's catalogue the first time something is needed from it,
and it stays filled.

## The failure this exists to prevent

The first search for acupuncture needles sampled one frame per clip at 250px
wide and concluded there were none. C8192 is six and a half minutes long; the
single sample landed ten seconds before the needles came out. The needles were
there the whole time, in two separate sessions.

Sample densely. Review at a size where the thing would actually be visible.
And never report "it is not there" from a search that could not have found it.
