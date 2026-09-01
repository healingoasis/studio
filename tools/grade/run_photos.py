#!/usr/bin/env python3
"""
Grade the RAW stills in place: develop, grade, VERIFY, then release the original.

Same safety rule as the video: nothing is deleted until its JPEG has been proved
good. Resumable -- re-running skips anything already recorded as done.

The 'save' subfolder is deliberately left alone.
"""
import os, sys, json, subprocess, tempfile, time, argparse
from PIL import Image
from analyze import FF
from photo_lut import default_look, write_photo_cube, grade_photo

TARGET_P50 = 115

def develop(arw, out_tif):
    r = subprocess.run(["sips", "-s", "format", "tiff", "-s", "formatOptions", "none",
                        arw, "--out", out_tif], capture_output=True)
    return os.path.exists(out_tif)

EXP_MIN, EXP_MAX = 0.6, 7.0

def sample_pixels(tif, width=260):
    """A small gamma-encoded proxy of the developed frame."""
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, "m.png")
        subprocess.run([FF, "-nostdin", "-i", tif, "-vf",
                        "lutrgb=r=gammaval(0.4545):g=gammaval(0.4545):b=gammaval(0.4545),"
                        f"scale={width}:-1", "-frames:v", "1",
                        "-pix_fmt", "rgb24", "-update", "1", "-y", p],
                       capture_output=True)
        if not os.path.exists(p): return None
        data = list(Image.open(p).convert("RGB").getdata())
    step = max(1, len(data)//3000)
    return [tuple(v/255.0 for v in q) for q in data[::step]]

def solve_exposure(tif):
    """Bisect on the REAL grading maths, not an approximation of it.

    Guessing with a power law put one test photo at 16x and turned it neon.
    Evaluating the actual chain costs milliseconds and cannot drift like that.
    """
    px = sample_pixels(tif)
    if not px: return None
    def med(exp):
        k = default_look(exposure=exp)
        ys = []
        for p in px:
            o = grade_photo(list(p), k)
            ys.append(0.2126*o[0] + 0.7152*o[1] + 0.0722*o[2])
        ys.sort()
        return ys[len(ys)//2] * 255
    lo, hi = EXP_MIN, EXP_MAX
    for _ in range(14):
        mid = (lo+hi)/2
        if med(mid) < TARGET_P50: lo = mid
        else: hi = mid
    return round(min(EXP_MAX, max(EXP_MIN, (lo+hi)/2)), 3)

def grade_one(arw, out_jpg, quality=92):
    with tempfile.TemporaryDirectory() as d:
        tif = os.path.join(d, "dev.tif")
        if not develop(arw, tif): return None, "develop failed"
        exp = solve_exposure(tif)
        if exp is None: return None, "measure failed"
        cube = os.path.join(d, "p.cube")
        write_photo_cube(cube, default_look(exposure=exp), N=33)
        r = subprocess.run([FF, "-nostdin", "-i", tif, "-vf",
            "lutrgb=r=gammaval(0.4545):g=gammaval(0.4545):b=gammaval(0.4545),"
            f"format=gbrp16le,lut3d='{cube}':interp=tetrahedral",
            "-frames:v", "1", "-q:v", "2" if quality >= 90 else "4",
            "-update", "1", "-y", out_jpg], capture_output=True, text=True)
    if not os.path.exists(out_jpg):
        return None, (r.stderr or "")[-300:]
    return exp, None

def verify(arw, jpg):
    if not os.path.exists(jpg): return False, "no output"
    if os.path.getsize(jpg) < 150_000: return False, f"too small ({os.path.getsize(jpg)} bytes)"
    try:
        im = Image.open(jpg); im.verify()
        im = Image.open(jpg); w, h = im.size
    except Exception as e:
        return False, f"unreadable: {e}"
    if w < 3000 or h < 3000:
        return False, f"wrong size ({w}x{h}) - expected full resolution"
    return True, f"{w}x{h}, {os.path.getsize(jpg)/1e6:.1f} MB"

def done_set(log):
    s = set()
    if os.path.exists(log):
        for line in open(log):
            try:
                e = json.loads(line)
                if e.get("status") in ("done", "kept_failed_check"): s.add(e["file"])
            except Exception: pass
    return s

def run(folder, log, limit=None):
    # top level only: the 'save' subfolder is left untouched on purpose
    arws = sorted(f for f in os.listdir(folder) if f.upper().endswith(".ARW"))
    skip = done_set(log)
    todo = [a for a in arws if a not in skip]
    if limit: todo = todo[:limit]
    print(f"{len(arws)} photos, {len(skip)} done, {len(todo)} to go", flush=True)
    freed = 0
    for i, name in enumerate(todo, 1):
        src = os.path.join(folder, name)
        out = os.path.join(folder, os.path.splitext(name)[0] + "_GRADED.jpg")
        src_size = os.path.getsize(src)
        t0 = time.time()
        print(f"[{i}/{len(todo)}] {name} ...", end=" ", flush=True)
        free = os.statvfs(folder)
        if free.f_bavail * free.f_frsize < 3e9:
            print("STOPPING: low disk space", flush=True)
            with open(log,"a") as f: f.write(json.dumps({"file":name,"status":"stopped_low_space"})+"\n")
            break
        exp, err = grade_one(src, out)
        if exp is None:
            print(f"FAILED ({err})", flush=True)
            if os.path.exists(out): os.remove(out)
            with open(log,"a") as f: f.write(json.dumps({"file":name,"status":"failed","detail":str(err)[:200]})+"\n")
            continue
        ok, detail = verify(src, out)
        if not ok:
            print(f"CHECK FAILED ({detail}) - original kept", flush=True)
            with open(log,"a") as f: f.write(json.dumps({"file":name,"status":"kept_failed_check","detail":detail})+"\n")
            continue
        out_size = os.path.getsize(out)
        os.remove(src)
        freed += src_size - out_size
        print(f"ok {detail} exp {exp}x ({time.time()-t0:.0f}s)", flush=True)
        with open(log,"a") as f:
            f.write(json.dumps({"file":name,"status":"done",
                "graded":os.path.basename(out),"exposure":exp,
                "src_mb":round(src_size/1e6),"out_mb":round(out_size/1e6),
                "seconds":round(time.time()-t0)})+"\n")
    print(f"\nfreed {freed/1e9:.1f} GB", flush=True)

if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("folder"); a.add_argument("--log", required=True)
    a.add_argument("--limit", type=int, default=None)
    n = a.parse_args()
    run(n.folder, n.log, limit=n.limit)
