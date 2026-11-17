#!/usr/bin/env python3
"""Word times without Whisper: force-align a script to the voice using Allosaurus phone recognition.

Allosaurus (pip install allosaurus; model uni2005 is fetched from GitHub releases) is language-independent,
so it works for Hinglish / Hindi in Roman script / English. Each script word is turned into a rough phone
string, the recognised phones (with timestamps) are aligned to the whole script with Needleman-Wunsch, and
each word gets the time of its first and last aligned phone. Words are MEASURED, not spread by length.

Usage (normally called by tools/word_times.py):  align_words.py voice.wav script.txt [--json out.json]"""
import json, re, subprocess, sys, tempfile, os, unicodedata

# Spellings for letters / English words, as spoken in Indian English
SPELL = {
    "a": "e", "b": "bi", "c": "si", "d": "di", "rto": "artio", "xerox": "jiroks", "customer": "kastamar",
    "office": "ofis", "station": "stesan", "school": "skul", "comment": "koment", "answer": "ensar",
    "next": "nekst", "reel": "ril", "follow": "falo", "mall": "mol", "photo": "foto", "form": "form",
    "line": "lain", "zero": "jiro", "zyada": "jada", "smart": "smart", "the": "da", "in": "in",
    "hospital": "hospital", "yourhandle": "yorhendal", "pen": "pen",
}
VOW = set("aeiou")


def norm_text(word):
    w = word.lower().strip("@")
    w = re.sub(r"[^a-z]", "", w)
    if not w:
        return ""
    if w in SPELL:
        return SPELL[w]
    for a, b in [("aa", "a"), ("ee", "i"), ("oo", "u"), ("kh", "k"), ("gh", "g"), ("ch", "c"), ("sh", "s"),
                 ("th", "t"), ("dh", "d"), ("bh", "b"), ("ph", "f"), ("x", "ks"), ("w", "v"), ("y", "j"),
                 ("q", "k"), ("z", "j")]:
        w = w.replace(a, b)
    return w


IPA = [("t͡ʃ", "c"), ("tʃ", "c"), ("d͡ʒ", "j"), ("dʒ", "j"), ("ʂ", "s"), ("ʃ", "s"), ("ɕ", "s"), ("ɖ", "d"),
       ("ʈ", "t"), ("ɳ", "n"), ("ŋ", "n"), ("ɲ", "n"), ("ɾ", "r"), ("ʁ", "r"), ("ɹ", "r"), ("ɽ", "r"),
       ("ɔ", "o"), ("ə", "a"), ("ɐ", "a"), ("ɑ", "a"), ("æ", "e"), ("ɛ", "e"), ("ɪ", "i"), ("ʊ", "u"),
       ("ʒ", "j"), ("z", "j"), ("ɡ", "g"), ("w", "v"), ("ʋ", "v"), ("β", "v"), ("ɦ", "h"), ("x", "k"),
       ("ʔ", ""), ("ɯ", "u"), ("ɨ", "i"), ("ø", "o"), ("y", "i"), ("ʌ", "a"), ("ɒ", "o"), ("ɤ", "o")]


def norm_phone(p):
    for a, b in IPA:
        p = p.replace(a, b)
    p = "".join(c for c in unicodedata.normalize("NFD", p) if c.isascii() and c.isalpha())
    return p[:1]


CLASSES = ["pb", "td", "kgq", "cj", "sz", "fv", "mn", "lr", "aeiou"]


def score(a, b):
    if a == b:
        return 2.0
    if a in VOW and b in VOW:
        return 0.6
    for c in CLASSES:
        if a in c and b in c:
            return 0.6
    return -1.0


def recognise(wav):
    from allosaurus.app import read_recognizer
    with tempfile.TemporaryDirectory() as td:
        w16 = os.path.join(td, "v.wav")
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-ac", "1", "-ar", "16000", w16], check=True)
        out = read_recognizer("uni2005").recognize(w16, timestamp=True, lang_id="hin")
    res = []
    for line in out.strip().split("\n"):
        s, d, p = line.split()
        q = norm_phone(p)
        if q:
            res.append((float(s), float(d), q))
    return res


def align(script_lines, wav):
    words = []  # (display word, line index)
    for li, line in enumerate(script_lines):
        for w in line.split():
            if re.sub(r"[^A-Za-z]", "", w):
                words.append((w, li))
    target, owner = [], []
    for wi, (w, _) in enumerate(words):
        for ch in norm_text(w):
            target.append(ch); owner.append(wi)
    phones = recognise(wav)
    n, m = len(target), len(phones)
    GAP = -0.8
    S = [[0.0] * (m + 1) for _ in range(n + 1)]
    B = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        S[i][0] = i * GAP; B[i][0] = 1
    for j in range(1, m + 1):
        S[0][j] = j * GAP * 0.5; B[0][j] = 2   # extra recognised phones are cheap
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            opts = (S[i - 1][j - 1] + score(target[i - 1], phones[j - 1][2]), S[i - 1][j] + GAP, S[i][j - 1] + GAP * 0.5)
            k = max(range(3), key=lambda x: opts[x]); S[i][j] = opts[k]; B[i][j] = k
    hits = {}  # word index -> list of (start, end) of aligned phones
    i, j = n, m
    while i > 0 or j > 0:
        k = B[i][j] if i > 0 and j > 0 else (1 if i > 0 else 2)
        if k == 0:
            s, d, _ = phones[j - 1]
            hits.setdefault(owner[i - 1], []).append((s, s + d)); i -= 1; j -= 1
        elif k == 1:
            i -= 1
        else:
            j -= 1
    out = []
    for wi, (w, li) in enumerate(words):
        h = hits.get(wi)
        out.append({"word": w.strip(",.!?"), "line": li, "start": min(a for a, _ in h) if h else None,
                    "end": max(b for _, b in h) if h else None, "matched": len(h) if h else 0,
                    "letters": len(norm_text(w))})
    # Words with no aligned phones: pack them just BEFORE the next measured word (a short word after a
    # pause, like "A," is said right before the next word, not right after the previous one).
    k = len(out) - 1
    while k >= 0:
        if out[k]["start"] is None:
            nxt = next((out[x]["start"] for x in range(k + 1, len(out)) if out[x]["start"] is not None), None)
            prev = next((out[x]["end"] for x in range(k - 1, -1, -1) if out[x]["end"] is not None), 0.0)
            if nxt is None:
                nxt = prev + 0.06 * out[k]["letters"] + 0.1
            dur = 0.06 * out[k]["letters"] + 0.05
            out[k]["start"], out[k]["end"], out[k]["interpolated"] = max(prev, nxt - dur), nxt, True
        k -= 1
    for k in range(len(out) - 1):  # monotonic, no overlaps
        out[k + 1]["start"] = max(out[k + 1]["start"], out[k]["start"] + 0.02)
        out[k]["end"] = min(max(out[k]["end"], out[k]["start"] + 0.08), out[k + 1]["start"])
    for o in out:
        o["start"], o["end"] = round(o["start"], 3), round(o["end"], 3)
    return out


if __name__ == "__main__":
    wav, script = sys.argv[1], sys.argv[2]
    lines = [l.strip() for l in open(script, encoding="utf-8") if l.strip()]
    res = align(lines, wav)
    if "--json" in sys.argv:
        json.dump(res, open(sys.argv[sys.argv.index("--json") + 1], "w"), indent=1)
    for o in res:
        print(f"{o['start']:6.2f}-{o['end']:6.2f}  L{o['line'] + 1:<2} {o['word']:<12} {o['matched']}/{o['letters']}{'  (interp)' if o.get('interpolated') else ''}")
