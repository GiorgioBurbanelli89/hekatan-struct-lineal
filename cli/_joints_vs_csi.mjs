// Fuerzas de cascara de una plantilla, lo que analyze() deja en bendingXXcentro / bendingXXjoint,
// contra AreaForceShell de SAP2000 o ETABS (misma malla), elemento a elemento y joint a joint.
//   DIR=sap2000_shells node cli/_joints_vs_csi.mjs 4 losa-plana [k=v ...]
//   DKQ=gauss  -> evalua el DKQ en Gauss 2x2 y extrapola (defecto: esquinas)
import { readFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const tipo = +process.argv[2], nom = process.argv[3];
const over = Object.fromEntries(process.argv.slice(4).map((a) => { const [k, v] = a.split("="); return [k, isNaN(Number(v)) ? v : Number(v)]; }));
if (process.env.DKQ) globalThis.__hekatanDkqJoints = process.env.DKQ;
if (process.env.ITW) globalThis.__hekatanItwRec = process.env.ITW;
const src = readFileSync("cli/plantillas_hekatan.mjs", "utf-8");
const cab = src.slice(src.indexOf("const g = globalThis"), src.indexOf("export function correr")).replace("${R}", R);
const mod = await empaquetar(cab + `
export function modelo(tipo, over) {
  const ex = examplesRegistry.find(e => e.id === "plantillas");
  const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.default; p.tipo = tipo; Object.assign(p, over);
  const estado = (ini) => { let v = ini; return { get val(){ return v; }, set val(x){ v = x; }, get rawVal(){ return v; }, set rawVal(x){ v = x; } }; };
  const st = { nodes: estado([]), elements: estado([]), nodeInputs: estado({}), elementInputs: estado({}), deformOutputs: estado({}), analyzeOutputs: estado({}), objects3D: estado([]) };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  return st;
}`, "joints-vs-csi");
const st = mod.modelo(tipo, over);
const N = st.nodes.val, EL = st.elements.val, a = st.analyzeOutputs.val;
const B = "validation/modelos/plantillas/"; const DIR = process.env.DIR || "sap2000_shells";
const J = JSON.parse(readFileSync(B + DIR + "/P" + tipo + "_" + nom + ".json", "utf-8").replace(/\bNaN\b/g, "null"));
const porNombre = new Map(J.puntos.map((p) => [p.n, p]));
const k3 = (x, y, z) => [x, y, z].map((v) => Math.round(v * 1000)).join(",");
const hekIdx = new Map(); EL.forEach((el, i) => { if (el.length === 4) hekIdx.set(k3(...[0, 1, 2].map((d) => el.reduce((s, n) => s + N[n][d], 0) / 4)), i); });
const media = (v) => v.reduce((s, q) => s + q, 0) / v.length;
let nE = 0, nJ = 0, peorC = 0, peorJ = 0, maxM = 1e-12, sEH = 0, sHH = 0, sEHc = 0, sHHc = 0; const ej = [];
// por nudo: media de los joints de los elementos que lo comparten (lo que pinta el colormap) vs lo mismo en CSI
const nudoH = new Map(), nudoE = new Map();
for (const ar of J.areas || []) {
  const pts = ar.pts.map((p) => porNombre.get(p)).filter(Boolean); if (pts.length !== 4) continue;
  const c = [0, 1, 2].map((d) => pts.reduce((s, p) => s + [p.x, p.y, p.z][d], 0) / 4);
  const i = hekIdx.get(k3(...c)), fe = (J.shells || {})[ar.n]; if (i === undefined || !fe) continue;
  const el = EL[i];
  const MEMB = process.env.CAMPO === "F";
  const hc = MEMB ? [a.membraneXXcentro?.get(i), a.membraneYYcentro?.get(i), a.membraneXYcentro?.get(i)]
                  : [a.bendingXXcentro?.get(i), a.bendingYYcentro?.get(i), a.bendingXYcentro?.get(i)];
  const hj = MEMB ? [a.membraneXXjoint?.get(i), a.membraneYYjoint?.get(i), a.membraneXYjoint?.get(i)]
                  : [a.bendingXXjoint?.get(i), a.bendingYYjoint?.get(i), a.bendingXYjoint?.get(i)];
  const IDX = MEMB ? [[0, 1], [1, 2], [2, 3]] : [[0, 4], [1, 5], [2, 6]];
  if (hc[0] === undefined) continue;
  nE++;
  for (const [q, idx] of IDX) {
    const ec = media(fe.map((v) => v[idx]));
    maxM = Math.max(maxM, Math.abs(ec)); sEHc += ec * hc[q]; sHHc += hc[q] * hc[q]; peorC = Math.max(peorC, Math.abs(ec - hc[q]));
  }
  if (!hj[0]) continue;
  for (const v of fe) {
    const p = porNombre.get(v[0]); const pos = el.findIndex((n) => k3(...N[n]) === k3(p.x, p.y, p.z)); if (pos < 0) continue;
    nJ++;
    for (const [q, idx] of IDX) {
      sEH += v[idx] * hj[q][pos]; sHH += hj[q][pos] * hj[q][pos]; peorJ = Math.max(peorJ, Math.abs(v[idx] - hj[q][pos]));
      ej.push([c, (MEMB ? ["F11", "F22", "F12"] : ["M11", "M22", "M12"])[q], v[idx], hj[q][pos]]);
    }
    const kn = k3(...N[el[pos]]);
    (nudoH.get(kn) ?? nudoH.set(kn, []).get(kn)).push(hj[0][pos]);
    (nudoE.get(kn) ?? nudoE.set(kn, []).get(kn)).push(v[IDX[0][1]]);
  }
}
let peorN = 0; for (const [kn, l] of nudoH) { const e = nudoE.get(kn); if (e) peorN = Math.max(peorN, Math.abs(media(l) - media(e))); }
ej.sort((p, q) => Math.abs(q[2] - q[3]) - Math.abs(p[2] - p[3]));
console.log(`[${process.env.CAMPO === "F" ? "MEMBRANA F11/F22/F12" : "FLEXION M11/M22/M12"}] tipo ${tipo} ${nom} vs ${DIR}${process.env.DKQ ? " (DKQ " + process.env.DKQ + ")" : ""}: ${nE} cascaras, ${nJ} joints · |M|max CSI ${maxM.toFixed(3)}`);
console.log(`  CENTROIDE: pendiente ${(sEHc / sHHc).toFixed(6)} · peor ${(100 * peorC / maxM).toFixed(4)} % del maximo`);
console.log(`  JOINTS   : pendiente ${(sEH / sHH).toFixed(6)} · peor ${(100 * peorJ / maxM).toFixed(4)} % · promediado por NUDO (colormap) peor ${(100 * peorN / maxM).toFixed(4)} %`);
for (const [c, q, e, h] of ej.slice(0, 4)) console.log("    ", c.map((v) => v.toFixed(1)).join(","), q, "CSI", e.toFixed(4), "Hekatan", h.toFixed(4));
