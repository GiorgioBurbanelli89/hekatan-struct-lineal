/**
 * 🏁 Viga doblemente empotrada (Fixed-Fixed Beam) — Shared model + ETABS .e2k
 *
 * Caso CANÓNICO de validación FRAME para vigas:
 *   • Viga horizontal de luz L, ambos extremos empotrados (UX UY UZ RX RY RZ).
 *   • Carga uniforme q hacia abajo (gravedad / sobrecarga).
 *   • Solución analítica Euler-Bernoulli:
 *       u_max(centro) = q · L⁴ / (384 · E · I)
 *       M_empotramiento = q · L² / 12
 *       M_centro        = q · L² / 24
 *       V_apoyo         = q · L / 2
 *
 * Materiales soportados:
 *   • Acero (perfil W I/Wide Flange — ej. W360x122 ≈ ISWB / IPE genérico)
 *   • Hormigón (sección rectangular sólida tipo viga 30×60cm)
 *
 * Convención: viga horizontal en eje X, deformación en −Z (gravedad).
 * Empotramiento total en ambos extremos (Story0 Base).
 */
import { deform, analyze, type Node, type Element } from "hekatan-fem";
import type { BuildStates } from "../workspace/exampleRegistry";

export type BeamMaterialKey = 0 | 1;  // 0=Acero (perfil W), 1=Hormigón (rect)

export interface BeamParams {
  L: number;          // luz viga (m)
  // Sección acero W (I/Wide Flange)
  D_w: number;        // altura total D del perfil (m)
  B_w: number;        // ancho del ala B (m)
  TF_w: number;       // espesor ala TF (m)
  TW_w: number;       // espesor alma TW (m)
  // Sección hormigón rectangular
  B_c: number;        // ancho b (m)
  H_c: number;        // canto h (m)
  // Materiales
  E_s: number;        // E acero (kN/m²)
  E_c: number;        // E concreto (kN/m²)
  gamma_s: number;    // γ_s acero (kN/m³)
  gamma_c: number;    // γ_c concreto (kN/m³)
  // Cargas
  q_extra: number;    // carga superpuesta uniforme (kN/m, además del peso propio)
  // Property modifiers
  A_mod: number; As2_mod: number; As3_mod: number;
  J_mod: number; I22_mod: number; I33_mod: number;
  // Mesh
  nSegments: number;
}

export interface BeamSection {
  matKey: BeamMaterialKey;
  A: number;          // m²
  Iy: number;         // strong axis (flexión vertical) m⁴
  Iz: number;         // weak axis (flexión lateral)  m⁴
  J: number;          // torsión Saint-Venant m⁴
  E: number;          // kN/m²
  G: number;          // kN/m²
  q_self: number;     // peso propio uniforme kN/m
  sectionLabel: string;
  materialType: string;
  sectionInfoObj: {
    name: string; shape: string;
    D?: number; B?: number; TF?: number; TW?: number;
    material: string;
  };
}

export function computeBeamSection(p: BeamParams, matKey: BeamMaterialKey): BeamSection {
  if (matKey === 0) {
    // ─── ACERO: perfil W I/Wide Flange ───
    // I_strong  = 2 · [B·TF · (D/2 - TF/2)²] + (D-2TF)·TW³/12 + 2·B·TF³/12
    // Aproximación AISC: Iy_strong (flexión vertical) ≈ patines+alma
    const D = p.D_w, B = p.B_w, TF = p.TF_w, TW = p.TW_w;
    const A = 2 * B * TF + (D - 2 * TF) * TW;
    // Strong axis bending (flexión sobre eje horizontal y, local y)
    const I_strong = 2 * (B * TF * Math.pow(D / 2 - TF / 2, 2)) +
                     (D - 2 * TF) * Math.pow(TW, 3) / 12 +
                     2 * B * Math.pow(TF, 3) / 12;
    // Aprox. simple para weak axis: principalmente patines
    const I_weak = 2 * (TF * Math.pow(B, 3) / 12) +
                   (D - 2 * TF) * Math.pow(TW, 3) / 12;
    // Saint-Venant J ≈ (1/3) · Σ b·t³  (perfiles I delgados)
    const J = (1 / 3) * (2 * B * Math.pow(TF, 3) + (D - 2 * TF) * Math.pow(TW, 3));
    const E_col = p.E_s, G_col = E_col / 2.6;
    const q_self = p.gamma_s * A;
    const nameEtabs = `W${(D * 1000).toFixed(0)}x${(p.gamma_s * A).toFixed(0)}`;  // W{D_mm}x{kg/m approx}
    return {
      matKey, A, Iy: I_strong, Iz: I_weak, J, E: E_col, G: G_col, q_self,
      sectionLabel: `W ${(D * 1000).toFixed(0)}×${(B * 1000).toFixed(0)}×${(TF * 1000).toFixed(0)}/${(TW * 1000).toFixed(0)}mm`,
      materialType: "Acero",
      sectionInfoObj: {
        name: nameEtabs, shape: "Steel I/Wide Flange",
        D, B, TF, TW,
        material: "A992Fy50",
      },
    };
  } else {
    // ─── HORMIGÓN: viga rectangular ───
    const b = p.B_c, h = p.H_c;
    const A = b * h;
    // Iy_strong = b·h³/12 (flexión vertical, eje débil del rectángulo cuando b<h)
    const Iy_strong = b * Math.pow(h, 3) / 12;
    const Iz_weak  = h * Math.pow(b, 3) / 12;
    // Saint-Venant de un rectangulo, con LA formula del resto del arbol
    // (Timoshenko & Goodier, la misma de `shared/materials.ts:rectSection` y
    // `shared/cadSections.ts`):
    //
    //     J = beta * a * c^3     con a = lado LARGO, c = lado CORTO
    //     beta = (1/3)*(1 - 0.63*(c/a)*(1 - (c/a)^4/12))
    //
    // Da 0.1408 para el cuadrado y 0.2289 para 2:1, o sea la tabla de Roark.
    //
    // ⚠️ Aqui habia OTRA formula, y estaba mal dos veces:
    //   1. `beta * min(h,b) * max(h,b)^3` — los lados CAMBIADOS. Para una viga
    //      0.30 x 0.60 daba J = 1.4839e-2 m^4 en vez de 3.1752e-3: **x4.67**.
    //   2. la tabla de beta corrida una fila: para un CUADRADO devolvia 0.196
    //      en vez de 0.141 (**+39 %**).
    // Hoy no lo nota nadie porque su unico consumidor (`benchmark-steel-beam`)
    // va por la rama de acero y ademas no esta ni registrado ni compilado. Es
    // una trampa cargada, no un bug vivo.
    const aLargo = Math.max(h, b), cCorto = Math.min(h, b);
    const rc = cCorto / aLargo;
    const beta = (1 / 3) * (1 - 0.63 * rc * (1 - Math.pow(rc, 4) / 12));
    const J = beta * aLargo * Math.pow(cCorto, 3);
    const E_col = p.E_c, G_col = E_col / 2.4;
    const q_self = p.gamma_c * A;
    const nameEtabs = `B${(b * 1000).toFixed(0)}x${(h * 1000).toFixed(0)}`;
    return {
      matKey, A, Iy: Iy_strong, Iz: Iz_weak, J, E: E_col, G: G_col, q_self,
      sectionLabel: `Beam ${(b * 100).toFixed(0)}×${(h * 100).toFixed(0)}cm`,
      materialType: "Hormigón",
      sectionInfoObj: {
        name: nameEtabs, shape: "Concrete Rectangular",
        D: h, B: b,
        material: "concrete",
      },
    };
  }
}

export function buildFixedFixedBeamModel(
  p: BeamParams,
  states: BuildStates,
  matKey: BeamMaterialKey,
): { sec: BeamSection } {
  const sec = computeBeamSection(p, matKey);
  const L = p.L;
  const nSeg = Math.max(2, Math.round(p.nSegments));
  const dx = L / nSeg;

  // Nodos: viga horizontal a lo largo de eje X, en y=z=0
  const nodes: Node[] = [];
  for (let i = 0; i <= nSeg; i++) nodes.push([i * dx, 0, 0]);

  const elements: Element[] = [];
  for (let i = 0; i < nSeg; i++) elements.push([i, i + 1]);

  // Empotramiento en ambos extremos
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  supports.set(0, [true, true, true, true, true, true]);
  supports.set(nSeg, [true, true, true, true, true, true]);

  // Carga total uniforme: peso propio + sobrecarga
  const q_total = sec.q_self + p.q_extra;

  // Reparto nodal equivalente: nodos interiores reciben q·dx, extremos q·dx/2
  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let i = 0; i <= nSeg; i++) {
    const isEnd = (i === 0 || i === nSeg);
    const fz = -q_total * dx * (isEnd ? 0.5 : 1.0);
    loads.set(i, [0, 0, fz, 0, 0, 0]);
  }

  const A_mod = p.A_mod ?? 1.0;
  const As2_mod = p.As2_mod ?? 1.0;
  const As3_mod = p.As3_mod ?? 1.0;
  const J_mod = p.J_mod ?? 1.0;
  const I22_mod = p.I22_mod ?? 1.0;
  const I33_mod = p.I33_mod ?? 1.0;

  const g = 9.80665;
  const rho_eq = sec.q_self / (sec.A * g);
  const As_eq = (5 / 6) * sec.A;

  const elasticities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const areas = new Map<number, number>();
  const Iz_map = new Map<number, number>();
  const Iy_map = new Map<number, number>();
  const J_map = new Map<number, number>();
  const shearAreasY = new Map<number, number>();
  const shearAreasZ = new Map<number, number>();
  const densities = new Map<number, number>();
  const sectionLabels = new Map<number, string>();
  const materialTypes = new Map<number, string>();
  const sectionInfo = new Map<number, any>();

  for (let e = 0; e < elements.length; e++) {
    elasticities.set(e, sec.E);
    shearModuli.set(e, sec.G);
    areas.set(e, sec.A * A_mod);
    Iy_map.set(e, sec.Iy * I33_mod);   // strong axis
    Iz_map.set(e, sec.Iz * I22_mod);   // weak axis
    J_map.set(e, sec.J * J_mod);
    densities.set(e, rho_eq);
    if (As2_mod < 1e-3) shearAreasY.set(e, -1);
    else                shearAreasY.set(e, As_eq * As2_mod);
    if (As3_mod < 1e-3) shearAreasZ.set(e, -1);
    else                shearAreasZ.set(e, As_eq * As3_mod);
    sectionLabels.set(e, sec.sectionLabel);
    materialTypes.set(e, sec.materialType);
    sectionInfo.set(e, sec.sectionInfoObj);
  }

  states.nodes.val = nodes;
  states.elements.val = elements;
  states.nodeInputs.val = { supports, loads };
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
    console.error(`[Beam ${sec.materialType}] solver error:`, e.message);
  }
  states.objects3D.val = [];

  return { sec };
}

// ════════════════════════════════════════════════════════════════════
// ETABS .e2k EXPORTER — viga doblemente empotrada (Fixed-Fixed Beam)
// ════════════════════════════════════════════════════════════════════

const KN_TO_TONF = 1 / 9.80665;

function fmtNum(v: number, prec: number = 6): string {
  if (Math.abs(v) < 1e-12) return "0";
  const abs = Math.abs(v);
  if (abs >= 1e6 || abs < 1e-3) return v.toExponential(6).replace(/e\+?/, "E+").replace(/E\+?-/, "E-");
  return parseFloat(v.toFixed(prec)).toString();
}

export function generateBeamE2k(
  p: BeamParams,
  matKey: BeamMaterialKey,
): { filename: string; content: string } {
  const sec = computeBeamSection(p, matKey);
  const L = p.L;

  const E_steel_tonf = p.E_s * KN_TO_TONF;
  const E_conc_tonf  = p.E_c * KN_TO_TONF;
  const W_steel_tonf = p.gamma_s * KN_TO_TONF;
  const W_conc_tonf  = p.gamma_c * KN_TO_TONF;
  const q_extra_tonf = p.q_extra * KN_TO_TONF;

  const lines: string[] = [];
  const now = new Date();
  const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  lines.push(`$ File FixedFixedBeam_${sec.sectionInfoObj.name}.e2k saved ${dateStr} ${timeStr}`);
  lines.push(``);
  lines.push(`$ PROGRAM INFORMATION`);
  lines.push(`  PROGRAM  "ETABS"  VERSION "19.1.0"  `);
  lines.push(``);
  lines.push(`$ CONTROLS`);
  lines.push(`  UNITS  "TONF"  "M"  "C"  `);
  lines.push(`  TITLE1  "Hekatan Struct Lineal — Fixed-Fixed Beam ${sec.materialType}"  `);
  lines.push(`  TITLE2  "Validacion vs ETABS"  `);
  lines.push(``);

  // STORIES — beam horizontal: 2 levels separados 0.001m (truco para que ETABS
  // genere la viga como BEAM en Story1, con apoyos en Base)
  // Mejor enfoque: viga horizontal a una sola elevación = todo en Story1
  // Base elevation = -0.001 (dummy), Story1 = 0.0 (donde está la viga).
  lines.push(`$ STORIES - IN SEQUENCE FROM TOP`);
  lines.push(`  STORY "Story1"  HEIGHT 0.001 MASTERSTORY "Yes"  `);
  lines.push(`  STORY "Base"  ELEV -0.001 `);
  lines.push(``);

  lines.push(`$ GRIDS`);
  lines.push(`  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 `);
  lines.push(``);

  lines.push(`$ DIAPHRAGM NAMES`);
  lines.push(`  DIAPHRAGM "D1"    TYPE RIGID`);
  lines.push(``);

  // ── MATERIALES ─────────────────────────────────────────────────────
  lines.push(`$ MATERIAL PROPERTIES`);
  if (matKey === 0) {
    lines.push(`  MATERIAL  "A992Fy50"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME ${fmtNum(W_steel_tonf)}`);
    lines.push(`  MATERIAL  "A992Fy50"    SYMTYPE "Isotropic"  E ${fmtNum(E_steel_tonf)}  U 0.3  A 1.16999999590917E-05`);
    lines.push(`  MATERIAL  "A992Fy50"  FY 35153.48  FU 45699.53 FYE 38668.83  FUE 50269.48`);
  } else {
    lines.push(`  MATERIAL  "concrete"    TYPE "Concrete"    WEIGHTPERVOLUME ${fmtNum(W_conc_tonf)}`);
    lines.push(`  MATERIAL  "concrete"    SYMTYPE "Isotropic"  E ${fmtNum(E_conc_tonf)}  U 0.2  A 9.99999974737875E-06`);
    lines.push(`  MATERIAL  "concrete"    FC 2855.205`);
  }
  lines.push(``);

  // ── FRAME SECTIONS ─────────────────────────────────────────────────
  lines.push(`$ FRAME SECTIONS`);
  const s = sec.sectionInfoObj;
  let secLine = `  FRAMESECTION  "${s.name}"  MATERIAL "${s.material}"  SHAPE "${s.shape}"`;
  if (s.D !== undefined) secLine += `  D ${fmtNum(s.D)}`;
  if (s.B !== undefined) secLine += ` B ${fmtNum(s.B)}`;
  if (s.TF !== undefined) secLine += ` TF ${fmtNum(s.TF)}`;
  if (s.TW !== undefined) secLine += ` TW ${fmtNum(s.TW)}`;
  lines.push(secLine);

  const mods: string[] = [];
  if (Math.abs(p.A_mod - 1) > 1e-6) mods.push(`AREAMODIFIER ${fmtNum(p.A_mod)}`);
  if (Math.abs(p.As2_mod - 1) > 1e-6) mods.push(`AS2MODIFIER ${fmtNum(p.As2_mod)}`);
  if (Math.abs(p.As3_mod - 1) > 1e-6) mods.push(`AS3MODIFIER ${fmtNum(p.As3_mod)}`);
  if (Math.abs(p.J_mod - 1) > 1e-6) mods.push(`JMODIFIER ${fmtNum(p.J_mod)}`);
  if (Math.abs(p.I22_mod - 1) > 1e-6) mods.push(`I22MODIFIER ${fmtNum(p.I22_mod)}`);
  if (Math.abs(p.I33_mod - 1) > 1e-6) mods.push(`I33MODIFIER ${fmtNum(p.I33_mod)}`);
  if (mods.length > 0) lines.push(`  FRAMESECTION  "${s.name}"  ${mods.join("  ")}  `);
  lines.push(``);

  // ── POINT COORDINATES — viga horizontal: 2 puntos extremos ────────
  lines.push(`$ POINT COORDINATES`);
  lines.push(`  POINT "1"  0 0 `);
  lines.push(`  POINT "2"  ${fmtNum(L)} 0 `);
  lines.push(``);

  // ── LINE CONNECTIVITIES — BEAM horizontal en Story1 ───────────────
  lines.push(`$ LINE CONNECTIVITIES`);
  lines.push(`  LINE  "B1"  BEAM  "1"  "2"  0`);
  lines.push(``);

  // ── POINT ASSIGNS — empotramiento total en ambos extremos ─────────
  lines.push(`$ POINT ASSIGNS`);
  lines.push(`  POINTASSIGN  "1"  "Story1"  RESTRAINT "UX UY UZ RX RY RZ"  DIAPH "DISCONNECTED"  `);
  lines.push(`  POINTASSIGN  "2"  "Story1"  RESTRAINT "UX UY UZ RX RY RZ"  DIAPH "DISCONNECTED"  `);
  lines.push(``);

  // ── LINE ASSIGNS ──────────────────────────────────────────────────
  lines.push(`$ LINE ASSIGNS`);
  lines.push(`  LINEASSIGN  "B1"  "Story1"  SECTION "${s.name}"  RIGIDZONE 0.5 MINNUMSTA ${Math.max(2, p.nSegments)} AUTOMESH "YES"  MESHATINTERSECTIONS "YES"  `);
  lines.push(``);

  // ── LOAD PATTERNS ─────────────────────────────────────────────────
  lines.push(`$ LOAD PATTERNS`);
  lines.push(`  LOADPATTERN "DEAD"  TYPE  "Dead"  SELFWEIGHT  1`);
  if (Math.abs(p.q_extra) > 1e-9) {
    lines.push(`  LOADPATTERN "LIVE"  TYPE  "Live"  SELFWEIGHT  0`);
  }
  lines.push(``);

  // ── FRAME OBJECT LOADS — sobrecarga uniforme ──────────────────────
  if (Math.abs(p.q_extra) > 1e-9) {
    lines.push(`$ FRAME OBJECT LOADS`);
    lines.push(`  LINELOAD  "B1"  "Story1"  TYPE "UNIFLOADSET"  DIR "GRAVITY"  LC "LIVE"  FSTART ${fmtNum(q_extra_tonf)} FEND ${fmtNum(q_extra_tonf)}`);
    lines.push(``);
  }

  lines.push(`$ ANALYSIS OPTIONS`);
  lines.push(`  ACTIVEDOF  "UX UY UZ RX RY RZ"  `);
  lines.push(``);

  lines.push(`$ MASS SOURCE`);
  lines.push(`  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "No"    INCLUDEADDEDMASS "No"    INCLUDELOADS "Yes"    LUMPATSTORIES "Yes"    ISDEFAULT "Yes"  `);
  lines.push(`  MASSSOURCELOAD  "MsSrc1"  "DEAD"  1 `);
  lines.push(``);

  lines.push(`$ LOAD CASES`);
  lines.push(`  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  `);
  lines.push(`  LOADCASE "Modal"  MAXMODES  3 MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `);
  lines.push(`  LOADCASE "Dead"  TYPE  "Linear Static"  INITCOND  "PRESET"  `);
  lines.push(`  LOADCASE "Dead"  LOADPAT  "DEAD"  SF  1 `);
  if (Math.abs(p.q_extra) > 1e-9) {
    lines.push(`  LOADCASE "Live"  TYPE  "Linear Static"  INITCOND  "PRESET"  `);
    lines.push(`  LOADCASE "Live"  LOADPAT  "LIVE"  SF  1 `);
  }
  lines.push(``);

  lines.push(`  END`);
  lines.push(`$ END OF MODEL FILE`);

  return {
    filename: `FixedFixedBeam_${sec.sectionInfoObj.name}.e2k`,
    content: lines.join("\r\n"),
  };
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportBeamE2k(p: BeamParams, matKey: BeamMaterialKey): void {
  const { filename, content } = generateBeamE2k(p, matKey);
  downloadTextFile(filename, content);
  console.log(`[E2K Export] ${filename} (${content.length} bytes) — abrir en ETABS para validar`);
}
