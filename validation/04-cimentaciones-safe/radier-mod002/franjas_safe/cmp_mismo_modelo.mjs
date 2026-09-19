#!/usr/bin/env node
/**
 * Careo MISMO MODELO Hekatan vs SAFE 20 (radier con DNE, DISEÑO), nudo de elemento a nudo de elemento:
 *   1) fuerzas de cáscara M11 M22 M12 F11 F22 F12 (Hekatan HEAD vs AreaForceShell de SAFE)
 *   2) acero FE: stripDesign.feNode sobre las fuerzas de Hekatan vs el FDB diseñado por SAFE (fdb_fe.py)
 *   3) control: feNode sobre las fuerzas de SAFE vs el FDB (tiene que dar 4 cifras: separa diseño de análisis)
 *   node cmp_mismo_modelo.mjs <prefHK> <prefSAFE>   (lee <prefHK>_hk.json y <prefSAFE>.malla.json/.shell_forces.csv/.fe.json)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { empaquetar, R } from "../../../../tests/lib/bundle.mjs";
const [pref, sp] = process.argv.slice(2);   // prefijo Hekatan, prefijo SAFE
const HK = JSON.parse(readFileSync(pref + "_hk.json", "utf-8"));
const SM = JSON.parse(readFileSync(sp + ".malla.json", "utf-8"));
const FE = JSON.parse(readFileSync(sp + ".fe.json", "utf-8"));
const COMBO = process.env.HK_COMBO_NOMBRE || "DISEÑO";
const filas = readFileSync(sp + ".shell_forces.csv", "utf-8").split(/\r?\n/).filter(Boolean).map(l => l.split(";"));
const cab = filas.shift(), ix = k => cab.indexOf(k);
const SF = new Map();   // "elm|punto" -> [M11 M22 M12 F11 F22 F12]
for (const f of filas) if (f[ix("LoadCase")] === COMBO) SF.set(f[ix("Elm")] + "|" + f[ix("PointElm")], ["M11", "M22", "M12", "F11", "F22", "F12", "V13", "V23"].map(k => +f[ix(k)]));
const clave = (x, y) => `${Math.round(x * 1000)},${Math.round(y * 1000)}`;
// Hekatan: elemento por conjunto de esquinas
const hkPorEsq = new Map();
for (const [i, e] of Object.entries(HK.els)) hkPorEsq.set(e.n.map(n => clave(HK.nodes[n][0], HK.nodes[n][1])).sort().join(" "), i);
const CAMPOS = ["M11", "M22", "M12", "F11", "F22", "F12"];
const pares = [];   // {elm, pto, x, y, h, hk:[8], sf:[8]}
let sinPar = 0;
for (const [elm, d] of Object.entries(SM.elements)) {
  const xy = d.pts.map(p => SM.points[p]);
  const i = hkPorEsq.get(xy.map(([x, y]) => clave(x, y)).sort().join(" "));
  if (i == null) { sinPar++; continue; }
  const e = HK.els[i];
  d.pts.forEach((p, k) => {
    const [x, y] = SM.points[p];
    const j = e.n.findIndex(n => clave(HK.nodes[n][0], HK.nodes[n][1]) === clave(x, y));
    const sf = SF.get(elm + "|" + p);
    if (j >= 0 && sf) pares.push({ elm, pto: p, k, i: +i, x, y, h: e.h, stiff: e.bm >= 10, hk: e.f[j], sf });
  });
}
const out = { elementosSAFE: Object.keys(SM.elements).length, elementosHK: Object.keys(HK.els).length, sinPar, nudos: pares.length, campos: {} };
const dis = pares.filter(p => !p.stiff);
for (const [c, k] of CAMPOS.map((c, k) => [c, k])) {
  const mx = Math.max(...dis.map(p => Math.abs(p.sf[k])));
  const err = dis.map(p => ({ p, d: Math.abs(p.hk[k] - p.sf[k]) })).sort((a, b) => b.d - a.d);
  out.campos[c] = { maxSAFE: +mx.toFixed(4), peorPctMax: +(100 * err[0].d / mx).toFixed(4), p95PctMax: +(100 * err[Math.floor(err.length * 0.05)].d / mx).toFixed(4),
    dentro1e4: `${err.filter(e => e.d <= 1e-4 * mx).length}/${err.length}`,
    peores: err.slice(0, 3).map(e => `${e.p.elm}@${e.p.pto} (${e.p.x.toFixed(3)};${e.p.y.toFixed(3)}) HK ${e.p.hk[k].toFixed(3)} SAFE ${e.p.sf[k].toFixed(3)}`) };
}
// acero
const mod = await empaquetar(`export * from "${R}/examples/src/shared/stripDesign";\n`, "stripDesign");
const prefs = { code: "ACI 318-19", fc: 21000, fy: 411879.3, coverTop: 0.015, coverBot: 0.015, barSize: 0.018, innerLayer: "B", N: 1000, M: 1 };
const cut = new mod.StripCutter([], prefs);
const F = a => ({ M11: a[0], M22: a[1], M12: a[2], F11: a[3], F22: a[4], F12: a[5], V13: a[6], V23: a[7] });
const MAP = { top1: "AsEnvTop1", bot1: "AsEnvBot1", top2: "AsEnvTop2", bot2: "AsEnvBot2" };   // FDB en mm²/mm = 1e-3 m²/m
const acero = {}, ctl = { n: 0, ok: 0, peor: 0 };
for (const c of Object.keys(MAP)) acero[c] = { n: 0, ok: 0, hk: { v: 0 }, sf: { v: 0 }, peorRel: 0 };
for (const p of dis) {
  const ref = FE[p.elm]; if (!ref) continue;
  const a = cut.feNode(F(p.hk), p.h), b = cut.feNode(F(p.sf), p.h);
  for (const [c, f] of Object.entries(MAP)) {
    const s = ref[f]?.[p.k]; if (s == null) continue;
    const sm2 = s * 1e-3;                       // m²/m
    const A = acero[c]; A.n++;
    if (Math.abs(a[c] - sm2) <= Math.max(1e-4 * sm2, 1e-9)) A.ok++;
    if (a[c] > A.hk.v) A.hk = { v: a[c], x: p.x, y: p.y }; if (sm2 > A.sf.v) A.sf = { v: sm2, x: p.x, y: p.y };
    (p.as ??= {})[c] = [a[c], sm2];
    ctl.n++; if (Math.abs(b[c] - sm2) <= Math.max(1e-4 * sm2, 1e-9)) ctl.ok++; else ctl.peor = Math.max(ctl.peor, Math.abs(b[c] - sm2) / Math.max(sm2, 1e-9));
  }
}
out.acero = Object.fromEntries(Object.entries(acero).map(([c, A]) => [c, { dentro4cifras: `${A.ok}/${A.n}`,
  maxHK: `${(A.hk.v * 1e4).toFixed(2)} cm²/m en (${A.hk.x?.toFixed(2)}; ${A.hk.y?.toFixed(3)})`, maxSAFE: `${(A.sf.v * 1e4).toFixed(2)} cm²/m en (${A.sf.x?.toFixed(2)}; ${A.sf.y?.toFixed(3)})` }]));
out.controlDiseno = `feNode(fuerzas SAFE) vs FDB: ${ctl.ok}/${ctl.n} a 4 cifras` + (ctl.peor ? `, peor rel ${ctl.peor.toExponential(2)}` : "");
writeFileSync(pref + ".pares.json", JSON.stringify(dis.map(p => ({ elm: p.elm, x: p.x, y: p.y, hk: p.hk.slice(0, 6), sf: p.sf.slice(0, 6), as: p.as }))));
writeFileSync(pref + ".cmp.json", JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
