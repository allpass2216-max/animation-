# MurgaAnda — script (Part 1)

Status: SCRIPT ONLY (2026-11-21). Waiting for the user's recording voice/murgaanda.mp3.
Voice language: Hinglish (Roman script; the template blank was not filled, Hinglish is the default). Handle: **@rehanfact**.
Target: 9 lines, 107 words, about 32-35 s after clean_voice (+2 s tail).
Genre: trick riddle / "tricky sawal" (the reference is a riddle with a hidden catch), so A-D options + "answer in the next reel" fit.

## Reference study: refs/ref11.mp4 (46 s, 720x1280, "Tmkoc tricky sawal challenge")
Whisper is still blocked (model hosts refused by the network), so the audio could not be transcribed; read from 1 fps frames.
1. **Idea / puzzle:** riddle 1: two neighbours (Ramu, Shyamu) with a brick wall between their houses; a bird lays an egg on/at
   the wall: whose egg is it? The picture shows a **rooster** (red comb, tail). Riddle 2 (couple at the cinema, then one goat,
   then a grid of goats) could not be understood without the audio, so it is NOT used.
2. **Rules:** the host asks the boys sitting at a biryani plate; each guesses; no options on screen.
3. **Answer and why:** nobody's: a **rooster (murga) doesn't lay eggs**; the reveal frame shows everyone face-palming and the kid
   laughing. Logic checked: the trick is that listeners hear "who owns the egg" and argue owner vs. land, missing the word
   "murga". The reference gets it right. (If it were a hen, the usual answer would be: the hen's owner.)
4. **Hook:** a live-action host + cartoon cut-ins (TV-show-style characters) with "?" and thinking bubbles from the first
   second; fast cuts between the boys' faces and the cartoon.
5. **Format:** 46 s, two riddles, street-interview style, no A-D options, ends on a black "Comment Your Answer" card.

## Our version (idea + logic only)
New setting, characters, numbers and wording: a mohalla in **Indore**, two padosi **Sonu** (blue house) and **Monu**
(pink house), a short brick wall between them, Sonu's **laal murga**. No TV-show characters, no live-action host, no biryani.
Our own chunky cartoon world. One riddle only, with 4 options and one right answer.

## Script with parts (for checking)
**1 HOOK (0-3 s)**
1. [excited] Sirf ek percent log is sawaal ka sahi jawab dete hain, tum try karo!

**2 BODY**
2. Indore ke ek mohalle mein, Sonu aur Monu padosi hain.
3. Dono gharon ke beech, ek chhoti si deewar hai.
4. [curious] Ek subah, Sonu ka laal murga deewar par chadha, aur wahin ek anda de diya.
5. Anda Monu ki taraf gira, aur dono lad pade, anda kiska?

**3 RE-HOOK**
6. [dramatically] Poora mohalla jama ho gaya, ab faisla tumhare haath mein hai!

**4 FINAL BODY (A-D)**
7. A, Sonu ka, kyunki murga uska hai. B, Monu ka, kyunki anda uski taraf gira.
8. C, aadha aadha baant lo. D, kisi ka nahi.

**5 CLIFFHANGER**
9. [curious] Dhyan se socho, comment karo, answer in the next reel, follow karo @rehanfact!

## Clean text for ElevenLabs
```
[excited] Sirf ek percent log is sawaal ka sahi jawab dete hain, tum try karo!
Indore ke ek mohalle mein, Sonu aur Monu padosi hain.
Dono gharon ke beech, ek chhoti si deewar hai.
[curious] Ek subah, Sonu ka laal murga deewar par chadha, aur wahin ek anda de diya.
Anda Monu ki taraf gira, aur dono lad pade, anda kiska?
[dramatically] Poora mohalla jama ho gaya, ab faisla tumhare haath mein hai!
A, Sonu ka, kyunki murga uska hai. B, Monu ka, kyunki anda uski taraf gira.
C, aadha aadha baant lo. D, kisi ka nahi.
[curious] Dhyan se socho, comment karo, answer in the next reel, follow karo @rehanfact!
```

## On-screen chips (Roman capitals, 2-4 words)
| Line | Chips |
|---|---|
| 1 | title `SIRF 1% SAHI!` from frame 0 · `TUM TRY KARO` |
| 2 | `INDORE MOHALLA` · name tags `SONU` / `MONU` over the houses |
| 3 | `BEECH MEIN DEEWAR` |
| 4 | `LAAL MURGA` (small, easy to miss) · `ANDA!` (pops on "anda") |
| 5 | `MONU KI TARAF` · `ANDA KISKA?` (slams) |
| 6 | `MOHALLA JAMA!` · `TUMHARA FAISLA` |
| 7 | `A: SONU KA` · `B: MONU KA` |
| 8 | `C: AADHA AADHA` · `D: KISI KA NAHI` |
| 9 | `DHYAN SE SOCHO` · `ANSWER NEXT REEL` · Follow button `@REHANFACT` |

The picture must not give the answer away: the bird is drawn as a chunky red bird with a comb, small in the frame, and the
egg appears with a pop while the camera is on the two neighbours (exactly like hearing "murga" in passing).

## Frame 0
Sunny Indore mohalla: Sonu's blue house (left) and Monu's pink house (right), a short brick wall between them, a neem tree,
washing line and a scooter in the background, a foreground pot plant. The red murga is already strutting along the wall,
flapping, a feather drifting down; Sonu (chunky, big head, kurta, mustache) and Monu (vest, gamchha on the shoulder) are
mid-gesture at their doors. Title `SIRF 1% SAHI!` is on screen from frame 0 at the top; slow push-in; whoosh + rooster flap
sound at 0 s, light desi music.

## Right answer (keep secret until Part 2)
**D: kisi ka nahi.** The bird is a **murga (rooster)**, and a rooster can't lay eggs, so there is no egg to own.
- A (Sonu's, he owns the bird) is tempting: it IS the right answer if the bird were a murgi (hen).
- B (Monu's, it fell on his side) is tempting: people apply the "whatever lands on my land is mine" rule.
- C (half-half) is the careless "settle it" answer.
Part 2 payoff idea: replay the line with "LAAL MURGA" highlighted; both neighbours look at the rooster, then at each other.
