#ifndef MINIMA_LIBRARY_H
#define MINIMA_LIBRARY_H

#include "gfx.h"

#define LIB_MAX 512

typedef struct {
    char title[128];
    char title_id[16];
    char version[8];
    char category[4];
    char dir[64];            /* folder name under the games dir */
    char eboot[256];
    char pic1[256];          /* full-screen background art, may not exist */
    Image icon;              /* ICON0.PNG, px == NULL if missing */
} App;

typedef struct {
    App items[LIB_MAX];
    int count;
} Library;

/* Reads TITLE, TITLE_ID, APP_VER, CATEGORY from a PARAM.SFO. Returns 0 on success. */
int sfo_read(const char *path, App *out);

/* Scans the games dir for launchable titles (USRDIR/EBOOT.BIN present), sorted by title. */
void library_scan(Library *lib, const char *skip_title_id);

#endif
