# DinnerSecret — script (Part 1)

Status: SCRIPT ONLY. No voice, no build yet. Waiting for the voice file in `voice/`.
Voice language: Hinglish (Roman script). Handle: `@yourhandle` (placeholder; template blanks were not filled).
Target: 10 lines, 109 words, about 36-39 s after clean_voice (+2 s tail).

## Reference study: refs/mausi.mp4 (54 s, 720x1280)
Whisper is still blocked; the reference has word-by-word Roman Hinglish captions, read from the 1 fps frames.
1. **Idea:** in a hotel queue you (with your girlfriend) bump into your mausi, with a man who is not mausa ji. Rooms 204/205 side
   by side; next morning she says "tum kuch mat bolna, main bhi kuch nahi bolungi". At family dinner mausa ji toasts "25 saal,
   meri biwi ne kabhi jhooth nahi bola"; then mummy asks "tu kal raat kahan tha?"
2. **Rules:** a mutual secret: each one can expose the other, so both stay quiet (mutual deterrence), until a direct question
   forces you to choose.
3. **Answer / logic:** a values dilemma, not a puzzle: A "sach bol do, dono ka" vs B "chup raho, mausi ka raaz rakho". Nothing in
   the story makes one option provably right, yet it promises "sach, part 2 mein". It also misses the obvious middle option:
   tell **your own** truth without exposing hers (her secret isn't yours to tell). No factual error; the setup is consistent.
4. **Hook:** strong. "CAUGHT AT OYO" label plus "OYO ki line mein, tumhare aage tumhari mausi khadi hai" in the first second,
   shock face, neon sign.
5. **Format:** 54 s, second-person narration ("tum"), only 2 options (A/B), a 2-1 countdown with "comment karo, A ya B", and the
   cliffhanger "sach, part 2 mein".

## Our version (idea + logic only)
Same mutual-secret logic, family-friendly and everyday: **you** bunked your coaching (the fees are expensive) and went to the mall
at 11 AM; there you run into **Chachu**, whom the family thinks goes to office, but he lost his job three months ago. "Tu kuch mat
bolna, main bhi kuch nahi bolunga." At dinner Dadi brags about both of you; then Papa asks what was taught at coaching today.
Four options, one of them defensible by logic: own your part, don't spend someone else's secret.

## Script with parts (for checking)
**1 HOOK (0-3 s)**
1. [dramatically] Subah gyaarah baje, coaching bunk karke tum mall pahunche, aur saamne Chachu khade the.

**2 BODY**
2. [whispers] Ghar mein sab sochte hain Chachu office jaate hain, par unki naukri, teen mahine pehle chali gayi.
3. Nazrein mili, Chachu ne dheere se kaha, tu kuch mat bolna, main bhi kuch nahi bolunga.
4. [warmly] Usi raat dinner pe, Dadi boli, mera beta roz office jaata hai, aur pota roz coaching.

**3 RE-HOOK**
5. [dramatically] Tabhi Papa ne poocha, aaj coaching mein kya padhaya?

**4 FINAL BODY (A-D)**
6. A, sirf apna sach bolo.
7. B, dono ka sach bol do.
8. C, chup raho, dono raaz rakho.
9. D, Chachu ka raaz bolo, apna chhupao.

**5 CLIFFHANGER**
10. [curious] Tum kya karoge? Comment karo, answer in the next reel, follow karo @yourhandle!

## Clean text for ElevenLabs
```
[dramatically] Subah gyaarah baje, coaching bunk karke tum mall pahunche, aur saamne Chachu khade the.
[whispers] Ghar mein sab sochte hain Chachu office jaate hain, par unki naukri, teen mahine pehle chali gayi.
Nazrein mili, Chachu ne dheere se kaha, tu kuch mat bolna, main bhi kuch nahi bolunga.
[warmly] Usi raat dinner pe, Dadi boli, mera beta roz office jaata hai, aur pota roz coaching.
[dramatically] Tabhi Papa ne poocha, aaj coaching mein kya padhaya?
A, sirf apna sach bolo.
B, dono ka sach bol do.
C, chup raho, dono raaz rakho.
D, Chachu ka raaz bolo, apna chhupao.
[curious] Tum kya karoge? Comment karo, answer in the next reel, follow karo @yourhandle!
```

## On-screen chips (Roman capitals, 2-4 words)
| Line | Chips |
|---|---|
| 1 | title `2 RAAZ, 1 DINNER` · `11 BAJE, MALL` · `COACHING BUNK` |
| 2 | `CHACHU KI NAUKRI` · `3 MAHINE PEHLE GAYI` |
| 3 | `TU KUCH MAT BOLNA` |
| 4 | `ROZ OFFICE, ROZ COACHING` |
| 5 | `AAJ KYA PADHAYA?` (slams in) |
| 6 | `A: SIRF APNA SACH` |
| 7 | `B: DONO KA SACH` |
| 8 | `C: DONO RAAZ RAKHO` |
| 9 | `D: CHACHU KA RAAZ` |
| 10 | `TUM KYA KAROGE?` · `ANSWER NEXT REEL` · `FOLLOW @YOURHANDLE` |

## Frame 0
A bright mall atrium at 11 AM, escalators moving in the background, shoppers drifting past. You (chunky teen, school bag on one
shoulder, ice-cream cone in hand) have just stepped off the escalator, mid-step, and freeze; two metres away Chachu (office shirt
and tie, laptop bag, a food-court tray) freezes too: both mouths open, ice-cream starting to tip. Title `2 RAAZ, 1 DINNER` is
already on screen at the top, `11 BAJE, MALL` popping in under it. Whip-pan push-in between the two faces; record-scratch
(slam) + whoosh at 0 s, playful-tense music.

## Right answer (keep secret until Part 2)
**A, tell only your own truth.** ("Main aaj coaching nahi gaya, mall gaya tha, galti meri hai.")
- Your bunk is your secret to confess; Chachu's job loss is **his** to tell, in his own time.
- Owning up also breaks the "you stay quiet, I stay quiet" lock: Chachu loses nothing, and nobody holds anything over you.
- B (both truths) is tempting because it sounds fully honest, but it humiliates Chachu in front of Dadi with news that isn't yours.
- C (keep both secrets) is tempting because it's the deal you made, but it means lying to Papa and paying for coaching you skip.
- D (expose Chachu, hide yourself) is the careless one: it distracts the table by sacrificing someone else.
Part 2 payoff idea: after dinner Chachu thanks you, and tells the family himself the next day.
