#include "font.h"

#include <stdlib.h>
#include <string.h>

static Face faces[FACE_COUNT];

static uint32_t be16(const uint8_t *p) { return (uint32_t)p[0] << 8 | p[1]; }
static uint32_t be32(const uint8_t *p) { return be16(p) << 16 | be16(p + 2); }
static int16_t sbe16(const uint8_t *p) { return (int16_t)be16(p); }

int font_init(const uint8_t *data, uint32_t size, int scale_pct)
{
    if (size < 6 || memcmp(data, "MFNT", 4) != 0)
        return -1;
    const uint8_t *p = data + 6, *end = data + size;
    int nfaces = (int)be16(data + 4), loaded = 0;

    for (int i = 0; i < nfaces; i++) {
        if (p + 16 > end)
            return -1;
        int slot = (int)be16(p), scale = (int)be16(p + 2);
        int ascent = sbe16(p + 4), descent = sbe16(p + 6), line_h = sbe16(p + 8);
        int count = (int)be16(p + 10);
        uint32_t blob_size = be32(p + 12);
        const uint8_t *table = p + 16;
        const uint8_t *blob = table + (size_t)count * 20;
        p = blob + blob_size;
        if (p > end)
            return -1;
        if (scale != scale_pct || slot < 0 || slot >= FACE_COUNT)
            continue;

        Face *f = &faces[slot];
        f->ascent = ascent;
        f->descent = descent;
        f->line_h = line_h;
        f->count = count;
        f->glyphs = calloc((size_t)count, sizeof(Glyph));
        if (!f->glyphs)
            return -1;
        for (int c = 0; c < 128; c++)
            f->ascii[c] = -1;
        for (int g = 0; g < count; g++) {
            const uint8_t *e = table + g * 20;
            Glyph *gl = &f->glyphs[g];
            gl->cp = be32(e);
            gl->x_off = sbe16(e + 4);
            gl->y_off = sbe16(e + 6);
            gl->w = (uint16_t)be16(e + 8);
            gl->h = (uint16_t)be16(e + 10);
            gl->adv = sbe16(e + 12);
            gl->bits = blob + be32(e + 16);
            if (gl->cp < 128)
                f->ascii[gl->cp] = (int16_t)g;
        }
        loaded++;
    }
    return loaded == FACE_COUNT ? 0 : -1;
}

const Face *font_face(int slot) { return &faces[slot]; }

const Glyph *font_glyph(const Face *f, uint32_t cp)
{
    if (cp < 128) {
        int i = f->ascii[cp];
        return i >= 0 ? &f->glyphs[i] : (cp != '?' ? font_glyph(f, '?') : NULL);
    }
    int lo = 0, hi = f->count - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (f->glyphs[mid].cp == cp)
            return &f->glyphs[mid];
        if (f->glyphs[mid].cp < cp)
            lo = mid + 1;
        else
            hi = mid - 1;
    }
    return font_glyph(f, '?');
}

uint32_t utf8_next(const char **s)
{
    const unsigned char *p = (const unsigned char *)*s;
    uint32_t c = *p;
    if (!c)
        return 0;
    int n = c < 0x80 ? 0 : c < 0xE0 ? 1 : c < 0xF0 ? 2 : 3;
    if (n)
        c &= 0x3F >> n;
    p++;
    for (int i = 0; i < n; i++, p++) {
        if ((*p & 0xC0) != 0x80) {
            c = '?';
            break;
        }
        c = c << 6 | (*p & 0x3F);
    }
    *s = (const char *)p;
    return c;
}
