/**
 * Test: generate a parametric building and export to e2k
 * Run: node test_e2k_export.mjs
 */
import { writeFileSync } from "fs";

// Simulate a 2x2 bay, 3 story building (like "Edificio" generator)
// Y-up convention: [x, y_vertical, z_horizontal]
const nBaysX = 2, nBaysZ = 2, nFloors = 3;
const spanX = 5, spanZ = 4, hFloor = 3;

const nodes = [];
const elements = [];
const colIndices = new Set();
const beamIndices = new Set();
const nid = {}; // "ix,iy,iz" → node index

// Create nodes
for (let iy = 0; iy <= nFloors; iy++) {
  for (let iz = 0; iz <= nBaysZ; iz++) {
    for (let ix = 0; ix <= nBaysX; ix++) {
      nid[`${ix},${iy},${iz}`] = nodes.length;
      nodes.push([ix * spanX, iy * hFloor, iz * spanZ]);
    }
  }
}

// Columns (vertical = Y direction)
for (let iy = 0; iy < nFloors; iy++) {
  for (let iz = 0; iz <= nBaysZ; iz++) {
    for (let ix = 0; ix <= nBaysX; ix++) {
      const ei = elements.length;
      elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix},${iy+1},${iz}`]]);
      colIndices.add(ei);
    }
  }
}

// Beams X
for (let iy = 1; iy <= nFloors; iy++) {
  for (let iz = 0; iz <= nBaysZ; iz++) {
    for (let ix = 0; ix < nBaysX; ix++) {
      const ei = elements.length;
      elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix+1},${iy},${iz}`]]);
      beamIndices.add(ei);
    }
  }
}

// Beams Z
for (let iy = 1; iy <= nFloors; iy++) {
  for (let ix = 0; ix <= nBaysX; ix++) {
    for (let iz = 0; iz < nBaysZ; iz++) {
      const ei = elements.length;
      elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix},${iy},${iz+1}`]]);
      beamIndices.add(ei);
    }
  }
}

console.log(`Nodes: ${nodes.length}, Elements: ${elements.length}`);
console.log(`Columns: ${colIndices.size}, Beams: ${beamIndices.size}`);

// Build e2k manually (matching ETABS format exactly)
const rd = v => Math.round(v * 10000) / 10000;
const lines = [];

lines.push(`$ File test_edificio.e2k`);
lines.push(` `);
lines.push(`$ PROGRAM INFORMATION`);
lines.push(`  PROGRAM  "ETABS"  VERSION "22.6.0"  `);
lines.push(``);
lines.push(`$ CONTROLS`);
lines.push(`  UNITS  "TONF"  "M"  "C"  `);
lines.push(`  PREFERENCE  MERGETOL 0.001`);
lines.push(``);

// Stories
const floors = [];
for (let iy = 0; iy <= nFloors; iy++) {
  const elev = iy * hFloor;
  const name = iy === 0 ? "Base" : `Story${iy}`;
  floors.push({ name, elev, height: hFloor });
}

lines.push(`$ STORIES - IN SEQUENCE FROM TOP`);
for (let i = floors.length - 1; i >= 1; i--) {
  lines.push(`  STORY "${floors[i].name}"  HEIGHT ${floors[i].height} MASTERSTORY "Yes"  `);
}
lines.push(`  STORY "Base"  ELEV ${floors[0].elev} `);
lines.push(``);

// Materials
lines.push(`$ MATERIAL PROPERTIES`);
lines.push(`  MATERIAL  "CONC240"    TYPE "Concrete"    GRADE "f'c 4000 psi"    WEIGHTPERVOLUME 2.4`);
lines.push(`  MATERIAL  "CONC240"    SYMTYPE "Isotropic"  E 2340000  U 0.2  A 1E-05`);
lines.push(``);

// Frame sections
lines.push(`$ FRAME SECTIONS`);
lines.push(`  FRAMESECTION  "COL40x40"  MATERIAL "CONC240"  SHAPE "Concrete Rectangular"  D 0.4 B 0.4 `);
lines.push(`  FRAMESECTION  "VIGA30x40"  MATERIAL "CONC240"  SHAPE "Concrete Rectangular"  D 0.4 B 0.3 `);
lines.push(``);

// Plan points: unique (X, Z) coordinates
// Y-up: plan = (X, Z), elevation = Y
const xyToPoint = new Map();
let ptIdx = 0;
nodes.forEach(n => {
  const key = `${rd(n[0])},${rd(n[2])}`;
  if (!xyToPoint.has(key)) xyToPoint.set(key, `${++ptIdx}`);
});

lines.push(`$ POINT COORDINATES`);
for (const [key, ptName] of xyToPoint) {
  const [x, z] = key.split(",").map(Number);
  lines.push(`  POINT "${ptName}"  ${x} ${z} `);
}
lines.push(``);

// Node → (point, story)
const nodeToPS = (ni) => {
  const n = nodes[ni];
  const key = `${rd(n[0])},${rd(n[2])}`;
  const pt = xyToPoint.get(key) || "1";
  const elev = rd(n[1]);
  const floor = floors.find(f => rd(f.elev) === elev);
  return { pt, story: floor?.name || "Base" };
};

// Line connectivities + line assigns
lines.push(`$ LINE CONNECTIVITIES`);
const laLines = [];
let colNum = 0, beamNum = 0;

elements.forEach((el, i) => {
  if (colIndices.has(i)) {
    colNum++;
    const top = nodes[el[0]][1] <= nodes[el[1]][1] ? el[1] : el[0];
    const psTop = nodeToPS(top);
    // Column: same point, nStories=1
    lines.push(`  LINE  "C${colNum}"  COLUMN  "${psTop.pt}"  "${psTop.pt}"  1`);
    laLines.push(`  LINEASSIGN  "C${colNum}"  "${psTop.story}"  SECTION "COL40x40"  MINNUMSTA 3 AUTOMESH "YES"  MESHATINTERSECTIONS "YES"  `);
  } else {
    beamNum++;
    const ps0 = nodeToPS(el[0]), ps1 = nodeToPS(el[1]);
    lines.push(`  LINE  "B${beamNum}"  BEAM  "${ps0.pt}"  "${ps1.pt}"  0`);
    laLines.push(`  LINEASSIGN  "B${beamNum}"  "${ps0.story}"  SECTION "VIGA30x40"  MINNUMSTA 3 AUTOMESH "YES"  MESHATINTERSECTIONS "YES"  `);
  }
});
lines.push(``);

// Point assigns (fixed at base)
lines.push(`$ POINT ASSIGNS`);
nodes.forEach((n, ni) => {
  if (rd(n[1]) === 0) { // Base level
    const ps = nodeToPS(ni);
    lines.push(`  POINTASSIGN  "${ps.pt}"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"  `);
  }
});
lines.push(``);

// Line assigns
lines.push(`$ LINE ASSIGNS`);
laLines.forEach(l => lines.push(l));
lines.push(``);

// Load patterns
lines.push(`$ LOAD PATTERNS`);
lines.push(`  LOADPATTERN "Dead"  TYPE  "Dead"  SELFWEIGHT  1`);
lines.push(`  LOADPATTERN "Live"  TYPE  "Live"  SELFWEIGHT  0`);
lines.push(``);

lines.push(`  END`);
lines.push(`$ END OF MODEL FILE`);

const result = lines.join("\r\n");
writeFileSync((process.env.USERPROFILE ?? "") + "/Downloads/test_edificio.e2k", result);
console.log(`\nExported ${result.length} chars to test_edificio.e2k`);
console.log(`Points: ${xyToPoint.size}, Columns: ${colNum}, Beams: ${beamNum}`);
console.log(`\nFirst 40 lines:`);
lines.slice(0, 40).forEach((l, i) => console.log(`${i}: ${l}`));
