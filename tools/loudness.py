#!/usr/bin/env python3
"""Hit an exact integrated loudness with a true-peak ceiling.
Method: gain -> look-ahead limiter (4x oversampled true-peak control), re-measure, correct, repeat.
Prints the final ffmpeg audio filter chain (use with -af / filter_complex), or writes a file with --out.
Usage: loudness.py input --lufs -14 --tp -1.5 [--out out.wav] [--json]"""
import argparse, json, re, subprocess, sys

def measure(inp, chain):
    cmd = ["ffmpeg", "-hide_banner", "-nostats", "-i", inp, "-map", "0:a:0", "-af",
           f"{chain},ebur128=peak=true" if chain else "ebur128=peak=true", "-f", "null", "-"]
    err = subprocess.run(cmd, capture_output=True, text=True).stderr
    summ = err[err.rfind("Summary:"):]
    i = float(re.search(r"I:\s+(-?[\d.]+|-inf) LUFS", summ).group(1))
    tp = float(re.search(r"Peak:\s+(-?[\d.]+|-inf) dBFS", summ).group(1))
    return i, tp

def chain_for(gain, tp):
    lim = 10 ** ((tp - 0.6) / 20)  # margin: alimiter is sample-peak, leave room for inter-sample peaks
    return (f"volume={gain:.2f}dB,aresample=192000,"
            f"alimiter=limit={lim:.4f}:attack=2:release=60:level=false:latency=true,aresample=48000")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inp"); ap.add_argument("--lufs", type=float, default=-14)
    ap.add_argument("--tp", type=float, default=-1.5); ap.add_argument("--out")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    i0, tp0 = measure(a.inp, "")
    # Secant search on gain: limiting makes loudness rise slower than gain on peaky audio.
    g0, g1 = a.lufs - i0, a.lufs - i0 + 1.0
    l0 = measure(a.inp, chain_for(g0, a.tp))[0]
    gain, ch, i, tp = g0, chain_for(g0, a.tp), l0, None
    for _ in range(8):
        ch = chain_for(g1, a.tp)
        l1, tp = measure(a.inp, ch)
        gain, i = g1, l1
        if abs(l1 - a.lufs) <= 0.1:
            break
        slope = (l1 - l0) / (g1 - g0) if abs(g1 - g0) > 1e-3 else 1.0
        slope = min(max(slope, 0.1), 1.5)
        g0, l0, g1 = g1, l1, min(g1 + (a.lufs - l1) / slope, 40.0)
    if abs(i - a.lufs) > 0.3:
        print(f"warning: could only reach {i:.1f} LUFS without breaking the true-peak ceiling", file=sys.stderr)
    if a.out:
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", a.inp, "-map", "0:a:0",
                        "-af", ch, "-c:a", "pcm_s16le", a.out], check=True)
    res = {"input_lufs": i0, "input_tp": tp0, "lufs": i, "true_peak": tp, "gain_db": round(gain, 2), "chain": ch}
    if a.json:
        print(json.dumps(res))
    else:
        print(f"loudness: {i0:.1f} LUFS -> {i:.1f} LUFS, true peak {tp:.1f} dBTP (gain {gain:+.1f} dB)", file=sys.stderr)
        print(ch)

if __name__ == "__main__":
    main()
