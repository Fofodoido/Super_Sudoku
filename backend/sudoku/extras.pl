:- module(extras,
          [ post_extra/2,
            post_extra_vars/3,
            make_extras/3,
            extra_phrase/2,
            extra_reason/2,
            local_extra/1
          ]).
:- encoding(utf8).
:- use_module(library(clpfd)).

% Sem a reescrita automática da CLP(FD), para o meta-interpretador
% (meta.pl) enxergar as restrições como estão escritas.
:- set_prolog_flag(optimise_clpfd, false).

:- use_module(library(random)).
:- use_module(library(lists)).
:- use_module(library(apply)).
:- use_module(library(solution_sequences)).
:- use_module(geometry).

/** <module> Regras locais: termômetros, setas, pontos e linhas

Uma regra local é o termo

    extra(Tipo, Celulas, Parametro)

com as células na ordem em que a regra as lê:

| Tipo             | Células                     | Parâmetro      | Exige                                  |
|------------------|-----------------------------|----------------|----------------------------------------|
| thermo           | bulbo primeiro              | none           | valores sobem a partir do bulbo        |
| arrow            | círculo primeiro, haste     | none           | círculo = soma da haste                |
| kropki           | [A, B]                      | white / black  | branco: seguidos; preto: um é o dobro  |
| xv               | [A, B]                      | 10 / 5         | A + B = parâmetro (X = 10, V = 5)       |
| whisper          | linha                       | none           | vizinhos na linha diferem >= 5         |
| renban           | linha                       | none           | números seguidos, em qualquer ordem    |
| palindrome       | linha                       | none           | lê igual nos dois sentidos             |
| between          | pontas + meio               | none           | meio estritamente entre as pontas      |
| nonconsecutive   | [A, B] vizinhas             | none           | não podem ser seguidos (regra global)  |

O MESMO post_extra_vars/3 serve para três coisas: resolver (solver.pl),
deduzir candidatos no motor lógico (logic.pl, técnica "Regra local") e,
com números prontos, conferir. É a vantagem de modelar com restrições.
*/

local_extra(extra(T, _, _)) :-
    T \== nonconsecutive.

		 /*******************************
		 *      RESTRIÇÕES CLP(FD)      *
		 *******************************/

%!  post_extra(+VT, +Extra) is semidet.
%
%   VT é o termo v/81 com as variáveis do tabuleiro (veja solver.pl).
post_extra(VT, extra(Type, Cells, Param)) :-
    maplist(cell_var(VT), Cells, Vs),
    post_extra_vars(Type, Param, Vs).

cell_var(VT, I, V) :-
    A is I + 1,
    arg(A, VT, V).

%!  post_extra_vars(+Type, +Param, +Vars) is semidet.
post_extra_vars(thermo, _, Vs) :-
    chain(Vs, #<).
post_extra_vars(arrow, _, [Circle|Shaft]) :-
    sum(Shaft, #=, Circle).
post_extra_vars(kropki, white, [A, B]) :-
    abs(A - B) #= 1.
post_extra_vars(kropki, black, [A, B]) :-
    A #= 2*B #\/ B #= 2*A.
post_extra_vars(xv, Sum, [A, B]) :-
    A + B #= Sum.
post_extra_vars(whisper, _, Vs) :-
    whisper(Vs).
post_extra_vars(renban, _, Vs) :-
    all_distinct(Vs),
    length(Vs, N),
    Max is N - 1,
    renban(Vs, Max).
% Palíndromo: nenhuma restrição aritmética, só unificação. A lista
% unificada com o próprio reverso obriga a 1ª = última, 2ª = penúltima...
post_extra_vars(palindrome, _, Vs) :-
    reverse(Vs, Vs).
post_extra_vars(between, _, [A|Rest]) :-
    append(Middle, [B], Rest),
    Low #= min(A, B),
    High #= max(A, B),
    maplist(strictly_between(Low, High), Middle).
post_extra_vars(nonconsecutive, _, [A, B]) :-
    abs(A - B) #\= 1.

whisper([]).
whisper([_]).
whisper([A, B|Rest]) :-
    abs(A - B) #>= 5,
    whisper([B|Rest]).

% N números distintos cujas diferenças par a par são =< N-1 só podem ser
% N números seguidos.
renban([], _).
renban([V|Vs], Max) :-
    maplist(close_to(V, Max), Vs),
    renban(Vs, Max).

close_to(A, Max, B) :-
    abs(A - B) #=< Max.

strictly_between(Low, High, V) :-
    V #> Low,
    V #< High.

		 /*******************************
		 *    GERAÇÃO A PARTIR DA GRADE  *
		 *******************************/

%   Quantas regras de cada tipo tentar desenhar.
amount(thermo,     3).
amount(arrow,      3).
amount(kropki,    10).
amount(xv,         6).
amount(whisper,    2).
amount(renban,     2).
amount(palindrome, 2).
amount(between,    2).

%!  make_extras(+Rules, +Solution, -Extras) is det.
%
%   "Gerar e testar": para cada regra local pedida, sorteia caminhos de
%   células e fica com os que a solução satisfaz. Uma célula não é usada
%   por duas regras locais, para o desenho não embolar.
make_extras(Rules, Solution, Extras) :-
    SolT =.. [s|Solution],
    include(local_rule, Rules, Locals),
    foldl(make_type(SolT), Locals, []-[], _-Lists),
    append(Lists, Extras).

make_type(SolT, Type, Used0-Acc, Used-[New|Acc]) :-
    amount(Type, N),
    numlist(1, N, Is),
    foldl(make_one(SolT, Type), Is, Used0-[], Used-New).

make_one(SolT, Type, _, Used0-Acc, Used-New) :-
    (   once(invent(Type, SolT, Used0, Extra))
    ->  Extra = extra(_, Cells, _),
        append(Cells, Used0, Used),
        New = [Extra|Acc]
    ;   Used = Used0,
        New = Acc
    ).

digit(SolT, I, D) :-
    A is I + 1,
    arg(A, SolT, D).

digits(SolT, Cells, Ds) :-
    maplist(digit(SolT), Cells, Ds).

invent(thermo, SolT, Used, extra(thermo, Cells, none)) :-
    random_between(3, 5, N),
    path(adjacent, N, Used, Cells),
    digits(SolT, Cells, Ds),
    increasing(Ds).
invent(arrow, SolT, Used, extra(arrow, Cells, none)) :-
    random_between(3, 4, N),
    path(adjacent, N, Used, Cells),
    digits(SolT, Cells, [Circle|Shaft]),
    sum_list(Shaft, Circle).
invent(kropki, SolT, Used, extra(kropki, [A, B], Color)) :-
    path(orthogonal, 2, Used, [A, B]),
    digits(SolT, [A, B], [DA, DB]),
    (   abs(DA - DB) =:= 1
    ->  Color = white
    ;   ( DA =:= 2*DB ; DB =:= 2*DA )
    ->  Color = black
    ).
invent(xv, SolT, Used, extra(xv, [A, B], Sum)) :-
    path(orthogonal, 2, Used, [A, B]),
    digits(SolT, [A, B], [DA, DB]),
    Sum is DA + DB,
    memberchk(Sum, [5, 10]).
invent(whisper, SolT, Used, extra(whisper, Cells, none)) :-
    random_between(4, 6, N),
    path(adjacent, N, Used, Cells),
    digits(SolT, Cells, Ds),
    far_apart(Ds).
invent(renban, SolT, Used, extra(renban, Cells, none)) :-
    random_between(3, 4, N),
    path(adjacent, N, Used, Cells),
    digits(SolT, Cells, Ds),
    is_set(Ds),
    max_list(Ds, Max),
    min_list(Ds, Min),
    Max - Min =:= N - 1.
invent(palindrome, SolT, Used, extra(palindrome, Cells, none)) :-
    random_between(3, 5, N),
    path(adjacent, N, Used, Cells),
    digits(SolT, Cells, Ds),
    reverse(Ds, Ds).
invent(between, SolT, Used, extra(between, Cells, none)) :-
    random_between(3, 5, N),
    path(adjacent, N, Used, Cells),
    digits(SolT, Cells, [A|Rest]),
    append(Middle, [B], Rest),
    Low is min(A, B),
    High is max(A, B),
    forall(member(D, Middle), (D > Low, D < High)).

%!  path(:Neighbour, +N, +Forbidden, -Cells) is nondet.
%
%   Caminho simples de N células vizinhas, começando numa célula
%   aleatória e andando em direções aleatórias. O backtracking gera
%   outro caminho quando o teste de invent/4 falha; limit/2 evita que a
%   busca se arraste.
path(Neighbour, N, Forbidden, Cells) :-
    numlist(0, 80, All),
    exclude(in_list(Forbidden), All, Free),
    random_permutation(Free, Starts),
    limit(400, ( member(S, Starts),
                 extend(Neighbour, N, Forbidden, [S], Rev) )),
    reverse(Rev, Cells).

% (Sem lambda yall aqui: no código compilado, a variável Forbidden dentro
% de [I]>>memberchk(I, Forbidden) seria tratada como local e copiada.)
in_list(List, X) :-
    memberchk(X, List).

extend(_, N, _, Acc, Acc) :-
    length(Acc, N), !.
extend(Neighbour, N, Forbidden, [P|Acc], Cells) :-
    findall(Q, call(Neighbour, P, Q), Qs0),
    random_permutation(Qs0, Qs),
    member(Q, Qs),
    \+ memberchk(Q, [P|Acc]),
    \+ memberchk(Q, Forbidden),
    \+ crosses(P, Q, [P|Acc], Forbidden),
    extend(Neighbour, N, Forbidden, [Q, P|Acc], Cells).

% Um passo na diagonal cruza outra linha se as duas células da outra
% diagonal do mesmo quadradinho 2x2 já estão ocupadas.
crosses(P, Q, Path, Forbidden) :-
    cell_rc(P, R1, C1),
    cell_rc(Q, R2, C2),
    R1 =\= R2,
    C1 =\= C2,
    X is R1*9 + C2,
    Y is R2*9 + C1,
    taken(X, Path, Forbidden),
    taken(Y, Path, Forbidden).

taken(I, Path, Forbidden) :-
    (   memberchk(I, Path)
    ->  true
    ;   memberchk(I, Forbidden)
    ).

increasing([]).
increasing([_]).
increasing([A, B|R]) :- A < B, increasing([B|R]).

far_apart([]).
far_apart([_]).
far_apart([A, B|R]) :- abs(A - B) >= 5, far_apart([B|R]).

		 /*******************************
		 *    TEXTOS PARA AS DICAS      *
		 *******************************/

%!  extra_phrase(+Extra, -Phrase) is det.
%
%   Como a dica chama a regra: "o termômetro L1C1 → L1C2 → L1C3".
extra_phrase(extra(Type, Cells, Param), Phrase) :-
    maplist(cell_name, Cells, Names),
    atomic_list_concat(Names, ' → ', Path),
    atomic_list_concat(Names, ' e ', Pair),
    phrase_for(Type, Param, Path, Pair, Phrase).

phrase_for(thermo, _, Path, _, P)     :- format(atom(P), 'o termômetro ~w', [Path]).
phrase_for(arrow, _, Path, _, P)      :- format(atom(P), 'a seta ~w', [Path]).
phrase_for(kropki, white, _, Pair, P) :- format(atom(P), 'o ponto branco entre ~w', [Pair]).
phrase_for(kropki, black, _, Pair, P) :- format(atom(P), 'o ponto preto entre ~w', [Pair]).
phrase_for(xv, 10, _, Pair, P)        :- format(atom(P), 'o X entre ~w', [Pair]).
phrase_for(xv, 5, _, Pair, P)         :- format(atom(P), 'o V entre ~w', [Pair]).
phrase_for(whisper, _, Path, _, P)    :- format(atom(P), 'a linha de sussurro ~w', [Path]).
phrase_for(renban, _, Path, _, P)     :- format(atom(P), 'a linha renban ~w', [Path]).
phrase_for(palindrome, _, Path, _, P) :- format(atom(P), 'o palíndromo ~w', [Path]).
phrase_for(between, _, Path, _, P)    :- format(atom(P), 'a linha entre-pontas ~w', [Path]).
phrase_for(nonconsecutive, _, _, Pair, P) :- format(atom(P), 'a regra não-consecutivo entre ~w', [Pair]).

%!  extra_reason(+Type, -Reason) is det.
%
%   O que a regra exige, em uma frase.
extra_reason(thermo,         'os números sobem a partir do bulbo').
extra_reason(arrow,          'o número do círculo é a soma das células da haste').
extra_reason(kropki,         'ponto branco = números seguidos; ponto preto = um é o dobro do outro').
extra_reason(xv,             'X = as duas células somam 10; V = somam 5').
extra_reason(whisper,        'vizinhos na linha diferem de pelo menos 5').
extra_reason(renban,         'a linha tem números seguidos, em qualquer ordem').
extra_reason(palindrome,     'a linha se lê igual nos dois sentidos').
extra_reason(between,        'as células do meio ficam estritamente entre os números das pontas').
extra_reason(nonconsecutive, 'células vizinhas nunca têm números seguidos').
