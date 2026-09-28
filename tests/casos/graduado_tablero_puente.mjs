/**
 * Graduado: tablero-puente (losa Q4 + 3 vigas frame, test Gustavo Solar).
 *
 * La página vieja no comparaba contra un número de SAP2000 en código — solo
 * texto de recomendación ("Modo 1 coincide con SAP2000", "Modo 0 sobre-rigidiza
 * por ~2x"). Sin un número de referencia no hay con qué arbitrar un pasa/no-pasa
 * exacto; lo que SÍ se puede comprobar, porque sale de la propia física del
 * modelo (más área + más inercia en el frame = menos flecha), es que el modo 0
 * (Naive, doble-T completa) es AL MENOS tan rígido como el modo 1 (Solar).
 * Se corren los 3 modos y se reportan las 3 flechas, como pide la tarea.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-tablero-puente";
export const descripcion = "losa Q4 + 3 vigas frame, 3 modos de vinculación viga-losa (graduado de main.ts)";

function estados() {
  const st = () => ({ val: undefined, rawVal: undefined });
  return {
    nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(),
    deformOutputs: st(), analyzeOutputs: st(), objects3D: st(),
  };
}

export async function correr() {
  const v = await empaquetar(`
    export { tableroPuente } from "${R}/examples/src/tablero-puente/tableroPuente";
  `, "graduado-tablero-puente");
  const filas = [];

  const ex = v.tableroPuente;
  const paramsBase = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));

  // ── modo por defecto (1 = Solar): nudos, NaN, equilibrio ──
  const states1 = estados();
  ex.build(paramsBase, states1);
  const nodes = states1.nodes.val, elements = states1.elements.val;
  const nShell = elements.filter((e) => e.length === 4).length;
  const nFrame = elements.filter((e) => e.length === 2).length;
  filas.push({
    que: "nudos y elementos (modo 1, Solar)", crudo: true,
    medido: `${nodes.length} nudos, ${nShell} shells (losa) + ${nFrame} frames (vigas) de ${elements.length}`,
    limite: "shells + frames, sin hexaedros",
    ok: nShell + nFrame === elements.length && nShell > 0 && nFrame > 0,
  });

  const defs = states1.deformOutputs.val.deformations;
  let nan = 0;
  defs.forEach((u) => { if (u.some((x) => !Number.isFinite(x))) nan++; });
  filas.push({ que: "deformada sin NaN", crudo: true, medido: `${nan} nudos con NaN de ${defs.size}`, limite: "0", ok: nan === 0 });

  const reac = states1.deformOutputs.val.reactions;
  const loadsMap = states1.nodeInputs.val.loads;
  const sumR = [0, 0, 0], sumL = [0, 0, 0];
  reac?.forEach((r) => { for (let k = 0; k < 3; k++) sumR[k] += r[k]; });
  loadsMap?.forEach((l) => { for (let k = 0; k < 3; k++) sumL[k] += l[k]; });
  const totalLoad = Math.hypot(...sumL) || 1;
  const ejes = ["X", "Y", "Z"];
  for (let k = 0; k < 3; k++) {
    const desbalance = Math.abs(sumR[k] + sumL[k]);
    const pct = (desbalance / totalLoad) * 100;
    filas.push({
      que: `equilibrio ${ejes[k]} (modo 1)`, medido: pct, limite: 1e-6, ok: pct <= 1e-6,
      detalle: `ΣR=${sumR[k].toFixed(6)} + ΣL=${sumL[k].toFixed(6)} kN`,
    });
  }

  // ── correr los 3 modos y reportar las 3 flechas ──
  const deltas = [];
  for (const modo of [0, 1, 2]) {
    const p = { ...paramsBase, modo };
    const states = estados();
    ex.build(p, states);
    const etiquetas = ex.computedLabels(p, states);
    const delta_mm = parseFloat(etiquetas["δ midspan (mm)"]);
    deltas.push(delta_mm);
    filas.push({
      que: `δ midspan, modo ${modo}`, crudo: true,
      medido: `${delta_mm.toFixed(3)} mm`,
      limite: "informativo — la página vieja solo daba texto de recomendación, sin número de SAP2000 en código",
      ok: Number.isFinite(delta_mm) && delta_mm > 0,
      detalle: etiquetas["Modo activo"],
    });
  }

  // ── consistencia física: modo 0 (doble-T completa, rigidez duplicada) tiene
  //    que ser AL MENOS tan rígido (δ menor o igual) que el modo 1 (Solar) ──
  const [d0, d1] = deltas;
  const masRigido = d0 <= d1 * 1.001; // pequeña tolerancia numérica
  filas.push({
    que: "modo 0 (Naive) es más rígido que modo 1 (Solar)", crudo: true,
    medido: `δ0=${d0.toFixed(3)} mm, δ1=${d1.toFixed(3)} mm`,
    limite: "δ0 ≤ δ1 (más área+inercia en el frame → menos flecha), según el propio comentario de main.ts",
    ok: masRigido,
  });

  return filas;
}
