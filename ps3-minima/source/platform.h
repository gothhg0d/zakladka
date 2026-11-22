#ifndef MINIMA_PLATFORM_H
#define MINIMA_PLATFORM_H

/* Everything the shell needs from the console. platform_ps3.c implements it with PSL1GHT;
 * sim/sim.c implements it on a desktop so the UI can be rendered and tested anywhere. */

#include <stdint.h>
#include <time.h>

enum {
    BTN_UP = 1 << 0, BTN_DOWN = 1 << 1, BTN_LEFT = 1 << 2, BTN_RIGHT = 1 << 3,
    BTN_OK = 1 << 4,     /* cross or circle, following the console's enter-button setting */
    BTN_BACK = 1 << 5,
    BTN_TRIANGLE = 1 << 6, BTN_SQUARE = 1 << 7,
    BTN_L1 = 1 << 8, BTN_R1 = 1 << 9, BTN_START = 1 << 10, BTN_SELECT = 1 << 11,
};

enum { POWER_REBOOT, POWER_OFF };

int plat_init(int *w, int *h);
uint32_t *plat_backbuffer(void);   /* w*h 0x00RRGGBB pixels in main memory */
void plat_present(void);
void plat_exit(void);

int plat_poll(void);               /* handles system events; returns 0 when asked to quit */
uint32_t plat_buttons(void);       /* currently held BTN_* */
int plat_ok_is_cross(void);
uint64_t plat_usec(void);          /* monotonic microseconds */
void plat_localtime(struct tm *out);

/* Calls fn for every entry name in dir (no "." or ".."). Returns -1 if dir can't be opened. */
int plat_list_dir(const char *dir, void (*fn)(const char *name, void *user), void *user);
int plat_disk_space(uint64_t *total, uint64_t *avail);
const char *plat_config_path(void);
const char *plat_games_dir(void);

/* Exits the shell and starts the given EBOOT.BIN. Returns only on failure. */
void plat_launch(const char *eboot_path);
void plat_power(int op);

#endif
