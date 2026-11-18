# Plano de migração: Campo Minado em Prolog + Elm

## Objetivo e premissas

Entregar um Campo Minado web jogável, com regras em SWI-Prolog e interface em Elm 0.19.1, mantendo HTML/CSS e o servidor HTTP existente. Este é um plano proposto; não altera a implementação do Sudoku nem exige renomear o repositório.

Prazo ainda não informado. A divisão segue a ordem dos seis integrantes fornecida pela equipe. As etapas são marcos de entrega, sem datas inventadas.

## MVP

- Dificuldades: fácil (9x9, 10 minas), médio (16x16, 40 minas), difícil (16 linhas x 30 colunas, 99 minas).
- Nova partida, reinício como nova partida da mesma dificuldade, revelar célula, alternar bandeira, contador de bandeiras restantes e cronômetro local.
- Primeiro clique revelado sempre seguro: gerar minas somente nesse momento, excluindo a célula clicada. Não há garantia de área inicial vazia nem de solução sem adivinhação.
- Abrir célula vazia expande recursivamente a região e sua borda numerada, preservando bandeiras.
- Vitória ao revelar todas as células sem mina; bandeiras não são obrigatórias. Revelar mina encerra em derrota.
- Célula com bandeira não pode ser revelada; célula aberta não recebe bandeira. Repetir revelação de célula aberta não altera o jogo.
- Após vitória/derrota, ações não alteram o tabuleiro. Novo jogo continua disponível.
- Mouse, teclado e modo explícito de bandeira para toque. Interface em português, responsiva, com foco visível e estados distinguíveis sem depender só de cor.

Fora do MVP: ranking, contas, multiplayer, desfazer, solver/dicas, desafio diário, variantes e abertura por acorde (chording). Dicas com CLP(FD) ficam como extensão acadêmica após a entrega básica.

## Arquitetura e migração

O servidor Prolog será a autoridade sobre minas, revelações, bandeiras e resultado. Elm guarda uma projeção pública para renderização e os estados de carregamento/erro. Diferentemente do Sudoku atual, a API não entrega a solução nem recebe um tabuleiro como fonte de verdade.

| Área | Destino proposto | Aproveitamento |
| --- | --- | --- |
| Geração/geometria | backend/minesweeper/board.pl | Novo domínio; estudar padrões dos módulos existentes |
| Regras/transições | backend/minesweeper/game.pl | Funções/predicados de transição separados do HTTP |
| HTTP e sessões | backend/server.pl | Reaproveitar servidor e arquivos estáticos; substituir handlers do Sudoku |
| Tipos e comunicação | frontend/src/Api.elm | Substituir DTOs e encoders/decoders |
| Estado e eventos | frontend/src/Game.elm, Main.elm | Reaproveitar TEA, efeitos e padrão de mensagens |
| Tabuleiro e apresentação | frontend/src/Board.elm, frontend/public | Nova grade, controles e estilos |
| Testes e entrega | backend/tests, frontend/tests, Makefile, docs | Adaptar comandos e documentação |

A frente 01 registra a interface de geometria e geração em
[MINESWEEPER_BOARD.md](MINESWEEPER_BOARD.md), com assinaturas, validações,
fixtures e divisão de responsabilidades com o motor. O contrato foi definido por Gustavo, que dispensou alinhamento prévio separado;
a revisão e aprovação do PR por Rodrigo (@fofodoido) continuam obrigatórias.

O [mapa de migração e integração](MIGRACAO_CAMPO_MINADO.md) detalha o destino dos
módulos existentes, os consumidores da base e a sequência de retirada do legado
na frente 06.

Variant.elm, Local.elm, Overlay.elm e backend/sudoku ficam até o fluxo novo compilar e passar nos testes; removê-los do produto ativo na integração final, preservando o histórico Git. Revisar também título, favicon, textos, artefatos compilados e exemplo Janus: nenhum exemplo de Sudoku deve ser apresentado como exemplo do produto novo. Não há dependência funcional de Python no MVP.

Sessões em memória, com identificador opaco gerado pelo servidor, acesso por identificador e expiração após 2 horas de inatividade. Reiniciar o servidor perde as partidas; documentar isso. Sem persistência e sem autenticação no MVP. Sincronizar cada ação por partida para evitar perda de atualização. Limitar a quantidade de sessões e retornar erro controlado ao atingir o limite.

## Contrato de integração v1

Registrar o contrato e exemplos em docs/API.md como primeira entrega da frente 3. Estas decisões servem de base compartilhada para as seis frentes:

- Coordenadas de base zero: row, col; ordem das células por linha.
- Estados: ready, playing, won, lost.
- POST /api/games recebe {"difficulty":"easy"}; opções easy, medium, hard. Retorna 201 com snapshot público. A partida começa em ready, sem minas geradas.
- GET /api/games/:id retorna 200 com snapshot público, para recuperação após falha de rede.
- POST /api/games/:id/actions recebe {"action":"reveal","row":0,"col":0} ou action="toggle_flag". Retorna 200 com snapshot completo atualizado.
- Snapshot: {id, difficulty, rows, cols, mineCount, status, revision, cells}. revision começa em 0 e aumenta quando o estado muda.
- Cada célula: {row,col,state}; state é hidden, flagged ou revealed. Apenas revealed possui adjacentMines (0..8) em células seguras. Na derrota/vitória, minas podem aparecer com state="mine"; a mina detonada usa state="exploded". Registrar o tratamento visual de bandeiras incorretas no contrato.
- Enquanto ready/playing, nunca incluir minas, semente ou números das células ocultas nas respostas.
- Erros JSON: {"error":{"code":"...","message":"..."}}. 400 para JSON/ação/dificuldade/coordenada inválidos; 404 para sessão ausente/expirada; 409 para ação bloqueada por estado/bandeira; 503 para limite de sessões. Erros internos: 500 sem detalhes internos.
- Revelar uma célula já aberta retorna snapshot inalterado; alternar bandeira em célula aberta e agir em partida encerrada retorna 409. Colocar bandeiras antes do primeiro reveal é permitido, sem gerar minas.
- Uma requisição mutante por vez no Elm. Bloquear novos comandos enquanto pendente, desabilitar repetição automática e ignorar respostas de partida antiga após novo jogo.
- Em timeout de ação, consultar GET antes de permitir novo comando: toggle_flag não é idempotente e não deve ser repetido automaticamente.
- Cronômetro inicia na primeira revelação confirmada, para no fim e não entra no cálculo das regras. Recuperação entre recargas não é requisito do MVP.

## Divisão entre seis integrantes

| Integrante | Frente e entrega | Depende de | Pode iniciar com |
| --- | --- | --- | --- |
| Gustavo (@guxvr) | Migração inicial do projeto, geometria e geração Prolog | Contrato de dimensões | Fixtures e testes de vizinhança |
| Rodrigo (@fofodoido) | Motor de regras Prolog | Interface da frente 1 | Tabuleiros fixos sem aleatoriedade |
| Davi (@dcasseb) | Contrato HTTP e sessões | Frente 2 para integração | Contrato, handlers e motor simulado |
| Mateus (@siqueira-prog) | Modelo Elm e cliente HTTP | Contrato da frente 3 | Snapshots JSON fixos |
| Carlos (@CarlosEduardoMendesdeMesquita) | Grade e experiência de jogo | Tipos/eventos da frente 4 | Dados de exemplo e componentes |
| Gabriel (@Bertolazi) | Integração, automação e documentação | Todas para aceite final | Scripts, fixtures e matriz de cenários |

Cada integrante escreve os testes de sua frente. O integrante 6 mantém a verificação integrada, sem assumir sozinho a qualidade de todo o projeto. Todo PR deve ser revisado e aprovado pelo integrante responsável pela frente seguinte antes do merge, na sequência circular: Gustavo (01) → Rodrigo (02) → Davi (03) → Mateus (04) → Carlos (05) → Gabriel (06) → Gustavo (01). O autor deve solicitar a revisão e resolver as alterações pedidas; a aprovação deve ficar registrada no GitHub. Gustavo também é responsável pela migração estrutural inicial do projeto de Sudoku para Campo Minado, preparando o novo domínio e alinhando os pontos de integração. Cada frente implementa sua parte; Gabriel coordena a retirada final do legado após o aceite integrado.

## Sequência de entrega

1. Alinhar tipos e interfaces: contrato HTTP, termo de estado Prolog, assinaturas dos predicados e tipos/eventos Elm. Integrantes 1–5 contribuem; 3 registra a decisão e 6 organiza fixtures comuns.
2. Fluxo vertical mínimo: criar partida fácil, revelar uma célula e exibir número real vindo do Prolog. Conectar cedo as frentes 1–5.
3. Jogo completo: expansão, bandeiras, primeiro clique seguro, vitória/derrota, reinício, três dificuldades e recuperação de erros.
4. Aceite: teclado/toque, testes integrados, build limpo, documentação e retirada das referências ativas ao Sudoku.

Caminho crítico: geometria/geração → motor → API real → integração Elm → aceite. Interface, cliente e automação avançam em paralelo com fixtures acordadas.

## Critérios de conclusão

- Build Elm e testes Prolog/Elm passam em checkout limpo; comandos documentados e executados na integração.
- Regras cobertas por testes determinísticos: limites/cantos, minas únicas e quantidade correta, primeiro clique seguro, vizinhança, expansão, preservação de bandeiras, vitória e derrota.
- Contrato validado com snapshots reais e casos de erro; nenhum dado oculto vaza em partida ativa.
- Fluxos de navegador: criar → revelar → bandeira → terminar → reiniciar; falha de rede/404 e resposta atrasada de partida antiga; jogar por teclado e toque.
- Makefile/CI incluem verificações das duas linguagens. O bundle servido corresponde ao código Elm atual e a página apresenta Campo Minado.
- README contém instalação, execução com e sem make, testes e limitações das sessões. docs/EXPLICACAO.md passa a mapear conceitos efetivamente usados no Campo Minado, sem afirmar requisitos acadêmicos ainda não confirmados.

## Riscos e decisões pendentes

- Confirmar prazo e exigências da disciplina: CLP(FD), meta-interpretador ou integração Python podem exigir extensão específica; não são pré-requisitos presumidos do jogo.
- Sessões mudam o backend stateless atual: reservar integração para expiração, exclusão mútua e erros de sessão perdida.
- Expansão deve usar conjunto de visitados para evitar ciclos e trabalho repetido.
- Grade difícil precisa de rolagem/layout utilizável em telas pequenas; não encolher células até inviabilizar toque.
- Preferir terminar o fluxo vertical antes de extras. Se faltar tempo, manter os critérios de regras e integração e adiar recursos fora do MVP.
