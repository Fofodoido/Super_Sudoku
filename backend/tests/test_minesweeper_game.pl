:- encoding(utf8).
:- use_module(library(plunit)).
:- use_module(library(lists)).
:- use_module(library(apply)).
:- use_module(library(random)).
:- use_module('../minesweeper/board').
:- use_module('../minesweeper/game').
:- use_module('fixtures/minesweeper').

cell_at(Cells, R, C, CellDict) :-
    member(CellDict, Cells),
    CellDict.row =:= R,
    CellDict.col =:= C,
    !.

has_state(State, Dict) :-
    Dict.state == State.

assert_cell(CellDict, Expected) :-
    assertion(is_dict(CellDict)),
    assertion(CellDict = Expected).

assert_no_leaks(Game) :-
    game_status(Game, Status),
    assertion(memberchk(Status, [ready, playing])),
    public_cells(Game, Cells),
    forall(member(D, Cells),
           ( assertion(memberchk(D.state, [hidden, flagged, revealed])),
             (   D.state == revealed
             ->  assertion(integer(D.adjacentMines)),
                 assertion(D.adjacentMines >= 0),
                 assertion(D.adjacentMines =< 8)
             ;   assertion(\+ get_dict(adjacentMines, D, _))
             )
           )).

:- begin_tests(minesweeper_game).

test(create_presets, [forall(preset(Diff, Rows, Cols, Mines))]) :-
    new_game(Diff, G),
    game_dimensions(G, DiffOut, RowsOut, ColsOut),
    game_mine_count(G, MinesOut),
    game_status(G, Status),
    game_revision(G, Rev),
    assertion(DiffOut == Diff),
    assertion(RowsOut =:= Rows),
    assertion(ColsOut =:= Cols),
    assertion(MinesOut =:= Mines),
    assertion(Status == ready),
    assertion(Rev =:= 0),
    public_snapshot("id-1", G, Snap),
    assertion(Snap.id == "id-1"),
    assertion(Snap.difficulty == Diff),
    assertion(Snap.rows =:= Rows),
    assertion(Snap.cols =:= Cols),
    assertion(Snap.mineCount =:= Mines),
    assertion(Snap.status == ready),
    assertion(Snap.revision =:= 0),
    ExpectedLen is Rows * Cols,
    assertion(length(Snap.cells, ExpectedLen)),
    assert_no_leaks(G).

test(invalid_presets, [forall(member(Bad, [expert, _, 123, "easy"]))]) :-
    assertion(\+ new_game(Bad, _)).

test(fixed_game_creation_and_rejection) :-
    new_fixed_game(3, 4, [cell(2,1), cell(0,0), cell(0,3)], G),
    game_dimensions(G, custom, 3, 4),
    game_mine_count(G, 3),
    game_status(G, ready),
    game_revision(G, 0),
    assertion(\+ new_fixed_game(0, 3, [], _)),
    assertion(\+ new_fixed_game(2, 2, [cell(0,0), cell(0,0)], _)),
    assertion(\+ new_fixed_game(2, 2, [cell(2,0)], _)),
    assertion(\+ new_fixed_game(1, 1, [cell(0,0)], _)),
    assertion(\+ new_fixed_game(2, 2, [cell(0,0), cell(0,1), cell(1,0), cell(1,1)], _)),
    assertion(\+ new_fixed_game("custom", 2, 2, [], _)).

test(flag_before_first_reveal_preserves_ready_and_rng) :-
    new_game(easy, G0),
    getrand(RandBefore),
    toggle_flag(G0, cell(0,0), G1),
    getrand(RandAfterFlag),
    assertion(RandBefore == RandAfterFlag),
    game_status(G1, ready),
    game_revision(G1, 1),
    public_cells(G1, Cells1),
    cell_at(Cells1, 0, 0, C00),
    assertion(C00.state == flagged),
    assert_no_leaks(G1),
    % Flagged cell cannot be revealed
    game_action(G1, reveal(cell(0,0)), ResBlocked),
    assertion(ResBlocked == error(cell_flagged)),
    assertion(\+ reveal(G1, cell(0,0), _)),
    getrand(RandAfterBlocked),
    assertion(RandBefore == RandAfterBlocked),
    % Reveal another cell generates mines lazily while preserving the flag
    reveal(G1, cell(4,4), G2),
    game_status(G2, playing),
    game_revision(G2, 2),
    public_cells(G2, Cells2),
    cell_at(Cells2, 0, 0, C00After),
    assertion(C00After.state == flagged),
    cell_at(Cells2, 4, 4, C44After),
    assertion(C44After.state == revealed),
    assert_no_leaks(G2),
    % Unflagging works after mines are generated
    toggle_flag(G2, cell(0,0), G3),
    game_revision(G3, 3),
    public_cells(G3, Cells3),
    cell_at(Cells3, 0, 0, C00Unflagged),
    assertion(C00Unflagged.state == hidden),
    assert_no_leaks(G3).

test(first_click_safe_all_presets, [forall(preset(Diff, Rows, Cols, _))]) :-
    setup_call_cleanup(
        getrand(Saved),
        ( set_random(seed(42)),
          new_game(Diff, G0),
          LastR is Rows - 1,
          LastC is Cols - 1,
          toggle_flag(G0, cell(0,0), G1),
          reveal(G1, cell(LastR, LastC), G2),
          game_status(G2, Status),
          assertion(Status == playing),
          public_cells(G2, Cells),
          cell_at(Cells, LastR, LastC, Clicked),
          assertion(Clicked.state == revealed),
          cell_at(Cells, 0, 0, Flagged),
          assertion(Flagged.state == flagged),
          assert_no_leaks(G2)
        ),
        setrand(Saved)).

test(subsequent_actions_do_not_consume_rng) :-
    setup_call_cleanup(
        getrand(Saved),
        ( set_random(seed(99)),
          new_game(easy, G0),
          reveal(G0, cell(0,0), G1),
          getrand(AfterFirstReveal),
          game_action(G1, toggle_flag(cell(8,8)), ok(G2)),
          getrand(AfterFlag),
          assertion(AfterFirstReveal == AfterFlag),
          game_action(G2, reveal(cell(0,0)), ok(G3)),
          assertion(G3 == G2),
          getrand(AfterRepeat),
          assertion(AfterFirstReveal == AfterRepeat)
        ),
        setrand(Saved)).

test(numbered_reveal_no_expansion) :-
    board_fixture(rectangular, Rows, Cols, Mines, _),
    new_fixed_game(Rows, Cols, Mines, G0),
    reveal(G0, cell(1,1), G1),
    game_status(G1, playing),
    game_revision(G1, 1),
    public_cells(G1, Cells),
    cell_at(Cells, 1, 1, C11),
    assert_cell(C11, _{row: 1, col: 1, state: revealed, adjacentMines: 2}),
    include(has_state(revealed), Cells, RevealedList),
    assertion(length(RevealedList, 1)),
    assert_no_leaks(G1).

test(flood_fill_stops_at_numbered_border_and_preserves_flags) :-
    board_fixture(rectangular, Rows, Cols, Mines, _),
    new_fixed_game(Rows, Cols, Mines, G0),
    % Flag inside the 0-expansion border (cell(1,3) has count 1)
    toggle_flag(G0, cell(1,3), G1),
    reveal(G1, cell(2,3), G2),
    game_status(G2, playing),
    game_revision(G2, 2),
    public_cells(G2, Cells),
    % cell(2,3) has 0 adjacent mines; neighbors are (1,2)=2, (1,3)=1 (flagged), (2,2)=1
    cell_at(Cells, 2, 3, C23),
    assert_cell(C23, _{row: 2, col: 3, state: revealed, adjacentMines: 0}),
    cell_at(Cells, 1, 2, C12),
    assert_cell(C12, _{row: 1, col: 2, state: revealed, adjacentMines: 2}),
    cell_at(Cells, 2, 2, C22),
    assert_cell(C22, _{row: 2, col: 2, state: revealed, adjacentMines: 1}),
    cell_at(Cells, 1, 3, C13),
    assert_cell(C13, _{row: 1, col: 3, state: flagged}),
    cell_at(Cells, 0, 2, C02),
    assert_cell(C02, _{row: 0, col: 2, state: hidden}),
    assert_no_leaks(G2).

test(flood_fill_multi_hop_with_bfs) :-
    % 4x4 board with single mine at cell(0,0)
    new_fixed_game(4, 4, [cell(0,0)], G0),
    reveal(G0, cell(3,3), G1),
    % All 15 safe cells are reachable from (3,3) through 0-cells and their numbered border
    game_status(G1, won),
    public_cells(G1, Cells),
    cell_at(Cells, 0, 0, MineCell),
    assert_cell(MineCell, _{row: 0, col: 0, state: mine}),
    cell_at(Cells, 0, 1, BorderCell),
    assert_cell(BorderCell, _{row: 0, col: 1, state: revealed, adjacentMines: 1}),
    cell_at(Cells, 3, 3, OriginCell),
    assert_cell(OriginCell, _{row: 3, col: 3, state: revealed, adjacentMines: 0}).

test(flag_in_zero_board_delays_win_until_unflagged_and_revealed) :-
    board_fixture(empty, Rows, Cols, Mines, _),
    new_fixed_game(Rows, Cols, Mines, G0),
    toggle_flag(G0, cell(1,2), G1),
    reveal(G1, cell(0,0), G2),
    game_status(G2, playing),
    public_cells(G2, Cells2),
    cell_at(Cells2, 1, 2, Flagged),
    assert_cell(Flagged, _{row: 1, col: 2, state: flagged}),
    assert_no_leaks(G2),
    toggle_flag(G2, cell(1,2), G3),
    reveal(G3, cell(1,2), G4),
    game_status(G4, won).

test(repeated_reveal_is_idempotent_with_unchanged_revision) :-
    board_fixture(rectangular, Rows, Cols, Mines, _),
    new_fixed_game(Rows, Cols, Mines, G0),
    reveal(G0, cell(1,1), G1),
    game_revision(G1, 1),
    game_action(G1, reveal(cell(1,1)), ok(G2)),
    assertion(G2 == G1),
    game_revision(G2, 1),
    game_action(G2, toggle_flag(cell(1,1)), FlagErr),
    assertion(FlagErr == error(cell_revealed)).

test(victory_on_surrounded_first_reveal) :-
    board_fixture(surrounded, Rows, Cols, Mines, _),
    new_fixed_game(Rows, Cols, Mines, G0),
    toggle_flag(G0, cell(0,0), G1),
    reveal(G1, cell(1,1), G2),
    game_status(G2, won),
    game_revision(G2, 2),
    public_cells(G2, Cells),
    cell_at(Cells, 1, 1, Center),
    assert_cell(Center, _{row: 1, col: 1, state: revealed, adjacentMines: 8}),
    include(has_state(mine), Cells, MineCells),
    assertion(length(MineCells, 8)),
    include(has_state(exploded), Cells, ExplodedCells),
    assertion(ExplodedCells == []),
    % Actions blocked after win
    game_action(G2, reveal(cell(0,0)), Res1),
    assertion(Res1 == error(game_over)),
    game_action(G2, toggle_flag(cell(0,0)), Res2),
    assertion(Res2 == error(game_over)).

test(defeat_projection_and_game_over_lock) :-
    board_fixture(rectangular, Rows, Cols, Mines, _),
    new_fixed_game(Rows, Cols, Mines, G0),
    % Reveal a safe numbered cell, place a correct flag on (0,3) and a wrong flag on (0,1)
    reveal(G0, cell(1,1), G1),
    toggle_flag(G1, cell(0,3), G2),
    toggle_flag(G2, cell(0,1), G3),
    % Click mine at cell(0,0)
    reveal(G3, cell(0,0), G4),
    game_status(G4, lost),
    game_revision(G4, 4),
    public_cells(G4, Cells),
    cell_at(Cells, 0, 0, C00),
    assert_cell(C00, _{row: 0, col: 0, state: exploded}),
    cell_at(Cells, 0, 3, C03),
    assert_cell(C03, _{row: 0, col: 3, state: mine}),
    cell_at(Cells, 2, 1, C21),
    assert_cell(C21, _{row: 2, col: 1, state: mine}),
    cell_at(Cells, 1, 1, C11),
    assert_cell(C11, _{row: 1, col: 1, state: revealed, adjacentMines: 2}),
    cell_at(Cells, 0, 1, C01),
    assert_cell(C01, _{row: 0, col: 1, state: flagged}),
    cell_at(Cells, 0, 2, C02),
    assert_cell(C02, _{row: 0, col: 2, state: hidden}),
    % Actions blocked after loss
    game_action(G4, reveal(cell(0,2)), ResReveal),
    assertion(ResReveal == error(game_over)),
    game_action(G4, toggle_flag(cell(0,2)), ResFlag),
    assertion(ResFlag == error(game_over)),
    % Invalid cell/action still classified as invalid input (400 before 409)
    game_action(G4, reveal(cell(9,9)), ResBadCell),
    assertion(ResBadCell == error(invalid_cell)),
    game_action(G4, bogus(0,0), ResBadAction),
    assertion(ResBadAction == error(invalid_action)).

test(dict_and_pair_action_formats) :-
    board_fixture(rectangular, Rows, Cols, Mines, _),
    new_fixed_game(Rows, Cols, Mines, G0),
    game_action(G0, _{action: "toggle_flag", row: 0, col: 3}, ok(G1)),
    game_action(G1, _{action: "reveal", row: 1, col: 1}, ok(G2)),
    game_action(G2, toggle_flag(0, 1), ok(G3)),
    game_action(G3, reveal(2, 3), ok(G4)),
    game_status(G4, playing),
    game_revision(G4, 4),
    game_action(G4, _{action: "hint", row: 0, col: 0}, E1),
    assertion(E1 == error(invalid_action)),
    game_action(G4, _{action: "reveal", row: 0}, E2),
    assertion(E2 == error(invalid_cell)),
    game_action(G4, _{action: "reveal", row: -1, col: 0}, E3),
    assertion(E3 == error(invalid_cell)),
    game_action(G4, _{action: "reveal", row: 0, col: "1"}, E4),
    assertion(E4 == error(invalid_cell)).

test(snapshot_hides_internal_fields_and_supports_custom_difficulty) :-
    new_fixed_game(easy, 3, 4, [cell(0,0)], G0),
    public_snapshot(G0, Snap0),
    assertion(Snap0.difficulty == easy),
    assertion(\+ get_dict(id, Snap0, _)),
    assertion(\+ get_dict(mines, Snap0, _)),
    assertion(\+ get_dict(seed, Snap0, _)),
    reveal(G0, cell(1,1), G1),
    public_snapshot("s-42", G1, Snap1),
    assertion(Snap1.id == "s-42"),
    assertion(Snap1.status == playing),
    assertion(Snap1.revision =:= 1),
    assertion(\+ get_dict(mines, Snap1, _)),
    assertion(\+ get_dict(seed, Snap1, _)),
    assert_no_leaks(G1).

test(invalid_game_terms_fail_cleanly) :-
    assertion(\+ game_status(_, _)),
    assertion(\+ game_status(foo, _)),
    assertion(\+ game_revision(foo, _)),
    assertion(\+ public_cells(foo, _)),
    assertion(\+ public_snapshot(foo, _)),
    assertion(\+ game_action(foo, reveal(0,0), _)),
    new_game(easy, G0),
    assertion(\+ game_action(G0, _, _)),
    assertion(\+ public_snapshot(_, G0, _)).

:- end_tests(minesweeper_game).
