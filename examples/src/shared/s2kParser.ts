/**
 * SAP2000 .s2k File Parser
 * Supports BOTH formats:
 *   - Legacy (v6-v14): SYSTEM/JOINT/SHELL keyword blocks
 *   - Modern (v15+): TABLE: "..." format with key=value pairs
 */
import type { Node, Element, NodeInputs, ElementInputs, SectionShape } from "hekatan-fem";
import { cargaBarraConsistente, acumularCargaBarra } from "./cargaBarraConsistente";

/** Cargas que el formato de tablas trae y que hasta el 24-sep-2026 no se leian (ver buildModel). */
interface CargasTabla {
  /** FRAME LOADS - DISTRIBUTED que NO son uniformes de extremo a extremo en GLOBAL X/Y/Z. */
  barras: { frame: string; dir: number[]; a: number; b: number; rel: boolean; fa: number; fb: number }[];
  /** AREA LOADS - UNIFORM: q por unidad de area en la direccion `dir` (global) o normal (dir null). */
  areas: { area: string; dir: number[] | null; q: number }[];
  /** SelfWtMult (el mayor de los patrones: se suman todos los patrones como el e2kParser). */
  selfWtMult: number;
  /** MassMod / WeightMod de AREA STIFFNESS MODIFIERS, por area. */
  areaMW: Map<string, [number, number]>;
  /** FRAME AUTO MESH ASSIGNMENTS con AutoMesh=Yes y AtJoints=Yes: SAP parte la barra en los nudos que caen sobre ella. */
  autoMeshJoints?: Set<string>;
}

export interface S2kModel {
  units: { force: string; length: string };
  dof: string;
  materials: Map<string, { E: number; nu: number; G: number; density?: number; fy?: number }>;
  frameSections: Map<string, { material: string; shape: string; D: number; B: number; TF: number; TW: number; A: number; Iz: number; Iy: number; J: number; As2?: number; As3?: number }>;
  shellSections: Map<string, { material: string; type: string; thickness: number }>;
  nodes: Node[];
  nodeNames: string[];
  nodeNameToIdx: Map<string, number>;
  elements: Element[];
  elementNames: string[];
  elementSections: Map<number, string>;
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  sectionShapes: Map<number, SectionShape>;
  info: { nNodes: number; nFrames: number; nShells: number; title: string };
}

function parseNum(s: string | undefined): number {
  if (!s) return 0;
  return parseFloat(s) || 0;
}

/** Parse key=value pairs from a line, handling quoted values */
function parseKV(line: string): Map<string, string> {
  const map = new Map<string, string>();
  // Match key=value or key="value with spaces"
  const re = /(\w+)\s*=\s*(?:"([^"]*?)"|(\S+))/g;
  let m;
  while ((m = re.exec(line)) !== null) {
    map.set(m[1], m[2] !== undefined ? m[2] : m[3]);
  }
  return map;
}

export function parseS2k(text: string): S2kModel {
  const rawLines = text.split(/\r?\n/);

  // Detect format: TABLE format has 'TABLE:  "' lines
  const isTableFormat = rawLines.some(l => l.trim().startsWith('TABLE:'));

  if (isTableFormat) return parseTableFormat(rawLines);
  return parseLegacyFormat(rawLines);
}

// ═══════════════════════════════════════════
// TABLE FORMAT (v15+)
// ═══════════════════════════════════════════
function parseTableFormat(rawLines: string[]): S2kModel {
  // Join continuation lines (ending with _)
  const lines: string[] = [];
  let buffer = "";
  for (const raw of rawLines) {
    const trimmed = raw.trimEnd();
    if (trimmed.endsWith("_")) {
      buffer += trimmed.slice(0, -1) + " ";
    } else {
      buffer += trimmed;
      lines.push(buffer);
      buffer = "";
    }
  }
  if (buffer) lines.push(buffer);

  const units = { force: "KN", length: "m" };
  let dof = "UX,UY,UZ,RX,RY,RZ";
  const materials = new Map<string, { E: number; nu: number; G: number; density?: number; fy?: number }>();
  const sdBox = new Map<string, { h: number; b: number; t: number; tf?: number; mat: string; D?: number }>();
  const sdFill = new Map<string, { mat: string }>();
  const frameSections = new Map<string, { material: string; shape: string; D: number; B: number; TF: number; TW: number; A: number; Iz: number; Iy: number; J: number }>();
  const shellSections = new Map<string, { material: string; type: string; thickness: number }>();
  const joints = new Map<string, [number, number, number]>();
  const frameConns: { name: string; j1: string; j2: string }[] = [];
  const shellConns: { name: string; joints: string[] }[] = [];
  const restraints = new Map<string, boolean[]>();
  const jointSprings = new Map<string, number[]>();   // JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED
  const frameSectionAssign = new Map<string, string>(); // frameName → secName
  const areaSectionAssign = new Map<string, string>(); // areaName → secName
  const loads: { joint: string; fx: number; fy: number; fz: number; mx: number; my: number; mz: number }[] = [];
  const offsets = new Map<string, [number, number, number]>();   // FRAME OFFSET ALONG LENGTH ASSIGNMENTS
  const angles = new Map<string, number>();                        // FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL
  const areaMods = new Map<string, number[]>();                    // AREA STIFFNESS MODIFIERS
  const frameLoadsRaw = new Map<string, [number, number, number]>(); // FRAME LOADS - DISTRIBUTED
  const solidConns: { name: string; joints: string[] }[] = [];       // CONNECTIVITY - SOLID (orden tensorial de CSI)
  const solidProps = new Map<string, { material: string; incomp: boolean }>();
  const solidAssign = new Map<string, string>();

  let currentTable = "";
  const cargasTabla: CargasTabla = { barras: [], areas: [], selfWtMult: 0, areaMW: new Map(), autoMeshJoints: new Set() };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(";") || trimmed.startsWith("File ")) continue;

    if (trimmed.startsWith('TABLE:')) {
      const match = trimmed.match(/TABLE:\s+"(.+?)"/);
      currentTable = match ? match[1].toUpperCase() : "";
      continue;
    }

    if (trimmed === "END TABLE DATA") { currentTable = ""; continue; }

    const kv = parseKV(trimmed);

    switch (currentTable) {
      case "PROGRAM CONTROL": {
        const cu = kv.get("CurrUnits");
        if (cu) {
          const parts = cu.split(",").map(s => s.trim());
          if (parts[0]) units.force = parts[0];
          if (parts[1]) units.length = parts[1];
        }
        break;
      }

      case "MATERIAL PROPERTIES 01 - GENERAL": {
        const name = kv.get("Material");
        if (name && !materials.has(name)) {
          materials.set(name, { E: 0, nu: 0, G: 0 });
        }
        break;
      }

      case "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES": {
        const name = kv.get("Material");
        if (name) {
          const mat = materials.get(name) || { E: 0, nu: 0, G: 0 };
          mat.E = parseNum(kv.get("E1"));
          mat.G = parseNum(kv.get("G12"));
          mat.nu = parseNum(kv.get("U12"));
          mat.density = parseNum(kv.get("UnitMass"));
          (mat as any).weight = parseNum(kv.get("UnitWeight"));   // peso propio (SelfWtMult)
          materials.set(name, mat);
        }
        break;
      }

      case "MATERIAL PROPERTIES 03A - STEEL DATA": {
        const name = kv.get("Material");
        if (name && materials.has(name)) {
          materials.get(name)!.fy = parseNum(kv.get("Fy"));
        }
        break;
      }

      case "FRAME SECTION PROPERTIES 01 - GENERAL": {
        const secName = kv.get("SectionName");
        if (secName) {
          frameSections.set(secName, {
            material: kv.get("Material") || "",
            shape: kv.get("Shape") || "Rectangular",
            D: parseNum(kv.get("t3")),
            B: parseNum(kv.get("t2")),
            TF: parseNum(kv.get("tf")),
            TW: parseNum(kv.get("tw")),
            // ala inferior del «I/Wide Flange» (SAP2000 la escribe siempre, igual a la superior si no difiere)
            T2B: parseNum(kv.get("t2b")),
            TFB: parseNum(kv.get("tfb")),
            // separación del «Double Angle» (t2 es el ancho TOTAL)
            DIS: parseNum(kv.get("dis")),
            A: parseNum(kv.get("Area")),
            Iz: parseNum(kv.get("I33")),
            Iy: parseNum(kv.get("I22")),
            J: parseNum(kv.get("TorsConst")),
            // AS2 -> V2 (con I33) = shearAreasZ · AS3 -> V3 (con I22) = shearAreasY,
            // el mismo criterio que el exportador. Sin esto el importado se
            // quedaba con 5/6·A (Timoshenko de defecto) y salia 2 % mas rigido.
            As2: parseNum(kv.get("AS2")),
            As3: parseNum(kv.get("AS3")),
            // modificadores de masa y peso de la seccion (defecto 1)
            MMod: kv.has("MMod") ? parseNum(kv.get("MMod")) : 1,
            WMod: kv.has("WMod") ? parseNum(kv.get("WMod")) : 1,
          } as any);
        }
        break;
      }

      case "SECTION DESIGNER PROPERTIES 09 - SHAPE BOX/TUBE": {
        // El CFT que escribe Hekatan (y cualquier SD con un tubo): la forma vuelve
        // como CFT para que al re-exportar salga otra vez Section Designer.
        const sn = kv.get("SectionName");
        if (sn) sdBox.set(sn, { h: parseNum(kv.get("Height")), b: parseNum(kv.get("Width")), t: parseNum(kv.get("WebThick")) || parseNum(kv.get("FlngThick")), tf: parseNum(kv.get("FlngThick")) || parseNum(kv.get("WebThick")), mat: kv.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 10 - SHAPE PIPE": {
        const sn = kv.get("SectionName");
        if (sn) sdBox.set(sn, { h: 0, b: 0, D: parseNum(kv.get("OuterDiam")), t: parseNum(kv.get("WallThick")), mat: kv.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 13 - SHAPE SOLID CIRCLE": {
        const sn = kv.get("SectionName");
        if (sn) sdFill.set(sn, { mat: kv.get("ShapeMat") || "" });
        break;
      }
      case "SECTION DESIGNER PROPERTIES 12 - SHAPE SOLID RECTANGLE": {
        const sn = kv.get("SectionName");
        if (sn) sdFill.set(sn, { mat: kv.get("ShapeMat") || "" });
        break;
      }

      case "AREA SECTION PROPERTIES": {
        const secName = kv.get("Section");
        if (secName) {
          shellSections.set(secName, {
            material: kv.get("Material") || "",
            type: kv.get("Type") || "Shell",
            thickness: parseNum(kv.get("Thickness")),
          });
        }
        break;
      }

      case "JOINT COORDINATES": {
        const name = kv.get("Joint");
        if (name) {
          const x = parseNum(kv.get("XorR"));
          const y = parseNum(kv.get("Y"));
          const z = parseNum(kv.get("Z"));
          joints.set(name, [x, y, z]);
        }
        break;
      }

      case "CONNECTIVITY - FRAME": {
        const name = kv.get("Frame");
        const j1 = kv.get("JointI");
        const j2 = kv.get("JointJ");
        if (name && j1 && j2) {
          frameConns.push({ name, j1, j2 });
        }
        break;
      }

      case "CONNECTIVITY - AREA": {
        const name = kv.get("Area");
        if (name) {
          const numJ = parseInt(kv.get("NumJoints") || "4");
          const jts: string[] = [];
          for (let j = 1; j <= numJ; j++) {
            const jv = kv.get(`Joint${j}`);
            if (jv) jts.push(jv);
          }
          if (jts.length >= 3) shellConns.push({ name, joints: jts });
        }
        break;
      }

      case "JOINT RESTRAINT ASSIGNMENTS": {
        const name = kv.get("Joint");
        if (name) {
          const r: boolean[] = [
            kv.get("U1")?.toLowerCase() === "yes",
            kv.get("U2")?.toLowerCase() === "yes",
            kv.get("U3")?.toLowerCase() === "yes",
            kv.get("R1")?.toLowerCase() === "yes",
            kv.get("R2")?.toLowerCase() === "yes",
            kv.get("R3")?.toLowerCase() === "yes",
          ];
          restraints.set(name, r);
        }
        break;
      }

      case "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED": {
        const name = kv.get("Joint");
        if (name) jointSprings.set(name, ["U1", "U2", "U3", "R1", "R2", "R3"].map(c => parseFloat(kv.get(c) ?? "0") || 0));
        break;
      }

      case "FRAME SECTION ASSIGNMENTS": {
        const frame = kv.get("Frame");
        const sec = kv.get("AnalSect");
        if (frame && sec) frameSectionAssign.set(frame, sec);
        break;
      }

      case "AREA SECTION ASSIGNMENTS": {
        const area = kv.get("Area");
        const sec = kv.get("Section");
        if (area && sec) areaSectionAssign.set(area, sec);
        break;
      }

      case "FRAME LOADS - DISTRIBUTED": {
        // Uniforme, en GLOBALES, de extremo a extremo (lo que escribe el exportador): va a
        // `frameLoads` como siempre. Lo DEMAS (trapecio FOverLA != FOverLB, parcial RelDist /
        // AbsDist, Dir=Gravity) hasta el 24-sep-2026 se leia como FOverLA en TODA la barra:
        // ahora va al vector consistente (cargaBarraConsistente) en buildModel.
        const fr = kv.get("Frame"); const dir = kv.get("Dir");
        const fa = parseNum(kv.get("FOverLA")), fb = kv.has("FOverLB") ? parseNum(kv.get("FOverLB")) : fa;
        const cs = (kv.get("CoordSys") ?? "GLOBAL").toUpperCase();
        if (!fr || !dir || (!fa && !fb) || cs !== "GLOBAL") break;
        const rel = (kv.get("DistType") ?? "RelDist") !== "AbsDist";
        const a = rel ? parseNum(kv.get("RelDistA")) : parseNum(kv.get("AbsDistA"));
        const b = rel ? (kv.has("RelDistB") ? parseNum(kv.get("RelDistB")) : 1) : parseNum(kv.get("AbsDistB"));
        const k = { X: 0, Y: 1, Z: 2 }[dir as "X" | "Y" | "Z"];
        if (k !== undefined && rel && a === 0 && b === 1 && fa === fb) {
          const v = frameLoadsRaw.get(fr) ?? [0, 0, 0]; v[k] += fa; frameLoadsRaw.set(fr, v);
        } else {
          const d = k !== undefined ? [0, 1, 2].map(j => (j === k ? 1 : 0)) : /^grav/i.test(dir) ? [0, 0, -1] : null;
          if (d) cargasTabla.barras.push({ frame: fr, dir: d, a, b, rel, fa, fb });
        }
        break;
      }

      case "FRAME AUTO MESH ASSIGNMENTS": {
        // Cancha Parque (25-sep-2026): 14 columnas de 0 a 7.1 m pasan por un nudo del arco a 6.3 m.
        // SAP las parte ahi (AtJoints) y las conecta; sin esto Hekatan dejaba el arco suelto: flechas x2.2.
        const fr = kv.get("Frame");
        if (fr && /^yes$/i.test(kv.get("AutoMesh") ?? "") && /^yes$/i.test(kv.get("AtJoints") ?? "")) cargasTabla.autoMeshJoints!.add(fr);
        break;
      }

      case "AREA LOADS - UNIFORM": {
        // `Area=A20 LoadPat=Live CoordSys=GLOBAL Dir=Z UnifLoad=-2` (escrito por SAP2000).
        // Dir=Gravity: positivo hacia -Z. CoordSys=Local Dir=3: normal del area.
        const ar = kv.get("Area"); const dir = kv.get("Dir") ?? ""; const q = parseNum(kv.get("UnifLoad"));
        if (!ar || !q) break;
        const local = /^local/i.test(kv.get("CoordSys") ?? "GLOBAL");
        const d = local ? (dir === "3" ? null : undefined)
          : dir === "X" ? [1, 0, 0] : dir === "Y" ? [0, 1, 0] : dir === "Z" ? [0, 0, 1] : /^grav/i.test(dir) ? [0, 0, -1] : undefined;
        if (d !== undefined) cargasTabla.areas.push({ area: ar, dir: d, q });
        break;
      }

      case "LOAD PATTERN DEFINITIONS": {
        const sw = parseNum(kv.get("SelfWtMult"));
        if (sw > cargasTabla.selfWtMult) cargasTabla.selfWtMult = sw;
        break;
      }

      case "CONNECTIVITY - SOLID": {
        const name = kv.get("Solid");
        if (name) {
          const jts: string[] = [];
          for (let j = 1; j <= 8; j++) { const jv = kv.get(`Joint${j}`); if (jv) jts.push(jv); }
          if (jts.length === 8) solidConns.push({ name, joints: jts });
        }
        break;
      }
      case "SOLID PROPERTY DEFINITIONS": {
        const name = kv.get("SolidProp");
        if (name) solidProps.set(name, { material: kv.get("Material") || "", incomp: (kv.get("InComp") || "Yes").toLowerCase().startsWith("y") });
        break;
      }
      case "SOLID PROPERTY ASSIGNMENTS": {
        const sname = kv.get("Solid"), prop = kv.get("SolidProp");
        if (sname && prop) solidAssign.set(sname, prop);
        break;
      }

      case "AREA STIFFNESS MODIFIERS": {
        const area = kv.get("Area");
        if (area) areaMods.set(area, ["f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23"].map(k => kv.has(k) ? parseNum(kv.get(k)) : 1));
        if (area && (kv.has("MassMod") || kv.has("WeightMod")))
          cargasTabla.areaMW.set(area, [kv.has("MassMod") ? parseNum(kv.get("MassMod")) : 1, kv.has("WeightMod") ? parseNum(kv.get("WeightMod")) : 1]);
        break;
      }

      case "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL": {
        const fr = kv.get("Frame");
        if (fr) angles.set(fr, parseNum(kv.get("Angle")));
        break;
      }

      case "FRAME OFFSET ALONG LENGTH ASSIGNMENTS": {
        const fr = kv.get("Frame");
        if (fr) offsets.set(fr, [parseNum(kv.get("LengthI")), parseNum(kv.get("LengthJ")), parseNum(kv.get("RigidFactor"))]);
        break;
      }

      case "JOINT LOADS - FORCE": {
        const joint = kv.get("Joint");
        if (joint) {
          loads.push({
            joint,
            fx: parseNum(kv.get("F1")),
            fy: parseNum(kv.get("F2")),
            fz: parseNum(kv.get("F3")),
            mx: parseNum(kv.get("M1")),
            my: parseNum(kv.get("M2")),
            mz: parseNum(kv.get("M3")),
          });
        }
        break;
      }
    }
  }

  return buildModel(units, dof, materials, frameSections, shellSections, joints,
    frameConns, shellConns, restraints, frameSectionAssign, areaSectionAssign, loads, offsets, angles, areaMods, frameLoadsRaw, solidConns, solidProps, solidAssign, sdBox, sdFill, jointSprings, cargasTabla);
}

// ═══════════════════════════════════════════
// LEGACY FORMAT (v6-v14)
// ═══════════════════════════════════════════
function parseLegacyFormat(rawLines: string[]): S2kModel {
  const units = { force: "KN", length: "m" };
  let dof = "UX,UY,UZ,RX,RY,RZ";
  const materials = new Map<string, { E: number; nu: number; G: number; density?: number; fy?: number }>();
  const frameSections = new Map<string, { material: string; shape: string; D: number; B: number; TF: number; TW: number; A: number; Iz: number; Iy: number; J: number }>();
  const shellSections = new Map<string, { material: string; type: string; thickness: number }>();
  const joints = new Map<string, [number, number, number]>();
  const frameConns: { name: string; j1: string; j2: string }[] = [];
  const shellConns: { name: string; joints: string[] }[] = [];
  const restraints = new Map<string, boolean[]>();
  const loads: { joint: string; fx: number; fy: number; fz: number; mx: number; my: number; mz: number }[] = [];
  const offsets = new Map<string, [number, number, number]>();   // FRAME OFFSET ALONG LENGTH ASSIGNMENTS
  const angles = new Map<string, number>();                        // FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL
  const areaMods = new Map<string, number[]>();                    // AREA STIFFNESS MODIFIERS
  const frameLoadsRaw = new Map<string, [number, number, number]>(); // FRAME LOADS - DISTRIBUTED
  const solidConns: { name: string; joints: string[] }[] = [];       // CONNECTIVITY - SOLID (orden tensorial de CSI)
  const solidProps = new Map<string, { material: string; incomp: boolean }>();
  const solidAssign = new Map<string, string>();

  let currentSection = "";
  let currentMaterial = "";

  for (const raw of rawLines) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith(";")) continue;

    // Section headers
    if (!raw.startsWith(" ") && !raw.startsWith("\t")) {
      const upper = trimmed.toUpperCase();
      if (upper === "END") break;
      if (upper.startsWith("SHELL SECTION")) currentSection = "SHELL SECTION";
      else if (upper.startsWith("FRAME SECTION")) currentSection = "FRAME SECTION";
      else currentSection = upper.split(/\s+/)[0];
      continue;
    }

    const kv = parseKV(trimmed);
    const tokens = trimmed.split(/\s+/);

    switch (currentSection) {
      case "SYSTEM": {
        const d = kv.get("DOF"); if (d) dof = d;
        const l = kv.get("LENGTH"); if (l) units.length = l;
        const f = kv.get("FORCE"); if (f) units.force = f;
        break;
      }
      case "JOINT": {
        const name = tokens[0];
        joints.set(name, [parseNum(kv.get("X")), parseNum(kv.get("Y")), parseNum(kv.get("Z"))]);
        break;
      }
      case "RESTRAINT": {
        const add = kv.get("ADD");
        const dofStr = kv.get("DOF");
        if (add && dofStr) {
          const dofs = dofStr.split(",");
          const r = [false, false, false, false, false, false];
          for (const d of dofs) {
            const du = d.toUpperCase();
            if (du === "UX" || du === "U1") r[0] = true;
            if (du === "UY" || du === "U2") r[1] = true;
            if (du === "UZ" || du === "U3") r[2] = true;
            if (du === "RX" || du === "R1") r[3] = true;
            if (du === "RY" || du === "R2") r[4] = true;
            if (du === "RZ" || du === "R3") r[5] = true;
          }
          restraints.set(add, r);
        }
        break;
      }
      case "MATERIAL": {
        const name = kv.get("NAME");
        if (name) { currentMaterial = name; materials.set(name, { E: 0, nu: 0, G: 0 }); }
        else if (currentMaterial) {
          const mat = materials.get(currentMaterial)!;
          const e = kv.get("E"); if (e) mat.E = parseNum(e);
          const u = kv.get("U"); if (u) mat.nu = parseNum(u);
          mat.G = mat.E / (2 * (1 + mat.nu));
          const m = kv.get("M"); if (m) mat.density = parseNum(m);
        }
        break;
      }
      case "SHELL": {
        const name = tokens[0];
        const j = kv.get("J");
        const sec = kv.get("SEC");
        if (j) shellConns.push({ name, joints: j.split(","), });
        break;
      }
      case "SHELL SECTION": {
        const name = kv.get("NAME");
        if (name) shellSections.set(name, { material: kv.get("MAT") || "", type: kv.get("TYPE") || "Shell", thickness: parseNum(kv.get("TH")) });
        break;
      }
      case "FRAME": {
        const name = tokens[0];
        const j = kv.get("J");
        if (j) { const jj = j.split(","); if (jj.length >= 2) frameConns.push({ name, j1: jj[0], j2: jj[1] }); }
        break;
      }
      case "LOAD": {
        const add = kv.get("ADD");
        if (add) loads.push({ joint: add, fx: parseNum(kv.get("UX")), fy: parseNum(kv.get("UY")), fz: parseNum(kv.get("UZ")), mx: parseNum(kv.get("MX")), my: parseNum(kv.get("MY")), mz: parseNum(kv.get("MZ")) });
        break;
      }
    }
  }

  // For legacy, section assignments come from SEC= in SHELL/FRAME lines
  const frameSectionAssign = new Map<string, string>();
  const areaSectionAssign = new Map<string, string>();

  return buildModel(units, dof, materials, frameSections, shellSections, joints,
    frameConns, shellConns, restraints, frameSectionAssign, areaSectionAssign, loads, offsets, angles, areaMods, frameLoadsRaw, solidConns, solidProps, solidAssign);
}

// ═══════════════════════════════════════════
// BUILD AWATIF MODEL (shared by both parsers)
// ═══════════════════════════════════════════
function buildModel(
  units: { force: string; length: string },
  dof: string,
  materials: Map<string, any>,
  frameSections: Map<string, any>,
  shellSections: Map<string, any>,
  joints: Map<string, [number, number, number]>,
  frameConns: { name: string; j1: string; j2: string }[],
  shellConns: { name: string; joints: string[] }[],
  restraints: Map<string, boolean[]>,
  frameSectionAssign: Map<string, string>,
  areaSectionAssign: Map<string, string>,
  loads: { joint: string; fx: number; fy: number; fz: number; mx: number; my: number; mz: number }[],
  offsets: Map<string, [number, number, number]> = new Map(),
  angles: Map<string, number> = new Map(),
  areaMods: Map<string, number[]> = new Map(),
  frameLoadsRaw: Map<string, [number, number, number]> = new Map(),
  solidConns: { name: string; joints: string[] }[] = [],
  solidProps: Map<string, { material: string; incomp: boolean }> = new Map(),
  solidAssign: Map<string, string> = new Map(),
  sdBox?: Map<string, { h: number; b: number; t: number; tf?: number; mat: string; D?: number }>,
  sdFill?: Map<string, { mat: string }>,
  jointSprings: Map<string, number[]> = new Map(),
  cargasTabla?: CargasTabla,
): S2kModel {
  const nodeNames: string[] = [];
  const nodeNameToIdx = new Map<string, number>();
  const nodesArr: Node[] = [];
  for (const [name, coords] of joints) {
    nodeNameToIdx.set(name, nodesArr.length);
    nodeNames.push(name);
    nodesArr.push(coords);
  }

  const elements: Element[] = [];
  const elementNames: string[] = [];
  const elementSections = new Map<number, string>();

  // AutoMesh AtJoints: la barra se parte en cada nudo que cae sobre su eje (tolerancia 1 mm, la
  // MergeTol de SAP). Los trozos 2..n se llaman `nombre~k`; `piezas` guarda la fraccion [s0, s1] de
  // cada uno para repartir las cargas de la barra original.
  const piezas = new Map<string, { i: number; s0: number; s1: number }[]>();
  const nombreBase = (n: string) => n.replace(/~\d+$/, "");
  for (const fc of frameConns) {
    const i1 = nodeNameToIdx.get(fc.j1);
    const i2 = nodeNameToIdx.get(fc.j2);
    if (i1 !== undefined && i2 !== undefined) {
      const cortes: { s: number; n: number }[] = [];
      if (cargasTabla?.autoMeshJoints?.has(fc.name)) {
        const a = nodesArr[i1], b = nodesArr[i2];
        const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L2 = d[0] ** 2 + d[1] ** 2 + d[2] ** 2;
        if (L2 > 1e-12) nodesArr.forEach((p, n) => {
          if (n === i1 || n === i2) return;
          const s = ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1] + (p[2] - a[2]) * d[2]) / L2;
          if (s <= 1e-9 || s >= 1 - 1e-9) return;
          const e = Math.hypot(p[0] - a[0] - s * d[0], p[1] - a[1] - s * d[1], p[2] - a[2] - s * d[2]);
          if (e < 1e-3) cortes.push({ s, n });
        });
        cortes.sort((x, y) => x.s - y.s);
      }
      const ss = [0, ...cortes.map(c => c.s), 1], ns = [i1, ...cortes.map(c => c.n), i2];
      const lista: { i: number; s0: number; s1: number }[] = [];
      for (let k = 0; k < ns.length - 1; k++) {
        const idx = elements.length;
        elements.push([ns[k], ns[k + 1]]);
        elementNames.push(k === 0 ? fc.name : `${fc.name}~${k + 1}`);
        const sec = frameSectionAssign.get(fc.name);
        if (sec) elementSections.set(idx, sec);
        lista.push({ i: idx, s0: ss[k], s1: ss[k + 1] });
      }
      piezas.set(fc.name, lista);
    }
  }
  const nFrames = elements.length;

  for (const sc of shellConns) {
    const indices = sc.joints.map(j => nodeNameToIdx.get(j)).filter(x => x !== undefined) as number[];
    if (indices.length >= 3) {
      const idx = elements.length;
      elements.push(indices);
      elementNames.push(sc.name);
      const sec = areaSectionAssign.get(sc.name);
      if (sec) elementSections.set(idx, sec);
    }
  }
  const nShells = elements.length - nFrames;
  // SOLIDOS: del orden tensorial de CSI (j3 (0,1,0), j4 (1,1,0)) al antihorario del H8
  const solidElems: number[] = [];
  for (const sc of solidConns) {
    const j = sc.joints.map(n => nodeNameToIdx.get(n));
    if (j.some(x => x === undefined)) continue;
    const idx = elements.length;
    elements.push([j[0], j[1], j[3], j[2], j[4], j[5], j[7], j[6]] as unknown as Element);
    elementNames.push(sc.name); solidElems.push(idx);
    const prop = solidAssign.get(sc.name);
    if (prop) elementSections.set(idx, prop);
  }

  // Build ElementInputs
  const ei: ElementInputs = {
    elasticities: new Map(), shearModuli: new Map(), areas: new Map(),
    momentsOfInertiaZ: new Map(), momentsOfInertiaY: new Map(),
    torsionalConstants: new Map(), densities: new Map(),
    thicknesses: new Map(), poissonsRatios: new Map(),
  };
  const sectionShapes = new Map<number, SectionShape>();
  /** Para el tooltip del cursor (hover.ts): nombre de sección + material por elemento. */
  const sectionInfo = new Map<number, any>();

  // Default material (first one)
  const defaultMat = materials.values().next().value || { E: 29000, nu: 0.3, G: 11153 };

  for (let i = 0; i < elements.length; i++) {
    const secName = elementSections.get(i);
    const fsec = secName ? frameSections.get(secName) : null;
    const ssec = secName ? shellSections.get(secName) : null;

    if (fsec || elements[i].length === 2) {
      const sec = fsec || { material: "", A: 0, Iz: 0, Iy: 0, J: 0, D: 0.3, B: 0.3, shape: "Rectangular" };
      const mat = materials.get(sec.material) || defaultMat;
      const E = mat.E || defaultMat.E;
      const nu = mat.nu || 0.3;
      const G = mat.G || E / (2 * (1 + nu));
      ei.elasticities!.set(i, E);
      ei.shearModuli!.set(i, G);
      ei.areas!.set(i, sec.A || sec.D * sec.B);
      ei.momentsOfInertiaZ!.set(i, sec.Iz || sec.B * sec.D ** 3 / 12);
      ei.momentsOfInertiaY!.set(i, sec.Iy || sec.D * sec.B ** 3 / 12);
      ei.torsionalConstants!.set(i, sec.J || 0);
      ei.densities!.set(i, mat.density || 0);
      if (sec.As2) (ei as any).shearAreasZ ??= new Map(), (ei as any).shearAreasZ.set(i, sec.As2);
      if (sec.As3) (ei as any).shearAreasY ??= new Map(), (ei as any).shearAreasY.set(i, sec.As3);
      const off = (piezas.get(elementNames[i])?.length ?? 1) === 1 ? offsets.get(elementNames[i]) : undefined;
      if (off) (ei as any).endOffsets ??= new Map(), (ei as any).endOffsets.set(i, off);
      const ang = angles.get(nombreBase(elementNames[i]));
      if (ang) (ei as any).localAngles ??= new Map(), (ei as any).localAngles.set(i, ang);
      const sx: any = sec;
      if (sec.shape?.includes("Wide Flange") || sec.shape === "I") {
        // (14-sep-2026) con sus cotas, para que al re-exportar vuelva a salir «I/Wide Flange» editable
        sectionShapes.set(i, { type: "I", b: sec.B, h: sec.D, ...(sx.TF > 0 && sx.TW > 0 ? { tf: sx.TF, tw: sx.TW, t2b: sx.T2B > 0 ? sx.T2B : sec.B, tfb: sx.TFB > 0 ? sx.TFB : sx.TF } : {}), name: secName || "I-section" } as any);
      } else if (/box|tube/i.test(sec.shape ?? "") && sx.TF > 0 && sx.TW > 0) {
        sectionShapes.set(i, { type: "HSS", b: sec.B, h: sec.D, tf: sx.TF, tw: sx.TW, name: secName } as any);
      } else if (/^channel$/i.test(sec.shape ?? "") && sx.TF > 0 && sx.TW > 0) {
        // (14-sep-2026) canal C paramétrico: vuelve a salir «Channel» editable al re-exportar
        sectionShapes.set(i, { type: "C", b: sec.B, h: sec.D, tf: sx.TF, tw: sx.TW, name: secName } as any);
      } else if (/double angle/i.test(sec.shape ?? "") && sx.TF > 0 && sx.TW > 0) {
        sectionShapes.set(i, { type: "2L", b: sec.B, h: sec.D, tf: sx.TF, tw: sx.TW, dis: sx.DIS || 0, name: secName } as any);
      } else {
        sectionShapes.set(i, { type: "rect", b: sec.B, h: sec.D });
      }
      // Tooltip del cursor (hover.ts): «Sección: <nombre>» y «Material: <mat>»
      // en lineas verticales, con o sin cálculo (modo none). Solo cotas finitas.
      sectionInfo.set(i, {
        name: secName || sec.shape,
        shape: sec.shape,
        D: sec.D > 0 ? sec.D : undefined,
        B: sec.B > 0 ? sec.B : undefined,
        TF: sx.TF > 0 ? sx.TF : undefined,
        TW: sx.TW > 0 ? sx.TW : undefined,
        ...(sec.material ? { material: sec.material } : {}),
      });
      const box = secName ? sdBox?.get(secName) : undefined;
      if (box && box.t > 0 && ((box.b > 0 && box.h > 0) || (box.D ?? 0) > 0)) {
        const fill = secName ? sdFill?.get(secName) : undefined;
        const Ef = fill ? (materials.get(fill.mat)?.E || 0) : 0;
        sectionShapes.set(i, box.D ? { type: "CFT", d: box.D, tw: box.t, name: secName, ...(Ef > 0 ? { fillE: Ef } : {}) }
                                   : { type: "CFT", b: box.b, h: box.h, tw: box.t, ...(box.tf && box.tf !== box.t ? { tf: box.tf } : {}), name: secName, ...(Ef > 0 ? { fillE: Ef } : {}) });
      }
    } else if (ssec) {
      const mat = materials.get(ssec.material) || defaultMat;
      const E = mat.E || defaultMat.E;
      const nu = mat.nu || 0.2;
      const G = mat.G || E / (2 * (1 + nu));
      ei.elasticities!.set(i, E);
      ei.shearModuli!.set(i, G);
      ei.thicknesses!.set(i, ssec.thickness);
      ei.poissonsRatios!.set(i, nu);
      // Shell-Thin -> Kirchhoff (plateFormulations 1); lo demas, Mindlin (0).
      // Sin esto todo entraba como Thick y el mezanine thin salia 1.1 % distinto.
      (ei as any).plateFormulations ??= new Map();
      (ei as any).plateFormulations.set(i, /thin/i.test(ssec.type) ? 1 : 0);
      // `Type=Membrane`: sin flexion (el motor no arma la placa con flexion 0). Antes se leia el tipo y
      // no se usaba: el muro membrana volvia de SAP2000 con la flexion entera.
      const membrana = /membrane/i.test(ssec.type);
      const am0 = areaMods.get(elementNames[i]);
      const am = am0 && membrana ? [am0[0], am0[1], am0[2], 0, 0, 0, 0, 0] : am0;
      if (am) {
        (ei as any).shellModifiers ??= new Map(); (ei as any).shellModifiers.set(i, am);
        (ei as any).membraneModifiers ??= new Map(); (ei as any).membraneModifiers.set(i, am[0]);
        (ei as any).bendingModifiers ??= new Map(); (ei as any).bendingModifiers.set(i, am[3]);
      } else if (membrana) {
        (ei as any).membraneModifiers ??= new Map(); (ei as any).membraneModifiers.set(i, 1);
        (ei as any).bendingModifiers ??= new Map(); (ei as any).bendingModifiers.set(i, 0);
      }
      ei.densities!.set(i, mat.density || 0);
      sectionInfo.set(i, {
        name: secName,
        shape: ssec.type,
        t: ssec.thickness > 0 ? ssec.thickness : undefined,
        ...(ssec.material ? { material: ssec.material } : {}),
      });
    }
  }

  // Material de los solidos, y la bandera de los modos incompatibles
  if (solidElems.length) {
    let incompAlguno = false;
    for (const i of solidElems) {
      const prop = solidProps.get(elementSections.get(i) || "");
      const mat = (prop && materials.get(prop.material)) || defaultMat;
      const E = mat.E || defaultMat.E; const nu = mat.nu || 0.2;
      ei.elasticities!.set(i, E); ei.poissonsRatios!.set(i, nu); ei.shearModuli!.set(i, mat.G || E / (2 * (1 + nu)));
      ei.densities!.set(i, (mat as any).density || 0);
      if (prop?.incomp) incompAlguno = true;
      sectionInfo.set(i, {
        name: elementSections.get(i) || undefined,
        shape: "Solid",
        ...(prop?.material ? { material: prop.material } : {}),
      });
    }
    (ei as any).solidIncompatible = incompAlguno;
  }
  if (sectionInfo.size) (ei as any).sectionInfo = sectionInfo;

  // NodeInputs
  const ni: NodeInputs = { supports: new Map(), loads: new Map() };   // `loads`, que es lo que lee el motor (`forces` no existe en NodeInputs: las cargas del s2k se perdian)
  for (const [name, r] of restraints) {
    const idx = nodeNameToIdx.get(name);
    if (idx !== undefined) ni.supports!.set(idx, r as any);
  }
  // Muelles nodales (Winkler): a `springs`, que es lo que lee el motor.
  {
    const spr: Array<{ node: number; dof: number; k: number }> = [];
    for (const [name, v] of jointSprings) {
      const idx = nodeNameToIdx.get(name);
      if (idx === undefined) continue;
      v.forEach((k, dof) => { if (k > 0) spr.push({ node: idx, dof, k }); });
    }
    if (spr.length) (ni as any).springs = spr;
  }
  // Cargas de barra: se guardan en `frameLoads` (para re-exportar) y se
  // reparten a los nudos como hace el cliModeler (w·L/2 y ±L²/12·(t×w)), que
  // es lo que consume el motor.
  for (const [fr, w] of frameLoadsRaw) for (const { i } of piezas.get(fr) ?? []) {
    if (elements[i].length !== 2) continue;
    (ei as any).frameLoads ??= new Map(); (ei as any).frameLoads.set(i, w);
    const a = nodesArr[elements[i][0]], b = nodesArr[elements[i][1]];
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]; const L = Math.hypot(d[0], d[1], d[2]);
    if (L < 1e-9) continue;
    const t = [d[0] / L, d[1] / L, d[2] / L], c = L * L / 12;
    const txw = [t[1] * w[2] - t[2] * w[1], t[2] * w[0] - t[0] * w[2], t[0] * w[1] - t[1] * w[0]];
    const suma = (n: number, v: number[]) => { const f = ni.loads!.get(n) || [0, 0, 0, 0, 0, 0] as any; for (let k = 0; k < 6; k++) f[k] += v[k]; ni.loads!.set(n, f); };
    suma(elements[i][0], [w[0] * L / 2, w[1] * L / 2, w[2] * L / 2, c * txw[0], c * txw[1], c * txw[2]]);
    suma(elements[i][1], [w[0] * L / 2, w[1] * L / 2, w[2] * L / 2, -c * txw[0], -c * txw[1], -c * txw[2]]);
  }
  for (const ld of loads) {
    const idx = nodeNameToIdx.get(ld.joint);
    if (idx !== undefined) {
      const f = ni.loads!.get(idx) || [0, 0, 0, 0, 0, 0] as any;
      f[0] += ld.fx; f[1] += ld.fy; f[2] += ld.fz;
      f[3] += ld.mx; f[4] += ld.my; f[5] += ld.mz;
      ni.loads!.set(idx, f);
    }
  }

  // ── Cargas de tabla que antes se perdian (24-sep-2026) ──────────────────────
  // Medido con la mesa de torsion (hekatan-fem-py/benchmarks/tests_convergencia): sin esto un
  // s2k con losa Shell-Thin entraba con L = 0 y D = 0, y las trapeciales +36 %.
  if (cargasTabla) {
    const loadsMap = ni.loads as unknown as Map<number, number[]>;
    const fixedEnd = new Map<number, number[]>();
    // Frame=1 y Area=1 son espacios de nombres DISTINTOS en SAP2000: un mapa por tipo.
    const frameIdx = new Map<string, number>(), areaIdx = new Map<string, number>();
    elementNames.forEach((n, i) => (i < nFrames ? frameIdx : i < nFrames + nShells ? areaIdx : new Map()).set(n, i));
    const esFrame = (i: number | undefined) => i !== undefined && i < nFrames;
    // 1) FRAME LOADS - DISTRIBUTED trapeciales / parciales / Gravity: vector consistente
    for (const c of cargasTabla.barras) {
      const ps = piezas.get(c.frame); if (!ps?.length || !esFrame(ps[0].i)) continue;
      const A0 = nodesArr[elements[ps[0].i][0]], B0 = nodesArr[elements[ps[ps.length - 1].i][1]];
      const Lt = Math.hypot(B0[0] - A0[0], B0[1] - A0[1], B0[2] - A0[2]);
      const s0 = c.rel ? c.a * Lt : c.a, s1 = c.rel ? c.b * Lt : c.b;
      const q = (s: number) => (s1 > s0 ? c.fa + (c.fb - c.fa) * (s - s0) / (s1 - s0) : c.fa);
      for (const p of ps) {   // barra partida por AutoMesh: cada trozo lleva su tramo de la carga
        const lo = Math.max(s0, p.s0 * Lt), hi = Math.min(s1, p.s1 * Lt);
        if (hi - lo <= 1e-12) continue;
        const [n1, n2] = elements[p.i] as number[];
        acumularCargaBarra(loadsMap, fixedEnd, p.i, n1, n2,
          cargaBarraConsistente(nodesArr[n1], nodesArr[n2], lo - p.s0 * Lt, hi - p.s0 * Lt, q(lo), q(hi), c.dir));
      }
    }
    // ∫N_i dA de un Q4 bilineal (Gauss 2x2 con su jacobiano) o A/3 del T3, y la normal unitaria.
    const repartoArea = (P: number[][]): { w: number[]; n: number[] } => {
      const cr = (u: number[], v: number[]) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      const sub = (u: number[], v: number[]) => [u[0] - v[0], u[1] - v[1], u[2] - v[2]];
      if (P.length === 3) {
        const c = cr(sub(P[1], P[0]), sub(P[2], P[0])), A2 = Math.hypot(...c);
        return { w: [A2 / 6, A2 / 6, A2 / 6], n: c.map(x => x / (A2 || 1)) };
      }
      const w = [0, 0, 0, 0], g = 1 / Math.sqrt(3);
      let nn = [0, 0, 0];
      for (const xi of [-g, g]) for (const et of [-g, g]) {
        const N = [(1 - xi) * (1 - et), (1 + xi) * (1 - et), (1 + xi) * (1 + et), (1 - xi) * (1 + et)].map(v => v / 4);
        const dxi = [-(1 - et), (1 - et), (1 + et), -(1 + et)].map(v => v / 4);
        const det = [-(1 - xi), -(1 + xi), (1 + xi), (1 - xi)].map(v => v / 4);
        const tx = [0, 1, 2].map(k => P.reduce((s, p, j) => s + dxi[j] * p[k], 0));
        const te = [0, 1, 2].map(k => P.reduce((s, p, j) => s + det[j] * p[k], 0));
        const c = cr(tx, te), J = Math.hypot(...c);
        nn = nn.map((v, k) => v + c[k]);
        for (let j = 0; j < 4; j++) w[j] += N[j] * J;
      }
      const nl = Math.hypot(...nn) || 1;
      return { w, n: nn.map(v => v / nl) };
    };
    const sumaF = (n: number, f: number[]) => {
      const p = loadsMap.get(n) ?? [0, 0, 0, 0, 0, 0];
      for (let k = 0; k < 3; k++) p[k] += f[k];
      loadsMap.set(n, p);
    };
    // 2) AREA LOADS - UNIFORM
    for (const c of cargasTabla.areas) {
      const i = areaIdx.get(c.area); if (i === undefined) continue;
      const el = elements[i] as number[]; if (el.length !== 3 && el.length !== 4) continue;
      const { w, n } = repartoArea(el.map(j => nodesArr[j]));
      const d = c.dir ?? n;
      el.forEach((j, k) => sumaF(j, d.map(x => x * c.q * w[k])));
    }
    // 3) PESO PROPIO (SelfWtMult): barras CONSISTENTE (fuerzas + momentos, como `frameload`),
    //    areas ∫N_i dA · UnitWeight · t · WeightMod. Y la MASA de las areas con su MassMod.
    const sw = cargasTabla.selfWtMult;
    for (let i = 0; i < elements.length; i++) {
      const secName = elementSections.get(i);
      const el = elements[i] as number[];
      if (i < nFrames) {
        const fs: any = secName ? frameSections.get(secName) : null;
        const mat: any = fs ? materials.get(fs.material) : null;
        if (fs && fs.MMod !== undefined && fs.MMod !== 1 && ei.densities!.has(i)) ei.densities!.set(i, ei.densities!.get(i)! * fs.MMod);
        const q = sw * (mat?.weight ?? 0) * (ei.areas!.get(i) ?? 0) * (fs?.WMod ?? 1);
        if (!q) continue;
        const a = nodesArr[el[0]], b = nodesArr[el[1]];
        const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
        acumularCargaBarra(loadsMap, fixedEnd, i, el[0], el[1], cargaBarraConsistente(a, b, 0, L, q, q, [0, 0, -1]));
      } else if (el.length === 3 || el.length === 4) {
        const ss: any = secName ? shellSections.get(secName) : null;
        const mat: any = ss ? materials.get(ss.material) : null;
        const mw = cargasTabla.areaMW.get(elementNames[i]);
        if (mw && ei.densities!.has(i)) ei.densities!.set(i, ei.densities!.get(i)! * mw[0]);
        const q = sw * (mat?.weight ?? 0) * (ss?.thickness ?? 0) * (mw ? mw[1] : 1);
        if (!q) continue;
        const { w } = repartoArea(el.map(j => nodesArr[j]));
        el.forEach((j, k) => sumaF(j, [0, 0, -q * w[k]]));
      }
    }
    if (fixedEnd.size) (ei as any).frameFixedEnd = fixedEnd;
  }

  return {
    units, dof, materials, frameSections, shellSections,
    nodes: nodesArr, nodeNames, nodeNameToIdx,
    elements, elementNames, elementSections,
    nodeInputs: ni, elementInputs: ei, sectionShapes,
    info: { nNodes: nodesArr.length, nFrames, nShells,
      title: `SAP2000 (${nFrames} frames, ${nShells} shells)` },
  };
}
