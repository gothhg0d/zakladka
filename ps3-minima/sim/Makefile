# Desktop build of Minima for previews and tests: make -C sim && sim/minima-sim 'w60,shot'
SRC := ../source/main.c ../source/gfx.c ../source/font.c ../source/library.c ../source/sound.c sim.c
CFLAGS ?= -O2 -g -Wall -Wextra -Wno-unused-parameter

minima-sim: $(SRC) $(wildcard ../source/*.h) ../data/font.bin
	$(CC) $(CFLAGS) -Dmain=sim_main -DFONT_PATH='"$(abspath ../data/font.bin)"' -c ../source/main.c -o main.o
	$(CC) $(CFLAGS) -DFONT_PATH='"$(abspath ../data/font.bin)"' main.o ../source/gfx.c ../source/font.c ../source/library.c ../source/sound.c sim.c -o $@ -lpng -lpthread -lm

clean:
	rm -f minima-sim main.o
