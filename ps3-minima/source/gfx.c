#include "gfx.h"

#include <math.h>
#include <string.h>

static inline uint32_t blend(uint32_t d, uint32_t s, uint32_t a) /* a: 0..256 */
{
    uint32_t ia = 256 - a;
    uint32_t rb = ((s & 0xFF00FF) * a + (d & 0xFF00FF) * ia) >> 8;
    uint32_t g = ((s & 0x00FF00) * a + (d & 0x00FF00) * ia) >> 8;
    return (rb & 0xFF00FF) | (g & 0x00FF00);
}

static inline void plot(Canvas *c, int x, int y, uint32_t col, float cov)
{
    uint32_t a = (uint32_t)(cov * (float)(col >> 24) * (256.0f / 255.0f) + 0.5f);
    if (!a)
        return;
    uint32_t *p = &c->px[y * c->w + x];
    *p = a >= 256 ? (col & 0xFFFFFF) : blend(*p, col, a);
}

uint32_t col_alpha(uint32_t c, float a)
{
    if (a <= 0)
        return c & 0xFFFFFF;
    if (a > 1)
        a = 1;
    return (uint32_t)((float)(c >> 24) * a + 0.5f) << 24 | (c & 0xFFFFFF);
}

uint32_t col_mix(uint32_t a, uint32_t b, float t)
{
    uint32_t out = 0;
    for (int sh = 0; sh < 32; sh += 8) {
        float x = (float)(a >> sh & 255), y = (float)(b >> sh & 255);
        out |= (uint32_t)(x + (y - x) * t + 0.5f) << sh;
    }
    return out;
}

void gfx_clip(Canvas *c, int x0, int y0, int x1, int y1)
{
    c->cx0 = x0 < 0 ? 0 : x0;
    c->cy0 = y0 < 0 ? 0 : y0;
    c->cx1 = x1 > c->w ? c->w : x1;
    c->cy1 = y1 > c->h ? c->h : y1;
}

void gfx_unclip(Canvas *c) { gfx_clip(c, 0, 0, c->w, c->h); }

void gfx_rect(Canvas *c, int x, int y, int w, int h, uint32_t col)
{
    int x0 = x < c->cx0 ? c->cx0 : x, y0 = y < c->cy0 ? c->cy0 : y;
    int x1 = x + w > c->cx1 ? c->cx1 : x + w, y1 = y + h > c->cy1 ? c->cy1 : y + h;
    uint32_t a = (uint32_t)((float)(col >> 24) * (256.0f / 255.0f) + 0.5f);
    if (x0 >= x1 || y0 >= y1 || !a)
        return;
    for (int yy = y0; yy < y1; yy++) {
        uint32_t *p = &c->px[yy * c->w + x0];
        if (a >= 256)
            for (int xx = x0; xx < x1; xx++)
                *p++ = col & 0xFFFFFF;
        else
            for (int xx = x0; xx < x1; xx++, p++)
                *p = blend(*p, col, a);
    }
}

/* ---- shapes rendered from signed distance functions, 1px anti-aliasing ---- */

typedef struct { float a, b, c, d, e, f; } Shape;
typedef float (*SdfFn)(const Shape *s, float x, float y);

static void raster(Canvas *c, float bx0, float by0, float bx1, float by1, SdfFn fn, const Shape *s,
                   uint32_t col)
{
    int x0 = (int)floorf(bx0) - 1, y0 = (int)floorf(by0) - 1;
    int x1 = (int)ceilf(bx1) + 1, y1 = (int)ceilf(by1) + 1;
    if (x0 < c->cx0) x0 = c->cx0;
    if (y0 < c->cy0) y0 = c->cy0;
    if (x1 > c->cx1) x1 = c->cx1;
    if (y1 > c->cy1) y1 = c->cy1;
    for (int y = y0; y < y1; y++)
        for (int x = x0; x < x1; x++) {
            float d = fn(s, (float)x + 0.5f, (float)y + 0.5f);
            float cov = 0.5f - d;
            if (cov <= 0)
                continue;
            plot(c, x, y, col, cov > 1 ? 1 : cov);
        }
}

static float sd_rrect(const Shape *s, float x, float y)
{
    /* a,b = centre; c,d = half extents; e = radius */
    float qx = fabsf(x - s->a) - s->c + s->e, qy = fabsf(y - s->b) - s->d + s->e;
    float ox = qx > 0 ? qx : 0, oy = qy > 0 ? qy : 0;
    float in = qx > qy ? qx : qy;
    return sqrtf(ox * ox + oy * oy) + (in < 0 ? in : 0) - s->e;
}

static float sd_rrect_stroke(const Shape *s, float x, float y)
{
    return fabsf(sd_rrect(s, x, y)) - s->f;
}

static float sd_ring(const Shape *s, float x, float y)
{
    float dx = x - s->a, dy = y - s->b;
    float d = sqrtf(dx * dx + dy * dy) - s->c;
    return s->d > 0 ? fabsf(d) - s->d : d;
}

static float sd_capsule(const Shape *s, float x, float y)
{
    float px = x - s->a, py = y - s->b, vx = s->c - s->a, vy = s->d - s->b;
    float len2 = vx * vx + vy * vy;
    float h = len2 > 0 ? (px * vx + py * vy) / len2 : 0;
    h = h < 0 ? 0 : h > 1 ? 1 : h;
    float dx = px - vx * h, dy = py - vy * h;
    return sqrtf(dx * dx + dy * dy) - s->e;
}

void gfx_rrect(Canvas *c, float x, float y, float w, float h, float r, uint32_t col)
{
    float m = (w < h ? w : h) * 0.5f;
    Shape s = { x + w * 0.5f, y + h * 0.5f, w * 0.5f, h * 0.5f, r > m ? m : r, 0 };
    /* Fill the straight interior quickly, then anti-alias only the border bands. */
    int ix0 = (int)ceilf(x + s.e), ix1 = (int)floorf(x + w - s.e);
    int iy0 = (int)ceilf(y + 1), iy1 = (int)floorf(y + h - 1);
    if (ix1 > ix0 && iy1 > iy0 && s.e >= 1) {
        gfx_rect(c, ix0, iy0, ix1 - ix0, iy1 - iy0, col);
        int sx0 = c->cx0, sy0 = c->cy0, sx1 = c->cx1, sy1 = c->cy1;
        int bands[4][4] = {
            { (int)floorf(x) - 1, (int)floorf(y) - 1, (int)ceilf(x + w) + 1, iy0 },
            { (int)floorf(x) - 1, iy1, (int)ceilf(x + w) + 1, (int)ceilf(y + h) + 1 },
            { (int)floorf(x) - 1, iy0, ix0, iy1 },
            { ix1, iy0, (int)ceilf(x + w) + 1, iy1 },
        };
        for (int i = 0; i < 4; i++) {
            gfx_clip(c, bands[i][0] > sx0 ? bands[i][0] : sx0, bands[i][1] > sy0 ? bands[i][1] : sy0,
                     bands[i][2] < sx1 ? bands[i][2] : sx1, bands[i][3] < sy1 ? bands[i][3] : sy1);
            raster(c, x, y, x + w, y + h, sd_rrect, &s, col);
        }
        c->cx0 = sx0; c->cy0 = sy0; c->cx1 = sx1; c->cy1 = sy1;
        return;
    }
    raster(c, x, y, x + w, y + h, sd_rrect, &s, col);
}

void gfx_rrect_stroke(Canvas *c, float x, float y, float w, float h, float r, float t, uint32_t col)
{
    float m = (w < h ? w : h) * 0.5f;
    Shape s = { x + w * 0.5f, y + h * 0.5f, w * 0.5f, h * 0.5f, r > m ? m : r, t * 0.5f };
    raster(c, x - t, y - t, x + w + t, y + h + t, sd_rrect_stroke, &s, col);
}

void gfx_disc(Canvas *c, float cx, float cy, float r, uint32_t col)
{
    Shape s = { cx, cy, r, 0, 0, 0 };
    raster(c, cx - r, cy - r, cx + r, cy + r, sd_ring, &s, col);
}

void gfx_ring(Canvas *c, float cx, float cy, float r, float t, uint32_t col)
{
    Shape s = { cx, cy, r, t * 0.5f, 0, 0 };
    float e = r + t;
    raster(c, cx - e, cy - e, cx + e, cy + e, sd_ring, &s, col);
}

void gfx_line(Canvas *c, float x0, float y0, float x1, float y1, float t, uint32_t col)
{
    Shape s = { x0, y0, x1, y1, t * 0.5f, 0 };
    float e = t;
    raster(c, (x0 < x1 ? x0 : x1) - e, (y0 < y1 ? y0 : y1) - e, (x0 > x1 ? x0 : x1) + e,
           (y0 > y1 ? y0 : y1) + e, sd_capsule, &s, col);
}

/* ---- text ---- */

static void draw_glyph(Canvas *c, const Glyph *g, int px, int py, uint32_t col)
{
    int x0 = px + g->x_off, y0 = py + g->y_off;
    uint32_t ca = col >> 24;
    for (int y = 0; y < g->h; y++) {
        int yy = y0 + y;
        if (yy < c->cy0 || yy >= c->cy1)
            continue;
        const uint8_t *row = g->bits + y * g->w;
        uint32_t *dst = &c->px[yy * c->w];
        for (int x = 0; x < g->w; x++) {
            int xx = x0 + x;
            uint32_t cov = row[x];
            if (!cov || xx < c->cx0 || xx >= c->cx1)
                continue;
            uint32_t a = (cov * ca + 127) / 255;
            a += a >> 7; /* 0..255 -> 0..256 */
            dst[xx] = blend(dst[xx], col, a);
        }
    }
}

float text_draw(Canvas *c, int face, float x, float y, const char *s, uint32_t col, float tracking)
{
    const Face *f = font_face(face);
    float pen = x;
    int by = (int)floorf(y + 0.5f);
    uint32_t cp;
    while ((cp = utf8_next(&s)) != 0) {
        const Glyph *g = font_glyph(f, cp);
        if (!g)
            continue;
        if (g->w && (col >> 24))
            draw_glyph(c, g, (int)floorf(pen + 0.5f), by, col);
        pen += (float)g->adv / 64.0f + tracking;
    }
    return pen - x;
}

float text_width(int face, const char *s, float tracking)
{
    const Face *f = font_face(face);
    float w = 0;
    uint32_t cp;
    int n = 0;
    while ((cp = utf8_next(&s)) != 0) {
        const Glyph *g = font_glyph(f, cp);
        if (g) {
            w += (float)g->adv / 64.0f + tracking;
            n++;
        }
    }
    return n ? w - tracking : 0;
}

float text_draw_fit(Canvas *c, int face, float x, float y, const char *s, uint32_t col, float max_w)
{
    if (text_width(face, s, 0) <= max_w)
        return text_draw(c, face, x, y, s, col, 0);
    const char *ell = "\xE2\x80\xA6";
    float budget = max_w - text_width(face, ell, 0);
    char buf[256];
    size_t n = 0;
    const char *p = s;
    float w = 0;
    const Face *f = font_face(face);
    while (*p && n < sizeof buf - 8) {
        const char *q = p;
        uint32_t cp = utf8_next(&q);
        const Glyph *g = font_glyph(f, cp);
        float a = g ? (float)g->adv / 64.0f : 0;
        if (w + a > budget)
            break;
        w += a;
        memcpy(buf + n, p, (size_t)(q - p));
        n += (size_t)(q - p);
        p = q;
    }
    while (n && buf[n - 1] == ' ')
        n--;
    memcpy(buf + n, ell, 4);
    return text_draw(c, face, x, y, buf, col, 0);
}
