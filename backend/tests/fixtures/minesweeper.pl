:- module(minesweeper_fixtures, [board_fixture/5]).
:- encoding(utf8).

/** <module> Tabuleiros internos para testes de geometria e do motor

board_fixture(Name, Rows, Cols, Mines, Counts).
Counts contém Cell-AdjacentMines para todas as células, inclusive minas.
Não representa estado de partida nem deve ser servido pela API.
*/

board_fixture(rectangular, 3, 4,
              [cell(0,0), cell(0,3), cell(2,1)],
              [cell(0,0)-0, cell(0,1)-1, cell(0,2)-1, cell(0,3)-0,
               cell(1,0)-2, cell(1,1)-2, cell(1,2)-2, cell(1,3)-1,
               cell(2,0)-1, cell(2,1)-0, cell(2,2)-1, cell(2,3)-0]).

% Centro seguro numerado: não há garantia de região inicial vazia.
board_fixture(surrounded, 3, 3,
              [cell(0,0), cell(0,1), cell(0,2), cell(1,0),
               cell(1,2), cell(2,0), cell(2,1), cell(2,2)],
              [cell(0,0)-2, cell(0,1)-4, cell(0,2)-2,
               cell(1,0)-4, cell(1,1)-8, cell(1,2)-4,
               cell(2,0)-2, cell(2,1)-4, cell(2,2)-2]).

board_fixture(empty, 2, 3, [],
              [cell(0,0)-0, cell(0,1)-0, cell(0,2)-0,
               cell(1,0)-0, cell(1,1)-0, cell(1,2)-0]).
