/**
 * SAP2000 .s2k File Parser
 * Supports BOTH formats:
 *   - Legacy (v6-v14): SYSTEM/JOINT/SHELL keyword blocks
 *   - Modern (v15+): TABLE: "..." format with key=value pairs
 */
import type { Node, Element, NodeInputs, ElementInputs, SectionShape } from "hekatan-fem";

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
            A: parseNum(kv.get("Area")),
            Iz: parseNum(kv.get("I33")),
            Iy: parseNum(kv.get("I22")),
            J: parseNum(kv.get("TorsConst")),
            // AS2 -> V2 (con I33) = shearAreasZ · AS3 -> V3 (con I22) = shearAreasY,
            // el mismo criterio que el exportador. Sin esto el importado se
            // quedaba con 5/6·A (Timoshenko de defecto) y salia 2 % mas rigido.
            As2: parseNum(kv.get("AS2")),
            As3: parseNum(kv.get("AS3")),
          });
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
        // Uniforme, en GLOBALES, de extremo a extremo: lo que escribe el exportador.
        const fr = kv.get("Frame"); const dir = kv.get("Dir"); const w = parseNum(kv.get("FOverLA"));
        if (fr && dir && w) {
          const k = { X: 0, Y: 1, Z: 2 }[dir as "X" | "Y" | "Z"];
          if (k !== undefined) { const v = frameLoadsRaw.get(fr) ?? [0, 0, 0]; v[k] += w; frameLoadsRaw.set(fr, v); }
        }
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
    frameConns, shellConns, restraints, frameSectionAssign, areaSectionAssign, loads, offsets, angles, areaMods, frameLoadsRaw, solidConns, solidProps, solidAssign, sdBox, sdFill, jointSprings);
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

  for (const fc of frameConns) {
    const i1 = nodeNameToIdx.get(fc.j1);
    const i2 = nodeNameToIdx.get(fc.j2);
    if (i1 !== undefined && i2 !== undefined) {
      const idx = elements.length;
      elements.push([i1, i2]);
      elementNames.push(fc.name);
      const sec = frameSectionAssign.get(fc.name);
      if (sec) elementSections.set(idx, sec);
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
      const off = offsets.get(elementNames[i]);
      if (off) (ei as any).endOffsets ??= new Map(), (ei as any).endOffsets.set(i, off);
      const ang = angles.get(elementNames[i]);
      if (ang) (ei as any).localAngles ??= new Map(), (ei as any).localAngles.set(i, ang);
      if (sec.shape?.includes("Wide Flange") || sec.shape === "I") {
        sectionShapes.set(i, { type: "I", b: sec.B, h: sec.D, name: secName || "I-section" });
      } else {
        sectionShapes.set(i, { type: "rect", b: sec.B, h: sec.D });
      }
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
    }
    (ei as any).solidIncompatible = incompAlguno;
  }

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
  for (const [fr, w] of frameLoadsRaw) {
    const i = elementNames.indexOf(fr);
    if (i < 0 || elements[i].length !== 2) continue;
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

  return {
    units, dof, materials, frameSections, shellSections,
    nodes: nodesArr, nodeNames, nodeNameToIdx,
    elements, elementNames, elementSections,
    nodeInputs: ni, elementInputs: ei, sectionShapes,
    info: { nNodes: nodesArr.length, nFrames, nShells,
      title: `SAP2000 (${nFrames} frames, ${nShells} shells)` },
  };
}
