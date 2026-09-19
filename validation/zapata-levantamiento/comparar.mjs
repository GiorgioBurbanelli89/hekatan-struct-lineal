/**
 * Tabla Hekatan vs SAP2000 / SAFE / ETABS / fórmula para los 6 casos (mismos nudos).
 *   node comparar.mjs   (lee hekatan_n60.json y csi/{sap2000,safe,etabs}.json si existen) -> comparacion.json + tabla
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const aqui = (f) => new URL(f, import.meta.url);
const KS = 2000, TONF = 9.80665;          // tonf/m3; kN -> tonf
const heks = readFileSync(aqui("zapata_6casos_n60.heks"), "utf-8");
const xy = {};
for (const l of heks.split("\n")) { const t = l.split(/\s+/); if (t[0] === "node") xy[t[1]] = [+t[2], +t[3]]; }
const H = JSON.parse(readFileSync(aqui("hekatan_n60.json"), "utf-8"));
const MAP = { E0: "e0", E1_12: "e1_12", E1_6: "e1_6", E1_4: "e1_4", E1_3: "e1_3", BI: "bi_4_6" };
const EYC = { E0: 1, E1_12: 1, E1_6: 1, E1_4: 1, E1_3: 1, BI: 1 + 2 / 6 };
function resumen(w, pat) {     // w: Map "x,y" -> uz (m)
  let wmin = 0; for (const v of w.values()) wmin = Math.min(wmin, v);
  const yc = EYC[pat];
  const fila = [...w].map(([k, v]) => { const [x, y] = k.split(",").map(Number); return { x, y, w: v }; })
    .filter((p) => Math.abs(p.y - yc) < 1e-6).sort((a, b) => a.x - b.x);
  let largo = 0;
  for (let k = 0; k + 1 < fila.length; k++) { const A = fila[k], B = fila[k + 1], h = B.x - A.x;
    if (A.w < 0 && B.w < 0) largo += h; else if (A.w < 0 !== B.w < 0) largo += h * (A.w < 0 ? A.w / (A.w - B.w) : B.w / (B.w - A.w)); }
  const giro = -(fila.at(-1).w - fila[0].w) / (fila.at(-1).x - fila[0].x);
  return { qmax: -wmin * KS, wmax_mm: -wmin * 1000, largo, giro };
}
const prog = {};
for (const [nom, f] of [["SAP2000", "csi/sap2000.json"], ["SAFE", "csi/safe.json"], ["ETABS", "csi/etabs.json"]]) if (existsSync(aqui(f))) prog[nom] = JSON.parse(readFileSync(aqui(f), "utf-8"));
const out = {};
for (const pat of Object.keys(MAP)) {
  const h = H[MAP[pat]];
  const wH = new Map(Object.entries(h.w));
  const fila = { formula: h.formula, rigida: h.rigida, Hekatan: resumen(wH, pat) };
  for (const [nom, R] of Object.entries(prog)) {
    const c = R.casos["NL_" + pat]; if (!c) continue;
    const w = new Map(Object.entries(c.U3).filter(([n]) => xy[n]).map(([n, v]) => [xy[n].map((q) => +q.toFixed(6)).join(","), v]));
    const r = resumen(w, pat);
    // nudo a nudo: peor |Δw| / |w|max
    let peor = 0, wmaxAbs = 0; for (const v of w.values()) wmaxAbs = Math.max(wmaxAbs, Math.abs(v));
    for (const [k, v] of w) { const vh = wH.get(k); if (vh !== undefined) peor = Math.max(peor, Math.abs(vh - v)); }
    r.nudoPeorPct = (peor / wmaxAbs) * 100;
    r.sumFz_tonf = c.sumFz != null ? c.sumFz / TONF : null;
    const lin = R.casos[pat]; if (lin) { let m = 0; for (const v of Object.values(lin.U3)) m = Math.min(m, v); r.qmaxLineal = -m * KS; }
    fila[nom] = r;
  }
  out[pat] = fila;
}
writeFileSync(aqui("comparacion.json"), JSON.stringify(out, null, 1));
const pct = (a, b) => (b ? ((a / b - 1) * 100).toFixed(3) + " %" : "—");
for (const [pat, f] of Object.entries(out)) {
  console.log(`\n${pat}  fórmula/rígida q_max ${(f.formula?.qmax ?? f.rigida.qmax).toFixed(3)}  contacto ${(f.formula?.contacto ?? f.rigida.largoContactoX).toFixed(4)}`);
  for (const nom of ["Hekatan", "SAP2000", "SAFE", "ETABS"]) { const r = f[nom]; if (!r) continue;
    const ref = f.SAP2000;
    console.log(`  ${nom.padEnd(8)} q_max ${r.qmax.toFixed(4)} largo ${r.largo.toFixed(4)} w ${r.wmax_mm.toFixed(4)} mm giro ${r.giro.toExponential(5)}` +
      (ref && nom !== "SAP2000" ? `  | vs SAP q ${pct(r.qmax, ref.qmax)} w ${pct(r.wmax_mm, ref.wmax_mm)} giro ${pct(r.giro, ref.giro)}` : "") +
      (r.nudoPeorPct !== undefined ? `  nudo a nudo ${r.nudoPeorPct.toFixed(4)} %` : "") + (r.qmaxLineal ? ` | lineal q_max ${r.qmaxLineal.toFixed(3)}` : "") + (r.sumFz_tonf != null ? ` ΣFz ${r.sumFz_tonf.toFixed(3)}` : "")); }
}
