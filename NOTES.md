# NOTES

## Studio status (2026-11-17)
- Remotion 4.0.544 (blank TS template), React 19, rspack. Browser: pre-installed Chrome headless shell 153
  (`/opt/pw-browsers/chromium_headless_shell-1243/...`), set in `remotion.config.ts` (override with `REMOTION_BROWSER`).
  Remotion's own browser download (remotion.media) is blocked by the network policy.
- Fonts: Poppins 700/800 woff2 in `public/fonts/`, loaded by `src/lib/fonts.ts` (FontFace + delayRender). Import `FONT_FAMILY` from there.
- Sound pack: `public/sfx/*.wav` (whoosh pop ding tick click thud splash sparkle buzzer slam) + `public/music/loop.wav` (8 s loop).
  Regenerate with `python3 tools/make_sfx.py`.
- Whisper: installed, but the model download host (openaipublic.azureedge.net) is BLOCKED.
  `word_times.py --script` then uses `tools/align_words.py`: Allosaurus phone recognition (pip `allosaurus`,
  model from GitHub) + forced alignment to the script = MEASURED word times (`"source": "allosaurus-align"`).
  Words with no matched phones are flagged `"interpolated"` (placed just before the next measured word).

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
- `tools/finish` watermark default is now left, just above the bottom 300 px (48:H-380); the old 60% spot can cover faces.
- `tools/trim_pauses.py`: exact numpy pause trimmer (ffmpeg silenceremove left ~0.4 s gaps).

## Videos
- `ShopSpot` (src/videos/ShopSpot): FINAL DONE (2026-11-17). out/shopspot_final.mp4: 35.6 s, -14.0 LUFS, TP -2.8 dBTP,
  watermark @yourhandle (PLACEHOLDER: rerun `python3 tools/make_watermark.py @realhandle && tools/finish out/shopspot.mp4 out/shopspot_final.mp4`,
  and replace @yourhandle in post.md). Mix check: voice -16 LUFS, music+sfx bed ~-30 LUFS under it. Caption + pinned comment in post.md.
  Part 2 must reveal: A (RTO office) — need created on the spot; B rent/wrong crowd; C price war; D no footfall.
  Voice: voice/shopspot.mp3 (ElevenLabs, 41.0 s) -> voice/shopspot_clean.wav (33.7 s) -> public/voice/shopspot.wav.
  Recording matches script.md word for word. Word times: allosaurus-align, 104/109 measured; snapshot in
  src/videos/ShopSpot/words.json (cues are checked by word text in ShopSpot.tsx). Duration 1072 f (voice + 2 s).
  Scenes: hook street (title 50,000 RUPEES / 4 SPOTS, 1 WINNER, money drop on "doob") -> shop (xerox prints,
  photo flash) -> idea bulb (punch-in on "jahan") -> hospital/station/school stalls -> re-hook rays + slam ->
  A RTO queue / B mall crowd / C two xerox shops / D sleepy gali, tiles stacked at top -> outro, Follow tap on handle.
  Answer A (RTO office). Handle still the placeholder @yourhandle (Follow button shows no handle text).
  Shared code made for this: src/lib/reel.tsx (Chip, Camera, Dust, Sparkles, Grain...), src/lib/Character.tsx (rig + Extra).
- `Test` (src/videos/Test): 5 s gradient + "STUDIO READY!" pop. Setup check only.
- `LateNight` (src/videos/LateNight): FINAL DONE (2026-11-17). out/latenight_final.mp4: 35.4 s, -14.0 LUFS, TP -2.7 dBTP,
  watermark @yourhandle (PLACEHOLDER) at the new default spot 48:H-380 (H*0.60 covered Maa's face). Caption + pinned comment in post.md.
  Part 2 must reveal A: he searched the city for her BP medicine (12:30 AM bill), and the mother's regret.
  Recording voice/latenight.mp3 = script v1 WITH A-D options (not the v2 story); built as recorded. Recorded text: voice/latenight.txt.
  Voice 42.0 s -> 33.6 s clean; allosaurus-align 109/110 measured; duration ~1063 f. Sad music: public/music/sad_loop.wav.
  Scenes: doorway 1 AM (Maa shouts) -> clock time-lapse 7->1 -> Kabir leaves on bike -> CLUE 1 empty pill strip -> CLUE 2 shutters at 9
  -> CLUE 3 12:30 AM bill from pocket -> re-hook "6 GHANTE KAHAN THA?" -> A bike past shut shops / B party / C office / D gaming
  -> Maa crying "GUSSE KA EK SHABD WAPAS NAHI AATA" -> tiles + ANSWER NEXT REEL + follow tap. Answer A. Handle placeholder.
  Shared code added: src/lib/world.tsx (moved from ShopSpot), src/lib/ui.tsx (Tiles, FollowButton), Character mom variant,
  props (bag/phone/helmet), expressions angry/sad/cry.
