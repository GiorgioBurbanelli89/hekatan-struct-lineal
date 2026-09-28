/**
 * Graduado: placa-base-cft (placa base con orificio + tubo HSS de cáscaras Q4 + cartelas +
 * pernos barra + relleno, tapón y pedestal de láminas de 1 mm que entran en el análisis).
 *
 * El panel de la página vieja eran fórmulas de norma (AISC 360-22 §I2.1b, §J8, AISC Design
 * Guide 1, ACI 318 §17) sobre los parámetros: aquí se REHACEN a mano, sin llamar al ejemplo,
 * y se comparan con lo que da el ejemplo y con lo que escribe en «📊 Calculados».
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-placa-base-cft";
export const descripcion = "placa base + columna CFT (Q4) + pernos barra: conteos, equilibrio y AISC §I2.1b / §J8 / DG-1 / ACI §17 a mano";

// Sellado el 28-sep-2026 con ESTE mismo código (valores por defecto). Se cruzará contra la página
// vieja con `node cli/comparar_graduado.mjs placa-base-cft` (necesita build).
const U_MAX_SELLADO = 5.781024896727787e-3;   // m, |u| traslacional máximo

const pct = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300) * 100;
const fmtRatio = (r) => r < 1 ? `${r.toFixed(2)} ✓` : r < 1.2 ? `${r.toFixed(2)} ⚠` : `${r.toFixed(2)} ✗`;

export async function correr() {
  const v = await empaquetar(`
    export { placaBaseCft, comprobacionesPlacaBaseCft } from "${R}/examples/src/placa-base-cft/placaBaseCft";
  `, "graduado-placa-base-cft");
  const filas = [];
  const ex = v.placaBaseCft;
  const p = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));
  const st = () => ({ val: undefined, rawVal: undefined });
  const states = { nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(),
                   deformOutputs: st(), analyzeOutputs: st(), objects3D: st() };
  ex.build(p, states);

  // ── conteos por tipo de elemento ──
  const nodes = states.nodes.val, elements = states.elements.val;
  const nFrame = elements.filter((e) => e.length === 2).length;
  const nShell = elements.filter((e) => e.length === 4).length;
  const nSolid = elements.filter((e) => e.length === 8).length;
  const nHorm = elements.filter((e, i) => e.length === 4 && states.elementInputs.val.thicknesses.get(i) === 0.001).length;
  filas.push({ que: "elementos por tipo", crudo: true,
    medido: `${nodes.length} nudos, ${nFrame} barras, ${nShell} cáscaras (${nHorm} de hormigón), ${nSolid} sólidos`,
    limite: "1283 nudos, 8 barras, 820 cáscaras (580 de hormigón), 0 sólidos",
    ok: nFrame === 8 && nSolid === 0 && nodes.length === 1283 && nShell === 820 && nHorm === 580,
    detalle: "placa 10×10 menos el orificio + 4 paredes 6×6 + 8 cartelas + relleno, tapón y pedestal; 4 pernos × 2 tramos" });

  // ── deformada sin NaN ──
  const defs = states.deformOutputs.val.deformations;
  let nan = 0, uMax = 0;
  defs.forEach((u) => {
    if (u.some((x) => !Number.isFinite(x))) nan++;
    uMax = Math.max(uMax, Math.hypot(u[0], u[1], u[2]));
  });
  filas.push({ que: "deformada sin NaN", crudo: true, medido: `${nan} nudos con NaN de ${defs.size}`, limite: "0", ok: nan === 0 && defs.size === nodes.length });

  // ── equilibrio: Σreacciones + Σcargas = 0 ──
  const sumR = [0, 0, 0], sumL = [0, 0, 0];
  states.deformOutputs.val.reactions?.forEach((r) => { for (let k = 0; k < 3; k++) sumR[k] += r[k]; });
  states.nodeInputs.val.loads?.forEach((l) => { for (let k = 0; k < 3; k++) sumL[k] += l[k]; });
  const total = Math.hypot(...sumL) || 1;
  ["X", "Y", "Z"].forEach((eje, k) => {
    const m = Math.abs(sumR[k] + sumL[k]) / total * 100;
    filas.push({ que: `equilibrio ${eje}`, medido: m, limite: 1e-6, ok: m <= 1e-6,
      detalle: `ΣR=${sumR[k].toFixed(6)} + ΣL=${sumL[k].toFixed(6)} kN` });
  });

  // ── las fórmulas del panel, rehechas A MANO ──
  const Fy = 250000, fut = 600000, FyHss = 350000;
  // AISC §I2.1b: As = anillo del tubo, Ac = hueco interior; Pno = Fy·As + 0.85·f'c·Ac, φc = 0.75
  const Ac = (p.bc - 2 * p.t_col) * (p.hc - 2 * p.t_col);
  const As = p.bc * p.hc - Ac;
  const Pno = FyHss * As + 0.85 * p.fc * Ac;
  const A1 = p.B * p.H, A2 = p.B_ped * p.H_ped;
  const raiz = Math.min(2, Math.sqrt(A2 / A1));
  const phiPp = 0.65 * Math.min(0.85 * p.fc * A1 * raiz, 1.7 * p.fc * A1);        // AISC §J8
  const m = Math.max(0, (p.B - 0.95 * Math.max(p.bc, p.hc)) / 2);                // DG-1
  const treq = m * Math.sqrt(2 * (p.Pu / A1) / (0.9 * Fy));
  const brazo = Math.max(0.05, p.B - 2 * p.sx);                                  // ACI §17
  const tAnc = (q) => Math.max(0, Math.hypot(q.Mx, q.My) / brazo - q.Pu / 2) / Math.max(1, Math.round(q.nBoltsY));
  const T = tAnc(p);
  const phiNn = 0.75 * (0.75 * Math.PI * p.d_bolt ** 2 / 4) * fut;
  const aMano = {
    As, Ac, Pno_composite: Pno, demandCapPno: p.Pu / (0.75 * Pno),
    A1, A2, phiPp, demandCapPp: p.Pu / phiPp,
    m_cant: m, t_req: treq, demandCapT: treq / p.t_plate,
    T_anchor: T, phiNn, demandCapAnchor: T / phiNn,
  };
  let vmMax = 0;
  states.analyzeOutputs.val.vonMises?.forEach((a) => a.forEach((x) => { if (x > vmMax) vmMax = x; }));
  const ej = v.comprobacionesPlacaBaseCft(p, vmMax);
  for (const [k, ref] of Object.entries(aMano)) {
    const d = pct(ej[k], ref);
    filas.push({ que: `${k} a mano`, medido: d, limite: 1e-9, ok: d <= 1e-9, detalle: `${ej[k]} vs ${ref}` });
  }
  // Con los valores por defecto el anclaje no trabaja (M/brazo < Pu/2 → T = 0): se comprueba
  // también con Mx = My = 150 kN·m, llamando solo a la cuenta pura.
  {
    const q = { ...p, Mx: 150, My: 150 };
    const Tq = tAnc(q);
    const eq = v.comprobacionesPlacaBaseCft(q, 0);
    const dT = pct(eq.T_anchor, Tq), dR = pct(eq.demandCapAnchor, Tq / phiNn);
    filas.push({ que: "T_anchor a mano, Mx = My = 150", medido: dT, limite: 1e-9, ok: dT <= 1e-9 && Tq > 0, detalle: `${eq.T_anchor} vs ${Tq} kN` });
    filas.push({ que: "T/φNn a mano, Mx = My = 150", medido: dR, limite: 1e-9, ok: dR <= 1e-9, detalle: `${eq.demandCapAnchor} vs ${Tq / phiNn}` });
  }

  // ── y lo que escribe «📊 Calculados» ──
  const et = ex.computedLabels(p, states);
  const esperado = {
    "As acero (AISC §I2.1b)": `${As.toExponential(3)} m²`,
    "Ac hormigón (AISC §I2.1b)": `${Ac.toExponential(3)} m²`,
    "Pno = Fy·As + 0.85·f'c·Ac (AISC §I2.1b)": `${Pno.toFixed(0)} kN`,
    "Compresión Pu/φPno (AISC §I2.1b)": fmtRatio(p.Pu / (0.75 * Pno)),
    "A1 (AISC §J8)": `${A1.toFixed(4)} m²`,
    "A2 (AISC §J8)": `${A2.toFixed(4)} m²`,
    "φPp (AISC §J8)": `${phiPp.toFixed(0)} kN`,
    "Aplastamiento Pu/φPp (AISC §J8)": fmtRatio(p.Pu / phiPp),
    "m voladizo (DG-1)": `${m.toFixed(4)} m`,
    "t requerido (DG-1)": `${(treq * 1000).toFixed(1)} mm`,
    "Espesor t_req/t (DG-1)": fmtRatio(treq / p.t_plate),
    "T por perno (ACI 318 §17)": `${T.toFixed(1)} kN`,
    "φNn (ACI 318 §17)": `${phiNn.toFixed(1)} kN`,
    "Tracción del anclaje T/φNn (ACI 318 §17)": fmtRatio(T / phiNn),
    "σ von Mises máx del acero": `${vmMax.toExponential(3)} kN/m²`,
  };
  const malas = Object.entries(esperado).filter(([k, s]) => et[k] !== s);
  filas.push({ que: "«Calculados» = cuenta a mano", crudo: true,
    medido: malas.length ? malas.map(([k, s]) => `${k}: ${et[k]} ≠ ${s}`).join("; ") : `${Object.keys(esperado).length} etiquetas iguales`,
    limite: "todas iguales", ok: malas.length === 0,
    detalle: Object.entries(esperado).map(([k]) => `${k} = ${et[k]}`).join(" | ") });

  // ── rango fijo de von Mises (el «solo losas» de la página) ──
  const r = states.analyzeOutputs.val.colorMapRanges?.vonMises;
  filas.push({ que: "rango de von Mises = el de la placa", crudo: true,
    medido: r ? `[${r[0]}, ${r[1].toExponential(4)}] kN/m²` : "sin rango",
    limite: "0 ≤ máx < σ máx del acero", ok: !!r && r[0] === 0 && r[1] > 0 && r[1] < vmMax });

  // ── regresión: desplazamiento máximo ──
  const d = pct(uMax, U_MAX_SELLADO);
  filas.push({ que: "u máx (sellado)", medido: Number.isFinite(d) ? d : 999, limite: 1e-6, ok: d <= 1e-6,
    detalle: `${uMax.toExponential(9)} m vs ${U_MAX_SELLADO.toExponential(9)} m` });
  return filas;
}
