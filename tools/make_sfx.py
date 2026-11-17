#!/usr/bin/env python3
"""Generate the starter sound pack with numpy (no downloads).
Writes public/sfx/*.wav and public/music/loop.wav (48 kHz, 16-bit)."""
import os
import numpy as np
import soundfile as sf

SR = 48000
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def env(n, a=0.005, d=0.2, curve=4.0):
    """Attack then exponential decay envelope of length n."""
    x = np.arange(n) / SR
    att = np.clip(x / max(a, 1e-4), 0, 1)
    dec = np.exp(-curve * np.clip(x - a, 0, None) / max(d, 1e-4))
    return att * dec


def lowpass(x, cutoff):
    """One-pole low-pass; cutoff may be an array (sweeps)."""
    cutoff = np.broadcast_to(np.asarray(cutoff, float), x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def bandpass(x, lo, hi):
    return lowpass(x, hi) - lowpass(x, lo)


def norm(x, peak=0.89):
    x = x - np.mean(x)
    m = np.max(np.abs(x)) or 1
    return (x / m * peak).astype(np.float32)


def fade(x, ms=5):
    n = int(SR * ms / 1000)
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    return x


def whoosh():
    d = 0.6
    n = len(t(d))
    noise = rng.standard_normal(n)
    sweep = np.concatenate([np.geomspace(300, 5000, n // 2), np.geomspace(5000, 600, n - n // 2)])
    shape = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return fade(bandpass(noise, sweep * 0.5, sweep) * shape)


def pop():
    x = t(0.12)
    f = 900 * np.exp(-x * 30) + 250
    ph = 2 * np.pi * np.cumsum(f) / SR
    return fade(np.sin(ph) * env(len(x), 0.001, 0.06))


def ding():
    x = t(1.6)
    s = sum(a * np.sin(2 * np.pi * 1320 * r * x) for r, a in [(1, 1), (2.76, 0.4), (5.4, 0.2), (2, 0.25)])
    return fade(s * env(len(x), 0.002, 0.9))


def tick():
    x = t(0.04)
    s = np.sin(2 * np.pi * 3000 * x) + 0.5 * rng.standard_normal(len(x))
    return fade(s * env(len(x), 0.0005, 0.008), 1)


def click():
    x = t(0.05)
    s = np.sin(2 * np.pi * 1800 * x) * 0.6 + bandpass(rng.standard_normal(len(x)), 1500, 6000)
    return fade(s * env(len(x), 0.0005, 0.012), 1)


def thud():
    x = t(0.5)
    f = 110 * np.exp(-x * 8) + 45
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.002, 0.25)
    dust = lowpass(rng.standard_normal(len(x)), 800) * env(len(x), 0.001, 0.05) * 0.8
    return fade(body + dust)


def splash():
    x = t(1.0)
    n = len(x)
    noise = rng.standard_normal(n)
    s = bandpass(noise, 400, 7000) * env(n, 0.01, 0.45, 3.5)
    for _ in range(25):  # droplets
        st = rng.integers(int(0.05 * SR), int(0.8 * SR))
        dx = t(0.05)
        f0 = rng.uniform(800, 2500)
        drop = np.sin(2 * np.pi * np.cumsum(f0 * (1 + dx * 8)) / SR) * env(len(dx), 0.001, 0.02)
        s[st:st + len(dx)] += drop[: n - st] * rng.uniform(0.2, 0.6)
    return fade(s)


def sparkle():
    d = 1.2
    n = len(t(d))
    s = np.zeros(n)
    notes = [2093, 2349, 2637, 3136, 3520, 4186]
    for k in range(14):
        st = int(k * 0.06 * SR)
        dx = t(0.35)
        f = notes[k % len(notes)] * rng.choice([1, 2])
        tone = np.sin(2 * np.pi * f * dx) * env(len(dx), 0.002, 0.2)
        end = min(n, st + len(dx))
        s[st:end] += tone[: end - st] * (1 - k / 16)
    return fade(s)


def buzzer():
    x = t(0.7)
    saw = 2 * ((x * 140) % 1) - 1 + 0.6 * (2 * ((x * 147) % 1) - 1)
    s = lowpass(saw, 2500)
    shape = np.clip(x / 0.01, 0, 1) * np.clip((0.7 - x) / 0.05, 0, 1)
    return fade(s * shape)


def slam():
    x = t(0.9)
    n = len(x)
    boom = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-x * 4) + 35) / SR) * env(n, 0.001, 0.5)
    crack = bandpass(rng.standard_normal(n), 200, 5000) * env(n, 0.0005, 0.08)
    return fade(np.tanh(2.5 * (boom + crack)))


def music_loop():
    """Soft 8 s loop: 120 bpm, 4 bars of 2 s; pads + plucks + light hats. Seamless."""
    d = 8.0
    n = int(SR * d)
    x = np.arange(n) / SR
    out = np.zeros(n)
    chords = [[261.6, 329.6, 392.0], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [196.0, 246.9, 293.7]]
    for i, ch in enumerate(chords):
        st, en = int(i * 2 * SR), int((i + 1) * 2 * SR)
        seg = x[st:en] - i * 2
        pad = sum(np.sin(2 * np.pi * f * seg) + 0.3 * np.sin(2 * np.pi * 2 * f * seg) for f in ch)
        shape = np.minimum(1, seg / 0.3) * np.minimum(1, (2 - seg) / 0.3)
        out[st:en] += pad * shape * 0.12
        out[st:en] += np.sin(2 * np.pi * ch[0] / 2 * seg) * shape * 0.25  # bass
        for b in range(4):  # pluck on each beat (arpeggio)
            ps = st + int(b * 0.5 * SR)
            px = t(0.45)
            f = ch[b % 3] * 2
            pl = (np.sin(2 * np.pi * f * px) + 0.3 * np.sin(4 * np.pi * f * px)) * env(len(px), 0.003, 0.3)
            out[ps:ps + len(px)] += pl * 0.18
    for h in range(32):  # off-beat hats on 8ths
        hs = int((h * 0.25 + 0.125) * SR)
        hx = t(0.05)
        hat = rng.standard_normal(len(hx)) * env(len(hx), 0.0005, 0.015)
        out[hs:hs + len(hx)] += hat * 0.05
    out = lowpass(out, 6000)
    return norm(out, 0.6)


def music_sad():
    """Soft sad 8 s loop: A minor - F - C - E, slow felt-piano notes over warm pads. Seamless."""
    d = 8.0
    n = int(SR * d)
    x = np.arange(n) / SR
    out = np.zeros(n)
    chords = [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [130.8, 196.0, 261.6], [164.8, 207.7, 246.9]]
    for i, ch in enumerate(chords):
        st, en = int(i * 2 * SR), int((i + 1) * 2 * SR)
        seg = x[st:en] - i * 2
        shape = np.minimum(1, seg / 0.6) * np.minimum(1, (2 - seg) / 0.6)
        pad = sum(np.sin(2 * np.pi * f * seg) + 0.2 * np.sin(2 * np.pi * 2.003 * f * seg) for f in ch)
        out[st:en] += pad * shape * 0.1
        out[st:en] += np.sin(2 * np.pi * ch[0] / 2 * seg) * shape * 0.18
        for b, k in enumerate([2, 1, 0, 1]):  # slow broken chord, one note per half second... every 0.5 s
            ps = st + int(b * 0.5 * SR)
            px = t(1.2)
            f = ch[k] * 2
            pl = (np.sin(2 * np.pi * f * px) + 0.25 * np.sin(4 * np.pi * f * px)) * env(len(px), 0.004, 0.9, 3.0)
            end = min(n, ps + len(px))
            out[ps:end] += pl[: end - ps] * 0.12
            if ps + len(px) > n:  # wrap tail for a seamless loop
                out[: ps + len(px) - n] += pl[end - ps:] * 0.12
    out = lowpass(out, 3500)
    return norm(out, 0.6)


def main():
    sfx_dir = os.path.join(ROOT, "sfx")
    os.makedirs(sfx_dir, exist_ok=True)
    os.makedirs(os.path.join(ROOT, "music"), exist_ok=True)
    for fn in [whoosh, pop, ding, tick, click, thud, splash, sparkle, buzzer, slam]:
        path = os.path.join(sfx_dir, fn.__name__ + ".wav")
        sf.write(path, norm(fn()), SR, subtype="PCM_16")
        print("wrote", os.path.relpath(path))
    for name, fn in [("loop.wav", music_loop), ("sad_loop.wav", music_sad)]:
        path = os.path.join(ROOT, "music", name)
        if name == "loop.wav" and os.path.exists(path) and os.environ.get("ONLY_NEW"):
            continue
        sf.write(path, fn(), SR, subtype="PCM_16")
        print("wrote", os.path.relpath(path))


if __name__ == "__main__":
    main()
