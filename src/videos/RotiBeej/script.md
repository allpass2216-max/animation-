# RotiBeej — script (Part 1)

Status: STAGE 1 BUILT. Recording voice/rotibeej.mp3 matches this script word for word.
Voice language: Hinglish (Roman script; template blank not filled, same default as before). Handle: **@rehanfact**.
Target: 10 lines, 104 words, about 35-38 s after clean_voice (+2 s tail).

## Reference study: refs/ref5.mp4 (94 s, 720x1280)
Whisper is still blocked; the reference has word-by-word Devanagari captions, read from the 1 fps frames.
1. **Idea:** two brothers, Ramu and Mohan, get the same grain and 1 bigha each. Ramu eats it all (sells some for clothes,
   "zindagi ek baar milti hai"). Mohan saves one handful every night, villagers laugh; he sows it in the rain, eats a little of
   the first small crop and re-sows the rest; crops double, "1 dana -> 100 dane". Year 3 drought: Ramu's pot is empty, Mohan's
   godown is full. 10 years later Mohan has 10 bigha and Ramu works as a labourer on his fields.
2. **Rules / lesson:** grain = today's food (spending), seed = tomorrow (saving, investing, skills). Put 10% of every salary
   into "seed".
3. **Answer / logic:** sound core idea (compounding by re-investing). Weak spots: "1 dana -> 100 dane" in one season is an
   exaggeration for wheat (about 20-40x is realistic) and contradicts the "fasal dogunu" (x2) shown a moment earlier; and
   "1 bigha -> 10 bigha" is shown without any numbers behind it.
4. **Hook:** "BARABAR ANAJ" title over a split screen of the two brothers from frame 0; clear, but no number and no stakes.
5. **Format:** 94 s, narration + Devanagari captions, a salary-bag explainer at the end, no right answer, a poll
   (0% / 5% / 10% / 20%+, "sab roti" vs "kuch beej"), "comment mein likho". No cliffhanger.

## Our version (idea + logic only)
Modern Indian setting with real, checked numbers: Rohan and Kunal start the same job on the same day, both earn ₹30,000.
Rohan spends everything; Kunal puts only ₹3,000 a month (10%) into a SIP. At 12% a year, what does Kunal have after 10 years?
Maths (monthly SIP, 1% a month, 120 months): 3,000 x [(1.01^120 - 1) / 0.01] x 1.01 = **₹6,97,017** (about 7 lakh).

## Script with parts (for checking)
**1 HOOK (0-3 s)**
1. [dramatically] Rohan aur Kunal, ek hi din naukri lage, dono ki salary tees hazaar.

**2 BODY**
2. [playful] Rohan har mahine sab uda deta, naya phone, party, online shopping.
3. [calm] Kunal har mahine sirf teen hazaar alag rakhta, SIP mein, baaki aaram se kharch.
4. [laughs] Dost hanse, teen hazaar se kya crorepati banega?

**3 RE-HOOK**
5. [curious] Har saal baarah percent ka return, toh das saal baad, Kunal ke paas kitne honge?

**4 FINAL BODY (A-D)**
6. A, lagbhag saat lakh.
7. B, sirf teen lakh saath hazaar.
8. C, lagbhag gyaarah lakh.
9. D, poore ek crore.

**5 CLIFFHANGER**
10. [curious] Tum salary ki roti sab kha rahe ho, ya kuch beej bhi bo rahe ho? Comment karo, answer in the next reel, follow karo @rehanfact!

## Clean text for ElevenLabs
```
[dramatically] Rohan aur Kunal, ek hi din naukri lage, dono ki salary tees hazaar.
[playful] Rohan har mahine sab uda deta, naya phone, party, online shopping.
[calm] Kunal har mahine sirf teen hazaar alag rakhta, SIP mein, baaki aaram se kharch.
[laughs] Dost hanse, teen hazaar se kya crorepati banega?
[curious] Har saal baarah percent ka return, toh das saal baad, Kunal ke paas kitne honge?
A, lagbhag saat lakh.
B, sirf teen lakh saath hazaar.
C, lagbhag gyaarah lakh.
D, poore ek crore.
[curious] Tum salary ki roti sab kha rahe ho, ya kuch beej bhi bo rahe ho? Comment karo, answer in the next reel, follow karo @rehanfact!
```

## On-screen chips (Roman capitals, 2-4 words)
| Line | Chips |
|---|---|
| 1 | title `SAME SALARY, 10 SAAL` · `30,000 / MONTH` |
| 2 | `SAB KHARCH` · `NAYA PHONE` · `PARTY` |
| 3 | `SIRF 3,000 SIP` · `10% BEEJ` |
| 4 | `3,000 SE CRORE?` |
| 5 | `12% / SAAL` · `10 SAAL BAAD?` (slams) |
| 6 | `A: ~7 LAKH` |
| 7 | `B: 3.6 LAKH` |
| 8 | `C: ~11 LAKH` |
| 9 | `D: 1 CRORE` |
| 10 | `ROTI YA BEEJ?` · `ANSWER NEXT REEL` · `FOLLOW @REHANFACT` |

## Frame 0
Split screen down the middle (a growing vine as the divider, our own look): left, Rohan (flashy shirt, sunglasses) already
fanning out ₹500 notes that flutter down; right, Kunal (neat shirt, lunchbox) dropping one coin into a clay pot with a tiny
sprout, the pot glowing. Both under one office sign. Title `SAME SALARY, 10 SAAL` on screen from frame 0, `30,000 / MONTH`
pops under it; whoosh + coin "ding" at 0 s.

## Right answer (keep secret until Part 2)
**A, about ₹7 lakh** (₹6,97,017: he put in ₹3,60,000, and growth added ~₹3,37,000).
- B (₹3.6 lakh) is tempting: it just adds up the deposits, 3,000 x 120, and forgets the returns.
- C (~₹11 lakh) is tempting: it treats all ₹3.6 lakh as if invested on day one (3.6 lakh x 1.12^10 = ₹11.18 lakh), but most of
  the money went in later and had less time to grow.
- D (₹1 crore) is the careless "crorepati" guess.
Part 2 payoff idea: keep going: the same ₹3,000 for 20 years is about ₹30 lakh, for 30 years about ₹1.06 crore, so the
friends' joke "3,000 se crorepati?" turns out true, if you wait. Note: 12% is an assumed long-run return, not guaranteed.
