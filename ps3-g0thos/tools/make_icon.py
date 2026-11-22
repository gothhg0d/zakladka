#!/usr/bin/env python3
"""Draws ICON0.PNG (320x176), the tile the XMB shows for G0THOS."""
import os, sys
from PIL import Image, ImageDraw, ImageFont

FONT_DIR = sys.argv[1] if len(sys.argv) > 1 else "/usr/share/fonts/opentype/inter"
OUT = os.path.join(os.path.dirname(__file__), "..", "ICON0.PNG")
SS = 4  # supersample
W, H = 320 * SS, 176 * SS

img = Image.new("RGB", (W, H))
px = img.load()
for y in range(H):
    t = y / (H - 1)
    for x in range(W):
        dx, dy = (x - W * 0.85) / (H * 1.2), (y + H * 0.2) / (H * 1.2)
        g = max(0.0, 1 - (dx * dx + dy * dy) ** 0.5) ** 2 * 0.22
        base = (13 + 6 * t, 15 + 7 * t, 19 + 8 * t)
        acc = (138, 180, 248)
        px[x, y] = tuple(int(b + (a - b) * g) for b, a in zip(base, acc))

d = ImageDraw.Draw(img)
font = ImageFont.truetype(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "fonts", "AALogotyperRounded.otf"), 44 * SS)
text = "G0THOS"
tw = d.textlength(text, font=font)
x, y = (W - tw) / 2 + 8 * SS, H / 2
r = 5 * SS
d.ellipse((x - 22 * SS - r, y - r - 2 * SS, x - 22 * SS + r, y + r - 2 * SS), fill=(138, 180, 248))
d.text((x, y), text, font=font, fill=(242, 243, 245), anchor="lm")
img.resize((320, 176), Image.LANCZOS).save(OUT)
print("wrote", OUT)
