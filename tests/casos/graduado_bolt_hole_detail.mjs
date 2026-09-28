/**
 * Graduado: bolt-hole-detail (placa con orificio circular, malla polar, problema de Kirsch).
 *
 * La página vieja nunca calculaba Kt en pantalla — solo mostraba el colormap.
 * Kt se agregó recién al graduar (`computedLabels`), así que NO hay un límite
 * "pasa/no pasa" heredado de la página original para esa fila: se reporta el
 * valor medido tal cual, sin forzarlo contra el 3.00 teórico de Kirsch (placa
 * infinita) — esta es una placa FINITA con malla gruesa cerca del borde
 * exterior, así que un desvío grande es HONESTO, no un error del test.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-bolt-hole-detail";
export const descripcion = "placa con orificio (Kirsch), malla polar Q4 + perno frame (graduado de main.ts)";

export async function correr() {
  const v = await empaquetar(`
    export { boltHoleDetail } from "${R}/examples/src/bolt-hole-detail/boltHoleDetail";
  `, "graduado-bolt-hole-detail");
  const filas = [];

  const ex = v.boltHoleDetail;
  const params = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));
  const st = () => ({ val: undefined, rawVal: undefined });
  const states = {
    nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(),
    deformOutputs: st(), analyzeOutputs: st(), objects3D: st(),
  };
  ex.build(params, states);

  const nodes = states.nodes.val, elements = states.elements.val;
  const nShell = elements.filter((e) => e.length === 4).length;
  const nFrame = elements.filter((e) => e.length === 2).length;
  filas.push({
    que: "nudos y elementos", crudo: true,
    medido: `${nodes.length} nudos, ${nShell} shells (placa) + ${nFrame} frames (perno) de ${elements.length}`,
    limite: "shells + frames, sin hexaedros",
    ok: nShell + nFrame === elements.length && nShell > 0 && nFrame > 0,
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

  // ── Kt medido (nuevo — sin límite heredado, se reporta honesto) ──
  const etiquetas = ex.computedLabels(params, states);
  const Kt = parseFloat(etiquetas["Kt medido (FEM, placa finita)"]);
  filas.push({
    que: "Kt medido (σ_vM borde orificio / σ_nominal)", crudo: true,
    medido: `Kt=${Kt.toFixed(3)}`,
    limite: "informativo — Kirsch (placa infinita) = 3.00, sin límite heredado de la página vieja",
    ok: Number.isFinite(Kt) && Kt > 1,   // sanity: tiene que haber concentración de tensiones (Kt>1)
    detalle: `diferencia vs 3.00: ${etiquetas["Diferencia vs teórico"]}`,
  });

  return filas;
}
