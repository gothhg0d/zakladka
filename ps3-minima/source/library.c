#include "library.h"
#include "platform.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>

static uint32_t le16(const uint8_t *p) { return (uint32_t)p[0] | (uint32_t)p[1] << 8; }
static uint32_t le32(const uint8_t *p) { return le16(p) | le16(p + 2) << 16; }

static void copy_str(char *dst, size_t cap, const uint8_t *src, size_t len)
{
    size_t n = 0;
    while (n < len && n + 1 < cap && src[n])
        n++;
    memcpy(dst, src, n);
    dst[n] = 0;
    /* Titles sometimes carry line breaks; keep the row to one line. */
    for (size_t i = 0; i < n; i++)
        if (dst[i] == '\n' || dst[i] == '\r')
            dst[i] = ' ';
}

int sfo_read(const char *path, App *out)
{
    FILE *f = fopen(path, "rb");
    if (!f)
        return -1;
    uint8_t buf[16384];
    size_t n = fread(buf, 1, sizeof buf, f);
    fclose(f);
    if (n < 20 || memcmp(buf, "\0PSF", 4) != 0)
        return -1;

    uint32_t keys = le32(buf + 8), data = le32(buf + 12), count = le32(buf + 16);
    if (keys >= n || data >= n || 20 + count * 16 > n)
        return -1;
    for (uint32_t i = 0; i < count; i++) {
        const uint8_t *e = buf + 20 + i * 16;
        uint32_t koff = keys + le16(e), fmt = le16(e + 2), len = le32(e + 4), doff = data + le32(e + 12);
        if (koff >= n || doff + len > n || fmt == 0x0404)
            continue;
        const char *key = (const char *)buf + koff;
        if (memchr(key, 0, n - koff) == NULL)
            continue;
        const uint8_t *v = buf + doff;
        if (!strcmp(key, "TITLE"))
            copy_str(out->title, sizeof out->title, v, len);
        else if (!strcmp(key, "TITLE_ID"))
            copy_str(out->title_id, sizeof out->title_id, v, len);
        else if (!strcmp(key, "APP_VER") || (!strcmp(key, "VERSION") && !out->version[0]))
            copy_str(out->version, sizeof out->version, v, len);
        else if (!strcmp(key, "CATEGORY"))
            copy_str(out->category, sizeof out->category, v, len);
    }
    return out->title[0] ? 0 : -1;
}

typedef struct {
    Library *lib;
    const char *skip;
} ScanCtx;

static int file_exists(const char *path)
{
    FILE *f = fopen(path, "rb");
    if (!f)
        return 0;
    fclose(f);
    return 1;
}

static void on_entry(const char *name, void *user)
{
    ScanCtx *ctx = user;
    Library *lib = ctx->lib;
    if (lib->count >= LIB_MAX || strlen(name) >= sizeof lib->items[0].dir)
        return;
    App *a = &lib->items[lib->count];
    memset(a, 0, sizeof *a);
    char path[320];
    snprintf(path, sizeof path, "%s/%s/PARAM.SFO", plat_games_dir(), name);
    if (sfo_read(path, a) != 0)
        return;
    /* Game data, patches and save-like entries have no EBOOT of their own. */
    if (a->category[0] && strcmp(a->category, "HG") != 0)
        return;
    if (ctx->skip && !strcmp(a->title_id, ctx->skip))
        return;
    snprintf(a->eboot, sizeof a->eboot, "%s/%s/USRDIR/EBOOT.BIN", plat_games_dir(), name);
    if (!file_exists(a->eboot))
        return;
    strcpy(a->dir, name);
    lib->count++;
}

static int by_title(const void *x, const void *y)
{
    const App *a = x, *b = y;
    int r = strcasecmp(a->title, b->title);
    return r ? r : strcmp(a->title_id, b->title_id);
}

void library_scan(Library *lib, const char *skip_title_id)
{
    ScanCtx ctx = { lib, skip_title_id };
    lib->count = 0;
    plat_list_dir(plat_games_dir(), on_entry, &ctx);
    qsort(lib->items, (size_t)lib->count, sizeof(App), by_title);
}
