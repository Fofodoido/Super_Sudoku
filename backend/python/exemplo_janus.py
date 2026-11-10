"""Chamando o gerador e o motor lógico (Prolog) a partir do Python, com janus.

    pip install janus-swi          # precisa do SWI-Prolog 9.1.12 ou mais novo
    python backend/python/exemplo_janus.py

janus coloca Prolog e Python no MESMO processo: sem servidor e sem JSON.
Listas viram listas, números viram números, átomos e strings viram str.
Variáveis que começam com _ não voltam para o Python: usamos isso para
termos sem equivalente em Python (o contexto ctx/6, as regras locais).
"""

import pathlib

import janus_swi as janus

PASTA = pathlib.Path(__file__).resolve().parent.parent / "sudoku"
for modulo in ["geometry", "solver", "generator", "logic", "meta"]:
    janus.consult(str(PASTA / f"{modulo}.pl"))

# 1) Gerar um puzzle: o gerador devolve game(Ctx, Puzzle, Solucao, Avaliacao).
r = janus.query_once(
    "generator:generate([thermo, kropki], medio, 42, game(_Ctx, Puzzle, Solucao, rating(Nivel, _))),"
    "meta:count_constraints(_Ctx, N)"
)
print(f"Puzzle gerado: nível {r['Nivel']}, {r['N']} restrições CLP(FD)")
for linha in range(9):
    cel = r["Puzzle"][linha * 9:(linha + 1) * 9]
    print("  ", " ".join(str(v) if v else "." for v in cel))

# 2) Mandar dados do Python para o Prolog: o dicionário do 2º argumento liga
#    variáveis da consulta a valores Python antes de consultar.
r2 = janus.query_once(
    "geometry:zeros(Z), geometry:build_context([], [], Z, _C), solver:unique_solution(_C, P)",
    {"P": r["Puzzle"]},
)
print("\nSolução única pelo modelo clássico (sem as regras locais)?", r2["truth"])

# 3) Várias respostas: o backtracking do Prolog vira um iterador Python.
print("\nTécnicas do motor lógico:")
for t in janus.query("logic:technique(Id, Nivel, Nome)"):
    print(f"   nível {t['Nivel']}: {t['Nome']}")
