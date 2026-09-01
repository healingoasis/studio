#!/usr/bin/env python3
"""
A written index of what is in the footage, so it only has to be watched once.

Looking through an hour of video costs real time and attention. Doing it again
next month for a different question is waste. So the review pass writes down
what each moment contains, and every later question -- "where are the needles",
"find me close-ups of horses", "anything with the instructor teaching" -- is a
text search against that, which is free and instant.

Entries are written by whoever reviews the contact sheets. The point is that
the expensive step happens once.
"""
import os, json, argparse, re

def load(path):
    return json.load(open(path)) if os.path.exists(path) else []

def save(path, entries):
    json.dump(entries, open(path, "w"), indent=1)

def add(path, clip, t, tags, note=""):
    e = load(path)
    e.append({"clip": clip, "t": round(float(t), 2),
              "tags": [x.strip().lower() for x in tags], "note": note})
    e.sort(key=lambda r: (r["clip"], r["t"]))
    save(path, e)
    return len(e)

def search(path, query):
    e = load(path)
    terms = [w.strip().lower() for w in re.split(r"[,\s]+", query) if w.strip()]
    hits = []
    for r in e:
        hay = " ".join(r["tags"]) + " " + r.get("note", "").lower()
        score = sum(1 for t in terms if t in hay)
        if score:
            hits.append((score, r))
    hits.sort(key=lambda x: -x[0])
    return [r for _, r in hits]

def summary(path):
    e = load(path)
    tags = {}
    for r in e:
        for t in r["tags"]:
            tags[t] = tags.get(t, 0) + 1
    return len(e), sorted(tags.items(), key=lambda x: -x[1])

if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("catalogue")
    sub = a.add_subparsers(dest="cmd")
    s = sub.add_parser("search"); s.add_argument("query")
    sub.add_parser("summary")
    ad = sub.add_parser("add")
    ad.add_argument("clip"); ad.add_argument("t")
    ad.add_argument("tags"); ad.add_argument("--note", default="")
    n = a.parse_args()
    if n.cmd == "search":
        for r in search(n.catalogue, n.query):
            m, sec = divmod(r["t"], 60)
            print(f"  {r['clip']} @ {int(m)}:{sec:04.1f}  [{', '.join(r['tags'])}]"
                  + (f"  {r['note']}" if r.get("note") else ""))
    elif n.cmd == "add":
        c = add(n.catalogue, n.clip, n.t, n.tags.split(","), n.note)
        print(f"  catalogue now holds {c} entries")
    else:
        cnt, tags = summary(n.catalogue)
        print(f"  {cnt} entries")
        for t, c in tags[:25]:
            print(f"    {t}: {c}")
