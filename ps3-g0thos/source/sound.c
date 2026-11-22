#include "sound.h"

#include <math.h>
#include <stdlib.h>
#include <string.h>

#define PI 3.14159265f
#define VOICES 8

typedef struct { float *data; int len; } Clip;
typedef struct { volatile int clip; volatile int pos; } Voice;

static Clip clips[SND_COUNT];
static Voice voices[VOICES];
static volatile int fx_on = 1, amb_on = 1;
static volatile unsigned queue[16];
static volatile unsigned q_head, q_tail;
static float amb_phase[4], amb_t, amb_gain;
static unsigned noise_state = 0x1234567u;

static float noise(void)
{
    noise_state = noise_state * 1664525u + 1013904223u;
    return (float)(noise_state >> 9) / 4194304.0f - 1.0f;
}

static float *alloc_clip(int id, float seconds)
{
    clips[id].len = (int)(seconds * SOUND_RATE);
    clips[id].data = calloc((size_t)clips[id].len, sizeof(float));
    return clips[id].data;
}

/* A bell-ish tone: fundamental plus soft overtones, exponential decay. */
static void add_tone(float *d, int len, float start, float f0, float f1, float amp, float decay, float attack)
{
    int s0 = (int)(start * SOUND_RATE);
    float ph = 0;
    for (int i = s0; i < len; i++) {
        float t = (float)(i - s0) / SOUND_RATE, k = (float)(i - s0) / (float)(len - s0);
        float f = f0 + (f1 - f0) * k;
        ph += 2 * PI * f / SOUND_RATE;
        float env = expf(-t * decay) * (attack > 0 ? 1 - expf(-t / attack) : 1);
        d[i] += amp * env * (sinf(ph) + 0.25f * sinf(2 * ph) + 0.08f * sinf(3 * ph));
    }
}

static void add_noise(float *d, int len, float amp, float f_lo, float f_hi)
{
    /* swept one-pole band of noise: a soft "whoosh" */
    float lp = 0, hp = 0;
    for (int i = 0; i < len; i++) {
        float k = (float)i / len, f = f_lo + (f_hi - f_lo) * k;
        float a = 1 - expf(-2 * PI * f / SOUND_RATE);
        lp += (noise() - lp) * a;
        hp += (lp - hp) * 0.02f;
        float env = sinf(PI * k);
        d[i] += amp * env * env * (lp - hp);
    }
}

void sound_init(void)
{
    float *d;
    d = alloc_clip(SND_MOVE, 0.06f);    add_tone(d, clips[SND_MOVE].len, 0, 2100, 1900, 0.16f, 70, 0.0008f);
    d = alloc_clip(SND_EDGE, 0.12f);    add_tone(d, clips[SND_EDGE].len, 0, 320, 260, 0.22f, 35, 0.001f);
    d = alloc_clip(SND_TAB, 0.16f);     add_tone(d, clips[SND_TAB].len, 0, 900, 1250, 0.12f, 22, 0.002f);
                                        add_noise(d, clips[SND_TAB].len, 0.10f, 800, 3000);
    d = alloc_clip(SND_OK, 0.45f);      add_tone(d, clips[SND_OK].len, 0, 880, 880, 0.14f, 9, 0.002f);
                                        add_tone(d, clips[SND_OK].len, 0.05f, 1320, 1320, 0.11f, 9, 0.002f);
    d = alloc_clip(SND_BACK, 0.2f);     add_tone(d, clips[SND_BACK].len, 0, 760, 520, 0.14f, 18, 0.002f);
    d = alloc_clip(SND_TOGGLE, 0.1f);   add_tone(d, clips[SND_TOGGLE].len, 0, 1500, 1500, 0.12f, 40, 0.001f);
                                        add_tone(d, clips[SND_TOGGLE].len, 0.03f, 2250, 2250, 0.08f, 40, 0.001f);
    d = alloc_clip(SND_OPEN, 0.3f);     add_noise(d, clips[SND_OPEN].len, 0.16f, 400, 2500);
                                        add_tone(d, clips[SND_OPEN].len, 0.04f, 660, 990, 0.08f, 12, 0.004f);
    d = alloc_clip(SND_ERROR, 0.32f);   add_tone(d, clips[SND_ERROR].len, 0, 220, 210, 0.2f, 14, 0.002f);
                                        add_tone(d, clips[SND_ERROR].len, 0.13f, 196, 190, 0.2f, 14, 0.002f);
    d = alloc_clip(SND_LAUNCH, 1.2f);   add_noise(d, clips[SND_LAUNCH].len, 0.28f, 200, 6000);
                                        add_tone(d, clips[SND_LAUNCH].len, 0.25f, 523, 523, 0.10f, 3, 0.05f);
                                        add_tone(d, clips[SND_LAUNCH].len, 0.32f, 784, 784, 0.08f, 3, 0.05f);
                                        add_tone(d, clips[SND_LAUNCH].len, 0.40f, 1047, 1047, 0.07f, 3, 0.05f);
    d = alloc_clip(SND_STARTUP, 2.6f);
    static const float chord[] = { 261.6f, 329.6f, 392.0f, 493.9f, 587.3f };
    for (int i = 0; i < 5; i++)
        add_tone(d, clips[SND_STARTUP].len, i * 0.12f, chord[i], chord[i] * 1.002f, 0.06f, 1.6f, 0.25f);
    add_noise(d, clips[SND_STARTUP].len, 0.08f, 300, 1500);
    for (int i = 0; i < VOICES; i++)
        voices[i].clip = -1;
}

void sound_set_enabled(int effects, int ambient)
{
    fx_on = effects;
    amb_on = ambient;
}

void sound_play(int id)
{
    if (!fx_on || id < 0 || id >= SND_COUNT)
        return;
    unsigned next = (q_head + 1) & 15;
    if (next == q_tail)
        return;
    queue[q_head] = (unsigned)id;
    q_head = next;
}

void sound_mix(float *out, int frames)
{
    while (q_tail != q_head) {          /* start queued sounds on a free (or the oldest) voice */
        int id = (int)queue[q_tail], best = 0, best_pos = -1;
        q_tail = (q_tail + 1) & 15;
        for (int v = 0; v < VOICES; v++) {
            if (voices[v].clip < 0) { best = v; break; }
            if (voices[v].pos > best_pos) { best_pos = voices[v].pos; best = v; }
        }
        voices[best].pos = 0;
        voices[best].clip = id;
    }
    static const float pad[4] = { 130.8f, 196.0f, 246.9f, 329.6f };
    for (int i = 0; i < frames; i++) {
        float s = 0;
        for (int v = 0; v < VOICES; v++) {
            int c = voices[v].clip;
            if (c < 0)
                continue;
            s += clips[c].data[voices[v].pos++];
            if (voices[v].pos >= clips[c].len)
                voices[v].clip = -1;
        }
        /* ambient: a slow, breathing pad, very quiet */
        amb_gain += ((amb_on ? 1.0f : 0.0f) - amb_gain) * 0.00002f;
        if (amb_gain > 0.0005f) {
            amb_t += 1.0f / SOUND_RATE;
            float a = 0;
            for (int k = 0; k < 4; k++) {
                amb_phase[k] += 2 * PI * pad[k] * (1 + 0.003f * sinf(amb_t * (0.11f + k * 0.05f))) / SOUND_RATE;
                if (amb_phase[k] > 2 * PI) amb_phase[k] -= 2 * PI;
                a += sinf(amb_phase[k]) * (0.5f + 0.5f * sinf(amb_t * (0.07f + 0.03f * k) + k));
            }
            s += a * 0.012f * amb_gain;
        }
        s = s > 1 ? 1 : s < -1 ? -1 : s;
        out[2 * i] = out[2 * i + 1] = s;
    }
}
