/**
 * Graduado: viga-doble-t (Viga Doble-T asimétrica en shells Q4, cantilever).
 *
 * Construye el ejemplo del workspace con sus valores por defecto (estados
 * falsos, patrón de `tests/casos/solidos_visor.mjs` sección 5) y comprueba:
 *   1. cuántos elementos hay y de qué tipo (todos shells: sin frames ni hex)
 *   2. que la deformada no tiene NaN
 *   3. equilibrio: Σreacciones + Σcargas = 0 en X, Y, Z (límite 1e-6 % de la carga total)
 *   4. el benchmark de la página vieja: δ FEM vs δ Euler-Bernoulli, con el
 *      mismo límite «PASA» que usaba el panel original (< 5 %)
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-viga-doble-t";
export const descripcion = "viga doble-T asimétrica en shells Q4 (graduado de main.ts) vs Euler-Bernoulli";

export async function correr() {
  const v = await empaquetar(`
    export { vigaDobleT } from "${R}/examples/src/viga-doble-t/vigaDobleT";
  `, "graduado-viga-doble-t");
  const filas = [];

  const ex = v.vigaDobleT;
  const params = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));
  const st = () => ({ val: undefined, rawVal: undefined });
  const states = {
    nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(),
    deformOutputs: st(), analyzeOutputs: st(), objects3D: st(),
  };
  ex.build(params, states);

  const nodes = states.nodes.val, elements = states.elements.val;
  const nShell = elements.filter((e) => e.length === 4).length;
  filas.push({
    que: "nudos y elementos", crudo: true,
    medido: `${nodes.length} nudos, ${nShell} shells de ${elements.length} elementos`,
    limite: "todo shells (0 frames, 0 hexaedros)",
    ok: nShell === elements.length && nodes.length > 0 && elements.length > 0,
  });

  const defs = states.deformOutputs.val.deformations;
  let nan = 0;
  defs.forEach((u) => { if (u.some((x) => !Number.isFinite(x))) nan++; });
  filas.push({ que: "deformada sin NaN", crudo: true, medido: `${nan} nudos con NaN de ${defs.size}`, limite: "0", ok: nan === 0 });

  // ── equilibrio: Σreacciones + Σcargas = 0 por componente ──
  const reac = states.deformOutputs.val.reactions;
  const loadsMap = states.nodeInputs.val.loads;
  const sumR = [0, 0, 0], sumL = [0, 0, 0];
  reac?.forEach((r) => { for (let k = 0; k < 3; k++) sumR[k] += r[k]; });
  loadsMap?.forEach((l) => { for (let k = 0; k < 3; k++) sumL[k] += l[k]; });
  const totalLoad = Math.hypot(...sumL) || 1;
  const ejes = ["X", "Y", "Z"];
  for (let k = 0; k < 3; k++) {
    const desbalance = Math.abs(sumR[k] + sumL[k]);
    const pct = (desbalance / totalLoad) * 100;
    filas.push({
      que: `equilibrio ${ejes[k]}`, medido: pct, limite: 1e-6, ok: pct <= 1e-6,
      detalle: `ΣR=${sumR[k].toFixed(6)} + ΣL=${sumL[k].toFixed(6)} kN`,
    });
  }

  // ── benchmark de la página vieja: δ FEM vs Euler-Bernoulli ──
  const etiquetas = ex.computedLabels(params, states);
  const errPct = parseFloat(etiquetas["Δ vs E-B (%)"]);
  filas.push({
    que: "δ FEM vs Euler-Bernoulli", medido: errPct, limite: 5, ok: errPct <= 5,
    detalle: `δ_FEM=${etiquetas["δ punta FEM (m)"]} vs δ_analítica=${etiquetas["δ punta analítica (m)"]} — límite «PASA» de la página original`,
  });

  return filas;
}
