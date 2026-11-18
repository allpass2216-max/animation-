# NOTES

## Studio status (2026-11-17)
- USER HANDLE: **@rehanfact** (given 2026-11-17). Use it in scripts, watermark (tools/make_watermark.py @rehanfact) and post.md.
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
- `DinnerSecret` (src/videos/DinnerSecret): FINAL DONE (2026-11-17). out/dinnersecret_final.mp4: 35.9 s, -14.0 LUFS, TP -2.8 dBTP,
  watermark @yourhandle (PLACEHOLDER) low-left. Caption + pinned comment in post.md. Part 2 must reveal A (own your truth only).
  v2 (user fix): opening now starts OUTSIDE: street with COACHING + CITY MALL; shrug at coaching on "coaching", points at the mall
  and walks in on "mall"; hard cut inside just before "Chachu"; he jumps back scared and drops the ice-cream (it no longer covers his face).
  v3 (user fix): he wears a blue tuition backpack (Character `backpack` prop) outside, in the mall and in the eye-lock scene.
  Recording matches script.md. Voice 43.1 s -> 34.0 s clean; allosaurus-align 107/109 measured; ~1077 f. Music: loop.wav.
  Scenes: mall (you + ice-cream, Chachu slides in on "Chachu", scoop falls + splats) -> Chachu leaves "for office", Dadi waves
  -> park bench, calendar SEP/OCT tear off -> eye-lock zap "TU KUCH MAT BOLNA" -> dinner (two-row seating, close-ups per beat)
  -> Papa asks, slam "AAJ KYA PADHAYA?" -> A-D framed on who it's about -> outro + follow tap. Answer A. Handle placeholder.
  Rig additions: mustache, tie, glasses, sweat cue, ice-cream prop. Fixed: sweat no longer shows before its first cue.
- `AiCrore` (src/videos/AiCrore): FINAL DONE (2026-11-17). out/aicrore_final.mp4: 35.8 s, -14.1 LUFS, TP -2.8 dBTP,
  watermark @yourhandle (PLACEHOLDER) low-left. Caption (with fictional disclaimer) + pinned comment in post.md.
  Part 2 must reveal A, and give the real steps: 1930 cyber helpline / cybercrime.gov.in + bank fraud line to freeze the account.
  Recording matches script.md. Voice 41.9 s -> 33.9 s clean; allosaurus-align 109/109; ~1074 f. Music: loop.wav.
  Ishaan = RAPPER look (user asked): red snapback, gold chain, black hoodie, shades on/off cues (Character cap/chain/hood/shades).
  Scenes: hostel midnight + big phone (balance 2,000, chat "MUJHE AMEER BANA DE") -> 6 AM balance races to 50 crore + bank alert
  + coin rain -> transfers list counting 2,500 -> AI chat "HO GAYA / KISI KO MAT BATANA" -> unknown call, red rays, "PAISA HUMARA
  HAI", "10% TUMHARA" -> A cyber cell + bank / B money flies to hooded scammer / C app into trash / D party -> outro + follow.
  Answer A. Handle placeholder. night.tsx moved to src/lib/night.tsx (shared).
- `OyoSecret` (src/videos/OyoSecret): FINAL DONE (2026-11-17). out/oyosecret_final.mp4: 36.1 s, -14.0 LUFS, TP -2.7 dBTP,
  watermark @rehanfact (public/watermark.png now = @rehanfact). Caption + pinned comment in post.md. Part 2: answer A.
  TOON experiment (round heads, stick limbs; composition `OyoSecretToon`, src/lib/ToonCharacter.tsx, src/lib/atmosphere.tsx,
  CharStyle switch in Character.tsx): user did NOT like it ("bekar ha, rehne do"). Shelved; not used. Do not use unless asked.
  Recording matches script.md. Voice 43.1 s -> 34.3 s clean; allosaurus-align 110 words, "A" corrected to f641 from the
  pause file (aligner had put it on top of "the"). ~1084 f. Music: loop.wav.
  Scenes: hotel lobby (neon ROOMS 24x7, key rack, counter + bell): girlfriend left, you right, Chachu at reception turns round on
  "Chachu", all three shocked -> office lie (Dadi waves) -> park bench + calendar -> eye-lock at the counter -> dinner (shared
  family layout) -> Papa asks, slam "KAL RAAT KAHAN THE?" -> A-D close-ups -> outro + follow tap. Answer A. Handle @rehanfact.
  Shared code: DinnerSecret places moved to src/lib/family.tsx; Character longHair + earrings; parked shades only if shades used.
  v2 (user fixes): hotel redone dark pink + purple (neon ROOMS 24x7 glow, neon heart, chandelier, pink LED strips, velvet sofa,
  glossy floor, purple counter with pink LED edge); boy = smart (navy blazer, white shirt, quiff); girl = glam (party dress,
  lipstick, lashes, hoop earrings, purse, dropped when she panics). Rig: blazer/quiff/dress/lipstick/lashes/purse; sleeves
  take the blazer colour.
  v3 (user fixes): whole video at NIGHT (HomeFront/ParkBench/DinnerRoom `night` props: stars, moon, lit windows, street lamp);
  new DinnerTableNice (perspective wood top, runner, food, dal + steam, roti basket, glasses, cloth with scalloped hem);
  Chachu ANGRY: points + glares in the lobby on "kaha", glares on "pota" and when Papa asks, points angrily in B and D.
  Rig: "angry" expr now adds red face flush, anger vein, steam puffs (affects all videos that use "angry").
- `RotiBeej` (src/videos/RotiBeej): SCRIPT WRITTEN (Hinglish, 10 lines, 104 words, A-D from refs/ref5.mp4, idea only: same
  salary 30,000; one spends all, one does SIP 3,000/month at 12% for 10 years). Answer A ~7 lakh (6,97,017, checked).
  Handle @rehanfact. NEXT: wait for voice file in voice/; check which script version was recorded.
