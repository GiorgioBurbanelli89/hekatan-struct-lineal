// Fuerzas de cáscara de Hekatan (joints, sin promediar) contra AreaForceShell de SAP2000, por componente.
//   node cli/_fuerzas_cascara_vs_sap.mjs dump.json sap_fuerzas.json
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const D = JSON.parse(readFileSync(process.argv[2], "utf-8")), S = JSON.parse(readFileSync(process.argv[3], "utf-8"));
const m = await empaquetar(`export { analyze } from "${R}/hekatan-fem/src/analyze";\n`, "fcsap" + Date.now());
const aMap = (o) => new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v]));
const ei = {}; for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
const ao = m.analyze(D.nodes, D.elements, ei, { deformations: aMap(D.deformations), reactions: new Map() });
const H = { Mxx: "bendingXXjoint", Myy: "bendingYYjoint", Mxy: "bendingXYjoint", Nxx: "membraneXXjoint", Nyy: "membraneYYjoint", Nxy: "membraneXYjoint", Vx: "tranverseShearXjoint", Vy: "tranverseShearYjoint" };
const val = (h, f) => { const e = D.elements[f.area], k = e.indexOf(f.pt); return ao[H[h]]?.get(f.area)?.[k]; };
for (const [csi, cand] of [["M11", ["Mxx", "Myy"]], ["M22", ["Myy", "Mxx"]], ["M12", ["Mxy"]], ["F11", ["Nxx", "Nyy"]], ["F22", ["Nyy", "Nxx"]], ["F12", ["Nxy"]], ["V13", ["Vx", "Vy"]], ["V23", ["Vy", "Vx"]]]) {
  const mx = Math.max(...S.map((f) => Math.abs(f[csi])));
  const txt = cand.flatMap((h) => [1, -1].map((s) => { let e = 0; for (const f of S) { const v = val(h, f); e = Math.max(e, Math.abs(s * (v ?? NaN) - f[csi])); } return `${s < 0 ? "-" : ""}${h}: ${(e / mx * 100).toFixed(4)} %`; }));
  console.log(`${csi} (máx ${mx.toFixed(3)} kN): ${txt.join(" · ")}`);
}
