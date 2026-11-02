/** Test del s2kExporter generando un tablero-puente con DrillDOF=Yes. */
import { writeFileSync } from "fs";
import { exportS2k } from "./s2kExporter.ts";

const L = 15.0, W = 6.0, T_S = 0.20, S_B = 2.0;
const BF = 0.20, TF = 0.015, HW = 0.55, TW = 0.010;
const Q_KNM2 = 15.0;
const N_X = 20, N_Y = 12;

// Generar nodos
const dx = L / N_X, dy = W / N_Y;
const yBeams = [W/2 - S_B, W/2, W/2 + S_B];
const ys = [];
for (let j = 0; j <= N_Y; j++) ys.push(j * dy);
const beamRows = [];
for (const yB of yBeams) {
  let bestJ = 0, dmin = 1e9;
  for (let j = 0; j <= N_Y; j++) {
    const d = Math.abs(ys[j] - yB);
    if (d < dmin) { dmin = d; bestJ = j; }
  }
  ys[bestJ] = yB;
  beamRows.push(bestJ);
}

const joints = [];
const jointMap = new Map();
let nid = 1;
for (let j = 0; j <= N_Y; j++) {
  for (let i = 0; i <= N_X; i++) {
    joints.push({ id: nid, x: i * dx, y: ys[j], z: 0 });
    jointMap.set(`${i},${j}`, nid);
    nid++;
  }
}

// Areas
const areas = [];
let aid = 1;
for (let j = 0; j < N_Y; j++) {
  for (let i = 0; i < N_X; i++) {
    areas.push({
      id: aid,
      joints: [
        jointMap.get(`${i},${j}`),
        jointMap.get(`${i+1},${j}`),
        jointMap.get(`${i+1},${j+1}`),
        jointMap.get(`${i},${j+1}`),
      ],
      section: "LOSA20",
    });
    aid++;
  }
}

// Frames (3 vigas)
const frames = [];
let fid = 1;
for (const jBeam of beamRows) {
  for (let i = 0; i < N_X; i++) {
    frames.push({
      id: fid,
      jointI: jointMap.get(`${i},${jBeam}`),
      jointJ: jointMap.get(`${i+1},${jBeam}`),
      section: "VIGA_FULL",
    });
    fid++;
  }
}

// Apoyos
const restraints = [];
for (const jBeam of beamRows) {
  restraints.push({ joint: jointMap.get(`0,${jBeam}`),  dof: [true, true, true, false, false, false] });
  restraints.push({ joint: jointMap.get(`${N_X},${jBeam}`), dof: [false, true, true, false, false, false] });
}

// Cargas
const areaLoads = areas.map((a) => ({ area: a.id, pattern: "DEAD", value: Q_KNM2, dir: "Gravity" }));

// Modelo S2K
const model = {
  unitsForce: "KN",
  unitsLength: "m",
  materials: [
    { name: "CONC24",     type: "Concrete", E: 25000000,  nu: 0.20, density: 24, fc: 24000 },
    { name: "ACERO_A36",  type: "Steel",    E: 200000000, nu: 0.30, density: 78, fy: 250000 },
  ],
  frameSections: [
    {
      name: "VIGA_FULL", material: "ACERO_A36", shape: "I/Wide Flange",
      t3: HW + 2*TF, t2: BF, tf: TF, tw: TW,
    },
  ],
  areaSections: [
    // CLAVE: DrillDOF=Yes para coupling shell↔frame correcto
    { name: "LOSA20", material: "CONC24", type: "Shell-Thin", thickness: T_S, drillDof: true },
  ],
  joints,
  frames,
  areas,
  restraints,
  areaLoads,
};

const s2kText = exportS2k(model);
const outPath = (process.env.USERPROFILE ?? "") + "\\Documents\\Hekatan Calc 1.0.0\\s2k\\tablero_puente_HEKATAN_export.s2k";
writeFileSync(outPath, s2kText, "utf8");

console.log(`Exportado: ${outPath}`);
console.log(`Tamano: ${s2kText.length} chars`);
console.log("\nEstadisticas:");
console.log(`  Joints: ${joints.length}`);
console.log(`  Frames: ${frames.length}`);
console.log(`  Areas: ${areas.length}`);
console.log(`  Restraints: ${restraints.length}`);
console.log(`  Area loads: ${areaLoads.length}`);
console.log("\nCAMBIO CLAVE vs SAP default:");
console.log("  Shell LOSA20 con DrillDOF=Yes (acople rotacional shell<->frame)");
console.log("  Esto deberia hacer que la viga absorba menos momento (igual que Hekatan)");
console.log("\nPara probar: abrir SAP2000 -> File -> Import -> SAP2000 .s2k Text File");
console.log(`           seleccionar ${outPath}`);
