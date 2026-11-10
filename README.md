# Super Sudoku

Sudoku com regras combináveis, gerador com dificuldade medida por lógica
e um assistente que explica cada passo como um professor faria.

- **Lógica do jogo:** Elm (estado da partida, conflitos, modos, pontuação)
  e Prolog (geração, unicidade, resolução e raciocínio "humano").
- **Visual:** HTML + CSS puros (tema claro/escuro, layout responsivo).

## Como rodar

Requisitos: [SWI-Prolog](https://www.swi-prolog.org/) 9+ e
[Elm](https://elm-lang.org/) 0.19.1 (`npm install -g elm`). O
`frontend/public/elm.js` já vem compilado nesta cópia: sem mexer no Elm,
basta `swipl backend/server.pl 8080`.

A explicação de cada tópico da disciplina presente no projeto está em
[`docs/EXPLICACAO.md`](docs/EXPLICACAO.md).

```sh
make run          # compila o Elm e sobe o servidor em http://localhost:8080
make run PORT=3000
make test         # testes do backend (plunit)
```

Sem `make`:

```sh
cd frontend && elm make src/Main.elm --optimize --output=public/elm.js && cd ..
swipl backend/server.pl 8080
```

## O que torna este Sudoku diferente

| Recurso | Onde vive |
| --- | --- |
| 16 regras extras **combináveis**: Diagonal, Hyper, Anti-cavalo, Anti-rei, Disjunto, Não-consecutivo, Killer, Par/Ímpar, Termômetros, Setas, Kropki, X e V, Sussurro, Renban, Palíndromo, Entre-pontas | `backend/sudoku/geometry.pl`, `extras.pl`, `solver.pl`, `frontend/src/Variant.elm`, `Local.elm` |
| Regras locais desenhadas pelo Prolog a partir da solução (gerar e testar) | `backend/sudoku/extras.pl` (`make_extras/3`), `frontend/src/Overlay.elm` |
| Técnica "Regra local": um teste CLP(FD) por candidato, com explicação | `backend/sudoku/logic.pl` (`step_for(local_rule, ...)`) |
| Meta-interpretador que conta as restrições do modelo | `backend/sudoku/meta.pl` |
| Prolog chamado do Python (janus) | `backend/python/exemplo_janus.py` |
| Gerador com solução única garantida para qualquer combinação de regras | `backend/sudoku/generator.pl` |
| Dificuldade medida pela **técnica mais difícil necessária** (não pelo número de pistas) | `backend/sudoku/logic.pl` |
| Dicas explicadas em português, em cadeia de passos, com destaque no tabuleiro | `logic.pl` (`hint/4`, `prune_chain/2`), `frontend/src/Main.elm` |
| Modos Relaxado, Sobrevivência (3 vidas) e Contra o relógio | `frontend/src/Game.elm` |
| Pontuação com combos, penalidade de dicas e bônus de conclusão | `frontend/src/Game.elm` |
| Anotações, auto-notas, desfazer/refazer, atalhos de teclado | `frontend/src/Board.elm`, `Game.elm` |
| Desafio diário com regras rotativas e sequência de dias | `frontend/src/Main.elm`, `frontend/public/index.html` |
| Recordes por combinação de regras/dificuldade/modo (localStorage) | `Main.elm` (porta `saveStats`) |

Veja [`docs/FEATURES.md`](docs/FEATURES.md) para o desenho completo e o
roteiro de próximas features.

## Arquitetura

```
frontend/ (Elm + HTML/CSS)                backend/ (SWI-Prolog)
┌──────────────────────────┐   POST     ┌────────────────────────────────┐
│ Main.elm   UI e eventos   │ /api/new  │ server.pl   HTTP + JSON        │
│ Game.elm   modos, pontos  │──────────▶│ generator.pl  grade + escavação│
│ Board.elm  conflitos,     │           │ solver.pl     CLP(FD)          │
│            candidatos     │ /api/hint │ logic.pl      técnicas humanas │
│ Variant.elm geometria     │──────────▶│ geometry.pl   casas, vizinhos  │
│ Local.elm  regras locais  │           │ extras.pl     regras locais    │
│ Overlay.elm desenho (SVG) │           │ meta.pl       conta restrições │
│ Api.elm    JSON           │           │ templates.pl  grades-modelo    │
└──────────────────────────┘           └────────────────────────────────┘
```

O servidor é *stateless*: o cliente devolve regras, gaiolas, paridade,
regras locais e solução junto com o tabuleiro ao pedir uma dica.

### API

`POST /api/new`

```json
{ "rules": ["killer", "diagonal"], "difficulty": "dificil", "seed": 42 }
```

Responde com `puzzle`, `solution` (81 inteiros, 0 = vazio), `cages`
(`{sum, cells}`), `parity` (0 livre, 1 ímpar, 2 par), `extras` (regras
locais `{type, cells, param}`; `param` é `"white"`/`"black"` no kropki,
10/5 no X/V e `null` nos demais), `constraints` (quantas restrições
CLP(FD) o modelo tem), `seed` e `rating` (`level` 1–5, `label`,
`techniques` usadas com contagem).

`POST /api/hint`

```json
{ "rules": [...], "cages": [...], "parity": [...], "extras": [...], "board": [...], "solution": [...] }
```

Responde `{"status": "steps", "steps": [...]}` (cada passo traz
`technique`, `name`, `level`, `message`, `focus`, `unit`,
`eliminations` e `placement`), `{"status": "errors", "cells": [...]}`
quando há dígitos errados no tabuleiro, ou `{"status": "solved"}`.
