/**
 * Ejemplo graduado `beams` (Paz & Leigh 6.3 Space Frame) — ver
 * docs/GRADUAR_UN_EJEMPLO.md.
 *
 * Construye el ExampleDef con sus valores por defecto (estados falsos, como en
 * `tests/casos/solidos_visor.mjs` sección 5) y comprueba: cuenta de nudos y
 * barras, ausencia de NaN en la deformada estática, equilibrio ΣR+ΣF=0 y los
 * 6 modos contra ETABS 22 (offsets=0) por el mismo camino que usa
 * `pazEjemplo63.runModal` — `modalAnalysis(nodes, elements, nodeInputs,
 * elementInputs, NUM_MODES)`, camino DENSO (lateralMass=0 por defecto). El
 * límite es el mismo 0.1 % que usa `tests/casos/paz_6_3.mjs` para la misma
 * comparación (el camino denso ahí sale hasta 0.06 %, dentro del límite).
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-beams";
export const descripcion = "ejemplo graduado beams (Paz 6.3): cuenta, sin NaN, equilibrio y 6 modos vs ETABS 22";

const TOL_MODAL = 0.1; // %, igual que tests/casos/paz_6_3.mjs

export async function correr() {
  const v = await empaquetar(`
    export { pazEjemplo63, mallaPaz63, NUM_MODES, ETABS_22_FREQS } from "${R}/examples/src/beams/pazEjemplo63";
    export { modalAnalysis } from "${R}/hekatan-fem/src/index";
  `, "graduado-beams");
  const filas = [];

  const ex = v.pazEjemplo63;
  const params = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));
  const st = () => ({ val: undefined, rawVal: undefined });
  const states = {
    nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(),
    deformOutputs: st(), analyzeOutputs: st(), objects3D: st(),
  };
  ex.build(params, states);

  const nNodes = states.nodes.val.length;
  const nElem = states.elements.val.length;
  filas.push({
    que: "nudos y barras", crudo: true,
    medido: `${nNodes} nudos, ${nElem} barras`,
    limite: "8 nudos, 8 barras (4 columnas + 4 vigas)",
    ok: nNodes === 8 && nElem === 8,
  });

  const defs = states.deformOutputs.val.deformations;
  let nan = 0;
  for (const [, d] of defs) for (const x of d) if (!isFinite(x)) nan++;
  filas.push({
    que: "sin NaN en la deformada estática", crudo: true,
    medido: `${nan} componentes`, limite: "0", ok: nan === 0,
  });

  // Equilibrio GLOBAL: no solo suma de fuerzas — las columnas están en 4 nudos
  // distintos, así que hay que sumar tambien los MOMENTOS respecto de un punto
  // común (el origen), con el brazo r×F de cada fuerza (carga o reacción). Suma
  // de fuerzas + suma de (M + r×F) tiene que dar cero; límite 1e-6 % de la carga.
  const reacts = states.deformOutputs.val.reactions;
  const cargas = states.nodeInputs.val.loads;
  const sumF = [0, 0, 0], sumM = [0, 0, 0];
  const acumular = (nodo, v6) => {
    const [x, y, z] = states.nodes.val[nodo];
    const [Fx, Fy, Fz, Mx, My, Mz] = v6;
    sumF[0] += Fx; sumF[1] += Fy; sumF[2] += Fz;
    sumM[0] += Mx + (y * Fz - z * Fy);
    sumM[1] += My + (z * Fx - x * Fz);
    sumM[2] += Mz + (x * Fy - y * Fx);
  };
  for (const [n, l] of cargas) acumular(n, l);
  for (const [n, r] of reacts) acumular(n, r);
  const totalCarga = Math.hypot(...[...cargas.values()].flatMap((l) => l.slice(0, 3))) || 1;
  const desbalance = Math.hypot(...sumF, ...sumM);
  const pctDesbalance = (desbalance / totalCarga) * 100;
  filas.push({
    que: "equilibrio ΣF=0 y ΣM=0 (origen)", medido: pctDesbalance, limite: 1e-6,
    ok: pctDesbalance <= 1e-6,
    detalle: `ΣF=[${sumF.map((x) => x.toFixed(6)).join(",")}]  ΣM=[${sumM.map((x) => x.toFixed(6)).join(",")}]`,
  });

  // Los 6 modos, por el MISMO camino que pazEjemplo63.runModal():
  // modalAnalysis(nodes, elements, nodeInputs, elementInputs, NUM_MODES), sin
  // pasar lateralMass (defecto 0 = camino DENSO).
  const m = v.mallaPaz63(params);
  const modalOut = v.modalAnalysis(m.nodes, m.elements, m.nodeInputs, m.elementInputs, v.NUM_MODES);
  const freqs = modalOut.frequencies ?? [];
  for (let k = 0; k < v.ETABS_22_FREQS.length; k++) {
    const f = freqs[k] ?? NaN;
    const dif = (100 * (f - v.ETABS_22_FREQS[k])) / v.ETABS_22_FREQS[k];
    filas.push({
      que: `modo ${k + 1} vs ETABS 22`, medido: dif, limite: TOL_MODAL,
      ok: Math.abs(dif) <= TOL_MODAL,
      detalle: `${f.toFixed(4)} Hz vs ${v.ETABS_22_FREQS[k].toFixed(4)} Hz — vía modalAnalysis(...) (camino denso, el que llama runModal)`,
    });
  }

  return filas;
}
