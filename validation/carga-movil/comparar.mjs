/**
 * Hekatan contra SAP2000 (juez) y OpenSeesPy (testigo), posición a posición y en la envolvente.
 * uso: node validation/carga-movil/comparar.mjs [ejemplo|plantilla]  -> COMPARACION_<cual>.md (+ consola)
 * Error = |dif| / (máximo absoluto del campo en TODAS las posiciones) · 100  (tolerancia sobre el máximo).
 * Todo en el signo del DIAGRAMA de CSI: P, V2, M3 en el nudo i y en el j.
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const AQUI = dirname(fileURLToPath(import.meta.url));
const cual = process.argv[2] ?? "ejemplo";
const lee = (f) => JSON.parse(readFileSync(join(AQUI, f), "utf-8"));
const M = lee(`modelo_${cual}.json`), HK = lee(`hekatan_${cual}.json`);

// ejes CSI de cada barra en el plano XZ, y los de OpenSees 2D
const ejes = M.barras.map((b) => {
  const [xi, zi] = M.nudos[b.i], [xj, zj] = M.nudos[b.j];
  const L = Math.hypot(xj - xi, zj - zi), l = (xj - xi) / L, n = (zj - zi) / L;
  const e2 = Math.abs(l) < 1e-9 ? [1, 0] : [-Math.sign(l) * n, Math.abs(l)];
  const e3y = n * e2[0] - l * e2[1];                 // (e1 × e2)·Y
  const yOps = [-n, l];                                // eje y local de OpenSees 2D
  return { s2: e2[0] * yOps[0] + e2[1] * yOps[1], s3: -e3y };   // OpenSees: M sobre −Y
});

function deOpenSees(R) {
  const out = {};
  for (const [k, v] of Object.entries(R)) out[k] = {
    U: v.U.map((u) => [u[0], u[1], -u[2]]),   // su giro es sobre z2D = −Y; el de Hekatan, sobre +Y
    F: v.F.map((f, e) => { const { s2, s3 } = ejes[e];
      return [-f[0], f[3], -s2 * f[1], s2 * f[4], -s3 * f[2], s3 * f[5]]; }),
  };
  return out;
}

const programas = [];
if (existsSync(join(AQUI, `sap2000_${cual}.json`))) programas.push(["SAP2000 (juez)", lee(`sap2000_${cual}.json`)]);
if (existsSync(join(AQUI, `opensees_${cual}.json`))) programas.push(["OpenSeesPy", deOpenSees(lee(`opensees_${cual}.json`))]);

const casos = Object.keys(HK);
const zBase = (n) => Math.abs(M.nudos[n][1]) < 1e-9;
function envolv(D) {
  const e = { Mmax: -Infinity, Mmin: Infinity, Vmax: 0, Uz: 0, UzBase: 0, Pmax: 0 };
  for (const c of casos) { const d = D[c]; if (!d) continue;
    d.F.forEach((f) => { e.Mmax = Math.max(e.Mmax, f[4], f[5]); e.Mmin = Math.min(e.Mmin, f[4], f[5]);
      e.Vmax = Math.max(e.Vmax, Math.abs(f[2]), Math.abs(f[3])); e.Pmax = Math.max(e.Pmax, Math.abs(f[0]), Math.abs(f[1])); });
    d.U.forEach((u, n) => { e.Uz = Math.min(e.Uz, u[1]); if (zBase(n)) e.UzBase = Math.min(e.UzBase, u[1]); });
  }
  return e;
}
const L = [];
const p = (s) => { L.push(s); console.log(s); };
p(`# Alcantarilla + HL-93 (${cual}): Hekatan contra SAP2000 y OpenSeesPy`);
p(`\n${M.descripcion} · ${M.nudos.length} nudos, ${M.barras.length} barras, ${M.muelles.length} muelles, ${casos.length} posiciones (casos estáticos, mismas cargas nodales).`);
p(`Error = |dif| / máximo del campo en todas las posiciones.\n`);
p(`## Posición a posición (peor caso de todos los nudos/barras y posiciones)\n`);
p(`| campo | pico Hekatan | ${programas.map(([n]) => n).join(" | ")} |`);
p(`|---|---|${programas.map(() => "---").join("|")}|`);
const campos = [["Ux (mm)", (d, n) => d.U.map((u) => u[0] * 1000)], ["Uz (mm)", (d) => d.U.map((u) => u[1] * 1000)], ["Ry (rad)", (d) => d.U.map((u) => u[2])],
  ["P (kN)", (d) => d.F.flatMap((f) => [f[0], f[1]])], ["V2 (kN)", (d) => d.F.flatMap((f) => [f[2], f[3]])], ["M3 (kN·m)", (d) => d.F.flatMap((f) => [f[4], f[5]])]];
for (const [nom, sel] of campos) {
  let pico = 0; for (const c of casos) for (const v of sel(HK[c])) pico = Math.max(pico, Math.abs(v));
  const cols = programas.map(([, D]) => { let m = 0; for (const c of casos) { if (!D[c]) return "falta"; const a = sel(HK[c]), b = sel(D[c]); a.forEach((v, i) => m = Math.max(m, Math.abs(v - b[i]))); } return `${(m / pico * 100).toFixed(4)} %`; });
  p(`| ${nom} | ${pico.toPrecision(5)} | ${cols.join(" | ")} |`);
}
p(`\n## Envolvente del camión (${casos.length} posiciones, separación trasera fija)\n`);
const eh = envolv(HK);
p(`| valor | Hekatan | ${programas.map(([n]) => n).join(" | ")} |`);
p(`|---|---|${programas.map(() => "---").join("|")}|`);
const envs = programas.map(([, D]) => envolv(D));
for (const [k, nom, f] of [["Mmax", "M3 máx (kN·m)", 1], ["Mmin", "M3 mín (kN·m)", 1], ["Vmax", "|V2| máx (kN)", 1], ["Pmax", "|P| máx (kN)", 1], ["Uz", "Uz mín (mm)", 1000], ["UzBase", "asiento máx losa inf. (mm)", 1000]]) {
  p(`| ${nom} | ${(eh[k] * f).toFixed(4)} | ${envs.map((e) => `${(e[k] * f).toFixed(4)} (${((e[k] - eh[k]) / Math.abs(eh[k]) * 100).toFixed(4)} %)`).join(" | ")} |`);
}
writeFileSync(join(AQUI, `COMPARACION_${cual}.md`), L.join("\n") + "\n");
