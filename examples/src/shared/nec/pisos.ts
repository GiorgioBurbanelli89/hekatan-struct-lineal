/**
 * CAPA NEC — 1: pisos, masa y centro de masa por piso, para CUALQUIER modelo (30-sep-2026).
 *
 * Hasta hoy solo el ejemplo test-m calculaba algo de esto, y aproximado: el CM era la media de las coordenadas de los
 * nudos (sin pesar la masa) y el peso se repartía igual entre pisos. Aquí:
 *   - los PISOS salen de los diafragmas (nodeInputs.diaphragms: nudo → id); sin diafragmas, de las cotas con losa/vigas;
 *   - la MASA de cada nudo es la ensamblada del motor (jointMass = «Assembled Joint Masses» de ETABS);
 *   - la masa de un nudo entre dos pisos (columna partida, muro) va al piso MÁS CERCANO, como el «lump at stories».
 * Juez: ETABS «Mass Summary by Story» y «Centers of Mass and Rigidity» (XCCM, YCCM) del mismo modelo.
 */
import { jointMass } from "hekatan-fem";

export type Piso = {
  k: number;               // 1 = el más bajo
  z: number;               // cota del diafragma [m]
  nudos: number[];         // nudos del piso (con los intermedios asignados)
  masa: number;            // masa traslacional UX del piso [t = kN·s²/m]
  peso: number;            // masa·g [kN]
  cm: [number, number];    // centro de masa [m]
};

const G = 9.80665;

/** La FUENTE DE MASA del modelo (como ETABS MASSSOURCE): un `.e2k` importado puede traer la masa de las CARGAS
 *  (`masssource … Dead 1 Live 0.25`, en `nodeInputs.masses`) y SIN la de los elementos (`elementos 0`). Sin
 *  fuente declarada: la de siempre, ρ·A·L de los elementos más la masa nodal que haya. */
export function opcionesMasa(nodeInputs: any, elementInputs: any): { incluyeElementos: number; masaNodal?: any } {
  const fm = elementInputs?.fuenteMasa;
  const nm = nodeInputs?.masses instanceof Map && nodeInputs.masses.size ? nodeInputs.masses : undefined;
  return { incluyeElementos: fm && !fm.elementos ? 0 : 1, ...(nm ? { masaNodal: nm } : {}) };
}

export function pisosDeModelo(nodes: number[][], elements: number[][], nodeInputs: any, elementInputs: any): Piso[] {
  const masas = jointMass(nodes as any, elements as any, elementInputs, opcionesMasa(nodeInputs, elementInputs));
  // cotas de piso: las de los diafragmas; si no hay, las de los nudos con más masa por cota
  const dia: Map<number, number> | undefined = nodeInputs?.diaphragms;
  let cotas: number[] = [];
  if (dia && dia.size) {
    const porId = new Map<number, number[]>();
    dia.forEach((id, n) => { if (!porId.has(id)) porId.set(id, []); porId.get(id)!.push(nodes[n][2]); });
    cotas = [...porId.values()].map((zs) => zs.reduce((a, b) => a + b, 0) / zs.length);
  } else {
    // sin diafragmas: un piso es una cota con LOSA o VIGAS horizontales (1-oct-2026). Contar solo masa tomaba como
    // pisos las cotas intermedias de la malla de los muros (dual en molinete: 12 «pisos» en vez de 4).
    const horiz = new Set<number>();
    elements.forEach((e) => { if (e.length >= 2) { const z = nodes[e[0]][2]; if (z > 1e-6 && e.every((n) => Math.abs(nodes[n][2] - z) < 1e-6)) horiz.add(+z.toFixed(3)); } });
    cotas = [...horiz];
  }
  if (!cotas.length) {
    const mz = new Map<number, number>();
    nodes.forEach((p, i) => { const z = +p[2].toFixed(3); mz.set(z, (mz.get(z) ?? 0) + masas[i][0]); });
    const tot = [...mz.values()].reduce((a, b) => a + b, 0);
    cotas = [...mz.entries()].filter(([z, m]) => z > 1e-6 && m > 0.02 * tot).map(([z]) => z);
  }
  cotas = [...new Set(cotas.map((z) => +z.toFixed(4)))].sort((a, b) => a - b);
  const apoyos: Map<number, any> | undefined = nodeInputs?.supports;
  const pisos: Piso[] = cotas.map((z, i) => ({ k: i + 1, z, nudos: [], masa: 0, peso: 0, cm: [0, 0] }));
  const sx = cotas.map(() => 0), sy = cotas.map(() => 0);
  nodes.forEach((p, n) => {
    if (apoyos?.has(n) && p[2] < (cotas[0] ?? 0) - 1e-6) return;          // la base no es un piso
    const m = masas[n][0]; if (!(m > 0)) return;
    let j = 0, d = Infinity;
    cotas.forEach((z, i) => { const dd = Math.abs(p[2] - z); if (dd < d) { d = dd; j = i; } });
    if (p[2] < cotas[0] / 2) return;                                       // más cerca de la base que del piso 1
    pisos[j].nudos.push(n); pisos[j].masa += m; sx[j] += m * p[0]; sy[j] += m * p[1];
  });
  pisos.forEach((q, i) => { q.peso = q.masa * G; q.cm = q.masa > 0 ? [sx[i] / q.masa, sy[i] / q.masa] : [0, 0]; });
  return pisos;
}
