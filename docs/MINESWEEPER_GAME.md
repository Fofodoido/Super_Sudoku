# Contrato: motor de Campo Minado

Responsável: Rodrigo Henrique Donato de Souza (@Fofodoido), frente 02.
Consumidor principal e revisor: Davi Araujo Bady Casseb (@dcasseb), frente 03.

Este documento define a interface de `backend/minesweeper/game.pl` (módulo `minesweeper_game`), construída sobre `backend/minesweeper/board.pl` (`minesweeper_board`).

---

## Representação e invariantes internos

O estado interno de uma partida é um termo opaco `game_state/10` que **não deve ser serializado diretamente** nem inspecionado fora do módulo:

- `Difficulty`: `easy` | `medium` | `hard` (ou átomo customizado em `new_fixed_game/5`).
- `Rows, Cols`: inteiros positivos; células em base zero `cell(Row, Col)` com `0 =< Row < Rows` e `0 =< Col < Cols`.
- `MineCount`: inteiro em `0 .. Rows*Cols - 1`.
- `Status`: `ready` | `playing` | `won` | `lost`.
- `Revision`: inteiro `>= 0`; começa em `0` e incrementa em `1` apenas quando uma ação altera o estado da partida.
- `MinesState`: `ungenerated` | `generated(Mines)`, distinguindo explicitamente minas ainda não sorteadas de uma lista vazia.
- `Revealed` e `Flagged`: conjuntos ordenados (`ordsets`) disjuntos de células `cell(Row, Col)`.
- `Exploded`: `none` (enquanto `ready`, `playing` ou `won`) ou `cell(Row, Col)` (a mina detonada em `lost`).

---

## Predicados exportados

| Predicado e modo | Comportamento |
| --- | --- |
| `new_game(+Difficulty, -Game)` (`semidet`) | Cria partida em `ready`, `revision = 0` e `MinesState = ungenerated` usando `preset/4`. Falha se `Difficulty` não for um preset válido. |
| `new_fixed_game(+Rows, +Cols, +Mines, -Game)` (`semidet`) | Cria partida determinística com `Difficulty = custom` e minas fixas para testes/fixtures. Falha para dimensões inválidas, duplicatas, coordenadas fora dos limites ou `MineCount >= Rows * Cols`. |
| `new_fixed_game(+Difficulty, +Rows, +Cols, +Mines, -Game)` (`semidet`) | Mesmo comportamento de `new_fixed_game/4`, permitindo definir o átomo `Difficulty`. |
| `game_action(+Game0, +Action, -Result)` (`semidet`) | Aplica uma ação e devolve `ok(Game)` ou `error(Reason)`. Falha se `Game0` não for válido ou `Action` for variável. |
| `reveal(+Game0, +Cell, -Game)` (`semidet`) | Atalho para `game_action(Game0, reveal(Cell), ok(Game))`. |
| `toggle_flag(+Game0, +Cell, -Game)` (`semidet`) | Atalho para `game_action(Game0, toggle_flag(Cell), ok(Game))`. |
| `game_status(+Game, -Status)` (`semidet`) | Consulta o status atual (`ready`, `playing`, `won`, `lost`). |
| `game_revision(+Game, -Revision)` (`semidet`) | Consulta a revisão atual da partida. |
| `game_dimensions(+Game, -Difficulty, -Rows, -Cols)` (`semidet`) | Consulta dificuldade e dimensões do tabuleiro. |
| `game_mine_count(+Game, -MineCount)` (`semidet`) | Consulta a quantidade total de minas. |
| `public_cells(+Game, -Cells)` (`semidet`) | Gera a lista ordenada por linha de dicts públicos das células (nunca expõe minas/números ocultos durante `ready` ou `playing`). |
| `public_snapshot(+Game, -Snapshot)` (`semidet`) | Gera o dict público `{difficulty, rows, cols, mineCount, status, revision, cells}`. |
| `public_snapshot(+Id, +Game, -Snapshot)` (`semidet`) | Gera o dict público completo com `id` para a API HTTP: `{id, difficulty, rows, cols, mineCount, status, revision, cells}`. |

---

## Formatos de ação e mapeamento de erros para HTTP

`game_action/3` aceita os seguintes formatos em `Action`:
- Termos Prolog: `reveal(cell(Row, Col))`, `reveal(Row, Col)`, `toggle_flag(cell(Row, Col))`, `toggle_flag(Row, Col)`
- Dicts JSON (vindos de `http_read_json_dict/2`): `_{action: "reveal", row: Row, col: Col}` ou `_{action: "toggle_flag", row: Row, col: Col}` (também aceita átomos `reveal` / `toggle_flag` no campo `action`).

### Mapeamento recomendado de `error(Reason)` na Frente 03

| `Reason` | Significado | Status HTTP sugerido |
| --- | --- | --- |
| `invalid_action` | Ação ausente ou diferente de `reveal`/`toggle_flag` | `400` |
| `invalid_cell` | Coordenada ausente, não inteira ou fora dos limites do tabuleiro | `400` |
| `game_over` | Ação válida enviada após a partida ter chegado a `won` ou `lost` | `409` |
| `cell_flagged` | Tentativa de `reveal` em célula marcada com bandeira | `409` |
| `cell_revealed` | Tentativa de `toggle_flag` em célula já revelada | `409` |

*Ordem de validação:* `invalid_action` e `invalid_cell` (400) são verificados antes de `game_over` (409).

---

## Regras de transição e projeção pública

1. **Bandeiras antes do primeiro clique:** `toggle_flag` em `ready` alterna a bandeira, incrementa `revision` e **mantém `status = ready` e `MinesState = ungenerated`** (não consome aleatoriedade).
2. **Primeira revelação segura:** na primeira execução de `reveal` sobre célula oculta sem bandeira, o motor chama `generate_mines/5` uma única vez excluindo a célula clicada e persiste as minas geradas no estado.
3. **Expansão em largura (BFS):** ao revelar uma célula segura com `0` minas adjacentes, todas as células conectadas com `0` minas adjacentes e sua borda numerada são reveladas, **preservando bandeiras** no caminho (células com bandeira não são abertas automaticamente).
4. **Idempotência de célula revelada:** repetir `reveal` em célula já revelada devolve `ok(Game0)` sem alterar o estado nem incrementar `revision`.
5. **Vitória (`won`):** ocorre quando todas as células seguras (`Rows * Cols - MineCount`) são reveladas, independentemente de as minas terem sido marcadas com bandeira.
6. **Derrota (`lost`):** ocorre ao revelar uma mina; a célula clicada fica registrada em `Exploded`.

### Projeção das células por estado da partida

- **Em `ready` ou `playing`:**
  - Célula revelada: `_{row: R, col: C, state: revealed, adjacentMines: N}` (`N` de `0` a `8`)
  - Célula com bandeira: `_{row: R, col: C, state: flagged}`
  - Célula oculta: `_{row: R, col: C, state: hidden}`
  - Nenhuma célula recebe `mine` ou `exploded`, e nenhuma célula oculta ou com bandeira inclui `adjacentMines`.
- **Em `won` ou `lost`:**
  - Mina detonada (`lost`): `_{row: R, col: C, state: exploded}`
  - Demais minas (com ou sem bandeira durante a partida): `_{row: R, col: C, state: mine}`
  - Célula segura revelada: `_{row: R, col: C, state: revealed, adjacentMines: N}`
  - Célula segura que tinha bandeira (bandeira incorreta no fim do jogo): permanece como `_{row: R, col: C, state: flagged}` (a camada HTTP/Elm pode usar `status == lost` e `state == flagged` para exibir visualmente o erro).
  - Célula segura não revelada e sem bandeira: `_{row: R, col: C, state: hidden}`
