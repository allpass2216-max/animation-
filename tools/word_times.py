#!/usr/bin/env python3
"""Word timestamps for a voice-over -> public/words.json (times in seconds AND frames @30fps).

1) Whisper ("small" by default) with word_timestamps=True. The model is cached in ./models/.
2) If Whisper fails and --script is given: Allosaurus phone recognition + forced alignment (tools/align_words.py)
   gives MEASURED word times ("source": "allosaurus-align"; words marked "interpolated" had no phones matched).
3) Last resort, ffmpeg silencedetect:
   speech segments between pauses become "lines". If you pass --script (one line of the voice
   script per text line), the lines are labelled with that text and words are spread across each
   line by length. Fallback word times are APPROXIMATE (marked "approx": true); line times are real.

Usage:
  python3 tools/word_times.py voice/clean.wav [--out public/words.json] [--script voice/script.txt]
                              [--model small] [--language en] [--force-fallback]
"""
import argparse, json, os, re, subprocess, sys

FPS = 30
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODELS = os.path.join(ROOT, "models")


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def with_frames(d):
    d["startFrame"] = round(d["start"] * FPS)
    d["endFrame"] = round(d["end"] * FPS)
    return d


def run_whisper(audio, model_name, language):
    import whisper  # heavy import, only when needed
    os.makedirs(MODELS, exist_ok=True)
    model = whisper.load_model(model_name, download_root=MODELS)
    res = model.transcribe(audio, word_timestamps=True, language=language, fp16=False, verbose=False)
    words, lines = [], []
    for seg in res["segments"]:
        lines.append(with_frames({"text": seg["text"].strip(), "start": round(seg["start"], 3), "end": round(seg["end"], 3)}))
        for w in seg.get("words", []):
            words.append(with_frames({"word": w["word"].strip(), "start": round(w["start"], 3),
                                      "end": round(w["end"], 3), "prob": round(w.get("probability", 0), 3)}))
    return words, lines


def peak_db(audio):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", audio, "-af", "volumedetect", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    m = re.search(r"max_volume: (-?[\d.]+) dB", err)
    return float(m.group(1)) if m else 0.0


def speech_segments(audio, below_peak=26.0, min_sil=0.05):
    # Threshold is relative to the voice's peak, so it works on raw and on normalised (cleaned) voices.
    # min_sil 0.05 s: clean_voice leaves 0.15 s pauses, which the 1.1x speed-up blurs to ~0.07 s.
    noise = f"{peak_db(audio) - below_peak:.1f}dB"
    err = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", audio, "-af",
                          f"silencedetect=n={noise}:d={min_sil}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    total = duration(audio)
    sil = list(zip(starts, ends + [total] * (len(starts) - len(ends))))
    segs, t = [], 0.0
    for s, e in sil:
        if s - t > 0.05:
            segs.append((t, s))
        t = e
    if total - t > 0.05:
        segs.append((t, total))
    return [(round(max(0, a), 3), round(b, 3)) for a, b in segs]


def segments_from_sidecar(audio):
    """clean_voice writes <voice>.pauses.json with the exact pauses it left; use them if present."""
    side = os.path.splitext(audio)[0] + ".pauses.json"
    if not os.path.exists(side) or os.path.getmtime(side) < os.path.getmtime(audio) - 5:
        return None
    d = json.load(open(side))
    total, segs, t = duration(audio), [], 0.0
    for p in d["pauses"]:
        if p["start"] - t > 0.05:
            segs.append((round(t, 3), p["start"]))
        t = p["end"]
    if total - t > 0.05:
        segs.append((round(t, 3), round(total, 3)))
    return segs


def run_fallback(audio, script_lines):
    segs = segments_from_sidecar(audio)
    method = "clean_voice pauses" if segs else "ffmpeg silencedetect"
    segs = segs or speech_segments(audio)
    print(f"[word_times] fallback segments from {method}: {len(segs)}", file=sys.stderr)
    # If a script is given and there are more speech segments than lines, choose the line breaks
    # among the pauses so each line's share of speech time matches its share of the script text.
    if script_lines and len(segs) > len(script_lines) > 1:
        lens = [len(re.sub(r"\W", "", l)) + 1 for l in script_lines]
        speech = [b - a for a, b in segs]
        tot_t, tot_c = sum(speech), sum(lens)
        cum_t = [sum(speech[:i + 1]) / tot_t for i in range(len(segs) - 1)]  # after segment i
        breaks, lo = [], 0
        for j in range(len(script_lines) - 1):
            target = sum(lens[:j + 1]) / tot_c
            hi = len(cum_t) - (len(script_lines) - 2 - j)  # leave room for later breaks
            k = min(range(lo, hi), key=lambda i: abs(cum_t[i] - target))
            breaks.append(k); lo = k + 1
        merged, start = [], 0
        for k in breaks + [len(segs) - 1]:
            merged.append((segs[start][0], segs[k][1])); start = k + 1
        segs = merged
    lines, words = [], []
    for i, (a, b) in enumerate(segs):
        text = script_lines[i] if script_lines and i < len(script_lines) else f"LINE {i + 1}"
        lines.append(with_frames({"text": text, "start": a, "end": b}))
        if script_lines and i < len(script_lines):
            toks = text.split()
            weights = [len(re.sub(r"\W", "", w)) + 1 for w in toks]
            tot, t = sum(weights), a
            for w, wt in zip(toks, weights):
                d = (b - a) * wt / tot
                words.append(with_frames({"word": w, "start": round(t, 3), "end": round(t + d, 3), "approx": True}))
                t += d
    if script_lines and len(script_lines) != len(segs):
        print(f"warning: {len(script_lines)} script lines but {len(segs)} speech segments found", file=sys.stderr)
    return words, lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("--out", default=os.path.join(ROOT, "public", "words.json"))
    ap.add_argument("--script", help="text file, one voice line per line (labels fallback lines)")
    ap.add_argument("--model", default="small")
    ap.add_argument("--language", default=None, help="e.g. en, hi (default: auto-detect)")
    ap.add_argument("--force-fallback", action="store_true")
    ap.add_argument("--no-align", action="store_true", help="skip the Allosaurus forced alignment fallback")
    a = ap.parse_args()

    script_lines = None
    if a.script:
        script_lines = [l.strip() for l in open(a.script, encoding="utf-8") if l.strip()]

    source, note = "whisper", None
    if a.force_fallback:
        source, note = "silencedetect", "fallback forced"
    else:
        try:
            words, lines = run_whisper(a.audio, a.model, a.language)
        except Exception as e:  # network blocked, model missing, etc.
            source = "silencedetect"
            note = f"whisper failed: {type(e).__name__}: {str(e)[:200]}"
            print(f"[word_times] {note}\n[word_times] falling back to ffmpeg silencedetect line times. "
                  "To get real word times allow openaipublic.azureedge.net in this environment's Network access.",
                  file=sys.stderr)
    if source == "silencedetect" and script_lines and not a.no_align:
        try:  # measured word times from phone recognition + forced alignment to the script
            sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
            from align_words import align
            al = align(script_lines, a.audio)
            words = [with_frames({"word": w["word"], "start": w["start"], "end": w["end"], "line": w["line"],
                                  **({"interpolated": True} if w.get("interpolated") else {})}) for w in al]
            lines = []
            for li, text in enumerate(script_lines):
                ws = [w for w in words if w["line"] == li]
                if ws:
                    lines.append(with_frames({"text": text, "start": ws[0]["start"], "end": ws[-1]["end"]}))
            source = "allosaurus-align"
        except Exception as e:
            print(f"[word_times] allosaurus alignment failed ({type(e).__name__}: {e}); using line times", file=sys.stderr)
    if source == "silencedetect":
        words, lines = run_fallback(a.audio, script_lines)

    data = {"audio": os.path.relpath(os.path.abspath(a.audio), ROOT), "fps": FPS, "duration": round(duration(a.audio), 3),
            "source": source, "approxWords": source == "silencedetect", "note": note, "lines": lines, "words": words}
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"[word_times] {source}: {len(lines)} lines, {len(words)} words -> {os.path.relpath(a.out, ROOT)}")
    for l in lines:
        print(f"  {l['start']:6.2f}-{l['end']:6.2f}s  f{l['startFrame']:>4}-{l['endFrame']:<4} {l['text']}")


if __name__ == "__main__":
    main()
