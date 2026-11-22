/* PlayStation 3 backend (PSL1GHT): display, controllers, files, launching, power. */

#include <malloc.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

#include <ppu-lv2.h>
#include <ppu-types.h>
#include <io/pad.h>
#include <lv2/sysfs.h>
#include <rsx/rsx.h>
#include <sys/process.h>
#include <lv2/systime.h>
#include <sys/systime.h>
#include <sysutil/sysutil.h>
#include <sysutil/video.h>

#include "platform.h"

SYS_PROCESS_PARAM(1001, 0x100000);

#define GAMES_DIR "/dev_hdd0/game"
#define CONFIG_PATH "/dev_hdd0/game/MNMA00001/USRDIR/minima.cfg"

#define CB_SIZE 0x100000
#define HOST_SIZE (32 * 1024 * 1024)

#ifndef SYSUTIL_SYSTEMPARAM_ID_ENTER_BUTTON_ASSIGN
#define SYSUTIL_SYSTEMPARAM_ID_ENTER_BUTTON_ASSIGN 0x0112
#endif

static gcmContextData *context;
static void *host_addr;
static u32 *fb[2];
static u32 fb_offset[2];
static int cur_fb, first_flip = 1, width, height;
static uint32_t *back;
static volatile int quit_requested;
static int ok_cross = 1, tz_minutes;
static padData pads[MAX_PADS];

/* lv2 syscall 144: the console's time zone offset in minutes and daylight-saving flag. */
static s32 sys_time_get_timezone(s32 *timezone, s32 *summertime)
{
    lv2syscall2(144, (u64)(uintptr_t)timezone, (u64)(uintptr_t)summertime);
    return_to_user_prog(s32);
}

static void sysutil_cb(u64 status, u64 param, void *user)
{
    (void)param; (void)user;
    if (status == SYSUTIL_EXIT_GAME)
        quit_requested = 1;
}

static void wait_flip(void)
{
    while (gcmGetFlipStatus() != 0)
        usleep(200);
    gcmResetFlipStatus();
}

int plat_init(int *w, int *h)
{
    host_addr = memalign(1024 * 1024, HOST_SIZE);
    if (!host_addr)
        return -1;
#ifdef RSX_INIT_RETURNS_CONTEXT
    context = rsxInit(CB_SIZE, HOST_SIZE, host_addr);   /* older PSL1GHT */
#else
    if (rsxInit(&context, CB_SIZE, HOST_SIZE, host_addr) != 0)
        context = NULL;
#endif
    if (!context)
        return -1;

    videoState state;
    videoResolution res;
    if (videoGetState(0, 0, &state) != 0 || state.state != 0)
        return -1;
    if (videoGetResolution(state.displayMode.resolution, &res) != 0)
        return -1;

    videoConfiguration vcfg;
    memset(&vcfg, 0, sizeof vcfg);
    vcfg.resolution = state.displayMode.resolution;
    vcfg.format = VIDEO_BUFFER_FORMAT_XRGB;
    vcfg.pitch = res.width * 4;
    vcfg.aspect = state.displayMode.aspect;
    if (videoConfigure(0, &vcfg, NULL, 0) != 0)
        return -1;

    width = res.width;
    height = res.height;
    gcmSetFlipMode(GCM_FLIP_VSYNC);
    for (int i = 0; i < 2; i++) {
        fb[i] = rsxMemalign(64, (u32)(width * height * 4));
        if (!fb[i] || rsxAddressToOffset(fb[i], &fb_offset[i]) != 0)
            return -1;
        memset(fb[i], 0, (size_t)width * height * 4);
        gcmSetDisplayBuffer(i, fb_offset[i], width * 4, width, height);
    }
    /* Draw in main memory: reading RSX memory from the PPU is very slow, and blending reads. */
    back = memalign(128, (size_t)width * height * 4);
    if (!back)
        return -1;

    ioPadInit(7);
    sysUtilRegisterCallback(SYSUTIL_EVENT_SLOT0, sysutil_cb, NULL);

#ifdef HAVE_SYSUTIL_SYSPARAM
    s32 v = 1;
    if (sysUtilGetSystemParamInt(SYSUTIL_SYSTEMPARAM_ID_ENTER_BUTTON_ASSIGN, &v) == 0)
        ok_cross = v != 0; /* 0 = circle confirms (Japan), 1 = cross */
#endif
    s32 tz = 0, dst = 0;
    if (sys_time_get_timezone(&tz, &dst) == 0)
        tz_minutes = tz + (dst ? 60 : 0);

    *w = width;
    *h = height;
    return 0;
}

uint32_t *plat_backbuffer(void) { return back; }

void plat_present(void)
{
    if (first_flip) {
        gcmResetFlipStatus();
        first_flip = 0;
    } else {
        wait_flip();
    }
    memcpy(fb[cur_fb], back, (size_t)width * height * 4);
    if (gcmSetFlip(context, cur_fb) == 0) {
        rsxFlushBuffer(context);
        gcmSetWaitFlip(context);
    }
    cur_fb ^= 1;
}

void plat_exit(void)
{
    if (context) {
        if (!first_flip)
            wait_flip();
        rsxFinish(context, 1);
        context = NULL;
    }
    ioPadEnd();
    sysUtilUnregisterCallback(SYSUTIL_EVENT_SLOT0);
}

int plat_poll(void)
{
    sysUtilCheckCallback();
    return !quit_requested;
}

uint32_t plat_buttons(void)
{
    padInfo info;
    uint32_t b = 0;
    if (ioPadGetInfo(&info) != 0)
        return 0;
    for (int i = 0; i < MAX_PADS; i++) {
        if (!info.status[i]) {
            memset(&pads[i], 0, sizeof pads[i]);
            continue;
        }
        padData d;
        /* len == 0 means "no change since last read", so keep the previous state. */
        if (ioPadGetData(i, &d) == 0 && d.len > 0)
            pads[i] = d;
        padData *p = &pads[i];
        if (!p->len)
            continue;
        if (p->BTN_UP || p->ANA_L_V < 40) b |= BTN_UP;
        if (p->BTN_DOWN || p->ANA_L_V > 215) b |= BTN_DOWN;
        if (p->BTN_LEFT || p->ANA_L_H < 40) b |= BTN_LEFT;
        if (p->BTN_RIGHT || p->ANA_L_H > 215) b |= BTN_RIGHT;
        if (p->BTN_CROSS) b |= ok_cross ? BTN_OK : BTN_BACK;
        if (p->BTN_CIRCLE) b |= ok_cross ? BTN_BACK : BTN_OK;
        if (p->BTN_TRIANGLE) b |= BTN_TRIANGLE;
        if (p->BTN_SQUARE) b |= BTN_SQUARE;
        if (p->BTN_L1) b |= BTN_L1;
        if (p->BTN_R1) b |= BTN_R1;
        if (p->BTN_START) b |= BTN_START;
        if (p->BTN_SELECT) b |= BTN_SELECT;
    }
    return b;
}

int plat_ok_is_cross(void) { return ok_cross; }

uint64_t plat_usec(void) { return (uint64_t)sysGetSystemTime(); }

void plat_localtime(struct tm *out)
{
    u64 sec = 0, nsec = 0;
    sysGetCurrentTime(&sec, &nsec);
    time_t t = (time_t)sec + (time_t)tz_minutes * 60;
    gmtime_r(&t, out);
}

int plat_list_dir(const char *dir, void (*fn)(const char *name, void *user), void *user)
{
    s32 fd;
    if (sysFsOpendir(dir, &fd) != 0)
        return -1;
    sysFSDirent ent;
    u64 read = 0;
    while (sysFsReaddir(fd, &ent, &read) == 0 && read > 0) {
        if (!strcmp(ent.d_name, ".") || !strcmp(ent.d_name, ".."))
            continue;
        fn(ent.d_name, user);
    }
    sysFsClosedir(fd);
    return 0;
}

static s32 sys_fs_disk_free(const char *dev, u64 *total, u64 *avail)
{
    lv2syscall3(840, (u64)(uintptr_t)dev, (u64)(uintptr_t)total, (u64)(uintptr_t)avail);
    return_to_user_prog(s32);
}

int plat_disk_space(uint64_t *total, uint64_t *avail)
{
    u64 t = 0, a = 0;
    if (sys_fs_disk_free("/dev_hdd0", &t, &a) != 0 || !t)
        return -1;
    *total = t;
    *avail = a;
    return 0;
}

const char *plat_config_path(void) { return CONFIG_PATH; }
const char *plat_games_dir(void) { return GAMES_DIR; }

void plat_launch(const char *eboot_path)
{
    FILE *f = fopen(eboot_path, "rb");
    if (!f)
        return;
    fclose(f);
    plat_exit();
    sysProcessExitSpawn2(eboot_path, NULL, NULL, NULL, 0, 1001, SYS_PROCESS_SPAWN_STACK_SIZE_1M);
    /* Only reached if the spawn failed; the display is gone, so just leave. */
    exit(0);
}

static s32 sys_sm_shutdown(u16 op)
{
    lv2syscall4(379, (u64)op, 0, 0, 0);
    return_to_user_prog(s32);
}

void plat_power(int op)
{
    /* 0x1100 powers off, 0x1200 is a full restart. */
    sys_sm_shutdown(op == POWER_OFF ? 0x1100 : 0x1200);
}
