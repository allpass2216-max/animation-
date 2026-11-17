# LateNight — script (Part 1)

Status: SCRIPT ONLY. No voice, no build yet. Waiting for the voice file in `voice/`.
Voice language: Hinglish (Roman script). Handle: `@yourhandle` (placeholder; template blanks were not filled).
Target: 10 lines, 110 words, about 36-39 s after clean_voice (+2 s tail).

## Reference study: refs/ref2.mp4 (71 s, 720x1280)
Whisper is still blocked (openaipublic.azureedge.net). The voice-over is Urdu and every line is captioned on screen in Urdu,
so the story below is read from the 1 fps frames (Allosaurus phones confirm continuous narration).
1. **Idea:** a mother, angry that her son Hamza walks in at 1 AM, yells "Go! May God make you never come back!" He leaves silently,
   has an accident; police hand her a bag found by his bike: her medicine. He had searched the whole city from 7 PM to 1 AM for it.
2. **Rules / lesson:** "never curse your child, even in anger": words said in anger can't be taken back, and the person you judge may be doing good.
3. **Answer / logic:** story, not a puzzle: the "answer" (he was out for her medicine) is revealed via the bag. Consistent timeline
   (missing since evening, medicine ran out, 24-hour pharmacy, call one hour later). Weak spots: it implies the angry words *caused*
   the accident (superstition, not logic), and the citation 1536 (Abu Dawud) speaks of a *father's* prayer while the video says "parents".
4. **Hook:** frame 0 = the curse itself in big red text ("JAA!") with the mother pointing at the door, strong emotional hook, sound from 0.
5. **Format:** 71 s, single narrator, word-by-word captions, two hadith cards, no options, no cliffhanger; CTA: "write a dua for
   your mother in the comments".

## Our version (idea + logic only)
New setting: an Indian family, son **Kabir**, mother with **BP medicine**. Turned into a clue puzzle: three clues (medicine ran out
in the evening, local shops close at nine, a 12:30 AM medicine bill in his pocket) let the viewer deduce where he was. No religious
quotes, no accident, no curse that "comes true": the lesson is simply "a word said in anger doesn't come back".

## Script with parts (for checking)
**1 HOOK (0-3 s)**
1. [angry] Raat ek baje Kabir lauta, aur maa chillaayi, jaa, wapas mat aana!

**2 BODY**
2. [sad] Woh shaam saat baje se gayab tha, kuch nahi bola, phir nikal gaya.
3. [curious] Clue, maa ki BP ki dawai shaam ko khatam hui, aur mohalle ki dukaanein nau baje band hoti hain.
4. Kabir ki jeb mein, saade baarah baje ka, dawai ka bill tha.

**3 RE-HOOK**
5. [dramatically] Toh Kabir, chhe ghante, kahan tha?

**4 FINAL BODY (A-D)**
6. A, dawai ke liye, poora shehar ghoom raha tha.
7. B, doston ke saath, party kar raha tha.
8. C, office mein, overtime kar raha tha.
9. D, kahin baith ke, game khel raha tha.

**5 CLIFFHANGER**
10. [softly] Gusse ka ek shabd wapas nahi aata, comment karo, answer in the next reel, follow @yourhandle!

## Clean text for ElevenLabs
```
[angry] Raat ek baje Kabir lauta, aur maa chillaayi, jaa, wapas mat aana!
[sad] Woh shaam saat baje se gayab tha, kuch nahi bola, phir nikal gaya.
[curious] Clue, maa ki BP ki dawai shaam ko khatam hui, aur mohalle ki dukaanein nau baje band hoti hain.
Kabir ki jeb mein, saade baarah baje ka, dawai ka bill tha.
[dramatically] Toh Kabir, chhe ghante, kahan tha?
A, dawai ke liye, poora shehar ghoom raha tha.
B, doston ke saath, party kar raha tha.
C, office mein, overtime kar raha tha.
D, kahin baith ke, game khel raha tha.
[softly] Gusse ka ek shabd wapas nahi aata, comment karo, answer in the next reel, follow @yourhandle!
```

## On-screen chips (Roman capitals, 2-4 words)
| Line | Chips |
|---|---|
| 1 | title `RAAT 1 BAJE` · `JAA, WAPAS MAT AANA!` (red, slams on "jaa") |
| 2 | `7 BAJE SE GAYAB` · `CHUPCHAAP NIKAL GAYA` |
| 3 | `CLUE 1: DAWAI KHATAM` · `CLUE 2: 9 BAJE BAND` |
| 4 | `CLUE 3: 12:30 KA BILL` |
| 5 | `6 GHANTE KAHAN?` (slams in) |
| 6 | `A: DAWAI DHOONDH RAHA` |
| 7 | `B: DOSTON KI PARTY` |
| 8 | `C: OFFICE OVERTIME` |
| 9 | `D: GAME KHEL RAHA` |
| 10 | `GUSSE KA EK SHABD` · `ANSWER NEXT REEL` · `FOLLOW @YOURHANDLE` |

## Frame 0
Night, a narrow Indian flat doorway lit warm yellow from inside, the rest in cool blue. Chunky mother (big head, thick outline,
dupatta, reading glasses) is already mid-shout, arm thrust at the door, the dupatta swinging; Kabir (helmet in hand, bike behind him
in the dark lane) flinches back. A wall clock on the wall shows 1:00 with the second hand ticking. Title `RAAT 1 BAJE` is already on
screen at the top (clock-tick pop), with `JAA, WAPAS MAT AANA!` slamming in red under it. Slow push-in; slam + door-creak at 0 s, soft music.

## Right answer (keep secret until Part 2)
**A, he was searching the whole city for his mother's medicine.**
Clue 1: the BP medicine ran out that evening. Clue 2: the local shops close at nine, so he had to go far. Clue 3: a medicine bill
from 12:30 AM is in his pocket, so he found it at a 24-hour store just before coming home.
- B (party) is tempting: it's what the angry mother assumed from "1 AM", judging the hour instead of the clues.
- C (overtime) is tempting: the usual excuse, but no office explains a 12:30 AM medicine bill.
- D (gaming) is the careless pick that ignores every clue.
Part 2 payoff: he quietly leaves the medicine at her door. Lesson: a word said in anger doesn't come back.
