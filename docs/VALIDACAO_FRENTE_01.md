# Validação da frente 01

Validação local em 17/11/2026, Windows, SWI-Prolog 10.0.2 x64.
Escopo: geometria, geração e migração estrutural inicial de Campo Minado.

| Verificação | Resultado |
| --- | --- |
| `swipl -g run_tests -t halt backend/tests/test_minesweeper_board.pl` | Passou: 24 testes e 51 subtestes |
| `swipl -g run_tests -t halt backend/tests/test_sudoku.pl` | Passou: 27 testes e 19 subtestes |
| `git diff --check` | Sem erros de whitespace |
| Build Elm / comandos make | Não executados: ferramentas ausentes no PATH; nenhum código Elm foi alterado |

A suíte de Sudoku emite avisos de choicepoint nos dois testes de `meta`, já
existentes antes desta entrega. Os testes passam; nenhum módulo legado foi
alterado para tratar esses avisos.

## Evidências de aceite do tabuleiro

- Os presets são easy=9x9/10, medium=16x16/40, hard=16x30/99.
- Todas as 817 posições dos presets foram verificadas como primeiro clique
  seguro: minas únicas, quantidade exata e posições dentro dos limites.
- A vizinhança foi comparada em todas as posições com uma regra de distância,
  incluindo os quatro cantos, bordas e interior, sem atravessar limites.
- Há cobertura de dimensões e coordenadas inválidas, tabuleiros 1x1, 1xN e Nx1,
  contagens de 0 a 8, minas duplicadas e listas inválidas.
- Fixtures compartilhadas cobrem tabuleiro retangular, centro cercado e tabuleiro
  vazio. O centro cercado demonstra uma primeira célula segura com número 8.
- Testes verificam repetição com a mesma semente e invariantes com sementes
  0, 1 e 65535 nos três presets. O estado aleatório é restaurado nos testes.
- Entradas inválidas não consomem aleatoriedade. O módulo não aceita nem retorna
  semente e não cria respostas HTTP.

## Limites do aceite e revisão

O motor ainda deve garantir que a geração ocorra uma única vez, na primeira
revelação válida. Expansão, bandeiras, resultado, sessões, projeção pública,
cliente Elm e interface dependem das demais frentes. Não foi realizado aceite
integrado do produto nem build em checkout limpo com Elm.

O material do PR está em [PR_FRENTE_01.md](PR_FRENTE_01.md). A publicação do PR,
a solicitação de revisão e a aprovação por Rodrigo (@fofodoido) no GitHub
permanecem pendentes. O alinhamento prévio separado foi dispensado pelo
responsável; isso não substitui a aprovação exigida antes do merge.
