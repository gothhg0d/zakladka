#include "gfx.h"

#include <math.h>
#include <stdlib.h>
#include <string.h>

static inline uint32_t blend(uint32_t d, uint32_t s, uint32_t a) /* a: 0..256 */
{
    uint32_t ia = 256 - a;
    uint32_t rb = ((s & 0xFF00FF) * a + (d & 0xFF00FF) * ia) >> 8;
    uint32_t g = ((s & 0x00FF00) * a + (d & 0x00FF00) * ia) >> 8;
    return (rb & 0xFF00FF) | (g & 0x00FF00);
}

static inline float clamp01(float v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

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

/* ---- images ---- */

static inline uint32_t sample(const Image *im, float u, float v) /* bilinear, u,v in 0..1 */
{
    float fx = u * (float)im->w - 0.5f, fy = v * (float)im->h - 0.5f;
    int x0 = (int)floorf(fx), y0 = (int)floorf(fy);
    uint32_t wx = (uint32_t)((fx - (float)x0) * 256.0f), wy = (uint32_t)((fy - (float)y0) * 256.0f);
    int x1 = x0 + 1, y1 = y0 + 1;
    if (x0 < 0) x0 = 0;
    if (y0 < 0) y0 = 0;
    if (x1 >= im->w) x1 = im->w - 1;
    if (y1 >= im->h) y1 = im->h - 1;
    if (x0 >= im->w) x0 = im->w - 1;
    if (y0 >= im->h) y0 = im->h - 1;
    uint32_t a = im->px[y0 * im->w + x0], b = im->px[y0 * im->w + x1];
    uint32_t c = im->px[y1 * im->w + x0], d = im->px[y1 * im->w + x1];
    uint32_t out = 0;
    for (int sh = 0; sh < 32; sh += 8) {
        uint32_t top = ((a >> sh & 255) * (256 - wx) + (b >> sh & 255) * wx) >> 8;
        uint32_t bot = ((c >> sh & 255) * (256 - wx) + (d >> sh & 255) * wx) >> 8;
        out |= ((top * (256 - wy) + bot * wy) >> 8) << sh;
    }
    return out;
}

static inline uint32_t lerp_px(uint32_t a, uint32_t b, uint32_t w) /* w: 0..256 */
{
    uint32_t iw = 256 - w;
    uint32_t rb = (((a & 0xFF00FF) * iw + (b & 0xFF00FF) * w) >> 8) & 0xFF00FF;
    uint32_t ag = (((a >> 8) & 0xFF00FF) * iw + ((b >> 8) & 0xFF00FF) * w) & 0xFF00FF00;
    return rb | ag;
}

void gfx_image(Canvas *c, const Image *img, const Blit *b)
{
    if (!img || !img->px || b->alpha <= 0.004f || b->w < 1 || b->h < 1)
        return;
    /* Perspective: one edge keeps its height, the other shrinks; u is interpolated
     * perspective-correctly so the card really looks turned, not just squeezed. */
    float tl = b->tilt > 0 ? 1 - b->tilt * 0.22f : 1, tr = b->tilt < 0 ? 1 + b->tilt * 0.22f : 1;
    float w = b->w * (1 - fabsf(b->tilt) * 0.12f);
    float x0 = b->x + (b->w - w) * 0.5f, yc = b->y + b->h * 0.5f;
    float ry0 = b->reflect ? b->y + b->h + 4 : b->y;
    int cx0 = (int)floorf(x0), cx1 = (int)ceilf(x0 + w);
    if (cx0 < c->cx0) cx0 = c->cx0;
    if (cx1 > c->cx1) cx1 = c->cx1;

    for (int x = cx0; x < cx1; x++) {
        float t = ((float)x + 0.5f - x0) / w;
        if (t < 0 || t > 1)
            continue;
        float hs = (1 - t) * tl + t * tr;                 /* column height scale */
        float u = t * tr / ((1 - t) * tl + t * tr);       /* perspective-correct */
        float colh = b->h * hs;
        float top = b->reflect ? ry0 : yc - colh * 0.5f;
        float span = b->reflect ? colh * 0.45f : colh;
        int y0 = (int)floorf(top), y1 = (int)ceilf(top + span);
        if (y0 < c->cy0) y0 = c->cy0;
        if (y1 > c->cy1) y1 = c->cy1;
        float edge_u = (u < 0.5f ? u : 1 - u);
        /* column constants: horizontal source taps and weight */
        float fx = u * (float)img->w - 0.5f;
        int sx0 = (int)floorf(fx);
        uint32_t wx = (uint32_t)((fx - (float)sx0) * 256.0f);
        int sx1 = sx0 + 1;
        if (sx0 < 0) sx0 = 0;
        if (sx1 > img->w - 1) sx1 = img->w - 1;
        if (sx0 > img->w - 1) sx0 = img->w - 1;
        float shine_k = 0;
        int do_shine = b->shine > -0.3f && b->shine < 1.3f;
        uint32_t k256 = (uint32_t)(b->bright * 256.0f);
        for (int y = y0; y < y1; y++) {
            float s = ((float)y + 0.5f - top) / colh;
            if (s < 0 || s > 1)
                continue;
            float v = b->reflect ? 1 - s : s;
            float cov = 1;
            float ex = edge_u * b->w, ey = (v < 0.5f ? v : 1 - v) * colh;
            if (ex < b->radius && ey < b->radius) {
                float dx = b->radius - ex, dy = b->radius - ey;
                cov = clamp01(b->radius - sqrtf(dx * dx + dy * dy) + 0.5f);
            } else {
                float e = ex < ey ? ex : ey;
                if (e < 1) cov = e + 0.5f > 1 ? 1 : e + 0.5f;
            }
            float fy = v * (float)img->h - 0.5f;
            int sy0 = (int)fy;
            if (fy < 0) { fy = 0; sy0 = 0; }
            uint32_t wy = (uint32_t)((fy - (float)sy0) * 256.0f);
            int sy1 = sy0 + 1 < img->h ? sy0 + 1 : img->h - 1;
            if (sy0 > img->h - 1) sy0 = img->h - 1;
            const uint32_t *r0 = img->px + sy0 * img->w, *r1 = img->px + sy1 * img->w;
            uint32_t px = lerp_px(lerp_px(r0[sx0], r0[sx1], wx), lerp_px(r1[sx0], r1[sx1], wx), wy);
            float a = cov * b->alpha * (float)(px >> 24) * (1.0f / 255.0f);
            if (b->reflect)
                a *= 0.22f * (1 - s / 0.45f) * (1 - s / 0.45f);
            if (a <= 0.004f)
                continue;
            uint32_t k = k256;
            if (do_shine) {
                float d = (u + v * 0.6f) / 1.6f - b->shine;
                shine_k = d * d * 90.0f;
                if (shine_k < 6) k += (uint32_t)(0.55f * 256.0f * expf(-shine_k));
            }
            uint32_t col;
            if (k == 256) {
                col = px & 0xFFFFFF;
            } else {
                uint32_t r = ((px >> 16 & 255) * k) >> 8, g = ((px >> 8 & 255) * k) >> 8, bl = ((px & 255) * k) >> 8;
                col = (r > 255 ? 255 : r) << 16 | (g > 255 ? 255 : g) << 8 | (bl > 255 ? 255 : bl);
            }
            uint32_t ai = (uint32_t)(a * 256.0f);
            uint32_t *p = &c->px[y * c->w + x];
            *p = ai >= 256 ? col : blend(*p, col, ai);
        }
    }
}

void gfx_shadow(Canvas *c, float x, float y, float w, float h, float r, float spread, float alpha)
{
    /* Only the ring around the box is drawn: the box itself covers the middle. */
    const int layers = 7;
    int sx0 = c->cx0, sy0 = c->cy0, sx1 = c->cx1, sy1 = c->cy1;
    int ix0 = (int)(x + r), iy0 = (int)(y + r), ix1 = (int)(x + w - r), iy1 = (int)(y + h - r);
    int bands[4][4] = { { sx0, sy0, sx1, iy0 }, { sx0, iy1, sx1, sy1 }, { sx0, iy0, ix0, iy1 }, { ix1, iy0, sx1, iy1 } };
    for (int i = layers; i >= 1; i--) {
        float e = spread * (float)i / layers;
        for (int k = 0; k < 4; k++) {
            gfx_clip(c, bands[k][0] > sx0 ? bands[k][0] : sx0, bands[k][1] > sy0 ? bands[k][1] : sy0,
                     bands[k][2] < sx1 ? bands[k][2] : sx1, bands[k][3] < sy1 ? bands[k][3] : sy1);
            gfx_rrect(c, x - e, y - e * 0.5f + spread * 0.35f, w + 2 * e, h + 2 * e, r + e,
                      col_alpha(0xFF000000, alpha / layers * 1.6f));
        }
    }
    c->cx0 = sx0; c->cy0 = sy0; c->cx1 = sx1; c->cy1 = sy1;
}

void gfx_backdrop(Canvas *c, const Image *img, int ox, int oy, float alpha)
{
    if (!img || !img->px)
        return;
    uint32_t a = (uint32_t)(clamp01(alpha) * 256.0f);
    if (ox < 0) ox = 0;
    for (int y = c->cy0; y < c->cy1; y++) {
        int sy = y + oy;
        if (sy < 0) sy = 0;
        if (sy >= img->h) sy = img->h - 1;
        const uint32_t *src = img->px + (size_t)sy * img->w + ox + c->cx0;
        uint32_t *dst = c->px + (size_t)y * c->w + c->cx0;
        int n = c->cx1 - c->cx0;
        if (n > img->w - ox - c->cx0) n = img->w - ox - c->cx0;
        if (a >= 256) {
            memcpy(dst, src, (size_t)n * 4);
        } else if (a) {
            for (int x = 0; x < n; x++) dst[x] = blend(dst[x], src[x], a);
        }
    }
}

Image image_cover(const Image *src, int w, int h)
{
    Image out = { malloc((size_t)w * h * 4), w, h };
    if (!out.px || !src->px)
        return out;
    float sa = (float)src->w / (float)src->h, da = (float)w / (float)h;
    float uw = sa > da ? da / sa : 1, vh = sa > da ? 1 : sa / da;
    float u0 = (1 - uw) * 0.5f, v0 = (1 - vh) * 0.5f;
    /* averaging 2x2 bilinear taps keeps big downscales (1920 -> 1280) from aliasing */
    for (int y = 0; y < h; y++)
        for (int x = 0; x < w; x++) {
            float u = u0 + ((float)x + 0.5f) / (float)w * uw, v = v0 + ((float)y + 0.5f) / (float)h * vh;
            float du = 0.25f * uw / w, dv = 0.25f * vh / h;
            uint32_t p[4] = { sample(src, u - du, v - dv), sample(src, u + du, v - dv),
                              sample(src, u - du, v + dv), sample(src, u + du, v + dv) };
            uint32_t o = 0;
            for (int sh = 0; sh < 32; sh += 8)
                o |= (((p[0] >> sh & 255) + (p[1] >> sh & 255) + (p[2] >> sh & 255) + (p[3] >> sh & 255)) / 4) << sh;
            out.px[y * w + x] = o;
        }
    return out;
}

void image_free(Image *img)
{
    free(img->px);
    img->px = NULL;
    img->w = img->h = 0;
}
