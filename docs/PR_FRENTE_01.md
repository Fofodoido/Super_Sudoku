# Frente 01: prepara Campo Minado com geometria e geração Prolog

Descrição preparada para publicação do PR após os commits das etapas locais.
Revisor obrigatório a solicitar no GitHub: Rodrigo (@fofodoido).

## Alteração

Adiciona `backend/minesweeper/board.pl` como base independente para o motor de
Campo Minado. O módulo fornece presets, validação e enumeração de coordenadas,
vizinhos, geração de minas únicas com célula segura e contagem adjacente.
Por exemplo, a dificuldade hard define 16 linhas, 30 colunas e 99 minas;
a posição da primeira revelação é excluída da amostragem, sem excluir os vizinhos.

Documenta a interface de seis predicados e o mapa de substituição dos módulos
de Sudoku, preservando o legado e o histórico até a integração da frente 06.
Adiciona fixtures internas reutilizáveis pelo motor e o comando
`make test-minesweeper`; `make test` inclui também a suíte legada.

## Validação

- Campo Minado: 24 testes e 51 subtestes plunit passaram, incluindo todas as
  817 posições dos presets como primeiro clique e múltiplas sementes.
- Sudoku: 27 testes e 19 subtestes passaram; dois avisos legados de choicepoint.
- `git diff --check` sem erros.
- SWI-Prolog 10.0.2 x64 no Windows. Elm/make ausentes no PATH; comandos Prolog
  executados diretamente. Nenhum código Elm foi alterado.

Detalhes em [VALIDACAO_FRENTE_01.md](VALIDACAO_FRENTE_01.md).

## Integração e condição de merge

O motor de Rodrigo deverá guardar as minas geradas na primeira revelação válida
e reutilizá-las. API, sessões, regras, Elm e interface permanecem nas frentes
correspondentes. O servidor e o bundle atuais continuam executando Sudoku.

Solicitar revisão de @fofodoido, resolver as alterações pedidas e obter aprovação
registrada no GitHub antes do merge. Esta descrição não representa PR publicado,
solicitação de revisão enviada ou aprovação recebida.

Refs #1
