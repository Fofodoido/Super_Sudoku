:- module(server, [start/0, start/1]).
:- encoding(utf8).

/** <module> Servidor HTTP do Super Sudoku

Serve o frontend compilado (frontend/public) e a API JSON:

  POST /api/new   {rules, difficulty, seed?}         -> puzzle completo
  POST /api/hint  {rules, cages, parity, extras, board, solution} -> dica explicada

Uso:

    swipl backend/server.pl            % porta 8080
    swipl backend/server.pl -- 3000    % outra porta
*/

:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_files)).
:- use_module(library(http/http_server_files)).
:- use_module(library(random)).

:- use_module(sudoku/geometry).
:- use_module(sudoku/generator).
:- use_module(sudoku/logic).
:- use_module(sudoku/extras).
:- use_module(sudoku/meta).

:- prolog_load_context(directory, Dir),
   atom_concat(Dir, '/../frontend/public', Public),
   asserta(user:file_search_path(public, Public)).

:- http_handler(root(api/new), handle_new, [method(post)]).
:- http_handler(root(api/hint), handle_hint, [method(post)]).
:- http_handler(root(.), serve_static, [prefix]).

%   Arquivos do frontend; um arquivo que não existe (ex.: favicon.ico)
%   responde 404 em vez de erro 500.
serve_static(Request) :-
    http_reply_from_files(public(.), [indexes(['index.html'])], Request), !.
serve_static(Request) :-
    http_404([], Request).

start :-
    start(8080).

start(Port) :-
    http_server(http_dispatch, [port(Port)]),
    format("Super Sudoku em http://localhost:~w~n", [Port]).

:- initialization(run, main).

run :-
    current_prolog_flag(argv, Argv),
    (   Argv = [PortAtom|_], atom_number(PortAtom, Port)
    ->  true
    ;   Port = 8080
    ),
    start(Port),
    thread_get_message(_).    % mantém o processo vivo

		 /*******************************
		 *           HANDLERS           *
		 *******************************/

handle_new(Request) :-
    http_read_json_dict(Request, In),
    catch(new_game(In, Out), E, (error_reply(E), fail)),
    !,
    reply_json_dict(Out, [width(0)]).
handle_new(_).

handle_hint(Request) :-
    http_read_json_dict(Request, In),
    catch(hint_reply(In, Out), E, (error_reply(E), fail)),
    !,
    reply_json_dict(Out, [width(0)]).
handle_hint(_).

error_reply(bad_request(Msg)) :- !,
    reply_json_dict(_{error: Msg}, [status(400)]).
error_reply(E) :-
    print_message(error, E),
    format(string(Msg), "Erro interno: ~q", [E]),
    reply_json_dict(_{error: Msg}, [status(500)]).

		 /*******************************
		 *           NOVO JOGO          *
		 *******************************/

new_game(In, Out) :-
    parse_rules(In.get(rules, []), Rules),
    parse_difficulty(In.get(difficulty, "medio"), Diff),
    (   integer(In.get(seed, null))
    ->  Seed = In.seed
    ;   random_between(1, 999999999, Seed)
    ),
    (   cached_or_generate(Rules, Diff, Seed, game(Ctx, Puzzle, Solution, Rating))
    ->  true
    ;   throw(bad_request("Não foi possível gerar um puzzle com essa combinação de regras a tempo. Tente outra combinação ou outra semente."))
    ),
    ctx_cages(Ctx, Cages),
    ctx_parity(Ctx, Parity),
    ctx_extras(Ctx, AllExtras),
    include(local_extra, AllExtras, Extras),
    maplist(cage_json, Cages, CagesJ),
    maplist(extra_json, Extras, ExtrasJ),
    rating_json(Rating, RatingJ),
    count_constraints(Ctx, NConstraints),
    Out = _{ rules: Rules,
             difficulty: Diff,
             seed: Seed,
             puzzle: Puzzle,
             solution: Solution,
             cages: CagesJ,
             parity: Parity,
             extras: ExtrasJ,
             constraints: NConstraints,
             rating: RatingJ
           }.

%   O gerador tem prazos de relógio (reinícios aleatórios, limite por
%   tentativa), então a mesma semente pode render puzzles diferentes em
%   máquinas de velocidades diferentes. Guardar o resultado por
%   (regras, dificuldade, semente) garante que o desafio diário seja o
%   mesmo para todos os jogadores deste servidor.
:- dynamic cached_game/4.

cached_or_generate(Rules, Diff, Seed, Game) :-
    (   cached_game(Rules, Diff, Seed, Game0)
    ->  Game = Game0
    ;   generate(Rules, Diff, Seed, Game),
        with_mutex(game_cache, remember_game(Rules, Diff, Seed, Game))
    ).

remember_game(Rules, Diff, Seed, Game) :-
    (   cached_game(Rules, Diff, Seed, _)
    ->  true
    ;   predicate_property(cached_game(_, _, _, _), number_of_clauses(N)),
        N >= 500
    ->  retract(cached_game(_, _, _, _)), !,
        assertz(cached_game(Rules, Diff, Seed, Game))
    ;   assertz(cached_game(Rules, Diff, Seed, Game))
    ).

parse_rules(List, Rules) :-
    must_be(list, List),
    maplist(parse_rule, List, Rules0),
    sort(Rules0, Rules).

parse_rule(S, R) :-
    atom_string(R, S),
    (   known_rule(R)
    ->  true
    ;   format(string(Msg), "Regra desconhecida: ~w", [S]),
        throw(bad_request(Msg))
    ).

parse_difficulty(S, D) :-
    atom_string(D, S),
    (   difficulty(D, _, _, _, _)
    ->  true
    ;   throw(bad_request("Dificuldade inválida"))
    ).

cage_json(cage(S, Cells), _{sum: S, cells: Cells}).

%   extra(thermo, [3,4,5], none) <-> {"type":"thermo","cells":[3,4,5],"param":null}
extra_json(extra(T, Cells, P), _{type: T, cells: Cells, param: PJ}) :-
    (   P == none
    ->  PJ = null
    ;   PJ = P
    ).

parse_extra(J, extra(T, Cells, P)) :-
    atom_string(T, J.type),
    Cells = J.cells,
    (   is_list(Cells), maplist(integer, Cells), Cells = [_|_]
    ->  true
    ;   throw(bad_request("Regra local com células inválidas"))
    ),
    (   local_rule(T)
    ->  true
    ;   format(string(Msg), "Regra local desconhecida: ~w", [J.type]),
        throw(bad_request(Msg))
    ),
    param_value(T, J.get(param, null), P).

param_value(kropki, S, C) :- !,
    atom_string(C, S),
    (   memberchk(C, [white, black]) -> true ; throw(bad_request("Cor de kropki inválida")) ).
param_value(xv, N, N) :- !,
    (   memberchk(N, [5, 10]) -> true ; throw(bad_request("Soma de X/V inválida")) ).
param_value(_, _, none).

rating_json(rating(Level, Techs), _{level: Level, label: Label, techniques: TJ}) :-
    level_label(Level, Label),
    maplist(tech_json, Techs, TJ).

tech_json(T-N, _{id: T, name: Name, level: L, count: N}) :-
    technique(T, L, Name).

		 /*******************************
		 *             DICA             *
		 *******************************/

hint_reply(In, Out) :-
    parse_rules(In.get(rules, []), Rules),
    maplist(parse_cage, In.get(cages, []), Cages),
    maplist(parse_extra, In.get(extras, []), Extras),
    grid_field(In, parity, Parity),
    grid_field(In, board, Board),
    grid_field(In, solution, Solution),
    build_context(Rules, Cages, Parity, Extras, Ctx),
    hint(Ctx, Board, Solution, Result),
    result_json(Result, Out).

parse_cage(J, cage(J.sum, J.cells)).

grid_field(In, Key, Grid) :-
    (   get_dict(Key, In, Grid),
        is_list(Grid),
        length(Grid, 81),
        maplist(integer, Grid)
    ->  true
    ;   format(string(Msg), "Campo inválido: ~w", [Key]),
        throw(bad_request(Msg))
    ).

result_json(solved, _{status: solved}).
result_json(errors(Cells), _{status: errors, cells: Cells}).
result_json(steps(Steps), _{status: steps, steps: SJ}) :-
    maplist(step_json, Steps, SJ).

step_json(step(T, Focus, Unit, Elims, Place, Msg),
          _{ technique: T, name: Name, level: L, message: Msg,
             focus: Focus, unit: Unit, eliminations: EJ, placement: PJ }) :-
    technique(T, L, Name),
    maplist(cell_digit_json, Elims, EJ),
    (   Place = I-D
    ->  cell_digit_json(I-D, PJ)
    ;   PJ = null
    ).

cell_digit_json(I-D, _{cell: I, digit: D}).
