:- module(logic,
          [ technique/3,
            initial_state/3,
            find_step/5,
            apply_step/4,
            hint/4,
            rate/4,
            solves_within/4,
            prune_chain/2,
            level_label/2
          ]).
:- encoding(utf8).
:- use_module(library(lists)).
:- use_module(library(apply)).
:- use_module(library(ordsets)).
:- use_module(library(pairs)).
:- use_module(library(clpfd)).
:- use_module(geometry).
:- use_module(extras).

:- discontiguous step_for/5.

/** <module> Motor de raciocínio "humano"

Resolve o tabuleiro passo a passo usando técnicas que uma pessoa usaria,
na ordem da mais simples para a mais difícil. É usado para:

  * dar dicas explicadas (cadeia de passos até a próxima colocação);
  * classificar a dificuldade de um puzzle (técnica mais difícil exigida);
  * guiar o gerador (só remove pistas enquanto o puzzle continua
    resolvível com o repertório permitido para a dificuldade).

Estado: st(Values, Cands), dois termos v/81 e c/81. Values guarda o
dígito de cada célula (0 = vazia) e Cands a lista ordenada de candidatos
de cada célula vazia ([] nas preenchidas).

Um passo é

    step(Tecnica, Foco, Regiao, Eliminacoes, Colocacao, Mensagem)

onde Eliminacoes é uma lista ordenada de Celula-Digito e Colocacao é
`none` ou Celula-Digito.
*/

%!  technique(?Id, ?Level, ?Name) is nondet.
%
%   Repertório em ordem de tentativa.
technique(naked_single,     1, 'Candidato único').
technique(hidden_single,    1, 'Posição única').
technique(cage_remainder,   1, 'Soma restante da gaiola').
technique(cage_combination, 2, 'Combinações da gaiola').
technique(local_rule,       2, 'Regra local').
technique(intersection,     2, 'Interseção (candidatos travados)').
technique(rule_of_45,       3, 'Regra dos 45').
technique(naked_pair,       3, 'Par nu').
technique(hidden_pair,      3, 'Par escondido').
technique(naked_triple,     3, 'Trio nu').
technique(hidden_triple,    4, 'Trio escondido').
technique(x_wing,           4, 'X-Wing').
technique(bifurcation,      5, 'Bifurcação (tentativa e erro)').

level_label(1, 'Fácil').
level_label(2, 'Médio').
level_label(3, 'Difícil').
level_label(4, 'Muito difícil').
level_label(5, 'Extremo').

		 /*******************************
		 *            ESTADO            *
		 *******************************/

val(VT, I, V) :- A is I + 1, arg(A, VT, V).
cands(CT, I, C) :- A is I + 1, arg(A, CT, C).

has_cand(CT, D, I) :-
    cands(CT, I, Cs),
    memberchk(D, Cs).

is_empty(VT, I) :- val(VT, I, 0).

group_cells(house(_, _, Cells), Cells).
group_cells(cage(_, Cells), Cells).

%!  initial_state(+Ctx, +Values:list, -State) is det.
initial_state(Ctx, Values, st(VT, CT)) :-
    VT =.. [v|Values],
    ctx_parity(Ctx, Parity),
    numlist(0, 80, Is),
    maplist(init_cell(Ctx, VT), Is, Values, Parity, Cands),
    CT =.. [c|Cands].

init_cell(_, _, _, V, _, []) :-
    V > 0, !.
init_cell(Ctx, VT, I, 0, P, Cs) :-
    peers(Ctx, I, Ps),
    findall(D, (member(J, Ps), val(VT, J, D), D > 0), Used0),
    sort(Used0, Used),
    numlist(1, 9, All),
    ord_subtract(All, Used, C0),
    parity_filter(P, C0, Cs).

parity_filter(0, C, C).
parity_filter(1, C0, C) :- include(odd, C0, C).
parity_filter(2, C0, C) :- exclude(odd, C0, C).

odd(D) :- D mod 2 =:= 1.

solved(st(VT, _)) :-
    \+ arg(_, VT, 0).

%!  apply_step(+Ctx, +Step, +State0, -State) is det.
apply_step(Ctx, step(_, _, _, Elims, Place, _), st(VT0, CT0), st(VT, CT)) :-
    CT0 =.. [c|Cs0],
    numlist(0, 80, Is),
    maplist(eliminate(Elims), Is, Cs0, Cs1),
    (   Place = I-D
    ->  VT0 =.. [v|Vs0],
        set_nth0(I, Vs0, D, Vs),
        VT =.. [v|Vs],
        peers(Ctx, I, Ps),
        maplist(place_effect(I, D, Ps), Is, Cs1, Cs)
    ;   VT = VT0,
        Cs = Cs1
    ),
    CT =.. [c|Cs].

eliminate(Elims, I, C0, C) :-
    findall(D, member(I-D, Elims), Ds0),
    sort(Ds0, Ds),
    ord_subtract(C0, Ds, C).

place_effect(I, _, _, I, _, []) :- !.
place_effect(_, D, Ps, J, C0, C) :-
    (   ord_memberchk(J, Ps)
    ->  ord_del_element(C0, D, C)
    ;   C = C0
    ).

set_nth0(0, [_|T], X, [X|T]) :- !.
set_nth0(N, [H|T], X, [H|T2]) :-
    N1 is N - 1,
    set_nth0(N1, T, X, T2).

		 /*******************************
		 *        BUSCA DE PASSOS       *
		 *******************************/

%!  find_step(+Ctx, +State, +MaxLevel, +Solution, -Step) is semidet.
%
%   Primeiro passo aplicável usando técnicas de nível =< MaxLevel.
find_step(Ctx, St, MaxLevel, Sol, Step) :-
    technique(T, L, _),
    L =< MaxLevel,
    step_for(T, Ctx, St, Sol, Step),
    !.

% --- Candidato único -------------------------------------------------

step_for(naked_single, Ctx, st(_, CT), _,
         step(naked_single, [I], [], [], I-D, Msg)) :-
    arg(A, CT, [D]),
    I is A - 1,
    !,
    cell_name(I, N),
    constraint_summary(Ctx, I, Why),
    format(atom(Msg),
           'A célula ~w só admite o dígito ~w: todos os outros já foram descartados por ~w.',
           [N, D, Why]).

% --- Posição única ----------------------------------------------------

step_for(hidden_single, Ctx, st(VT, CT), _,
         step(hidden_single, [I], Cells, [], I-D, Msg)) :-
    ctx_houses(Ctx, Hs),
    member(H, Hs),
    H = house(_, _, Cells),
    between(1, 9, D),
    \+ ( member(J, Cells), val(VT, J, D) ),
    include(has_cand(CT, D), Cells, [I]),
    !,
    house_in(H, Where),
    cell_name(I, N),
    format(atom(Msg),
           'Olhe ~w: o dígito ~w ainda não aparece ali e a única célula que pode recebê-lo é ~w.',
           [Where, D, N]).

% --- Soma restante da gaiola (Killer) --------------------------------

step_for(cage_remainder, Ctx, st(VT, CT), _,
         step(cage_remainder, [X], Cells, [], X-D, Msg)) :-
    ctx_cages(Ctx, Cages),
    member(cage(Sum, Cells), Cages),
    partition(is_empty(VT), Cells, [X], Filled),
    maplist(val(VT), Filled, FV),
    sum_list(FV, FS),
    D is Sum - FS,
    cands(CT, X, XC),
    memberchk(D, XC),
    !,
    cell_name(X, XN),
    format(atom(Msg),
           'A gaiola de soma ~w já tem ~w nas outras células. Falta só ~w, então ~w = ~w - ~w = ~w.',
           [Sum, FS, XN, XN, Sum, FS, D]).

% --- Combinações da gaiola (Killer) ----------------------------------

step_for(cage_combination, Ctx, st(VT, CT), _,
         step(cage_combination, Empty, Cells, Elims, none, Msg)) :-
    ctx_cages(Ctx, Cages),
    member(cage(Sum, Cells), Cages),
    partition(is_empty(VT), Cells, Empty, Filled),
    Empty \== [],
    maplist(val(VT), Filled, FV),
    sum_list(FV, FS),
    Rem is Sum - FS,
    maplist(cands(CT), Empty, CandLists),
    findall(Ds, assign(CandLists, FV, Rem, Ds), Assignments),
    Assignments \== [],
    findall(I-D,
            ( nth0(K, Empty, I),
              nth0(K, CandLists, Cs),
              member(D, Cs),
              \+ ( member(As, Assignments), nth0(K, As, D) )
            ),
            Elims0),
    Elims0 \== [],
    sort(Elims0, Elims),
    !,
    findall(Set, (member(As, Assignments), msort(As, Set)), Sets0),
    sort(Sets0, Sets),
    maplist(digits_text, Sets, SetTexts),
    atomic_list_concat(SetTexts, ' ou ', Combos),
    elims_text(Elims, ElimText),
    length(Empty, NE),
    format(atom(Msg),
           'A gaiola de soma ~w precisa completar ~w com ~w célula(s) vazia(s), sem repetir dígitos. As únicas combinações que cabem nos candidatos são ~w. Portanto: ~w.',
           [Sum, Rem, NE, Combos, ElimText]).

assign([], _, 0, []).
assign([Cs|Css], Used, Rem, [D|Ds]) :-
    length(Css, Left),
    member(D, Cs),
    D =< Rem,
    \+ memberchk(D, Used),
    Rem1 is Rem - D,
    Rem1 >= Left,
    Rem1 =< Left * 9,
    assign(Css, [D|Used], Rem1, Ds).

% --- Regra local (termômetro, seta, kropki, X/V, linhas...) ----------
%
% Uma técnica para todas as regras locais: um candidato D de uma célula
% sai se, fixando D, não existe NENHUMA forma de completar a regra com
% os candidatos que sobraram nas outras células dela. O teste usa as
% MESMAS restrições CLP(FD) do resolvedor (extras:post_extra_vars/3):
% cada candidato vira um pequeno problema de decisão "tem solução?".

step_for(local_rule, Ctx, st(VT, CT), _,
         step(local_rule, Empty, Cells, Elims, none, Msg)) :-
    ctx_extras(Ctx, Extras),
    member(E, Extras),
    E = extra(Type, Cells, _),
    include(is_empty(VT), Cells, Empty),
    Empty \== [],
    unsupported(Ctx, VT, CT, E, Elims0),
    Elims0 \== [],
    sort(Elims0, Elims),
    !,
    extra_phrase(E, Phrase),
    capitalize(Phrase, Phrase1),
    extra_reason(Type, Reason),
    elims_text(Elims, ElimText),
    format(atom(Msg),
           '~w: ~w. Testando cada candidato que sobrou, alguns não cabem em nenhuma combinação válida da regra. Portanto: ~w.',
           [Phrase1, Reason, ElimText]).

unsupported(Ctx, VT, CT, extra(Type, Cells, Param), Elims) :-
    maplist(cell_domain(VT, CT), Cells, Vs),
    distinct_peers(Ctx, Cells, Vs),
    post_extra_vars(Type, Param, Vs),
    findall(I-D,
            ( nth0(K, Cells, I),
              is_empty(VT, I),
              cands(CT, I, Cs),
              member(D, Cs),
              nth0(K, Vs, V),
              \+ ( V = D, once(label(Vs)) )
            ),
            Elims).

cell_domain(VT, CT, I, V) :-
    val(VT, I, D),
    (   D > 0
    ->  V = D
    ;   cands(CT, I, Cs),
        Cs = [_|_],
        drep(Cs, Dom),
        V in Dom
    ).

drep([D], D) :- !.
drep([D|Ds], D \/ R) :-
    drep(Ds, R).

% Células da mesma regra que se enxergam (mesma linha, gaiola...) não
% podem repetir dígito.
distinct_peers(Ctx, Cells, Vs) :-
    findall(K1-K2,
            ( nth0(K1, Cells, I), nth0(K2, Cells, J), K1 < K2,
              peers(Ctx, I, Ps), ord_memberchk(J, Ps) ),
            Pairs),
    maplist(pair_differs(Vs), Pairs).

pair_differs(Vs, K1-K2) :-
    nth0(K1, Vs, A),
    nth0(K2, Vs, B),
    A #\= B.

% --- Interseção / candidatos travados ---------------------------------
%
% Generalização de "pointing" e "box/line reduction": se todas as
% posições possíveis de D em uma casa enxergam a célula X, então X não
% pode ser D. Funciona com qualquer regra extra (diagonais, janelas,
% anti-cavalo, gaiolas).

step_for(intersection, Ctx, st(_, CT), _,
         step(intersection, Pos, Cells, Elims, none, Msg)) :-
    ctx_houses(Ctx, Hs),
    member(H, Hs),
    H = house(_, _, Cells),
    between(1, 9, D),
    include(has_cand(CT, D), Cells, Pos),
    Pos = [_, _|_],
    maplist(peers(Ctx), Pos, PeerSets),
    ord_intersection(PeerSets, Common),
    include(has_cand(CT, D), Common, Targets),
    Targets \== [],
    !,
    findall(X-D, member(X, Targets), Elims),
    house_in(H, Where),
    cells_names(Pos, PosText),
    cells_names(Targets, TargetText),
    format(atom(Msg),
           'O dígito ~w, ~w, está preso às células ~w. Seja qual for a certa, ela enxerga ~w — então o ~w sai dessas células.',
           [D, Where, PosText, TargetText, D]).

% --- Regra dos 45 (Killer) --------------------------------------------

step_for(rule_of_45, Ctx, st(VT, CT), _,
         step(rule_of_45, [X], Cells, [], X-D, Msg)) :-
    ctx_cages(Ctx, Cages),
    Cages \== [],
    ctx_houses(Ctx, Hs),
    member(H, Hs),
    H = house(_, _, Cells),
    include(cage_inside(Cells), Cages, Inside),
    Inside \== [],
    findall(C, (member(cage(_, Cs), Inside), member(C, Cs)), Covered0),
    sort(Covered0, Covered),
    ord_subtract(Cells, Covered, Rest),
    partition(is_empty(VT), Rest, [X], FilledRest),
    findall(S, member(cage(S, _), Inside), Sums),
    sum_list(Sums, CageSum),
    maplist(val(VT), FilledRest, FV),
    sum_list(FV, FilledSum),
    D is 45 - CageSum - FilledSum,
    cands(CT, X, XC),
    memberchk(D, XC),
    !,
    house_in(H, Where),
    capitalize(Where, Where1),
    cell_name(X, XN),
    length(Inside, NC),
    format(atom(Msg),
           'Toda região soma 45. ~w, as ~w gaiola(s) totalmente contidas somam ~w e as demais células já preenchidas somam ~w. Sobra uma única célula: ~w = 45 - ~w - ~w = ~w.',
           [Where1, NC, CageSum, FilledSum, XN, CageSum, FilledSum, D]).

cage_inside(Cells, cage(_, Cs)) :-
    ord_subset(Cs, Cells).

% --- Subconjuntos nus e escondidos ------------------------------------

step_for(naked_pair, Ctx, St, _, Step)    :- naked_subset(2, naked_pair, Ctx, St, Step).
step_for(hidden_pair, Ctx, St, _, Step)   :- hidden_subset(2, hidden_pair, Ctx, St, Step).
step_for(naked_triple, Ctx, St, _, Step)  :- naked_subset(3, naked_triple, Ctx, St, Step).
step_for(hidden_triple, Ctx, St, _, Step) :- hidden_subset(3, hidden_triple, Ctx, St, Step).

naked_subset(K, Tech, Ctx, st(_, CT), step(Tech, Sub, Cells, Elims, none, Msg)) :-
    ctx_groups(Ctx, Groups),
    member(G, Groups),
    group_cells(G, Cells),
    include(small_cands(CT, K), Cells, Small),
    comb(K, Small, Sub),
    maplist(cands(CT), Sub, CSs),
    ord_union(CSs, U),
    length(U, K),
    maplist(peers(Ctx), Sub, PS),
    ord_intersection(PS, Common),
    findall(X-D, (member(X, Common), cands(CT, X, Cx), member(D, Cx), ord_memberchk(D, U)), E0),
    E0 \== [],
    sort(E0, Elims),
    !,
    house_in(G, Where),
    cells_names(Sub, SubText),
    digits_text(U, UText),
    elims_text(Elims, ElimText),
    format(atom(Msg),
           'As células ~w, ~w, só aceitam juntas os dígitos ~w. Esses ~w dígitos ficam obrigatoriamente nelas, então saem de todas as células que enxergam o grupo inteiro: ~w.',
           [SubText, Where, UText, K, ElimText]).

small_cands(CT, K, I) :-
    cands(CT, I, Cs),
    length(Cs, L),
    L >= 2,
    L =< K.

hidden_subset(K, Tech, Ctx, st(_, CT), step(Tech, CellSet, Cells, Elims, none, Msg)) :-
    ctx_houses(Ctx, Hs),
    member(H, Hs),
    H = house(_, _, Cells),
    findall(D-Pos,
            ( between(1, 9, D),
              include(has_cand(CT, D), Cells, Pos),
              length(Pos, L),
              L >= 1,
              L =< K
            ),
            DP),
    comb(K, DP, Sel),
    pairs_keys_values(Sel, Ds, PosLists),
    ord_union(PosLists, CellSet),
    length(CellSet, K),
    findall(X-E, (member(X, CellSet), cands(CT, X, Cx), member(E, Cx), \+ memberchk(E, Ds)), E0),
    E0 \== [],
    sort(E0, Elims),
    !,
    house_in(H, Where0),
    capitalize(Where0, Where),
    digits_text(Ds, DText),
    cells_names(CellSet, CText),
    elims_text(Elims, ElimText),
    format(atom(Msg),
           '~w, os dígitos ~w só podem ir para as células ~w. Como essas células precisam guardar exatamente esses dígitos, os outros candidatos delas caem: ~w.',
           [Where, DText, CText, ElimText]).

% --- X-Wing -----------------------------------------------------------

step_for(x_wing, _, st(_, CT), _,
         step(x_wing, Corners, Unit, Elims, none, Msg)) :-
    between(1, 9, D),
    member(Orient-Cross, [row-col, col-row]),
    findall(N-Pos,
            ( between(0, 8, N),
              line_cells(Orient, N, Cells),
              include(has_cand(CT, D), Cells, Pos),
              Pos = [_, _]
            ),
            Lines),
    comb(2, Lines, [N1-[A1, B1], N2-[A2, B2]]),
    cross_index(Orient, A1, CA), cross_index(Orient, A2, CA),
    cross_index(Orient, B1, CB), cross_index(Orient, B2, CB),
    Corners = [A1, B1, A2, B2],
    line_cells(Orient, N1, L1),
    line_cells(Orient, N2, L2),
    append(L1, L2, Unit),
    findall(X-D,
            ( member(CN, [CA, CB]),
              line_cells(Cross, CN, Cs),
              member(X, Cs),
              \+ memberchk(X, Corners),
              has_cand(CT, D, X)
            ),
            E0),
    E0 \== [],
    sort(E0, Elims),
    !,
    line_word(Orient, OW),
    line_word(Cross, CW),
    N1p is N1 + 1, N2p is N2 + 1, CAp is CA + 1, CBp is CB + 1,
    elims_text(Elims, ElimText),
    format(atom(Msg),
           'Nas ~ws ~w e ~w o dígito ~w só pode estar nas ~ws ~w e ~w, formando um retângulo (X-Wing). Em qualquer caso ele ocupa essas duas ~ws dentro do retângulo, então sai do resto delas: ~w.',
           [OW, N1p, N2p, D, CW, CAp, CBp, CW, ElimText]).

line_cells(row, N, Cells) :- findall(I, (between(0, 8, C), I is N*9 + C), Cells).
line_cells(col, N, Cells) :- findall(I, (between(0, 8, R), I is R*9 + N), Cells).

cross_index(row, I, C) :- C is I mod 9.
cross_index(col, I, R) :- R is I // 9.

line_word(row, linha).
line_word(col, coluna).

% --- Bifurcação -------------------------------------------------------

step_for(bifurcation, _, st(VT, CT), Sol,
         step(bifurcation, [I], [], [], I-D, Msg)) :-
    findall(L-J, (arg(A, VT, 0), J is A - 1, cands(CT, J, Cs), length(Cs, L)), LJ),
    msort(LJ, [_-I|_]),
    nth0(I, Sol, D),
    cands(CT, I, Cs),
    !,
    cell_name(I, N),
    digits_text(Cs, CText),
    format(atom(Msg),
           'Nenhuma técnica do repertório avança daqui. Teste hipóteses na célula ~w (candidatos ~w): qualquer valor diferente de ~w acaba em contradição. Logo ~w = ~w.',
           [N, CText, D, N, D]).

		 /*******************************
		 *        TEXTOS AUXILIARES     *
		 *******************************/

capitalize(Atom, Cap) :-
    sub_atom(Atom, 0, 1, _, First),
    sub_atom(Atom, 1, _, 0, Rest),
    upcase_atom(First, Up),
    atom_concat(Up, Rest, Cap).

digits_text(Ds, Text) :-
    atomic_list_concat(Ds, ',', Inner),
    format(atom(Text), '{~w}', [Inner]).

elims_text(Elims, Text) :-
    group_elims(Elims, Groups),
    maplist(elim_group_text, Groups, Parts),
    atomic_list_concat(Parts, '; ', Text).

group_elims(Elims, Groups) :-
    transpose_pairs(Elims, ByDigit0),   % D-I
    keysort(ByDigit0, ByDigit),
    group_pairs_by_key(ByDigit, Groups).

elim_group_text(D-Cells, Text) :-
    cells_names(Cells, CT),
    format(atom(Text), 'remover ~w de ~w', [D, CT]).

constraint_summary(Ctx, I, Why) :-
    ctx_houses(Ctx, Hs),
    findall(N, (member(H, Hs), H = house(_, _, Cs), memberchk(I, Cs), house_name(H, N)), Ns0),
    ctx_rules(Ctx, Rules),
    (   memberchk(antiknight, Rules)
    ->  append(Ns0, ['saltos de cavalo'], Ns01)
    ;   Ns01 = Ns0
    ),
    (   memberchk(antiking, Rules)
    ->  append(Ns01, ['vizinhas na diagonal'], Ns1)
    ;   Ns1 = Ns01
    ),
    ctx_cages(Ctx, Cages),
    (   member(cage(S, Cs), Cages), memberchk(I, Cs)
    ->  format(atom(CN), 'gaiola de soma ~w', [S]),
        append(Ns1, [CN], Ns2)
    ;   Ns2 = Ns1
    ),
    ctx_parity(Ctx, Parity),
    nth0(I, Parity, P),
    (   P =:= 1 -> append(Ns2, ['marca de ímpar'], Ns)
    ;   P =:= 2 -> append(Ns2, ['marca de par'], Ns)
    ;   Ns = Ns2
    ),
    atomic_list_concat(Ns, ', ', Why).

%!  comb(+K, +List, -Comb) is nondet.
comb(0, _, []) :- !.
comb(K, [X|Xs], [X|Ys]) :-
    K1 is K - 1,
    comb(K1, Xs, Ys).
comb(K, [_|Xs], Ys) :-
    length(Xs, L),
    L >= K,
    comb(K, Xs, Ys).

		 /*******************************
		 *       DICAS E AVALIAÇÃO      *
		 *******************************/

%!  hint(+Ctx, +Board, +Solution, -Result) is det.
%
%   Result é um de:
%     - solved
%     - errors(Cells): células preenchidas que contradizem a solução
%     - steps(Steps): cadeia de passos lógicos até a próxima colocação
hint(Ctx, Board, Sol, Result) :-
    findall(I, (nth0(I, Board, V), V > 0, nth0(I, Sol, S), V =\= S), Wrong),
    (   Wrong \== []
    ->  Result = errors(Wrong)
    ;   \+ memberchk(0, Board)
    ->  Result = solved
    ;   initial_state(Ctx, Board, St),
        hint_chain(Ctx, St, Sol, 400, Chain),
        prune_chain(Chain, Steps),
        Result = steps(Steps)
    ).

hint_chain(_, _, _, 0, []) :- !.
hint_chain(Ctx, St, Sol, N, [Step|Steps]) :-
    find_step(Ctx, St, 5, Sol, Step),
    Step = step(_, _, _, _, Place, _),
    (   Place \== none
    ->  Steps = []
    ;   apply_step(Ctx, Step, St, St1),
        N1 is N - 1,
        hint_chain(Ctx, St1, Sol, N1, Steps)
    ).

%!  prune_chain(+Chain, -Pruned) is det.
%
%   Remove passos de eliminação que não contribuem para a colocação
%   final. Cada passo depende apenas dos candidatos das suas células de
%   foco e da sua região (as "premissas"). Percorrendo a cadeia de trás
%   para frente, um passo só é mantido se eliminar algo em uma célula que
%   é premissa de algum passo mantido depois dele. Os passos descartados
%   não tocam nenhuma premissa, então os mantidos continuam válidos.
prune_chain(Chain, Pruned) :-
    reverse(Chain, [Last|RevRest]),
    premises(Last, R0),
    prune_back(RevRest, R0, [Last], Pruned).

prune_back([], _, Acc, Acc).
prune_back([S|Ss], R, Acc, Pruned) :-
    S = step(_, _, _, Elims, _, _),
    (   member(Y-_, Elims), ord_memberchk(Y, R)
    ->  premises(S, P),
        ord_union(R, P, R1),
        prune_back(Ss, R1, [S|Acc], Pruned)
    ;   prune_back(Ss, R, Acc, Pruned)
    ).

premises(step(_, Focus, Unit, _, _, _), P) :-
    append(Focus, Unit, P0),
    sort(P0, P).

%!  rate(+Ctx, +Puzzle, +Solution, -Rating) is det.
%
%   Rating = rating(Level, Techniques) onde Techniques é uma lista de
%   Tecnica-Vezes na ordem do repertório.
rate(Ctx, Puzzle, Sol, rating(Level, Techs)) :-
    initial_state(Ctx, Puzzle, St),
    run(Ctx, St, Sol, 5, [], Used),
    findall(L, (member(T-_, Used), technique(T, L, _)), Ls),
    max_list([1|Ls], Level),
    findall(T-N, (technique(T, _, _), memberchk(T-N, Used)), Techs).

%!  solves_within(+Ctx, +Puzzle, +Solution, +MaxLevel) is semidet.
%
%   Verdadeiro se o repertório até MaxLevel resolve o puzzle sozinho.
solves_within(Ctx, Puzzle, Sol, MaxLevel) :-
    initial_state(Ctx, Puzzle, St),
    run(Ctx, St, Sol, MaxLevel, [], _).

run(Ctx, St, Sol, MaxL, Used0, Used) :-
    (   solved(St)
    ->  Used = Used0
    ;   find_step(Ctx, St, MaxL, Sol, Step),
        Step = step(T, _, _, _, _, _),
        count_use(T, Used0, Used1),
        apply_step(Ctx, Step, St, St1),
        run(Ctx, St1, Sol, MaxL, Used1, Used)
    ).

count_use(T, Used0, Used) :-
    (   selectchk(T-N, Used0, Rest)
    ->  N1 is N + 1,
        Used = [T-N1|Rest]
    ;   Used = [T-1|Used0]
    ).
