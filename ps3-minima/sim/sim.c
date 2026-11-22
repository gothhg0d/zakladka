/* Desktop stand-in for platform_ps3.c: renders Minima headless and writes screenshots.
 *
 *   sim [-r 1280x720] [-g games_dir] [-o out_prefix] SCRIPT
 *
 * SCRIPT is a comma-separated list of steps run one per frame block:
 *   U D L R X O T S L1 R1 ST   press a button for one frame
 *   wN                         wait N frames
 *   shot                       write <prefix>NN.ppm
 */

#include <dirent.h>
#include <png.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/time.h>
#include <time.h>

#include "../source/platform.h"

__asm__(".section .rodata\n"
        ".global font_bin\n.global font_bin_end\n"
        ".balign 64\nfont_bin:\n.incbin \"" FONT_PATH "\"\nfont_bin_end:\n"
        ".previous\n");

static int W = 1280, H = 720;
static uint32_t *fb;
static const char *games = "mock/game", *prefix = "shot";
static char script[4096];
static char *cursor;
static int wait_frames, shots, frame;
static uint32_t held;
static uint64_t fake_clock;

int plat_init(int *w, int *h)
{
    fb = calloc((size_t)W * H, 4);
    *w = W;
    *h = H;
    return fb ? 0 : -1;
}

uint32_t *plat_backbuffer(void) { return fb; }

static void write_shot(void)
{
    char path[512];
    snprintf(path, sizeof path, "%s%02d.ppm", prefix, shots++);
    FILE *f = fopen(path, "wb");
    if (!f) return;
    fprintf(f, "P6\n%d %d\n255\n", W, H);
    for (int i = 0; i < W * H; i++) {
        unsigned char px[3] = { fb[i] >> 16 & 255, fb[i] >> 8 & 255, fb[i] & 255 };
        fwrite(px, 1, 3, f);
    }
    fclose(f);
    printf("wrote %s (frame %d)\n", path, frame);
}

void plat_present(void) {}
void plat_exit(void) { free(fb); }

int plat_poll(void)
{
    static const struct { const char *n; uint32_t b; } map[] = {
        { "U", BTN_UP }, { "D", BTN_DOWN }, { "L", BTN_LEFT }, { "R", BTN_RIGHT },
        { "X", BTN_OK }, { "O", BTN_BACK }, { "T", BTN_TRIANGLE }, { "S", BTN_SQUARE },
        { "L1", BTN_L1 }, { "R1", BTN_R1 }, { "ST", BTN_START },
    };
    frame++;
    fake_clock += 16667;
    held = 0;
    if (wait_frames > 0) {
        wait_frames--;
        return 1;
    }
    while (*cursor) {
        char tok[16];
        int n = 0;
        while (*cursor && *cursor != ',' && n < 15) tok[n++] = *cursor++;
        tok[n] = 0;
        if (*cursor == ',') cursor++;
        if (tok[0] == 'w') { wait_frames = atoi(tok + 1) - 1; return 1; }
        if (!strcmp(tok, "shot")) { write_shot(); continue; }
        for (size_t i = 0; i < sizeof map / sizeof map[0]; i++)
            if (!strcmp(tok, map[i].n)) held = map[i].b;
        wait_frames = 1; /* release before the next step, so repeats count as new presses */
        return 1;
    }
    return 0;
}

uint32_t plat_buttons(void) { return held; }
int plat_ok_is_cross(void) { return 1; }
uint64_t plat_usec(void) { return fake_clock; }

void plat_localtime(struct tm *out)
{
    memset(out, 0, sizeof *out);
    out->tm_hour = 21; out->tm_min = 47; out->tm_mday = 22; out->tm_mon = 10; out->tm_wday = 0;
    out->tm_year = 126;
}

int plat_list_dir(const char *dir, void (*fn)(const char *, void *), void *user)
{
    DIR *d = opendir(dir);
    if (!d) return -1;
    struct dirent *e;
    while ((e = readdir(d)))
        if (strcmp(e->d_name, ".") && strcmp(e->d_name, ".."))
            fn(e->d_name, user);
    closedir(d);
    return 0;
}

int plat_disk_space(uint64_t *total, uint64_t *avail)
{
    *total = 298ull << 30;
    *avail = 117ull << 30;
    return 0;
}

const char *plat_config_path(void) { return "sim-minima.cfg"; }
const char *plat_games_dir(void) { return games; }
void plat_launch(const char *p) { printf("launch %s\n", p); }
void plat_power(int op) { printf("power %d\n", op); }
void plat_audio_start(void) {}

uint32_t *plat_load_png(const char *path, int *w, int *h)
{
    png_image im;
    memset(&im, 0, sizeof im);
    im.version = PNG_IMAGE_VERSION;
    if (!png_image_begin_read_from_file(&im, path))
        return NULL;
    im.format = PNG_FORMAT_BGRA; /* little-endian bytes B,G,R,A == 0xAARRGGBB as uint32 */
    uint32_t *px = malloc(PNG_IMAGE_SIZE(im));
    if (!px || !png_image_finish_read(&im, NULL, px, 0, NULL)) {
        free(px);
        png_image_free(&im);
        return NULL;
    }
    *w = (int)im.width;
    *h = (int)im.height;
    return px;
}

int sim_main(int argc, char **argv);

int main(int argc, char **argv)
{
    int i = 1;
    for (; i + 1 < argc && argv[i][0] == '-'; i += 2) {
        if (!strcmp(argv[i], "-r")) sscanf(argv[i + 1], "%dx%d", &W, &H);
        else if (!strcmp(argv[i], "-g")) games = argv[i + 1];
        else if (!strcmp(argv[i], "-o")) prefix = argv[i + 1];
    }
    snprintf(script, sizeof script, "%s", i < argc ? argv[i] : "w60,shot");
    cursor = script;
    remove(plat_config_path());
    return sim_main(argc, argv);
}
