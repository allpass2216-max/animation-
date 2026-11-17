#!/usr/bin/env bash
# Cloud environment setup for the Remotion reels studio (runs as root, from the folder holding the checkouts).
set -e
apt-get install -y ffmpeg espeak-ng >/dev/null 2>&1 || { apt-get update -qq && apt-get install -y ffmpeg espeak-ng; }
pip install -q openai-whisper numpy soundfile pillow allosaurus
python3 -m allosaurus.bin.download_model -m uni2005 >/dev/null 2>&1 || true
if [ -d animation- ]; then
  cd animation-
  npm ci --no-audit --no-fund
  [ -f public/sfx/pop.wav ] || python3 tools/make_sfx.py
fi
