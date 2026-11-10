:- module(geometry,
          [ known_rule/1,
            geometric_rule/1,
            cell_rc/3,
            cell_name/2,
            cells_names/2,
            houses/2,
            house_name/2,
            house_in/2,
            knight_pairs/1,
            king_pairs/1,
            orthogonal_pairs/1,
            orthogonal/2,
            adjacent/2,
            local_rule/1,
            build_context/4,
            build_context/5,
            ctx_rules/2,
            ctx_houses/2,
            ctx_cages/2,
            ctx_parity/2,
            ctx_extras/2,
            ctx_groups/2,
            peers/3,
            zeros/1
          ]).
:- encoding(utf8).

/** <module> Geometria do tabuleiro e regras de variantes

Células são indexadas de 0 a 80 (linha * 9 + coluna). Uma *casa* (house)
é um conjunto de 9 células que precisa conter os dígitos 1..9 exatamente
uma vez. As regras extras acrescentam novas casas (diagonais, janelas),
novas relações de vizinhança (anti-cavalo) ou novos grupos com soma
(gaiolas do Killer).

O contexto de uma partida é o termo

    ctx(Rules, Houses, Cages, Parity, Extras, PeersTable)

onde `Cages` é uma lista de `cage(Soma, Celulas)`, `Parity` é uma lista de
81 inteiros (0 = livre, 1 = ímpar, 2 = par), `Extras` é a lista de regras
locais `extra(Tipo, Celulas, Parametro)` (termômetros, setas, pontos...,
veja extras.pl) e `PeersTable` é um termo `peers/81` com a lista ordenada
de células que "enxergam" cada célula.
*/

known_rule(diagonal).
known_rule(hyper).
known_rule(antiknight).
known_rule(killer).
known_rule(parity).
known_rule(antiking).
known_rule(disjoint).
known_rule(nonconsecutive).
known_rule(R) :- local_rule(R).

%!  local_rule(?Rule) is nondet.
%
%   Regras locais: desenhadas sobre algumas células a partir de uma
%   solução pronta (como as gaiolas do Killer). Veja extras.pl.
local_rule(thermo).
local_rule(arrow).
local_rule(kropki).
local_rule(xv).
local_rule(whisper).
local_rule(renban).
local_rule(palindrome).
local_rule(between).

%!  geometric_rule(?Rule) is nondet.
%
%   Regras que só dependem da posição das células. As demais (killer,
%   parity) são derivadas de uma solução já pronta.
geometric_rule(diagonal).
geometric_rule(hyper).
geometric_rule(antiknight).
geometric_rule(antiking).
geometric_rule(disjoint).
geometric_rule(nonconsecutive).

cell_rc(I, R, C) :-
    R is I // 9,
    C is I mod 9.

cell_name(I, Name) :-
    cell_rc(I, R, C),
    R1 is R + 1,
    C1 is C + 1,
    format(atom(Name), 'L~wC~w', [R1, C1]).

cells_names(Cells, Text) :-
    maplist(cell_name, Cells, Names),
    atomic_list_concat(Names, ', ', Text).

zeros(L) :-
    length(L, 81),
    maplist(=(0), L).

		 /*******************************
		 *            CASAS             *
		 *******************************/

house(_, house(row, R, Cells)) :-
    between(0, 8, R),
    findall(I, (between(0, 8, C), I is R*9 + C), Cells).
house(_, house(col, C, Cells)) :-
    between(0, 8, C),
    findall(I, (between(0, 8, R), I is R*9 + C), Cells).
house(_, house(box, B, Cells)) :-
    between(0, 8, B),
    R0 is (B // 3) * 3,
    C0 is (B mod 3) * 3,
    square(R0, C0, Cells).
house(Rules, house(diag, 0, Cells)) :-
    memberchk(diagonal, Rules),
    findall(I, (between(0, 8, K), I is K*10), Cells).
house(Rules, house(diag, 1, Cells)) :-
    memberchk(diagonal, Rules),
    findall(I, (between(1, 9, K), I is K*8), Cells).
house(Rules, house(window, W, Cells)) :-
    memberchk(hyper, Rules),
    nth0(W, [1-1, 1-5, 5-1, 5-5], R0-C0),
    square(R0, C0, Cells).
house(Rules, house(disjoint, K, Cells)) :-
    memberchk(disjoint, Rules),
    between(0, 8, K),
    DR is K // 3,
    DC is K mod 3,
    findall(I,
            ( between(0, 2, BR),
              between(0, 2, BC),
              I is (BR*3 + DR)*9 + BC*3 + DC
            ),
            Cells).

square(R0, C0, Cells) :-
    findall(I,
            ( between(0, 2, DR),
              between(0, 2, DC),
              I is (R0+DR)*9 + C0 + DC
            ),
            Cells).

houses(Rules, Houses) :-
    findall(H, house(Rules, H), Houses).

house_name(house(row, N, _), Name)    :- N1 is N+1, format(atom(Name), 'linha ~w', [N1]).
house_name(house(col, N, _), Name)    :- N1 is N+1, format(atom(Name), 'coluna ~w', [N1]).
house_name(house(box, N, _), Name)    :- N1 is N+1, format(atom(Name), 'bloco ~w', [N1]).
house_name(house(diag, 0, _), 'diagonal principal').
house_name(house(diag, 1, _), 'diagonal secundária').
house_name(house(window, N, _), Name) :- N1 is N+1, format(atom(Name), 'janela extra ~w', [N1]).
house_name(house(disjoint, N, _), Name) :- N1 is N+1, format(atom(Name), 'grupo disjunto ~w', [N1]).
house_name(cage(Sum, _), Name)        :- format(atom(Name), 'gaiola de soma ~w', [Sum]).

%!  house_in(+House, -Phrase) is det.
%
%   Nome da casa com a preposição contraída correta ("na linha 3",
%   "no bloco 2").
house_in(H, Phrase) :-
    house_name(H, Name),
    (   ( H = house(box, _, _) ; H = house(disjoint, _, _) )
    ->  Prep = no
    ;   Prep = na
    ),
    format(atom(Phrase), '~w ~w', [Prep, Name]).

		 /*******************************
		 *         VIZINHANÇAS          *
		 *******************************/

%!  knight_pairs(-Pairs) is det.
%
%   Todos os pares I-J (I < J) de células separadas por um salto de cavalo.
knight_pairs(Pairs) :-
    findall(I-J,
            ( between(0, 80, I),
              cell_rc(I, R, C),
              member(DR-DC, [1-2, 2-1, 1-(-2), 2-(-1)]),
              R2 is R + DR,
              C2 is C + DC,
              R2 =< 8, C2 >= 0, C2 =< 8,
              J is R2*9 + C2
            ),
            Pairs).

%!  king_pairs(-Pairs) is det.
%
%   Pares I-J (I < J) vizinhos na diagonal (regra anti-rei). Os vizinhos
%   ortogonais já estão na mesma linha ou coluna.
king_pairs(Pairs) :-
    offset_pairs([1-1, 1-(-1)], Pairs).

%!  orthogonal_pairs(-Pairs) is det.
%
%   Pares I-J (I < J) lado a lado (regra não-consecutivo).
orthogonal_pairs(Pairs) :-
    offset_pairs([0-1, 1-0], Pairs).

offset_pairs(Offsets, Pairs) :-
    findall(I-J,
            ( between(0, 80, I),
              cell_rc(I, R, C),
              member(DR-DC, Offsets),
              R2 is R + DR,
              C2 is C + DC,
              between(0, 8, R2),
              between(0, 8, C2),
              J is R2*9 + C2
            ),
            Pairs).

%!  adjacent(+I, -J) is nondet.
%
%   Vizinhança em 8 direções (usada para desenhar linhas).
adjacent(I, J) :-
    cell_rc(I, R, C),
    member(DR-DC, [(-1)-(-1), (-1)-0, (-1)-1, 0-(-1), 0-1, 1-(-1), 1-0, 1-1]),
    R2 is R + DR,
    C2 is C + DC,
    between(0, 8, R2),
    between(0, 8, C2),
    J is R2*9 + C2.

orthogonal(I, J) :-
    cell_rc(I, R, C),
    member(DR-DC, [0-1, 0-(-1), 1-0, (-1)-0]),
    R2 is R + DR,
    C2 is C + DC,
    between(0, 8, R2),
    between(0, 8, C2),
    J is R2*9 + C2.

		 /*******************************
		 *           CONTEXTO           *
		 *******************************/

build_context(Rules, Cages, Parity, Ctx) :-
    build_context(Rules, Cages, Parity, [], Ctx).

%!  build_context(+Rules, +Cages, +Parity, +Extras, -Ctx) is det.
%
%   Com a regra não-consecutivo, cada par de vizinhas ortogonais vira
%   também uma regra local extra(nonconsecutive, [I, J], none), para o
%   motor lógico e o CLP(FD) tratarem tudo do mesmo jeito.
build_context(Rules0, Cages, Parity, Extras0,
              ctx(Rules, Houses, Cages, Parity, Extras, PeersT)) :-
    sort(Rules0, Rules),
    houses(Rules, Houses),
    findall(Cs, member(house(_,_,Cs), Houses), G1),
    findall(Cs, member(cage(_,Cs), Cages), G2),
    append(G1, G2, Groups),
    (   memberchk(antiknight, Rules)
    ->  knight_pairs(KP)
    ;   KP = []
    ),
    (   memberchk(antiking, Rules)
    ->  king_pairs(KG)
    ;   KG = []
    ),
    append(KP, KG, Pairs),
    (   memberchk(nonconsecutive, Rules)
    ->  orthogonal_pairs(OP),
        findall(extra(nonconsecutive, [I, J], none), member(I-J, OP), NC)
    ;   NC = []
    ),
    append(Extras0, NC, Extras),
    findall(Ps, (between(0, 80, I), cell_peers(I, Groups, Pairs, Ps)), PL),
    PeersT =.. [peers|PL].

cell_peers(I, Groups, KP, Peers) :-
    findall(J, (member(G, Groups), memberchk(I, G), member(J, G), J =\= I), J1),
    findall(J, (member(I-J, KP) ; member(J-I, KP)), J2),
    append(J1, J2, J3),
    sort(J3, Peers).

ctx_rules(ctx(R, _, _, _, _, _), R).
ctx_houses(ctx(_, H, _, _, _, _), H).
ctx_cages(ctx(_, _, C, _, _, _), C).
ctx_parity(ctx(_, _, _, P, _, _), P).
ctx_extras(ctx(_, _, _, _, E, _), E).

%!  ctx_groups(+Ctx, -Groups) is det.
%
%   Todos os grupos de dígitos distintos: as casas e as gaiolas.
ctx_groups(ctx(_, Houses, Cages, _, _, _), Groups) :-
    append(Houses, Cages, Groups).

peers(ctx(_, _, _, _, _, T), I, Peers) :-
    A is I + 1,
    arg(A, T, Peers).
