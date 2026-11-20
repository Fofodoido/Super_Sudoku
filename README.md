# Campo Minado — Prolog + Elm

Projeto de Campo Minado web desenvolvido com SWI-Prolog e Elm, com interface em português e HTML/CSS.

**Estado atual:** a base Prolog de geometria, geração e motor de regras/transições de Campo Minado (`backend/minesweeper/board.pl` e `backend/minesweeper/game.pl`) está implementada e testada. O servidor e o bundle compilado ainda executam o Sudoku original; API HTTP e interface de Campo Minado permanecem nas respectivas frentes.

## Escopo planejado

- Três dificuldades: fácil (9x9, 10 minas), médio (16x16, 40 minas) e difícil (16x30, 99 minas).
- Primeiro clique seguro, revelação de células e expansão de áreas vazias.
- Bandeiras, contador de bandeiras restantes e cronômetro local.
- Vitória ao revelar todas as células seguras e derrota ao revelar uma mina.
- Nova partida, reinício e controles por mouse, teclado e toque.
- Interface responsiva com foco visível e estados identificáveis sem depender apenas de cor.

Ranking, contas, multiplayer, desfazer e dicas ficam fora do MVP. O primeiro clique seguro não garante que toda partida possa ser resolvida sem adivinhação.

## Arquitetura planejada

| Camada | Responsabilidade |
| --- | --- |
| SWI-Prolog | Geometria, geração de minas, regras, transições e resultado da partida |
| HTTP/JSON em Prolog | API e sessões em memória; envio apenas do estado público ao cliente |
| Elm | Modelo da interface, comunicação HTTP, eventos, carregamento e tratamento de erros |
| HTML/CSS | Apresentação responsiva e controles acessíveis |

O servidor guardará as minas e validará as jogadas. As sessões terão expiração por inatividade e serão perdidas ao reiniciar o servidor. Os endpoints planejados são `POST /api/games`, `GET /api/games/:id` e `POST /api/games/:id/actions`; eles ainda precisam ser implementados.

O [plano de migração](docs/PLANO_CAMPO_MINADO.md) detalha o contrato proposto, as regras, as dependências entre frentes e os critérios de conclusão.

## Equipe e responsabilidades

| Frente | Integrante | GitHub | Responsabilidade | Revisor obrigatório do PR |
| --- | --- | --- | --- | --- |
| 01 | Gustavo Xavier Evangelista | [guxvr](https://github.com/guxvr) | Migração inicial do projeto, geometria e geração do tabuleiro em Prolog | Rodrigo |
| 02 | Rodrigo Henrique Donato de Souza | [fofodoido](https://github.com/fofodoido) | Motor de regras e transições em Prolog | Davi |
| 03 | Davi Araujo Bady Casseb | [dcasseb](https://github.com/dcasseb) | Contrato JSON, API HTTP e sessões | Mateus |
| 04 | Mateus de Siqueira Silva | [siqueira-prog](https://github.com/siqueira-prog) | Modelo Elm, cliente HTTP e ciclo da partida | Carlos |
| 05 | Carlos Eduardo Mendes de Mesquita | [CarlosEduardoMendesdeMesquita](https://github.com/CarlosEduardoMendesdeMesquita) | Tabuleiro e interface acessível e responsiva | Gabriel |
| 06 | Gabriel Basto Bertolazi | [Bertolazi](https://github.com/Bertolazi) | Integração, CI, testes de aceite e documentação | Gustavo |

Todo PR deve ser revisado e aprovado pelo responsável pela frente seguinte antes do merge, na sequência circular **01 → 02 → 03 → 04 → 05 → 06 → 01**. O autor solicita a revisão e resolve as alterações pedidas; a aprovação deve ficar registrada no GitHub. Cada integrante mantém os testes da própria frente.

## Etapas de entrega

1. Alinhar os contratos Prolog, JSON e Elm e preparar a estrutura da migração.
2. Integrar o fluxo mínimo: criar partida, revelar célula e exibir o número retornado pelo Prolog.
3. Completar regras, bandeiras, dificuldades, cronômetro e recuperação de erros.
4. Validar acessibilidade, integração, testes e documentação; retirar o legado do produto ativo.

## Como executar a base atual

Estes comandos ainda executam o **Sudoku existente**. Serão adaptados durante a migração.

Requisitos: [SWI-Prolog](https://www.swi-prolog.org/) 9+ e [Elm](https://elm-lang.org/) 0.19.1. Para instalar o compilador Elm via npm:

```sh
npm install -g elm
```

Com `make` disponível:

```sh
make run
make run PORT=3000
make test
```

Sem `make`, compile o frontend e inicie o servidor:

```sh
cd frontend
elm make src/Main.elm --optimize --output=public/elm.js
cd ..
swipl backend/server.pl 8080
```

Abra `http://localhost:8080`. O bundle `frontend/public/elm.js` já está versionado; para executar a base sem recompilar, basta iniciar o servidor Prolog.

Para testar o backend atual:

```sh
swipl -g run_tests -t halt backend/tests/test_sudoku.pl
```

Os testes do tabuleiro e do motor de Campo Minado podem ser executados com `swipl -g run_tests -t halt backend/tests/test_minesweeper_board.pl` e `swipl -g run_tests -t halt backend/tests/test_minesweeper_game.pl`, ou com `make test-minesweeper`. O comando `make test` executa as suítes de Sudoku e Campo Minado. A API HTTP e o frontend de Campo Minado permanecem nas respectivas frentes.

## Documentação

O [mapa de migração e integração](docs/MIGRACAO_CAMPO_MINADO.md) identifica os módulos a substituir, os pontos de integração e as responsabilidades pela retirada final do legado.

O [contrato do tabuleiro](docs/MINESWEEPER_BOARD.md) documenta os predicados implementados em `backend/minesweeper/board.pl` para integração com o motor.

O [contrato do motor](docs/MINESWEEPER_GAME.md) documenta os predicados, ações, erros e projeção pública implementados em `backend/minesweeper/game.pl` para integração com a API HTTP.

O documento principal do novo projeto é o [plano de Campo Minado](docs/PLANO_CAMPO_MINADO.md). Os arquivos [FEATURES.md](docs/FEATURES.md) e [EXPLICACAO.md](docs/EXPLICACAO.md) ainda descrevem o Sudoku e serão atualizados na integração final.
