# LightGayi — script (Part 1)

Status: SCRIPT ONLY (2026-11-27). Waiting for the user's recording voice/lightgayi.mp3.
Voice language: Hinglish (Roman script; the template blank was not filled, Hinglish is the default). Handle: **@rehanfact**.
Target: 9 lines, 90 words, about 28-32 s after clean_voice (+2 s tail).
Genre: logic puzzle ("which one do you charge first?"), so A-D options + "answer in the next reel" fit.
User add-on (2026-11-27): the FIRST person to comment the right answer gets a ₹100 cash prize, "jaldi comment karo".

## Reference study: refs/ref13.mp4 (47 s, 640x338, landscape)
Whisper is still blocked (model hosts refused by the network), so the audio could not be transcribed; studied from the
1 fps frames (the on-screen labels are readable).
1. **Idea / puzzle:** a detective in a hat must get case files at night, in the dark; he has one wireless power bank and three
   dead-or-alive devices: MOBILE 70%, TORCH 0%, FINGERPRINT SCANNER 0%. Which one should he charge?
2. **Rules:** only one device can be charged; a countdown timer runs on screen while you decide.
3. **Answer and why:** the **fingerprint scanner** (the last frame shows it on the power bank). Logic checked step by step:
   the files are behind the fingerprint lock, which is dead, so it MUST be charged; the dark is solved by the phone's own
   flashlight (70% is plenty), so the torch is not needed; the phone doesn't need charging. The reference gets it right.
4. **Hook:** the detective + a stack of case files, then a dark night street, then the three devices with battery bars.
5. **Format:** 47 s, landscape, a static "MOBILE / TORCH / FINGERPRINT SCANNER" board with battery levels and a 5-second
   timer, no A-D letters, ends on the reveal frame (scanner on the power bank).

## Our version (idea + logic only)
New setting, character, numbers and wording: **Riya**, a student in **Patna**, the night before her board exam: the light goes
(power cut), and her **admit card** is in the family's **fingerprint locker** (almirah safe). She has one power bank that can
charge only one thing. Phone 70%, torch 0%, fingerprint locker 0%; the school bus is at 6 AM. Our own chunky cartoon look,
a small room lit only by the phone, mosquitoes, a ceiling fan that slows down when the light goes.

## Script with parts (for checking)
**1 HOOK (0-3 s)**
1. [dramatically] Exam se ek raat pehle, light gayi, aur admit card band locker mein hai!

**2 BODY**
2. Riya ke paas ek power bank hai, jo sirf ek cheez charge kar sakta hai.
3. Phone mein sattar percent battery hai.
4. Torch zero, aur fingerprint locker bhi zero.
5. [whispers] Bahar ghup andhera, aur bus subah chhe baje.

**3 RE-HOOK**
6. [curious] Galat choice ki, toh exam gaya! Riya pehle kya charge kare?

**4 FINAL BODY (A-D)**
7. A, phone. B, torch. C, fingerprint locker. D, teeno thoda thoda.

**5 CLIFFHANGER (with the cash prize the user asked for)**
8. [excited] Sabse pehle sahi jawab dene wale ko sau rupaye cash prize, jaldi comment karo!
9. Answer in the next reel, follow karo @rehanfact!

## Clean text for ElevenLabs
```
[dramatically] Exam se ek raat pehle, light gayi, aur admit card band locker mein hai!
Riya ke paas ek power bank hai, jo sirf ek cheez charge kar sakta hai.
Phone mein sattar percent battery hai.
Torch zero, aur fingerprint locker bhi zero.
[whispers] Bahar ghup andhera, aur bus subah chhe baje.
[curious] Galat choice ki, toh exam gaya! Riya pehle kya charge kare?
A, phone. B, torch. C, fingerprint locker. D, teeno thoda thoda.
[excited] Sabse pehle sahi jawab dene wale ko sau rupaye cash prize, jaldi comment karo!
Answer in the next reel, follow karo @rehanfact!
```

## On-screen chips (Roman capitals, 2-4 words)
| Line | Chips |
|---|---|
| 1 | title `EXAM KAL HAI!` from frame 0 · `LIGHT GAYI` (room goes dark on "light") · `ADMIT CARD LOCKED` |
| 2 | `1 POWER BANK` · `SIRF 1 CHARGE` |
| 3 | device board: `PHONE 70%` (green battery fills) |
| 4 | `TORCH 0%` · `LOCKER 0%` (red batteries blink) |
| 5 | `GHUP ANDHERA` · `BUS 6 AM` (clock) |
| 6 | `GALAT = EXAM GAYA` (slams) · `PEHLE KYA?` |
| 7 | A-D tiles: `A: PHONE` · `B: TORCH` · `C: FINGERPRINT LOCKER` · `D: TEENO THODA THODA` |
| 8 | `₹100 CASH PRIZE` · `SABSE PEHLE COMMENT` · `JALDI!` (a 5-4-3 timer ring) |
| 9 | `ANSWER NEXT REEL` · Follow button `@REHANFACT` |

## Frame 0
Night, Riya's small room in Patna: books piled on the study table, a calendar with tomorrow circled "EXAM", the ceiling fan
spinning, a tube light ON. Riya (chunky, big head, school kurta, two plaits) is mid-move, stuffing books into her bag. The
title `EXAM KAL HAI!` is on screen from frame 0; whoosh + clock tick at 0 s. On "light" (about 1.5 s) the tube light flickers
and dies with a "tak" sound, the fan slows down, the room drops to blue darkness lit only by her phone.

## Right answer (keep secret until Part 2)
**C: the fingerprint locker.** The admit card is locked inside and the locker is at 0%, so only charging it gets the card out.
The darkness is solved by the phone's own flashlight (70% is plenty), and the phone doesn't need charging.
- B (torch) is tempting: "andhera hai, toh torch" — but the phone already has a torch.
- A (phone) is tempting: habit, we always charge the phone first — but it's already at 70%.
- D (all three a little) is the careless pick: the power bank charges only ONE thing, and a bit of charge everywhere opens nothing.
Part 2: Riya switches on the phone flashlight, puts the locker on the power bank, the locker beeps open, admit card in hand;
announce the FIRST correct commenter (a REAL username the user gives) as the ₹100 winner.

## Note on the cash prize
"Sabse pehle" means the earliest correct comment wins: check comment timestamps before you announce, and pay the winner.
