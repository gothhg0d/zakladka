/* G0THOS — a home screen for the PlayStation 3 in the spirit of modern consoles:
 * a row of cards, full-screen art, depth, motion and sound. */

#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include "font.h"
#include "gfx.h"
#include "library.h"
#include "platform.h"
#include "sound.h"

#define SHELL_NAME "G0THOS"
#define SHELL_VERSION "2.0"
#define SELF_TITLE_ID "GTHS00001"

extern const uint8_t font_bin[];
extern const uint8_t font_bin_end[];

/* ---------------------------------------------------------------- themes */

typedef struct {
    const char *name;
    uint32_t top, bottom, glow1, glow2, accent;
    int light;
} Theme;

static const Theme THEMES[] = {
    { "Cosmic",   0x04050D, 0x0A0F25, 0x2B57D6, 0x6A35C9, 0x5AA9FF, 0 },
    { "Aurora",   0x03100F, 0x06201C, 0x1FAE8A, 0x2A6FD1, 0x5FE3C0, 0 },
    { "Sunset",   0x12060F, 0x2A0F1C, 0xE0603A, 0x8A2D8F, 0xFFB36B, 0 },
    { "Sakura",   0x14080E, 0x281220, 0xE46AA0, 0x8E4FD0, 0xFFA3C8, 0 },
    { "Graphite", 0x0C0D0F, 0x1A1C20, 0x4A4F58, 0x2C3038, 0xE8E8E8, 0 },
    { "Daylight", 0xEEF1F6, 0xD5DBE6, 0x9FB8FF, 0xF1C6E8, 0x2F6BFF, 1 },
};
#define THEME_COUNT (int)(sizeof THEMES / sizeof THEMES[0])

/* ---------------------------------------------------------------- config */

typedef struct { int theme, clock24, show_ids, sounds, music, motion; } Config;

static void config_load(Config *c)
{
    *c = (Config){ 0, 1, 1, 1, 1, 1 };
    FILE *f = fopen(plat_config_path(), "r");
    if (!f)
        return;
    char key[32];
    int v;
    while (fscanf(f, " %31[^=]=%d", key, &v) == 2) {
        if (!strcmp(key, "theme")) c->theme = (v % THEME_COUNT + THEME_COUNT) % THEME_COUNT;
        else if (!strcmp(key, "clock24")) c->clock24 = !!v;
        else if (!strcmp(key, "show_ids")) c->show_ids = !!v;
        else if (!strcmp(key, "sounds")) c->sounds = !!v;
        else if (!strcmp(key, "music")) c->music = !!v;
        else if (!strcmp(key, "motion")) c->motion = !!v;
    }
    fclose(f);
}

static void config_save(const Config *c)
{
    FILE *f = fopen(plat_config_path(), "w");
    if (!f)
        return;
    fprintf(f, "theme=%d\nclock24=%d\nshow_ids=%d\nsounds=%d\nmusic=%d\nmotion=%d\n", c->theme, c->clock24,
            c->show_ids, c->sounds, c->music, c->motion);
    fclose(f);
}

/* ---------------------------------------------------------------- state */

enum { TAB_GAMES, TAB_SYSTEM, TAB_SETTINGS, TAB_POWER, TAB_COUNT };
static const char *TAB_NAMES[TAB_COUNT] = { "Games", "System", "Settings", "Power" };

enum { SET_THEME, SET_CLOCK, SET_IDS, SET_SOUNDS, SET_MUSIC, SET_MOTION, SET_COUNT };
enum { PWR_XMB, PWR_RESTART, PWR_OFF, PWR_COUNT };
enum { SYS_CONSOLE, SYS_DISPLAY, SYS_STORAGE, SYS_TITLES, SYS_SESSION, SYS_SHELL, SYS_COUNT };
enum { ACT_NONE, ACT_LAUNCH, ACT_REBOOT, ACT_OFF, ACT_QUIT };

/* Symbols drawn on the generated 3D tiles */
enum { ICO_CONSOLE, ICO_DISPLAY, ICO_STORAGE, ICO_LIBRARY, ICO_SESSION, ICO_SHELL, ICO_THEME, ICO_CLOCK,
       ICO_TAG, ICO_SOUND, ICO_MUSIC, ICO_MOTION, ICO_XMB, ICO_RESTART, ICO_POWER, ICO_COUNT };

#define PARTICLES 40
typedef struct { float x, y, r, speed, phase; } Particle;

typedef struct {
    int W, H;
    float S;

    Image backdrop;          /* theme background, a little larger than the screen for parallax */
    int backdrop_theme;
    Image hero, hero_prev;   /* art of the focused game, and the one fading out */
    int hero_for;            /* library index hero belongs to */
    float hero_t;            /* cross-fade 0 -> 1 */
    float settle;            /* seconds the focus has stayed put */
    Image icons[ICO_COUNT];
    Image fallback[LIB_MAX]; /* generated cards for apps without ICON0 */

    Library lib;
    Config cfg;

    int tab;
    float tab_x, tab_w, tab_t;
    int tab_dir;
    int sel[TAB_COUNT];
    float hl[TAB_COUNT];     /* animated focus position */
    float bounce;            /* rubber-band at the ends of a row */
    float shine;             /* light sweep across the focused card */
    float time;

    int modal;
    float modal_t;
    float fade, fade_target;
    int pending, pending_app;
    float launch_t;          /* card zooming to fill the screen */

    char toast[96];
    float toast_left, toast_t;

    uint64_t started_us;
    uint64_t disk_total, disk_avail;
    int disk_ok;
    float intro;
    float frame_avg;         /* smoothed frame time, seconds */
    int lite;                /* set when the console can't keep up: cheaper effects */
    Particle parts[PARTICLES];
} UI;

static UI ui;

#define U(v) ((v) * ui.S)

static float clampf(float v, float lo, float hi) { return v < lo ? lo : v > hi ? hi : v; }
static float ease_out(float t) { t = clampf(t, 0, 1); return 1 - (1 - t) * (1 - t) * (1 - t); }
static float ease_back(float t) /* overshoots a little: a springy arrival */
{
    t = clampf(t, 0, 1);
    float c = 1.6f, u = t - 1;
    return 1 + (c + 1) * u * u * u + c * u * u;
}

static float approach(float v, float target, float dt, float speed)
{
    if (!ui.cfg.motion)
        return target;
    v += (target - v) * (1.0f - expf(-speed * dt));
    return fabsf(target - v) < 0.001f ? target : v;
}

static const Theme *theme(void) { return &THEMES[ui.cfg.theme]; }
static uint32_t accent(void) { return 0xFF000000u | theme()->accent; }
static uint32_t ink(float a) { return col_alpha(theme()->light ? 0xFF14171D : 0xFFF5F6F8, a); }

static void toast(const char *msg)
{
    snprintf(ui.toast, sizeof ui.toast, "%s", msg);
    ui.toast_left = 2.6f;
    sound_play(SND_OPEN);
}

static uint32_t hash32(uint32_t x)
{
    x ^= x >> 16; x *= 0x7FEB352Du; x ^= x >> 15; x *= 0x846CA68Bu; x ^= x >> 16;
    return x;
}

static float chan(uint32_t c, int sh) { return (float)(c >> sh & 255); }

/* ---------------------------------------------------------------- backdrop */

static int parallax(void) { return (int)U(40); }

static void build_backdrop(void)
{
    const Theme *t = theme();
    int W = ui.W + 2 * parallax(), H = ui.H + parallax();
    image_free(&ui.backdrop);
    ui.backdrop.px = malloc((size_t)W * H * 4);
    ui.backdrop.w = W;
    ui.backdrop.h = H;
    if (!ui.backdrop.px)
        return;
    float g1x = W * 0.78f, g1y = H * 0.05f, g1r = H * 0.95f;
    float g2x = W * 0.12f, g2y = H * 1.05f, g2r = H * 0.85f;
    float strength = t->light ? 0.35f : 0.42f;
    for (int y = 0; y < H; y++) {
        float k = (float)y / (float)(H - 1);
        for (int x = 0; x < W; x++) {
            float dx = (x - g1x) / g1r, dy = (y - g1y) / g1r;
            float a = 1 - sqrtf(dx * dx + dy * dy);
            a = a > 0 ? a * a * strength : 0;
            dx = (x - g2x) / g2r; dy = (y - g2y) / g2r;
            float b = 1 - sqrtf(dx * dx + dy * dy);
            b = b > 0 ? b * b * strength * 0.8f : 0;
            /* two soft light ribbons crossing the screen */
            float w1 = sinf(x * 0.0042f / ui.S + 1.3f) * H * 0.08f + H * 0.62f, d1 = (y - w1) / (H * 0.05f);
            float w2 = sinf(x * 0.0031f / ui.S + 3.1f) * H * 0.1f + H * 0.7f, d2 = (y - w2) / (H * 0.025f);
            float rib = expf(-d1 * d1) * 0.10f + expf(-d2 * d2) * 0.06f;
            float n = (float)(hash32((uint32_t)(y * W + x)) & 255) / 255.0f - 0.5f;
            uint32_t out = 0xFF000000u;
            for (int sh = 0; sh <= 16; sh += 8) {
                float base = chan(t->top, sh) + (chan(t->bottom, sh) - chan(t->top, sh)) * k;
                float v = base + (chan(t->glow1, sh) - base) * a + (chan(t->glow2, sh) - base) * b;
                v += (chan(t->accent, sh) - v) * rib + n;
                out |= (uint32_t)clampf(v + 0.5f, 0, 255) << sh;
            }
            ui.backdrop.px[y * W + x] = out;
        }
    }
    ui.backdrop_theme = ui.cfg.theme;
}

/* Prepares a game's PIC1 as a full-screen backdrop: covered, then darkened toward the
 * bottom-left where the text sits. */
static void load_hero(int idx)
{
    image_free(&ui.hero_prev);
    ui.hero_prev = ui.hero;
    ui.hero = (Image){ 0 };
    ui.hero_for = idx;
    ui.hero_t = 0;
    if (idx < 0 || idx >= ui.lib.count)
        return;
    Image src = { 0 };
    src.px = plat_load_png(ui.lib.items[idx].pic1, &src.w, &src.h);
    if (!src.px)
        return;
    ui.hero = image_cover(&src, ui.W + 2 * parallax(), ui.H + parallax());
    image_free(&src);
    if (!ui.hero.px)
        return;
    int W = ui.hero.w, H = ui.hero.h;
    uint32_t tint = theme()->bottom;
    float wash = theme()->light ? 1.0f : 0.6f; /* light themes fade the art toward white */
    for (int y = 0; y < H; y++)
        for (int x = 0; x < W; x++) {
            float fx = (float)x / W, fy = (float)y / H;
            float keep = clampf(0.78f - 0.5f * fy * fy - 0.3f * (1 - fx) * fy, 0.1f, 0.78f);
            if (theme()->light)
                keep *= 0.55f;
            uint32_t p = ui.hero.px[y * W + x], o = 0xFF000000u;
            for (int sh = 0; sh <= 16; sh += 8)
                o |= (uint32_t)(chan(p, sh) * keep + chan(tint, sh) * (1 - keep) * wash) << sh;
            ui.hero.px[y * W + x] = o;
        }
}

/* ---------------------------------------------------------------- generated 3D tiles */

static void canvas_for(Canvas *c, Image *img)
{
    c->px = img->px;
    c->w = img->w;
    c->h = img->h;
    gfx_unclip(c);
}

static void finish_image(Image *img)
{
    for (int i = 0; i < img->w * img->h; i++)
        img->px[i] |= 0xFF000000u;
}

/* Card background: a lit, slightly bevelled panel. */
static void paint_panel(Image *img, uint32_t c0, uint32_t c1)
{
    for (int y = 0; y < img->h; y++)
        for (int x = 0; x < img->w; x++) {
            float fx = (float)x / img->w, fy = (float)y / img->h;
            float k = clampf(0.15f + fx * 0.45f + fy * 0.55f, 0, 1);
            float gloss = fy < 0.45f ? (0.45f - fy) * 0.25f : 0;
            float bevel = (fx < 0.02f || fy < 0.03f) ? 0.12f : (fx > 0.98f || fy > 0.97f) ? -0.15f : 0;
            uint32_t o = 0;
            for (int sh = 0; sh <= 16; sh += 8) {
                float v = chan(c0, sh) + (chan(c1, sh) - chan(c0, sh)) * k;
                v += (255 - v) * (gloss + (bevel > 0 ? bevel : 0)) + v * (bevel < 0 ? bevel : 0);
                o |= (uint32_t)clampf(v, 0, 255) << sh;
            }
            img->px[y * img->w + x] = o;
        }
}

/* A glossy orb lit from the top-left: the "3D object" each system tile is built around. */
static void paint_orb(Image *img, float cx, float cy, float r, uint32_t col)
{
    for (int y = (int)(cy - r - 2); y <= (int)(cy + r + 2); y++)
        for (int x = (int)(cx - r - 2); x <= (int)(cx + r + 2); x++) {
            if (x < 0 || y < 0 || x >= img->w || y >= img->h)
                continue;
            float nx = (x + 0.5f - cx) / r, ny = (y + 0.5f - cy) / r, d2 = nx * nx + ny * ny;
            float cov = clampf((1 - sqrtf(d2)) * r + 0.5f, 0, 1);
            if (cov <= 0)
                continue;
            float nz = sqrtf(fmaxf(0, 1 - d2));
            float lx = -0.45f, ly = -0.6f, lz = 0.66f;
            float diff = clampf(nx * lx + ny * ly + nz * lz, 0, 1);
            float hx = lx, hy = ly, hz = lz + 1, hl = sqrtf(hx * hx + hy * hy + hz * hz);
            float spec = powf(clampf((nx * hx + ny * hy + nz * hz) / hl, 0, 1), 40) * 0.9f;
            float rim = (1 - nz) * (1 - nz) * (1 - nz) * 0.35f;
            uint32_t *p = &img->px[y * img->w + x], o = 0;
            for (int sh = 0; sh <= 16; sh += 8) {
                float v = chan(col, sh) * (0.28f + 0.8f * diff) + 255 * (spec + rim * 0.5f);
                v = chan(*p, sh) + (clampf(v, 0, 255) - chan(*p, sh)) * cov;
                o |= (uint32_t)v << sh;
            }
            *p = o;
        }
}

static void arc(Canvas *c, float cx, float cy, float r, float a0, float a1, float t, uint32_t col)
{
    float px = cx + cosf(a0) * r, py = cy + sinf(a0) * r;
    for (int k = 1; k <= 24; k++) {
        float a = a0 + (a1 - a0) * k / 24, x = cx + cosf(a) * r, y = cy + sinf(a) * r;
        gfx_line(c, px, py, x, y, t, col);
        px = x; py = y;
    }
}

static void paint_symbol(Canvas *c, int ico, float cx, float cy, float s, uint32_t col)
{
    float t = s * 0.11f;
    switch (ico) {
    case ICO_CONSOLE:
        gfx_rrect_stroke(c, cx - s * 0.55f, cy - s * 0.28f, s * 1.1f, s * 0.56f, s * 0.26f, t, col);
        gfx_line(c, cx - s * 0.33f, cy, cx - s * 0.17f, cy, t, col);
        gfx_line(c, cx - s * 0.25f, cy - s * 0.08f, cx - s * 0.25f, cy + s * 0.08f, t, col);
        gfx_disc(c, cx + s * 0.22f, cy - s * 0.05f, t * 0.8f, col);
        gfx_disc(c, cx + s * 0.34f, cy + s * 0.07f, t * 0.8f, col);
        break;
    case ICO_DISPLAY:
        gfx_rrect_stroke(c, cx - s * 0.5f, cy - s * 0.38f, s, s * 0.6f, s * 0.06f, t, col);
        gfx_line(c, cx - s * 0.2f, cy + s * 0.38f, cx + s * 0.2f, cy + s * 0.38f, t, col);
        break;
    case ICO_STORAGE:
        for (int i = 0; i < 3; i++)
            gfx_rrect_stroke(c, cx - s * 0.45f, cy - s * 0.4f + i * s * 0.3f, s * 0.9f, s * 0.22f, s * 0.08f, t, col);
        break;
    case ICO_LIBRARY:
        for (int i = 0; i < 4; i++)
            gfx_rrect(c, cx - s * 0.4f + (i % 2) * s * 0.44f, cy - s * 0.4f + (i / 2) * s * 0.44f, s * 0.36f,
                      s * 0.36f, s * 0.07f, col);
        break;
    case ICO_SESSION:
    case ICO_CLOCK:
        gfx_ring(c, cx, cy, s * 0.42f, t, col);
        gfx_line(c, cx, cy, cx, cy - s * 0.26f, t, col);
        gfx_line(c, cx, cy, cx + s * 0.18f, cy + s * 0.1f, t, col);
        break;
    case ICO_SHELL:
        gfx_disc(c, cx, cy, s * 0.14f, col);
        gfx_ring(c, cx, cy, s * 0.4f, t, col);
        break;
    case ICO_THEME:
        gfx_disc(c, cx - s * 0.2f, cy - s * 0.12f, s * 0.2f, col);
        gfx_disc(c, cx + s * 0.2f, cy - s * 0.12f, s * 0.2f, col_alpha(col, 0.75f));
        gfx_disc(c, cx, cy + s * 0.22f, s * 0.2f, col_alpha(col, 0.5f));
        break;
    case ICO_TAG:
        gfx_line(c, cx - s * 0.12f, cy - s * 0.38f, cx - s * 0.22f, cy + s * 0.38f, t, col);
        gfx_line(c, cx + s * 0.22f, cy - s * 0.38f, cx + s * 0.12f, cy + s * 0.38f, t, col);
        gfx_line(c, cx - s * 0.38f, cy - s * 0.12f, cx + s * 0.4f, cy - s * 0.12f, t, col);
        gfx_line(c, cx - s * 0.42f, cy + s * 0.14f, cx + s * 0.36f, cy + s * 0.14f, t, col);
        break;
    case ICO_SOUND:
        gfx_rrect(c, cx - s * 0.42f, cy - s * 0.12f, s * 0.2f, s * 0.24f, s * 0.03f, col);
        gfx_line(c, cx - s * 0.22f, cy - s * 0.12f, cx, cy - s * 0.32f, t, col);
        gfx_line(c, cx - s * 0.22f, cy + s * 0.12f, cx, cy + s * 0.32f, t, col);
        gfx_line(c, cx, cy - s * 0.32f, cx, cy + s * 0.32f, t, col);
        arc(c, cx + s * 0.05f, cy, s * 0.2f, -0.8f, 0.8f, t, col);
        arc(c, cx + s * 0.05f, cy, s * 0.36f, -0.8f, 0.8f, t, col);
        break;
    case ICO_MUSIC:
        gfx_disc(c, cx - s * 0.2f, cy + s * 0.25f, s * 0.13f, col);
        gfx_line(c, cx - s * 0.08f, cy + s * 0.25f, cx - s * 0.08f, cy - s * 0.35f, t, col);
        gfx_line(c, cx - s * 0.08f, cy - s * 0.35f, cx + s * 0.3f, cy - s * 0.2f, t, col);
        break;
    case ICO_MOTION:
        for (int i = 0; i < 3; i++) {
            float y = cy - s * 0.25f + i * s * 0.25f, px = cx - s * 0.45f, py = y;
            for (int k = 1; k <= 12; k++) {
                float x = cx - s * 0.45f + s * 0.9f * k / 12, yy = y + sinf(k * 0.6f + i) * s * 0.07f;
                gfx_line(c, px, py, x, yy, t * 0.8f, col);
                px = x; py = yy;
            }
        }
        break;
    case ICO_XMB:
        gfx_line(c, cx + s * 0.35f, cy, cx - s * 0.35f, cy, t, col);
        gfx_line(c, cx - s * 0.35f, cy, cx - s * 0.1f, cy - s * 0.25f, t, col);
        gfx_line(c, cx - s * 0.35f, cy, cx - s * 0.1f, cy + s * 0.25f, t, col);
        break;
    case ICO_RESTART: {
        arc(c, cx, cy, s * 0.38f, 0, 5.2f, t, col);
        float px = cx + cosf(5.2f) * s * 0.38f, py = cy + sinf(5.2f) * s * 0.38f;
        gfx_line(c, px, py, px + s * 0.18f, py + s * 0.02f, t, col);
        gfx_line(c, px, py, px + s * 0.03f, py + s * 0.18f, t, col);
        break;
    }
    case ICO_POWER:
        arc(c, cx, cy, s * 0.38f, -1.0f, 4.14f, t, col);
        gfx_line(c, cx, cy - s * 0.48f, cx, cy - s * 0.05f, t, col);
        break;
    }
}

static Image make_card(int w, int h)
{
    Image img = { calloc((size_t)w * h, 4), w, h };
    return img;
}

static void build_icons(void)
{
    const Theme *t = theme();
    int w = (int)U(320), h = (int)U(176);
    for (int i = 0; i < ICO_COUNT; i++) {
        image_free(&ui.icons[i]);
        Image img = make_card(w, h);
        if (!img.px)
            continue;
        uint32_t c0 = t->light ? 0xF4F6FA : col_mix(0xFF000000 | t->top, 0xFF000000 | t->glow2, 0.35f);
        uint32_t c1 = t->light ? 0xC9D3E6 : col_mix(0xFF000000 | t->bottom, 0xFF000000 | t->glow1, 0.45f);
        paint_panel(&img, c0, c1);
        float cx = w * 0.5f, cy = h * 0.47f, r = h * 0.34f;
        /* ground shadow, then the orb, then the symbol embossed on it */
        Canvas c;
        canvas_for(&c, &img);
        for (int k = 5; k > 0; k--)
            gfx_disc(&c, cx + k, cy + r * 0.9f + k * 0.5f, r * (0.7f + k * 0.06f), col_alpha(0xFF000000, 0.05f));
        paint_orb(&img, cx, cy, r, t->accent);
        float s = r * 1.05f;
        paint_symbol(&c, i, cx + U(1.5f), cy + U(2), s, col_alpha(0xFF000000, 0.35f));
        paint_symbol(&c, i, cx, cy, s, 0xF2FFFFFF);
        finish_image(&img);
        ui.icons[i] = img;
    }
}

static void initial_of(const char *title, char out[8])
{
    const char *p = title;
    uint32_t cp;
    do {
        cp = utf8_next(&p);
    } while (cp == ' ' || cp == '[' || cp == '(');
    if (cp >= 'a' && cp <= 'z') cp -= 32;
    else if (cp >= 0x430 && cp <= 0x44F) cp -= 0x20;
    else if (cp >= 0x450 && cp <= 0x45F) cp -= 0x50;
    if (!cp)
        cp = '?';
    if (cp < 0x80) {
        out[0] = (char)cp; out[1] = 0;
    } else if (cp < 0x800) {
        out[0] = (char)(0xC0 | cp >> 6); out[1] = (char)(0x80 | (cp & 0x3F)); out[2] = 0;
    } else {
        out[0] = (char)(0xE0 | cp >> 12); out[1] = (char)(0x80 | (cp >> 6 & 0x3F));
        out[2] = (char)(0x80 | (cp & 0x3F)); out[3] = 0;
    }
}

/* Card for an app that has no ICON0: a colour from its name and its initial. */
static Image *fallback_card(int idx)
{
    Image *img = &ui.fallback[idx];
    if (img->px)
        return img;
    int w = (int)U(320), h = (int)U(176);
    *img = make_card(w, h);
    if (!img->px)
        return NULL;
    const App *a = &ui.lib.items[idx];
    uint32_t hsh = 0x9E3779B9u;
    for (const char *p = a->title; *p; p++)
        hsh = hash32(hsh ^ (uint8_t)*p);
    uint32_t c0 = 0xFF000000u | ((hsh & 0x3F3F3F) + 0x101830);
    uint32_t c1 = 0xFF000000u | (((hsh >> 3) & 0x6F6F6F) + 0x202040);
    paint_panel(img, c0, c1);
    Canvas c;
    canvas_for(&c, img);
    char ini[8];
    initial_of(a->title, ini);
    float iw = text_width(FACE_HERO, ini, 0);
    text_draw(&c, FACE_HERO, (w - iw) / 2 + U(3), h * 0.5f + U(24), ini, 0x60000000, 0);
    text_draw(&c, FACE_HERO, (w - iw) / 2, h * 0.5f + U(21), ini, 0xFFFFFFFF, 0);
    finish_image(img);
    return img;
}

/* ---------------------------------------------------------------- text helpers */

static float cap_mid(int face) { return (float)font_face(face)->line_h / 1.25f * 0.36f; }

static int draw_wrapped(Canvas *c, int face, float x, float y, float max_w, float line_h, const char *s,
                        uint32_t col, int max_lines)
{
    char line[256];
    int lines = 0;
    while (*s && lines < max_lines) {
        size_t best = 0, i = 0;
        while (s[i] && i < sizeof line - 1) {
            size_t j = i;
            while (s[j] && s[j] != ' ')
                j++;
            if (j >= sizeof line)
                break;
            memcpy(line, s, j);
            line[j] = 0;
            if (text_width(face, line, 0) > max_w && best)
                break;
            best = j;
            if (!s[j])
                break;
            i = j + 1;
        }
        if (!best)
            best = strlen(s) < sizeof line - 1 ? strlen(s) : sizeof line - 1;
        memcpy(line, s, best);
        line[best] = 0;
        s += best;
        while (*s == ' ')
            s++;
        if (lines == max_lines - 1 && *s) {
            char rest[512];
            snprintf(rest, sizeof rest, "%s %s", line, s);
            text_draw_fit(c, face, x, y + lines * line_h, rest, col, max_w);
        } else {
            text_draw_fit(c, face, x, y + lines * line_h, line, col, max_w);
        }
        lines++;
    }
    return lines;
}

/* ---------------------------------------------------------------- controller glyphs */

enum { GLYPH_CROSS, GLYPH_CIRCLE, GLYPH_TRIANGLE, GLYPH_SQUARE };

static float draw_button(Canvas *c, int glyph, float x, float cy, uint32_t col)
{
    float r = U(8), t = U(1.6f), cx = x + r;
    switch (glyph) {
    case GLYPH_CROSS: {
        float k = r * 0.72f;
        gfx_line(c, cx - k, cy - k, cx + k, cy + k, t, col);
        gfx_line(c, cx - k, cy + k, cx + k, cy - k, t, col);
        break;
    }
    case GLYPH_CIRCLE:
        gfx_ring(c, cx, cy, r * 0.82f, t, col);
        break;
    case GLYPH_TRIANGLE: {
        float h = r * 0.85f;
        float ax = cx, ay = cy - h, bx = cx - h * 1.05f, by = cy + h * 0.72f, ex = cx + h * 1.05f;
        gfx_line(c, ax, ay, bx, by, t, col);
        gfx_line(c, bx, by, ex, by, t, col);
        gfx_line(c, ex, by, ax, ay, t, col);
        break;
    }
    case GLYPH_SQUARE:
        gfx_rrect_stroke(c, cx - r * 0.7f, cy - r * 0.7f, r * 1.4f, r * 1.4f, U(1), t, col);
        break;
    }
    return r * 2;
}

typedef struct { int glyph; const char *label; } Hint;

static int ok_glyph(void) { return plat_ok_is_cross() ? GLYPH_CROSS : GLYPH_CIRCLE; }
static int back_glyph(void) { return plat_ok_is_cross() ? GLYPH_CIRCLE : GLYPH_CROSS; }

static void draw_hints(Canvas *c, const Hint *h, int n, float right, float cy, uint32_t col)
{
    float gap = U(26), w = 0;
    for (int i = 0; i < n; i++)
        w += U(16) + U(8) + text_width(FACE_SMALL, h[i].label, 0) + (i ? gap : 0);
    float x = right - w;
    for (int i = 0; i < n; i++) {
        x += draw_button(c, h[i].glyph, x, cy, col) + U(8);
        x += text_draw(c, FACE_SMALL, x, cy + cap_mid(FACE_SMALL), h[i].label, col, 0) + gap;
    }
}

/* ---------------------------------------------------------------- items */

static int tab_items(int tab)
{
    switch (tab) {
    case TAB_GAMES: return ui.lib.count;
    case TAB_SYSTEM: return SYS_COUNT;
    case TAB_SETTINGS: return SET_COUNT;
    default: return PWR_COUNT;
    }
}

static const Image *item_image(int tab, int i)
{
    static const int sys_ico[SYS_COUNT] = { ICO_CONSOLE, ICO_DISPLAY, ICO_STORAGE, ICO_LIBRARY, ICO_SESSION, ICO_SHELL };
    static const int set_ico[SET_COUNT] = { ICO_THEME, ICO_CLOCK, ICO_TAG, ICO_SOUND, ICO_MUSIC, ICO_MOTION };
    static const int pwr_ico[PWR_COUNT] = { ICO_XMB, ICO_RESTART, ICO_POWER };
    switch (tab) {
    case TAB_GAMES: return ui.lib.items[i].icon.px ? &ui.lib.items[i].icon : fallback_card(i);
    case TAB_SYSTEM: return &ui.icons[sys_ico[i]];
    case TAB_SETTINGS: return &ui.icons[set_ico[i]];
    default: return &ui.icons[pwr_ico[i]];
    }
}

static void fmt_bytes(char *out, size_t cap, uint64_t b)
{
    double gb = (double)b / (1024.0 * 1024.0 * 1024.0);
    if (gb >= 100) snprintf(out, cap, "%.0f GB", gb);
    else if (gb >= 1) snprintf(out, cap, "%.1f GB", gb);
    else snprintf(out, cap, "%.0f MB", (double)b / (1024.0 * 1024.0));
}

/* Title, value and a one-line explanation for the focused item. */
static void item_text(int tab, int i, char *title, size_t tcap, char *value, size_t vcap, const char **note)
{
    value[0] = 0;
    *note = "";
    if (tab == TAB_GAMES) {
        const App *a = &ui.lib.items[i];
        const char *ver = a->version[0] ? a->version : "1.0";
        snprintf(title, tcap, "%s", a->title);
        if (ui.cfg.show_ids)
            snprintf(value, vcap, "%s  \xC2\xB7  v%s", a->title_id, ver);
        else
            snprintf(value, vcap, "v%s", ver);
    } else if (tab == TAB_SYSTEM) {
        static const char *names[SYS_COUNT] = { "Console", "Display", "Storage", "Library", "Session", "Shell" };
        static const char *notes[SYS_COUNT] = {
            "The machine G0THOS is running on.", "The video mode G0THOS draws in.",
            "Space left on the internal hard drive.", "Applications found in /dev_hdd0/game.",
            "Time since G0THOS started.", "This home screen." };
        snprintf(title, tcap, "%s", names[i]);
        *note = notes[i];
        switch (i) {
        case SYS_CONSOLE: snprintf(value, vcap, "PlayStation 3"); break;
        case SYS_DISPLAY: snprintf(value, vcap, "%d \xC3\x97 %d", ui.W, ui.H); break;
        case SYS_STORAGE:
            if (ui.disk_ok) {
                char a[24], t[24];
                fmt_bytes(a, sizeof a, ui.disk_avail);
                fmt_bytes(t, sizeof t, ui.disk_total);
                snprintf(value, vcap, "%s free of %s", a, t);
            } else {
                snprintf(value, vcap, "\xE2\x80\x94");
            }
            break;
        case SYS_TITLES: snprintf(value, vcap, "%d app%s", ui.lib.count, ui.lib.count == 1 ? "" : "s"); break;
        case SYS_SESSION: {
            unsigned m = (unsigned)((plat_usec() - ui.started_us) / 60000000ull);
            if (m < 60) snprintf(value, vcap, "%u min", m);
            else snprintf(value, vcap, "%u h %02u min", m / 60, m % 60);
            break;
        }
        case SYS_SHELL: snprintf(value, vcap, SHELL_NAME " " SHELL_VERSION); break;
        }
    } else if (tab == TAB_SETTINGS) {
        static const char *names[SET_COUNT] = { "Theme", "Clock", "Title IDs", "Sounds", "Ambient music", "Motion" };
        static const char *notes[SET_COUNT] = {
            "Colours, light and background of the whole screen.", "How the time in the corner is written.",
            "Show the title ID next to each game's version.", "Clicks, swooshes and chimes for every action.",
            "A quiet pad playing in the background.", "Reduced turns animations and effects off." };
        snprintf(title, tcap, "%s", names[i]);
        *note = notes[i];
        switch (i) {
        case SET_THEME: snprintf(value, vcap, "%s", theme()->name); break;
        case SET_CLOCK: snprintf(value, vcap, ui.cfg.clock24 ? "24-hour" : "12-hour"); break;
        case SET_IDS: snprintf(value, vcap, ui.cfg.show_ids ? "Shown" : "Hidden"); break;
        case SET_SOUNDS: snprintf(value, vcap, ui.cfg.sounds ? "On" : "Off"); break;
        case SET_MUSIC: snprintf(value, vcap, ui.cfg.music ? "On" : "Off"); break;
        case SET_MOTION: snprintf(value, vcap, ui.cfg.motion ? "Smooth" : "Reduced"); break;
        }
    } else {
        static const char *names[PWR_COUNT] = { "Return to XMB", "Restart", "Power off" };
        static const char *notes[PWR_COUNT] = { "Close G0THOS and go back to the XMB.",
                                                "Restart the console. G0THOS asks first.",
                                                "Turn the console off. G0THOS asks first." };
        snprintf(title, tcap, "%s", names[i]);
        *note = notes[i];
    }
}

/* ---------------------------------------------------------------- drawing */

static void tab_geom(int tab, float *x, float *w)
{
    float pos = U(64);
    for (int i = 0; i < tab; i++)
        pos += text_width(FACE_BODY, TAB_NAMES[i], 0) + U(34);
    *x = pos;
    *w = text_width(FACE_BODY, TAB_NAMES[tab], 0);
}

static void draw_topbar(Canvas *c)
{
    float y = U(54);
    for (int i = 0; i < TAB_COUNT; i++) {
        float x, w;
        tab_geom(i, &x, &w);
        text_draw(c, FACE_BODY, x, y, TAB_NAMES[i], ink(i == ui.tab ? 1.0f : 0.45f), 0);
    }
    gfx_rrect(c, ui.tab_x, y + U(12), ui.tab_w, U(3), U(1.5f), accent());

    struct tm tm;
    plat_localtime(&tm);
    char clock[16];
    if (ui.cfg.clock24) {
        snprintf(clock, sizeof clock, "%02d:%02d", tm.tm_hour, tm.tm_min);
    } else {
        int h = tm.tm_hour % 12;
        snprintf(clock, sizeof clock, "%d:%02d %s", h ? h : 12, tm.tm_min, tm.tm_hour < 12 ? "AM" : "PM");
    }
    float right = ui.W - U(64);
    float cw = text_width(FACE_BODY, clock, 0);
    text_draw(c, FACE_BODY, right - cw, y, clock, ink(0.95f), 0);
    /* a small lit orb, like a profile picture */
    float ox = right - cw - U(30), oy = y - cap_mid(FACE_BODY);
    gfx_disc(c, ox, oy, U(14), col_alpha(accent(), 0.22f));
    gfx_disc(c, ox, oy, U(10), accent());
    gfx_disc(c, ox - U(3), oy - U(3), U(3.5f), col_alpha(0xFFFFFFFF, 0.6f));
}

typedef struct { float x, y, w, h; } Rect;

/* Card geometry: the focused card is larger and the row slides so it stays at the left. */
static Rect card_rect(int i, float hl)
{
    float bw = U(150), bh = U(83), fw = U(250), fh = U(138), gap = U(16);
    float x = 0, xh = 0;
    int kh = (int)floorf(hl);
    for (int k = 0; k < i || k <= kh; k++) {
        float f = clampf(1 - fabsf(k - hl), 0, 1), step = bw + (fw - bw) * f + gap;
        if (k < i) x += step;
        if (k < kh) xh += step;
        else if (k == kh) xh += step * (hl - kh);
    }
    float f = clampf(1 - fabsf(i - hl), 0, 1);
    Rect r = { U(64) + x - xh, U(96), bw + (fw - bw) * f, bh + (fh - bh) * f };
    return r;
}

static void draw_row(Canvas *c, float alpha, float shift)
{
    int tab = ui.tab, n = tab_items(tab);
    if (n == 0) {
        text_draw(c, FACE_TITLE, U(64) + shift, U(170), "No games yet", ink(0.85f * alpha), 0);
        text_draw(c, FACE_SMALL, U(64) + shift, U(204), "Install apps to /dev_hdd0/game, then press Triangle.",
                  ink(0.5f * alpha), 0);
        return;
    }
    float hl = ui.hl[tab];
    int focus = ui.sel[tab];
    /* back to front: other cards first, the focused one last */
    for (int pass = 0; pass < 2; pass++)
        for (int i = 0; i < n; i++) {
            if ((i == focus) != pass)
                continue;
            Rect r = card_rect(i, hl);
            float stagger = ease_back(ui.intro * 1.6f - i * 0.08f);
            r.x += shift + (1 - stagger) * U(420) + ui.bounce * U(18);
            if (r.x > ui.W || r.x + r.w < -U(300))
                continue;
            float f = clampf(1 - fabsf(i - hl), 0, 1);
            float a = alpha * clampf(stagger, 0, 1);
            if (r.x < U(40))
                a *= 0.6f * clampf((r.x + r.w) / (U(40) + r.w), 0, 1);
            float tilt = ui.cfg.motion ? clampf((i - hl) * 0.12f, -0.4f, 0.4f) * (1 - f) : 0;
            const Image *img = item_image(tab, i);
            float radius = U(12);
            if (pass) {
                float breathe = ui.cfg.motion ? 1 + 0.012f * sinf(ui.time * 2.2f) : 1;
                float gw = r.w * breathe, gh = r.h * breathe;
                r.x -= (gw - r.w) / 2; r.y -= (gh - r.h) / 2; r.w = gw; r.h = gh;
                gfx_shadow(c, r.x, r.y, r.w, r.h, radius, U(18), 0.55f * a);
            }
            Blit b = { r.x, r.y, r.w, r.h, tilt, radius, a, pass ? ui.shine : -1, 0.7f + 0.3f * f, 0 };
            if (ui.lite)
                b.shine = -1;
            gfx_image(c, img, &b);
            if (!ui.lite) {
                Blit refl = b;
                refl.reflect = 1;
                refl.shine = -1;
                gfx_image(c, img, &refl);
            }
            if (pass)
                gfx_rrect_stroke(c, r.x - U(4), r.y - U(4), r.w + U(8), r.h + U(8), radius + U(4), U(2.5f),
                                 ink(0.95f * a));
        }
}

static void draw_hero(Canvas *c, float alpha, float shift)
{
    int tab = ui.tab, n = tab_items(tab);
    if (!n)
        return;
    char title[160], value[96];
    const char *note;
    item_text(tab, ui.sel[tab], title, sizeof title, value, sizeof value, &note);
    float x = U(64) + shift * 0.5f, y = U(400);
    float a = alpha * ease_out(ui.intro * 1.3f - 0.3f);

    int lines = draw_wrapped(c, FACE_HERO, x, y, U(780), U(62), title, ink(a), 2);
    y += (lines - 1) * U(62) + U(42);
    if (value[0]) {
        int big = tab != TAB_GAMES;
        text_draw(c, big ? FACE_TITLE : FACE_SMALL, x, y, value, big ? col_alpha(accent(), a) : ink(0.6f * a), 0);
        y += big ? U(34) : U(28);
    }
    if (note[0]) {
        text_draw(c, FACE_SMALL, x, y, note, ink(0.55f * a), 0);
        y += U(24);
    }

    const char *act = tab == TAB_GAMES ? "Play" : tab == TAB_SETTINGS ? "Change" : tab == TAB_POWER ? "Select" : NULL;
    if (!act)
        return;
    y += U(16);
    float bw = text_width(FACE_BODY, act, 0) + U(64), bh = U(48);
    uint32_t fill = theme()->light ? 0xFF14171D : 0xFFF5F6F8;
    uint32_t txt = theme()->light ? 0xFFF5F6F8 : 0xFF14171D;
    if (tab == TAB_POWER && ui.sel[tab] == PWR_OFF) {
        fill = 0xFFE5484D;
        txt = 0xFFFFFFFF;
    }
    float pulse = ui.cfg.motion ? 0.5f + 0.5f * sinf(ui.time * 3) : 0;
    gfx_shadow(c, x, y, bw, bh, bh / 2, U(10), 0.4f * a);
    gfx_rrect(c, x - U(3), y - U(3), bw + U(6), bh + U(6), bh / 2 + U(3), col_alpha(accent(), (0.25f + 0.3f * pulse) * a));
    gfx_rrect(c, x, y, bw, bh, bh / 2, col_alpha(fill, a));
    draw_button(c, ok_glyph(), x + U(20), y + bh / 2, col_alpha(txt, a));
    text_draw(c, FACE_BODY, x + U(46), y + bh / 2 + cap_mid(FACE_BODY), act, col_alpha(txt, a), 0);
    float mx = x + bw + U(16) + bh / 2, my = y + bh / 2;
    gfx_disc(c, mx, my, bh / 2, ink(0.12f * a));
    for (int k = -1; k <= 1; k++)
        gfx_disc(c, mx + k * U(8), my, U(2.5f), ink(0.85f * a));
}

static void draw_particles(Canvas *c)
{
    if (!ui.cfg.motion)
        return;
    uint32_t col = theme()->light ? 0xFFFFFFFF : (0xFF000000u | theme()->accent);
    for (int i = 0; i < PARTICLES; i++) {
        Particle *p = &ui.parts[i];
        float tw = 0.5f + 0.5f * sinf(ui.time * 1.3f + p->phase);
        float x = U(p->x), y = U(p->y);
        if (!ui.lite)
            gfx_disc(c, x, y, U(p->r) * 2.6f, col_alpha(col, 0.06f * tw));
        gfx_disc(c, x, y, U(p->r), col_alpha(0xFFFFFFFF, 0.35f * tw));
    }
}

static void draw_footer(Canvas *c)
{
    float y = ui.H - U(40);
    uint32_t col = ink(0.6f);
    Hint h[3];
    int n = 0;
    switch (ui.tab) {
    case TAB_GAMES:
        if (ui.lib.count) h[n++] = (Hint){ ok_glyph(), "Play" };
        h[n++] = (Hint){ GLYPH_TRIANGLE, "Refresh" };
        break;
    case TAB_SETTINGS:
        h[n++] = (Hint){ GLYPH_SQUARE, "Previous" };
        h[n++] = (Hint){ ok_glyph(), "Change" };
        break;
    case TAB_POWER:
        h[n++] = (Hint){ ok_glyph(), "Select" };
        break;
    }
    text_draw(c, FACE_SMALL, U(64), y + cap_mid(FACE_SMALL), "L1 / R1  Sections", col, 0);
    draw_hints(c, h, n, ui.W - U(64), y, col);
}

static void draw_toast(Canvas *c)
{
    if (ui.toast_t <= 0.01f)
        return;
    float t = ease_out(ui.toast_t);
    float w = text_width(FACE_SMALL, ui.toast, 0) + U(76), h = U(56);
    float x = ui.W - U(48) - w + (1 - t) * U(60), y = U(88);
    uint32_t surf = theme()->light ? 0xFFFFFFFF : 0xFF1C1F27;
    gfx_shadow(c, x, y, w, h, U(14), U(14), 0.5f * t);
    gfx_rrect(c, x, y, w, h, U(14), col_alpha(surf, 0.97f * t));
    gfx_disc(c, x + U(28), y + h / 2, U(9), col_alpha(accent(), t));
    gfx_disc(c, x + U(25), y + h / 2 - U(3), U(3), col_alpha(0xFFFFFFFF, 0.6f * t));
    text_draw(c, FACE_SMALL, x + U(50), y + h / 2 + cap_mid(FACE_SMALL), ui.toast, ink(t), 0);
}

static void draw_modal(Canvas *c)
{
    if (ui.modal_t <= 0.01f)
        return;
    float t = ease_out(ui.modal_t), s = 0.9f + 0.1f * ease_back(ui.modal_t);
    gfx_rect(c, 0, 0, c->w, c->h, col_alpha(0xFF000000, 0.6f * t));
    float w = U(480) * s, h = U(230) * s;
    float x = (ui.W - w) / 2, y = (ui.H - h) / 2;
    uint32_t surf = theme()->light ? 0xFFFFFFFF : 0xFF1C1F27;
    int off = ui.modal == ACT_OFF;
    gfx_shadow(c, x, y, w, h, U(22), U(28), 0.7f * t);
    gfx_rrect(c, x, y, w, h, U(22), col_alpha(surf, t));
    Blit b = { x + U(32), y + U(32), U(96), U(53), 0, U(8), t, -1, 1, 0 };
    gfx_image(c, &ui.icons[off ? ICO_POWER : ICO_RESTART], &b);
    text_draw(c, FACE_TITLE, x + U(146), y + U(70), off ? "Power off?" : "Restart?", ink(t), 0);
    text_draw(c, FACE_SMALL, x + U(32), y + U(130), off ? "The console will turn off now." : "The console will restart now.",
              ink(0.6f * t), 0);
    Hint hints[2] = { { back_glyph(), "Cancel" }, { ok_glyph(), off ? "Power off" : "Restart" } };
    draw_hints(c, hints, 2, x + w - U(32), y + h - U(40), ink(0.85f * t));
}

static void draw_launch(Canvas *c)
{
    if (ui.launch_t <= 0)
        return;
    float t = ease_out(ui.launch_t);
    Rect r = card_rect(ui.pending_app, ui.hl[TAB_GAMES]);
    Blit b = { r.x * (1 - t), r.y * (1 - t), r.w + (ui.W - r.w) * t, r.h + (ui.H - r.h) * t,
               0, U(12) * (1 - t), 1, -1, 1 - 0.3f * t, 0 };
    gfx_image(c, item_image(TAB_GAMES, ui.pending_app), &b);
}

/* Anything that allocates or caches happens here, before the (multi-threaded) render. */
static void prepare_frame(void)
{
    if (ui.backdrop_theme != ui.cfg.theme) {
        build_backdrop();
        build_icons();
        image_free(&ui.hero_prev);
        image_free(&ui.hero);
        ui.hero_for = -2;           /* re-tint the game art for the new theme */
    }
}

/* Draws only the rows inside c's clip rectangle; must not change shared state. */
static void render(Canvas *c)
{
    float drift = ui.cfg.motion ? sinf(ui.time * 0.07f) * 0.5f : 0;
    int px = parallax();
    int ox = (int)clampf(px + drift * px - ui.hl[ui.tab] * U(3), 0, 2 * px);
    int oy = (int)clampf(px * 0.5f + (ui.cfg.motion ? sinf(ui.time * 0.05f) * px * 0.4f : 0), 0, px);
    gfx_backdrop(c, &ui.backdrop, ox, oy, 1);
    if (ui.tab == TAB_GAMES) {
        float ht = ease_out(ui.hero_t);
        if (ui.hero_prev.px)
            gfx_backdrop(c, &ui.hero_prev, ox, oy, 1 - ht);
        if (ui.hero.px)
            gfx_backdrop(c, &ui.hero, ox, oy, ht);
    }
    draw_particles(c);

    float ct = ease_out(ui.tab_t);
    float shift = (1 - ct) * U(60) * (float)ui.tab_dir;
    draw_topbar(c);
    draw_row(c, ct, shift);
    draw_hero(c, ct, shift);
    draw_footer(c);
    draw_launch(c);
    draw_toast(c);
    draw_modal(c);
    if (ui.fade > 0.001f)
        gfx_rect(c, 0, 0, c->w, c->h, col_alpha(0xFF000000, ui.fade));
}

/* The screen is cut into interleaved horizontal bands so both PPU threads get a fair
 * share of the expensive card row and of the cheaper text area. */
#define BANDS 8
static void render_part(int part, void *arg)
{
    Canvas c = *(Canvas *)arg;
    for (int b = part; b < BANDS; b += 2) {
        gfx_clip(&c, 0, c.h * b / BANDS, c.w, c.h * (b + 1) / BANDS);
        render(&c);
    }
}

/* ---------------------------------------------------------------- input */

static void switch_tab(int dir)
{
    int t = ui.tab + dir;
    if (t < 0 || t >= TAB_COUNT) {
        sound_play(SND_EDGE);
        return;
    }
    ui.tab = t;
    ui.tab_t = 0;
    ui.tab_dir = dir;
    ui.shine = 0;
    sound_play(SND_TAB);
}

static void refresh_library(int announce)
{
    char keep[16] = "";
    if (ui.lib.count)
        snprintf(keep, sizeof keep, "%s", ui.lib.items[ui.sel[TAB_GAMES]].title_id);
    for (int i = 0; i < LIB_MAX; i++)
        image_free(&ui.fallback[i]);
    library_scan(&ui.lib, SELF_TITLE_ID);
    ui.sel[TAB_GAMES] = 0;
    for (int i = 0; i < ui.lib.count; i++)
        if (!strcmp(ui.lib.items[i].title_id, keep))
            ui.sel[TAB_GAMES] = i;
    for (int i = 0; i < ui.lib.count; i++)
        if (!ui.lib.items[i].icon.px)
            fallback_card(i);
    ui.hero_for = -2;
    ui.disk_ok = plat_disk_space(&ui.disk_total, &ui.disk_avail) == 0;
    if (announce) {
        char msg[64];
        snprintf(msg, sizeof msg, "%d app%s found", ui.lib.count, ui.lib.count == 1 ? "" : "s");
        toast(msg);
    }
}

static void begin(int action)
{
    ui.pending = action;
    ui.fade_target = 1;
}

static void apply_sound_settings(void) { sound_set_enabled(ui.cfg.sounds, ui.cfg.music); }

static void activate(int dir)
{
    int i = ui.sel[ui.tab];
    switch (ui.tab) {
    case TAB_GAMES:
        if (ui.lib.count && dir > 0) {
            ui.pending_app = i;
            ui.launch_t = 0.001f;
            sound_play(SND_LAUNCH);
            begin(ACT_LAUNCH);
        }
        break;
    case TAB_SETTINGS:
        if (i == SET_THEME) ui.cfg.theme = (ui.cfg.theme + dir + THEME_COUNT) % THEME_COUNT;
        else if (i == SET_CLOCK) ui.cfg.clock24 ^= 1;
        else if (i == SET_IDS) ui.cfg.show_ids ^= 1;
        else if (i == SET_SOUNDS) ui.cfg.sounds ^= 1;
        else if (i == SET_MUSIC) ui.cfg.music ^= 1;
        else if (i == SET_MOTION) ui.cfg.motion ^= 1;
        sound_play(SND_TOGGLE);
        apply_sound_settings();
        config_save(&ui.cfg);
        ui.shine = 0;
        break;
    case TAB_POWER:
        if (dir < 0) break;
        sound_play(SND_OK);
        if (i == PWR_XMB) begin(ACT_QUIT);
        else ui.modal = i == PWR_RESTART ? ACT_REBOOT : ACT_OFF;
        break;
    default:
        if (dir > 0) sound_play(SND_OK);
        break;
    }
}

static void move(int dir)
{
    int n = tab_items(ui.tab), s = ui.sel[ui.tab] + dir;
    if (!n)
        return;
    if (s < 0 || s >= n) {
        ui.bounce = (float)-dir;
        sound_play(SND_EDGE);
        return;
    }
    ui.sel[ui.tab] = s;
    ui.shine = 0;
    ui.settle = 0;
    sound_play(SND_MOVE);
}

static void handle_input(uint32_t pressed, uint32_t repeat)
{
    if (ui.pending)
        return;
    if (ui.modal) {
        if (pressed & BTN_OK) {
            sound_play(SND_OK);
            begin(ui.modal);
            ui.modal = 0;
        } else if (pressed & (BTN_BACK | BTN_START)) {
            sound_play(SND_BACK);
            ui.modal = 0;
        }
        return;
    }
    if (repeat & BTN_RIGHT) move(1);
    if (repeat & BTN_LEFT) move(-1);
    if (repeat & (BTN_R1 | BTN_DOWN)) switch_tab(1);
    if (repeat & (BTN_L1 | BTN_UP)) switch_tab(-1);
    if (pressed & BTN_OK) activate(1);
    if (pressed & BTN_SQUARE) activate(-1);
    if (pressed & BTN_BACK) sound_play(SND_BACK);
    if (pressed & BTN_TRIANGLE && ui.tab == TAB_GAMES) refresh_library(1);
    if (pressed & BTN_START && ui.tab != TAB_POWER) {
        ui.tab_dir = 1;
        ui.tab = TAB_POWER;
        ui.tab_t = 0;
        sound_play(SND_TAB);
    }
}

/* ---------------------------------------------------------------- main loop */

int main(int argc, char **argv)
{
    (void)argc; (void)argv;
    if (plat_init(&ui.W, &ui.H) != 0)
        return 1;
    int scale = ui.H >= 1000 ? 150 : 100;
    ui.S = scale / 100.0f;
    if (font_init(font_bin, (uint32_t)(font_bin_end - font_bin), scale) != 0) {
        plat_exit();
        return 1;
    }
    config_load(&ui.cfg);
    sound_init();
    apply_sound_settings();
    plat_audio_start();
    build_backdrop();
    build_icons();
    ui.started_us = plat_usec();
    refresh_library(0);
    ui.fade = 1;
    ui.tab_t = 1;
    ui.shine = 2;
    tab_geom(0, &ui.tab_x, &ui.tab_w);
    for (int i = 0; i < PARTICLES; i++) {
        uint32_t h = hash32((uint32_t)i * 7919u + 17);
        ui.parts[i] = (Particle){ (float)(h % 1280), (float)((h >> 11) % 720), 1.0f + (float)((h >> 5) % 3) * 0.6f,
                                  6.0f + (float)((h >> 17) % 18), (float)(h % 628) / 100.0f };
    }
    sound_play(SND_STARTUP);

    Canvas canvas = { 0 };
    canvas.w = ui.W;
    canvas.h = ui.H;

    uint32_t prev = 0;
    uint64_t last = plat_usec(), next_repeat[16] = { 0 };

    while (plat_poll()) {
        uint64_t now = plat_usec();
        float dt = clampf((float)(now - last) / 1e6f, 0, 0.05f);
        last = now;
        ui.time += dt;
        /* Below ~45 fps for a few seconds: switch to cheaper effects for good. */
        ui.frame_avg += (dt - ui.frame_avg) * 0.02f;
        if (!ui.lite && ui.time > 4 && ui.frame_avg > 0.022f) {
            ui.lite = 1;
            toast("Lighter effects for smoother motion");
        }

        uint32_t cur = plat_buttons(), pressed = cur & ~prev, repeat = pressed;
        for (int b = 0; b < 10; b++) {           /* auto-repeat for d-pad and L1/R1 */
            uint32_t bit = 1u << b;
            if (b >= 4 && b < 8)
                continue;
            if (pressed & bit) {
                next_repeat[b] = now + 380000;
            } else if (cur & bit && now >= next_repeat[b]) {
                repeat |= bit;
                next_repeat[b] = now + (b < 4 ? 110000 : 260000);
            }
        }
        prev = cur;
        handle_input(pressed, repeat);

        float tx, tw;
        tab_geom(ui.tab, &tx, &tw);
        ui.tab_x = approach(ui.tab_x, tx, dt, 16);
        ui.tab_w = approach(ui.tab_w, tw, dt, 16);
        ui.tab_t = approach(ui.tab_t, 1, dt, 9);
        ui.modal_t = approach(ui.modal_t, ui.modal ? 1.0f : 0.0f, dt, 12);
        ui.fade = approach(ui.fade, ui.fade_target, dt, ui.fade_target > 0 ? (ui.pending == ACT_LAUNCH ? 3.5f : 8) : 4);
        ui.intro = ui.cfg.motion ? clampf(ui.intro + dt * 0.9f, 0, 2) : 2;
        ui.bounce = approach(ui.bounce, 0, dt, 12);
        ui.shine = ui.cfg.motion ? (ui.shine < 2 ? ui.shine + dt * 1.6f : 2) : -1;
        ui.hero_t = approach(ui.hero_t, 1, dt, 5);
        if (ui.launch_t > 0)
            ui.launch_t = ui.cfg.motion ? clampf(ui.launch_t + dt * 1.8f, 0, 1) : 1;
        if (ui.toast_left > 0)
            ui.toast_left -= dt;
        ui.toast_t = approach(ui.toast_t, ui.toast_left > 0 ? 1.0f : 0.0f, dt, 10);
        for (int t = 0; t < TAB_COUNT; t++)
            ui.hl[t] = approach(ui.hl[t], (float)ui.sel[t], dt, 14);
        for (int i = 0; i < PARTICLES; i++) {
            ui.parts[i].y -= ui.parts[i].speed * dt;
            ui.parts[i].x += sinf(ui.time * 0.3f + ui.parts[i].phase) * 4 * dt;
            if (ui.parts[i].y < -10)
                ui.parts[i].y = 730;
        }
        /* load the focused game's art once the focus rests for a moment */
        ui.settle += dt;
        if (ui.tab == TAB_GAMES && ui.settle > 0.22f && ui.hero_for != ui.sel[TAB_GAMES] && ui.lib.count)
            load_hero(ui.sel[TAB_GAMES]);

        if (ui.pending && ui.fade >= 0.995f) {
            int act = ui.pending;
            ui.pending = 0;
            if (act == ACT_QUIT)
                break;
            if (act == ACT_LAUNCH) {
                plat_launch(ui.lib.items[ui.pending_app].eboot);
                char msg[96];
                snprintf(msg, sizeof msg, "Couldn\xE2\x80\x99t start %.60s", ui.lib.items[ui.pending_app].title);
                toast(msg);
                sound_play(SND_ERROR);
                ui.launch_t = 0;
            } else {
                plat_power(act == ACT_REBOOT ? POWER_REBOOT : POWER_OFF);
                toast("The console refused to change power state");
                sound_play(SND_ERROR);
            }
            ui.fade_target = 0;
        }

        canvas.px = plat_backbuffer();
        prepare_frame();
        plat_parallel(render_part, &canvas);
        plat_present();
        if (!ui.cfg.motion)
            usleep(8000);
    }

    plat_exit();
    return 0;
}
