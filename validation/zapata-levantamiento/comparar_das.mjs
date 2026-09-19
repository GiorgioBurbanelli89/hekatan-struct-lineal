/**
 * Das 9.ª ed., ejemplo 6.10 (p. 247): Hekatan (mismo .heks de la app) vs SAP2000 / SAFE / ETABS, nudo a
 * nudo, y frente a la zapata RÍGIDA y el área efectiva A' del libro.
 *   node comparar_das.mjs  -> das610_comparacion.json + tabla
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../../tests/lib/bundle.mjs";
import { resolverHeks } from "../../tests/lib/heks.mjs";
const aqui = (f) => new URL(f, import.meta.url);
const TONF = 9.80665;
const mod = await empaquetar(`export * from "${R}/examples/src/zapata-excentrica/zapataExcentrica";`, "zapexc-das");
const P = mod.DAS_EJ610;
const ruta = fileURLToPath(aqui("das_ej610.heks"));
const H = await resolverHeks(ruta);
const U = H.deformOutputs.deformations;
const xy = H.nodes.map((q) => [q[0], q[1]]);
const wHek = new Map(xy.map((_, i) => [String(i + 1), U.get(i)[2]]));
function resumen(w) {          // w: Map id -> uz (m)
  let wmin = 0, nC = 0, iMin = null;
  for (const [id, v] of w) { if (v < wmin) { wmin = v; iMin = id; } if (v < 0) nC++; }
  // área en contacto: celdas del Q4 con sus 4 nudos... se cuenta por nudo con su área tributaria
  const h = P.Lx / P.n;
  let A = 0;
  for (const [id, v] of w) if (v < 0) {
    const [x, y] = xy[+id - 1];
    const fx = (Math.abs(x) < 1e-9 || Math.abs(x - P.Lx) < 1e-9) ? 0.5 : 1, fy = (Math.abs(y) < 1e-9 || Math.abs(y - P.Ly) < 1e-9) ? 0.5 : 1;
    A += h * h * fx * fy;
  }
  // giros por mínimos cuadrados de un plano sobre los nudos en contacto
  let S = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], b = [0, 0, 0];
  for (const [id, v] of w) if (v < 0) { const [x, y] = xy[+id - 1]; const f = [1, x, y]; for (let i = 0; i < 3; i++) { b[i] += f[i] * v; for (let j = 0; j < 3; j++) S[i][j] += f[i] * f[j]; } }
  const det3 = (M) => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  const col = (k) => S.map((r, i) => r.map((c, j) => (j === k ? b[i] : c)));
  const D = det3(S);
  return { qmax: -wmin * P.ks, wmax_mm: -wmin * 1000, nudoMax: iMin, xyMax: xy[+iMin - 1], nudosContacto: nC, areaContacto: A,
           giroX: -det3(col(1)) / D, giroY: -det3(col(2)) / D };
}
const out = { datos: P, rigida: mod.zapataRigidaSinTraccion(P, 400), das: mod.areaEfectivaDas(1.5, 1.5, 0.15, 0.3),
              das_libro: { caso: "II", L1: 1.275, L2: 0.315, A: 1.193, Lp: 1.275, Bp: 0.936, Qu_kN: 606 },
              Hekatan: resumen(wHek), contactoHekatan: globalThis.window.__hekatanCliContacto };
const pct = (a, b) => ((a / b - 1) * 100);
for (const [nom, f] of [["SAP2000", "csi/sap2000_das610.json"], ["SAFE", "csi/safe_das610.json"], ["ETABS", "csi/etabs_das610.json"]]) {
  if (!existsSync(aqui(f))) continue;
  const J = JSON.parse(readFileSync(aqui(f), "utf-8"));
  for (const caso of ["NL_DAS", "NLT_DAS"]) {
    const c = J.casos[caso]; if (!c) continue;
    const w = new Map(Object.entries(c.U3).filter(([id]) => xy[+id - 1]));
    const r = resumen(w);
    let peor = 0, wmx = 0; for (const [id, v] of w) { wmx = Math.max(wmx, Math.abs(v)); peor = Math.max(peor, Math.abs(v - wHek.get(id))); }
    r.nudoPeorPct = peor / wmx * 100; r.sumFz_tonf = c.sumFz / TONF;
    const lin = J.casos.DAS; if (lin) r.qmaxLineal = -Math.min(...Object.values(lin.U3)) * P.ks;
    out[`${nom}${caso === "NLT_DAS" ? " tol 1e-6" : ""}`] = r;
  }
}
// OpenSeesPy (ShellMITC4 + zeroLength ENT), segundo testigo: opensees/ops_das610.json (+ _lineal)
if (existsSync(aqui("opensees/ops_das610.json"))) {
  const J = JSON.parse(readFileSync(aqui("opensees/ops_das610.json"), "utf-8"));
  const w = new Map(Object.entries(J.U3).filter(([id]) => xy[+id - 1]));
  const r = resumen(w);
  let peor = 0, wmx = 0; for (const [id, v] of w) { wmx = Math.max(wmx, Math.abs(v)); peor = Math.max(peor, Math.abs(v - wHek.get(id))); }
  r.nudoPeorPct = peor / wmx * 100;
  if (existsSync(aqui("opensees/ops_das610_lineal.json"))) r.qmaxLineal = -Math.min(...Object.values(JSON.parse(readFileSync(aqui("opensees/ops_das610_lineal.json"), "utf-8")).U3)) * P.ks;
  out["OpenSeesPy"] = r;
}
writeFileSync(aqui("das610_comparacion.json"), JSON.stringify(out, null, 1));
writeFileSync(aqui("csi/hekatan_das610.json"), JSON.stringify({ prog: "hekatan", casos: { NL_DAS: { U3: Object.fromEntries(wHek) } } }));
const ref = out["SAP2000 tol 1e-6"] ?? out.SAP2000;
console.log(`Das ej. 6.10  Q = ${(P.P * TONF).toFixed(0)} kN = ${P.P.toFixed(3)} tonf`);
console.log(`  rígida  q_max ${out.rigida.qmax.toFixed(3)} tonf/m²  contacto ${(out.rigida.contacto * P.Lx * P.Ly).toFixed(4)} m²  giros ${out.rigida.giroX.toExponential(4)} ${out.rigida.giroY.toExponential(4)}`);
console.log(`  Das A' (condición de centroide) ${out.das.A.toFixed(4)} m², libro (ábaco) 1.193 m²`);
for (const k of Object.keys(out).filter((k) => /Hekatan|SAP|SAFE|ETABS|OpenSees/.test(k) && out[k].qmax)) {
  const r = out[k];
  console.log(`  ${k.padEnd(18)} q_max ${r.qmax.toFixed(4)}  w ${r.wmax_mm.toFixed(4)} mm  contacto ${r.areaContacto.toFixed(4)} m² (${r.nudosContacto} nudos)  θx ${r.giroX.toExponential(5)} θy ${r.giroY.toExponential(5)}` +
    (ref && r !== ref ? `  | vs SAP q ${pct(r.qmax, ref.qmax).toFixed(4)} %` : "") + (r.nudoPeorPct !== undefined ? `  nudo a nudo ${r.nudoPeorPct.toFixed(4)} %` : "") + (r.sumFz_tonf ? `  ΣFz ${r.sumFz_tonf.toFixed(4)}` : "") + (r.qmaxLineal ? `  lineal ${r.qmaxLineal.toFixed(3)}` : ""));
}
