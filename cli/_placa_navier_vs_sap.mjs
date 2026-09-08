// La placa 4x4 del test placa-momentos-navier (Shell-THICK, 8x8, q=-10) contra SAP2000:
// joints de AreaForceShell vs bendingXXjoint de analyze(), y el valor por nudo (colormap).
//   node cli/_placa_navier_vs_sap.mjs [validation/isse/placa_navier/sap/placa.json]
import { readFileSync } from "node:fs";
import { resolverHeks } from "../tests/lib/heks.mjs";
const jsn = process.argv[2] || "validation/isse/placa_navier/sap/placa.json";
const J = JSON.parse(readFileSync(jsn, "utf-8").replace(/\bNaN\b/g, "null"));
const r = await resolverHeks("validation/isse/placa_navier/placa.heks");
const N = r.nodes, EL = r.elements, a = r.analyzeOutputs;
const porNombre = new Map(J.puntos.map((p) => [p.n, p]));
const k3 = (x, y, z) => [x, y, z].map((v) => Math.round(v * 1000)).join(",");
const hekIdx = new Map(); EL.forEach((el, i) => { if (el.length === 4) hekIdx.set(k3(...[0, 1, 2].map((d) => el.reduce((s, n) => s + N[n][d], 0) / 4)), i); });
const media = (v) => v.reduce((s, q) => s + q, 0) / v.length;
let nJ = 0, peorJ = 0, maxM = 1e-12, sEH = 0, sHH = 0; const nudoH = new Map(), nudoE = new Map(), nudoS = new Map();
const ej = [];
for (const ar of J.areas || []) {
  const pts = ar.pts.map((p) => porNombre.get(p)).filter(Boolean); if (pts.length !== 4) continue;
  const c = [0, 1, 2].map((d) => pts.reduce((s, p) => s + [p.x, p.y, p.z][d], 0) / 4);
  const i = hekIdx.get(k3(...c)), fe = (J.shells || {})[ar.n]; if (i === undefined || !fe) continue;
  const el = EL[i]; const hj = [a.bendingXXjoint?.get(i), a.bendingYYjoint?.get(i), a.bendingXYjoint?.get(i)]; if (!hj[0]) continue;
  for (const v of fe) {
    const p = porNombre.get(v[0]); const pos = el.findIndex((n) => k3(...N[n]) === k3(p.x, p.y, p.z)); if (pos < 0) continue;
    nJ++;
    for (const [q, idx] of [[0, 4], [1, 5], [2, 6]]) { maxM = Math.max(maxM, Math.abs(v[idx])); sEH += v[idx] * hj[q][pos]; sHH += hj[q][pos] ** 2; peorJ = Math.max(peorJ, Math.abs(v[idx] - hj[q][pos])); ej.push([c, q, v[idx], hj[q][pos]]); }
    const kn = k3(...N[el[pos]]);
    (nudoH.get(kn) ?? nudoH.set(kn, []).get(kn)).push(hj[0][pos]);
    (nudoE.get(kn) ?? nudoE.set(kn, []).get(kn)).push(v[4]);
    nudoS.set(kn, a.bendingXX.get(i)[pos]);   // lo que pinta el colormap (media de joints de los vecinos)
  }
}
let peorN = 0, centroH = null, centroE = null, centroS = null;
for (const [kn, l] of nudoH) { const e = nudoE.get(kn); if (!e) continue; peorN = Math.max(peorN, Math.abs(media(l) - media(e))); if (kn === k3(2, 2, 0)) { centroH = media(l); centroE = media(e); centroS = nudoS.get(kn); } }
ej.sort((p, q) => Math.abs(q[2] - q[3]) - Math.abs(p[2] - p[3]));
console.log(`placa Navier (thick) vs SAP2000: ${nJ} joints · |M|max SAP ${maxM.toFixed(4)} · pendiente ${(sEH / sHH).toFixed(6)}`);
console.log(`  joint a joint peor ${(100 * peorJ / maxM).toFixed(4)} % · promediado por nudo peor ${(100 * peorN / maxM).toFixed(4)} %`);
console.log(`  M11 en el centro: SAP (media de joints) ${centroE?.toFixed(4)} · Hekatan joints ${centroH?.toFixed(4)} · Hekatan colormap ${centroS?.toFixed(4)} · Navier 7.0724`);
for (const [c, q, e, h] of ej.slice(0, 4)) console.log("    ", c.map((v) => v.toFixed(2)).join(","), ["M11", "M22", "M12"][q], "SAP", e.toFixed(4), "Hekatan", h.toFixed(4));
