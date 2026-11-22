# Desktop build of G0THOS for previews and tests: make -C sim && sim/g0thos-sim 'w60,shot'
SRC := ../source/main.c ../source/gfx.c ../source/font.c ../source/library.c ../source/sound.c sim.c
CFLAGS ?= -O2 -g -Wall -Wextra -Wno-unused-parameter

g0thos-sim: $(SRC) $(wildcard ../source/*.h) ../data/font.bin
	$(CC) $(CFLAGS) -Dmain=sim_main -DFONT_PATH='"$(abspath ../data/font.bin)"' -c ../source/main.c -o main.o
	$(CC) $(CFLAGS) -DFONT_PATH='"$(abspath ../data/font.bin)"' main.o ../source/gfx.c ../source/font.c ../source/library.c ../source/sound.c sim.c -o $@ -lpng -lpthread -lm

clean:
	rm -f g0thos-sim main.o
