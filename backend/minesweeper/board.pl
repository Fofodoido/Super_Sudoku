:- module(minesweeper_board,
          [ preset/4,
            valid_cell/3,
            cells/3,
            neighbors/4,
            generate_mines/5,
            adjacent_mines/5
          ]).
:- encoding(utf8).
:- use_module(library(lists)).
:- use_module(library(apply)).
:- use_module(library(random)).

/** <module> Geometria e geração de Campo Minado

Coordenadas internas: cell(Row, Col), base zero. Listas produzidas são
ordenadas por linha. Entradas inválidas falham nos modos documentados.
Contrato completo: docs/MINESWEEPER_BOARD.md.
Não mantém partidas: o motor chama generate_mines/5 na primeira revelação
válida e guarda as minas para todas as ações seguintes.
*/

%! preset(?Difficulty, ?Rows, ?Cols, ?MineCount) is nondet.
preset(easy, 9, 9, 10).
preset(medium, 16, 16, 40).
preset(hard, 16, 30, 99).

dimensions(Rows, Cols) :-
    integer(Rows), Rows > 0,
    integer(Cols), Cols > 0.

%! valid_cell(+Rows, +Cols, +Cell) is semidet.
valid_cell(Rows, Cols, Cell) :-
    dimensions(Rows, Cols),
    nonvar(Cell), Cell = cell(Row, Col),
    integer(Row), integer(Col),
    Row >= 0, Row < Rows,
    Col >= 0, Col < Cols.

%! cells(+Rows, +Cols, -Cells) is det.
% Fails for invalid dimensions.
cells(Rows, Cols, Cells) :-
    dimensions(Rows, Cols),
    LastRow is Rows - 1,
    LastCol is Cols - 1,
    findall(cell(R, C),
            (between(0, LastRow, R), between(0, LastCol, C)), Cells).

%! neighbors(+Rows, +Cols, +Cell, -Neighbors) is det.
% Fails for invalid dimensions/cell. Never includes Cell itself.
neighbors(Rows, Cols, Cell, Neighbors) :-
    valid_cell(Rows, Cols, Cell),
    Cell = cell(Row, Col),
    MinRow is max(0, Row - 1), MaxRow is min(Rows - 1, Row + 1),
    MinCol is max(0, Col - 1), MaxCol is min(Cols - 1, Col + 1),
    findall(cell(R, C),
            ( between(MinRow, MaxRow, R),
              between(MinCol, MaxCol, C),
              cell(R, C) \== Cell
            ), Neighbors).

%! generate_mines(+Rows, +Cols, +MineCount, +SafeCell, -Mines) is det.
% Validates before consuming randomness. Only SafeCell is excluded.
% Uses the calling thread's RNG; no seed is accepted or returned.
generate_mines(Rows, Cols, MineCount, SafeCell, Mines) :-
    valid_cell(Rows, Cols, SafeCell),
    integer(MineCount), MineCount >= 0,
    MineCount < Rows * Cols,
    cells(Rows, Cols, All),
    selectchk(SafeCell, All, Candidates),
    random_permutation(Candidates, Shuffled),
    length(Selected, MineCount),
    append(Selected, _, Shuffled),
    sort(Selected, Mines).

%! adjacent_mines(+Rows, +Cols, +Mines, +Cell, -Count) is det.
% Accepts unordered, unique fixtures. Fails for malformed mine lists.
adjacent_mines(Rows, Cols, Mines, Cell, Count) :-
    neighbors(Rows, Cols, Cell, Neighbors),
    is_list(Mines),
    maplist(valid_cell(Rows, Cols), Mines),
    sort(Mines, Unique),
    same_length(Mines, Unique),
    include(is_mine(Unique), Neighbors, Adjacent),
    length(Adjacent, Count).

is_mine(Mines, Cell) :- memberchk(Cell, Mines).
