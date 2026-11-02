import { readFileSync } from "fs";
import { parseE2k, e2kSummary } from "./e2kImporter.ts";

const path = (process.env.USERPROFILE ?? "") + "\\Documents\\HekatanSapTest\\tablero_puente_etabs.e2k";
const text = readFileSync(path, "utf8");
const m = parseE2k(text);
console.log(`Parseado: ${path}`);
console.log(e2kSummary(m));

// Filtrar viga central (Y=3) y verificar
let cnt = 0;
for (const ln of m.lines.values()) {
  const pi = m.points.get(ln.ptI), pj = m.points.get(ln.ptJ);
  if (!pi || !pj) continue;
  if (Math.abs(pi.y - 3.0) < 0.01 && Math.abs(pj.y - 3.0) < 0.01) {
    cnt++;
  }
}
console.log(`Frames viga central (Y=3.0): ${cnt}`);

// Apoyos
console.log(`\nApoyos:`);
for (const r of m.restraints.slice(0, 8)) {
  const p = m.points.get(r.point);
  if (p) console.log(`  ${r.point} (${p.x}, ${p.y}, ${p.z}) DOF=${r.dof.map(b=>b?'1':'0').join('')}`);
}
console.log(`  ... total ${m.restraints.length}`);
