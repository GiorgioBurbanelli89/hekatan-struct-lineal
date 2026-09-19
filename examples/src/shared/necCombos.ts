/**
 * Generador de combinaciones de carga NEC-SE-CG (LRFD) — Módulo 2.
 *
 * NO crea un sistema nuevo: produce `LoadCombination[]` que se enchufan al panel
 * "Σ Load Combinations" existente. Es OPCIONAL en cada ejemplo (botón
 * "⚡ Generar NEC-SE-CG" en el panel de cargas).
 *
 * Combinaciones NEC-SE-CG §3.4.3 (basadas en ASCE 7 / LRFD):
 *   1)  1.4 D
 *   2)  1.2 D + 1.6 L + 0.5 (Lr ó S)
 *   3)  1.2 D + 1.6 (Lr ó S) + (1.0 L ó 0.5 W)
 *   4)  1.2 D ± 1.0 W + 1.0 L + 0.5 (Lr ó S)
 *   5)  1.2 D ± 1.0 E + 1.0 L
 *   6)  0.9 D ± 1.0 W
 *   7)  0.9 D ± 1.0 E
 *
 * Las combinaciones se construyen referenciando los CASES existentes según el
 * TIPO del pattern que aplican (Dead→D, Live→L, Live (Roof)→Lr, Snow→S,
 * Wind→W, Seismic→E). El sismo y viento generan variantes ± por cada case
 * (p.ej. EQX, EQY producen sus propias combinaciones).
 *
 * DNE — SOBRECARGA MUERTA / "Super Dead" (Jorge, 19-sep-2026): enlucido, masillado,
 * piso, cielo raso, mampostería... Igual que en SAFE/ETABS (ACI 318-19), DNE lleva
 * SIEMPRE el MISMO factor que D en TODA combinación — por eso cada término D de abajo
 * ahora también emite su DNE hermano con idéntico factor (función `Ds`). Además de
 * las combinaciones NEC-SE-CG genéricas, se agregan las DOS que pidió Jorge con SUS
 * nombres literales (no autogenerados), que es como las tiene costumbre de nombrar
 * en Ecuador:
 *   SERVICIO = 1.0 D + 1.0 DNE + 1.0 L
 *   DISEÑO   = 1.2 D + 1.2 DNE + 1.6 L
 * Si no hay case de tipo "Super Dead" en el modelo, `DNE` sale `undefined` y `Ds()`
 * no añade nada — 0 % de cambio para un modelo que no usa DNE (compatibilidad).
 */
import type { LoadCase, LoadPattern, LoadCombination } from "hekatan-fem";

/** Infiere el tipo de carga de un case a partir del pattern que aplica. */
function caseLoadType(c: LoadCase, ptype: Map<string, string>): string | null {
  if (c.patterns && c.patterns.length > 0) {
    // pattern con mayor |scaleFactor| domina; fallback al primero
    let best = c.patterns[0];
    for (const p of c.patterns) if (Math.abs(p.scaleFactor) > Math.abs(best.scaleFactor)) best = p;
    return ptype.get(best.pattern) ?? null;
  }
  // case sin patterns: quizá su nombre coincide con un pattern
  return ptype.get(c.name) ?? null;
}

type Term = { case: string; sf: number };

function comboName(cases: Term[]): string {
  return cases.map((c, i) => {
    const term = `${Math.abs(c.sf)}${c.case}`;
    if (i === 0) return (c.sf < 0 ? "-" : "") + term;
    return (c.sf < 0 ? " - " : " + ") + term;
  }).join("");
}

export function generateNecSeCgCombos(cases: LoadCase[], patterns: LoadPattern[]): LoadCombination[] {
  const ptype = new Map(patterns.map((p) => [p.name, p.type as string]));
  const bucket: Record<string, string[]> = {
    Dead: [], "Super Dead": [], Live: [], "Live (Roof)": [], Snow: [], Wind: [], Seismic: [],
  };
  for (const c of cases) {
    const t = caseLoadType(c, ptype);
    if (t && bucket[t]) bucket[t].push(c.name);
  }

  const D = bucket.Dead[0];
  const DNE = bucket["Super Dead"][0];
  const L = bucket.Live[0];
  const Lr = bucket["Live (Roof)"][0];
  const S = bucket.Snow[0];
  const roof = Lr ?? S; // max(Lr, S) simplificado: usa el que exista
  const winds = bucket.Wind;
  const eqs = bucket.Seismic;

  const combos: LoadCombination[] = [];
  const add = (terms: Array<Term | null>) => {
    const cs = terms.filter((t): t is Term => !!t && !!t.case);
    if (cs.length === 0) return;
    combos.push({
      name: `NEC ${comboName(cs)}`,
      type: "Linear Add",
      cases: cs.map((t) => ({ case: t.case, scaleFactor: t.sf })),
    });
  };
  const T = (c: string | undefined, sf: number): Term | null => (c ? { case: c, sf } : null);
  // D y su hermana DNE con el MISMO factor (Super Dead, semántica CSI). Si el
  // modelo no tiene case "Super Dead", `DNE` es undefined y T(DNE,sf) da null,
  // que `add` descarta — igual que hoy para un modelo sin DNE.
  const Ds = (sf: number): Term[] => [T(D, sf), T(DNE, sf)].filter((t): t is Term => !!t);

  // 1) 1.4 D (+1.4 DNE)
  add([...Ds(1.4)]);
  // 2) 1.2 D (+1.2 DNE) + 1.6 L + 0.5 (Lr ó S)
  add([...Ds(1.2), T(L, 1.6), T(roof, 0.5)]);
  // 3) 1.2 D (+DNE) + 1.6 (Lr ó S) + 1.0 L   y   ... + 0.5 W (por viento)
  add([...Ds(1.2), T(roof, 1.6), T(L, 1.0)]);
  for (const w of winds) add([...Ds(1.2), T(roof, 1.6), T(w, 0.5)]);
  // 4) 1.2 D (+DNE) ± 1.0 W + 1.0 L + 0.5 (Lr ó S)   (por viento)
  for (const w of winds) {
    add([...Ds(1.2), T(w, 1.0), T(L, 1.0), T(roof, 0.5)]);
    add([...Ds(1.2), T(w, -1.0), T(L, 1.0), T(roof, 0.5)]);
  }
  // 5) 1.2 D (+DNE) ± 1.0 E + 1.0 L   (por sismo: EQX, EQY, ...)
  for (const e of eqs) {
    add([...Ds(1.2), T(e, 1.0), T(L, 1.0)]);
    add([...Ds(1.2), T(e, -1.0), T(L, 1.0)]);
  }
  // 6) 0.9 D (+DNE) ± 1.0 W   (por viento)
  for (const w of winds) {
    add([...Ds(0.9), T(w, 1.0)]);
    add([...Ds(0.9), T(w, -1.0)]);
  }
  // 7) 0.9 D (+DNE) ± 1.0 E   (por sismo)
  for (const e of eqs) {
    add([...Ds(0.9), T(e, 1.0)]);
    add([...Ds(0.9), T(e, -1.0)]);
  }

  // SERVICIO / DISEÑO — los nombres literales que usa Jorge en Ecuador (no el
  // autogenerado "NEC 1D+1DNE+1L"), como hace SAFE/ETABS con ACI 318-19. Solo
  // se generan si el modelo tiene Dead y Live (DNE es opcional: sin ella, D solo).
  const addNombrada = (nombre: string, terms: Array<Term | null>) => {
    const cs = terms.filter((t): t is Term => !!t && !!t.case);
    if (!cs.length) return;
    combos.push({ name: nombre, type: "Linear Add", cases: cs.map((t) => ({ case: t.case, scaleFactor: t.sf })) });
  };
  if (D || DNE) {
    addNombrada("SERVICIO", [...Ds(1.0), T(L, 1.0)]);
    addNombrada("DISEÑO", [...Ds(1.2), T(L, 1.6)]);
  }

  // dedup por nombre (combos que colapsan al faltar términos L/Lr/S/W/E)
  const seen = new Set<string>();
  return combos.filter((c) => (seen.has(c.name) ? false : (seen.add(c.name), true)));
}

/** Combina las NEC con las existentes evitando duplicar por nombre. */
export function mergeCombos(existing: LoadCombination[], generated: LoadCombination[]): LoadCombination[] {
  const names = new Set(existing.map((c) => c.name));
  return [...existing, ...generated.filter((c) => !names.has(c.name))];
}
