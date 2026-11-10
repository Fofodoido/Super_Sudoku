:- module(templates,
          [ template_grid/2,
            transform_grid/2,
            template/2
          ]).
:- encoding(utf8).
:- use_module(library(random)).
:- use_module(library(lists)).
:- use_module(library(pairs)).

/** <module> Grades-modelo para combinações difíceis de gerar

Para algumas combinações (por exemplo anti-cavalo + diagonal) a busca
aleatória por uma grade completa pode demorar muito. Nesses casos usamos
uma grade-modelo pré-calculada e a embaralhamos com transformações que
preservam TODAS as regras geométricas:

  * permutação dos dígitos (9! possibilidades) — exceto com a regra
    não-consecutivo, que só sobrevive à troca d -> 10 - d (ou nenhuma);
  * as 8 simetrias do quadrado (rotações e reflexões), que levam linhas
    em linhas/colunas, blocos em blocos, diagonais em diagonais, janelas
    do Hyper em janelas e saltos de cavalo em saltos de cavalo.
*/

%!  template_grid(+Rules, -Grid) is semidet.
%
%   Rules em ordem alfabética (como em sort/2).
template_grid(Rules, Grid) :-
    template(Rules, Grid0),
    (   memberchk(nonconsecutive, Rules)
    ->  transform_grid_nc(Grid0, Grid)
    ;   transform_grid(Grid0, Grid)
    ).

%!  transform_grid(+Grid0, -Grid) is det.
transform_grid(Grid0, Grid) :-
    numlist(1, 9, Ds),
    random_permutation(Ds, Perm),
    transform_with(Perm, Grid0, Grid).

%   Com não-consecutivo, uma permutação qualquer estragaria a regra
%   (3 e 7 podem virar 4 e 5). Só a identidade e o espelho d -> 10 - d
%   preservam "ser seguido".
transform_grid_nc(Grid0, Grid) :-
    random_member(Perm, [[1,2,3,4,5,6,7,8,9], [9,8,7,6,5,4,3,2,1]]),
    transform_with(Perm, Grid0, Grid).

transform_with(Perm, Grid0, Grid) :-
    maplist(relabel(Perm), Grid0, Grid1),
    random_between(0, 7, Sym),
    numlist(0, 80, Is),
    maplist(moved(Sym), Is, Targets),
    pairs_keys_values(Pairs, Targets, Grid1),
    keysort(Pairs, Sorted),
    pairs_values(Sorted, Grid).

relabel(Perm, D, D1) :-
    nth1(D, Perm, D1).

moved(Sym, I, J) :-
    R is I // 9,
    C is I mod 9,
    sym(Sym, R, C, R1, C1),
    J is R1*9 + C1.

sym(0, R, C, R, C).
sym(1, R, C, C, R1)  :- R1 is 8 - R.
sym(2, R, C, R1, C1) :- R1 is 8 - R, C1 is 8 - C.
sym(3, R, C, C1, R)  :- C1 is 8 - C.
sym(4, R, C, C, R).
sym(5, R, C, C1, R1) :- R1 is 8 - R, C1 is 8 - C.
sym(6, R, C, R, C1)  :- C1 is 8 - C.
sym(7, R, C, R1, C)  :- R1 is 8 - R.

%!  template(?Rules, ?Grid) is nondet.
%
%   Grades encontradas offline com labeling([ffc, down], Vs) sobre o
%   modelo de solver.pl.
% O "Milagre" de Mitchell Lee: anti-cavalo + anti-rei + não-consecutivo.
% Serve para qualquer combinação dessas três que inclua não-consecutivo
% (a busca aleatória costuma travar com essa regra).
template(Rules, Grid) :-
    member(Rules, [ [nonconsecutive],
                    [antiking, nonconsecutive],
                    [antiknight, nonconsecutive],
                    [antiking, antiknight, nonconsecutive] ]),
    miracle(Grid).

template([antiknight, diagonal],
         [ 2,6,7, 9,1,3, 8,4,5,
           5,4,9, 8,6,7, 2,1,3,
           3,1,8, 5,4,2, 7,9,6,
           1,8,2, 7,5,4, 3,6,9,
           6,5,3, 2,9,1, 4,8,7,
           7,9,4, 3,8,6, 1,5,2,
           9,7,6, 1,3,8, 5,2,4,
           4,2,1, 6,7,5, 9,3,8,
           8,3,5, 4,2,9, 6,7,1 ]).

miracle(
         [ 4,8,3, 7,2,6, 1,5,9,
           7,2,6, 1,5,9, 4,8,3,
           1,5,9, 4,8,3, 7,2,6,
           8,3,7, 2,6,1, 5,9,4,
           2,6,1, 5,9,4, 8,3,7,
           5,9,4, 8,3,7, 2,6,1,
           3,7,2, 6,1,5, 9,4,8,
           6,1,5, 9,4,8, 3,7,2,
           9,4,8, 3,7,2, 6,1,5 ]).
