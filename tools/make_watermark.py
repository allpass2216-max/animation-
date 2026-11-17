#!/usr/bin/env python3
"""Write a watermark PNG (transparent) from your @handle, in Poppins 800 with a dark outline.
The PNG itself is fully opaque; tools/finish applies the 30% opacity.
Usage: python3 tools/make_watermark.py @myhandle [--out public/watermark.png] [--size 44]"""
import argparse, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ap = argparse.ArgumentParser()
ap.add_argument("handle")
ap.add_argument("--out", default=os.path.join(ROOT, "public", "watermark.png"))
ap.add_argument("--size", type=int, default=44, help="font size in px (video is 1080 wide)")
a = ap.parse_args()

text = a.handle.strip()
if not text.startswith("@"):
    text = "@" + text
font = ImageFont.truetype(os.path.join(ROOT, "public", "fonts", "Poppins-800.woff2"), a.size)
stroke = max(2, a.size // 10)
pad = stroke + 6
l, t, r, b = ImageDraw.Draw(Image.new("RGBA", (1, 1))).textbbox((0, 0), text, font=font, stroke_width=stroke)
img = Image.new("RGBA", (r - l + 2 * pad, b - t + 2 * pad), (0, 0, 0, 0))
ImageDraw.Draw(img).text((pad - l, pad - t), text, font=font, fill=(255, 255, 255, 255),
                         stroke_width=stroke, stroke_fill=(20, 16, 40, 255))
os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
img.save(a.out)
print(f"watermark: '{text}' -> {os.path.relpath(a.out, ROOT)} ({img.width}x{img.height})")
