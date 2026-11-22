#---------------------------------------------------------------------------------
# Minima — PSL1GHT build. Needs the ps3toolchain + PSL1GHT environment ($PS3DEV, $PSL1GHT).
#   make        -> minima.self (run with ps3load)
#   make pkg    -> minima.pkg  (install from the XMB "Package Manager")
#---------------------------------------------------------------------------------
.SUFFIXES:
ifeq ($(strip $(PSL1GHT)),)
$(error "Please set PSL1GHT in your environment. export PSL1GHT=<path>")
endif

include $(PSL1GHT)/ppu_rules

TARGET    := minima
BUILD     := build
SOURCE    := source
DATA      := data
INCLUDES  := source

TITLE     := Minima
APPID     := MNMA00001
CONTENTID := UP0001-$(APPID)_00-0000000000000000
ICON0     := $(CURDIR)/ICON0.PNG
SFOXML    := $(CURDIR)/sfo.xml

# PSL1GHT changed a few APIs over the years; probe the installed headers.
PSL1GHT_INC := $(PSL1GHT)/ppu/include
SDK_DEFS  := $(shell grep -qs 'gcmContextData *\* *rsxInit' $(PSL1GHT_INC)/rsx/rsx.h && echo -DRSX_INIT_RETURNS_CONTEXT) \
             $(shell grep -qs 'sysUtilGetSystemParamInt' $(PSL1GHT_INC)/sysutil/sysutil.h && echo -DHAVE_SYSUTIL_SYSPARAM)

CFLAGS    = -O2 -Wall -std=gnu99 -mcpu=cell $(MACHDEP) $(SDK_DEFS) $(INCLUDE)
CXXFLAGS  = $(CFLAGS)
LDFLAGS   = $(MACHDEP) -Wl,-Map,$(notdir $@).map
LIBS      := -lrsx -lgcm_sys -lpngdec -laudio -lsysmodule -lio -lsysutil -lrt -llv2 -lm
LIBDIRS   :=

ifneq ($(BUILD),$(notdir $(CURDIR)))

export OUTPUT   := $(CURDIR)/$(TARGET)
export VPATH    := $(foreach dir,$(SOURCE),$(CURDIR)/$(dir)) $(foreach dir,$(DATA),$(CURDIR)/$(dir))
export DEPSDIR  := $(CURDIR)/$(BUILD)
export BUILDDIR := $(CURDIR)/$(BUILD)

CFILES    := $(foreach dir,$(SOURCE),$(notdir $(wildcard $(dir)/*.c)))
BINFILES  := $(foreach dir,$(DATA),$(notdir $(wildcard $(dir)/*.bin)))

export LD        := $(CC)
export OFILES    := $(addsuffix .o,$(BINFILES)) $(CFILES:.c=.o)
export INCLUDE   := $(foreach dir,$(INCLUDES),-I$(CURDIR)/$(dir)) \
                    $(foreach dir,$(LIBDIRS),-I$(dir)/include) \
                    $(LIBPSL1GHT_INC) -I$(CURDIR)/$(BUILD)
export LIBPATHS  := $(foreach dir,$(LIBDIRS),-L$(dir)/lib) $(LIBPSL1GHT_LIB)

.PHONY: $(BUILD) clean pkg run

$(BUILD):
	@[ -d $@ ] || mkdir -p $@
	@$(MAKE) --no-print-directory -C $(BUILD) -f $(CURDIR)/Makefile

clean:
	@echo clean ...
	@rm -fr $(BUILD) $(OUTPUT).elf $(OUTPUT).self $(OUTPUT).pkg $(OUTPUT).fake.self

run: $(BUILD)
	ps3load $(OUTPUT).self

pkg: $(BUILD) $(OUTPUT).pkg

else

DEPENDS := $(OFILES:.o=.d)

%.bin.o: %.bin
	@echo $(notdir $<)
	@$(bin2o)

$(OUTPUT).self: $(OUTPUT).elf
$(OUTPUT).elf: $(OFILES)

-include $(DEPENDS)

endif
