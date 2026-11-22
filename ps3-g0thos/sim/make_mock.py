#!/usr/bin/env python3
"""Builds a fake /dev_hdd0/game tree with real PARAM.SFO files for the simulator."""
import math, os, random, struct, sys

try:
    from PIL import Image, ImageDraw, ImageFilter
except ImportError:
    Image = None

def sfo(fields):
    keys, data, index = b"", b"", b""
    for k, v in fields:
        raw = v.encode() + b"\0"
        size = (len(raw) + 3) & ~3
        index += struct.pack("<HHIII", len(keys), 0x0204, len(raw), size, len(data))
        keys += k.encode() + b"\0"
        data += raw.ljust(size, b"\0")
    keys = keys.ljust((len(keys) + 3) & ~3, b"\0")
    kstart = 20 + len(index)
    return struct.pack("<4sIIII", b"\0PSF", 0x101, kstart, kstart + len(keys), len(fields)) + index + keys + data

def art(folder, title, seed):
    """Abstract placeholder art: ICON0 (320x176) and PIC1 (1920x1080)."""
    rnd = random.Random(seed)
    hue = [rnd.randint(40, 255) for _ in range(3)]
    def paint(w, h, blobs):
        im = Image.new("RGB", (w, h), tuple(c // 6 for c in hue))
        d = ImageDraw.Draw(im)
        for _ in range(blobs):
            r = rnd.randint(h // 6, h // 2)
            x, y = rnd.randint(0, w), rnd.randint(0, h)
            col = tuple(min(255, c + rnd.randint(-60, 60)) for c in hue)
            d.ellipse((x - r, y - r, x + r, y + r), fill=col)
        im = im.filter(ImageFilter.GaussianBlur(h // 12))
        d = ImageDraw.Draw(im)
        for i in range(6):
            y = h * (0.3 + 0.08 * i)
            d.line([(0, y), (w, y + rnd.randint(-h // 5, h // 5))], fill=(255, 255, 255), width=max(1, h // 120))
        return im
    paint(320, 176, 6).save(f"{folder}/ICON0.PNG")
    paint(1920, 1080, 10).save(f"{folder}/PIC1.PNG")


APPS = [
    ("RETROARCH", "SSNE10000", "RetroArch", "HG", "1.18"),
    ("MMAN", "BLES80608", "multiMAN", "HG", "04.85"),
    ("IRISMAN", "IRISMAN00", "IRISMAN", "HG", "4.88"),
    ("MOVIAN", "HTSS00003", "Movian Media Center", "HG", "5.0"),
    ("SHOOTER", "NPEB01234", "A Very Long Title For An Indie Shooter: Definitive Edition", "HG", "01.02"),
    ("RUS", "NPEA00042", "Космические рейнджеры", "HG", "01.00"),
    ("PRBOOM", "PRBOOM001", "PrBoom", "HG", "2.5"),
    ("FTP", "OFTP00001", "OpenPS3FTP", "HG", "2.3"),
    ("SAVES", "BLES00001", "Save data utility", "GD", "01.00"),
    ("SNES", "SNES90000", "SNES9x", "HG", "4.6"),
]

root = sys.argv[1] if len(sys.argv) > 1 else "mock/game"
for d, tid, title, cat, ver in APPS:
    os.makedirs(f"{root}/{d}/USRDIR", exist_ok=True)
    with open(f"{root}/{d}/PARAM.SFO", "wb") as f:
        f.write(sfo([("APP_VER", ver), ("CATEGORY", cat), ("TITLE", title), ("TITLE_ID", tid)]))
    if cat == "HG":
        open(f"{root}/{d}/USRDIR/EBOOT.BIN", "wb").close()
    if Image and d not in ("FTP", "PRBOOM"):  # a couple stay without art to show the fallback card
        art(f"{root}/{d}", title, tid)
print("mock library in", root)
