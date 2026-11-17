#!/usr/bin/env python3
"""Shorten every pause longer than MAX (0.3 s) to KEEP (0.15 s), exactly.
Silence = 10 ms RMS frames below THRESH dBFS. Leading/trailing silence is cut to KEEP/2.
Joins use 5 ms crossfades so there are no clicks.
With --pauses FILE it also writes where every remaining pause (>= 0.08 s) sits in the OUTPUT,
divided by --speed (so the times match the voice after a later atempo speed-up).
Usage: trim_pauses.py in.wav out.wav [--max 0.3] [--keep 0.15] [--thresh -40] [--pauses p.json --speed 1.1]"""
import argparse, json
import numpy as np
import soundfile as sf

ap = argparse.ArgumentParser()
ap.add_argument("inp"); ap.add_argument("out")
ap.add_argument("--max", type=float, default=0.3)
ap.add_argument("--keep", type=float, default=0.15)
ap.add_argument("--thresh", type=float, default=-40.0)
ap.add_argument("--pauses"); ap.add_argument("--speed", type=float, default=1.0)
a = ap.parse_args()

x, sr = sf.read(a.inp, always_2d=True)
mono = x.mean(axis=1)
hop = int(sr * 0.01)
nfr = len(mono) // hop
rms = np.sqrt(np.mean(mono[: nfr * hop].reshape(nfr, hop) ** 2, axis=1) + 1e-12)
silent = 20 * np.log10(rms) < a.thresh

runs, i = [], 0  # silent runs (start, end) in samples
while i < nfr:
    if silent[i]:
        j = i
        while j < nfr and silent[j]:
            j += 1
        runs.append((i * hop, len(mono) if j >= nfr else j * hop))
        i = j
    else:
        i += 1

keep, half, fade = int(sr * a.keep), int(sr * a.keep) // 2, int(sr * 0.005)
spans, marks = [], []  # spans to keep (input samples); marks = (input_sample_start, kept_len) of pauses
pos, n_cut = 0, 0
for s, e in runs:
    if s == 0:                                   # leading silence
        pos = max(0, e - half); n_cut += 1; continue
    if e >= len(mono):                           # trailing silence
        spans.append((pos, min(len(mono), s + half))); pos = len(mono); n_cut += 1; break
    if e - s > a.max * sr:                       # long pause -> keep 0.15 s
        spans.append((pos, s + half)); marks.append((len(spans) - 1, "join", keep))
        pos = e - (keep - half); n_cut += 1
    elif e - s >= 0.08 * sr:                     # short natural pause, untouched
        marks.append((len(spans), "inside", (s, e - s)))
if pos < len(mono):
    spans.append((pos, len(mono)))

# Build output with crossfades and remember each span's output offset.
out, offs = None, []
r = np.linspace(0, 1, fade)[:, None]
for a0, b0 in spans:
    p = x[a0:b0]
    if out is None:
        offs.append(0); out = p
    elif len(out) > fade and len(p) > fade:
        offs.append(len(out) - fade)
        out = np.concatenate([out[:-fade], out[-fade:] * (1 - r) + p[:fade] * r, p[fade:]])
    else:
        offs.append(len(out)); out = np.concatenate([out, p])
if out is None:
    out = x
sf.write(a.out, out, sr, subtype="PCM_16")

if a.pauses:
    pauses = []
    for idx, kind, info in marks:
        if kind == "join":       # pause straddles the end of span idx: half before, half after
            start = offs[idx] + (spans[idx][1] - spans[idx][0]) - half
            length = info
        else:                    # untouched pause inside span idx
            s, length = info
            if idx >= len(spans) or not (spans[idx][0] <= s < spans[idx][1]):
                continue
            start = offs[idx] + (s - spans[idx][0])
        pauses.append({"start": round(start / sr / a.speed, 3), "end": round((start + length) / sr / a.speed, 3)})
    pauses.sort(key=lambda p: p["start"])
    with open(a.pauses, "w") as f:
        json.dump({"duration": round(len(out) / sr / a.speed, 3), "pauses": pauses}, f, indent=1)
print(f"trim_pauses: shortened {n_cut} pauses ({len(x)/sr:.2f}s -> {len(out)/sr:.2f}s)")
