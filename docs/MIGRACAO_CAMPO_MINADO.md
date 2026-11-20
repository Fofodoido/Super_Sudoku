# Mapa de migração e integração — frente 01

A base de geometria e geração está em `backend/minesweeper/board.pl`, módulo
`minesweeper_board`. O servidor e o frontend ainda executam Sudoku. Esta entrega
prepara o novo domínio; a troca do produto ativo ocorre na integração da frente 06.

O [contrato do tabuleiro](MINESWEEPER_BOARD.md) define as seis exportações, os
modos e as fixtures. O [plano compartilhado](PLANO_CAMPO_MINADO.md) continua sendo
a referência para o MVP e o contrato HTTP a ser detalhado pela frente 03.

## Destino dos módulos existentes

| Origem atual | Destino ou tratamento | Responsável |
| --- | --- | --- |
| `backend/sudoku/geometry.pl`, `generator.pl` | Geometria retangular e geração em `backend/minesweeper/board.pl`; novos predicados independentes do legado | Gustavo, frente 01 |
| `backend/sudoku/solver.pl`, `logic.pl` | Regras de revelação, expansão, bandeiras e resultado em `backend/minesweeper/game.pl`; sem solver/dicas no MVP | Rodrigo, frente 02 |
| `backend/sudoku/templates.pl`, `extras.pl`, `meta.pl` | Sem equivalente necessário no MVP; retirar do produto ativo na integração | Gabriel, frente 06 |
| `backend/server.pl` | Reaproveitar HTTP e arquivos estáticos; substituir handlers e adicionar sessões autoritativas | Davi, frente 03 |
| `frontend/src/Api.elm` | Substituir DTOs e comunicação Sudoku pelo snapshot público e ações de Campo Minado | Mateus, frente 04 |
| `frontend/src/Game.elm`, `Main.elm` | Adaptar modelo, mensagens, efeitos e ciclo da partida; remover dependência da solução no cliente | Mateus, frente 04 |
| `frontend/src/Board.elm`, `frontend/public/index.html` e CSS | Grade retangular, controles, título e apresentação de Campo Minado | Carlos, frente 05 |
| `frontend/src/Variant.elm`, `Local.elm`, `Overlay.elm` | Avaliar reaproveitamento visual; retirar lógica e opções específicas do Sudoku na integração final | Gabriel, frente 06, com frentes 04 e 05 |
| `frontend/public/elm.js` | Recompilar a partir do novo Elm quando integrado; bundle atual permanece de Sudoku | Gabriel, frente 06 |
| `backend/tests/test_sudoku.pl` | Preservar durante a coexistência; adicionar testes por frente e consolidar aceite | Cada frente; integração por Gabriel |
| `backend/python/exemplo_janus.py` | Exemplo legado, sem dependência funcional no MVP; retirar das referências ativas do novo produto na integração | Gabriel, frente 06 |
| `docs/FEATURES.md`, `EXPLICACAO.md`, imagens de Sudoku | Atualizar para o produto efetivamente integrado | Gabriel, frente 06 |

Nenhum arquivo legado será excluído nesta frente. As mudanças são aditivas e não
reescrevem o histórico Git. Não criar módulos vazios de motor/API/Elm: cada frente
implementa seus arquivos com seus próprios testes.

## Pontos de integração

### Frente 02 — motor de Rodrigo

Importar o módulo pelo caminho `board` a partir de `backend/minesweeper/game.pl`.
Usar `preset/4` para obter linhas, colunas e quantidade de minas. Coordenadas
internas são `cell(Row, Col)`, base zero; a dificuldade difícil é 16 linhas por
30 colunas, sem reutilizar os índices fixos de 81 células do Sudoku.

O estado da partida deve distinguir minas ainda não geradas de uma lista vazia.
Somente a primeira revelação válida de célula sem bandeira chama
`generate_mines/5`. Persistir o resultado no estado e reutilizá-lo; não regenerar
em nova ação. `neighbors/4` e `adjacent_mines/5` não conhecem bandeiras, revelações
ou sessões. O motor decide expansão com visitados, vitória, derrota e bloqueios.

O módulo de fixtures `backend/tests/fixtures/minesweeper.pl` pode ser importado
nos testes do motor. Ele fornece dimensões, minas e contagens esperadas sem
definir um termo de estado de partida nem abrir uma API de teste.

**Implementado na frente 02:** `backend/minesweeper/game.pl` (`minesweeper_game`),
com testes em `backend/tests/test_minesweeper_game.pl` e contrato detalhado em
[MINESWEEPER_GAME.md](MINESWEEPER_GAME.md).

### Frente 03 — API e sessões de Davi

O servidor atual usa `/api/new` e `/api/hint` e inclui semente e solução no fluxo
de Sudoku. Esses handlers não devem ser adaptados por simples renomeação: o novo
servidor guarda o estado real da partida e produz uma projeção pública.

O contrato planejado usa `POST /api/games`, `GET /api/games/:id` e
`POST /api/games/:id/actions`. O módulo `minesweeper_game` já aceita ações
no formato dict JSON e fornece `public_snapshot/3` com o campo `id`, além dos
erros mapeados para HTTP 400 (`invalid_action`, `invalid_cell`) e HTTP 409
(`game_over`, `cell_flagged`, `cell_revealed`). Sessões, sincronização de ações e
expiração ficam nesta frente; `board.pl` e `game.pl` não mantêm estado global
mutável de partidas. `docs/API.md` será produzido pela frente 03.

### Frentes 04 e 05 — cliente e apresentação

Consumir somente os snapshots públicos. O cliente não deve calcular regras a
partir de uma lista de minas nem receber uma solução como recebe hoje.
Preservar Elm 0.19.1 e HTML/CSS. Adotar grade `rows` por `cols`, estados públicos
das células e controles previstos no plano; não depender de células quadradas
9x9 fixas. A frente 04 controla requisições e recuperação; a 05 controla
apresentação, teclado, toque e foco visível.

### Frente 06 — integração de Gabriel

Integrar primeiro criar partida → revelar → mostrar número real, depois o MVP
completo. Só retirar o legado do produto ativo após o fluxo novo compilar e os
testes integrados passarem. Conferir imports Prolog/Elm, endpoints, título,
textos, favicon, exemplos, documentação e correspondência do bundle servido com
o código fonte. Preservar o histórico e as evidências de revisão de cada PR.

## Comandos e limites desta entrega

```sh
swipl -g run_tests -t halt backend/tests/test_minesweeper_board.pl
swipl -g run_tests -t halt backend/tests/test_minesweeper_game.pl
swipl -g run_tests -t halt backend/tests/test_sudoku.pl
```

Com make disponível, `make test-minesweeper` verifica as frentes 01 e 02 e
`make test` executa todas as suítes. O aceite de HTTP, Elm, interface, sessões e
integração final depende das entregas correspondentes. A base não promete região
inicial vazia ou partidas sem adivinhação.
