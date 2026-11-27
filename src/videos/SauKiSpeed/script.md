# SauKiSpeed — script (Part 1)

Status: SCRIPT ONLY (2026-11-27). Waiting for the user's recording voice/saukispeed.mp3.
Voice language: Hinglish (Roman script; template blank not filled, Hinglish is the default). Handle: **@rehanfact**.
Target: 9 lines, 101 words, about 31-34 s after clean_voice (+2 s tail).
Genre: "kisko maaroge?" dilemma riddle with a hidden on-screen clue, so A-D options + "answer in the next reel" fit.
Look: HOUSE STYLE v2 (NOTES.md): POV dashboard shots, in-car shots, close-ups, HUD, name pills, karaoke captions.

## Reference study: refs/ref15.mp4 (44 s, 720x1280) — same file as the house-style reference
Whisper is still blocked; the reel has word-by-word captions, read from 1 fps frames.
1. **Idea / puzzle:** the car is at 120 km/h; on the highway ahead stand a dog, a cow and a man making a reel. Everyone in
   the car pulls the driver a different way (grandma: the cow is gau mata; the kid: the puppy is cute; a politician: the reel
   guy has 10 lakh followers, all voters). "You're in papa's place: whom do you hit? 1, 2 or 3."
2. **Rules:** "soch ke bolna, ek clue screen pe tha"; a 12-second countdown; comment 1, 2 or 3 + reason; first correct names in
   Part 2.
3. **Answer and why:** the clue is the HUD: a distance meter counting 190 m -> 151 m while the speed holds at ~120 km/h, so the
   real answer is **nobody: brake**. Checked: 120 km/h = 33.3 m/s; reaction 1 s = 33 m; braking v²/(2·0.7·9.8) = 81 m; total
   about 114 m < 151 m, so the car stops in time. The reference's logic holds (I could not hear its answer; an orange toy near
   the brake pedal in two insert shots may be a second clue or a red herring, so we don't use it).
4. **Hook:** POV from the driver's seat at 120 km/h from frame 0, the HUD and the question banner already on screen.
5. **Format:** 44 s, 3 numbered options, countdown 12 -> 1, comment + reason, "share with a friend who drives fast", end card.

## Our version (idea + logic only)
New family, animals, numbers and wording: **Sharma ji** drives at **sau** (100) km/h; ahead: a **bakri**, a **bhains** and a
**ladka taking a selfie** in the middle of the road. In the car: **Mummy** (the buffalo belongs to the whole village), little
**Pinki** (the goat is so cute), and the selfie boy himself shouts that his video will go viral. The HUD shows **150 m**.
Logic (ours): 100 km/h = 27.8 m/s; reaction 1 s = 28 m; braking 27.8²/(2·0.7·9.8) = 56 m; total about 84 m < 150 m, so a firm
brake stops the car with room to spare. No one has to be hit.

## Script with parts (for checking)
**1 HOOK (0-3 s)**
1. [dramatically] Gaadi sau ki speed par, aur saamne sadak par teen musibat!

**2 BODY**
2. Ek bakri, ek bhains, aur beech sadak pe selfie leta ladka.
3. Mummy boli, bhains ko mat maarna, poora gaon peeche padega.
4. Pinki boli, bakri bahut cute hai!
5. Aur ladka chillaya, mera video viral hoga!

**3 RE-HOOK**
6. [curious] Papa ke haath kaanp gaye, ek clue screen pe hai, dhyan se dekho!

**4 FINAL BODY (A-D)**
7. A, bakri ko. B, steering ghuma ke khet mein. C, horn bajao, chalte raho. D, kisi ko nahi.

**5 CLIFFHANGER**
8. [excited] Comment mein letter aur reason likho, sabse pehle sahi jawab ka naam part two mein!
9. Sau se kam na chalaane wale dost ko bhejo, answer in the next reel, follow karo @rehanfact!

## Clean text for ElevenLabs
```
[dramatically] Gaadi sau ki speed par, aur saamne sadak par teen musibat!
Ek bakri, ek bhains, aur beech sadak pe selfie leta ladka.
Mummy boli, bhains ko mat maarna, poora gaon peeche padega.
Pinki boli, bakri bahut cute hai!
Aur ladka chillaya, mera video viral hoga!
[curious] Papa ke haath kaanp gaye, ek clue screen pe hai, dhyan se dekho!
A, bakri ko. B, steering ghuma ke khet mein. C, horn bajao, chalte raho. D, kisi ko nahi.
[excited] Comment mein letter aur reason likho, sabse pehle sahi jawab ka naam part two mein!
Sau se kam na chalaane wale dost ko bhejo, answer in the next reel, follow karo @rehanfact!
```

## On-screen chips (Roman capitals, 2-4 words) + house-style UI
| Line | Chips / UI |
|---|---|
| 1 | question banner `100 KI SPEED! AB KYA?` from frame 0 · HUD `100 KM/H` + distance `150 M` (counts down slowly, stays above ~120 m) |
| 2 | name tags over the subjects `BAKRI` · `BHAINS` · `SELFIE BOY` |
| 3 | name pill `MUMMY` · `BHAINS MAT MAARNA` |
| 4 | name pill `PINKI` · `BAKRI CUTE HAI` |
| 5 | name pill `SELFIE BOY` · `VIDEO VIRAL HOGA!` |
| 6 | name pill `PAPA` · `CLUE SCREEN PE HAI` (slams) · countdown badge 12 -> 1 starts |
| 7 | A-D list at the left: `A: BAKRI` · `B: KHET MEIN` · `C: HORN, CHALTE RAHO` · `D: KISI KO NAHI` |
| 8 | CTA strip `LETTER + REASON` · green strip `SABSE PEHLE SAHI = NAAM PART 2` |
| 9 | share bubble `100 SE KAM NA CHALAANE WALE DOST KO BHEJO` · `ANSWER NEXT REEL` · @rehanfact profile card, Follow tapped |
Karaoke captions on every word (key word yellow), above the bottom 300 px. Don't point at the HUD in Part 1.

## Frame 0
Driver's-seat POV at 100 km/h: Papa's hands on the wheel, the dashboard, a marigold garland swinging from the mirror; a
straight highway to the vanishing point between green and mustard fields, blue hills, big clouds; far ahead three small shapes
on the road (goat, buffalo, a boy with a selfie stick). Road dashes rush past (motion), the garland swings, the HUD reads
`100 KM/H` and `150 M`; the banner `100 KI SPEED! AB KYA?` is on screen; engine hum + whoosh + a horn blip at 0 s.

## Right answer (keep secret until Part 2)
**D: kisi ko nahi — brake lagao.** The clue is the HUD: 150 m to the obstacles. At 100 km/h a car needs about 84 m to stop
(28 m reaction + 56 m braking), so a firm brake stops it well before them.
- B (swerve into the field) is tempting: it feels like "saving everyone", but swerving at 100 km/h can roll the car and hurt
  the family; brake first, in a straight line.
- A (hit the goat, the "smallest" harm) is tempting: people pick the least bad hit without checking whether a hit is needed.
- C (honk and keep going) is the careless pick: animals and a distracted boy don't clear the road on a horn.
Part 2: replay with the HUD circled, the car stops at about 66 m from the goat; safety line: on highways keep distance and
speed in check so you always have room to brake.
