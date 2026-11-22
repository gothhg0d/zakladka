#ifndef MINIMA_FONT_H
#define MINIMA_FONT_H

#include <stdint.h>

enum { FACE_LABEL, FACE_SMALL, FACE_BODY, FACE_TITLE, FACE_COUNT };

typedef struct {
    uint32_t cp;
    int16_t x_off, y_off;   /* bitmap position relative to pen / baseline */
    uint16_t w, h;
    int16_t adv;            /* 26.6 fixed point */
    const uint8_t *bits;
} Glyph;

typedef struct {
    int ascent, descent, line_h;
    int count;
    Glyph *glyphs;          /* sorted by cp */
    int16_t ascii[128];     /* index into glyphs, -1 if missing */
} Face;

/* Parses the embedded atlas and picks faces for the given scale (100 or 150). */
int font_init(const uint8_t *data, uint32_t size, int scale_pct);
const Face *font_face(int slot);
const Glyph *font_glyph(const Face *f, uint32_t cp);

/* Decodes one UTF-8 code point and advances *s. Returns 0 at end of string. */
uint32_t utf8_next(const char **s);

#endif
