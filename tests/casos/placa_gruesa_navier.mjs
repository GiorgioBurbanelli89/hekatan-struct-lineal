/**
 * PLACA GRUESA (Shell-Thick) de Struct contra la SOLUCIÓN EXACTA publicada y contra SAP2000 con MALLA FINA.
 *
 * Por qué existe (diagnóstico del 6-oct-2026, registros/2026-10-05_struct_lo_que_falta_6_casos.md):
 * la placa gruesa de Struct (MITC4 de Bathe-Dvorkin + modos incompatibles en los giros) NO es la Shell-Thick de
 * CSI y en MALLA GRUESA difieren (0.6–10 %). Con Shell-THIN, en las mismas mallas, Struct = SAP2000 0.000 %:
 * malla, cargas y apoyos son iguales y lo único distinto es el elemento grueso. Lo que importa es hacia dónde
 * CONVERGE cada uno. Árbitros:
 *  (1) Navier de la placa de Mindlin (FSDT) simplemente apoyada (SS «duro»), carga uniforme:
 *      w = Σ Q_mn/(π⁴ D s²) + Σ Q_mn/(π² K_s G t s),  Q_mn = 16q/(π² m n), s = (m/a)² + (n/b)², K_s = 5/6
 *      (Reddy 2006, «Theory and Analysis of Elastic Plates and Shells», cap. 10, Navier de la FSDT).
 *  (2) Pandeo de la misma placa (SS duro, compresión uniaxial): Reddy 2006 ec. (10.2.22).
 *  (3) SAP2000 Thick con la MISMA malla fina (validation/placa_gruesa/sap_misma_malla.json, sap_pandeo.json).
 */
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolverHeks } from "../lib/heks.mjs";
import { cargarFem } from "../lib/bundle.mjs";
import { RAIZ } from "../lib/wasm.mjs";

export const nombre = "placa-gruesa-navier";
export const descripcion = "Shell-Thick de Struct (MITC4) = Navier/Reddy FSDT exacta y = SAP2000 con malla fina (estático y pandeo)";

const E = 25e6, NU = 0.2, A = 5, Q = 10, KS = 5 / 6;
function navier(t) {
  const D = E * t ** 3 / (12 * (1 - NU * NU)), G = E / (2 * (1 + NU));
  let w = 0;
  for (let m = 1; m < 400; m += 2) for (let n = 1; n < 400; n += 2) {
    const Qmn = 16 * Q / (Math.PI ** 2 * m * n), s = (m / A) ** 2 + (n / A) ** 2;
    const sg = Math.sin(m * Math.PI / 2) * Math.sin(n * Math.PI / 2);
    w += sg * (Qmn / (D * Math.PI ** 4 * s * s) + Qmn / (KS * G * t * Math.PI ** 2 * s));
  }
  return w;
}
const dir = mkdtempSync(join(tmpdir(), "hkNavier-"));
async function placaSS(n, t) {
  const L = [], id = (i, j) => i * (n + 1) + j + 1;
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) L.push(`node ${id(i, j)} ${i * A / n} ${j * A / n} 0`);
  let s = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    s++; L.push(`shell ${s} ${id(i, j)} ${id(i + 1, j)} ${id(i + 1, j + 1)} ${id(i, j + 1)} ${t} ${E}`, `shellnu ${s} ${NU}`, `areaload ${s} ${-Q}`);
  }
  // SS DURO (el de Navier): w = 0 y giro TANGENCIAL = 0 en el borde; en el plano, fijo (no está cargado)
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
    const bx = i === 0 || i === n, by = j === 0 || j === n;
    L.push(`support ${id(i, j)} 1 1 ${bx || by ? 1 : 0} ${bx ? 1 : 0} ${by ? 1 : 0} 1`);
  }
  L.push("solve");
  const ruta = join(dir, `ss_${n}_${t}.heks`); writeFileSync(ruta, L.join("\n") + "\n");
  const r = await resolverHeks(ruta);
  return r.deformOutputs.deformations.get(r.nodes.findIndex((p) => Math.abs(p[0] - A / 2) < 1e-9 && Math.abs(p[1] - A / 2) < 1e-9))[2];
}

export async function correr() {
  const filas = [];
  const S = JSON.parse(readFileSync(join(RAIZ, "validation/placa_gruesa/sap_misma_malla.json"), "utf8")).modelos;
  for (const t of [0.2, 0.5]) {
    const ex = -navier(t);
    const w4 = await placaSS(4, t), w32 = await placaSS(32, t);
    const s4 = S[`ss_t${t}_4_thick`].uz_max, s32 = S[`ss_t${t}_32_thick`].uz_max;
    const e32 = (w32 / ex - 1) * 100;
    filas.push({ que: `SS duro t=${t}: Struct 32×32 = Navier FSDT exacta`, medido: Math.abs(e32), limite: 0.05, ok: Math.abs(e32) <= 0.05,
      detalle: `Struct ${w32.toExponential(6)} · exacta ${ex.toExponential(6)} (${e32.toFixed(4)} %) · SAP2000 ${((s32 / ex - 1) * 100).toFixed(4)} %` });
    const d32 = Math.abs(w32 / s32 - 1) * 100;
    filas.push({ que: `SS duro t=${t}: Struct 32×32 = SAP2000 Thick (misma malla)`, medido: d32, limite: 0.1, ok: d32 <= 0.1,
      detalle: `malla 4×4: Struct ${((w4 / ex - 1) * 100).toFixed(2)} %, SAP2000 ${((s4 / ex - 1) * 100).toFixed(2)} % de la exacta (entre ellos ${(Math.abs(w4 / s4 - 1) * 100).toFixed(2)} %): la diferencia de malla gruesa es de FORMULACIÓN y se va al refinar` });
  }
  // Pandeo, SS duro, Reddy (10.2.22): placa 2×1 m, t = 0.05, E = 2e8, ν = 0.3, q = 1000 kN/m en x
  const fem = await cargarFem();
  const Eb = 2e8, nub = 0.3, tb = 0.05, a = 2, b = 1, qx = 1000;
  const Db = Eb * tb ** 3 / (12 * (1 - nub ** 2)), A44 = Eb / (2 * (1 + nub)) * tb;
  let exacta = Infinity;
  for (let m = 1; m <= 5; m++) {
    const am = m * Math.PI / a, bn = Math.PI / b, D11 = Db, D12 = nub * Db, D66 = (1 - nub) / 2 * Db;
    const c0 = D11 * am ** 4 + 2 * (D12 + 2 * D66) * am ** 2 * bn ** 2 + D11 * bn ** 4;
    const c2 = D11 * am ** 2 + D66 * bn ** 2, c3 = D66 * am ** 2 + D11 * bn ** 2, c4 = (D12 + D66) * am * bn, c1 = c2 * c3 - c4 ** 2;
    const N = (c0 + (am ** 2 / (KS * A44) + bn ** 2 / (KS * A44)) * c1) / (1 + c1 / (KS * KS * A44 * A44) + c2 / (KS * A44) + c3 / (KS * A44)) / am ** 2;
    exacta = Math.min(exacta, N / qx);
  }
  const nx = 64, ny = 32, q = (i, j) => i + j * (nx + 1);
  const nodes = [], elements = [], sup = new Map(), loads = new Map();
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) nodes.push([a * i / nx, b * j / ny, 0]);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) elements.push([q(i, j), q(i + 1, j), q(i + 1, j + 1), q(i, j + 1)]);
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
    const bx = i === 0 || i === nx, by = j === 0 || j === ny;
    if (bx || by) sup.set(q(i, j), [false, false, true, bx, by, false]);
  }
  sup.set(q(0, 0), [true, true, true, true, true, false]); sup.set(q(nx, 0), [false, true, true, true, true, false]);
  for (let j = 0; j <= ny; j++) { const f = qx * (b / ny) * (j === 0 || j === ny ? 0.5 : 1); loads.set(q(0, j), [f, 0, 0, 0, 0, 0]); loads.set(q(nx, j), [-f, 0, 0, 0, 0, 0]); }
  const em = (v) => new Map(elements.map((_, e) => [e, v]));
  const ei = { elasticities: em(Eb), poissonsRatios: em(nub), thicknesses: em(tb), shearModuli: em(Eb / (2 * (1 + nub))), plateFormulations: em(0), etabsWallJoint: false };
  const ni = { supports: sup, loads };
  const d = fem.deform(nodes, elements, ni, ei);
  const l1 = fem.bucklingAnalysis(nodes, elements, ni, ei, undefined, 2, d.deformations).factors[0];
  const ep = (l1 / exacta - 1) * 100;
  const P = JSON.parse(readFileSync(join(RAIZ, "validation/placa_gruesa/sap_pandeo.json"), "utf8"));
  const sapD = P["placa_d64x32_2048"]?.factores?.[0];
  filas.push({ que: "pandeo SS duro 64×32: Struct λ₁ = Reddy (10.2.22) FSDT exacta", medido: Math.abs(ep), limite: 0.2, ok: Math.abs(ep) <= 0.2,
    detalle: `Struct ${l1.toFixed(4)} · exacta ${exacta.toFixed(4)} (${ep.toFixed(3)} %)` + (sapD ? ` · SAP2000 ${sapD.toFixed(4)} (${((sapD / exacta - 1) * 100).toFixed(3)} %)` : "") });
  // Pandeo con malla fina contra SAP2000 Thick (misma malla; modelos de validation/pandeo_cascara/modelos.py)
  const { modeloStruct } = await import("./pandeo_cascara_sap2000.mjs");
  for (const [k, lim] of [["losa_k32x32_1024", 0.5], ["muro_k16x24_384", 0.5]]) {
    const s = P[k], M = P.modelos.find((m) => m.nombre + "_" + m.panos.length === k);
    if (!s || !M) { filas.push({ que: `pandeo ${k} vs SAP2000`, medido: "SIN DATO", limite: lim, ok: false, crudo: true }); continue; }
    const m = modeloStruct(M, P.E, P.nu, 0);
    const dm = fem.deform(m.nodes, m.elements, m.nodeInputs, m.elementInputs);
    const st = Math.abs(fem.bucklingAnalysis(m.nodes, m.elements, m.nodeInputs, m.elementInputs, undefined, 2, dm.deformations).factors[0]);
    const dd = Math.abs(st / Math.abs(s.factores[0]) - 1) * 100;
    filas.push({ que: `pandeo ${k.split("_").slice(0, 2).join(" ")}: Struct = SAP2000 Thick con malla fina`, medido: dd, limite: lim, ok: dd <= lim,
      detalle: `Struct ${st.toFixed(4)} · SAP2000 ${Math.abs(s.factores[0]).toFixed(4)} · analítica ${s.analitico.toFixed(4)} (con la malla gruesa difieren 1.5–10 %)` });
  }
  return filas;
}
