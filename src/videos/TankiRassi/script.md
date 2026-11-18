# TankiRassi — script (Part 1)

Status: SCRIPT ONLY. No voice, no build yet. Waiting for the voice file in `voice/`.
Voice language: Hinglish (template blank not filled; same default as before). Handle: **@rehanfact**.
Target: 10 lines, 110 words, about 36-39 s after clean_voice (+2 s tail).

## Reference study: refs/ref7.mp4 (66 s, 720x1280)
Whisper still blocked; the reference has word-by-word Roman Hinglish captions, read from the 1 fps frames.
1. **Idea:** you are trapped on top of a 200 ft castle tower; robbers come back at sunrise; 10 minutes on a timer. You have a
   150 ft rope, a small knife, an iron hook at the top and another hook on a window ledge exactly 100 ft below.
2. **Rules:** shown by two failed tries with REWIND: (a) tie at the top and climb down -> 50 ft short, hanging when the sun
   rises, GAME OVER; (b) climb down 100 ft to the window -> the rope is still tied at the TOP, only 50 ft hangs below, 100 ft
   still to go, "rassi kholne upar jaoge to wapas kaise aaoge?" PHANS GAYE.
3. **Answer / logic:** not given (Part 2). Classic solution, checked: cut 50 ft + 100 ft; tie 50 ft at the top with a loop;
   pass the 100 ft piece through the loop doubled (50 ft each side) -> 50 + 50 = 100 ft = the window; pull the 100 ft piece
   free; tie it at the window hook; climb the last 100 ft. The reference's numbers are consistent; no error found.
4. **Hook:** a man already hanging on a rope with "Tumne rassi baandhi aur neeche utarne lage" + a running timer from frame 0.
5. **Format:** 66 s, second person, timer + feet counters, two "GAME OVER / REWIND" fails, a recap card (MEENAR 200 / RASSI 150
   / CHAAKU 1 / KUNDE 2), no options, "jawab comment mein likho", "sahi jawab agli reel mein", follow.

## Our version (idea + logic only)
Indian, everyday: Raju is stuck at night on top of an old **120 ft water tank (paani ki tanki)**; the ladder broke, nobody until
morning. He has a **90 ft rope** and a knife; a hook at the top and a hook on a **chhajja (ledge) 60 ft below**.
Checked: a = 30 (top piece with loop), b = 60 doubled through it -> 30 + 60/2 = 60 = ledge; pull b free; 60 ft from ledge to
ground = b. Naive (whole rope from the top) leaves him 30 ft in the air.
Format choice: the template asks for A-D on a question, so this has 4 options (the reference itself had none; an open
"comment your method" version is possible if wanted).

## Script with parts (for checking)
**1 HOOK (0-3 s)**
1. [dramatically] Raat das baje, Raju ek sau bees feet oonchi tanki par phans gaya!

**2 BODY**
2. [worried] Seedhi toot gayi, subah tak koi nahi aayega.
3. Paas mein nabbe feet rassi, aur ek chaaku.
4. [curious] Upar ek kunda, aur saath feet neeche chhajje par doosra.

**3 RE-HOOK**
5. [dramatically] Poori rassi upar baandhi, toh tees feet hawa mein latkega, zinda neeche kaise utrega?

**4 FINAL BODY (A-D)**
6. A, tees feet ka loop upar, saath feet rassi double karke chhajje tak, phir kheench ke neeche.
7. B, poori rassi upar baandho, aur aakhri tees feet kood jao.
8. C, chhajje tak utro, phir upar wali gaanth khol do.
9. D, chaaku se rassi kaat ke, lambi kar lo.

**5 CLIFFHANGER**
10. [curious] Comment karo, answer in the next reel, follow karo @rehanfact!

## Clean text for ElevenLabs
```
[dramatically] Raat das baje, Raju ek sau bees feet oonchi tanki par phans gaya!
[worried] Seedhi toot gayi, subah tak koi nahi aayega.
Paas mein nabbe feet rassi, aur ek chaaku.
[curious] Upar ek kunda, aur saath feet neeche chhajje par doosra.
[dramatically] Poori rassi upar baandhi, toh tees feet hawa mein latkega, zinda neeche kaise utrega?
A, tees feet ka loop upar, saath feet rassi double karke chhajje tak, phir kheench ke neeche.
B, poori rassi upar baandho, aur aakhri tees feet kood jao.
C, chhajje tak utro, phir upar wali gaanth khol do.
D, chaaku se rassi kaat ke, lambi kar lo.
[curious] Comment karo, answer in the next reel, follow karo @rehanfact!
```

## On-screen chips (Roman capitals, 2-4 words)
| Line | Chips |
|---|---|
| 1 | title `120 FEET, 1 RAAT` · `RAAT 10 BAJE` |
| 2 | `SEEDHI TOOT GAYI` · `SUBAH TAK AKELA` |
| 3 | `RASSI: 90 FEET` · `CHAAKU: 1` |
| 4 | `KUNDA #1: UPAR` · `KUNDA #2: 60 FEET NEECHE` (two lines: `KUNDA #2` + `60 FT NEECHE`) |
| 5 | `30 FEET HAWA MEIN!` · `ZINDA KAISE?` (slams) |
| 6 | `A: LOOP + DOUBLE` |
| 7 | `B: 30 FEET KOODO` |
| 8 | `C: GAANTH KHOLO` |
| 9 | `D: RASSI LAMBI KARO` |
| 10 | `ANSWER NEXT REEL` · `FOLLOW @REHANFACT` |

## Frame 0
Night, full moon, a tall old concrete water tank on four legs in an empty field at the edge of a town, the town's lights far
away. Raju (chunky, big head, lungi-style shorts and a torch) is already on the narrow top railing, wind whipping his scarf,
looking down with a gulp; a broken ladder dangles off one leg, swinging. A yellow height bar on the side reads `120 FT`.
Title `120 FEET, 1 RAAT` is on screen from frame 0, `RAAT 10 BAJE` pops under it; wind whoosh + metal creak (thud) at 0 s.

## Right answer (keep secret until Part 2)
**A.** Cut the rope 30 + 60. Tie the 30 ft piece to the top hook with a loop at its end. Pass the 60 ft piece through the loop
and hold both ends together (doubled = 30 ft long). 30 + 30 = 60 ft = the chhajja. Stand on the chhajja, pull one end: the
60 ft rope slides out of the loop. Tie it to the second hook and climb the last 60 ft to the ground.
- B is tempting (it nearly works) but a 30 ft (9 m) fall is a three-storey drop: serious injury.
- C is tempting (it's what most people try first) but the knot is 60 ft above: you can't untie it without climbing back up.
- D is the careless one: cutting a rope never makes it longer.
Part 2 idea: show A step by step with counters (30 + 30 = 60, pull, 60 to the ground), the sun rising as he lands.
