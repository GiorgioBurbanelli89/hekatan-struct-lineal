/**
 * Mesa de Torsión — MODAL contra ETABS 19.1 (Mesa torsiónT.e2k, Seproinca 2020).
 *
 * Árbitro de masa: `Mesa torsiónT.K_M` (masa ensamblada que escribe ETABS, 38×6
 * float64). Suma 19.7988 t y pone la masa de cada viga —solo la luz libre
 * 6 − 0.40 = 5.60 m— en las 4 ESQUINAS (2.8737 t cada una); los nudos de borde
 * llevan solo losa (0.173 t). El ejemplo replica eso en `runModal` (masaModal=0).
 * MMI de ETABS = 256.7 t·m² (réplica Python hekatan-py/Examples-Py/05 Mesa Torsion).
 *
 * Periodos ETABS: T1 = T2 = 0.34337 s (traslación), T3 = 0.28756 s (torsión Rz).
 * Brazos rígidos OFF en Hekatan (en ETABS el factor de zona rígida es 0: solo
 * quitan el peso de la viga dentro del brazo, que ya va en la masa de arriba).
 */
import { empaquetar, R } from "../lib/bundle.mjs";
import { masaEnsamblada } from "../lib/wasm.mjs";

const ETABS = { M: 19.7988, MMI: 256.7, T: [0.34337, 0.34337, 0.28756] };
const TOL_M = 0.1;   // % masa y MMI
const TOL_T = 1.0;   // % periodos

export const nombre = "mesa-torsion-modal";
export const descripcion = "Mesa de torsión: masa, MMI y T1..T3 contra ETABS 19.1 (K_M)";

export async function correr() {
  const { mesaTorsion } = await empaquetar(
    `export { mesaTorsion } from "${R}/examples/src/mesa-torsion/mesaTorsion";\n`, "mesaTmodal");
  const van = (v) => ({ val: v });
  const st = { nodes: van([]), elements: van([]), nodeInputs: van({}), elementInputs: van({}),
               deformOutputs: van({}), analyzeOutputs: van({}), objects3D: van([]) };
  const p = Object.fromEntries(Object.entries(mesaTorsion.params).map(([k, d]) => [k, d.default]));
  p.rigidOffsets = 0; p.nModos = 6;
  const log = console.log; console.log = () => {};
  try { mesaTorsion.build(p, st); mesaTorsion.runModal(p, st, { render() {}, set() {} }); }
  finally { console.log = log; }

  const m = st._mesaTorsionModal;
  const filas = [];
  if (!m?.out?.frequencies?.length) {
    return [{ que: "el modal corre", medido: 0, limite: 1, ok: false, detalle: "sin frecuencias" }];
  }
  const ux = await masaEnsamblada(st.nodes.val, st.elements.val, m.elementInputs,
    { lateral: m.lateral, lump: m.lump, masaNodal: m.nodeInputs.masses ?? null });
  let M = 0, I = 0;
  st.nodes.val.forEach((n, i) => {
    if (n[2] < 1e-9) return;                               // base: apoyada, no vibra
    M += ux[i]; I += ux[i] * ((n[0] - p.Lx / 2) ** 2 + (n[1] - p.Ly / 2) ** 2);
  });
  const pct = (a, b) => Math.abs(a / b - 1) * 100;
  filas.push({ que: "masa del piso vs ETABS (K_M)", medido: pct(M, ETABS.M), limite: TOL_M,
               ok: pct(M, ETABS.M) <= TOL_M, detalle: `${M.toFixed(4)} t vs ${ETABS.M} t` });
  filas.push({ que: "MMI del piso vs ETABS", medido: pct(I, ETABS.MMI), limite: 0.5,
               ok: pct(I, ETABS.MMI) <= 0.5, detalle: `${I.toFixed(2)} t·m² vs ${ETABS.MMI}` });
  for (let i = 0; i < 3; i++) {
    const T = 1 / m.out.frequencies[i], d = pct(T, ETABS.T[i]);
    filas.push({ que: `T${i + 1} vs ETABS`, medido: d, limite: TOL_T, ok: d <= TOL_T,
                 detalle: `${T.toFixed(5)} s vs ${ETABS.T[i]} s` });
  }
  const rz = m.out.massParticipation?.[2]?.[5] ?? 0;
  filas.push({ que: "el modo 3 es la torsión (participación RZ)", medido: rz, limite: 0.99,
               ok: rz >= 0.99, detalle: `RZ = ${rz.toFixed(4)}` });
  return filas;
}
