/** Test del s2kImporter con el archivo SAP2000 real del usuario. */
import { readFileSync } from "fs";
import { parseS2k, s2kSummary } from "./s2kImporter.ts";

const path = (process.env.USERPROFILE ?? "") + "\\Documents\\Hekatan Calc 1.0.0\\s2k\\tablero_puente_sap.s2k";
const text = readFileSync(path, "utf8");

console.log("Parseando:", path);
console.log(`  ${text.length} chars, ${text.split('\n').length} lineas\n`);

const m = parseS2k(text);
console.log(s2kSummary(m));

// Verificar restraints
console.log("\nApoyos detectados (joints restringidos):");
for (const r of m.restraints) {
  const j = m.joints.get(r.joint);
  if (j) {
    console.log(`  Joint ${r.joint} en (${j.x}, ${j.y}, ${j.z}) — DOF: ${r.dof.map(b => b ? '1' : '0').join('')}`);
  }
}

// Frames de la viga central (Y = W/2 = 3 m)
console.log("\nFrames de la viga CENTRAL (Y ≈ 3.0 m):");
const centralFrames = [];
for (const f of m.frames.values()) {
  const ji = m.joints.get(f.jointI), jj = m.joints.get(f.jointJ);
  if (ji && jj && Math.abs(ji.y - 3.0) < 0.01 && Math.abs(jj.y - 3.0) < 0.01) {
    centralFrames.push({ id: f.id, x_i: ji.x, x_j: jj.x, section: f.section });
  }
}
console.log(`  Total: ${centralFrames.length} frames`);
console.log(`  Primer frame: ${centralFrames[0]?.id} (${centralFrames[0]?.x_i} → ${centralFrames[0]?.x_j})`);
console.log(`  Ultimo frame: ${centralFrames[centralFrames.length-1]?.id}`);

// Cargas distribuidas suma total
let totalLoad = 0;
for (const al of m.areaLoads) {
  const ar = m.areas.get(al.area);
  if (!ar) continue;
  // Calcular area aproximada como rectangulo (4 joints)
  if (ar.joints.length === 4) {
    const j1 = m.joints.get(ar.joints[0]);
    const j3 = m.joints.get(ar.joints[2]);
    if (j1 && j3) {
      const area = Math.abs(j3.x - j1.x) * Math.abs(j3.y - j1.y);
      totalLoad += al.value * area;
    }
  }
}
console.log(`\nCarga total distribuida: ${totalLoad.toFixed(1)} kN (sum of UnifLoad × Area)`);
