// Resuelve un .heks por el MISMO camino que la app (cliModeler + WASM) y vuelca a JSON lo que hace falta
// para el informe: nudos, elementos, desplazamientos, reacciones, muelles de area, momentos de cascara por
// joint (convencion y signo CSI: M11 > 0 = traccion abajo) y fuerzas de extremo de barra.
//   node resolver_heks_json.mjs modelo.heks salida.json
import { writeFileSync } from "node:fs";
import { resolverHeks } from "../../../tests/lib/heks.mjs";
const r = await resolverHeks(process.argv[2]);
const plano = (o) => {
  if (o instanceof Map) return Object.fromEntries([...o].map(([k, v]) => [k, plano(v)]));
  if (Array.isArray(o)) return o.map(plano);
  if (o && typeof o === "object") return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, plano(v)]));
  return o;
};
const a = r.analyzeOutputs ?? {};
const ei = r.elementInputs;
writeFileSync(process.argv[3], JSON.stringify({
  nodes: r.nodes, elements: r.elements,
  supports: plano(r.nodeInputs.supports), loads: plano(r.nodeInputs.loads),
  springs: r.nodeInputs.springs,
  thicknesses: plano(ei.thicknesses), shellModifiers: plano(ei.shellModifiers ?? new Map()),
  deformations: plano(r.deformOutputs.deformations ?? {}), reactions: plano(r.deformOutputs.reactions ?? {}),
  M11j: plano(a.bendingXXjoint ?? {}), M22j: plano(a.bendingYYjoint ?? {}), M12j: plano(a.bendingXYjoint ?? {}),
  M11c: plano(a.bendingXXcentro ?? {}), M22c: plano(a.bendingYYcentro ?? {}),
  V13: plano(a.shearX ?? a.shearsXZ ?? {}), V23: plano(a.shearY ?? a.shearsYZ ?? {}),
  N: plano(a.normals ?? {}), Vy: plano(a.shearsY ?? {}), Vz: plano(a.shearsZ ?? {}), T: plano(a.torsions ?? {}),
  My: plano(a.bendingsY ?? {}), Mz: plano(a.bendingsZ ?? {}),
  frameLoads: plano(ei.frameLoads ?? {}),
  claves: Object.keys(a),
}));
console.log("nudos", r.nodes.length, "elementos", r.elements.length, "salidas:", Object.keys(a).join(","));
