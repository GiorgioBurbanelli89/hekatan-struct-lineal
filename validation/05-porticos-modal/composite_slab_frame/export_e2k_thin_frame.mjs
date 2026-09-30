#!/usr/bin/env node
/**
 * export_e2k_thin_frame.mjs
 * Construye el modelo composite slab thin + frame y exporta .e2k usando
 * el exporter oficial de Hekatan Struct (examples/src/shared/e2kExporter.ts).
 * Asi obtenemos el formato .e2k correcto (BEAM, FLOOR, story-based assigns).
 *
 * Uso:  node --import tsx/esm export_e2k_thin_frame.mjs <ShellThin|ShellThick|Membrane>
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// El exporter es TS — lo cargamos via tsx loader (registrado por --import).
const { exportE2k } = await import(
  "file://" + join(__dirname, "..", "examples", "src", "shared", "e2kExporter.ts").replace(/\\/g, "/")
);

const arg = (process.argv[2] || "ShellThin").trim();   // ShellThin / ShellThick / Membrane
const isWall = arg === "Membrane";                     // membrana usa muro vertical

// ── Modelo (igual que run_composite_slab_thin_frame.mjs / wall_membrane) ──
const Lx = 4, Ly_or_Lz = 4;
const E_c = 25e6, nu_c = 0.20, t_slab = 0.10, t_wall = 0.20;
const E_s = 200e6, A_b = 7610e-6, Iy_b = 12.9e-5, Iz_b = 1.20e-5, J_b = 0.31e-6;
const q_unif = 5;        // kN/m^2 (slab cases)
const F_top = 100;       // kN total (membrana wall)

const nx = 4, ny = 4;
const nNx = nx + 1, nNy = ny + 1;
const dx = Lx / nx, dy = Ly_or_Lz / ny;

const nodes = [];
const slabZ = 4;          // ETABS necesita Story1 (z=4) sobre Base (z=0)
if (!isWall) {
  // Losa horizontal en z = slabZ (ETABS-compatible: Story1)
  for (let j = 0; j <= ny; j++)
    for (let i = 0; i <= nx; i++)
      nodes.push([i * dx, j * dy, slabZ]);
  // 4 nodos base (z=0) para columnas de soporte (esquinas)
  nodes.push([0,        0,        0]);   // base esquina 1
  nodes.push([nx*dx,    0,        0]);   // base esquina 2
  nodes.push([0,        ny*dy,    0]);   // base esquina 3
  nodes.push([nx*dx,    ny*dy,    0]);   // base esquina 4
} else {
  // Muro vertical en plano xz, y = 0
  for (let k = 0; k <= ny; k++)
    for (let i = 0; i <= nx; i++)
      nodes.push([i * dx, 0, k * dy]);
}

const shells = [];
for (let j = 0; j < ny; j++) {
  for (let i = 0; i < nx; i++) {
    const n_bl = j * nNx + i;
    const n_br = n_bl + 1;
    const n_tr = (j + 1) * nNx + i + 1;
    const n_tl = (j + 1) * nNx + i;
    shells.push([n_bl, n_br, n_tr, n_tl]);
  }
}

const frames = [];
for (let i = 0; i < nx; i++) frames.push([i, i + 1]);
const baseTop = ny * nNx;
for (let i = 0; i < nx; i++) frames.push([baseTop + i, baseTop + i + 1]);
for (let j = 0; j < ny; j++) frames.push([j * nNx, (j + 1) * nNx]);
for (let j = 0; j < ny; j++) frames.push([j * nNx + nx, (j + 1) * nNx + nx]);

// 4 columnas (slab → base) para que ETABS reconozca 2 stories
if (!isWall) {
  const baseN1 = nNx * nNy;       // primer nodo base
  const baseN2 = baseN1 + 1;
  const baseN3 = baseN1 + 2;
  const baseN4 = baseN1 + 3;
  const corner1 = 0;
  const corner2 = nx;
  const corner3 = ny * nNx;
  const corner4 = ny * nNx + nx;
  // El frame3d guesser ve dz dominante → COLUMN
  frames.push([baseN1, corner1]);
  frames.push([baseN2, corner2]);
  frames.push([baseN3, corner3]);
  frames.push([baseN4, corner4]);
}

const elements = [...shells, ...frames];

// nodeInputs
const supports = new Map();
const loads = new Map();
if (!isWall) {
  // Restraints en los 4 nodos base z=0 (no en los corners de la losa)
  const baseN1 = nNx * nNy;
  const fix = [true, true, true, false, false, false];
  supports.set(baseN1,     fix);
  supports.set(baseN1 + 1, fix);
  supports.set(baseN1 + 2, fix);
  supports.set(baseN1 + 3, fix);
  // Carga distribuida nodal q*A/4 en los nodos de cada shell
  for (const sh of shells) {
    const A = dx * dy;
    const fz = -q_unif * A / 4;
    for (const n of sh) {
      const cur = loads.get(n) || [0, 0, 0, 0, 0, 0];
      cur[2] += fz;
      loads.set(n, cur);
    }
  }
} else {
  // Borde inferior empotrado, carga horizontal distribuida en top
  for (let i = 0; i <= nx; i++) supports.set(i, [true, true, true, true, true, true]);
  const F_per = F_top / nNx;
  for (let i = 0; i <= nx; i++) {
    const n = ny * nNx + i;
    loads.set(n, [F_per, 0, 0, 0, 0, 0]);
  }
}

// elementInputs
const elasticities  = new Map();
const poissons      = new Map();
const thicknesses   = new Map();
const sectionShapes = new Map();
const t_use = isWall ? t_wall : t_slab;
for (let e = 0; e < shells.length; e++) {
  elasticities.set(e, E_c);
  poissons.set(e, nu_c);
  thicknesses.set(e, t_use);
}
for (let f = 0; f < frames.length; f++) {
  const e = shells.length + f;
  elasticities.set(e, E_s);
  // Seccion W360X60 para vigas Y columnas
  sectionShapes.set(e, { type: "I", name: "W360X60", h: 0.352, b: 0.203, tf: 0.013, tw: 0.008 });
}

const nodeInputs = { supports, loads };
const elementInputs = { elasticities, poissons, thicknesses, sectionShapes };

const title = isWall
  ? "Composite wall membrane + frames (4x4 m)"
  : `Composite slab ${arg} + frames (4x4 m)`;

// Llamar al exporter oficial
let e2kText = exportE2k({
  nodes, elements, nodeInputs, elementInputs, title,
  units: { force: "KN", length: "M" },
});

// Post-procesar: agregar secciones que el exporter no emite y ETABS necesita
// para correr el analisis (GRIDS, ANALYSIS OPTIONS, MASS SOURCE, LOAD CASES).
const gridsSection = `
$ GRIDS
  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1
  GRID "G1"  LABEL "A"  DIR "X"  COORD 0  VISIBLE "Yes"  BUBBLELOC "End"
  GRID "G1"  LABEL "B"  DIR "X"  COORD 1  VISIBLE "Yes"  BUBBLELOC "End"
  GRID "G1"  LABEL "C"  DIR "X"  COORD 2  VISIBLE "Yes"  BUBBLELOC "End"
  GRID "G1"  LABEL "D"  DIR "X"  COORD 3  VISIBLE "Yes"  BUBBLELOC "End"
  GRID "G1"  LABEL "E"  DIR "X"  COORD 4  VISIBLE "Yes"  BUBBLELOC "End"
  GRID "G1"  LABEL "1"  DIR "Y"  COORD 0  VISIBLE "Yes"  BUBBLELOC "Start"
  GRID "G1"  LABEL "2"  DIR "Y"  COORD 1  VISIBLE "Yes"  BUBBLELOC "Start"
  GRID "G1"  LABEL "3"  DIR "Y"  COORD 2  VISIBLE "Yes"  BUBBLELOC "Start"
  GRID "G1"  LABEL "4"  DIR "Y"  COORD 3  VISIBLE "Yes"  BUBBLELOC "Start"
  GRID "G1"  LABEL "5"  DIR "Y"  COORD 4  VISIBLE "Yes"  BUBBLELOC "Start"
`;

const extraSections = `
$ ANALYSIS OPTIONS
  ACTIVEDOF "UX UY UZ RX RY RZ"
  PDELTA  METHOD "NONE"
  AUTOMESHOPTIONS  MESHTYPE  "GENERAL"  FLOORMESHMAXSIZE  1.0 WALLMESHMAXSIZE  1.0

$ MASS SOURCE
  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "Yes"    INCLUDEADDEDMASS "No"    INCLUDELOADS "No"    ISDEFAULT "Yes"

$ LOAD CASES
  LOADCASE "Dead"  TYPE  "Linear Static"  INITCOND  "PRESET"
  LOADCASE "Dead"  LOADPAT  "Dead"  SF  1
  LOADCASE "Live"  TYPE  "Linear Static"  INITCOND  "PRESET"
  LOADCASE "Live"  LOADPAT  "Live"  SF  1
`;

// FIX #1: ETABS rechaza el archivo si PROGRAM != "ETABS"
e2kText = e2kText.replace(
  /PROGRAM\s+"[^"]+"\s+VERSION\s+"[\d.]+"/,
  'PROGRAM  "ETABS"  VERSION "22.6.0"'
);

// FIX #2: arreglar materiales — Mat_2 debe ser Steel, no Concrete
e2kText = e2kText.replace(
  /MATERIAL\s+"Mat_2"\s+TYPE\s+"Concrete"\s+WEIGHTPERVOLUME\s+[\d.]+/,
  'MATERIAL  "Mat_2"    TYPE "Steel"    WEIGHTPERVOLUME 7.85'
);
e2kText = e2kText.replace(
  /(MATERIAL\s+"Mat_1"\s+SYMTYPE\s+"Isotropic"[^\r\n]+)/,
  '$1\r\n  MATERIAL  "Mat_1"    FC 25000'
);
e2kText = e2kText.replace(
  /(MATERIAL\s+"Mat_2"\s+SYMTYPE\s+"Isotropic"[^\r\n]+)/,
  '$1\r\n  MATERIAL  "Mat_2"    FY 345000  FU 450000  EFFFY 379500  EFFFU 495000'
);

// (FIX #3 y FIX #4 se aplican mas abajo, despues de extraer secciones)

// Re-ordenar secciones segun el orden esperado por ETABS:
//   STORIES → GRIDS → DIAPHRAGM → MATERIAL → FRAME SEC → SLAB PROP →
//   POINT COORDS → LINE CONN → AREA CONN → POINT ASSIGNS → LINE ASSIGNS →
//   AREA ASSIGNS → LOAD PATTERNS → POINT OBJECT LOADS →
//   ANALYSIS OPTIONS → MASS SOURCE → LOAD CASES → END
function extractSection(text, header) {
  const re = new RegExp("(\\$ " + header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?)(?=\\r?\\n\\$ |\\r?\\n\\s+END\\s|$)", "");
  const m = text.match(re);
  return m ? m[0] : "";
}
function removeSection(text, header) {
  const re = new RegExp("(\\$ " + header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?)(?=\\r?\\n\\$ |\\r?\\n\\s+END\\s|$)", "");
  return text.replace(re, "").replace(/\r?\n\r?\n\r?\n+/g, "\r\n\r\n");
}

// Ordered list of sections we want
const sectionOrder = [
  "PROGRAM INFORMATION",
  "CONTROLS",
  "STORIES - IN SEQUENCE FROM TOP",
  "GRIDS",
  "DIAPHRAGM NAMES",
  "MATERIAL PROPERTIES",
  "FRAME SECTIONS",
  "SLAB PROPERTIES",
  "WALL PROPERTIES",
  "POINT COORDINATES",
  "LINE CONNECTIVITIES",
  "AREA CONNECTIVITIES",
  "POINT ASSIGNS",
  "LINE ASSIGNS",
  "AREA ASSIGNS",
  "LOAD PATTERNS",
  "POINT OBJECT LOADS",
  "SHELL OBJECT LOADS",
  "ANALYSIS OPTIONS",
  "MASS SOURCE",
  "LOAD CASES",
];

// Construir un mapa header → section text
const sectionText = {};
for (const h of sectionOrder) {
  const sec = extractSection(e2kText, h);
  if (sec) sectionText[h] = sec.trim();
}

// Inyectar secciones que el exporter no emite
sectionText["GRIDS"]            = gridsSection.trim();
sectionText["ANALYSIS OPTIONS"] = "$ ANALYSIS OPTIONS\r\n  ACTIVEDOF \"UX UY UZ RX RY RZ\"\r\n  PDELTA  METHOD \"NONE\"\r\n  AUTOMESHOPTIONS  MESHTYPE  \"GENERAL\"  FLOORMESHMAXSIZE  1.0 WALLMESHMAXSIZE  1.0";
sectionText["MASS SOURCE"]      = "$ MASS SOURCE\r\n  MASSSOURCE  \"MsSrc1\"    INCLUDEELEMENTS \"Yes\"    INCLUDEADDEDMASS \"No\"    INCLUDELOADS \"No\"    ISDEFAULT \"Yes\"";
sectionText["LOAD CASES"]       = "$ LOAD CASES\r\n  LOADCASE \"Dead\"  TYPE  \"Linear Static\"  INITCOND  \"PRESET\"\r\n  LOADCASE \"Dead\"  LOADPAT  \"Dead\"  SF  1\r\n  LOADCASE \"Live\"  TYPE  \"Linear Static\"  INITCOND  \"PRESET\"\r\n  LOADCASE \"Live\"  LOADPAT  \"Live\"  SF  1";

// FIX #3: agregar POINTASSIGN ... DIAPH "D1" para cada plan-point en cada Level.
// Sin esto, ETABS trata los puntos como huerfanos en niveles superiores y las
// cargas POINTLOAD ahi no se aplican.
{
  const oldPA = sectionText["POINT ASSIGNS"] || "$ POINT ASSIGNS";
  const restraintLines = oldPA.split(/\r?\n/).filter(l => l.includes("RESTRAINT"));
  const diaphLines = [];
  if (!isWall) {
    // Slab: 25 puntos en Level_1
    for (let i = 1; i <= nNx * nNy; i++) {
      diaphLines.push(`  POINTASSIGN  "${i}"  "Level_1"  DIAPH "D1"  `);
    }
  } else {
    // Wall: 5 puntos en cada Level_1..4 (5 niveles altura 1m)
    const nLevels = ny;
    const nPlanPts = nNx;
    for (let lvl = 1; lvl <= nLevels; lvl++) {
      for (let i = 1; i <= nPlanPts; i++) {
        diaphLines.push(`  POINTASSIGN  "${i}"  "Level_${lvl}"  DIAPH "D1"  `);
      }
    }
  }
  sectionText["POINT ASSIGNS"] = ["$ POINT ASSIGNS", ...diaphLines, ...restraintLines].join("\r\n");
}

// FIX #4: reemplazar POINT OBJECT LOADS con SHELL OBJECT LOADS (AREALOAD UNIFF)
if (!isWall) {
  const shellLoadLines = ["$ SHELL OBJECT LOADS"];
  for (let s = 0; s < shells.length; s++) {
    shellLoadLines.push(`  AREALOAD  "F${s + 1}"  "Level_1"  TYPE "UNIFF"  DIR "GRAV"  LC "Dead"  FVAL ${q_unif} `);
  }
  sectionText["SHELL OBJECT LOADS"] = shellLoadLines.join("\r\n");
  // Vaciar POINT OBJECT LOADS (estaba con cargas nodales individuales)
  sectionText["POINT OBJECT LOADS"] = "$ POINT OBJECT LOADS\r\n";
}

// FIX #5: SELFWEIGHT = 0 para comparar limpio sin peso propio (que MATLAB y
// Hekatan Struct CLI no incluyen).
if (sectionText["LOAD PATTERNS"]) {
  sectionText["LOAD PATTERNS"] = sectionText["LOAD PATTERNS"]
    .replace(/SELFWEIGHT\s+1/g, "SELFWEIGHT  0");
}

// FIX #6: el exporter siempre escribe MODELINGTYPE "ShellThin"/"ShellThick".
// Lo cambiamos al tipo solicitado por el script (ShellThin / ShellThick / Membrane).
if (sectionText["SLAB PROPERTIES"]) {
  sectionText["SLAB PROPERTIES"] = sectionText["SLAB PROPERTIES"]
    .replace(/MODELINGTYPE\s+"\w+"/, `MODELINGTYPE "${arg}"`);
}
if (sectionText["WALL PROPERTIES"]) {
  sectionText["WALL PROPERTIES"] = sectionText["WALL PROPERTIES"]
    .replace(/MODELINGTYPE\s+"\w+"/, `MODELINGTYPE "${arg}"`);
}

// Reconstruir
const lines = ["$ File exported from Hekatan FEM Studio (post-processed)\r\n"];
for (const h of sectionOrder) {
  if (sectionText[h]) {
    lines.push(sectionText[h]);
    lines.push("");
  }
}
lines.push("  END");
lines.push("$ END OF MODEL FILE");
e2kText = lines.join("\r\n");

const outName = isWall
  ? "composite_wall_membrane_frame.e2k"
  : `composite_slab_${arg.toLowerCase()}_frame.e2k`;
const outPath = join(__dirname, "etabs", outName);
writeFileSync(outPath, e2kText, "utf8");

console.log(`[OK] e2k generado: ${outPath}`);
console.log(`     ${e2kText.split("\n").length} lineas, ${nodes.length} nodos, ${shells.length} shells, ${frames.length} frames`);
