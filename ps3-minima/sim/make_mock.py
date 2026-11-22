#!/usr/bin/env python3
"""Builds a fake /dev_hdd0/game tree with real PARAM.SFO files for the simulator."""
import os, struct, sys

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
print("mock library in", root)
