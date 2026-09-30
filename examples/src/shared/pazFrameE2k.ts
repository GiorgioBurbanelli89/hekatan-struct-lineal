/**
 * =============================================================================
 *  Paz Benchmarks — Builders comunes + ETABS .e2k exporter unificado
 * =============================================================================
 *
 *  Soporta los modelos canónicos del libro:
 *    • Paz 4.1, 6.1   — 1-DOF (columna con masa concentrada)
 *    • Paz 7.1, 9.3   — Shear building 2D (N pisos con DIAPHRAGM RIGID)
 *    • Paz 8.1        — 2-DOF lateral
 *    • Paz 10.7       — Fixed-fixed beam
 *    • Paz 11.1, 11.4 — Plane frame 2D inclinado
 *    • Paz 12.1       — Grid frame 3D (parrilla horizontal)
 *    • Paz 13.1       — Space frame 3D (5 nodos, 4 vigas radiando)
 *
 *  Todos sin shells ni losas — solo frame 1D.
 *  E2k exporter genera modelos abrir-en-ETABS para validación cruzada.
 *
 *  Convención de unidades: el libro de Paz usa LB-IN-S (sistema imperial).
 *  Los benchmarks aquí mantienen valores numéricos del libro pero generan
 *  el e2k en KIP-IN (compatible con ETABS), preservando la equivalencia
 *  numérica de los resultados.
 * =============================================================================
 */

import { deform, analyze, type Node, type Element, type DeformOutputs } from "hekatan-fem";
import type { BuildStates } from "../workspace/exampleRegistry";

// ════════════════════════════════════════════════════════════════════
// CONVERSIONES (Paz usa LB-IN-S)
// ETABS .e2k usaremos KIP-IN o TONF-M según convenga
// ════════════════════════════════════════════════════════════════════
const LB_TO_KIP = 1 / 1000;
const LB_TO_TONF = 1 / 2204.62;
const IN_TO_M = 0.0254;
const G_INPS2 = 386.088;   // gravedad en in/s²
const PSI_TO_KPI = 1 / 1000;  // psi → ksi
const PSI_TO_TONFM2 = 0.703069;  // psi → tonf/m²

export function fmtNum(v: number, prec: number = 6): string {
  if (Math.abs(v) < 1e-12) return "0";
  const abs = Math.abs(v);
  if (abs >= 1e6 || abs < 1e-3) return v.toExponential(6).replace(/e\+?/, "E+").replace(/E\+?-/, "E-");
  return parseFloat(v.toFixed(prec)).toString();
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ════════════════════════════════════════════════════════════════════
// HELPER COMÚN — Cabecera estándar de e2k ETABS
// ════════════════════════════════════════════════════════════════════
export interface E2kHeader {
  units: "TONF M" | "KIP IN" | "KIP FT";
  title1: string;
  title2: string;
}

export function emitE2kHeader(h: E2kHeader): string[] {
  const now = new Date();
  const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  const [forceUnit, lengthUnit] = h.units.split(" ");
  return [
    `$ File saved ${dateStr} ${timeStr}`,
    ``,
    `$ PROGRAM INFORMATION`,
    `  PROGRAM  "ETABS"  VERSION "19.1.0"  `,
    ``,
    `$ CONTROLS`,
    `  UNITS  "${forceUnit}"  "${lengthUnit}"  "C"  `,
    `  TITLE1  "${h.title1}"  `,
    `  TITLE2  "${h.title2}"  `,
    ``,
  ];
}

export function emitE2kFooter(): string[] {
  return [
    `  END`,
    `$ END OF MODEL FILE`,
  ];
}

// ════════════════════════════════════════════════════════════════════
// MATERIAL: emite líneas de "MATERIAL PROPERTIES" para acero estándar Paz
// ════════════════════════════════════════════════════════════════════
export function emitSteelMaterial(name: string, E: number, gamma: number, U: number = 0.3): string[] {
  return [
    `  MATERIAL  "${name}"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${fmtNum(gamma)}`,
    `  MATERIAL  "${name}"    SYMTYPE "Isotropic"  E ${fmtNum(E)}  U ${U}  A 1.16999999590917E-05`,
    `  MATERIAL  "${name}"  FY 35153.48  FU 45699.53 FYE 38668.83  FUE 50269.48`,
  ];
}

export function emitConcreteMaterial(name: string, E: number, gamma: number, U: number = 0.2): string[] {
  return [
    `  MATERIAL  "${name}"    TYPE "Concrete"    WEIGHTPERVOLUME ${fmtNum(gamma)}`,
    `  MATERIAL  "${name}"    SYMTYPE "Isotropic"  E ${fmtNum(E)}  U ${U}  A 9.99999974737875E-06`,
    `  MATERIAL  "${name}"    FC 2855.205`,
  ];
}

// ════════════════════════════════════════════════════════════════════
// FRAMESECTION: emite línea estándar
// ════════════════════════════════════════════════════════════════════
export interface FrameSectionDef {
  name: string;
  material: string;
  shape: string;            // "Steel I/Wide Flange" | "Concrete Rectangular" | "Steel Tube" | etc.
  D?: number; B?: number; TF?: number; TW?: number;
  /** Si shape es "Steel Pipe", D=outer diameter, T=thickness */
  T?: number;
  fillMaterial?: string;
  /** Property modifiers ETABS-style */
  AreaMod?: number; As2Mod?: number; As3Mod?: number;
  JMod?: number; I22Mod?: number; I33Mod?: number;
}

export function emitFrameSection(s: FrameSectionDef): string[] {
  const lines: string[] = [];
  let line = `  FRAMESECTION  "${s.name}"  MATERIAL "${s.material}"  SHAPE "${s.shape}"`;
  if (s.D !== undefined) line += `  D ${fmtNum(s.D)}`;
  if (s.B !== undefined) line += ` B ${fmtNum(s.B)}`;
  if (s.TF !== undefined) line += ` TF ${fmtNum(s.TF)}`;
  if (s.TW !== undefined) line += ` TW ${fmtNum(s.TW)}`;
  if (s.T !== undefined) line += ` T ${fmtNum(s.T)}`;
  if (s.fillMaterial) line += ` FILLMATERIAL "${s.fillMaterial}"  `;
  lines.push(line);

  const mods: string[] = [];
  if (s.AreaMod !== undefined && Math.abs(s.AreaMod - 1) > 1e-6) mods.push(`AREAMODIFIER ${fmtNum(s.AreaMod)}`);
  if (s.As2Mod !== undefined && Math.abs(s.As2Mod - 1) > 1e-6) mods.push(`AS2MODIFIER ${fmtNum(s.As2Mod)}`);
  if (s.As3Mod !== undefined && Math.abs(s.As3Mod - 1) > 1e-6) mods.push(`AS3MODIFIER ${fmtNum(s.As3Mod)}`);
  if (s.JMod !== undefined && Math.abs(s.JMod - 1) > 1e-6) mods.push(`JMODIFIER ${fmtNum(s.JMod)}`);
  if (s.I22Mod !== undefined && Math.abs(s.I22Mod - 1) > 1e-6) mods.push(`I22MODIFIER ${fmtNum(s.I22Mod)}`);
  if (s.I33Mod !== undefined && Math.abs(s.I33Mod - 1) > 1e-6) mods.push(`I33MODIFIER ${fmtNum(s.I33Mod)}`);
  if (mods.length > 0) lines.push(`  FRAMESECTION  "${s.name}"  ${mods.join("  ")}  `);

  return lines;
}

// ════════════════════════════════════════════════════════════════════
// SHEAR BUILDING — Paz 7.1 / 9.3 (frame plano + DIAPHRAGM RIGID)
// ════════════════════════════════════════════════════════════════════
export interface ShearBuildingParams {
  /** N pisos */
  nStories: number;
  /** Altura de cada piso [m] (de abajo arriba). length = nStories */
  storyHeights: number[];
  /** Ancho de la planta (separación entre 2 columnas) [m] */
  bayWidth: number;
  /** Peso TOTAL distribuido por piso (incluye losa+paredes+SW) [kN] */
  storyWeights: number[];
  /** I por columna (moments of inertia) por piso [m⁴] */
  I_per_column: number[];
  /** Número de columnas por marco interior. default 2 (frame plano simple) */
  nCols: number;
  /** E del material columna [kN/m²] */
  E: number;
  /** γ del material [kN/m³] */
  gamma: number;
  /** Sección Frame: dimensiones para visualizar (no afectan rigidez) */
  colSection: { D: number; B: number };
  /** Material (Steel/Concrete) — afecta nombre material e2k */
  materialType: "Steel" | "Concrete";
}

export function buildShearBuildingModel(p: ShearBuildingParams, states: BuildStates) {
  const { nStories, storyHeights, bayWidth, storyWeights, I_per_column, nCols, E, gamma } = p;
  const g = 9.80665;

  // ── Geometría ────────────────────────────────────────────────────
  // Dos líneas de columnas en x=0 y x=bayWidth, en y=0 (frame plano)
  // Z elevación: 0 (base) + storyHeights acumulados
  const elevations: number[] = [0];
  for (let i = 0; i < nStories; i++) elevations.push(elevations[i] + storyHeights[i]);

  const nodes: Node[] = [];
  // Nodos: 2 por piso (incluye base) → 2·(nStories+1)
  for (let s = 0; s <= nStories; s++) {
    nodes.push([0, 0, elevations[s]]);             // izquierda
    nodes.push([bayWidth, 0, elevations[s]]);      // derecha
  }

  // ── Elementos: 2 cols por piso + 1 viga RÍGIDA por piso ─────────
  const elements: Element[] = [];
  const elemSection: Array<"col" | "beam"> = [];
  const elemStory: number[] = [];  // 0..nStories-1
  for (let s = 0; s < nStories; s++) {
    const baseLeft = 2 * s, baseRight = 2 * s + 1;
    const topLeft = 2 * (s + 1), topRight = 2 * (s + 1) + 1;
    elements.push([baseLeft, topLeft]);    elemSection.push("col"); elemStory.push(s);
    elements.push([baseRight, topRight]);  elemSection.push("col"); elemStory.push(s);
    elements.push([topLeft, topRight]);    elemSection.push("beam"); elemStory.push(s);
  }

  // ── Soportes: empotramiento total en base ──────────────────────
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  supports.set(0, [true, true, true, true, true, true]);
  supports.set(1, [true, true, true, true, true, true]);
  // Pórtico PLANO XZ (Paz §7.1): uy, rx, rz atados en los pisos, como «Plane Frame XZ» de SAP2000. Sin esto el
  // modal sacaba primero los modos fuera del plano (0.36 Hz). El visor no los dibuja (restriccionDePlano).
  for (let n = 2; n < nodes.length; n++) supports.set(n, [false, true, false, true, false, true]);

  // ── Cargas: nodal en cada piso (W_story / 2 por nodo) ──────────
  // (Paz idealiza con masas concentradas; usamos peso distribuido nodal
  //  para que `deform` calcule reacciones correctas)
  const loads = new Map<number, [number, number, number, number, number, number]>();
  // MASA del piso (30-sep-2026): Paz la concentra en el piso (§7.1, m = W/g). Antes solo iba el PESO como
  // carga y el modal 3D daba f₁ = 21.9 Hz en vez de 1.88 (solo pesaba ρ = 0.001). Mitad en cada nudo, en t.
  const masses = new Map<number, number>();
  for (let s = 0; s < nStories; s++) {
    const wHalf = -storyWeights[s] / 2;  // negativo Z
    loads.set(2 * (s + 1),     [0, 0, wHalf, 0, 0, 0]);
    loads.set(2 * (s + 1) + 1, [0, 0, wHalf, 0, 0, 0]);
    masses.set(2 * (s + 1), storyWeights[s] / g / 2);
    masses.set(2 * (s + 1) + 1, storyWeights[s] / g / 2);
  }

  // ── Inputs por elemento ────────────────────────────────────────
  const elasticities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const areas = new Map<number, number>();
  const Iy_map = new Map<number, number>();
  const Iz_map = new Map<number, number>();
  const J_map = new Map<number, number>();
  const shearAreasY = new Map<number, number>();
  const shearAreasZ = new Map<number, number>();
  const densities = new Map<number, number>();
  const sectionLabels = new Map<number, string>();
  const materialTypes = new Map<number, string>();
  const sectionInfo = new Map<number, any>();

  const D = p.colSection.D, B = p.colSection.B;
  const A_col = D * B;  // aproximación dimensional (no afecta modal flexional)
  const G = E / 2.6;

  for (let e = 0; e < elements.length; e++) {
    const story = elemStory[e];
    const isCol = elemSection[e] === "col";
    elasticities.set(e, E);
    shearModuli.set(e, G);
    if (isCol) {
      // Shear building (Paz §7.1): la columna no se acorta. Con el área nominal 0.30×0.30 el pórtico
      // cabeceaba y bajaba las frecuencias; ×1000 la deja axialmente rígida como en el libro.
      areas.set(e, A_col * 1000);
      Iy_map.set(e, I_per_column[story]);  // strong axis flexión lateral
      Iz_map.set(e, I_per_column[story] * 0.3);  // weak axis (no crítica en shear)
      J_map.set(e, I_per_column[story] * 0.05);
      sectionLabels.set(e, `Col S${story + 1}: I=${I_per_column[story].toExponential(2)} m⁴`);
      sectionInfo.set(e, {
        name: `COL_S${story + 1}`,
        shape: p.materialType === "Steel" ? "Steel I/Wide Flange" : "Concrete Rectangular",
        D, B, TF: 0.02, TW: 0.012,
        material: p.materialType === "Steel" ? "A992Fy50" : "concrete",
      });
    } else {
      // Viga "rígida" — I muy grande para forzar shear-building idealization
      areas.set(e, A_col * 4);
      Iy_map.set(e, I_per_column[Math.min(story, nStories - 1)] * 1e5);   // viga RÍGIDA (Paz §7.1); ×1000 dejaba −0.08 %
      Iz_map.set(e, I_per_column[Math.min(story, nStories - 1)] * 100);
      J_map.set(e, I_per_column[Math.min(story, nStories - 1)] * 50);
      sectionLabels.set(e, `Viga RÍGIDA S${story + 1}`);
      sectionInfo.set(e, {
        name: `BEAM_S${story + 1}_RIGID`,
        shape: "Concrete Rectangular",
        D: D * 1.5, B: B * 1.5,
        material: p.materialType === "Steel" ? "A992Fy50" : "concrete",
      });
    }
    materialTypes.set(e, p.materialType === "Steel" ? "Acero" : "Hormigón");
    // ρ_eq de modo que ρ·A·g·L = peso del elemento
    // pero queremos el peso total como masa concentrada en pisos
    // → ρ pequeño (peso prop. negligible)
    densities.set(e, 0);   // toda la masa está en los pisos (arriba)
    // Euler-Bernoulli (As = −1, convención del solver): Paz no cuenta la deformación por cortante
    // (k = 12EI/L³, §7.1). Con As = 0.85·A de la sección nominal el pórtico salía 0.2 % más blando.
    shearAreasY.set(e, -1);
    shearAreasZ.set(e, -1);
  }

  states.nodes.val = nodes;
  states.elements.val = elements;
  states.nodeInputs.val = { supports, loads, masses };
  states.elementInputs.val = {
    elasticities, shearModuli, areas,
    momentsOfInertiaZ: Iy_map,
    momentsOfInertiaY: Iz_map,
    torsionalConstants: J_map,
    shearAreasY, shearAreasZ, densities,
    sectionLabels, materialTypes, sectionInfo,
  } as any;

  try {
    states.deformOutputs.val = deform(
      nodes, elements, { supports, loads }, states.elementInputs.val,
    );
    states.analyzeOutputs.val = analyze(
      nodes, elements,
      states.elementInputs.val,
      states.deformOutputs.val,
    );
  } catch (e: any) {
    console.error(`[ShearBuilding] solver error:`, e.message);
  }
  states.objects3D.val = [];
  return { nodes, elements, elevations };
}

export function generateShearBuildingE2k(p: ShearBuildingParams, title: string): { filename: string; content: string } {
  const { nStories, storyHeights, bayWidth, storyWeights, I_per_column } = p;
  const lines: string[] = [];
  lines.push(...emitE2kHeader({ units: "TONF M", title1: title, title2: "Paz benchmark" }));

  // STORIES
  lines.push(`$ STORIES - IN SEQUENCE FROM TOP`);
  for (let s = nStories - 1; s >= 0; s--) {
    const isMaster = s === nStories - 1;
    const masterRef = isMaster ? `MASTERSTORY "Yes"` : `SIMILARTO "Story${nStories}"`;
    lines.push(`  STORY "Story${s + 1}"  HEIGHT ${fmtNum(storyHeights[s])} ${masterRef}  `);
  }
  lines.push(`  STORY "Base"  ELEV 0 `);
  lines.push(``);

  lines.push(`$ GRIDS`);
  lines.push(`  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 `);
  lines.push(``);

  lines.push(`$ DIAPHRAGM NAMES`);
  lines.push(`  DIAPHRAGM "D1"    TYPE RIGID`);
  lines.push(``);

  // Materiales
  lines.push(`$ MATERIAL PROPERTIES`);
  if (p.materialType === "Steel") {
    lines.push(...emitSteelMaterial("A992Fy50", p.E / 9.80665, p.gamma / 9.80665));
  } else {
    lines.push(...emitConcreteMaterial("concrete", p.E / 9.80665, p.gamma / 9.80665));
  }
  lines.push(``);

  // Frame Sections — una por piso
  lines.push(`$ FRAME SECTIONS`);
  for (let s = 0; s < nStories; s++) {
    // Sección equivalente con I exacto. Si Steel: rectangular hueco; si concrete: rect sólido
    // Dimensión que da I correcto: D⁴/12 = I → D = (12·I)^(1/4)
    const D_eq = Math.pow(12 * I_per_column[s], 0.25);
    lines.push(...emitFrameSection({
      name: `COL_S${s + 1}`,
      material: p.materialType === "Steel" ? "A992Fy50" : "concrete",
      shape: p.materialType === "Steel" ? "Steel I/Wide Flange" : "Concrete Rectangular",
      D: D_eq, B: D_eq * 0.6, TF: 0.02, TW: 0.012,
    }));
  }
  // Beam rigid (un solo nombre genérico)
  lines.push(...emitFrameSection({
    name: "BEAM_RIGID",
    material: p.materialType === "Steel" ? "A992Fy50" : "concrete",
    shape: "Concrete Rectangular",
    D: bayWidth * 0.5, B: bayWidth * 0.3,
    AreaMod: 100, I33Mod: 100, I22Mod: 100,  // viga rígida
  }));
  lines.push(``);

  // POINT COORDINATES — 2 puntos en planta (líneas de columnas)
  lines.push(`$ POINT COORDINATES`);
  lines.push(`  POINT "1"  0 0 `);
  lines.push(`  POINT "2"  ${fmtNum(bayWidth)} 0 `);
  lines.push(``);

  // LINE CONNECTIVITIES — columnas y vigas por piso
  lines.push(`$ LINE CONNECTIVITIES`);
  for (let s = 0; s < nStories; s++) {
    lines.push(`  LINE  "C${s + 1}A"  COLUMN  "1"  "1"  1`);
    lines.push(`  LINE  "C${s + 1}B"  COLUMN  "2"  "2"  1`);
    lines.push(`  LINE  "B${s + 1}"  BEAM   "1"  "2"  0`);
  }
  lines.push(``);

  // POINT ASSIGNS — DIAPHRAGM en cada piso, RESTRAINT en base
  lines.push(`$ POINT ASSIGNS`);
  lines.push(`  POINTASSIGN  "1"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"  DIAPH "DISCONNECTED"  `);
  lines.push(`  POINTASSIGN  "2"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"  DIAPH "DISCONNECTED"  `);
  for (let s = 0; s < nStories; s++) {
    lines.push(`  POINTASSIGN  "1"  "Story${s + 1}"  DIAPH "D1"  `);
    lines.push(`  POINTASSIGN  "2"  "Story${s + 1}"  DIAPH "D1"  `);
  }
  lines.push(``);

  // LINE ASSIGNS
  lines.push(`$ LINE ASSIGNS`);
  for (let s = 0; s < nStories; s++) {
    lines.push(`  LINEASSIGN  "C${s + 1}A"  "Story${s + 1}"  SECTION "COL_S${s + 1}"  RIGIDZONE 0.5 MINNUMSTA 3 AUTOMESH "YES"  MESHATINTERSECTIONS "YES"  `);
    lines.push(`  LINEASSIGN  "C${s + 1}B"  "Story${s + 1}"  SECTION "COL_S${s + 1}"  RIGIDZONE 0.5 MINNUMSTA 3 AUTOMESH "YES"  MESHATINTERSECTIONS "YES"  `);
    lines.push(`  LINEASSIGN  "B${s + 1}"   "Story${s + 1}"  SECTION "BEAM_RIGID" RIGIDZONE 0.5 MINNUMSTA 3 AUTOMESH "YES"  MESHATINTERSECTIONS "YES"  `);
  }
  lines.push(``);

  // LOAD PATTERNS — DEAD con SELFWEIGHT 0 (las masas se asignan manualmente)
  lines.push(`$ LOAD PATTERNS`);
  lines.push(`  LOADPATTERN "DEAD"  TYPE  "Dead"  SELFWEIGHT  0`);
  lines.push(``);

  // POINT OBJECT LOADS — peso de piso como point load
  lines.push(`$ POINT OBJECT LOADS`);
  for (let s = 0; s < nStories; s++) {
    const wHalf_tonf = (storyWeights[s] / 9.80665) / 2;  // kN → tonf
    lines.push(`  POINTLOAD  "1"  "Story${s + 1}"  TYPE "FORCE"  LC "DEAD"  FX 0 FY 0 FZ ${fmtNum(-wHalf_tonf)}`);
    lines.push(`  POINTLOAD  "2"  "Story${s + 1}"  TYPE "FORCE"  LC "DEAD"  FX 0 FY 0 FZ ${fmtNum(-wHalf_tonf)}`);
  }
  lines.push(``);

  lines.push(`$ ANALYSIS OPTIONS`);
  lines.push(`  ACTIVEDOF  "UX UY UZ RX RY RZ"  `);
  lines.push(``);

  lines.push(`$ MASS SOURCE`);
  lines.push(`  MASSSOURCE  "MsSrc1"  INCLUDEELEMENTS "No"  INCLUDEADDEDMASS "No"  INCLUDELOADS "Yes"  LUMPATSTORIES "Yes"  ISDEFAULT "Yes"  `);
  lines.push(`  MASSSOURCELOAD  "MsSrc1"  "DEAD"  1 `);
  lines.push(``);

  lines.push(`$ LOAD CASES`);
  lines.push(`  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `);
  lines.push(`  LOADCASE "Modal"  MAXMODES  ${Math.max(3, nStories)} MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `);
  lines.push(`  LOADCASE "Dead"  TYPE  "Linear Static"  INITCOND  "PRESET"  `);
  lines.push(`  LOADCASE "Dead"  LOADPAT  "DEAD"  SF  1 `);
  lines.push(``);

  lines.push(...emitE2kFooter());

  return {
    filename: `Paz_${title.replace(/\W+/g, "_")}.e2k`,
    content: lines.join("\r\n"),
  };
}

// ════════════════════════════════════════════════════════════════════
// SPACE FRAME — Paz 13.1 / 6.3 / arbitrario
// ════════════════════════════════════════════════════════════════════
export interface SpaceFrameParams {
  /** Nodos en metros */
  nodes: Node[];
  /** Elementos como pares de índices */
  elements: Element[];
  /** Soportes: map<nodeIdx, [UX,UY,UZ,RX,RY,RZ]> */
  supports: Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>;
  /** Cargas estáticas iniciales (opcional): map<nodeIdx, [Fx,Fy,Fz,Mx,My,Mz]> */
  loads?: Map<number, [number, number, number, number, number, number]>;
  /** Sección por elemento */
  sectionByElement: Array<{
    A: number; Iy: number; Iz: number; J: number;
    E: number; G: number; rho: number;
    /** Momento polar I0 de la masa torsional (Paz Tabla 13.1); si falta, el motor usa Iy + Iz */
    I0?: number;
    label: string;
    e2kName: string;
    e2kShape: string;
    e2kD: number; e2kB: number;
    e2kTF?: number; e2kTW?: number;
  }>;
  /** Material name para el e2k */
  materialName: string;
  materialType: "Steel" | "Concrete";
  /** Euler-Bernoulli (As = −1): el libro no cuenta la deformación por cortante */
  euler?: boolean;
}

export function buildSpaceFrameModel(p: SpaceFrameParams, states: BuildStates) {
  const elasticities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const areas = new Map<number, number>();
  const Iy_map = new Map<number, number>();
  const Iz_map = new Map<number, number>();
  const J_map = new Map<number, number>();
  const shearAreasY = new Map<number, number>();
  const shearAreasZ = new Map<number, number>();
  const densities = new Map<number, number>();
  const sectionLabels = new Map<number, string>();
  const materialTypes = new Map<number, string>();
  const sectionInfo = new Map<number, any>();
  const polarMomentsOfInertia = new Map<number, number>();

  for (let e = 0; e < p.elements.length; e++) {
    const s = p.sectionByElement[e];
    if (s.I0 !== undefined) polarMomentsOfInertia.set(e, s.I0);
    elasticities.set(e, s.E);
    shearModuli.set(e, s.G);
    areas.set(e, s.A);
    Iy_map.set(e, s.Iy);
    Iz_map.set(e, s.Iz);
    J_map.set(e, s.J);
    shearAreasY.set(e, p.euler ? -1 : s.A * 0.85);
    shearAreasZ.set(e, p.euler ? -1 : s.A * 0.85);
    densities.set(e, s.rho);
    sectionLabels.set(e, s.label);
    materialTypes.set(e, p.materialType === "Steel" ? "Acero" : "Hormigón");
    sectionInfo.set(e, {
      name: s.e2kName, shape: s.e2kShape,
      D: s.e2kD, B: s.e2kB, TF: s.e2kTF, TW: s.e2kTW,
      material: p.materialName,
    });
  }

  const loads = p.loads ?? new Map<number, [number, number, number, number, number, number]>();

  states.nodes.val = p.nodes;
  states.elements.val = p.elements;
  states.nodeInputs.val = { supports: p.supports, loads };
  states.elementInputs.val = {
    elasticities, shearModuli, areas,
    momentsOfInertiaZ: Iy_map,
    momentsOfInertiaY: Iz_map,
    torsionalConstants: J_map,
    shearAreasY, shearAreasZ, densities, polarMomentsOfInertia,
    sectionLabels, materialTypes, sectionInfo,
  } as any;

  try {
    states.deformOutputs.val = deform(
      p.nodes, p.elements, { supports: p.supports, loads }, states.elementInputs.val,
    );
    states.analyzeOutputs.val = analyze(
      p.nodes, p.elements,
      states.elementInputs.val,
      states.deformOutputs.val,
    );
  } catch (e: any) {
    console.error("[SpaceFrame] solver error:", e.message);
  }
  states.objects3D.val = [];
}

/**
 * Genera e2k para un space frame arbitrario.
 * Ojo: ETABS modela como edificio multi-piso, así que asignamos cada nodo
 * a un STORY según su elevación Z y usamos POINTASSIGN.
 */
export function generateSpaceFrameE2k(p: SpaceFrameParams, title: string): { filename: string; content: string } {
  const lines: string[] = [];
  lines.push(...emitE2kHeader({ units: "TONF M", title1: title, title2: "Paz benchmark" }));

  // Stories desde elevaciones únicas Z
  const zSet = new Set<number>();
  for (const n of p.nodes) zSet.add(parseFloat(n[2].toFixed(6)));
  const sortedZ = [...zSet].sort((a, b) => a - b);
  const storyNames: string[] = [];
  const zToStory = new Map<number, string>();
  for (let i = 0; i < sortedZ.length; i++) {
    const name = i === 0 ? "Base" : `Story${i}`;
    storyNames.push(name);
    zToStory.set(sortedZ[i], name);
  }

  lines.push(`$ STORIES - IN SEQUENCE FROM TOP`);
  for (let i = sortedZ.length - 1; i >= 1; i--) {
    const h = sortedZ[i] - sortedZ[i - 1];
    const isMaster = i === sortedZ.length - 1;
    const ref = isMaster ? `MASTERSTORY "Yes"` : `SIMILARTO "${storyNames[sortedZ.length - 1]}"`;
    lines.push(`  STORY "${storyNames[i]}"  HEIGHT ${fmtNum(h)} ${ref}  `);
  }
  lines.push(`  STORY "Base"  ELEV ${fmtNum(sortedZ[0])} `);
  lines.push(``);

  lines.push(`$ GRIDS`);
  lines.push(`  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 `);
  lines.push(``);

  lines.push(`$ DIAPHRAGM NAMES`);
  lines.push(`  DIAPHRAGM "D1"    TYPE RIGID`);
  lines.push(``);

  // Material
  lines.push(`$ MATERIAL PROPERTIES`);
  const ev = p.sectionByElement[0];
  if (p.materialType === "Steel") {
    lines.push(...emitSteelMaterial(p.materialName, ev.E / 9.80665, ev.rho * 9.80665 / 9.80665));
  } else {
    lines.push(...emitConcreteMaterial(p.materialName, ev.E / 9.80665, ev.rho * 9.80665 / 9.80665));
  }
  lines.push(``);

  // Frame sections — únicas por nombre
  const seen = new Set<string>();
  lines.push(`$ FRAME SECTIONS`);
  for (const s of p.sectionByElement) {
    if (seen.has(s.e2kName)) continue;
    seen.add(s.e2kName);
    lines.push(...emitFrameSection({
      name: s.e2kName,
      material: p.materialName,
      shape: s.e2kShape,
      D: s.e2kD, B: s.e2kB, TF: s.e2kTF, TW: s.e2kTW,
    }));
  }
  lines.push(``);

  // Points (X, Y plan; Z se mapea a STORY)
  // Algunos nodos pueden compartir la misma planta XY, los agrupamos
  const xyToPoint = new Map<string, string>();
  let ptIdx = 0;
  for (const n of p.nodes) {
    const key = `${n[0].toFixed(6)},${n[1].toFixed(6)}`;
    if (!xyToPoint.has(key)) {
      ptIdx++;
      xyToPoint.set(key, `${ptIdx}`);
    }
  }
  lines.push(`$ POINT COORDINATES`);
  for (const [key, pt] of xyToPoint) {
    const [x, y] = key.split(",").map(parseFloat);
    lines.push(`  POINT "${pt}"  ${fmtNum(x)} ${fmtNum(y)} `);
  }
  lines.push(``);

  function nodeToPS(idx: number): { pt: string; story: string } {
    const n = p.nodes[idx];
    const key = `${n[0].toFixed(6)},${n[1].toFixed(6)}`;
    const z = parseFloat(n[2].toFixed(6));
    return { pt: xyToPoint.get(key) || "1", story: zToStory.get(z) || "Base" };
  }

  // LINE CONNECTIVITIES
  lines.push(`$ LINE CONNECTIVITIES`);
  for (let i = 0; i < p.elements.length; i++) {
    const el = p.elements[i];
    if (el.length !== 2) continue;
    const a = el[0], b = el[1];
    const psA = nodeToPS(a), psB = nodeToPS(b);
    if (psA.story === psB.story) {
      // BEAM horizontal
      lines.push(`  LINE  "E${i + 1}"  BEAM  "${psA.pt}"  "${psB.pt}"  0`);
    } else if (psA.pt === psB.pt) {
      // COLUMN vertical (mismo punto en planta)
      lines.push(`  LINE  "E${i + 1}"  COLUMN  "${psA.pt}"  "${psA.pt}"  1`);
    } else {
      // BRACE inclinado
      lines.push(`  LINE  "E${i + 1}"  BRACE  "${psA.pt}"  "${psB.pt}"  1`);
    }
  }
  lines.push(``);

  // POINT ASSIGNS
  lines.push(`$ POINT ASSIGNS`);
  for (const [nodeIdx, sup] of p.supports) {
    const dofs: string[] = [];
    if (sup[0]) dofs.push("UX"); if (sup[1]) dofs.push("UY"); if (sup[2]) dofs.push("UZ");
    if (sup[3]) dofs.push("RX"); if (sup[4]) dofs.push("RY"); if (sup[5]) dofs.push("RZ");
    if (dofs.length > 0) {
      const ps = nodeToPS(nodeIdx);
      lines.push(`  POINTASSIGN  "${ps.pt}"  "${ps.story}"  RESTRAINT "${dofs.join(" ")}"  DIAPH "DISCONNECTED"  `);
    }
  }
  lines.push(``);

  // LINE ASSIGNS
  lines.push(`$ LINE ASSIGNS`);
  for (let i = 0; i < p.elements.length; i++) {
    const sec = p.sectionByElement[i];
    const el = p.elements[i];
    if (!el || el.length !== 2) continue;
    const psA = nodeToPS(el[0]), psB = nodeToPS(el[1]);
    const story = psA.story === "Base" ? psB.story : psA.story;
    lines.push(`  LINEASSIGN  "E${i + 1}"  "${story}"  SECTION "${sec.e2kName}"  RIGIDZONE 0.5 MINNUMSTA 3 AUTOMESH "YES"  MESHATINTERSECTIONS "YES"  `);
  }
  lines.push(``);

  // LOAD PATTERNS + cargas si hay
  lines.push(`$ LOAD PATTERNS`);
  lines.push(`  LOADPATTERN "DEAD"  TYPE  "Dead"  SELFWEIGHT  1`);
  if (p.loads && p.loads.size > 0) {
    lines.push(`  LOADPATTERN "USER"  TYPE  "Other"  SELFWEIGHT  0`);
  }
  lines.push(``);

  if (p.loads && p.loads.size > 0) {
    lines.push(`$ POINT OBJECT LOADS`);
    for (const [nodeIdx, l] of p.loads) {
      const ps = nodeToPS(nodeIdx);
      const fx_tonf = l[0] / 9.80665, fy_tonf = l[1] / 9.80665, fz_tonf = l[2] / 9.80665;
      lines.push(`  POINTLOAD  "${ps.pt}"  "${ps.story}"  TYPE "FORCE"  LC "USER"  FX ${fmtNum(fx_tonf)} FY ${fmtNum(fy_tonf)} FZ ${fmtNum(fz_tonf)}`);
    }
    lines.push(``);
  }

  lines.push(`$ ANALYSIS OPTIONS`);
  lines.push(`  ACTIVEDOF  "UX UY UZ RX RY RZ"  `);
  lines.push(``);

  lines.push(`$ MASS SOURCE`);
  lines.push(`  MASSSOURCE  "MsSrc1"  INCLUDEELEMENTS "Yes"  INCLUDEADDEDMASS "No"  INCLUDELOADS "No"  LUMPATSTORIES "Yes"  ISDEFAULT "Yes"  `);
  lines.push(``);

  lines.push(`$ LOAD CASES`);
  lines.push(`  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `);
  lines.push(`  LOADCASE "Modal"  MAXMODES  6 MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `);
  lines.push(`  LOADCASE "Dead"  TYPE  "Linear Static"  INITCOND  "PRESET"  `);
  lines.push(`  LOADCASE "Dead"  LOADPAT  "DEAD"  SF  1 `);
  if (p.loads && p.loads.size > 0) {
    lines.push(`  LOADCASE "User"  TYPE  "Linear Static"  INITCOND  "PRESET"  `);
    lines.push(`  LOADCASE "User"  LOADPAT  "USER"  SF  1 `);
  }
  lines.push(``);

  lines.push(...emitE2kFooter());

  return {
    filename: `Paz_${title.replace(/\W+/g, "_")}.e2k`,
    content: lines.join("\r\n"),
  };
}

// ════════════════════════════════════════════════════════════════════
// HELPER de gravedad/conversiones a kN
// ════════════════════════════════════════════════════════════════════
export const PAZ_UTILS = {
  /** lb·s²/in² (Paz mass distribution) → kg/m (= ρ·A en SI) */
  mbar_lbs2in2_to_kgm: (mbar: number) => mbar * 175.13 * (1 / IN_TO_M),
  /** ksi → kN/m² */
  ksi_to_kNm2: (ksi: number) => ksi * 6894.76,
  /** psi → kN/m² */
  psi_to_kNm2: (psi: number) => psi * 6.89476,
  /** in → m */
  in_to_m: (inch: number) => inch * IN_TO_M,
  /** in² → m² */
  in2_to_m2: (in2: number) => in2 * IN_TO_M * IN_TO_M,
  /** in⁴ → m⁴ */
  in4_to_m4: (in4: number) => in4 * Math.pow(IN_TO_M, 4),
  /** lb → kN */
  lb_to_kN: (lb: number) => lb * 0.00444822,
  /** lb·s²/in (mass) → kg */
  lbs2in_to_kg: (m: number) => m * 175.127,
  /** lb/in (stiffness) → kN/m */
  lbin_to_kNm: (k: number) => k * 0.175127,
};
