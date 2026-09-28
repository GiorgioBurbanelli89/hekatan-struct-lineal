/**
 * EJEMPLO GRADUADO `columna-cft-h8`: tubo de acero (Q4) relleno de hormigón (H8) en UNA sola
 * K, con los nudos comunes (28-sep-2026).
 *
 * Comprueba, con los valores por defecto y estados falsos:
 *   - cuántas cáscaras y cuántos H8 monta, sin NaN;
 *   - equilibrio: Σ reacciones + Σ cargas = 0 en las tres fuerzas;
 *   - el reparto de Pu entre acero y hormigón. La parte del hormigón sale de las tensiones de
 *     los H8 de la primera planta; la del acero, como ΣRz − Nc. Se contrasta con la del acero
 *     calculada POR OTRO CAMINO (fuerza de membrana N22 de las cáscaras de la primera planta):
 *     las dos tienen que coincidir a precisión de máquina, porque las dos son la misma
 *     identidad de equilibrio del modelo discreto;
 *   - el reparto medido frente al que predicen Es·As y Ec·Ac: fila INFORMATIVA (la página no
 *     daba ningún límite y no hay de dónde sacar uno sin inventarlo);
 *   - δ axial frente a Pu·Lz/(Es·As + Ec·Ac): informativo también (la página lo llamaba así);
 *   - acortamiento y |u| máximo sellados como regresión.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-columna-cft-h8";
export const descripcion = "columna-cft-h8 graduada: Q4 + H8 con nudos comunes en una sola K, reparto acero/hormigón";

// Sellado el 28-sep-2026 con los valores por defecto (regresión, no referencia externa).
const SELLO_UZ_TOPE = -8.507844563e-4;  // m, máx |uz| en el tope
const SELLO_UMAX = 8.507844563e-4;      // m, máx |u| de todos los nudos
const pct = (a, b) => Math.abs(a - b) / Math.abs(b) * 100;

export async function correr() {
  const v = await empaquetar(`
    export { columnaCftH8, mallaColumnaCft, panelColumnaCft, resolverColumnaCft, CFT_DEFAULT } from "${R}/examples/src/columna-cft-h8/columnaCftH8";
  `, "graduado-columna-cft-h8");
  const filas = [];
  const ex = v.columnaCftH8;
  const params = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));
  const st = () => ({ val: undefined, rawVal: undefined });
  const states = { nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(), deformOutputs: st(), analyzeOutputs: st(), objects3D: st() };
  ex.build(params, states);

  const els = states.elements.val, nN = states.nodes.val.length;
  const nQ4 = els.filter((e) => e.length === 4).length, nH8 = els.filter((e) => e.length === 8).length;
  const otros = els.length - nQ4 - nH8;
  const p = v.CFT_DEFAULT;
  const esperaQ4 = 2 * p.nz * (p.nx + p.ny), esperaH8 = p.nx * p.ny * p.nz, esperaN = (p.nx + 1) * (p.ny + 1) * (p.nz + 1);
  filas.push({ que: "elementos por tipo", crudo: true, medido: `${nN} nudos, ${nQ4} Q4, ${nH8} H8, ${otros} otros`, limite: `${esperaN} nudos, ${esperaQ4} Q4, ${esperaH8} H8, 0 otros`, ok: nN === esperaN && nQ4 === esperaQ4 && nH8 === esperaH8 && otros === 0 });

  const U = states.deformOutputs.val.deformations;
  let nan = 0, umax = 0;
  for (const [, u] of U) for (let c = 0; c < 3; c++) { if (!Number.isFinite(u[c])) nan++; else umax = Math.max(umax, Math.abs(u[c])); }
  filas.push({ que: "deformada sin NaN", crudo: true, medido: `${nan} NaN en ${U.size} nudos`, limite: `0 NaN, ${nN} nudos`, ok: nan === 0 && U.size === nN });

  const sR = [0, 0, 0], sF = [0, 0, 0];
  for (const [, r] of states.deformOutputs.val.reactions) for (let c = 0; c < 3; c++) sR[c] += r[c];
  for (const [, f] of states.nodeInputs.val.loads) for (let c = 0; c < 3; c++) sF[c] += f[c];
  const eq = Math.max(...[0, 1, 2].map((c) => Math.abs(sR[c] + sF[c])));
  filas.push({ que: "equilibrio ΣR + ΣF = 0", crudo: true, medido: `${eq.toExponential(2)} kN`, limite: "< 1e-6 kN", ok: eq < 1e-6, detalle: `ΣR = [${sR.map((x) => x.toFixed(6)).join(", ")}], ΣF = [${sF.map((x) => x.toFixed(6)).join(", ")}]` });

  const ao = states.analyzeOutputs.val;
  const nSt = ao.solidStress instanceof Map ? ao.solidStress.size : 0;
  const nVm = ao.vonMises instanceof Map ? ao.vonMises.size : 0;
  filas.push({ que: "resultados en los estados", crudo: true, medido: `solidStress ${nSt}, vonMises de cáscara ${nVm}`, limite: `${nH8} y ${nQ4}`, ok: nSt === nH8 && nVm >= nQ4 });

  // ── Reparto de la carga ──
  const m = v.mallaColumnaCft(p), r = v.resolverColumnaCft(m), c = v.panelColumnaCft(p, m, r);
  // Acero por otro camino: N22 (membrana vertical, kN/m) en el centro de cada cáscara de la
  // primera planta × su ancho. Las paredes x = ±x_int van de dy en dy; las y = ±y_int, de dx.
  const cen = r.analyzeOutputs.membraneYYcentro;
  let NsMembrana = 0;
  m.shellElements.forEach((el, i) => {
    if (Math.min(...el.map((n) => m.nodes[n][2])) > 1e-9) return;
    const val = cen.get(i); const n22 = Array.isArray(val) ? val[0] : val;
    NsMembrana += -n22 * (i < 2 * p.nz * p.ny ? m.dy : m.dx);
  });
  const dNs = Math.abs(NsMembrana - c.Ns) / p.Pu * 100;
  filas.push({ que: "acero: ΣRz − Nc = N22 de las cáscaras", medido: dNs, limite: 1e-6, ok: dNs <= 1e-6, detalle: `${c.Ns.toFixed(6)} vs ${NsMembrana.toFixed(6)} kN (identidad de equilibrio, dos caminos)` });

  const fMed = c.Nc / c.sumRz;
  filas.push({ que: "reparto medido vs Es·As / Ec·Ac (informativo)", crudo: true,
    medido: `hormigón ${(100 * fMed).toFixed(2)} % (${c.Nc.toFixed(1)} kN), acero ${(100 * (1 - fMed)).toFixed(2)} % (${c.Ns.toFixed(1)} kN)`,
    limite: `EA: hormigón ${(100 * c.fracHormigonEA).toFixed(2)} % (áreas AISC), ${(100 * c.fracHormigonEAMalla).toFixed(2)} % (áreas de la malla)`,
    ok: true, detalle: `diferencia ${(100 * (fMed - c.fracHormigonEA)).toFixed(2)} y ${(100 * (fMed - c.fracHormigonEAMalla)).toFixed(2)} puntos; sin límite: la página no daba ninguno` });

  filas.push({ que: "δ axial vs Pu·Lz/(Es·As+Ec·Ac) (informativo)", crudo: true, medido: `${c.errPct.toFixed(2)} %`, limite: "la página lo daba como informativo", ok: Number.isFinite(c.errPct), detalle: `${c.uz_top_he.toExponential(4)} vs ${c.uz_axial_an.toExponential(4)} m` });

  filas.push({ que: "sello δ tope", medido: pct(c.uz_top_he, SELLO_UZ_TOPE), limite: 1e-4, ok: pct(c.uz_top_he, SELLO_UZ_TOPE) <= 1e-4, detalle: `${c.uz_top_he.toExponential(9)} m` });
  filas.push({ que: "sello |u| máximo", medido: pct(umax, SELLO_UMAX), limite: 1e-4, ok: pct(umax, SELLO_UMAX) <= 1e-4, detalle: `${umax.toExponential(9)} m` });

  const et = ex.computedLabels(params, states);
  const faltan = ["As acero", "Ac hormigón", "Is", "Ic", "EI_eff = Es·Is + C3·Ec·Ic (AISC §I2.1b)", "Pno = Fy·As + 0.85·f'c·Ac (AISC I2-9a)", "Pu / φPno (φ = 0.75)", "δ axial = Pu·Lz/(Es·As + Ec·Ac)", "δ tope medido (máx |uz|)", "Δ vs AISC", "Carga por el hormigón (reacciones)", "Carga por el acero (reacciones)", "Reparto por rigidez Ec·Ac/(Es·As + Ec·Ac)"].filter((k) => !(k in et));
  filas.push({ que: "folder «Calculados»: los números de la página", crudo: true, medido: faltan.length ? `faltan ${faltan.join(", ")}` : `${Object.keys(et).length} valores`, limite: "todos", ok: faltan.length === 0 });
  return filas;
}
