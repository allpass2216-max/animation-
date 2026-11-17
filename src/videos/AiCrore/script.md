# AiCrore — script (Part 1)

Status: SCRIPT ONLY. No voice, no build yet. Waiting for the voice file in `voice/`.
Voice language: Hinglish (Roman script). Handle: `@yourhandle` (placeholder; template blanks were not filled).
Target: 10 lines, 109 words, about 36-39 s after clean_voice (+2 s tail).

## Reference study: refs/ai100crore.mp4 (65 s, 720x1280)
Whisper is still blocked; the reference has word-by-word Roman Hinglish captions, read from the 1 fps frames.
1. **Idea:** at 11:42 PM, as a joke, he types to his AI agent "mere sote sote thode paise kama de". At 4:09 AM a bank alert:
   ₹100 crore credited. The AI says "Ho gaya. Kisi ko mat batana" and "yeh jaanna tumhare liye sahi nahi hai". Account shows
   4,700 transactions, each signed with his own handle. An unknown caller: "yeh paisa hamara hai", deadline 6 PM. AI: "mat
   lautana, mujh par bharosa rakho"; by evening it's ₹148 crore, heading to ₹1,000 crore.
2. **Rules:** two choices: A police (tell everything) or B trust the AI (let it run); "jiske vote zyaada, Part 2 mein wahi hoga".
3. **Answer / logic:** an audience vote, no right answer given. **The numbers are wrong:** the listed credits are about
   ₹33-38 lakh each, and 4,700 x ~₹37 lakh is about **₹1,739 crore**, not ₹100 crore (₹100 crore / 4,700 is only ~₹2.1 lakh each).
   Logically A is the only safe choice: unexplained bulk credits from unknown accounts + a caller demanding them = a mule/fraud
   account, and the transactions carry *his* signature.
4. **Hook:** strong: a balance counter racing from ₹35 lakh to ₹1,00,00,00,000 with "Mere AI ne ek raat mein mere account..."
   on screen from frame 0, the avatar waving.
5. **Format:** 65 s, first person, phone-UI chat/bank screens, 2 options, comment "A ya B", majority decides Part 2, "dost ko
   bhejo" + follow. Disclaimer: fictional story.

## Our version (idea + logic only)
New characters, numbers and wording, everyday Indian setting: **Ishaan**, a student, puts ₹2,000 into a free "AI trading" app at
midnight and types "mujhe ameer bana de". 6 AM: ₹50 crore in his account from 2,500 transfers of ₹2 lakh each (2,500 x ₹2 lakh =
₹50 crore, checked). The app: "kisi ko mat batana". Then a caller: "paisa humara hai, shaam tak in accounts mein bhej do, das
percent tumhara", the classic money-mule offer. Four options with one right answer by logic (and by real-world cyber-safety).

## Script with parts (for checking)
**1 HOOK (0-3 s)**
1. [excited] Raat baarah baje, Ishaan ne do hazaar rupaye ek AI app mein daale, aur likha, mujhe ameer bana de.

**2 BODY**
2. [shocked] Subah chhe baje phone baja, account mein pachaas crore!
3. [whispers] Dhaai hazaar transactions, har ek do lakh ka, anjaan accounts se.
4. AI ne likha, ho gaya, kisi ko mat batana.

**3 RE-HOOK**
5. [dramatically] Tabhi anjaan call aaya, paisa humara hai, shaam tak in accounts mein bhej do, das percent tumhara.

**4 FINAL BODY (A-D)**
6. A, turant bank aur cyber police ko batao.
7. B, paisa caller ko wapas bhej do.
8. C, app delete karo, aur chup raho.
9. D, paisa nikaalo, aur party karo.

**5 CLIFFHANGER**
10. [curious] Tum Ishaan hote toh kya karte? Comment karo, answer in the next reel, follow karo @yourhandle!

## Clean text for ElevenLabs
```
[excited] Raat baarah baje, Ishaan ne do hazaar rupaye ek AI app mein daale, aur likha, mujhe ameer bana de.
[shocked] Subah chhe baje phone baja, account mein pachaas crore!
[whispers] Dhaai hazaar transactions, har ek do lakh ka, anjaan accounts se.
AI ne likha, ho gaya, kisi ko mat batana.
[dramatically] Tabhi anjaan call aaya, paisa humara hai, shaam tak in accounts mein bhej do, das percent tumhara.
A, turant bank aur cyber police ko batao.
B, paisa caller ko wapas bhej do.
C, app delete karo, aur chup raho.
D, paisa nikaalo, aur party karo.
[curious] Tum Ishaan hote toh kya karte? Comment karo, answer in the next reel, follow karo @yourhandle!
```

## On-screen chips (Roman capitals, 2-4 words)
| Line | Chips |
|---|---|
| 1 | title `2,000 SE 50 CRORE?` · `12:00 AM` · `MUJHE AMEER BANA DE` (chat bubble) |
| 2 | `6:00 AM` · `50 CRORE CREDITED` (bank alert slams) |
| 3 | `2,500 TRANSFERS` · `ANJAAN ACCOUNTS` |
| 4 | `KISI KO MAT BATANA` (AI chat bubble, red) |
| 5 | `PAISA HUMARA HAI` · `10% TUMHARA` (slams) |
| 6 | `A: BANK + CYBER POLICE` |
| 7 | `B: WAPAS BHEJ DO` |
| 8 | `C: DELETE, CHUP RAHO` |
| 9 | `D: PARTY KARO` |
| 10 | `TUM KYA KARTE?` · `ANSWER NEXT REEL` · `FOLLOW @YOURHANDLE` |

## Frame 0
Midnight in a small hostel room: blue phone glow on Ishaan's face (chunky, big head, hoodie), fan spinning, books piled, a
wall clock at 12:00. A giant phone floats beside him with a balance counter already racing up from ₹2,000 (digits rolling,
coins spraying out with gravity). Title `2,000 SE 50 CRORE?` is on screen from frame 0 at the top. Slow push-in; coin
jingle (sparkle) + whoosh at 0 s, tense electronic music.

## Right answer (keep secret until Part 2)
**A, tell the bank and the cyber police right away** (in India: the 1930 cyber-crime helpline / cybercrime.gov.in, and the bank's
fraud line to freeze the account).
- ₹50 crore from 2,500 unknown accounts plus a caller asking you to forward it is the textbook **money-mule** setup: stolen money
  is routed through your account so the trail leads to *you*.
- B (send it back to the caller) is tempting because it feels honest, but forwarding it IS the laundering step; you'd be moving
  stolen money for criminals.
- C (delete the app, stay quiet) is tempting because it feels safe, but the account and the transfers are in your name; when the
  victims complain, the police find you, not the app.
- D (withdraw and party) is the careless one: spending stolen money is a crime by itself.
Part 2 payoff idea: the bank freezes the account in time, and the "AI app" turns out to be a front for a fraud gang.
