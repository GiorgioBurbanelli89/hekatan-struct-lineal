/**
 * Saca del resultado completo de un programa (sap2000_/opensees_<cual>.json) la referencia COMPACTA que usa
 * el test `alcantarilla-carga-movil`: Uz de todos los nudos y M3 de todas las barras en 5 posiciones, y la
 * envolvente del camión (277 posiciones). Todo en el signo del diagrama de CSI (lo convierte comparar.mjs).
 * uso: node validation/carga-movil/referencia_test.mjs sap2000|opensees [ejemplo]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const AQUI = dirname(fileURLToPath(import.meta.url));
const prog = process.argv[2], cual = process.argv[3] ?? "ejemplo";
const M = JSON.parse(readFileSync(join(AQUI, `modelo_${cual}.json`), "utf-8"));
let D = JSON.parse(readFileSync(join(AQUI, `${prog}_${cual}.json`), "utf-8"));
if (prog === "opensees") {
  const ejes = M.barras.map((b) => { const [xi, zi] = M.nudos[b.i], [xj, zj] = M.nudos[b.j];
    const L = Math.hypot(xj - xi, zj - zi), l = (xj - xi) / L, n = (zj - zi) / L;
    const e2 = Math.abs(l) < 1e-9 ? [1, 0] : [-Math.sign(l) * n, Math.abs(l)];
    return { s2: -e2[0] * n + e2[1] * l, s3: -(n * e2[0] - l * e2[1]) }; });
  const o = {};
  for (const [k, v] of Object.entries(D)) o[k] = { U: v.U.map((u) => [u[0], u[1], -u[2]]),
    F: v.F.map((f, e) => [-f[0], f[3], -ejes[e].s2 * f[1], ejes[e].s2 * f[4], -ejes[e].s3 * f[2], ejes[e].s3 * f[5]]) };
  D = o;
}
const casos = M.casos.map((c) => c.nombre);
const elegidas = [0.15, 0.3, 0.45, 0.6, 0.8].map((f) => casos[Math.round(f * (casos.length - 1))]);
const env = { Mmax: -Infinity, Mmin: Infinity, Uz: 0 };
for (const c of casos) { D[c].F.forEach((f) => { env.Mmax = Math.max(env.Mmax, f[4], f[5]); env.Mmin = Math.min(env.Mmin, f[4], f[5]); });
  D[c].U.forEach((u) => { env.Uz = Math.min(env.Uz, u[1]); }); }
const ref = { programa: prog, cual, fecha: new Date().toISOString().slice(0, 10), envolvente: env,
  posiciones: Object.fromEntries(elegidas.map((c) => [c, { xF: M.casos.find((q) => q.nombre === c).xF,
    Uz: D[c].U.map((u) => +u[1].toPrecision(10)), M3: D[c].F.map((f) => [+f[4].toPrecision(10), +f[5].toPrecision(10)]) }])) };
const dst = join(AQUI, "..", "..", "tests", "datos", `alcantarilla_${prog}.json`);
writeFileSync(dst, JSON.stringify(ref));
console.log("escrito", dst, elegidas.join(" "));
