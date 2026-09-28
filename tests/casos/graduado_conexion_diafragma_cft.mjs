/**
 * Graduado: conexion-diafragma-cft (columna CFT + viga W + diafragma externo, todo shells Q4).
 *
 * La página vieja mostraba σ_vM medido y el "ratio Hek/Anal" contra la
 * aproximación CIDECT/Cervantes, pero nunca fijó un límite numérico de
 * pasa/no-pasa para ese ratio (es una aproximación de diseño, no un árbitro
 * exacto tipo ETABS/SAP2000) — se reporta informativo, sin inventar un límite.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-conexion-diafragma-cft";
export const descripcion = "columna CFT + viga W + diafragma externo, shells Q4 (graduado de main.ts) vs CIDECT/Cervantes";

export async function correr() {
  const v = await empaquetar(`
    export { conexionDiafragmaCft } from "${R}/examples/src/conexion-diafragma-cft/conexionDiafragmaCft";
  `, "graduado-conexion-diafragma-cft");
  const filas = [];

  const ex = v.conexionDiafragmaCft;
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
    medido: `${nodes.length} nudos, ${nShell} shells de ${elements.length}`,
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

  // ── comprobación en vivo de la página vieja: σ_vM medido vs σ_diafragma analítico (CIDECT) ──
  const etiquetas = ex.computedLabels(params, states);
  const ratio = parseFloat(etiquetas["ratio Hek/Anal"]);
  filas.push({
    que: "σ_vM diafragma vs analítico CIDECT (ratio)", crudo: true,
    medido: `ratio=${ratio.toFixed(2)}`,
    limite: "informativo — la página vieja no fijaba un límite pasa/no-pasa para este ratio",
    ok: Number.isFinite(ratio) && ratio > 0,
    detalle: `σ_vM=${etiquetas["σ vM max (kN/m²)"]} vs σ_analítico=${etiquetas["σ analítico (kN/m²)"]}`,
  });

  return filas;
}
