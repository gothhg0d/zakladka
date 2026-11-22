#ifndef MINIMA_GFX_H
#define MINIMA_GFX_H

#include <stdint.h>
#include "font.h"

/* Software renderer over a 0x00RRGGBB framebuffer. Colors passed in are 0xAARRGGBB. */
typedef struct {
    uint32_t *px;
    int w, h;
    int cx0, cy0, cx1, cy1;   /* clip rectangle, exclusive max */
} Canvas;

#define RGBA(r, g, b, a) ((uint32_t)(a) << 24 | (uint32_t)(r) << 16 | (uint32_t)(g) << 8 | (uint32_t)(b))
uint32_t col_alpha(uint32_t c, float a);           /* multiply a color's alpha */
uint32_t col_mix(uint32_t a, uint32_t b, float t); /* lerp two colors, alpha included */

void gfx_clip(Canvas *c, int x0, int y0, int x1, int y1);
void gfx_unclip(Canvas *c);

void gfx_rect(Canvas *c, int x, int y, int w, int h, uint32_t col);
void gfx_rrect(Canvas *c, float x, float y, float w, float h, float r, uint32_t col);
void gfx_rrect_stroke(Canvas *c, float x, float y, float w, float h, float r, float t, uint32_t col);
void gfx_disc(Canvas *c, float cx, float cy, float r, uint32_t col);
void gfx_ring(Canvas *c, float cx, float cy, float r, float t, uint32_t col);
void gfx_line(Canvas *c, float x0, float y0, float x1, float y1, float t, uint32_t col);

/* Text: y is the baseline. tracking is extra pixels between glyphs. Returns the advance. */
float text_draw(Canvas *c, int face, float x, float y, const char *s, uint32_t col, float tracking);
float text_width(int face, const char *s, float tracking);
/* Draws s, cut with an ellipsis so it fits in max_w. */
float text_draw_fit(Canvas *c, int face, float x, float y, const char *s, uint32_t col, float max_w);

#endif
