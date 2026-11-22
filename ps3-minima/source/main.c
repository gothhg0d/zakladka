/* Minima — a quiet, minimalist home screen for the PlayStation 3. */

#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include "font.h"
#include "gfx.h"
#include "library.h"
#include "platform.h"

#define SHELL_NAME "Minima"
#define SHELL_VERSION "1.0"
#define SELF_TITLE_ID "MNMA00001"

extern const uint8_t font_bin[];
extern const uint8_t font_bin_end[];

/* ---------------------------------------------------------------- palette */

typedef struct { const char *name; uint32_t rgb; } Accent;
static const Accent ACCENTS[] = {
    { "Ice", 0x8AB4F8 }, { "Mint", 0x7EE0B5 }, { "Amber", 0xF2C46D },
    { "Rose", 0xF28B9B }, { "Lilac", 0xB9A3F5 }, { "Mono", 0xE8E8E8 },
};
#define ACCENT_COUNT (int)(sizeof ACCENTS / sizeof ACCENTS[0])

#define C_TEXT 0xFFF2F3F5u
#define C_SURFACE 0xFF1A1D23u

/* ---------------------------------------------------------------- config */

typedef struct { int accent, clock24, show_ids, motion; } Config;

static void config_load(Config *c)
{
    *c = (Config){ 0, 1, 1, 1 };
    FILE *f = fopen(plat_config_path(), "r");
    if (!f)
        return;
    char key[32];
    int v;
    while (fscanf(f, " %31[^=]=%d", key, &v) == 2) {
        if (!strcmp(key, "accent")) c->accent = (v % ACCENT_COUNT + ACCENT_COUNT) % ACCENT_COUNT;
        else if (!strcmp(key, "clock24")) c->clock24 = !!v;
        else if (!strcmp(key, "show_ids")) c->show_ids = !!v;
        else if (!strcmp(key, "motion")) c->motion = !!v;
    }
    fclose(f);
}

static void config_save(const Config *c)
{
    FILE *f = fopen(plat_config_path(), "w");
    if (!f)
        return;
    fprintf(f, "accent=%d\nclock24=%d\nshow_ids=%d\nmotion=%d\n", c->accent, c->clock24, c->show_ids,
            c->motion);
    fclose(f);
}

/* ---------------------------------------------------------------- state */

enum { TAB_LIBRARY, TAB_SYSTEM, TAB_SETTINGS, TAB_POWER, TAB_COUNT };
static const char *TAB_NAMES[TAB_COUNT] = { "Library", "System", "Settings", "Power" };

enum { SET_ACCENT, SET_CLOCK, SET_IDS, SET_MOTION, SET_COUNT };
enum { PWR_XMB, PWR_RESTART, PWR_OFF, PWR_COUNT };
enum { SYS_CONSOLE, SYS_DISPLAY, SYS_STORAGE, SYS_TITLES, SYS_SESSION, SYS_SHELL, SYS_COUNT };
enum { ACT_NONE, ACT_LAUNCH, ACT_REBOOT, ACT_OFF, ACT_QUIT };

typedef struct {
    int W, H;
    float S;                 /* pixels per layout unit (layout is designed at 1280x720) */
    float VW, VH;            /* screen size in layout units */
    uint32_t *bg;            /* pre-rendered backdrop */
    int bg_accent;

    Library lib;
    Config cfg;

    int tab;
    float tab_x, tab_w;      /* animated underline */
    float content_t;         /* 0 -> 1 after a tab switch */
    int content_dir;
    int sel[TAB_COUNT];
    int scroll_target[TAB_COUNT];
    float scroll[TAB_COUNT];
    float hl[TAB_COUNT];     /* animated highlight position, in rows */

    int modal;               /* 0, or ACT_REBOOT / ACT_OFF awaiting confirmation */
    float modal_t;
    float fade, fade_target;
    int pending, pending_app;

    char toast[96];
    float toast_left, toast_t;

    uint64_t started_us;
    uint64_t disk_total, disk_avail;
    int disk_ok;
    float intro;             /* 0 -> 1 on start */
} UI;

static UI ui;

#define U(v) ((v) * ui.S)

static float approach(float v, float target, float dt, float speed)
{
    if (!ui.cfg.motion)
        return target;
    float k = 1.0f - expf(-speed * dt);
    v += (target - v) * k;
    return fabsf(target - v) < 0.0015f ? target : v;
}

static float clampf(float v, float lo, float hi) { return v < lo ? lo : v > hi ? hi : v; }
static float ease_out(float t) { t = clampf(t, 0, 1); return 1 - (1 - t) * (1 - t) * (1 - t); }

static uint32_t accent(void) { return 0xFF000000u | ACCENTS[ui.cfg.accent].rgb; }

static void toast(const char *msg)
{
    snprintf(ui.toast, sizeof ui.toast, "%s", msg);
    ui.toast_left = 2.4f;
}

/* ---------------------------------------------------------------- backdrop */

static uint32_t hash32(uint32_t x)
{
    x ^= x >> 16; x *= 0x7FEB352Du; x ^= x >> 15; x *= 0x846CA68Bu; x ^= x >> 16;
    return x;
}

static void build_backdrop(void)
{
    uint32_t ac = ACCENTS[ui.cfg.accent].rgb;
    float ar = (float)(ac >> 16 & 255), ag = (float)(ac >> 8 & 255), ab = (float)(ac & 255);
    float gx = ui.W * 0.86f, gy = -ui.H * 0.18f, gr = ui.H * 1.05f;
    float hx = ui.W * 0.04f, hy = ui.H * 1.15f, hr = ui.H * 0.8f;
    for (int y = 0; y < ui.H; y++) {
        float t = (float)y / (float)(ui.H - 1);
        float br = 13 + 6 * t, bgc = 15 + 7 * t, bb = 19 + 8 * t;
        for (int x = 0; x < ui.W; x++) {
            float dx = (x - gx) / gr, dy = (y - gy) / gr;
            float d = 1 - sqrtf(dx * dx + dy * dy);
            float g = d > 0 ? d * d * 0.11f : 0;
            dx = (x - hx) / hr; dy = (y - hy) / hr;
            d = 1 - sqrtf(dx * dx + dy * dy);
            g += d > 0 ? d * d * 0.045f : 0;
            float vx = (float)x / ui.W - 0.5f, vy = (float)y / ui.H - 0.5f;
            float vig = 1 - (vx * vx + vy * vy) * 0.28f;
            float n = (float)(hash32((uint32_t)(y * ui.W + x)) & 255) / 255.0f - 0.5f; /* dither */
            float r = (br + (ar - br) * g) * vig + n, gg = (bgc + (ag - bgc) * g) * vig + n,
                  b = (bb + (ab - bb) * g) * vig + n;
            ui.bg[y * ui.W + x] = (uint32_t)clampf(r + 0.5f, 0, 255) << 16 |
                                  (uint32_t)clampf(gg + 0.5f, 0, 255) << 8 | (uint32_t)clampf(b + 0.5f, 0, 255);
        }
    }
    ui.bg_accent = ui.cfg.accent;
}

/* ---------------------------------------------------------------- text helpers */

/* Offset from a line's vertical centre to its baseline, so text sits optically centred. */
static float cap_mid(int face) { return (float)font_face(face)->line_h / 1.25f * 0.365f; }

static void upper_ascii(char *dst, size_t cap, const char *src)
{
    size_t i = 0;
    for (; src[i] && i + 1 < cap; i++)
        dst[i] = (src[i] >= 'a' && src[i] <= 'z') ? (char)(src[i] - 32) : src[i];
    dst[i] = 0;
}

static float caption(Canvas *c, float x, float y, const char *s, uint32_t col)
{
    char buf[96];
    upper_ascii(buf, sizeof buf, s);
    return text_draw(c, FACE_LABEL, x, y, buf, col, U(1.6f));
}

static float caption_width(const char *s)
{
    char buf[96];
    upper_ascii(buf, sizeof buf, s);
    return text_width(FACE_LABEL, buf, U(1.6f));
}

/* Word-wraps s into at most max_lines lines; returns the number of lines drawn. */
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

/* ---------------------------------------------------------------- controller glyphs */

enum { GLYPH_CROSS, GLYPH_CIRCLE, GLYPH_TRIANGLE, GLYPH_SQUARE };

static float draw_button(Canvas *c, int glyph, float x, float cy, uint32_t col)
{
    float r = U(7), t = U(1.5f), cx = x + r;
    switch (glyph) {
    case GLYPH_CROSS: {
        float k = r * 0.78f;
        gfx_line(c, cx - k, cy - k, cx + k, cy + k, t, col);
        gfx_line(c, cx - k, cy + k, cx + k, cy - k, t, col);
        break;
    }
    case GLYPH_CIRCLE:
        gfx_ring(c, cx, cy, r * 0.85f, t, col);
        break;
    case GLYPH_TRIANGLE: {
        float h = r * 0.9f;
        float ax = cx, ay = cy - h, bx = cx - h * 1.05f, by = cy + h * 0.72f, ex = cx + h * 1.05f;
        gfx_line(c, ax, ay, bx, by, t, col);
        gfx_line(c, bx, by, ex, by, t, col);
        gfx_line(c, ex, by, ax, ay, t, col);
        break;
    }
    case GLYPH_SQUARE:
        gfx_rrect_stroke(c, cx - r * 0.72f, cy - r * 0.72f, r * 1.44f, r * 1.44f, U(1), t, col);
        break;
    }
    return r * 2;
}

static float draw_pill(Canvas *c, const char *label, float x, float cy, uint32_t col)
{
    float tw = text_width(FACE_LABEL, label, U(0.5f));
    float w = tw + U(14), h = U(18);
    gfx_rrect_stroke(c, x, cy - h / 2, w, h, h / 2, U(1.2f), col);
    text_draw(c, FACE_LABEL, x + U(7), cy + cap_mid(FACE_LABEL), label, col, U(0.5f));
    return w;
}

typedef struct { int glyph; const char *label; } Hint;

static int ok_glyph(void) { return plat_ok_is_cross() ? GLYPH_CROSS : GLYPH_CIRCLE; }
static int back_glyph(void) { return plat_ok_is_cross() ? GLYPH_CIRCLE : GLYPH_CROSS; }

/* Draws hints right-aligned so the last one ends at right. */
static void draw_hints(Canvas *c, const Hint *h, int n, float right, float cy, uint32_t col)
{
    float gap = U(26), w = 0;
    for (int i = 0; i < n; i++)
        w += U(14) + U(8) + text_width(FACE_SMALL, h[i].label, 0) + (i ? gap : 0);
    float x = right - w;
    for (int i = 0; i < n; i++) {
        x += draw_button(c, h[i].glyph, x, cy, col) + U(8);
        x += text_draw(c, FACE_SMALL, x, cy + cap_mid(FACE_SMALL), h[i].label, col, 0) + gap;
    }
}

/* ---------------------------------------------------------------- rows */

static int tab_rows(int tab)
{
    switch (tab) {
    case TAB_LIBRARY: return ui.lib.count;
    case TAB_SYSTEM: return SYS_COUNT;
    case TAB_SETTINGS: return SET_COUNT;
    default: return PWR_COUNT;
    }
}

static void fmt_bytes(char *out, size_t cap, uint64_t b)
{
    double gb = (double)b / (1024.0 * 1024.0 * 1024.0);
    if (gb >= 100) snprintf(out, cap, "%.0f GB", gb);
    else if (gb >= 1) snprintf(out, cap, "%.1f GB", gb);
    else snprintf(out, cap, "%.0f MB", (double)b / (1024.0 * 1024.0));
}

static void row_text(int tab, int i, char *label, size_t lcap, char *value, size_t cap)
{
    value[0] = 0;
    if (tab == TAB_LIBRARY) {
        snprintf(label, lcap, "%s", ui.lib.items[i].title);
        if (ui.cfg.show_ids)
            snprintf(value, cap, "%s", ui.lib.items[i].title_id);
    } else if (tab == TAB_SYSTEM) {
        static const char *names[SYS_COUNT] = { "Console", "Display", "Storage", "Library", "Session", "Shell" };
        snprintf(label, lcap, "%s", names[i]);
        switch (i) {
        case SYS_CONSOLE: snprintf(value, cap, "PlayStation 3"); break;
        case SYS_DISPLAY: snprintf(value, cap, "%d \xC3\x97 %d", ui.W, ui.H); break;
        case SYS_STORAGE:
            if (ui.disk_ok) {
                char a[24], t[24];
                fmt_bytes(a, sizeof a, ui.disk_avail);
                fmt_bytes(t, sizeof t, ui.disk_total);
                snprintf(value, cap, "%s free of %s", a, t);
            } else {
                snprintf(value, cap, "\xE2\x80\x94");
            }
            break;
        case SYS_TITLES: snprintf(value, cap, "%d title%s", ui.lib.count, ui.lib.count == 1 ? "" : "s"); break;
        case SYS_SESSION: {
            unsigned m = (unsigned)((plat_usec() - ui.started_us) / 60000000ull);
            if (m < 60) snprintf(value, cap, "%u min", m);
            else snprintf(value, cap, "%u h %02u min", m / 60, m % 60);
            break;
        }
        case SYS_SHELL: snprintf(value, cap, SHELL_NAME " " SHELL_VERSION); break;
        }
    } else if (tab == TAB_SETTINGS) {
        static const char *names[SET_COUNT] = { "Accent", "Clock", "Title IDs", "Motion" };
        snprintf(label, lcap, "%s", names[i]);
        switch (i) {
        case SET_ACCENT: snprintf(value, cap, "%s", ACCENTS[ui.cfg.accent].name); break;
        case SET_CLOCK: snprintf(value, cap, ui.cfg.clock24 ? "24-hour" : "12-hour"); break;
        case SET_IDS: snprintf(value, cap, ui.cfg.show_ids ? "Shown" : "Hidden"); break;
        case SET_MOTION: snprintf(value, cap, ui.cfg.motion ? "Smooth" : "Reduced"); break;
        }
    } else {
        static const char *names[PWR_COUNT] = { "Return to XMB", "Restart", "Power off" };
        snprintf(label, lcap, "%s", names[i]);
    }
}

static const char *row_note(int tab, int i)
{
    if (tab == TAB_SETTINGS) {
        static const char *n[SET_COUNT] = {
            "The single colour Minima uses for focus and light.",
            "How the time in the corner is written.",
            "Show the title ID next to every entry in the library.",
            "Reduced turns animations off and moves instantly.",
        };
        return n[i];
    }
    if (tab == TAB_POWER) {
        static const char *n[PWR_COUNT] = {
            "Close Minima and go back to the XMB.",
            "Restart the console. Minima asks before it does.",
            "Turn the console off. Minima asks before it does.",
        };
        return n[i];
    }
    if (tab == TAB_SYSTEM)
        return "A quiet summary of this console.";
    return "";
}

/* ---------------------------------------------------------------- drawing */

static void draw_header(Canvas *c)
{
    float mx = U(96);
    uint32_t dim = col_alpha(C_TEXT, 0.55f);

    gfx_disc(c, mx + U(3), U(68), U(3), accent());
    caption(c, mx + U(16), U(68) + cap_mid(FACE_LABEL), SHELL_NAME, col_alpha(C_TEXT, 0.9f));

    struct tm tm;
    plat_localtime(&tm);
    static const char *days[] = { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
    static const char *months[] = { "January", "February", "March", "April", "May", "June", "July",
                                    "August", "September", "October", "November", "December" };
    char clock[16], suffix[4] = "", date[48];
    if (ui.cfg.clock24) {
        snprintf(clock, sizeof clock, "%02d:%02d", tm.tm_hour, tm.tm_min);
    } else {
        int h = tm.tm_hour % 12;
        snprintf(clock, sizeof clock, "%d:%02d", h ? h : 12, tm.tm_min);
        snprintf(suffix, sizeof suffix, tm.tm_hour < 12 ? "AM" : "PM");
    }
    snprintf(date, sizeof date, "%s, %d %s", days[tm.tm_wday % 7], tm.tm_mday, months[tm.tm_mon % 12]);

    float right = ui.VW * ui.S - mx;
    float sw = suffix[0] ? caption_width(suffix) + U(6) : 0;
    float cw = text_width(FACE_TITLE, clock, 0);
    text_draw(c, FACE_TITLE, right - sw - cw, U(84), clock, C_TEXT, 0);
    if (suffix[0])
        caption(c, right - sw + U(6), U(84), suffix, dim);
    caption(c, right - caption_width(date), U(110), date, dim);
}

static void tab_geom(int tab, float *x, float *w)
{
    float pos = U(96);
    for (int i = 0; i < tab; i++)
        pos += text_width(FACE_BODY, TAB_NAMES[i], 0) + U(36);
    *x = pos;
    *w = text_width(FACE_BODY, TAB_NAMES[tab], 0);
}

static void draw_tabs(Canvas *c)
{
    float y = U(176);
    for (int i = 0; i < TAB_COUNT; i++) {
        float x, w;
        tab_geom(i, &x, &w);
        text_draw(c, FACE_BODY, x, y, TAB_NAMES[i], col_alpha(C_TEXT, i == ui.tab ? 1.0f : 0.38f), 0);
    }
    gfx_rrect(c, ui.tab_x, y + U(14), ui.tab_w, U(2), U(1), accent());
}

static void draw_list(Canvas *c, float list_x, float list_w, float alpha, float shift)
{
    int tab = ui.tab, n = tab_rows(tab);
    float top = U(224), rowh = U(52), bottom = ui.VH * ui.S - U(124);
    float x = list_x + shift;

    if (n == 0) {
        float cy = top + (bottom - top) * 0.38f;
        text_draw(c, FACE_BODY, x, cy, "Nothing here yet", col_alpha(C_TEXT, 0.7f * alpha), 0);
        text_draw(c, FACE_SMALL, x, cy + U(30), "Install homebrew to /dev_hdd0/game, then refresh.",
                  col_alpha(C_TEXT, 0.4f * alpha), 0);
        return;
    }

    gfx_clip(c, 0, (int)top, c->w, (int)bottom);

    /* focus highlight */
    float hy = top + (ui.hl[tab] - ui.scroll[tab]) * rowh;
    gfx_rrect(c, x - U(20), hy + U(4), list_w + U(40), rowh - U(8), U(10), col_alpha(0xFFFFFFFF, 0.045f * alpha));
    gfx_rrect(c, x - U(20), hy + U(16), U(3), rowh - U(32), U(1.5f), col_alpha(accent(), alpha));

    char label[160], value[96];
    int first = (int)floorf(ui.scroll[tab]) - 1, last = first + (int)((bottom - top) / rowh) + 3;
    for (int i = first < 0 ? 0 : first; i < n && i <= last; i++) {
        float y = top + (i - ui.scroll[tab]) * rowh;
        float focus = clampf(1 - fabsf(i - ui.hl[tab]), 0, 1);
        float edge = clampf((y - top + rowh * 0.9f) / (rowh * 0.9f), 0, 1) *
                     clampf((bottom - (y + rowh) + rowh * 0.9f) / (rowh * 0.9f), 0, 1);
        if (i == 0) edge = clampf((bottom - (y + rowh) + rowh) / rowh, 0, 1);
        float a = alpha * edge;
        if (a <= 0.01f)
            continue;
        row_text(tab, i, label, sizeof label, value, sizeof value);
        float base = y + rowh / 2 + cap_mid(FACE_BODY);
        float vw = value[0] ? text_width(FACE_SMALL, value, 0) : 0;
        uint32_t lc = col_alpha(C_TEXT, a * (0.5f + 0.5f * focus));
        if (tab == TAB_POWER && i == PWR_OFF)
            lc = col_alpha(col_mix(C_TEXT, 0xFFF28B8B, focus * 0.7f), a * (0.5f + 0.5f * focus));
        text_draw_fit(c, FACE_BODY, x + focus * U(8), base, label, lc, list_w - vw - U(32) - focus * U(8));
        if (value[0]) {
            uint32_t vc = (tab == TAB_SETTINGS && focus > 0.5f) ? col_alpha(accent(), a)
                                                                 : col_alpha(C_TEXT, a * 0.42f);
            float vy = y + rowh / 2 + cap_mid(FACE_SMALL);
            text_draw(c, FACE_SMALL, x + list_w - vw, vy, value, vc, 0);
            if (tab == TAB_SETTINGS && i == SET_ACCENT)
                gfx_disc(c, x + list_w - vw - U(14), y + rowh / 2, U(4), col_alpha(accent(), a));
        }
    }
    gfx_unclip(c);

    /* thin scroll indicator when the list is longer than the view */
    int visible = (int)((bottom - top) / rowh);
    if (n > visible) {
        float track = bottom - top - U(16), knob = track * visible / n;
        float pos = (track - knob) * clampf(ui.scroll[tab] / (float)(n - visible), 0, 1);
        float sx = x + list_w + U(32);
        gfx_rect(c, (int)sx, (int)(top + U(8)), (int)U(1) > 0 ? (int)U(1) : 1, (int)track, col_alpha(C_TEXT, 0.08f * alpha));
        gfx_rrect(c, sx - U(0.5f), top + U(8) + pos, U(2), knob, U(1), col_alpha(C_TEXT, 0.35f * alpha));
    }
}

static void draw_panel(Canvas *c, float px, float pw, float alpha, float shift)
{
    int tab = ui.tab;
    float x = px + shift, y = U(236);
    uint32_t dim = col_alpha(C_TEXT, 0.45f * alpha), mid = col_alpha(C_TEXT, 0.8f * alpha);

    if (tab == TAB_LIBRARY) {
        if (!ui.lib.count)
            return;
        const App *a = &ui.lib.items[ui.sel[tab]];
        char ini[8];
        initial_of(a->title, ini);
        float r = U(40), cx = x + r, cy = y + r;
        gfx_disc(c, cx, cy, r, col_alpha(0xFFFFFFFF, 0.04f * alpha));
        gfx_ring(c, cx, cy, r, U(1.5f), col_alpha(accent(), alpha));
        float iw = text_width(FACE_TITLE, ini, 0);
        text_draw(c, FACE_TITLE, cx - iw / 2, cy + cap_mid(FACE_TITLE), ini, col_alpha(C_TEXT, alpha), 0);

        float ty = cy + r + U(44);
        int lines = draw_wrapped(c, FACE_BODY, x, ty, pw, U(30), a->title, col_alpha(C_TEXT, alpha), 2);
        float ky = ty + (lines - 1) * U(30) + U(40);
        const char *keys[3] = { "Title ID", "Version", "Folder" };
        const char *vals[3] = { a->title_id[0] ? a->title_id : "\xE2\x80\x94",
                                a->version[0] ? a->version : "\xE2\x80\x94", a->dir };
        for (int i = 0; i < 3; i++) {
            caption(c, x, ky, keys[i], dim);
            text_draw_fit(c, FACE_SMALL, x + U(96), ky + U(1), vals[i], mid, pw - U(96));
            ky += U(26);
        }
        return;
    }

    const char *note = row_note(tab, ui.sel[tab]);
    caption(c, x, y + U(10), TAB_NAMES[tab], col_alpha(accent(), alpha));
    draw_wrapped(c, FACE_SMALL, x, y + U(40), pw, U(24), note, mid, 4);
}

static void draw_footer(Canvas *c)
{
    float mx = U(96), y = ui.VH * ui.S - U(56);
    uint32_t col = col_alpha(C_TEXT, 0.55f);
    gfx_rect(c, (int)mx, (int)(y - U(36)), (int)(ui.VW * ui.S - 2 * mx), 1, col_alpha(C_TEXT, 0.07f));

    float x = mx;
    x += draw_pill(c, "L1", x, y, col) + U(6);
    x += draw_pill(c, "R1", x, y, col) + U(10);
    text_draw(c, FACE_SMALL, x, y + cap_mid(FACE_SMALL), "Sections", col, 0);

    Hint h[3];
    int n = 0;
    switch (ui.tab) {
    case TAB_LIBRARY:
        if (ui.lib.count) h[n++] = (Hint){ ok_glyph(), "Launch" };
        h[n++] = (Hint){ GLYPH_TRIANGLE, "Refresh" };
        break;
    case TAB_SETTINGS:
        h[n++] = (Hint){ GLYPH_SQUARE, "Previous" };
        h[n++] = (Hint){ ok_glyph(), "Change" };
        break;
    case TAB_POWER:
        h[n++] = (Hint){ ok_glyph(), "Select" };
        break;
    default:
        break;
    }
    draw_hints(c, h, n, ui.VW * ui.S - mx, y, col);
}

static void draw_toast(Canvas *c)
{
    if (ui.toast_t <= 0.01f)
        return;
    float t = ease_out(ui.toast_t);
    float tw = text_width(FACE_SMALL, ui.toast, 0);
    float w = tw + U(40), h = U(40);
    float x = (ui.VW * ui.S - w) / 2, y = ui.VH * ui.S - U(150) + (1 - t) * U(10);
    gfx_rrect(c, x, y, w, h, h / 2, col_alpha(C_SURFACE, 0.96f * t));
    gfx_rrect_stroke(c, x, y, w, h, h / 2, U(1), col_alpha(0xFFFFFFFF, 0.07f * t));
    text_draw(c, FACE_SMALL, x + U(20), y + h / 2 + cap_mid(FACE_SMALL), ui.toast, col_alpha(C_TEXT, t), 0);
}

static void draw_modal(Canvas *c)
{
    if (ui.modal_t <= 0.01f)
        return;
    float t = ease_out(ui.modal_t);
    gfx_rect(c, 0, 0, c->w, c->h, col_alpha(0xFF000000, 0.55f * t));
    float w = U(460), h = U(210);
    float x = (ui.VW * ui.S - w) / 2, y = (ui.VH * ui.S - h) / 2 + (1 - t) * U(18);
    gfx_rrect(c, x, y, w, h, U(18), col_alpha(C_SURFACE, t));
    gfx_rrect_stroke(c, x, y, w, h, U(18), U(1), col_alpha(0xFFFFFFFF, 0.07f * t));

    int off = ui.modal == ACT_OFF;
    const char *title = off ? "Power off?" : "Restart?";
    const char *body = off ? "The console will turn off." : "The console will restart now.";
    caption(c, x + U(36), y + U(48), off ? "Power" : "Restart", col_alpha(off ? 0xFFF28B8B : accent(), t));
    text_draw(c, FACE_TITLE, x + U(34), y + U(98), title, col_alpha(C_TEXT, t), 0);
    text_draw(c, FACE_SMALL, x + U(36), y + U(130), body, col_alpha(C_TEXT, 0.55f * t), 0);
    Hint hints[2] = { { back_glyph(), "Cancel" }, { ok_glyph(), off ? "Power off" : "Restart" } };
    draw_hints(c, hints, 2, x + w - U(36), y + h - U(36), col_alpha(C_TEXT, 0.75f * t));
}

static void render(Canvas *c)
{
    if (ui.bg_accent != ui.cfg.accent)
        build_backdrop();
    memcpy(c->px, ui.bg, (size_t)ui.W * ui.H * 4);

    float intro = ease_out(ui.intro);
    draw_header(c);
    draw_tabs(c);

    float ct = ease_out(ui.content_t);
    float alpha = ct * intro, shift = (1 - ct) * U(28) * (float)ui.content_dir + (1 - intro) * U(20);
    float panel_w = U(330), panel_x = ui.VW * ui.S - U(96) - panel_w;
    float list_x = U(96) + U(20), list_w = panel_x - list_x - U(84);
    draw_list(c, list_x, list_w, alpha, shift);
    draw_panel(c, panel_x, panel_w, alpha, shift * 0.6f);
    draw_footer(c);
    draw_toast(c);
    draw_modal(c);

    if (ui.fade > 0.001f)
        gfx_rect(c, 0, 0, c->w, c->h, col_alpha(0xFF000000, ui.fade));
}

/* ---------------------------------------------------------------- input */

static void clamp_scroll(int tab)
{
    int n = tab_rows(tab), visible = (int)((ui.VH - 124 - 224) / 52);
    int s = ui.scroll_target[tab];
    if (ui.sel[tab] < s + 1) s = ui.sel[tab] - 1;
    if (ui.sel[tab] > s + visible - 2) s = ui.sel[tab] - visible + 2;
    if (s > n - visible) s = n - visible;
    if (s < 0) s = 0;
    ui.scroll_target[tab] = s;
}

static void switch_tab(int dir)
{
    ui.tab = (ui.tab + dir + TAB_COUNT) % TAB_COUNT;
    ui.content_t = 0;
    ui.content_dir = dir;
}

static void refresh_library(int announce)
{
    char keep[16] = "";
    if (ui.lib.count)
        snprintf(keep, sizeof keep, "%s", ui.lib.items[ui.sel[TAB_LIBRARY]].title_id);
    library_scan(&ui.lib, SELF_TITLE_ID);
    ui.sel[TAB_LIBRARY] = 0;
    for (int i = 0; i < ui.lib.count; i++)
        if (!strcmp(ui.lib.items[i].title_id, keep))
            ui.sel[TAB_LIBRARY] = i;
    clamp_scroll(TAB_LIBRARY);
    ui.disk_ok = plat_disk_space(&ui.disk_total, &ui.disk_avail) == 0;
    if (announce) {
        char msg[64];
        snprintf(msg, sizeof msg, "%d title%s found", ui.lib.count, ui.lib.count == 1 ? "" : "s");
        toast(msg);
    }
}

static void begin(int action)
{
    ui.pending = action;
    ui.fade_target = 1;
}

static void activate(int dir)
{
    int i = ui.sel[ui.tab];
    switch (ui.tab) {
    case TAB_LIBRARY:
        if (ui.lib.count && dir > 0) {
            ui.pending_app = i;
            begin(ACT_LAUNCH);
        }
        break;
    case TAB_SETTINGS:
        if (i == SET_ACCENT) ui.cfg.accent = (ui.cfg.accent + dir + ACCENT_COUNT) % ACCENT_COUNT;
        else if (i == SET_CLOCK) ui.cfg.clock24 ^= 1;
        else if (i == SET_IDS) ui.cfg.show_ids ^= 1;
        else if (i == SET_MOTION) ui.cfg.motion ^= 1;
        config_save(&ui.cfg);
        break;
    case TAB_POWER:
        if (dir < 0) break;
        if (i == PWR_XMB) begin(ACT_QUIT);
        else ui.modal = i == PWR_RESTART ? ACT_REBOOT : ACT_OFF;
        break;
    }
}

static void handle_input(uint32_t pressed, uint32_t repeat)
{
    if (ui.pending)
        return;
    if (ui.modal) {
        if (pressed & BTN_OK) {
            begin(ui.modal);
            ui.modal = 0;
        } else if (pressed & (BTN_BACK | BTN_START)) {
            ui.modal = 0;
        }
        return;
    }
    int n = tab_rows(ui.tab);
    if (repeat & BTN_DOWN && n) ui.sel[ui.tab] = (ui.sel[ui.tab] + 1) % n;
    if (repeat & BTN_UP && n) ui.sel[ui.tab] = (ui.sel[ui.tab] - 1 + n) % n;
    if (repeat & (BTN_RIGHT | BTN_R1)) switch_tab(1);
    if (repeat & (BTN_LEFT | BTN_L1)) switch_tab(-1);
    if (pressed & BTN_OK) activate(1);
    if (pressed & BTN_SQUARE) activate(-1);
    if (pressed & BTN_TRIANGLE && ui.tab == TAB_LIBRARY) refresh_library(1);
    if (pressed & BTN_START && ui.tab != TAB_POWER) {
        switch_tab(TAB_POWER - ui.tab > 0 ? 1 : -1);
        ui.tab = TAB_POWER;
    }
    clamp_scroll(ui.tab);
}

/* ---------------------------------------------------------------- main loop */

int main(int argc, char **argv)
{
    (void)argc; (void)argv;
    if (plat_init(&ui.W, &ui.H) != 0)
        return 1;
    int scale = ui.H >= 1000 ? 150 : 100;
    ui.S = scale / 100.0f;
    ui.VW = ui.W / ui.S;
    ui.VH = ui.H / ui.S;
    if (font_init(font_bin, (uint32_t)(font_bin_end - font_bin), scale) != 0) {
        plat_exit();
        return 1;
    }
    ui.bg = malloc((size_t)ui.W * ui.H * 4);
    if (!ui.bg) {
        plat_exit();
        return 1;
    }
    config_load(&ui.cfg);
    build_backdrop();
    ui.started_us = plat_usec();
    refresh_library(0);
    ui.fade = 1;
    ui.content_t = 1;
    tab_geom(0, &ui.tab_x, &ui.tab_w);

    Canvas canvas = { 0 };
    canvas.w = ui.W;
    canvas.h = ui.H;

    uint32_t prev = 0;
    uint64_t last = plat_usec(), next_repeat[16] = { 0 };
    int last_minute = -1, frames_clean = 0;

    while (plat_poll()) {
        uint64_t now = plat_usec();
        float dt = clampf((float)(now - last) / 1e6f, 0, 0.05f);
        last = now;

        uint32_t cur = plat_buttons(), pressed = cur & ~prev, repeat = pressed;
        for (int b = 0; b < 4; b++) {             /* directional auto-repeat */
            uint32_t bit = 1u << b;
            if (pressed & bit) {
                next_repeat[b] = now + 380000;
            } else if (cur & bit && now >= next_repeat[b]) {
                repeat |= bit;
                next_repeat[b] = now + 85000;
            }
        }
        for (int b = 8; b < 10; b++) {            /* L1 / R1 repeat slower */
            uint32_t bit = 1u << b;
            if (pressed & bit) next_repeat[b] = now + 450000;
            else if (cur & bit && now >= next_repeat[b]) { repeat |= bit; next_repeat[b] = now + 220000; }
        }
        prev = cur;
        handle_input(pressed, repeat);

        /* animate */
        float tx, tw;
        tab_geom(ui.tab, &tx, &tw);
        float before = ui.tab_x + ui.tab_w + ui.content_t + ui.modal_t + ui.fade + ui.toast_t + ui.intro;
        for (int t = 0; t < TAB_COUNT; t++)
            before += ui.scroll[t] + ui.hl[t];
        ui.tab_x = approach(ui.tab_x, tx, dt, 16);
        ui.tab_w = approach(ui.tab_w, tw, dt, 16);
        ui.content_t = approach(ui.content_t, 1, dt, 10);
        ui.modal_t = approach(ui.modal_t, ui.modal ? 1.0f : 0.0f, dt, 14);
        ui.fade = approach(ui.fade, ui.fade_target, dt, ui.fade_target > 0 ? 9 : 6);
        ui.intro = approach(ui.intro, 1, dt, 5);
        if (ui.toast_left > 0) ui.toast_left -= dt;
        ui.toast_t = approach(ui.toast_t, ui.toast_left > 0 ? 1.0f : 0.0f, dt, 12);
        for (int t = 0; t < TAB_COUNT; t++) {
            ui.scroll[t] = approach(ui.scroll[t], (float)ui.scroll_target[t], dt, 14);
            ui.hl[t] = approach(ui.hl[t], (float)ui.sel[t], dt, 20);
        }
        float after = ui.tab_x + ui.tab_w + ui.content_t + ui.modal_t + ui.fade + ui.toast_t + ui.intro;
        for (int t = 0; t < TAB_COUNT; t++)
            after += ui.scroll[t] + ui.hl[t];

        /* actions waiting on the fade to black */
        if (ui.pending && ui.fade >= 0.995f) {
            int act = ui.pending;
            ui.pending = 0;
            if (act == ACT_QUIT)
                break;
            render(&(Canvas){ plat_backbuffer(), ui.W, ui.H, 0, 0, ui.W, ui.H });
            plat_present();
            if (act == ACT_LAUNCH) {
                plat_launch(ui.lib.items[ui.pending_app].eboot);
                char msg[96];
                snprintf(msg, sizeof msg, "Couldn\xE2\x80\x99t start %.60s", ui.lib.items[ui.pending_app].title);
                toast(msg);
            } else {
                plat_power(act == ACT_REBOOT ? POWER_REBOOT : POWER_OFF);
                toast("The console refused to change power state");
            }
            ui.fade_target = 0;
        }

        struct tm tm;
        plat_localtime(&tm);
        int minute = tm.tm_hour * 60 + tm.tm_min;
        int dirty = pressed || repeat || after != before || minute != last_minute;
        last_minute = minute;
        /* Render twice after the scene settles so both display buffers hold the final frame. */
        frames_clean = dirty ? 0 : frames_clean + 1;
        if (frames_clean < 2) {
            canvas.px = plat_backbuffer();
            gfx_unclip(&canvas);
            render(&canvas);
            plat_present();
        } else {
            usleep(16000);
        }
    }

    plat_exit();
    return 0;
}
