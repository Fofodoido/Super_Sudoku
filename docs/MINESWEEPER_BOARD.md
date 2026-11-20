# Contrato: tabuleiro de Campo Minado

Responsável: Gustavo Xavier Evangelista (@guxvr), frente 01.
Consumidor principal e revisor: Rodrigo (@fofodoido), frente 02.

**Estado: contrato definido por Gustavo, conforme orientação do responsável nesta frente.**
Este documento define a interface de `backend/minesweeper/board.pl`.
O responsável dispensou uma etapa separada de alinhamento prévio. A revisão e
aprovação do PR por Rodrigo no GitHub continuam obrigatórias antes do merge.

## Representação e invariantes

- Módulo: `minesweeper_board`, independente de HTTP, Elm e Sudoku.
- Dimensões são inteiros positivos, na ordem `Rows, Cols` (linhas, colunas).
- Células usam o termo interno `cell(Row, Col)`, com inteiros de base zero:
  `0 =< Row < Rows` e `0 =< Col < Cols`.
- Listas produzidas pelo módulo são únicas e ordenadas por linha, depois coluna.
  A célula de índice linear `I`, se necessária ao consumidor, corresponde a
  `I = Row * Cols + Col`; índice linear não faz parte desta interface.
- Minas são uma lista de células válidas e distintas. A saída do gerador é
  ordenada; fixtures de entrada podem ter qualquer ordem, mas não duplicatas.
- O estado anterior à geração deve distinguir **minas ainda não geradas** de
  uma lista de minas vazia. A representação do estado completo cabe a Rodrigo.
- Os presets públicos são exatamente:

| Difficulty | Rows | Cols | MineCount |
| --- | --- | --- | --- |
| `easy` | 9 | 9 | 10 |
| `medium` | 16 | 16 | 40 |
| `hard` | 16 | 30 | 99 |

Dimensões menores podem ser usadas diretamente nos predicados de geometria e
geração para fixtures; isso não adiciona dificuldades à API pública.

## Predicados exportados

`+` indica entrada instanciada, `-` saída livre e `?` argumento consultável.
`det` significa uma solução para entradas válidas e saída livre; `semidet`,
sucesso único ou falha; `nondet`, enumeração de soluções.

| Assinatura e modo | Comportamento |
| --- | --- |
| `preset(?Difficulty, ?Rows, ?Cols, ?MineCount)` — nondet | Consulta ou enumera os três presets na ordem easy, medium, hard. Uma dificuldade desconhecida falha. |
| `valid_cell(+Rows, +Cols, +Cell)` — semidet | Verifica dimensões positivas, formato `cell/2`, coordenadas inteiras e limites. Não enumera células. |
| `cells(+Rows, +Cols, -Cells)` — det para dimensões válidas | Enumera todas as células em ordem por linha. |
| `neighbors(+Rows, +Cols, +Cell, -Neighbors)` — det para entradas válidas | Retorna as células com diferença de linha e coluna entre -1 e 1, excluindo a própria célula e posições fora do tabuleiro. |
| `generate_mines(+Rows, +Cols, +MineCount, +SafeCell, -Mines)` — det para entradas válidas | Amostra sem reposição entre todas as células exceto `SafeCell`; retorna exatamente `MineCount` minas. |
| `adjacent_mines(+Rows, +Cols, +Mines, +Cell, -Count)` — det para entradas válidas | Conta as minas presentes em `neighbors/4`; resultado inteiro de 0 a 8. A célula consultada pode ser mina e nunca conta a si mesma. |

### Entradas inválidas

Para os modos acima, entradas inválidas falham sem lançar exceções:

- Dimensões nulas, negativas, não inteiras ou não instanciadas.
- Célula com formato incorreto, coordenada não inteira, não instanciada ou fora
  dos limites.
- Quantidade de minas não inteira ou fora de `0..Rows*Cols-1`.
- Lista de minas não completamente instanciada, imprópria, com duplicatas ou
  células inválidas em `adjacent_mines/5`.

As entradas serão validadas antes da aritmética ou de consumir aleatoriedade.
Uma saída previamente instanciada incompatível também pode causar falha;
os predicados não são geradores relacionais além dos modos declarados.
O adaptador HTTP será responsável por transformar entradas inválidas em erros
do contrato JSON; `board.pl` não produz status HTTP nem mensagens ao cliente.

## Primeira revelação e fronteira com o motor

1. Ao criar uma partida, o motor consulta `preset/4` e mantém as minas como
   ainda não geradas. Não chama `generate_mines/5` nesse momento.
2. Colocar ou retirar bandeira antes da primeira revelação não gera minas.
3. Na primeira revelação válida de uma célula sem bandeira, o motor chama
   `generate_mines(Rows, Cols, MineCount, Cell, Mines)` uma única vez e guarda
   o resultado na partida.
4. As revelações seguintes reutilizam essa lista. O módulo não mantém sessões
   nem impede regeneração por conta própria: essa garantia pertence ao motor.
5. O motor usa `neighbors/4` e `adjacent_mines/5` para números e expansão,
   preservando bandeiras e controlando as células já visitadas.

A exclusão se aplica somente à célula clicada. Seus vizinhos podem conter minas;
não há promessa de região inicial vazia nem de jogo resolvível sem adivinhação.
Expansão, bandeiras, vitória, derrota e transições pertencem à frente 02.

Minas e estado do gerador aleatório são dados internos. A frente 03 produzirá a
projeção pública: durante `ready/playing`, não enviará minas, semente nem números
de células ocultas ao frontend. A interface não recebe semente da API.

## Fixtures e aleatoriedade controlada

Carregue o módulo com `use_module('backend/minesweeper/board').` para executar
os exemplos abaixo.

```prolog
?- preset(hard, Rows, Cols, N).
Rows = 16, Cols = 30, N = 99.

?- cells(2, 3, Cells).
Cells = [cell(0,0), cell(0,1), cell(0,2),
         cell(1,0), cell(1,1), cell(1,2)].

?- neighbors(3, 3, cell(0,0), Neighbors).
Neighbors = [cell(0,1), cell(1,0), cell(1,1)].

?- valid_cell(16, 30, cell(15,29)).
true.
?- valid_cell(16, 30, cell(16,0)).
false.

?- adjacent_mines(3, 3, [cell(0,1), cell(1,0)], cell(0,0), Count).
Count = 2.

% Fixture saturada: única posição segura, sem dependência do sorteio.
?- generate_mines(2, 2, 3, cell(0,0), Mines).
Mines = [cell(0,1), cell(1,0), cell(1,1)].
```

Para testes do motor sem sorteio, usar diretamente dimensões e listas de minas
fixas, por exemplo `Rows=3, Cols=3, Mines=[cell(0,1),cell(1,0)]`.
A injeção desses dados no estado de teste será definida pela frente 02, sem
endpoint público de fixtures.

Fixtures compartilhadas ficam em `backend/tests/fixtures/minesweeper.pl`.
O módulo `minesweeper_fixtures` exporta
`board_fixture(?Name, ?Rows, ?Cols, ?Mines, ?Counts)`, onde `Counts` lista
`cell(Row, Col)-AdjacentMines` para todas as posições, inclusive minas.
Os casos `rectangular`, `surrounded` e `empty` permitem testar bordas,
primeira revelação numerada e expansão sem sorteio. O motor pode carregar esse
módulo somente em seus testes; o termo de partida permanece sob sua responsabilidade.

Os testes do gerador usam `library(random)` do SWI-Prolog com
`getrand/1`, `set_random(seed(...))` e `setrand/1`, salvando e restaurando o estado
por `setup_call_cleanup/3`, inclusive em falha ou exceção. Repetir a mesma semente
no mesmo ambiente deve reproduzir a lista. Não fixar uma lista sorteada esperada
entre versões do SWI-Prolog; validar os invariantes e a repetição no ambiente.
O gerador usa a aleatoriedade da thread chamadora, sem reinicializá-la por chamada.

## Verificação

Suíte: `backend/tests/test_minesweeper_board.pl`, com plunit.

- Os quatro cantos têm 3 vizinhos; bordas não extremas, 5; interior, 8, nos
  presets. Verificar também tabuleiros 1x1, 1xN e Nx1.
- Nenhum vizinho é a própria célula, duplicado ou atravessa linha/coluna.
- Coordenadas negativas, iguais aos limites, fracionárias, não instanciadas e
  com formato incorreto falham; dimensões inválidas também.
- Fixtures conhecidas cobrem números de 0 a 8, inclusive consultas em minas.
- Para cada preset, testar quantidade exata, unicidade, limites e primeiro clique
  seguro em todas as posições, com aleatoriedade controlada.
- Cobrir zero minas, capacidade máxima, quantidade impossível, lista de minas
  inválida e reprodutibilidade; restaurar o estado aleatório após cada teste.
- Manter e executar a suíte de Sudoku durante a coexistência dos domínios.

## Integração e revisão

O contrato está definido para implementação. O responsável pela frente 01
informou que não é necessário aguardar alinhamento separado com Rodrigo.
Isso não representa uma aprovação do PR registrada no GitHub.

O motor deve distinguir minas ainda não geradas de lista vazia, gerar minas
somente na primeira revelação válida e preservar a lista nas ações seguintes.
O termo de estado do motor e a injeção de fixtures continuam com a frente 02.

Antes do merge, solicitar a revisão de Rodrigo (@fofodoido), resolver os ajustes
pedidos e obter sua aprovação registrada no GitHub.

Para executar a suíte desta frente:

```sh
swipl -g run_tests -t halt backend/tests/test_minesweeper_board.pl
```

Com make disponível, `make test-minesweeper` executa essa suíte e `make test`
executa também a suíte legada de Sudoku.
