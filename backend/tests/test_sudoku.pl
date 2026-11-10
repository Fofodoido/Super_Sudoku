:- encoding(utf8).
:- use_module(library(plunit)).
:- use_module(library(lists)).
:- use_module(library(apply)).
:- use_module('../sudoku/geometry').
:- use_module('../sudoku/solver').
:- use_module('../sudoku/logic').
:- use_module('../sudoku/generator').
:- use_module('../sudoku/templates').
:- use_module('../sudoku/extras').
:- use_module('../sudoku/meta').

/*  Rodar com:  swipl -g run_tests -t halt backend/tests/test_sudoku.pl  */

% Puzzle clássico conhecido (resolvível só com singles).
easy_puzzle([5,3,0,0,7,0,0,0,0,
             6,0,0,1,9,5,0,0,0,
             0,9,8,0,0,0,0,6,0,
             8,0,0,0,6,0,0,0,3,
             4,0,0,8,0,3,0,0,1,
             7,0,0,0,2,0,0,0,6,
             0,6,0,0,0,0,2,8,0,
             0,0,0,4,1,9,0,0,5,
             0,0,0,0,8,0,0,7,9]).

classic_ctx(Ctx) :-
    zeros(Z),
    build_context([], [], Z, Ctx).

valid_grid(Ctx, Grid) :-
    ctx_houses(Ctx, Hs),
    forall(member(house(_, _, Cells), Hs),
           ( findall(V, (member(I, Cells), nth0(I, Grid, V)), Vs),
             msort(Vs, [1,2,3,4,5,6,7,8,9]) )),
    ctx_rules(Ctx, Rules),
    (   memberchk(antiknight, Rules)
    ->  knight_pairs(KP),
        forall(member(I-J, KP), (nth0(I, Grid, A), nth0(J, Grid, B), A =\= B))
    ;   true
    ),
    ctx_cages(Ctx, Cages),
    forall(member(cage(S, Cs), Cages),
           ( findall(V, (member(I, Cs), nth0(I, Grid, V)), Vs),
             sum_list(Vs, S),
             is_set(Vs) )),
    ctx_parity(Ctx, Parity),
    forall(nth0(I, Parity, P),
           ( P =:= 0
           ; nth0(I, Grid, V), (P =:= 1 -> V mod 2 =:= 1 ; V mod 2 =:= 0) )),
    (   memberchk(antiking, Rules)
    ->  king_pairs(KG),
        forall(member(I-J, KG), (nth0(I, Grid, A), nth0(J, Grid, B), A =\= B))
    ;   true
    ),
    % Regras locais (e não-consecutivo): as mesmas restrições CLP(FD)
    % conferem uma grade pronta.
    ctx_extras(Ctx, Extras),
    forall(member(extra(T, Cs, Prm), Extras),
           ( findall(V, (member(I, Cs), nth0(I, Grid, V)), Vs),
             \+ \+ post_extra_vars(T, Prm, Vs) )).

:- begin_tests(geometry).

test(classic_houses) :-
    houses([], Hs), length(Hs, 27).

test(variant_houses) :-
    houses([diagonal, hyper], Hs), length(Hs, 33).

test(anti_diagonal) :-
    houses([diagonal], Hs),
    memberchk(house(diag, 1, [8,16,24,32,40,48,56,64,72]), Hs).

test(knight_pairs) :-
    knight_pairs(KP), length(KP, 224).

test(peers_classic) :-
    classic_ctx(Ctx),
    forall(between(0, 80, I), (peers(Ctx, I, Ps), length(Ps, 20))).

test(peers_antiking) :-
    zeros(Z),
    build_context([antiking], [], Z, Ctx),
    peers(Ctx, 30, Ps),
    length(Ps, 23).    % 20 clássicos + 3 diagonais fora do bloco

test(disjoint_houses) :-
    houses([disjoint], Hs), length(Hs, 36).

test(nonconsecutive_pairs) :-
    zeros(Z),
    build_context([nonconsecutive], [], Z, Ctx),
    ctx_extras(Ctx, Ex),
    length(Ex, 144).

test(peers_antiknight) :-
    zeros(Z),
    build_context([antiknight], [], Z, Ctx),
    peers(Ctx, 40, Ps),
    length(Ps, 28).    % 20 clássicos + 8 saltos de cavalo

:- end_tests(geometry).

:- begin_tests(solver).

test(solves_easy, [true(S == Expected)]) :-
    classic_ctx(Ctx),
    easy_puzzle(P),
    solve(Ctx, P, S),
    Expected = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,
                8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,
                9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9].

test(unique) :-
    classic_ctx(Ctx),
    easy_puzzle(P),
    unique_solution(Ctx, P).

test(not_unique, [fail]) :-
    classic_ctx(Ctx),
    zeros(Z),
    unique_solution(Ctx, Z).

test(random_grid_valid) :-
    set_random(seed(1)),
    zeros(Z),
    build_context([diagonal, hyper], [], Z, Ctx),
    random_solution(Ctx, G),
    valid_grid(Ctx, G).

test(template_transform_valid) :-
    set_random(seed(2)),
    zeros(Z),
    build_context([antiknight, diagonal], [], Z, Ctx),
    template([antiknight, diagonal], T),
    valid_grid(Ctx, T),
    forall(between(1, 8, _), (transform_grid(T, G), valid_grid(Ctx, G))).

:- end_tests(solver).

:- begin_tests(logic).

test(rate_easy, [true(L == 1)]) :-
    classic_ctx(Ctx),
    easy_puzzle(P),
    solve(Ctx, P, S),
    rate(Ctx, P, S, rating(L, _)).

test(hint_first_step_is_placement) :-
    classic_ctx(Ctx),
    easy_puzzle(P),
    solve(Ctx, P, S),
    hint(Ctx, P, S, steps(Steps)),
    last(Steps, step(_, _, _, _, I-D, Msg)),
    nth0(I, S, D),
    atom(Msg).

test(hint_reports_errors, [true(R == errors([2]))]) :-
    classic_ctx(Ctx),
    easy_puzzle(P),
    solve(Ctx, P, S),
    nth0(2, S, Right),
    Wrong is Right mod 9 + 1,
    nth0(2, P, _, Rest), nth0(2, B, Wrong, Rest),
    hint(Ctx, B, S, R).

test(hint_solved, [true(R == solved)]) :-
    classic_ctx(Ctx),
    easy_puzzle(P),
    solve(Ctx, P, S),
    hint(Ctx, S, S, R).

test(prune_keeps_only_relevant) :-
    Irrelevant = step(intersection, [0, 1], [0, 1, 2], [70-5], none, a),
    Relevant   = step(intersection, [9, 10], [9, 10, 11], [40-3], none, b),
    Final      = step(naked_single, [40], [], [], 40-7, c),
    prune_chain([Irrelevant, Relevant, Final], Pruned),
    Pruned == [Relevant, Final].

% Toda colocação sugerida pelo motor bate com a solução, em todas as
% variantes (as técnicas são deduções corretas).
test(engine_is_sound, [forall(member(Rules, [[], [diagonal], [killer], [parity, hyper],
                                              [nonconsecutive], [thermo, kropki, xv],
                                              [arrow, whisper, renban, palindrome, between],
                                              [antiking, disjoint]]))]) :-
    generate(Rules, medio, 99, game(Ctx, P, S, _)),
    initial_state(Ctx, P, St),
    sound_run(Ctx, St, S, 200).

:- end_tests(logic).

sound_run(_, _, _, 0) :- !.
sound_run(Ctx, St, S, N) :-
    St = st(VT, _),
    (   \+ arg(_, VT, 0)
    ->  true
    ;   find_step(Ctx, St, 4, S, Step)
    ->  Step = step(_, _, _, Elims, Place, _),
        forall(member(I-D, Elims), \+ nth0(I, S, D)),
        (   Place = I-D -> nth0(I, S, D) ; true ),
        apply_step(Ctx, Step, St, St1),
        N1 is N - 1,
        sound_run(Ctx, St1, S, N1)
    ;   true
    ).

:- begin_tests(generator).

test(generated_puzzles_are_valid,
     [forall(member(Rules-Diff, [[]-facil, [diagonal]-medio, [killer]-medio,
                                 [antiknight]-medio, [parity]-dificil]))]) :-
    generate(Rules, Diff, 7, game(Ctx, P, S, rating(L, _))),
    valid_grid(Ctx, S),
    maplist([G, V]>>(G =:= 0 -> true ; G =:= V), P, S),
    unique_solution(Ctx, P),
    difficulty(Diff, MaxL, _, _, _),
    L =< MaxL.

test(killer_cages_partition_board) :-
    set_random(seed(5)),
    classic_ctx(Ctx0),
    random_solution(Ctx0, S),
    make_cages(S, Cages),
    findall(Cs, member(cage(_, Cs), Cages), Css),
    once(append(Css, All)),
    msort(All, Sorted),
    numlist(0, 80, Sorted),
    zeros(Z),
    build_context([killer], Cages, Z, Ctx),
    valid_grid(Ctx, S).

test(local_rules_are_valid,
     [forall(member(Rules, [[thermo], [arrow], [kropki], [xv], [whisper], [renban],
                            [palindrome], [between],
                            [antiking, antiknight, nonconsecutive]]))]) :-
    generate(Rules, medio, 11, game(Ctx, P, S, _)),
    valid_grid(Ctx, S),
    maplist([G, V]>>(G =:= 0 -> true ; G =:= V), P, S),
    unique_solution(Ctx, P).

test(local_rules_are_drawn) :-
    generate([thermo, kropki], medio, 3, game(Ctx, _, _, _)),
    ctx_extras(Ctx, Ex),
    include([extra(T, _, _)]>>memberchk(T, [thermo, kropki]), Ex, [_|_]).

test(miracle_template_valid) :-
    set_random(seed(4)),
    Rules = [antiking, antiknight, nonconsecutive],
    zeros(Z),
    build_context(Rules, [], Z, Ctx),
    forall(between(1, 8, _), (template_grid(Rules, G), valid_grid(Ctx, G))).

:- end_tests(generator).

:- begin_tests(meta).

test(counts_constraints, [true(T == [house_constraint-27, diff_constraint-224])]) :-
    zeros(Z),
    build_context([antiknight], [], Z, Ctx),
    constraint_table(Ctx, T).

test(palindrome_is_only_unification, [true(N == 27)]) :-
    zeros(Z),
    build_context([palindrome], [], Z, [extra(palindrome, [0, 10, 20], none)], Ctx),
    count_constraints(Ctx, N).

:- end_tests(meta).
