/**
 * Graduado: placa-base-h (placa base + columna H de cáscaras Q4 + pernos como barras de 3 nudos).
 *
 * El panel de la página vieja eran fórmulas de norma (AISC 360-22 §J8, AISC Design Guide 1,
 * ACI 318 §17) sobre los parámetros: aquí se REHACEN a mano, sin llamar al ejemplo, y se comparan
 * con lo que da el ejemplo y con lo que escribe en «📊 Calculados». El pedestal solo se dibuja.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-placa-base-h";
export const descripcion = "placa base + columna H (Q4) + pernos barra: conteos, equilibrio y AISC §J8 / DG-1 / ACI §17 a mano";

// Sellado el 28-sep-2026 con ESTE mismo código (valores por defecto). Se cruzará contra la página
// vieja con `node cli/comparar_graduado.mjs placa-base-h` (necesita build).
const U_MAX_SELLADO = 1.589438922113771e-3;   // m, |u| traslacional máximo

const pct = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300) * 100;
const fmtRatio = (r) => r < 1.0 ? `${r.toFixed(2)} ✓` : r < 1.2 ? `${r.toFixed(2)} ⚠` : `${r.toFixed(2)} ✗`;

export async function correr() {
  const v = await empaquetar(`
    export { placaBaseH, comprobacionesPlacaBaseH } from "${R}/examples/src/placa-base-h/placaBaseH";
  `, "graduado-placa-base-h");
  const filas = [];
  const ex = v.placaBaseH;
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
  filas.push({ que: "elementos por tipo", crudo: true,
    medido: `${nodes.length} nudos, ${nFrame} barras, ${nShell} cáscaras, ${nSolid} sólidos`,
    limite: "249 nudos, 8 barras, 210 cáscaras, 0 sólidos",
    ok: nodes.length === 249 && nFrame === 8 && nShell === 210 && nSolid === 0,
    detalle: "placa 12×12 + patines 2×(6×4) + alma 6×3; 4 pernos × 2 tramos; pedestal solo dibujado" });

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
  const phi = 0.65, Fy = 250000, fut = 600000;
  const A1 = p.B * p.H, A2 = p.B_ped * p.H_ped;
  const raiz = Math.min(2, Math.sqrt(A2 / A1));
  const phiPp = phi * Math.min(0.85 * p.fc * A1 * raiz, 1.7 * p.fc * A1);          // AISC §J8
  const m = Math.max(0, (p.B - 0.95 * p.d_col) / 2);                             // DG-1
  const fp = p.Pu / A1;
  const treq = m * Math.sqrt(2 * fp / (0.9 * Fy));
  const brazo = Math.max(0.05, p.B - 2 * p.sx);                                  // ACI §17
  const T = Math.max(0, p.Mu / brazo - p.Pu / 2) / Math.max(2, Math.round(p.nBoltsY));
  const phiNn = 0.75 * (0.75 * Math.PI * p.d_bolt ** 2 / 4) * fut;
  const aMano = {
    A1, A2, sqrtA2A1: raiz, phiPp, demandCapPp: p.Pu / phiPp,
    m_cantilever: m, fp, t_req: treq, demandCapT: treq / p.t_plate,
    T_anchor: T, phiNn, demandCapAnchor: T / phiNn,
  };
  let vmMax = 0;
  states.analyzeOutputs.val.vonMises?.forEach((a) => a.forEach((x) => { if (x > vmMax) vmMax = x; }));
  const ej = v.comprobacionesPlacaBaseH(p, vmMax);
  for (const [k, ref] of Object.entries(aMano)) {
    const d = pct(ej[k], ref);
    filas.push({ que: `${k} a mano`, medido: d, limite: 1e-9, ok: d <= 1e-9, detalle: `${ej[k]} vs ${ref}` });
  }

  // Con los valores por defecto el anclaje no trabaja (Mu/brazo < Pu/2 → T = 0): la fórmula
  // de tracción se comprueba también con Mu = 200 kN·m, llamando solo a la cuenta pura.
  {
    const q = { ...p, Mu: 200 };
    const Tq = Math.max(0, q.Mu / brazo - q.Pu / 2) / Math.max(2, Math.round(q.nBoltsY));
    const eq = v.comprobacionesPlacaBaseH(q, 0);
    const dT = pct(eq.T_anchor, Tq), dR = pct(eq.demandCapAnchor, Tq / phiNn);
    filas.push({ que: "T_anchor a mano, Mu = 200", medido: dT, limite: 1e-9, ok: dT <= 1e-9 && Tq > 0, detalle: `${eq.T_anchor} vs ${Tq} kN` });
    filas.push({ que: "T/φNn a mano, Mu = 200", medido: dR, limite: 1e-9, ok: dR <= 1e-9, detalle: `${eq.demandCapAnchor} vs ${Tq / phiNn}` });
  }

  // ── y lo que escribe «📊 Calculados» ──
  const et = ex.computedLabels(p, states);
  const esperado = {
    "A₁ = B·H (AISC §J8)": `${A1.toFixed(4)} m²`,
    "A₂ = B_ped·H_ped (AISC §J8)": `${A2.toFixed(4)} m²`,
    "√(A₂/A₁) ≤ 2 (AISC §J8)": raiz.toFixed(3),
    "φPp (AISC §J8)": `${phiPp.toFixed(0)} kN`,
    "Aplastamiento Pu/φPp (AISC §J8)": fmtRatio(p.Pu / phiPp),
    "m voladizo (DG-1)": `${m.toFixed(4)} m`,
    "fp = Pu/A₁ (DG-1)": `${fp.toFixed(0)} kN/m²`,
    "t requerido (DG-1)": `${(treq * 1000).toFixed(1)} mm`,
    "Espesor t_req/t (DG-1)": fmtRatio(treq / p.t_plate),
    "T por perno (ACI 318 §17)": `${T.toFixed(1)} kN`,
    "φNn por perno (ACI 318 §17)": `${phiNn.toFixed(1)} kN`,
    "Tracción del anclaje T/φNn (ACI 318 §17)": fmtRatio(T / phiNn),
    "σ von Mises máx": `${vmMax.toFixed(0)} kN/m²`,
  };
  const malas = Object.entries(esperado).filter(([k, s]) => et[k] !== s);
  filas.push({ que: "«Calculados» = cuenta a mano", crudo: true,
    medido: malas.length ? malas.map(([k, s]) => `${k}: ${et[k]} ≠ ${s}`).join("; ") : `${Object.keys(esperado).length} etiquetas iguales`,
    limite: "todas iguales", ok: malas.length === 0,
    detalle: Object.entries(esperado).map(([k]) => `${k} = ${et[k]}`).join(" | ") });

  // ── regresión: desplazamiento máximo ──
  const d = pct(uMax, U_MAX_SELLADO);
  filas.push({ que: "u máx (sellado)", medido: Number.isFinite(d) ? d : 999, limite: 1e-6, ok: d <= 1e-6,
    detalle: `${uMax.toExponential(9)} m vs ${U_MAX_SELLADO.toExponential(9)} m` });
  return filas;
}
