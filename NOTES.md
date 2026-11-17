# NOTES

## Studio status (2026-11-17)
- Remotion 4.0.544 (blank TS template), React 19, rspack. Browser: pre-installed Chrome headless shell 153
  (`/opt/pw-browsers/chromium_headless_shell-1243/...`), set in `remotion.config.ts` (override with `REMOTION_BROWSER`).
  Remotion's own browser download (remotion.media) is blocked by the network policy.
- Fonts: Poppins 700/800 woff2 in `public/fonts/`, loaded by `src/lib/fonts.ts` (FontFace + delayRender). Import `FONT_FAMILY` from there.
- Sound pack: `public/sfx/*.wav` (whoosh pop ding tick click thud splash sparkle buzzer slam) + `public/music/loop.wav` (8 s loop).
  Regenerate with `python3 tools/make_sfx.py`.
- Whisper: installed, but the model download host (openaipublic.azureedge.net) is BLOCKED, so `word_times.py`
  falls back to line times. Allow that host under Network access to get real word times.

## Pipeline for a new reel
1. Voice arrives in `voice/<name>.wav` (+ optional `voice/<name>.txt`, one script line per line).
2. `tools/clean_voice voice/<name>.wav voice/<name>_clean.wav` (pauses >0.3 s -> 0.15 s, 1.1x speed, -16 LUFS; also writes `voice/<name>_clean.pauses.json`).
3. `python3 tools/word_times.py voice/<name>_clean.wav --script voice/<name>.txt` -> `public/words.json`.
   Check `"source"`: `whisper` = real word times; `silencedetect` = real LINE times, word times approximate (`"approx": true`).
4. Build `src/videos/<Name>/`, register in `src/Root.tsx`. Copy the voice into `public/` to use it with `staticFile`.
5. `tools/stills <Name> words:12 --out out/<name>_contact.png` -> check -> fix.
6. `npx remotion render <Name> out/<name>.mp4`
7. `python3 tools/make_watermark.py @handle` (once) then `tools/finish out/<name>.mp4` -> `out/<name>_final.mp4` (-14 LUFS, TP <= -1.5, watermark 30%).
8. Send the final mp4 + contact sheet, delete old renders, commit + push.

## Tool notes
- `tools/loudness.py` is shared by clean_voice and finish: gain + true-peak limiter, re-measured until within 0.1 LU.
  (Plain loudnorm undershot by ~1 LU on peaky voices, so it is not used.) finish limits at -2.2 so AAC encoding stays <= -1.5 dBTP.
- `tools/trim_pauses.py`: exact numpy pause trimmer (ffmpeg silenceremove left ~0.4 s gaps).

## Videos
- `ShopSpot` (src/videos/ShopSpot): SCRIPT WRITTEN (Hinglish, 10 lines, 109 words, A-D location puzzle from
  refs/business_ideas.mp4, idea only). Answer A (RTO office). Handle is still the placeholder @yourhandle.
  NEXT: wait for voice file in voice/, then clean_voice -> word_times -> build.
- `Test` (src/videos/Test): 5 s gradient + "STUDIO READY!" pop. Setup check only.
