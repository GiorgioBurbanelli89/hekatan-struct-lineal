/**
 * DKT: el Shell-Thin de los TRIANGULOS (22-sep-2026).
 *
 * Hasta hoy `shelltype thin` solo llegaba a los cuadrilateros (DKQ); los triangulos seguian con la
 * placa GRUESA de awatif (CS-DSG3). La malla GENERAL de ETABS (Quad_Build) mete triangulos entre
 * los cuadrilateros, asi que sobre esa malla Hekatan Thin se iba hasta un 2 % del maximo.
 * Con la DKT (Batoz, Bathe & Ho 1980; `hekatan-fem/src/cpp/utils/plateDKT.h`):
 *
 *  (1-3) Hekatan Thin resuelve LA MALLA DE ETABS (sus nudos, sus Q4 y sus triangulos, sus apoyos,
 *        su carga) y se compara nudo a nudo con ETABS 22 ShellThin. Medido: 0.000 % en los tres.
 *        Malla y desplazamientos de ETABS: `galpon-bodega-electoral/malla_etabs_poligono.py --tipo thin`.
 *        Ampliado (22-sep-2026, orden de Jorge) a losa en T, con ductos y de geometria irregular, y con
 *        SAP2000 y OpenSees resolviendo la MISMA malla (`validation/losas_irregulares/`).
 *  (4)   Placa cuadrada apoyada (borde duro) con SOLO triangulos DKT contra Navier: la DKT
 *        converge sola, no por parecerse a ETABS. 16x16x2: −0.345 % (prototipo Python).
 */
import { writeFileSync, readFileSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolverHeks } from "../lib/heks.mjs";

export const nombre = "dkt-triangulo-vs-etabs";
export const descripcion = "Shell-Thin en triangulos (DKT): malla GENERAL de ETABS nudo a nudo (L, T, huecos, ductos, poligonos oblicuos) y placa apoyada vs Navier";

const RAIZ = fileURLToPath(new URL("../..", import.meta.url));
// Cada caso: ETABS 22 malla EL SOLO el area (Auto Mesh de fabrica, 1.25 m) con Shell-Thin, apoyos en
// los vertices del contorno y −10 kN/m2. Geometrias donde ETABS usa su mallador GENERAL (Quad_Build):
const CASOS = [
  "losa_L_hueco",            // L con hueco rectangular
  "L_sin_hueco",             // L
  "rect_con_hueco",          // rectangulo con hueco
  "losa_T",                  // T (alma 4x6, ala 12x2)
  "losa_ductos",             // rectangulo con 3 ductos: 0.6x0.6, 0.4x0.8 y uno circular (octogono r 0.5)
  "pentagono",               // lados oblicuos
  "trapecio_hueco_girado",   // trapecio con hueco girado 45°
];

async function sobreMallaEtabs(dir, m) {
  const J = JSON.parse(readFileSync(join(RAIZ, "validation/isse/automesh/etabs_poligono", `${m}_etabs_malla_thin.json`), "utf-8"));
  const N = J.etabs.nudos, EL = J.etabs.elementos, R = J.etabs.restricciones ?? [];
  const L = [];
  N.forEach((p, i) => L.push(`node ${i + 1} ${p[0]} ${p[1]} ${p[2]}`));
  let k = 0, tri = 0;
  for (const e of EL) {
    if (e.length !== 3 && e.length !== 4) continue;
    k++; if (e.length === 3) tri++;
    L.push(`${e.length === 4 ? "shell" : "tri"} ${k} ${e.map((i) => i + 1).join(" ")} 0.20 25e6`, `areaload ${k} -10`, `shelltype ${k} thin`);
  }
  R.forEach((r, i) => { if (r && r.some(Boolean)) L.push(`support ${i + 1} ${["ux", "uy", "uz", "rx", "ry", "rz"].filter((_, c) => r[c]).join(" ")}`); });
  L.push("solve", "");
  const f = join(dir, `${m}.heks`); writeFileSync(f, L.join("\n"));
  const U = (await resolverHeks(f)).deformOutputs.deformations;
  let um = 0; for (const [, u] of U) um = Math.max(um, ...u.slice(0, 3).map(Math.abs));
  const contra = (D) => {
    let p = 0;
    D.forEach((d, i) => { const u = U.get(i); if (!d || !u) return; for (let c = 0; c < 3; c++) p = Math.max(p, Math.abs(u[c] - d[c]) / um * 100); });
    return p;
  };
  // SAP2000 y OpenSees resuelven LA MISMA malla (validation/losas_irregulares/*.py)
  const otro = (prog) => { const p = join(RAIZ, "validation/isse/automesh/etabs_poligono", `${m}_${prog}_thin.json`);
                           return existsSync(p) ? contra(JSON.parse(readFileSync(p, "utf-8")).desplaz) : null; };
  return { peor: contra(J.etabs.desplaz), sap: otro("sap"), os: otro("opensees"), np: otro("numpy"), n: N.length, tri, quad: k - tri };
}

async function navier(dir, n) {
  const Lp = 10, t = 0.2, E = 25e6, nu = 0.2, q = -10;   // ν del .heks por defecto
  const id = (i, j) => i * (n + 1) + j + 1, L = [];
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) L.push(`node ${id(i, j)} ${(i * Lp) / n} ${(j * Lp) / n} 0`);
  let k = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const a = id(i, j), b = id(i + 1, j), c = id(i + 1, j + 1), d = id(i, j + 1);
    const T = (i + j) % 2 === 0 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]];
    for (const tr of T) { k++; L.push(`tri ${k} ${tr.join(" ")} ${t} ${E}`, `areaload ${k} ${q}`, `shelltype ${k} thin`); }
  }
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
    const s = ["ux", "uy", "rz"];                              // placa pura: el plano quieto
    if (i === 0 || i === n) s.push("uz", "rx");                // borde x = cte: w y dw/dy
    if (j === 0 || j === n) s.push("uz", "ry");                // borde y = cte: w y dw/dx
    L.push(`support ${id(i, j)} ${[...new Set(s)].join(" ")}`);
  }
  L.push("solve", "");
  const f = join(dir, `navier_${n}.heks`); writeFileSync(f, L.join("\n"));
  const U = (await resolverHeks(f)).deformOutputs.deformations;
  const w = U.get(id(n / 2, n / 2) - 1)[2];
  const D = (E * t ** 3) / (12 * (1 - nu * nu));
  return (w / (0.00406235 * q * Lp ** 4 / D) - 1) * 100;
}

export async function correr() {
  const dir = mkdtempSync(join(tmpdir(), "hkTest-dkt-"));
  const filas = [];
  try {
    for (const m of CASOS) {
      const r = await sobreMallaEtabs(dir, m);
      filas.push({ que: `${m}: vs ETABS 22 Thin, nudo a nudo`, medido: r.peor, limite: 0.01, ok: r.peor <= 0.01,
                   detalle: `${r.n} nudos, ${r.quad} Q4 (DKQ) + ${r.tri} triangulos (DKT) · % del maximo` });
      for (const [prog, v] of [["SAP2000 24 Thin", r.sap], ["OpenSees DKGQ/DKGT", r.os], ["numpy DKQ/DKT", r.np]])
        filas.push({ que: `${m}: vs ${prog}, misma malla`, medido: v ?? NaN, limite: 0.01, ok: v !== null && v <= 0.01,
                     detalle: v === null ? "SIN MEDIR: correr validation/losas_irregulares/*.py" : "% del maximo" });
      // IDA Y VUELTA: SAP2000 abre el .s2k y ETABS el .e2k que EXPORTA Hekatan (con OBJMESHTYPE
      // NOAUTOMESH: con DEFAULT ETABS remallaba y se iba 2.5 %). Prueba el exportador, no el solver.
      for (const [prog, ext] of [["sap", ".s2k"], ["etabs", ".e2k"]]) {
        const p = join(RAIZ, "validation/losas_irregulares/modelos", m, `${m}_idavuelta_${prog}.json`);
        const v = existsSync(p) ? JSON.parse(readFileSync(p, "utf-8")).peor_pct : null;
        filas.push({ que: `${m}: ${prog === "sap" ? "SAP2000" : "ETABS"} abre el ${ext} de Hekatan`, medido: v ?? NaN, limite: 0.01,
                     ok: v !== null && v <= 0.01, detalle: v === null ? "SIN MEDIR: abrir_csi_y_comparar.py sap / etabs_abre_e2k.py" : "% del maximo (csi-cli imprime 5 cifras)" });
      }
    }
    const e = await navier(dir, 16);
    filas.push({ que: "placa apoyada 16x16x2 triangulos DKT vs Navier", medido: Math.abs(e), limite: 0.5, ok: Math.abs(e) <= 0.5,
                 detalle: `w centro ${e.toFixed(3)} % (Python: −0.345 %)` });
  } finally { rmSync(dir, { recursive: true, force: true }); }
  return filas;
}
