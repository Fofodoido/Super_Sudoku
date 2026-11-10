:- module(solver,
          [ post_constraints/2,
            count_solutions/4,
            unique_solution/2,
            solve/3,
            random_solution/2,
            random_solution/3
          ]).
:- encoding(utf8).
:- use_module(library(clpfd)).

% Sem a reescrita automática da CLP(FD), para o meta-interpretador
% (meta.pl) enxergar as restrições como estão escritas.
:- set_prolog_flag(optimise_clpfd, false).

:- use_module(library(random)).
:- use_module(library(solution_sequences)).
:- use_module(library(time)).
:- use_module(geometry).
:- use_module(extras).

/** <module> Modelo CLP(FD) para todas as variantes

Cada regra vira um conjunto de restrições de domínio finito. O mesmo
modelo é usado para gerar grades completas, para verificar unicidade
durante a geração e para resolver.
*/

%!  post_constraints(+Ctx, -Vars) is det.
post_constraints(Ctx, Vars) :-
    Ctx = ctx(Rules, Houses, Cages, Parity, Extras, _),
    length(Vars, 81),
    Vars ins 1..9,
    VT =.. [v|Vars],
    maplist(house_constraint(VT), Houses),
    (   memberchk(antiknight, Rules)
    ->  knight_pairs(KP),
        maplist(diff_constraint(VT), KP)
    ;   true
    ),
    (   memberchk(antiking, Rules)
    ->  king_pairs(KG),
        maplist(diff_constraint(VT), KG)
    ;   true
    ),
    maplist(cage_constraint(VT), Cages),
    numlist(0, 80, Is),
    maplist(parity_constraint_at(VT), Is, Parity),
    maplist(post_extra(VT), Extras).        % regras locais (extras.pl)

cell_var(VT, I, V) :-
    A is I + 1,
    arg(A, VT, V).

cell_vars(VT, Cells, Vs) :-
    maplist(cell_var(VT), Cells, Vs).

house_constraint(VT, house(_, _, Cells)) :-
    cell_vars(VT, Cells, Vs),
    all_distinct(Vs).

diff_constraint(VT, I-J) :-
    cell_var(VT, I, A),
    cell_var(VT, J, B),
    A #\= B.

cage_constraint(VT, cage(Sum, Cells)) :-
    cell_vars(VT, Cells, Vs),
    all_distinct(Vs),
    sum(Vs, #=, Sum).

parity_constraint_at(_, _, 0) :- !.
parity_constraint_at(VT, I, 1) :- !,
    cell_var(VT, I, V),
    V in 1\/3\/5\/7\/9.
parity_constraint_at(VT, I, 2) :-
    cell_var(VT, I, V),
    V in 2\/4\/6\/8.

%   As pistas são unificadas antes de postar as restrições: propagar
%   all_distinct/1 sobre valores já fixos é bem mais barato do que
%   acrescentar V #= P depois.
givens(Vs, Puzzle) :-
    length(Vs, 81),
    maplist(give, Vs, Puzzle).

give(V, P) :-
    (   P =:= 0
    ->  true
    ;   V = P
    ).

%!  count_solutions(+Ctx, +Puzzle, +Max, -Count) is det.
%
%   Conta soluções até o limite Max (usar 2 para checar unicidade).
count_solutions(Ctx, Puzzle, Max, Count) :-
    findall(x,
            limit(Max,
                  ( givens(Vs, Puzzle),
                    post_constraints(Ctx, Vs),
                    labeling([ff], Vs)
                  )),
            L),
    length(L, Count).

%!  unique_solution(+Ctx, +Puzzle) is semidet.
%
%   Falha também se a contagem não terminar em 2 segundos (postura
%   conservadora: na dúvida, o gerador mantém a pista).
unique_solution(Ctx, Puzzle) :-
    catch(call_with_time_limit(2, count_solutions(Ctx, Puzzle, 2, N)),
          time_limit_exceeded,
          fail),
    N =:= 1.

solve(Ctx, Puzzle, Solution) :-
    givens(Vs, Puzzle),
    post_constraints(Ctx, Vs),
    once(labeling([ff], Vs)),
    Solution = Vs.

%!  random_solution(+Ctx, -Grid) is semidet.
%
%   Grade completa aleatória que respeita todas as restrições do
%   contexto. Rotulação "first-fail" com ordem de valores embaralhada.
%
%   Combinações como anti-cavalo + diagonal têm busca de cauda pesada:
%   algumas ordens aleatórias resolvem em milissegundos, outras ficam
%   presas por minutos. Por isso cada tentativa tem um limite curto e a
%   busca recomeça com outra ordem (reinícios aleatórios).
random_solution(Ctx, Grid) :-
    random_solution(Ctx, 4, Grid).

random_solution(Ctx, Seconds, Grid) :-
    get_time(T0),
    Deadline is T0 + Seconds,
    restart_search(Ctx, 0.3, Deadline, Grid).

restart_search(Ctx, Limit, Deadline, Grid) :-
    get_time(Now),
    Now < Deadline,
    Lim is min(Limit, Deadline - Now),
    (   catch(call_with_time_limit(Lim, random_grid(Ctx, G)),
              time_limit_exceeded,
              fail)
    ->  Grid = G
    ;   Limit1 is Limit * 1.3,
        restart_search(Ctx, Limit1, Deadline, Grid)
    ).

random_grid(Ctx, Grid) :-
    post_constraints(Ctx, Vs),
    random_label(Vs),
    !,
    Grid = Vs.

random_label(Vs) :-
    term_variables(Vs, Free),
    (   Free == []
    ->  true
    ;   smallest_domain(Free, V),
        fd_dom(V, Dom),
        findall(X, (X in Dom, label([X])), Xs),
        random_permutation(Xs, Perm),
        member(X, Perm),
        V #= X,
        random_label(Vs)
    ).

smallest_domain([V|Vs], Best) :-
    fd_size(V, S),
    smallest_domain(Vs, V, S, Best).

smallest_domain([], B, _, B).
smallest_domain([V|Vs], B0, S0, B) :-
    fd_size(V, S),
    (   S < S0
    ->  smallest_domain(Vs, V, S, B)
    ;   smallest_domain(Vs, B0, S0, B)
    ).
