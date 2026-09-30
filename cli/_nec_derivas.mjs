// Capa NEC 3: estático NEC-15 / borrador en el CM (±5 %), derivas por piso, irregularidad torsional.
// node cli/_nec_derivas.mjs dump.json Tcomp [salidaDir]  → escribe est_<caso>.json (dumps para csi_desde_dump.py --pat)
import { empaquetar, R, cargarFem } from "../tests/lib/bundle.mjs";
import { readFileSync, writeFileSync } from "node:fs";
const [fn, Tc, dirOut] = process.argv.slice(2);
const D = JSON.parse(readFileSync(fn, "utf-8"));
const m = await empaquetar(`export { pisosDeModelo } from "${R}/examples/src/shared/nec/pisos";
export { cortanteEstatico, PORTOVIEJO_D } from "${R}/examples/src/shared/nec/estatico";
export { cargasEnCM, derivas } from "${R}/examples/src/shared/nec/derivas";
export { jointMass } from "${R}/hekatan-fem/src/modalCpp";\n`, "necd" + Date.now());
const { deform } = await cargarFem();
const aMap = (o) => new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v]));
const ei = {}; for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
const ni = { supports: aMap(D.nodeInputs.supports), diaphragms: aMap(D.nodeInputs.diaphragms) };
const P = m.pisosDeModelo(D.nodes, D.elements, ni, ei);
const masas = m.jointMass(D.nodes, D.elements, ei, { incluyeElementos: 1 });
const esDia = (n) => ni.diaphragms.has(n);
for (const norma of ["NEC-15", "borrador"]) {
  const d = m.PORTOVIEJO_D[norma], e = m.cortanteEstatico(d, P, +Tc), F = e.pisos.map((p) => p.F);
  console.log(`\n== ${norma}: V ${e.V.toFixed(1)} kN (Cs ${e.Cs.toFixed(4)}, k ${e.k.toFixed(3)})`);
  for (const [dir, ecc, nom] of [[0, 0, "Ex"], [0, 0.05, "Ex+e"], [0, -0.05, "Ex-e"], [1, 0, "Ey"], [1, 0.05, "Ey+e"], [1, -0.05, "Ey-e"]]) {
    const loads = m.cargasEnCM(D.nodes, P, F, dir, ecc, masas, ni.diaphragms);
    const r = deform(D.nodes, D.elements, { ...ni, loads }, ei);
    let fx = 0, fy = 0; for (const v of r.reactions.values()) { fx += v[0]; fy += v[1]; }
    const Dv = m.derivas(D.nodes, P, r.deformations, dir, d.R, esDia);
    console.log(`  ${nom.padEnd(5)} ΣR ${(dir ? fy : fx).toFixed(1)} · ` + Dv.map((q) => `p${q.k} ${(q.max * 1000).toFixed(3)}‰ ${q.relacion.toFixed(3)}${q.torsional ? "!" : ""} ΔM ${(q.inelastica * 100).toFixed(2)}%`).join(" | "));
    if (dirOut && norma === "NEC-15") {
      const o = { ...D, nodeInputs: { ...D.nodeInputs, loads: Object.fromEntries(loads) }, deformations: Object.fromEntries(r.deformations), reactions: Object.fromEntries(r.reactions) };
      writeFileSync(`${dirOut}/est_${nom.replace("+", "p").replace("-", "m")}.json`, JSON.stringify(o));
    }
  }
}
