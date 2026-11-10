ELM  ?= elm
PORT ?= 8080

ELM_SRC := $(wildcard frontend/src/*.elm)

.PHONY: build run test clean

build: frontend/public/elm.js

frontend/public/elm.js: $(ELM_SRC) frontend/elm.json
	cd frontend && $(ELM) make src/Main.elm --optimize --output=public/elm.js

run: build
	swipl backend/server.pl $(PORT)

test:
	swipl -g run_tests -t halt backend/tests/test_sudoku.pl

clean:
	rm -rf frontend/public/elm.js frontend/elm-stuff
