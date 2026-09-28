/**
 * EJEMPLO GRADUADO `solid-cube-fem`: nudo columna–viga en sólidos H8 (28-sep-2026).
 *
 * Construye el ExampleDef con sus valores por defecto y estados falsos, y comprueba:
 *   - que monta solo hexaedros de 8 nudos, sin NaN en la deformada;
 *   - que la suma de las cargas nodales es la P pedida (hex8Solve no devuelve reacciones,
 *     así que el equilibrio con reacciones no se puede mirar);
 *   - la comparación de la página de antes con los rangos que ella misma declaraba:
 *     Δ vs (E-B + Timoshenko + giro de columna) < 15 %, Δ vs E-B puro entre 20 y 40 %;
 *   - la flecha del extremo y el desplazamiento máximo, sellados como regresión.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-solid-cube-fem";
export const descripcion = "solid-cube-fem graduado: nudo columna-viga H8, flecha vs E-B + Timoshenko + giro de columna";

// Sellado el 28-sep-2026 con los valores por defecto (regresión, no referencia externa).
const SELLO_DELTA_HE = -9.7775088e-4;  // m, media de uz en el extremo de la viga
const SELLO_UMAX = 9.7899233e-4;      // m, máximo |u| de todos los nudos
const pct = (a, b) => Math.abs(a - b) / Math.abs(b) * 100;

export async function correr() {
  const v = await empaquetar(`
    export { columnaVigaSolidos, mallaColumnaViga, compararColumnaViga, COLUMNA_VIGA_DEFAULT } from "${R}/examples/src/solid-cube-fem/columnaVigaSolidos";
  `, "graduado-solid-cube-fem");
  const filas = [];
  const ex = v.columnaVigaSolidos;
  const params = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));
  const st = () => ({ val: undefined, rawVal: undefined });
  const states = { nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(), deformOutputs: st(), analyzeOutputs: st(), objects3D: st() };
  ex.build(params, states);

  const els = states.elements.val, nN = states.nodes.val.length;
  const nHex = els.filter((e) => e.length === 8).length, otros = els.length - nHex;
  filas.push({ que: "elementos por tipo", crudo: true, medido: `${nN} nudos, ${nHex} H8, ${otros} de otro tipo`, limite: "solo H8", ok: nHex > 0 && otros === 0 });

  const U = states.deformOutputs.val.deformations;
  let nan = 0, umax = 0;
  for (const [, u] of U) for (let c = 0; c < 3; c++) { if (!Number.isFinite(u[c])) nan++; else umax = Math.max(umax, Math.abs(u[c])); }
  filas.push({ que: "deformada sin NaN", crudo: true, medido: `${nan} NaN en ${U.size} nudos`, limite: `0 NaN, ${nN} nudos`, ok: nan === 0 && U.size === nN });

  const m = v.mallaColumnaViga(v.COLUMNA_VIGA_DEFAULT);
  let fz = 0; for (const [, f] of states.nodeInputs.val.loads) fz += f[2];
  const dP = Math.abs(fz - params.P_tip);
  filas.push({ que: "suma de cargas nodales = P", crudo: true, medido: `${fz.toFixed(9)} kN en ${m.tipNodes.length} nudos`, limite: `${params.P_tip} kN (±1e-9)`, ok: dP <= 1e-9, detalle: "hex8Solve no devuelve reacciones: no hay equilibrio que mirar" });

  const ao = states.analyzeOutputs.val;
  const nSt = ao.solidStress instanceof Map ? ao.solidStress.size : 0;
  filas.push({ que: "tensiones de todos los H8 (solidStress)", crudo: true, medido: `${nSt} elementos`, limite: `${nHex}`, ok: nSt === nHex });

  const sol = new Map([...U].map(([n, u]) => [n, [u[0], u[1], u[2]]]));
  const c = v.compararColumnaViga(v.COLUMNA_VIGA_DEFAULT, m, sol);
  filas.push({ que: "δ H8 vs E-B + Timoshenko + giro col", medido: c.errTotalPct, limite: 15, ok: c.errTotalPct < 15,
    detalle: `δ_H8 ${c.delta_he.toExponential(4)} m, δ_total ${c.delta_total_an.toExponential(4)} m (EB ${c.delta_EB.toExponential(3)}, corte ${c.delta_shear.toExponential(3)}, col ${c.delta_col.toExponential(3)}); límite de la página: < 15 %` });
  // La página decía «esperado 20-40 % extra» sobre E-B en un console.log, pero su propia cuenta
  // analítica ya queda fuera: (δ_total − δ_EB)/δ_EB = 44.6 % con los valores por defecto (el giro
  // de la columna solo aporta 36.6 %). No se puede usar ese rango como límite sin contradecir la
  // fórmula de la misma página: fila INFORMATIVA (ok siempre que δ_H8 > δ_EB, que sí es físico).
  const extraAn = Math.abs(c.delta_total_an - c.delta_EB) / Math.abs(c.delta_EB) * 100;
  filas.push({ que: "δ H8 por encima de E-B puro (informativo)", crudo: true, medido: `${c.errEBpct.toFixed(2)} %`, limite: `la página decía 20-40 %; la fórmula analítica da ${extraAn.toFixed(1)} %`, ok: Math.abs(c.delta_he) > Math.abs(c.delta_EB) });

  filas.push({ que: "sello δ extremo H8", medido: pct(c.delta_he, SELLO_DELTA_HE), limite: 1e-4, ok: pct(c.delta_he, SELLO_DELTA_HE) <= 1e-4, detalle: `${c.delta_he.toExponential(7)} vs ${SELLO_DELTA_HE.toExponential(7)} m` });
  filas.push({ que: "sello |u| máximo", medido: pct(umax, SELLO_UMAX), limite: 1e-4, ok: pct(umax, SELLO_UMAX) <= 1e-4, detalle: `${umax.toExponential(7)} vs ${SELLO_UMAX.toExponential(7)} m` });

  const et = ex.computedLabels(params, states);
  const faltan = ["δ E-B = P·L³/(3·E·I)", "δ Timoshenko = P·L/(κ·G·A)", "δ giro columna = θ·L, θ = M·Lz/(16·E·Ic)", "δ TOTAL analítico", "δ extremo H8 (media de uz)", "Δ vs total analítico", "Δ vs E-B puro", "Estado", "I viga", "L viga", "P extremo"].filter((k) => !(k in et));
  filas.push({ que: "folder «Calculados»: los números de la página", crudo: true, medido: faltan.length ? `faltan ${faltan.join(", ")}` : `${Object.keys(et).length} valores, ${et["Estado"]}`, limite: "todos", ok: faltan.length === 0 });
  return filas;
}
