#ifndef MINIMA_SOUND_H
#define MINIMA_SOUND_H

/* Tiny synthesizer: every UI sound is generated at start-up, nothing is sampled. */

enum {
    SND_MOVE, SND_EDGE, SND_TAB, SND_OK, SND_BACK, SND_TOGGLE,
    SND_LAUNCH, SND_STARTUP, SND_ERROR, SND_OPEN, SND_COUNT
};

#define SOUND_RATE 48000

void sound_init(void);
void sound_play(int id);
void sound_set_enabled(int effects, int ambient);
/* Called from the audio thread: writes `frames` interleaved stereo float frames. */
void sound_mix(float *out, int frames);

#endif
