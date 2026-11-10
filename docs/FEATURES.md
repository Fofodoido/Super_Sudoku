# Super Sudoku — desenho das features

O objetivo é que o jogo seja substancialmente mais complexo que um Sudoku
comum, tanto para quem joga quanto na engenharia por trás. A divisão de
responsabilidades segue a força de cada linguagem:

- **Prolog** faz o que é busca e dedução: modelar regras como restrições,
  gerar puzzles com solução única, resolver como uma pessoa resolveria e
  explicar o raciocínio.
- **Elm** faz o que é estado e interação: a partida, os modos de jogo, a
  pontuação, a verificação imediata de regras e a interface.
- **HTML/CSS** cuidam de toda a apresentação (gaiolas, marcas de paridade,
  regiões extras, destaques das dicas, tema escuro, celular).

## 1. Regras combináveis (implementado)

Qualquer subconjunto das regras abaixo pode ser ligado ao mesmo tempo.

| Regra | Restrição no CLP(FD) | Efeito no raciocínio |
| --- | --- | --- |
| Diagonal (X) | `all_distinct/1` nas duas diagonais | 2 casas novas de 9 células |
| Hyper | `all_distinct/1` em 4 janelas 3×3 | 4 casas novas; interseções com blocos |
| Anti-cavalo | `#\=` entre células a um salto de cavalo | até 8 vizinhos extras por célula |
| Killer | `all_distinct/1` + `sum/3` por gaiola | combinações de soma, regra dos 45 |
| Par/Ímpar | domínio restrito a `1\/3\/5\/7\/9` ou `2\/4\/6\/8` | candidatos iniciais menores |
| Anti-rei | `#\=` entre vizinhas na diagonal | até 4 vizinhos extras por célula |
| Disjunto | `all_distinct/1` nas 9 posições relativas dos blocos | 9 casas novas |
| Não-consecutivo | `abs(A-B) #\= 1` entre vizinhas lado a lado | técnica "Regra local" |
| Termômetros | `chain(Vs, #<)` | técnica "Regra local" |
| Setas | `sum(Haste, #=, Circulo)` | técnica "Regra local" |
| Kropki | branco `abs(A-B) #= 1`; preto `A #= 2*B #\/ B #= 2*A` | técnica "Regra local" |
| X e V | `A + B #= 10` ou `5` | técnica "Regra local" |
| Sussurro | `abs(A-B) #>= 5` entre vizinhos da linha | técnica "Regra local" |
| Renban | `all_distinct` + diferenças par a par `#=< N-1` | técnica "Regra local" |
| Palíndromo | só unificação: `reverse(Vs, Vs)` | técnica "Regra local" |
| Entre-pontas | meio `#>` min e `#<` max das pontas | técnica "Regra local" |

As regras locais (termômetros a entre-pontas) são desenhadas pelo
gerador a partir da solução, como as gaiolas do Killer: `extras.pl`
sorteia caminhos de células e fica com os que a solução satisfaz
("gerar e testar"). O motor lógico ganhou uma técnica genérica, "Regra
local": um candidato sai se, fixando-o, nenhuma combinação dos
candidatos restantes cumpre a regra, testado com as MESMAS restrições
CLP(FD) do resolvedor. Combinações de não-consecutivo usam a grade do
"Milagre" (Mitchell Lee) como modelo, embaralhada só por simetrias e
pela troca d → 10 − d, que preservam "ser seguido".

Toda a lógica é escrita sobre conceitos genéricos — *casas* (9 células
com 1..9), *grupos* (dígitos distintos: casas e gaiolas) e *vizinhos*
(quem enxerga quem) — então uma regra nova só precisa dizer quais casas,
grupos ou vizinhos acrescenta. O Elm espelha a mesma geometria em
`Variant.elm` para detectar conflitos sem ir ao servidor.

Algumas combinações têm busca de cauda pesada (anti-cavalo + diagonal).
O gerador usa reinícios aleatórios com limite de tempo e, quando existe,
uma grade-modelo embaralhada por permutação de dígitos e pelas 8
simetrias do quadrado, que preservam todas as regras geométricas.
Diagonal + Hyper + Anti-cavalo ao mesmo tempo não teve grade encontrada
(possivelmente é inviável); o servidor responde com uma mensagem clara.

## 2. Gerador com dificuldade real (implementado)

1. Grade completa aleatória (CLP(FD), rotulação *first-fail* com ordem de
   valores embaralhada).
2. Gaiolas do Killer crescidas aleatoriamente sobre a solução (conexas,
   sem repetir dígito, 2–6 células); marcas de paridade em ~35% das casas.
3. Escavação: remove pistas (em pares simétricos, exceto no Killer)
   enquanto o **motor lógico** consegue resolver usando apenas as técnicas
   permitidas para a dificuldade. Como as técnicas são deduções corretas,
   isso também prova que a solução é única — só no nível Extremo, que
   admite bifurcação, é preciso contar soluções com CLP(FD).
4. Avaliação final; se o puzzle ficou fácil demais, gera outro (até um
   prazo) e devolve o melhor.

Mesma semente → mesmo puzzle (o servidor guarda o resultado em cache,
porque os prazos de relógio poderiam variar entre máquinas).

## 3. Motor de raciocínio e dicas explicadas (implementado)

Repertório, em ordem de dificuldade:

| Nível | Técnicas |
| --- | --- |
| 1 | Candidato único, Posição única, Soma restante da gaiola |
| 2 | Combinações da gaiola, Interseção (generalizada para qualquer regra) |
| 3 | Regra dos 45, Par nu, Par escondido, Trio nu |
| 4 | Trio escondido, X-Wing |
| 5 | Bifurcação (tentativa e erro) |

A "Interseção" é generalizada: se todas as posições possíveis de um
dígito numa casa enxergam uma célula X, X perde esse candidato. Isso
cobre *pointing*, *box/line reduction*, interseções de diagonais e
janelas, e interações com anti-cavalo e gaiolas, com um único código.

Ao pedir uma dica, o Prolog:

1. confere o tabuleiro contra a solução e, se houver erro, aponta as
   células erradas (sem revelar o valor certo);
2. encadeia passos lógicos até a primeira colocação;
3. **poda** a cadeia de trás para frente: cada passo depende só dos
   candidatos das suas células de foco e da sua região, então os passos
   cujas eliminações não tocam nenhuma premissa posterior são removidos.

O Elm mostra os passos um a um, destacando a região, as células-chave,
os candidatos eliminados (riscados) e a colocação final; "Aplicar"
executa a cadeia nas anotações e no tabuleiro.

## 4. Camada de jogo em Elm (implementado)

- **Modos:** Relaxado (sem limites), Sobrevivência (3 vidas), Contra o
  relógio (tempo inicial proporcional às casas vazias e ao nível; acertos
  somam tempo, erros tiram 20 s).
- **Pontuação:** pontos-base crescem com o nível lógico e o número de
  regras; acertos em até 15 s seguidos formam combo (até ×8); dicas
  custam pontos; bônus de conclusão desconta tempo, erros e dicas.
- **Ferramentas:** anotações, auto-notas (respeitando todas as regras,
  inclusive limite de soma da gaiola), limpeza automática das anotações
  dos vizinhos, desfazer/refazer (200 níveis), atalhos de teclado.
- **Conflitos visíveis:** repetição entre vizinhos (inclusive cavalo e
  gaiola), paridade violada, soma de gaiola estourada.
- **Meta-jogo:** desafio diário (regras rotativas, semente = data),
  sequência de dias, recordes por combinação regras/dificuldade/modo.

## 5. Próximas features (roteiro)

Ideias que encaixam na arquitetura atual, da mais barata para a mais cara:

1. **Mais regras** — feito: Termômetro, Setas, Kropki, X/V, Anti-rei,
   Disjunto, Não-consecutivo, Sussurro, Renban, Palíndromo e
   Entre-pontas. Falta: Sandwich e técnicas específicas por regra (hoje
   todas passam pela técnica genérica "Regra local").
2. **Técnicas avançadas** — Swordfish, XY-Wing, cadeias simples
   (*coloring*) e "inies/outies" do Killer com mais de uma célula; isso
   refina a escala entre os níveis 4 e 5.
3. **Modo Névoa** — células reveladas só quando um vizinho é resolvido;
   o gerador precisa garantir que a ordem de revelação permite progresso
   lógico (bom uso do motor de passos).
4. **Editor de puzzles** — o jogador monta um puzzle e o Prolog verifica
   unicidade, classifica e explica por que não é único (mostrando duas
   soluções diferentes).
5. **Replay e análise pós-jogo** — gravar a sequência de jogadas no Elm e
   comparar com o caminho lógico do Prolog, apontando onde o jogador
   chutou.
6. **Multijogador** — corrida no mesmo puzzle via WebSocket
   (`library(http/websocket)` no SWI-Prolog); o servidor valida as
   jogadas.
7. **Tamanhos variáveis** — 6×6 (iniciante) e 16×16 (hexadecimal); exige
   parametrizar a geometria (hoje fixa em 9×9) nos dois lados.
