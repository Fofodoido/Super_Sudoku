:- module(generator,
          [ generate/4,
            difficulty/5,
            make_cages/2,
            make_parity/2
          ]).
:- encoding(utf8).
:- use_module(library(random)).
:- use_module(library(lists)).
:- use_module(library(apply)).
:- use_module(library(ordsets)).
:- use_module(geometry).
:- use_module(solver).
:- use_module(logic).
:- use_module(templates).
:- use_module(extras).

/** <module> Gerador de puzzles

  1. Gera uma grade completa aleatória respeitando as regras geométricas
     (diagonais, janelas, anti-cavalo) via CLP(FD).
  2. A partir da solução, deriva as gaiolas do Killer, as marcas de
     paridade e as regras locais (termômetros, setas, pontos, linhas;
     veja extras.pl).
  3. Remove pistas (em pares simétricos, exceto no Killer) enquanto a
     solução continuar única E o motor lógico continuar resolvendo com
     o repertório permitido para a dificuldade.
  4. Avalia o resultado; se ficou fácil demais para a dificuldade pedida,
     tenta de novo (até um limite de tempo) e devolve o melhor candidato.
*/

%!  difficulty(?Id, ?MaxLevel, ?MinLevel, ?MinClues, ?Label) is nondet.
difficulty(facil,   1, 1, 36, 'Fácil').
difficulty(medio,   2, 2, 30, 'Médio').
difficulty(dificil, 4, 3, 24, 'Difícil').
difficulty(extremo, 5, 4, 20, 'Extremo').

%!  generate(+Rules, +Difficulty, +Seed, -Game) is semidet.
%
%   Game = game(Ctx, Puzzle, Solution, Rating).
generate(Rules0, Diff, Seed, Game) :-
    sort(Rules0, Rules),
    set_random(seed(Seed)),
    difficulty(Diff, MaxL, MinL, MinClues0, _),
    (   memberchk(killer, Rules)
    ->  MinClues is MinClues0 // 4
    ;   include(local_rule, Rules, [_|_])
    ->  MinClues is MinClues0 // 2
    ;   MinClues = MinClues0
    ),
    get_time(T0),
    Deadline is T0 + 10,
    once(attempts(5, Deadline, Rules, MaxL, MinL, MinClues, none, Game)).

%   Cada tentativa gera um puzzle completo; paramos quando um atinge o
%   nível mínimo pedido, quando acabam as tentativas ou quando o prazo
%   estoura (devolvendo o melhor obtido até ali).
attempts(N, Deadline, Rules, MaxL, MinL, MinClues, Best0, Game) :-
    (   one_attempt(Rules, MaxL, MinClues, Deadline, G)
    ->  better(G, Best0, Best1)
    ;   Best1 = Best0
    ),
    get_time(Now),
    N1 is N - 1,
    (   Best1 = game(_, _, _, rating(L, _)), L >= MinL
    ->  Game = Best1
    ;   ( N1 =< 0 ; Now > Deadline )
    ->  Best1 \== none,
        Game = Best1
    ;   attempts(N1, Deadline, Rules, MaxL, MinL, MinClues, Best1, Game)
    ).

better(G, none, G) :- !.
better(G, B, Best) :-
    G = game(_, _, _, rating(LG, _)),
    B = game(_, _, _, rating(LB, _)),
    (   LG > LB
    ->  Best = G
    ;   Best = B
    ).

one_attempt(Rules, MaxL, MinClues, Deadline, game(Ctx, Puzzle, Solution, Rating)) :-
    include(geometric_rule, Rules, GeoRules),
    zeros(Z),
    build_context(GeoRules, [], Z, GeoCtx),
    full_grid(GeoRules, GeoCtx, Solution),
    (   memberchk(killer, Rules)
    ->  make_cages(Solution, Cages)
    ;   Cages = []
    ),
    (   memberchk(parity, Rules)
    ->  make_parity(Solution, Parity)
    ;   Parity = Z
    ),
    make_extras(Rules, Solution, Extras),
    build_context(Rules, Cages, Parity, Extras, Ctx),
    removal_order(Rules, Order),
    dig(Order, Ctx, Solution, MaxL, MinClues, Deadline, Solution, Puzzle),
    rate(Ctx, Puzzle, Solution, Rating).

%   Busca aleatória com reinícios; se a combinação de regras for de
%   cauda pesada e houver grade-modelo, usa a grade-modelo embaralhada.
full_grid(GeoRules, GeoCtx, Solution) :-
    (   template(GeoRules, _)
    ->  (   random_solution(GeoCtx, 1, S)
        ->  Solution = S
        ;   template_grid(GeoRules, Solution)
        )
    ;   random_solution(GeoCtx, Solution)
    ).

removal_order(Rules, Order) :-
    (   memberchk(killer, Rules)
    ->  findall([I], between(0, 80, I), Groups)
    ;   findall(G, (between(0, 40, I), J is 80 - I, sort([I, J], G)), Groups)
    ),
    random_permutation(Groups, Order).

dig([], _, _, _, _, _, P, P).
dig([G|Gs], Ctx, Sol, MaxL, MinClues, Deadline, P0, P) :-
    exclude(==(0), P0, Clues),
    length(Clues, N),
    length(G, K),
    get_time(Now),
    (   ( N - K < MinClues ; Now > Deadline )
    ->  P1 = P0
    ;   blank(G, P0, Pt),
        (   acceptable(Ctx, Pt, Sol, MaxL)
        ->  P1 = Pt
        ;   P1 = P0
        )
    ),
    dig(Gs, Ctx, Sol, MaxL, MinClues, Deadline, P1, P).

%   Todas as técnicas até o nível 4 são deduções corretas: se o motor
%   lógico resolve o puzzle sem chutar, a solução é necessariamente
%   única. Só no nível 5 (que admite bifurcação) é preciso contar
%   soluções com CLP(FD).
acceptable(Ctx, P, Sol, MaxL) :-
    (   MaxL < 5
    ->  solves_within(Ctx, P, Sol, MaxL)
    ;   solves_within(Ctx, P, Sol, 4)
    ->  true
    ;   unique_solution(Ctx, P)
    ).

blank([], P, P).
blank([I|Is], P0, P) :-
    nth0(I, P0, _, Rest),
    nth0(I, P1, 0, Rest),
    blank(Is, P1, P).

		 /*******************************
		 *            KILLER            *
		 *******************************/

%!  make_cages(+Solution, -Cages) is det.
%
%   Particiona o tabuleiro em gaiolas ortogonalmente conexas, sem dígitos
%   repetidos, com 2 a 5 células (raramente 1 ou 6).
make_cages(Solution, Cages) :-
    SolT =.. [s|Solution],
    numlist(0, 80, All),
    random_permutation(All, Order),
    grow_cages(Order, SolT, [], [], Cages0),
    merge_singletons(Cages0, SolT, Cages1),
    msort(Cages1, Cages).

grow_cages([], _, _, Cages, Cages).
grow_cages([I|Is], SolT, Assigned, Acc, Cages) :-
    (   ord_memberchk(I, Assigned)
    ->  grow_cages(Is, SolT, Assigned, Acc, Cages)
    ;   random_member(Size, [2, 2, 3, 3, 3, 4, 4, 5]),
        grow([I], Size, SolT, Assigned, Cells),
        ord_union(Assigned, Cells, Assigned1),
        cage_sum(Cells, SolT, S),
        grow_cages(Is, SolT, Assigned1, [cage(S, Cells)|Acc], Cages)
    ).

grow(Cells, Size, SolT, Assigned, Out) :-
    length(Cells, N),
    (   N >= Size
    ->  sort(Cells, Out)
    ;   findall(J,
                ( member(C, Cells),
                  orthogonal(C, J),
                  \+ ord_memberchk(J, Assigned),
                  \+ memberchk(J, Cells),
                  digit(SolT, J, DJ),
                  \+ ( member(K, Cells), digit(SolT, K, DJ) )
                ),
                Js0),
        sort(Js0, Js),
        (   Js == []
        ->  sort(Cells, Out)
        ;   random_member(J, Js),
            grow([J|Cells], Size, SolT, Assigned, Out)
        )
    ).

merge_singletons(Cages0, SolT, Cages) :-
    (   select(cage(_, [I]), Cages0, Rest),
        select(cage(_, Cs), Rest, Rest2),
        length(Cs, L), L < 6,
        member(J, Cs), orthogonal(I, J),
        digit(SolT, I, D),
        \+ ( member(K, Cs), digit(SolT, K, D) )
    ->  ord_add_element(Cs, I, Cs1),
        cage_sum(Cs1, SolT, S1),
        merge_singletons([cage(S1, Cs1)|Rest2], SolT, Cages)
    ;   Cages = Cages0
    ).

digit(SolT, I, D) :-
    A is I + 1,
    arg(A, SolT, D).

cage_sum(Cells, SolT, Sum) :-
    maplist(digit(SolT), Cells, Ds),
    sum_list(Ds, Sum).

		 /*******************************
		 *           PARIDADE           *
		 *******************************/

%!  make_parity(+Solution, -Parity) is det.
%
%   Marca ~35% das células como ímpar (1) ou par (2).
make_parity(Solution, Parity) :-
    maplist(parity_mark, Solution, Parity).

parity_mark(D, P) :-
    random(X),
    (   X < 0.35
    ->  (   D mod 2 =:= 1 -> P = 1 ; P = 2 )
    ;   P = 0
    ).
