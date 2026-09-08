/**
 * `areaspring` (muelle de AREA por cascara) y `edge etabs` (nudo colgado atado a la arista),
 * las dos por la lista de muelles con nudo negativo (utils/springsExtra.h, WASM del 8-sep-2026).
 *
 *  1. `areaspring ID ks nodal` = `spring n uz ks*A_tributaria` a mano (misma K): 1e-10 %.
 *  2. Carga UNIFORME q sobre placa con muelle de area: w = q/ks en todos los nudos, con el
 *     consistente y con el nodal (equilibrio: las dos formas integran ks*A). 1e-8 %.
 *  3. Placa flexible 4x4 t=0.20 ks=20000 P=1000 en el centro contra SAFE 20 con muelle de AREA
 *     (validation/isse/safe_area_flexible.json, SubModulus por tabla): el NODAL cuadra (<= 1.2 %,
 *     resolucion de SAFE incluida); el CONSISTENTE se va 23 % en las esquinas -> el muelle de area
 *     de SAFE es el nodal, como el de SAP2000 y ETABS. Se guarda las dos cosas para que no vuelva
 *     la hipotesis «SAFE mete el consistente».
 *  4. `edge etabs`: el nudo colgado cumple la cubica de Hermite de su arista (autoconsistencia,
 *     1e-4 %: penalizacion 1e6). NO es lo que hace ETABS: ETABS malla el pano por el nudo tambien con
 *     OBJMESHTYPE "NONE" (14 nudos / 8 areas de analisis medidos el 8-sep-2026) -> `deck etabs`.
 */
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolverHeks } from "../lib/heks.mjs";

export const nombre = "muelle-area-y-nudo-colgado";
export const descripcion = "areaspring nodal/consistente (= spring, q/ks, vs SAFE area) y edge etabs (Hermite)";

const dir = mkdtempSync(join(tmpdir(), "hkAreaSp-"));
async function placa({ L0 = 4, N = 8, T = 0.2, E = 25e6, NU = 0.2, KS = 20000, modo, carga }) {
  const h = L0 / N; const L = []; const id = new Map(); const k = (i, j) => `${i},${j}`;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) { id.set(k(i, j), id.size + 1); L.push(`node ${id.get(k(i, j))} ${(i * h).toFixed(6)} ${(j * h).toFixed(6)} 0`); }
  let ns = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    ns++; L.push(`shell ${ns} ${id.get(k(i, j))} ${id.get(k(i + 1, j))} ${id.get(k(i + 1, j + 1))} ${id.get(k(i, j + 1))} ${T} ${E} ${NU} 0`);
    if (modo === "consistente") L.push(`areaspring ${ns} ${KS}`);
    if (modo === "nodal") L.push(`areaspring ${ns} ${KS} nodal`);
    if (carga.q) L.push(`areaload ${ns} ${carga.q}`);
  }
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
    L.push(`support ${id.get(k(i, j))} 1 1 0 0 0 1`);
    if (modo === "mano") { const f = (i === 0 || i === N ? 0.5 : 1) * (j === 0 || j === N ? 0.5 : 1); L.push(`spring ${id.get(k(i, j))} uz ${KS * h * h * f}`); }
  }
  if (carga.P) L.push(`load ${id.get(k(N / 2, N / 2))} 0 0 ${-carga.P}`);
  L.push("solve");
  const ruta = join(dir, `placa_${modo}_${carga.q ? "q" : "P"}.heks`); writeFileSync(ruta, L.join("\n") + "\n", "utf-8");
  const r = await resolverHeks(ruta);
  const w = (x, y) => { const i = r.nodes.findIndex((n) => Math.abs(n[0] - x) < 1e-9 && Math.abs(n[1] - y) < 1e-9); return r.deformOutputs.deformations.get(i)[2]; };
  const todos = []; r.deformOutputs.deformations.forEach((d) => todos.push(d[2]));
  return { w, todos };
}

export async function correr() {
  const filas = [];
  // 1) nodal por directiva = spring a mano
  const A = await placa({ modo: "nodal", carga: { P: 1000 } }), B = await placa({ modo: "mano", carga: { P: 1000 } });
  let d1 = 0; A.todos.forEach((v, i) => { d1 = Math.max(d1, Math.abs(v - B.todos[i])); });
  const wmax = Math.max(...A.todos.map(Math.abs));
  d1 = (100 * d1) / wmax;
  filas.push({ que: "areaspring nodal = spring a mano (k = ks·A tributaria)", medido: d1, limite: 1e-8, ok: d1 <= 1e-8, detalle: `peor ${d1.toExponential(2)} % del w max` });
  // 2) carga uniforme: w = q/ks, consistente y nodal
  for (const modo of ["consistente", "nodal"]) {
    const q = -50, r = await placa({ modo, carga: { q } });
    const teo = q / 20000; let d = 0; r.todos.forEach((v) => { d = Math.max(d, Math.abs(v - teo)); });
    d = (100 * d) / Math.abs(teo);
    filas.push({ que: `carga uniforme, w = q/ks en todos los nudos (${modo})`, medido: d, limite: 1e-6, ok: d <= 1e-6, detalle: `teorico ${teo.toExponential(4)} m, peor ${d.toExponential(2)} %` });
  }
  // 3) placa flexible contra SAFE (muelle de area de SAFE)
  const S = JSON.parse(readFileSync(new URL("../../validation/isse/safe_area_flexible.json", import.meta.url), "utf-8"));
  const C = await placa({ modo: "consistente", carga: { P: 1000 } }), Nn = await placa({ modo: "nodal", carga: { P: 1000 } });
  let pn = 0, pc = 0;
  for (const s of S.results.samples_9pts) {
    pn = Math.max(pn, Math.abs((Nn.w(s.x, s.y) * 1000) / s.w_mm - 1) * 100);
    pc = Math.max(pc, Math.abs((C.w(s.x, s.y) * 1000) / s.w_mm - 1) * 100);
  }
  filas.push({ que: "placa flexible: NODAL vs SAFE muelle de area (9 puntos)", medido: pn, limite: 1.5, ok: pn <= 1.5, detalle: `peor ${pn.toFixed(3)} % (SAFE imprime a 4 cifras)` });
  filas.push({ que: "placa flexible: CONSISTENTE se separa de SAFE (SAFE NO es consistente)", medido: pc, limite: 10, ok: pc >= 10, detalle: `peor ${pc.toFixed(2)} % (esquinas): hace falta > 10 % para que la fila avise si SAFE cambiara` });
  // 4) edge etabs: Hermite autoconsistente
  {
    const base = readFileSync(new URL("../../validation/isse/edge_none.heks", import.meta.url), "utf-8").replace(/\r?\nsolve\s*$/, "\n");
    const ruta = join(dir, "edge.heks"); writeFileSync(ruta, base + "edge etabs\nsolve\n", "utf-8");
    const r = await resolverHeks(ruta);
    const u = (x, y) => r.deformOutputs.deformations.get(r.nodes.findIndex((n) => Math.abs(n[0] - x) < 1e-9 && Math.abs(n[1] - y) < 1e-9));
    const a = u(2, 0), b = u(2, 2), hN = u(2, 0.7); const t = 0.35, Lb = 2;
    const H1 = 1 - 3 * t * t + 2 * t ** 3, H2 = (t - 2 * t * t + t ** 3) * Lb, H3 = 3 * t * t - 2 * t ** 3, H4 = (-t * t + t ** 3) * Lb;
    const her = H1 * a[2] + H2 * a[3] + H3 * b[2] + H4 * b[3];
    const d = Math.abs(hN[2] - her) / Math.abs(hN[2]) * 100;
    filas.push({ que: "edge etabs: w del nudo colgado = Hermite de su arista", medido: d, limite: 1e-3, ok: d <= 1e-3, detalle: `w ${hN[2].toExponential(5)} vs Hermite ${her.toExponential(5)} (${d.toExponential(2)} %)` });
  }
  return filas;
}
