ELM  ?= elm
PORT ?= 8080

ELM_SRC := $(wildcard frontend/src/*.elm)

.PHONY: build run test test-minesweeper clean

build: frontend/public/elm.js

frontend/public/elm.js: $(ELM_SRC) frontend/elm.json
	cd frontend && $(ELM) make src/Main.elm --optimize --output=public/elm.js

run: build
	swipl backend/server.pl $(PORT)

test:
	swipl -g run_tests -t halt backend/tests/test_sudoku.pl
	swipl -g run_tests -t halt backend/tests/test_minesweeper_board.pl
	swipl -g run_tests -t halt backend/tests/test_minesweeper_game.pl

test-minesweeper:
	swipl -g run_tests -t halt backend/tests/test_minesweeper_board.pl
	swipl -g run_tests -t halt backend/tests/test_minesweeper_game.pl

clean:
	rm -rf frontend/public/elm.js frontend/elm-stuff
