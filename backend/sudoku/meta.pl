:- module(meta,
          [ count_constraints/2,
            constraint_table/2
          ]).
:- encoding(utf8).
:- use_module(library(clpfd)).
:- use_module(library(lists)).
:- use_module(library(pairs)).
:- use_module(solver).

/** <module> Meta-interpretador que conta restrições

Um meta-interpretador é um interpretador de Prolog escrito em Prolog:
recebe um objetivo, separa as conjunções, busca as cláusulas com
clause/2 e chama a si mesmo no corpo delas. Como programa e dados têm a
mesma forma (homoiconicidade), isso cabe em poucas linhas.

Este executa solver:post_constraints/2 e, de quebra, CONTA as restrições
CLP(FD) postadas, separadas pelo predicado que as postou:

    ?- build_context([antiknight], [], Z, Ctx), constraint_table(Ctx, T).
    T = [house_constraint-27, diff_constraint-224].

O servidor manda o total junto com cada puzzle ("Modelo CLP(FD): N
restrições"). Para enxergar as restrições como foram escritas, solver.pl
e extras.pl desligam a reescrita da CLP(FD) (flag optimise_clpfd).
*/

%!  count_constraints(+Ctx, -N) is det.
count_constraints(Ctx, N) :-
    constraint_table(Ctx, Table),
    pairs_values(Table, Ns),
    sum_list(Ns, N).

%!  constraint_table(+Ctx, -Table) is det.
%
%   Table = lista Predicado-Quantidade.
constraint_table(Ctx, Table) :-
    mi(solver, post_constraints(Ctx, _), none, [], Counts),
    reverse(Counts, Table).

%!  mi(+Module, +Goal, +Owner, +Counts0, -Counts)
%
%   Owner é o último predicado "nosso" que estava executando: é a ele
%   que a restrição é creditada.
mi(_, true, _, C, C) :- !.
mi(M, (A, B), O, C0, C) :- !,
    mi(M, A, O, C0, C1),
    mi(M, B, O, C1, C).
mi(M, (If -> Then ; Else), O, C0, C) :- !,
    (   mi(M, If, O, C0, C1)
    ->  mi(M, Then, O, C1, C)
    ;   mi(M, Else, O, C0, C)
    ).
mi(M, (A ; B), O, C0, C) :- !,
    (   mi(M, A, O, C0, C)
    ;   mi(M, B, O, C0, C)
    ).
mi(_, M:G, O, C0, C) :- !,
    mi(M, G, O, C0, C).
mi(M, maplist(G, L), O, C0, C) :- !,       % abrimos o maplist para
    mi_maplist(M, G, L, O, C0, C).         % ver as restrições lá dentro
mi(M, maplist(G, L1, L2), O, C0, C) :- !,
    mi_maplist(M, G, L1, L2, O, C0, C).
mi(M, G, O, C0, C) :-
    constraint(G), !,                      % uma restrição: executa e conta
    call(M:G),
    credit(O, C0, C).
mi(M, G, _, C0, C) :-
    ours(M, G, Def), !,                    % predicado nosso: abre as cláusulas
    functor(G, Name, _),
    clause(Def:G, Body),
    mi(Def, Body, Name, C0, C).
mi(M, G, _, C, C) :-                       % biblioteca: executa direto
    call(M:G).

constraint(G) :-
    functor(G, Name, Arity),
    memberchk(Name/Arity, [ (#=)/2, (#\=)/2, (#<)/2, (#>)/2, (#=<)/2,
                            (#>=)/2, (#\/)/2, (in)/2, all_distinct/1,
                            sum/3, chain/2 ]).

ours(M, G, Def) :-
    predicate_property(M:G, implementation_module(Def)),
    memberchk(Def, [solver, extras]),
    predicate_property(Def:G, number_of_clauses(_)).

credit(O, C0, C) :-
    (   selectchk(O-N, C0, Rest)
    ->  N1 is N + 1,
        C = [O-N1|Rest]
    ;   C = [O-1|C0]
    ).

% maplist(G, [X1, X2...]) = call(G, X1), call(G, X2)... Montamos cada
% chamada com =.. ("univ"): termo <-> [Nome | Argumentos].
mi_maplist(_, _, [], _, C, C).
mi_maplist(M, G, [X|Xs], O, C0, C) :-
    G =.. L0,
    append(L0, [X], L),
    G1 =.. L,
    mi(M, G1, O, C0, C1),
    mi_maplist(M, G, Xs, O, C1, C).

mi_maplist(_, _, [], [], _, C, C).
mi_maplist(M, G, [X|Xs], [Y|Ys], O, C0, C) :-
    G =.. L0,
    append(L0, [X, Y], L),
    G1 =.. L,
    mi(M, G1, O, C0, C1),
    mi_maplist(M, G, Xs, Ys, O, C1, C).
