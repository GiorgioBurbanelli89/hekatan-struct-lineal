// SAP2000 contra ETABS, fuerzas de cascara joint a joint (misma malla, mismo .heks/.e2k/.s2k).
//   node cli/_sap_vs_etabs_shells.mjs P4_losa-plana
import { readFileSync } from "node:fs";
const nom = process.argv[2]; const B = "validation/modelos/plantillas/";
const lee = (d) => JSON.parse(readFileSync(B + d + "/" + nom + ".json", "utf-8").replace(/\bNaN\b/g, "null"));
const S = lee(process.env.SAPDIR || "sap2000"), E = lee("etabs");
const k3 = (x, y, z) => [x, y, z].map(v => Math.round(v * 1000)).join(",");
const pS = new Map(S.puntos.map(p => [p.n, p])), pE = new Map(E.puntos.map(p => [p.n, p]));
const cen = (J, P, a) => { const pts = a.pts.map(n => P.get(n)).filter(Boolean); return pts.length === 4 ? k3(...[0, 1, 2].map(d => pts.reduce((s, p) => s + [p.x, p.y, p.z][d], 0) / 4)) : null; };
const areasE = new Map(); for (const a of E.areas) { const c = cen(E, pE, a); if (c) areasE.set(c, a); }
let n = 0, peorJ = 0, peorC = 0, maxM = 1e-12, sSE = 0, sEE = 0; const ej = [];
for (const a of S.areas) {
  const c = cen(S, pS, a); const ae = areasE.get(c); const fs = S.shells?.[a.n], fe = E.shells?.[ae?.n]; if (!ae || !fs || !fe) continue;
  const jS = new Map(fs.map(v => { const p = pS.get(v[0]); return [k3(p.x, p.y, p.z), v]; })), jE = new Map(fe.map(v => { const p = pE.get(v[0]); return [k3(p.x, p.y, p.z), v]; }));
  const m = (l, i) => l.reduce((s, v) => s + v[i], 0) / l.length;
  for (const [k, vs] of jS) { const ve = jE.get(k); if (!ve) continue; n++;
    for (const i of [4, 5, 6]) { maxM = Math.max(maxM, Math.abs(ve[i])); sSE += vs[i] * ve[i]; sEE += ve[i] * ve[i]; ej.push([c, i, vs[i], ve[i]]); } }
  for (const i of [4, 5]) peorC = Math.max(peorC, Math.abs(m(fs, i) - m(fe, i)));
}
for (const [, , vs, ve] of ej) peorJ = Math.max(peorJ, Math.abs(vs - ve));
ej.sort((a, b) => Math.abs(b[2] - b[3]) - Math.abs(a[2] - a[3]));
console.log(`${nom}: ${n} joints emparejados · |M|max ETABS ${maxM.toFixed(3)} · pendiente SAP/ETABS ${(sSE / sEE).toFixed(6)}`);
console.log(`  joint a joint (M11 M22 M12): peor ${(100 * peorJ / maxM).toFixed(4)} % del maximo · centroides (media de 4 joints): peor ${(100 * peorC / maxM).toFixed(4)} %`);
for (const [c, i, vs, ve] of ej.slice(0, 4)) console.log("   ", c, ["M11", "M22", "M12"][i - 4], "SAP", vs.toFixed(4), "ETABS", ve.toFixed(4));
