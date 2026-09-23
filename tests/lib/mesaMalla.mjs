/**
 * Estudio de malla de la Mesa de Torsión: T_u de viga vs mallado de la losa.
 * Lo usan `tests/casos/mesa_torsion_malla.mjs` y `cli/estudio_torsion_malla.mjs`.
 *
 * Todo sale del MISMO ejemplo del menú (`mesaTorsion.build` + `runModal`), sin
 * copiar el modelo: brazos rígidos OFF, caso UDCon2 = 1.2D + 1.6L + 1.2SCP
 * (D = peso propio, L = 0.5 tonf/m², SCP = 1.0 tonf/m², del .e2k).
 * Unidades de salida: tonf, m.  Viga analizada: la SUR (y = 0), de x = 0 a 6.
 */
import { empaquetar, R } from "./bundle.mjs";

const G = 9.80665;

export async function cargarMesa() {
  const { mesaTorsion } = await empaquetar(
    `export { mesaTorsion } from "${R}/examples/src/mesa-torsion/mesaTorsion";\n`, "mesaTmalla");
  return mesaTorsion;
}

/** Corre la mesa con n divisiones por lado y devuelve lo que pide el estudio. */
export function correrMesa(mesaTorsion, n, { vigaNudos = 1, factorJ = 1, modal = true } = {}) {
  const van = (v) => ({ val: v });
  const st = { nodes: van([]), elements: van([]), nodeInputs: van({}), elementInputs: van({}),
               deformOutputs: van({}), analyzeOutputs: van({}), objects3D: van([]) };
  const p = Object.fromEntries(Object.entries(mesaTorsion.params).map(([k, d]) => [k, d.default]));
  Object.assign(p, { nMesh: n, vigaNudos, factorJ, rigidOffsets: 0, activeCase: 4, nModos: 6 });
  const log = console.log, warn = console.warn;
  console.log = () => {}; console.warn = () => {};
  try {
    mesaTorsion.build(p, st);
    if (modal) mesaTorsion.runModal(p, st, { render() {}, set() {} });
  } finally { console.log = log; console.warn = warn; }

  const nodes = st.nodes.val, els = st.elements.val;
  const ana = st.analyzeOutputs.val, def = st.deformOutputs.val;
  const nSh = n * n, beamStart = nSh + 4;
  const nSegV = vigaNudos ? n : 1;
  const L = p.Lx;

  // ── Torsión a lo largo de la viga SUR (tramos beamStart .. beamStart+nSegV-1) ──
  const perfilT = [];
  for (let s = 0; s < nSegV; s++) {
    const e = beamStart + s, [i, j] = els[e];
    const t = ana.torsions.get(e);
    perfilT.push({ x0: nodes[i][0], x1: nodes[j][0], Ti: t[0] / G, Tj: t[1] / G });
  }
  // T_u = el extremo de la viga (cara de la columna, x = 0)
  let Tu = 0;
  for (let e = beamStart; e < els.length; e++) {
    const t = ana.torsions.get(e);
    Tu = Math.max(Tu, Math.abs(t[0]), Math.abs(t[1]));
  }
  Tu /= G;

  // ── Momento de borde de la losa, m(x) = M_yy en el borde sur (y = 0) ──
  // Promedio en el nudo de los valores de joint (sin suavizar) de las losas que lo tocan.
  const byy = ana.bendingYYjoint ?? ana.bendingYY;
  const mNodo = new Map();
  for (let e = 0; e < nSh; e++) {
    els[e].forEach((nd, k) => {
      if (Math.abs(nodes[nd][1]) > 1e-9) return;
      const a = mNodo.get(nd) ?? [0, 0];
      mNodo.set(nd, [a[0] + byy.get(e)[k], a[1] + 1]);
    });
  }
  const borde = [...mNodo.entries()]
    .map(([nd, [s, c]]) => ({ x: nodes[nd][0], m: s / c / G }))
    .sort((a, b) => a.x - b.x);
  // m en el centro del borde: el nudo x = L/2 si existe; si no, interpolación lineal
  const mEn = (x) => {
    for (let k = 0; k < borde.length - 1; k++) {
      const a = borde[k], b = borde[k + 1];
      if (x >= a.x - 1e-9 && x <= b.x + 1e-9) return a.m + (b.m - a.m) * (x - a.x) / (b.x - a.x);
    }
    return NaN;
  };
  const mBorde = mEn(L / 2);
  // ∫_0^{L/2} m(x) dx, trapecios sobre los nudos del borde
  let integral = 0;
  for (let k = 0; k < borde.length - 1; k++) {
    const a = borde[k], b = borde[k + 1];
    if (a.x >= L / 2 - 1e-9) break;
    const xb = Math.min(b.x, L / 2), mb = xb === b.x ? b.m : mEn(xb);
    integral += 0.5 * (a.m + mb) * (xb - a.x);
  }

  // ── Flecha en el centro de la losa (nudo si existe; si no, Q4 bilineal de las esquinas) ──
  let flecha = NaN, flechaNudo = false;
  for (let k = 0; k < nodes.length; k++) {
    const q = nodes[k];
    if (Math.abs(q[0] - L / 2) < 1e-9 && Math.abs(q[1] - p.Ly / 2) < 1e-9 && q[2] > 1e-9) {
      flecha = def.deformations.get(k)[2]; flechaNudo = true;
    }
  }
  if (!flechaNudo) {   // n impar: promedio del elemento central (bilineal en su centro)
    const c = Math.floor(n / 2) * n + Math.floor(n / 2);
    flecha = els[c].reduce((s, nd) => s + def.deformations.get(nd)[2], 0) / 4;
  }

  // m_yy en el CENTRO de la losa (vano positivo): media de los joints en ese nudo
  let mCentro = NaN;
  {
    let sum = 0, c = 0;
    for (let e = 0; e < nSh; e++) els[e].forEach((nd, k) => {
      const q = nodes[nd];
      if (Math.abs(q[0] - L / 2) < 1e-9 && Math.abs(q[1] - p.Ly / 2) < 1e-9) { sum += byy.get(e)[k]; c++; }
    });
    if (c) mCentro = sum / c / G;
  }

  const out = st._mesaTorsionModal?.out;
  const T3 = out?.frequencies?.[2] ? 1 / out.frequencies[2] : NaN;
  const T1 = out?.frequencies?.[0] ? 1 / out.frequencies[0] : NaN;
  return { n, vigaNudos, factorJ, Tu, mBorde, integral, flecha_mm: flecha * 1000,
           flechaNudo, mCentro, T1, T3, perfilT, borde, p };
}

/** φT_cr de ACI 318-19 §22.7.5.1(a) para la viga rectangular b×h (sin alas), en tonf·m. */
export function phiTcrACI({ b, h, fc_tonf_m2 = 2812.279, lambda = 1, phi = 0.75 }) {
  const PSI = 1 / 0.70307;            // 1 tonf/m² = 1.42233 psi  (0.70307 tonf/m² por psi)
  const IN = 1 / 0.0254;
  const fc_psi = fc_tonf_m2 * PSI;
  const Acp = b * h * IN * IN, pcp = 2 * (b + h) * IN;
  const Tcr_lbin = 4 * lambda * Math.sqrt(fc_psi) * Acp * Acp / pcp;
  const lbin_tonfm = 4.4482216 * 0.0254 / 9806.65;   // lb·in → tonf·m
  return { fc_psi, Acp_in2: Acp, pcp_in: pcp, Tcr: Tcr_lbin * lbin_tonfm,
           phiTcr: phi * Tcr_lbin * lbin_tonfm };
}
