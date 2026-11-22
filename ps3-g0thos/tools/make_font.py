#!/usr/bin/env python3
"""Rasterize AA Logotyper Rounded (with Inter as fallback) into data/font.bin, the glyph atlas G0THOS draws text with.

Format (big-endian, read byte by byte so it works on any host):
  "MFNT" u16 face_count
  per face:
    u16 slot  u16 scale_pct  i16 ascent  i16 descent  i16 line_height
    u16 glyph_count  u32 blob_size
    glyph_count x { u32 codepoint  i16 x_off  i16 y_off  u16 w  u16 h
                    i16 advance_26_6  u16 reserved  u32 blob_offset }
    blob: 8-bit coverage bitmaps, row-major, w*h bytes per glyph
Glyphs are sorted by codepoint; y_off is relative to the baseline (negative = up).

Usage: python3 tools/make_font.py [path/to/inter/dir]
"""
import os
import struct
import sys

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
MAIN = os.path.join(HERE, "..", "fonts", "AALogotyperRounded.otf")
# Inter fills in the few characters AA Logotyper Rounded doesn't have.
FALLBACK_DIR = sys.argv[1] if len(sys.argv) > 1 else "/usr/share/fonts/opentype/inter"
FALLBACK = os.path.join(FALLBACK_DIR, "Inter-Medium.otf")
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "font.bin")

# slot -> (file, size in px at 720p). Must match the FACE_* enum in source/font.h.
FACES = [14, 17, 22, 34, 60]  # FACE_LABEL, FACE_SMALL, FACE_BODY, FACE_TITLE, FACE_HERO
SCALES = [100, 150]  # 720p and 1080p

CHARS = set(range(0x20, 0x7F)) | set(range(0xA0, 0x100)) | set(range(0x400, 0x460))
CHARS |= {0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026,
          0x2039, 0x203A, 0x2122, 0x2190, 0x2192, 0x00D7, 0x2116}


def has(font, ch, notdef=None):
    if ch == " ":
        return True
    m = font.getmask(ch)
    if m.getbbox() is None:
        return False
    # Some fonts draw a visible "missing glyph" box instead of nothing; compare against it.
    return notdef is None or bytes(m) != notdef


def notdef_of(font):
    return bytes(font.getmask("\uE000"))


def build_face(px):
    main = ImageFont.truetype(MAIN, px)
    fallback = ImageFont.truetype(FALLBACK, int(px * 0.92))
    nd = notdef_of(main)
    ascent, descent = main.getmetrics()
    glyphs, blob = [], bytearray()
    for cp in sorted(CHARS):
        ch = chr(cp)
        font = main if has(main, ch, nd) else fallback
        if not has(font, ch):
            continue
        adv = font.getlength(ch)
        l, t, r, b = font.getbbox(ch, anchor="ls")
        w, h = max(0, r - l), max(0, b - t)
        off = len(blob)
        if w and h:
            img = Image.new("L", (w, h), 0)
            ImageDraw.Draw(img).text((-l, -t), ch, font=font, fill=255, anchor="ls")
            blob += img.tobytes()
        glyphs.append((cp, l, t, w, h, int(round(adv * 64)), off))
    return ascent, descent, glyphs, bytes(blob)


def main():
    out = bytearray(b"MFNT")
    out += struct.pack(">H", len(FACES) * len(SCALES))
    total = 0
    for scale in SCALES:
        for slot, size in enumerate(FACES):
            px = int(round(size * scale / 100))
            ascent, descent, glyphs, blob = build_face(px)
            line_h = int(round(px * 1.25))
            out += struct.pack(">HHhhhHI", slot, scale, ascent, descent, line_h, len(glyphs), len(blob))
            for cp, l, t, w, h, adv, off in glyphs:
                out += struct.pack(">IhhHHhHI", cp, l, t, w, h, adv, 0, off)
            out += blob
            total += len(glyphs)
    with open(OUT, "wb") as f:
        f.write(out)
    print(f"{OUT}: {len(out)} bytes, {total} glyphs")


if __name__ == "__main__":
    main()
