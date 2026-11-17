# Reels studio (Remotion)

Vertical 1080x1920 / 30 fps animated reels. **Read `CLAUDE.md` (rules) and `NOTES.md` (status + pipeline) first.**

| Command | What it does |
|---|---|
| `npm run dev` | Remotion Studio |
| `npx remotion render <Id> out/<name>.mp4` | Render a video |
| `tools/clean_voice in.wav [out.wav]` | Trim pauses >0.3 s to 0.15 s, 1.1x speed (same pitch), -16 LUFS |
| `python3 tools/word_times.py voice.wav [--script lines.txt]` | Whisper word times -> `public/words.json` (silencedetect / clean_voice line-time fallback) |
| `tools/stills <Id> 0,30,2.5s,...` or `tools/stills <Id> words:12` | Contact sheet PNG, 4 per row |
| `python3 tools/make_watermark.py @handle` | `public/watermark.png` |
| `tools/finish in.mp4 [out.mp4]` | -14 LUFS, true peak -1.5, watermark at 30% |
| `python3 tools/make_sfx.py` | Regenerate the sound pack |
| `tools/setup_env.sh` | Installs everything on a fresh cloud machine |
