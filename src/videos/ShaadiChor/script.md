# ShaadiChor — script (Part 1)

Status: SCRIPT ONLY (2026-11-21). Waiting for the user's recording voice/shaadichor.mp3.
Voice language: Hinglish (Roman script; the template blank was not filled, Hinglish is the default). Handle: **@rehanfact**.
Target: 10 lines, 110 words, about 33-37 s after clean_voice (+2 s tail).
Genre: detective / "who is the culprit" puzzle with a visual clue, so A-D options + "answer in the next reel" fit.
User add-on (2026-11-21): in the question part, a ₹100 cash prize for a correct comment, "share with a friend for help", and
"the winner gets the money in Part 2".

## Reference study: refs/ref12.mov (77 s, 882x1920, picture in a letterboxed strip)
Whisper is still blocked (model hosts refused by the network) and the reel has no captions, so the audio could not be
understood; studied from the 1 fps frames.
1. **Idea / puzzle:** a rich old man in a red armchair is found dead (crime); a police officer lines up 4 suspects: a woman in
   purple, a man with a green scarf and torn clothes, a bearded man with his **arm in a sling**, and an old lady in a saree.
2. **Rules:** each suspect is shown up close (their statement in the audio); the viewer must spot who is lying.
3. **Answer and why:** the bearded man. The ending compares two shots with a red arrow: his **sling is on one arm in one shot and
   on the other arm in the next**, so the "injury" (his alibi: "I couldn't have done it with this arm") is fake. Logic checked:
   a real broken arm can't swap sides, so the alibi collapses. Without the audio I can't check his exact words, but the visual
   clue is consistent and fair.
4. **Hook:** a dark, moody mansion room with the victim in the armchair from the first second, then the police walk-in.
5. **Format:** 77 s, slow lineup shots, no A-D on screen, ends on the side-by-side clue comparison.

## Our version (idea + logic only)
No murder, no mansion: a **wedding night in Lucknow**, the dulhan's gold haar goes missing from the dressing room. New
characters: **Inspector Rana** (friendly, moustache) and four suspects: **Ramesh** the halwai, cousin **Neha** (mehendi hands),
photographer **Vicky** (arm in a plaster sling, camera round his neck) and **Kamla bai** who cleans. Our own chunky cartoon
look, warm wedding lights, marigold garlands.
The clue (fair to the viewer, in sound and picture): Vicky SAYS "mera **daayan** haath toota hai" (right hand), and at that line
the plaster is on his right arm; in the lineup shot after it, the plaster is on his **left** arm. A real fracture can't change sides.

## Script with parts (for checking)
**1 HOOK (0-3 s)**
1. [dramatically] Shaadi ki raat, dulhan ka haar gayab, chor isi kamre mein hai!

**2 BODY**
2. Inspector Rana ne chaaron ko line mein khada kiya.
3. Halwai Ramesh bola, main poori raat kitchen mein tha.
4. Cousin Neha boli, main mehendi lagwa rahi thi.
5. Photographer Vicky bola, mera daayan haath toota hai, main kaise churaunga?
6. Kamla bai boli, main toh chhat par thi.

**3 RE-HOOK**
7. [curious] Tabhi inspector muskuraya, dhyan se dekho, ek ne khud ko pakadwa diya!

**4 FINAL BODY (A-D)**
8. A, Ramesh. B, Neha. C, Vicky. D, Kamla bai.

**5 CLIFFHANGER (with the cash prize the user asked for)**
9. [excited] Sahi jawab batane wale ko sau rupaye cash prize, comment mein likho, dost ko share karke help lo!
10. Winner ko paisa part two mein, answer in the next reel, follow karo @rehanfact!

## Clean text for ElevenLabs
```
[dramatically] Shaadi ki raat, dulhan ka haar gayab, chor isi kamre mein hai!
Inspector Rana ne chaaron ko line mein khada kiya.
Halwai Ramesh bola, main poori raat kitchen mein tha.
Cousin Neha boli, main mehendi lagwa rahi thi.
Photographer Vicky bola, mera daayan haath toota hai, main kaise churaunga?
Kamla bai boli, main toh chhat par thi.
[curious] Tabhi inspector muskuraya, dhyan se dekho, ek ne khud ko pakadwa diya!
A, Ramesh. B, Neha. C, Vicky. D, Kamla bai.
[excited] Sahi jawab batane wale ko sau rupaye cash prize, comment mein likho, dost ko share karke help lo!
Winner ko paisa part two mein, answer in the next reel, follow karo @rehanfact!
```

## On-screen chips (Roman capitals, 2-4 words)
| Line | Chips |
|---|---|
| 1 | title `HAAR GAYAB!` from frame 0 · `CHOR ISI KAMRE MEIN` |
| 2 | `INSPECTOR RANA` · `4 SUSPECTS` |
| 3 | name tag `RAMESH · HALWAI` · `KITCHEN MEIN THA` |
| 4 | `NEHA · COUSIN` · `MEHENDI LAGWA RAHI` |
| 5 | `VICKY · PHOTOGRAPHER` · `DAAYAN HAATH TOOTA` |
| 6 | `KAMLA BAI` · `CHHAT PAR THI` |
| 7 | `DHYAN SE DEKHO!` (slams) |
| 8 | A-D tiles: `A: RAMESH` · `B: NEHA` · `C: VICKY` · `D: KAMLA BAI` |
| 9 | `₹100 CASH PRIZE` (big, coins bounce) · `COMMENT KARO` · `DOST KO SHARE KARO` (share icon) |
| 10 | `WINNER PART 2 MEIN` · `ANSWER NEXT REEL` · Follow button `@REHANFACT` |
Keep the plaster clue visible but not pointed at in Part 1 (no arrow); the arrow comparison is the Part 2 reveal.

## Frame 0
Night, a wedding dressing room in Lucknow: marigold strings and fairy lights, a mirror with bulbs, an open red jewellery box on
the dressing table, EMPTY, with a glowing outline where the haar was. The dulhan (side, back to camera, face never covered)
gasps; Inspector Rana bursts through the door mid-stride, his cap bouncing; a camera flash pops. Title `HAAR GAYAB!` on screen
from frame 0; whoosh + dhol hit + gasp sound at 0 s.

## Right answer (keep secret until Part 2)
**C: Vicky, the photographer.** He says his **right** (daayan) hand is broken so he couldn't have stolen it, but in the lineup
his plaster is on his **left** arm. A real fracture can't switch arms, so the injury is fake and so is his alibi.
- B (Neha) is tempting: "family inside job" thinking, and she was in the house all night.
- D (Kamla bai) is tempting: people wrongly blame the staff first, and she had access to every room.
- A (Ramesh) is the careless pick: the kitchen alibi is never questioned.
Part 2: arrow comparison of the two shots, Vicky's plaster slides off, the haar falls out of his camera bag; announce the ₹100
winner (a REAL commenter's username, given by the user).

## Note on the cash prize
The video promises ₹100 to a correct commenter and says the winner is announced in Part 2: you will need to pick a real winner
from the comments and actually pay them. If more than one person answers right, say in the caption how you pick (e.g. the first
correct comment, or a random pick among correct comments).
