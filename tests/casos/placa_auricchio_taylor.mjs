/**
 * Placa de AURICCHIO & TAYLOR (1994), CMAME 118, 393-412 — `shelltype <id> auricchio` (plateFormulations 5).
 * Transcrita de FEAPpv (código abierto de R. L. Taylor, elements/shells/plate2d.f). Tres copias:
 * Python (validation/placa-navier/banco/placa_auricchio_taylor.py), TS (hekatan-fem/src/utils/placaAT.ts) y
 * C++ (getBendingK_AT en shellQ4.cpp). Aquí se comprueba que dicen lo mismo y que la placa se porta:
 *
 *   1. TS = Python en un cuadrilátero DEFORMADO: K, carga consistente y momentos (1e-12)
 *   2. la app (C++ + carga del CLI + recuperación) = Python: flecha de la placa 4×4, malla 8×8 (1e-9)
 *   3. límite delgado sin bloqueo: L/t = 800, w / Navier-Kirchhoff entre 1 y 1.03 con malla 8×8
 *   4. placa gruesa (L/t = 20) contra la solución convergida (malla 64×64, 0.72076 mm): < 1 %
 */
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { empaquetar, R } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";

export const nombre = "placa-auricchio-taylor";
export const descripcion = "placa de Auricchio-Taylor 1994 (FEAPpv): TS = Python, app = Python, límite delgado y placa gruesa";

const A = 4, E = 2.2e7, NU = 0.2, Q = -10;
async function placa(t, N, form) {
  const L = []; const id = (i, j) => i * (N + 1) + j + 1;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) L.push(`node ${id(i, j)} ${i * A / N} ${j * A / N} 0`);
  let ns = 0; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { ns++;
    L.push(`shell ${ns} ${id(i, j)} ${id(i + 1, j)} ${id(i + 1, j + 1)} ${id(i, j + 1)} ${t} ${E} ${NU} 0`, `areaload ${ns} ${Q}`, `shelltype ${ns} ${form}`); }
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) if (i === 0 || i === N || j === 0 || j === N) L.push(`support ${id(i, j)} 0 0 1 0 0 0`);
  L.push(`support ${id(0, 0)} 1 1 1 0 0 1`, `support ${id(N, 0)} 0 1 1 0 0 1`, "solve");
  const f = join(mkdtempSync(join(tmpdir(), "hkAT-")), "p.heks"); writeFileSync(f, L.join("\n"));
  const r = await resolverHeks(f); let w = 0; r.deformOutputs.deformations.forEach((d) => { w = Math.min(w, d[2]); });
  return w;
}
const navier = (t) => { const D = E * t ** 3 / (12 * (1 - NU * NU)); let w = 0;
  for (let m = 1; m < 80; m += 2) for (let n = 1; n < 80; n += 2) { const k = (m / A) ** 2 + (n / A) ** 2; w += Math.sin(m * Math.PI / 2) * Math.sin(n * Math.PI / 2) / (m * n * k * k); }
  return w * 16 * Q / (Math.PI ** 6 * D); };

export async function correr() {
  const P = JSON.parse(readFileSync(new URL("../datos/placa_auricchio_taylor_py.json", import.meta.url), "utf-8"));
  const { placaAT, atJointMoments } = await empaquetar(`export { placaAT, atJointMoments } from "${R}/hekatan-fem/src/utils/placaAT";\n`, "placaAT");
  const x = P.xl.map((p) => p[0]), y = P.xl.map((p) => p[1]);
  const { K, F } = placaAT(x, y, P.E, P.nu, P.t, P.q);
  const M = atJointMoments(x, y, P.u, P.E, P.nu, P.t);
  const rel = (a, b) => { const fa = a.flat(), fb = b.flat(); let d = 0, m = 0; fa.forEach((v, i) => { d = Math.max(d, Math.abs(v - fb[i])); m = Math.max(m, Math.abs(fb[i])); }); return d / m; };
  const filas = [];
  for (const [que, v] of [["K", rel(K, P.K)], ["carga consistente", rel(F, P.F)], ["momentos en las esquinas", rel(M, P.M)]])
    filas.push({ que: `TS = Python (FEAPpv), cuadrilátero deformado: ${que}`, medido: v, limite: 1e-12, ok: v < 1e-12, detalle: v.toExponential(2) });
  const w8 = await placa(0.2, 8, "auricchio");
  const dApp = Math.abs(w8 / P.w8x8_placa4x4_t02 - 1);
  filas.push({ que: "la app (C++ + carga del CLI) = Python: flecha 8×8", medido: dApp, limite: 1e-9, ok: dApp < 1e-9,
               detalle: `${(w8 * 1000).toFixed(6)} vs ${(P.w8x8_placa4x4_t02 * 1000).toFixed(6)} mm` });
  const wt = await placa(0.005, 8, "auricchio"), rt = wt / navier(0.005);
  filas.push({ que: "límite delgado sin bloqueo (L/t = 800, 8×8): w / Navier-Kirchhoff", medido: rt, limite: 1.03, ok: rt >= 1 && rt <= 1.03, detalle: rt.toFixed(4) });
  const dc = (100 * Math.abs(w8 / -0.72076e-3 - 1));
  filas.push({ que: "placa gruesa (L/t = 20, 8×8) vs la convergida (64×64, 0.72076 mm)", medido: dc, limite: 1, ok: dc < 1, detalle: `${(w8 * 1000).toFixed(5)} mm` });
  return filas;
}
