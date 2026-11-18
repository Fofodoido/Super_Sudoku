:- encoding(utf8).
:- use_module(library(plunit)).
:- use_module(library(random)).
:- use_module(library(lists)).
:- use_module('../minesweeper/board').

:- begin_tests(minesweeper_board).

test(presets, true(Presets == [easy-9-9-10, medium-16-16-40, hard-16-30-99])) :-
    findall(D-R-C-N, preset(D, R, C, N), Presets).
test(unknown_preset, [fail]) :- preset(expert, _, _, _).
test(cells_row_order, true(Cells == [cell(0,0),cell(0,1),cell(0,2),
                                    cell(1,0),cell(1,1),cell(1,2)])) :-
    cells(2, 3, Cells).
test(hard_last_cell) :- valid_cell(16, 30, cell(15,29)).

test(invalid_dimensions, [forall(member(R-C, [0-3,3-0,(-1)-3,3-(-1),
                                              2.5-3,3-a,_-3,3-_]))]) :-
    assertion(\+ cells(R, C, _)),
    assertion(\+ valid_cell(R, C, cell(0,0))),
    assertion(\+ neighbors(R, C, cell(0,0), _)),
    assertion(\+ generate_mines(R, C, 1, cell(0,0), _)),
    assertion(\+ adjacent_mines(R, C, [], cell(0,0), _)).

test(invalid_cells, [forall(member(Cell, [cell(-1,0),cell(0,-1),cell(3,0),
                                         cell(0,4),cell(1.5,0),cell(0,a),
                                         cell(_,0),cell(0,_),_,foo,cell(0)]))]) :-
    assertion(\+ valid_cell(3, 4, Cell)),
    assertion(\+ neighbors(3, 4, Cell, _)),
    assertion(\+ generate_mines(3, 4, 1, Cell, _)),
    assertion(\+ adjacent_mines(3, 4, [], Cell, _)).

test(corner_exact, true(Ns == [cell(0,1),cell(1,0),cell(1,1)])) :-
    neighbors(3, 3, cell(0,0), Ns).
test(no_wrap, true(Ns == [cell(0,2),cell(1,2),cell(1,3)])) :-
    neighbors(3, 4, cell(0,3), Ns).
test(single_cell, true(Ns == [])) :- neighbors(1, 1, cell(0,0), Ns).
test(single_row, true(Ns == [cell(0,0),cell(0,2)])) :-
    neighbors(1, 3, cell(0,1), Ns).
test(single_column, true(Ns == [cell(0,0),cell(2,0)])) :-
    neighbors(3, 1, cell(1,0), Ns).

% Exhaust every coordinate in each preset, using an independent distance rule.
test(all_preset_neighbors, [forall(preset(_, Rows, Cols, _))]) :-
    cells(Rows, Cols, All),
    forall(member(Cell, All),
           ( Cell = cell(R, C),
             neighbors(Rows, Cols, Cell, Ns),
             findall(cell(NR, NC),
                     ( member(cell(NR, NC), All),
                       abs(NR-R) =< 1, abs(NC-C) =< 1,
                       (NR =\= R ; NR =:= R, NC =\= C)
                     ), Expected),
             assertion(Ns == Expected),
             length(Ns, Count),
             ( (R =:= 0 ; R =:= Rows-1) -> RH = 2 ; RH = 3 ),
             ( (C =:= 0 ; C =:= Cols-1) -> CH = 2 ; CH = 3 ),
             assertion(Count =:= RH*CH-1)
           )).

test(adjacent_fixture, true(N == 2)) :-
    adjacent_mines(3, 3, [cell(1,0),cell(0,1)], cell(0,0), N).
test(all_adjacent_counts, [forall(between(0, 8, Count))]) :-
    Ring = [cell(0,0),cell(0,1),cell(0,2),cell(1,0),
            cell(1,2),cell(2,0),cell(2,1),cell(2,2)],
    length(Mines, Count), append(Mines, _, Ring),
    adjacent_mines(3, 3, Mines, cell(1,1), Actual),
    assertion(Actual == Count).
test(mine_does_not_count_itself, true(N == 1)) :-
    adjacent_mines(2, 2, [cell(0,0),cell(1,1)], cell(0,0), N).
test(invalid_mines, [forall(member(Mines, [_,[cell(0,0)|_],foo,
                                         [cell(0,0),cell(0,0)], [cell(3,0)],
                                         [cell(_,0)], [cell(0,a)], [foo]]))]) :-
    assertion(\+ adjacent_mines(3, 3, Mines, cell(0,0), _)).

test(first_click_every_position, [forall(preset(_, Rows, Cols, Count))]) :-
    setup_call_cleanup(
        getrand(State),
        ( set_random(seed(42)),
          cells(Rows, Cols, All),
          forall(member(Safe, All),
                 ( generate_mines(Rows, Cols, Count, Safe, Mines),
                   assertion(length(Mines, Count)),
                   sort(Mines, Sorted), assertion(Mines == Sorted),
                   forall(member(M, Mines), assertion(valid_cell(Rows, Cols, M))),
                   assertion(\+ memberchk(Safe, Mines))
                 ))
        ),
        setrand(State)).

test(zero_mines, true(Mines == [])) :-
    setup_call_cleanup(getrand(S), generate_mines(1, 1, 0, cell(0,0), Mines), setrand(S)).
test(saturated_fixture, true(Mines == [cell(0,1),cell(1,0),cell(1,1)])) :-
    setup_call_cleanup(getrand(S), generate_mines(2, 2, 3, cell(0,0), Mines), setrand(S)).
test(invalid_counts_preserve_random_state,
     [forall(member(Count, [-1,4,5,1.5,a,_]))]) :-
    getrand(Before),
    assertion(\+ generate_mines(2, 2, Count, cell(0,0), _)),
    getrand(After), assertion(Before == After).
test(invalid_safe_cell_preserves_random_state) :-
    getrand(Before),
    assertion(\+ generate_mines(2, 2, 1, cell(2,0), _)),
    getrand(After), assertion(Before == After).
test(reproducible) :-
    setup_call_cleanup(
        getrand(S),
        ( set_random(seed(123)), generate_mines(16, 30, 99, cell(15,29), A),
          set_random(seed(123)), generate_mines(16, 30, 99, cell(15,29), B),
          assertion(A == B)
        ),
        setrand(S)).

:- end_tests(minesweeper_board).
