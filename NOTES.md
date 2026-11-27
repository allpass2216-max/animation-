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
- `AiCrore2` (src/videos/AiCrore2): Part 2 (answer A). FINAL (2026-11-20): out/aicrore2_final.mp4, 39.7 s, -14.0 LUFS,
  TP -2.7 dBTP, @rehanfact watermark, post.md written. Comment card went out with the fallback (no real comment given). Voice 47.2 s -> 37.9 s,
  allosaurus-align 119/119, recording matches script. Scenes: recap (balance + unknown call, rays on "jawab ye raha") -> A-D tiles,
  B/C/D crossed, A green -> dial 1930 + cybercrime.gov.in -> bank fraud line, FROZEN lock -> SEND crossed, screenshots -> money-mule
  diagram (victims -> Ishaan -> hooded scammer, siren on "phanste") -> comment card -> AI bot runs off with ₹2,000 -> ask -> parcel +
  OTP teaser + follow. VIEWER_COMMENT const in AiCrore2.tsx is null (fallback card) until the user sends a real comment.
  Originally: SCRIPT ONLY (2026-11-20), waiting for voice/aicrore2.mp3 and
  the real viewer comment + username (user left the template blank; never invent one, fallback card "AAPKA COMMENT YAHAN?").
  Same Ishaan rapper look + hostel/phone/cyber-cell world. Steps: 1930 / cybercrime.gov.in, bank freeze, don't touch + screenshots.
  Twist: account safe but the AI ran off with his ₹2,000. Teaser: parcel + OTP. Handle @rehanfact.
- `MurgaAnda` (src/videos/MurgaAnda): FINAL (2026-11-21) out/murgaanda_final.mp4, 29.6 s, -14.0 LUFS, TP -2.6 dBTP,
  @rehanfact watermark, post.md written. Part 2 must reveal D (a rooster does not lay eggs). ref refs/ref11.mp4.
  RECORDING DIFFERS: it starts at "Sonu aur Monu padosi hain" (hook line + "Indore ke ek mohalle mein" not recorded); built from
  the recording (voice/murgaanda.txt = what was said). Voice 36.3 s -> 27.7 s, so the video is 29.7 s (just under 30 s).
  "A" moved +8 f onto the word (pause file). One mohalla world (sky, far city, houses SONU/MONU, neem, wall, crowd heads),
  chunky rooster that walks, flaps up the wall and "lays" the egg, which rolls off and falls to Monu's side; arrows/split/? per
  option. FollowButton got enter="below" (finger comes straight up between the two characters).
  v2 (user fix): old-man village elders (Character got topi / pagdi / mustacheColor / wrinkles props): Sonu orange pagdi + white
  kurta-dhoti, Monu white Gandhi topi, glasses, grey beard. Whole video at night in a village: mud huts with thatched roofs,
  wooden name planks, lanterns, moon, hills + palms, haystack, matkas, fireflies, moonlight grade (NightGrade). Voice says
  "ek subah", so that chip is now "SUBAH 4 BAJE" (still dark, rooster time).
  v3 (user fix): the dividing wall is now a full mud-brick wall in the FOREGROUND, dead centre (x 440-640, from y 1140 down past
  the frame bottom), between the two men; rooster starts on Sonu's side at his feet, flies up onto it; egg falls to Monu's feet. Indore mohalla, padosi Sonu (blue house) + Monu (pink house), wall between, Sonu's laal murga "lays" an egg.
  Answer D (kisi ka nahi: a rooster can't lay eggs). Only riddle 1 used (riddle 2 not understood without audio). Handle @rehanfact.
- `ShaadiChor` (src/videos/ShaadiChor): FINAL (2026-11-21) out/shaadichor_final.mp4, 36.4 s, -14.0 LUFS, TP -2.4 dBTP,
  @rehanfact watermark, post.md (prize rules: letter + reason, follow, random pick among correct answers). Part 2: reveal C
  (plaster side swap, arrow comparison) + announce a REAL winner the user picks. ref refs/ref12.mov.
  Recording matches script. Voice 44.6 s -> 34.5 s. Aligner drifted in quiet spans, so some cues use afterPause() over
  ./pauses.json (measured). Costumes (Character got policeCap, police [belt + holstered pistol + epaulettes], sling right/left
  [plaster + blue sling], camera, apron, haar, veil, bindi, mehendi; holding ladle / broom). Scenes: bride in dressing room
  finds her neck empty -> inspector walks in, 4 suspects pop into a lineup -> kitchen / mehendi corner / photo stage / chhat
  close-ups -> inspector smiles -> lineup (Vicky's plaster now on LEFT), magnifier sweep -> A-D with spotlights -> ₹100 prize
  (note, coins, confetti, share plane) -> outro with inspector + follow. Wedding night in Lucknow, haar gayab; Inspector Rana; suspects Ramesh (halwai), Neha (cousin),
  Vicky (photographer, plaster: SAYS right hand broken, plaster on LEFT in the lineup), Kamla bai. Answer C (Vicky).
  User add-on: ₹100 cash prize for a correct comment + "share with a friend for help" + winner paid in Part 2. Handle @rehanfact.
- `LightGayi` (src/videos/LightGayi): FINAL (2026-11-27) out/lightgayi_final.mp4, 31.3 s, -14.1 LUFS, TP -2.7 dBTP,
  @rehanfact watermark, post.md (first correct comment wins ₹100). Part 2: reveal C + announce the REAL first correct
  commenter. ref refs/ref13.mp4.
  Recording matches script. Voice 39.0 s -> 29.4 s (video ~31.4 s). light/A/B/C/D cues from pauses.json (afterPause).
  Room (tube light flickers off on "light", fan slows down, window, calendar EXAM, almirah with a fingerprint locker), Dark
  overlay with phone glow, device cards with battery bars (phone fills to 70%, torch/locker blink red at 0%), power bank,
  bus clock, A-D with the card highlighted, ₹100 prize (reuses ShaadiChor PrizeBackdrop/HundredNote) + 5-4-3 countdown.
  No "panic" pose here: its hand covers the face.
  v2 (user fix): opening = Riya asleep on her bed (new Character expr "sleep", lying = whole rig rotated -90deg about the
  feet, blanket, Zzz), jumps out of bed on "raat" (blanket falls behind her), then the whole mohalla's lights go out on
  "light" (houses in the window go dark one by one, street lamp, tube light, fan slows). Chip "MOHALLE KI LIGHT GAYI!".
  v3 (user fix): on "admit card band locker" a hard cut to a HUGE steel safe (BigLocker: rivets, 3 bolts, spoked wheel,
  crossed chains, giant padlock, dead fingerprint pad); Riya walks up to it in three-quarter view (face visible, never her
  back) and tugs: the wheel jerks but won't turn. Chip "KHULEGA HI NAHI!". Riya in Patna, night before the exam, power cut, admit card in a fingerprint locker; one
  power bank charges ONE thing; phone 70%, torch 0%, locker 0%. Answer C (locker; phone flashlight solves the dark).
  User add-on: FIRST correct comment wins ₹100. Handle @rehanfact.
- `Fitrat` (src/videos/Fitrat): SCRIPT ONLY (2026-11-27), ref refs/ref14.mp4 ("Insaan ki fitrat" analogy reel). Waiting
  for voice/fitrat.mp3. LESSON genre (no puzzle, no A-D): neem + honey, cat guarding milk; Aman paid friend Rohit's fees and
  gave his bike, Rohit's phone was off the night Aman's papa was in hospital; twist: Rohit didn't change, the signs were there.
  SEEKH: love everyone, but give trust by watching small actions. Handle @rehanfact.
- `SauKiSpeed` (src/videos/SauKiSpeed): FINAL (2026-11-27) out/saukispeed_final.mp4, 35.2 s, -14.0 LUFS, TP -2.7 dBTP,
  post.md written. Watermark at --pos 48:H-320 (the default H-380 touches the karaoke captions; use this for style-v2
  videos). Part 2: reveal D (brake, HUD 150 m vs ~84 m stopping distance) + first correct username. FIRST video in
  HOUSE STYLE v2. Recording matches script; voice 41.6 s -> 33.3 s (video ~35.3 s). clue/A cues from pauses.json.
  New shared kit src/lib/style2.tsx (KaraokeCaptions, Pill, QuestionBanner, Hud, OptionList, CountdownBadge, CtaStrip,
  ShareBubble, ProfileCard with the user's avatar public/freeeditor/avatar.jpg). World: Highway (vanishing point, rushing
  dashes + verge bushes), PovFrame (pillars, mirror + garland, dashboard, wheel + hands, tremble), CarInterior (window with
  scrolling fields, seat, cushion) + DoorFront, our Goat + Buffalo. Character got `seatbelt`. Sharma ji at 100 km/h; bakri, bhains, selfie boy on the road; Mummy / Pinki / the boy pull
  different ways. HUD clue: 150 m. Answer D (kisi ko nahi, brake: ~84 m stopping distance at 100 km/h). Build in HOUSE STYLE v2.
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
- `RotiBeej` (src/videos/RotiBeej): FINAL DONE (2026-11-18). out/rotibeej_final.mp4: 38.0 s, -14.0 LUFS, TP -2.7 dBTP,
  watermark @rehanfact. Caption (with "12% is an example, not advice" note) + pinned comment in post.md.
  Part 2: answer A ~7 lakh (6,97,017); 20 yrs ~30 lakh, 30 yrs ~1.06 crore.
  ANIME version (user: "pura cel animation style"): composition `RotiBeejAnime` (same voice/timing). src/lib/AnimeCharacter.tsx
  (thin outlines, two-tone cel shading, big shiny eyes, spiky hair + highlight; same props as Character), switched with
  <CharStyle.Provider value="anime">; src/lib/atmosphere.tsx AnimeLight (light rays, dust) + AnimeShock (speed lines, edge
  flash, red "!?") on "crorepati", "kitne", "crore". Friends become anime characters too.
  FINAL DONE (2026-11-18): out/rotibeej_anime_final.mp4, 38.0 s, -14.0 LUFS, TP -2.7, @rehanfact. Same post.md as RotiBeej.
  Recording matches script.md. Voice 43.9 s -> 36.3 s clean; allosaurus-align 104 words, "A" corrected to f664 from the pause
  file. ~1146 f. Music loop.wav. Scenes: office front (Rohan flashy + notes flutter, Kunal neat + small BEEJ pot) -> mall
  (notes, phone) -> hard cut to party + parcels -> Kunal's room, coins into BEEJ pot, sprout on "SIP" -> friends laugh
  "3,000 SE CRORE?" -> green rays, SAAL 1->10 counter, pot glows -> A-D note-bundle stacks (7/4/11/18 bundles) -> roti (empty
  plate) vs beej (pot + sprout), vine divider -> follow tap. Answer A ~7 lakh. Handle @rehanfact.
  v2 (user fix): Rohan deep brown skin (#5c3a24), Kunal fair (#f6d3b3) so they read apart; both in three-quarter view facing
  each other (new Character `turn` prop, 0 = front; default 0 so older videos are unchanged).
- `AnimeTest` (src/videos/AnimeTest): 3 s STYLE TEST only (user asked for Japanese TV anime look): thin dark outlines, two-tone
  cel shading, big shiny eyes, spiky hair with highlight, painted afternoon room (soft clouds, god rays, wooden floor);
  salary slip slips at f30 -> quick zoom f38, speed lines, sweat drop, red "!?". Waiting for user verdict before using it anywhere.
- `JaaduRubber` (src/videos/JaaduRubber): FINAL DONE (2026-11-18). out/jaadurubber_final.mp4: 36.3 s, -14.0 LUFS, TP -2.7,
  @rehanfact. post.md: open question caption (no options) + pinned comment promising Chintu tries the funniest idea next reel. Genre-matched to reference
  "The power of Big small" (playful what-if fantasy): NO puzzle, NO options, open comment question at the end.
  Chintu's Rs 1 eraser: blue = big, red = small. Recording matches script.md. Voice 40.4 s -> 34.4 s; 109 words aligned;
  ~1090 f. Scenes: raddi cart hook -> rules (pencil grows/shrinks) -> chai -> bucket -> 10 kg bag -> matchbox -> shrinks
  himself into a full auto -> giant mango + mohalla kids -> garbage shrunk + flicked into dustbin -> toy house -> real house
  for Maa + confetti -> "tum kya bada karte / kya chhota?" -> follow tap. Handle @rehanfact.
  Rule learned: match the reference's genre; never force A-D options when the reference has none.
- `TankiRassi` (src/videos/TankiRassi): FINAL DONE (2026-11-18). out/tankirassi_final.mp4: 36.9 s, -14.1 LUFS, TP -2.8,
  @rehanfact. post.md: caption with all 4 options + pinned comment asking for the method. Recording matches script.md.
  v2 (user fix): opening now shows the WHOLE tank (zoomed out) with Raju teetering on the top edge, leaning out, pebbles
  crumbling, wind, red "!"; the ladder up the shaft snaps on "toot" and its top half falls to the ground with dust.
  GOLDEN version (user: "isi style se"): composition `TankiRassiGolden` (same voice/timing). tank.tsx `Golden` context:
  painted dusk sky (brush strokes, streak clouds lit from below, setting sun at the horizon, moon), backlit town silhouettes,
  tank/ledge/roof as dark silhouettes with a gold rim; characters get a warm drop-shadow rim (GChar). Kept as dusk because
  the voice says "raat das baje". STAGE 1 BUILT, waiting for "go to final".
  Voice 42.8 s -> 35.2 s; 110 words aligned; ~1110 f. Scenes: roof close-up at night (height bar, ladder snaps + falls)
  -> rope coil + knife -> full-height tank diagram (scale: 120 ft = 1040 px; hooks glow when named) -> fail: whole rope from
  the top, red 30 FT gap, "ZINDA KAISE?" -> A acted out (30 loop, 60 doubled to the ledge, pull free, slide 60 ft down) /
  B jump + dizzy stars / C knot 60 ft above circled "?" / D rope cut into shorter pieces -> outro + follow. Answer A.
  Lesson: SVG shapes must sit inside an <svg> (NightField rendered nothing until wrapped).
- `SavannaTest` (src/videos/SavannaTest): 10 s STYLE TEST (user prompt: golden-hour painting). Painted sky with turbulence-
  displaced horizontal brush strokes, streak clouds lit from below, low sun + bloom, hazy ridges, flat-topped acacias, birds,
  elephant family (2 adults + calf) as dark backlit silhouettes with a blurred gold rim, diagonal-pair leg gait, swinging
  trunks, flapping ears, tusks, glowing dust at the feet, tall grass with gold tips. No voice. Awaiting user verdict.
- `SajdaRaat` (src/videos/SajdaRaat): FINAL DONE (2026-11-19). out/sajdaraat_final.mp4: 36.2 s, -14.1 LUFS, TP -2.7, @rehanfact.
  post.md: reminder caption (verse + "Ameen" comment ask), pinned dua comment. Voice 45.3 s -> 34.5 s; 109 words.
  v2 (user fix): readable sweet chat on the phone (khana khaya? / tumse baat karke achha lagta hai / mujhe bhi / good night),
  then her side on "ghar": the chat girl (lavender hijab, own pink-purple room) smiling at her phone with hearts; chip "KISI KO PATA NAHI".
  v3 (user fix): "dil bhaari" scene shows him disturbed: pacing the dark room, phone put aside, holding his head, crying + sweat,
  a rain cloud with lightning over his head, thought bubble "YEH THEEK NAHI..."; at the azan he stands crying, turned away.
  User asked: Muslim characters, Muslim city, Arabic text, beautiful hijabi girl. Built: arabesque-tile room, arched window with
  domes/minarets, fanoos lantern, Quran on a rehal, prayer mat; Arham (white kurta, beard, kufi after wudu); Ammi (hijab,
  glasses); hijabi bride at the nikah arch; Muslim city skyline (night / golden / dawn). Arabic (Amiri font, @fontsource/amiri,
  public/fonts/Amiri-*.woff2): Bismillah, Quran 17:32 "wa la taqrabu az-zina", "Subhana Rabbiyal A'la", "Barakallah",
  "Sadaqah Jariyah". Rig additions: hijab, kufi, beard. Music: public/music/hum_loop.wav (hummed, no instruments).
  NOTE: CLAUDE.md forbids Devanagari on screen; Arabic was explicitly requested by the user for this video.
- `FreeEditor` (src/videos/FreeEditor): FINAL out/freeeditor_final.mp4 (34.9 s, -14.1 LUFS, @rehanfact watermark), post.md written. Voice 37.7 s -> 33.0 s; 103 words.
  Tech-tip format: pastel desk, big laptop whose screen changes (paywall popup -> generic app icon "Kdenlive" (NOT the official
  logo) -> multi-track timeline with titles/transitions/effects -> render to MP4 -> week of reels), numbered feature cards 1-4,
  crossed-out WATERMARK / RS 999/MONTH, MP4 + 4K badges, big bookmark on "save", comment box typing EDIT, follow tap.
  Sahil (hoodie) presents from the bottom right. No options (genre rule). Handle @rehanfact.
  v2 (user fix): background = the user's sky image (public/freeeditor/sky.jpg, slow drift); presenter = the user's
  sunglasses avatar (public/freeeditor/avatar.jpg) in a rounded white app-icon card that bobs, tilts, pops on beats, shakes on "band".
  v3 (user ref10, Apple-style UI motion): every laptop screen change is a focus-pull (blur 26->0, scale .84->1 overshoot,
  3D rotateX/Y settle; exit blurs out), idle 3D tilt + deep soft shadow, Face-ID style glowing blue brackets + scan line
  around the Kdenlive icon, feature cards slide in with 3 stacked colour cards behind, badges blur in.
  Final fix: WINDOWS/MAC/LINUX badges no longer overlap (size 40, LINUX on a second row).

## HOUSE STYLE v2 (user request 2026-11-27, from refs/ref15.mp4 "120 ki speed, kisko maaroge?")
Use this FORMAT and production quality for every new video. Copyright (CLAUDE.md): take only the format and quality, never
that channel's characters, their designs, its name/mascot/branding or its scenes. Our own characters, our own handle.
- **Look:** flat 2D Indian cartoon, clean thick dark outlines, soft cel shading, bright saturated daylight palette (sky blue,
  green and mustard fields, grey highway), big round heads, big expressive eyes, every character with a clear costume identity.
- **Shots (hard cut every 1-1.5 s, slow push-in inside a shot):** first-person POV (hands on the wheel / handlebar, dashboard,
  mirror with a marigold garland) looking down a vanishing-point road; medium shots of people INSIDE the vehicle (seats,
  seatbelt); extreme close-ups where a face or animal fills the frame; insert shots (foot on the brake, phone screen);
  wide shot of the subjects on the road.
- **On-screen system:** small series pill top-left ("PAHELI #N"); a name pill top-left when a character speaks; 2-line
  question banner at the top (white + yellow highlight word + emoji); a HUD when it fits (speed km/h, distance counting down);
  word-by-word karaoke captions with the key word in yellow (kept ABOVE the bottom 300 px, ~y 1450-1520, per CLAUDE.md);
  options as a small numbered list at the left (1, 2, 3 or A-D) with an emoji icon each; a countdown badge (12 -> 1) during
  the question; CTA strips ("COMMENT 1, 2 YA 3? + REASON", green "SABSE PEHLE SAHI = NAAM PART 2 MEIN"); a white speech-bubble
  share prompt ("... DOST KO BHEJO!"); end card = OUR profile card (@rehanfact) with FOLLOW tapped by a hand.
- **Characters (our own designs, same build quality):** chibi-ish proportions: head about 1/3 of the body, round or
  slightly squared face, big white eyes with large dark pupils and a white catch-light, thick brows that carry the emotion,
  simple nose, wide mouth (open teeth / tongue when shouting), rosy cheeks; skin warm brown tones; 4-5 px-equivalent dark
  outline on everything; flat colour + one soft shadow tone. Strong costume shorthand so a role reads in 0.5 s: elder with
  white bun, round glasses, saree + shawl; politician with tilak, big moustache, marigold garland, waistcoat; reel-maker with
  backwards cap, graphic tee, phone on a selfie stick; kid in a bright tee; dad in a checked shirt + seatbelt; animals with
  huge glossy eyes (puppy, gau mata with painted horns, tilak, bell). Sweat drops, anger marks, tears as clean shapes.
  Faces always fully visible; characters gesture with one hand up/out on their key word.
- **Backgrounds:** painted, slightly softer than the characters (depth): big sky with fluffy clouds, distant blue hills,
  green + mustard-yellow fields with a few trees/huts, a straight highway to a centred vanishing point (yellow edge lines,
  white dashes, grass verge with bushes); vehicle interiors with real detail (seats, seatbelts, door panels, gear stick,
  pedals, floor mat, an embroidered cushion, a steel tiffin); warm interior light vs bright exterior daylight.
- **Saved style stills (for reference only, never traced):** docs/style2/*.png (frames from refs/ref15.mp4).
- **To build once and reuse:** src/lib/style2.tsx: KaraokeCaptions (from words.json), NamePill, SeriesPill, QuestionBanner,
  Hud, OptionList, CountdownBadge, CtaStrip, ShareBubble, ProfileCard, POV dashboard frame.
