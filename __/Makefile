SHELL			:= /bin/bash

# Options
-e        := start

# Gather Host Information
# {
UNAME			:= $(shell uname -s)
OS				:= UNKNOWN
COMPOSER	:= $(shell which composer)
NPM				:= $(shell which npm)

DIRECTORIES:=$(shell ls -d src/sites/*/)

ifeq ($(UNAME),Linux)
		OS := linux
endif

ifeq ($(UNAME),Darwin)
		OS := macos
endif

ifeq (,$(COMPOSER))
		NOPE := $(NOPE) 'composer'
endif

ifeq (,$(NPM))
		NOPE := $(NOPE) 'npm'
endif
# }

# Some useful variables...

ERROR		:= "\033[41;1m error   \033[0m"
INFO		:= "\033[44;1m info    \033[0m"
OK			:= "\033[42;1m ok      \033[0m"
WARNING := "\033[43;30m warning \033[0m"

# Task: help | Muestra las diferentes ejecuciones.
# {
.PHONY: help
help:
	clear;
	@echo
	@echo -e "\033[33mUso:\033[0m"
	@echo ' make <target> [--] [options]'
	@echo
	@echo -e "\033[33mTareas:\033[0m"
	@egrep '^# Task: ([a-z-]+) \| (.+)$$' Makefile | awk -F '[:|]' '{print "\033[32m"$$2"\033[0m" "|" $$3}' | column -t -s '|'
	@echo
# }

# Task: install | Instala las dependecias del proyecto.
# {
.PHONY: install
install:
	clear;
	@echo
ifeq ($(NOPE),)
	@echo -e ${OK} 'Dependencias instaladas'
else 
	@echo -e ${ERROR} 'Faltan las siguientes dependencias:' ${NOPE}; exit 1
endif
	npm install
	@echo
# }

# Task: watch | Compila la aplicación para desarrollo.
# {
.PHONY: watch
watch:
	clear;
	@echo
	@echo -e ${INFO} 'Ejecutando compilación en modo desarrollo.'
	@npm run start
	@echo
# }

# Task: build | Compila la aplicación para producción.
# {
.PHONY: build
build:
	clear;
	@echo
	@echo -e ${INFO} 'Ejecutando compilación en modo producción.'
	@npm run build
	@echo -e ${OK} 'Compilación finalizada'
	@echo
# }

# Task: all | Instala y compila la aplicación para producción.
# {
.PHONY: all
all:
	clear;
	make install
	@echo
	make build
	@echo
# }
