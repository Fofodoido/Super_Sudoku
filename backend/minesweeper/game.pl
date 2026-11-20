:- module(minesweeper_game,
          [ new_game/2,
            new_fixed_game/4,
            new_fixed_game/5,
            reveal/3,
            toggle_flag/3,
            game_action/3,
            game_status/2,
            game_revision/2,
            game_dimensions/4,
            game_mine_count/2,
            public_cells/2,
            public_snapshot/2,
            public_snapshot/3
          ]).
:- encoding(utf8).
:- use_module(library(lists)).
:- use_module(library(apply)).
:- use_module(library(ordsets)).
:- use_module(board).

/** <module> Motor de regras e transições de Campo Minado

Mantém o estado interno das partidas separado da camada HTTP e de sessões:
  - Estados: ready, playing, won, lost.
  - Geração preguiçosa de minas apenas na primeira revelação válida (safe first click).
  - Expansão em largura (BFS) para células com 0 minas adjacentes, preservando bandeiras.
  - Projeção pública que nunca expõe minas, semente ou números ocultos enquanto
    a partida está em ready ou playing.

Contrato detalhado em docs/MINESWEEPER_GAME.md.
*/

%! new_game(+Difficulty, -Game) is semidet.
%  Cria uma nova partida em estado ready com minas ainda não geradas.
new_game(Difficulty, Game) :-
    atom(Difficulty),
    preset(Difficulty, Rows, Cols, MineCount),
    !,
    Game = game_state(Difficulty, Rows, Cols, MineCount, ready, 0, ungenerated, [], [], none).

%! new_fixed_game(+Rows, +Cols, +Mines, -Game) is semidet.
%! new_fixed_game(+Difficulty, +Rows, +Cols, +Mines, -Game) is semidet.
%  Cria uma partida determinística com minas conhecidas (para testes e fixtures).
new_fixed_game(Rows, Cols, Mines, Game) :-
    new_fixed_game(custom, Rows, Cols, Mines, Game).

new_fixed_game(Difficulty, Rows, Cols, Mines, Game) :-
    atom(Difficulty),
    valid_dimensions(Rows, Cols),
    valid_mine_list(Rows, Cols, Mines, SortedMines),
    length(SortedMines, MineCount),
    MineCount < Rows * Cols,
    !,
    Game = game_state(Difficulty, Rows, Cols, MineCount, ready, 0, generated(SortedMines), [], [], none).

%! game_status(+Game, -Status) is semidet.
game_status(Game, Status) :-
    valid_game(Game),
    Game = game_state(_, _, _, _, Status, _, _, _, _, _).

%! game_revision(+Game, -Revision) is semidet.
game_revision(Game, Revision) :-
    valid_game(Game),
    Game = game_state(_, _, _, _, _, Revision, _, _, _, _).

%! game_dimensions(+Game, -Difficulty, -Rows, -Cols) is semidet.
game_dimensions(Game, Difficulty, Rows, Cols) :-
    valid_game(Game),
    Game = game_state(Difficulty, Rows, Cols, _, _, _, _, _, _, _).

%! game_mine_count(+Game, -MineCount) is semidet.
game_mine_count(Game, MineCount) :-
    valid_game(Game),
    Game = game_state(_, _, _, MineCount, _, _, _, _, _, _).

%! reveal(+Game0, +Cell, -Game) is semidet.
%  Atalho determinístico para aplicar reveal; falha se a ação resultar em erro.
reveal(Game0, Cell, Game) :-
    game_action(Game0, reveal(Cell), ok(Game)).

%! toggle_flag(+Game0, +Cell, -Game) is semidet.
%  Atalho determinístico para aplicar toggle_flag; falha se a ação resultar em erro.
toggle_flag(Game0, Cell, Game) :-
    game_action(Game0, toggle_flag(Cell), ok(Game)).

%! game_action(+Game0, +Action, -Result) is semidet.
%  Executa uma ação sobre Game0, retornando ok(Game) ou error(Reason).
%  Razões possíveis: invalid_action, invalid_cell, game_over, cell_flagged, cell_revealed.
game_action(Game0, Action, Result) :-
    valid_game(Game0),
    nonvar(Action),
    !,
    execute_action(Game0, Action, Result0),
    Result = Result0.

execute_action(Game0, Action, Result) :-
    (   parse_action(Action, Kind, RawCell)
    ->  Game0 = game_state(_, Rows, Cols, _, Status0, _, _, _, _, _),
        (   valid_cell(Rows, Cols, RawCell)
        ->  (   game_ended(Status0)
            ->  Result = error(game_over)
            ;   apply_valid_action(Kind, RawCell, Game0, Result)
            )
        ;   Result = error(invalid_cell)
        )
    ;   parse_action_error(Action, ErrorReason),
        Result = error(ErrorReason)
    ).

parse_action(reveal(Cell), reveal, Cell) :- !.
parse_action(reveal(Row, Col), reveal, cell(Row, Col)) :- !.
parse_action(toggle_flag(Cell), toggle_flag, Cell) :- !.
parse_action(toggle_flag(Row, Col), toggle_flag, cell(Row, Col)) :- !.
parse_action(Dict, Kind, cell(Row, Col)) :-
    is_dict(Dict),
    get_dict(action, Dict, RawKind),
    normalize_action_kind(RawKind, Kind),
    get_dict(row, Dict, Row),
    get_dict(col, Dict, Col),
    !.

parse_action_error(Dict, invalid_cell) :-
    is_dict(Dict),
    get_dict(action, Dict, RawKind),
    normalize_action_kind(RawKind, _),
    !.
parse_action_error(_, invalid_action).

normalize_action_kind("reveal", reveal) :- !.
normalize_action_kind(reveal, reveal) :- !.
normalize_action_kind("toggle_flag", toggle_flag) :- !.
normalize_action_kind(toggle_flag, toggle_flag) :- !.

game_ended(won).
game_ended(lost).

apply_valid_action(toggle_flag, Cell, Game0, Result) :-
    Game0 = game_state(Diff, Rows, Cols, MineCount, Status, Rev0, MinesState, Revealed, Flagged0, Exploded),
    (   ord_memberchk(Cell, Revealed)
    ->  Result = error(cell_revealed)
    ;   (   ord_memberchk(Cell, Flagged0)
        ->  ord_del_element(Flagged0, Cell, Flagged)
        ;   ord_add_element(Flagged0, Cell, Flagged)
        ),
        Rev is Rev0 + 1,
        Result = ok(game_state(Diff, Rows, Cols, MineCount, Status, Rev, MinesState, Revealed, Flagged, Exploded))
    ).

apply_valid_action(reveal, Cell, Game0, Result) :-
    Game0 = game_state(Diff, Rows, Cols, MineCount, _Status0, Rev0, MinesState0, Revealed0, Flagged0, _Exploded0),
    (   ord_memberchk(Cell, Flagged0)
    ->  Result = error(cell_flagged)
    ;   ord_memberchk(Cell, Revealed0)
    ->  Result = ok(Game0)
    ;   ensure_mines(Rows, Cols, MineCount, Cell, MinesState0, MinesState, Mines),
        Rev is Rev0 + 1,
        (   ord_memberchk(Cell, Mines)
        ->  Result = ok(game_state(Diff, Rows, Cols, MineCount, lost, Rev, MinesState, Revealed0, Flagged0, Cell))
        ;   ord_add_element(Revealed0, Cell, Revealed1),
            expand_safe([Cell], Rows, Cols, Mines, Flagged0, Revealed1, Revealed),
            SafeTarget is Rows * Cols - MineCount,
            length(Revealed, RevealedCount),
            (   RevealedCount =:= SafeTarget
            ->  Status = won
            ;   Status = playing
            ),
            Result = ok(game_state(Diff, Rows, Cols, MineCount, Status, Rev, MinesState, Revealed, Flagged0, none))
        )
    ).

ensure_mines(Rows, Cols, MineCount, SafeCell, ungenerated, generated(Mines), Mines) :-
    !,
    generate_mines(Rows, Cols, MineCount, SafeCell, Mines).
ensure_mines(_, _, _, _, generated(Mines), generated(Mines), Mines).

expand_safe([], _, _, _, _, Revealed, Revealed) :- !.
expand_safe([Curr|Rest], Rows, Cols, Mines, Flagged, Revealed0, Revealed) :-
    adjacent_mines(Rows, Cols, Mines, Curr, Count),
    (   Count =:= 0
    ->  neighbors(Rows, Cols, Curr, Neighbors),
        exclude(cell_blocked(Mines, Flagged, Revealed0), Neighbors, ToVisit),
        sort(ToVisit, NewCells),
        ord_union(Revealed0, NewCells, Revealed1),
        append(Rest, NewCells, NextQueue),
        expand_safe(NextQueue, Rows, Cols, Mines, Flagged, Revealed1, Revealed)
    ;   expand_safe(Rest, Rows, Cols, Mines, Flagged, Revealed0, Revealed)
    ).

cell_blocked(Mines, Flagged, Revealed, Cell) :-
    (   ord_memberchk(Cell, Mines)
    ;   ord_memberchk(Cell, Flagged)
    ;   ord_memberchk(Cell, Revealed)
    ),
    !.

%! public_cells(+Game, -Cells) is semidet.
%  Constrói a lista ordenada por linha de dicts públicos das células.
public_cells(Game, Cells) :-
    valid_game(Game),
    Game = game_state(_, Rows, Cols, _, Status, _, MinesState, Revealed, Flagged, Exploded),
    cells(Rows, Cols, AllCells),
    maplist(cell_projection(Rows, Cols, Status, MinesState, Revealed, Flagged, Exploded),
            AllCells, Cells).

cell_projection(Rows, Cols, Status, MinesState, Revealed, Flagged, _Exploded, cell(R, C), Dict) :-
    (   Status == ready
    ;   Status == playing
    ),
    !,
    Cell = cell(R, C),
    (   ord_memberchk(Cell, Revealed),
        MinesState = generated(Mines)
    ->  adjacent_mines(Rows, Cols, Mines, Cell, Count),
        Dict = _{row: R, col: C, state: revealed, adjacentMines: Count}
    ;   ord_memberchk(Cell, Flagged)
    ->  Dict = _{row: R, col: C, state: flagged}
    ;   Dict = _{row: R, col: C, state: hidden}
    ).

cell_projection(Rows, Cols, _EndedStatus, generated(Mines), Revealed, Flagged, Exploded, cell(R, C), Dict) :-
    Cell = cell(R, C),
    (   Exploded == Cell
    ->  Dict = _{row: R, col: C, state: exploded}
    ;   ord_memberchk(Cell, Mines)
    ->  Dict = _{row: R, col: C, state: mine}
    ;   ord_memberchk(Cell, Revealed)
    ->  adjacent_mines(Rows, Cols, Mines, Cell, Count),
        Dict = _{row: R, col: C, state: revealed, adjacentMines: Count}
    ;   ord_memberchk(Cell, Flagged)
    ->  Dict = _{row: R, col: C, state: flagged}
    ;   Dict = _{row: R, col: C, state: hidden}
    ).

%! public_snapshot(+Game, -Snapshot) is semidet.
%! public_snapshot(+Id, +Game, -Snapshot) is semidet.
%  Gera o snapshot público do jogo (com id opcional para a camada HTTP).
public_snapshot(Game, Snapshot) :-
    valid_game(Game),
    Game = game_state(Difficulty, Rows, Cols, MineCount, Status, Revision, _, _, _, _),
    public_cells(Game, Cells),
    Snapshot = _{ difficulty: Difficulty,
                  rows: Rows,
                  cols: Cols,
                  mineCount: MineCount,
                  status: Status,
                  revision: Revision,
                  cells: Cells
                }.

public_snapshot(Id, Game, Snapshot) :-
    nonvar(Id),
    atomic(Id),
    public_snapshot(Game, BaseSnapshot),
    Snapshot = BaseSnapshot.put(id, Id).

		 /*******************************
		 *          VALIDAÇÃO           *
		 *******************************/

valid_dimensions(Rows, Cols) :-
    integer(Rows), Rows > 0,
    integer(Cols), Cols > 0.

valid_mine_list(Rows, Cols, Mines, SortedMines) :-
    is_list(Mines),
    maplist(valid_cell(Rows, Cols), Mines),
    sort(Mines, SortedMines),
    same_length(Mines, SortedMines).

valid_game(Game) :-
    nonvar(Game),
    Game = game_state(Difficulty, Rows, Cols, MineCount, Status, Revision, MinesState, Revealed, Flagged, Exploded),
    atom(Difficulty),
    valid_dimensions(Rows, Cols),
    integer(MineCount), MineCount >= 0,
    MineCount < Rows * Cols,
    memberchk(Status, [ready, playing, won, lost]),
    integer(Revision), Revision >= 0,
    valid_mines_state(Rows, Cols, MineCount, MinesState, Status),
    valid_cell_ordset(Rows, Cols, Revealed),
    valid_cell_ordset(Rows, Cols, Flagged),
    ord_disjoint(Revealed, Flagged),
    valid_revealed_for_status(Status, Revealed),
    valid_exploded(Status, Rows, Cols, MinesState, Exploded),
    !.

valid_mines_state(_, _, _, ungenerated, ready) :- !.
valid_mines_state(Rows, Cols, MineCount, generated(Mines), _) :-
    valid_cell_ordset(Rows, Cols, Mines),
    length(Mines, MineCount).

valid_cell_ordset(Rows, Cols, Set) :-
    is_list(Set),
    is_ordset(Set),
    maplist(valid_cell(Rows, Cols), Set).

valid_revealed_for_status(ready, []) :- !.
valid_revealed_for_status(Status, _) :-
    Status \== ready.

valid_exploded(lost, Rows, Cols, generated(Mines), Exploded) :- !,
    valid_cell(Rows, Cols, Exploded),
    ord_memberchk(Exploded, Mines).
valid_exploded(Status, _, _, _, none) :-
    Status \== lost.
