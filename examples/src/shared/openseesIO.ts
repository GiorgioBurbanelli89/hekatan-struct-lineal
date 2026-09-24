/**
 * OpenSees Import/Export — Tcl (.tcl) and Python (.py) formats
 *
 * Awatif ↔ OpenSees format conversion for structural models.
 * Supports: nodes, elements (elasticBeamColumn), fixities, loads.
 */
import type { Node, Element, NodeInputs, ElementInputs } from "hekatan-fem";
import { norm, subtract } from "mathjs";

export interface OpenseesModel {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
}

// ═══════════════════════════════════════════════
// EXPORT OpenSeesPy (.py)
// ═══════════════════════════════════════════════
export function exportOpenSeesPy(input: OpenseesModel): string {
  const { nodes, elements, nodeInputs, elementInputs } = input;
  const lines: string[] = [];

  lines.push(`# OpenSeesPy model exported from Hekatan Struct`);
  lines.push(`# ${nodes.length} nodes, ${elements.length} elements`);
  lines.push(``);
  lines.push(`import openseespy.opensees as ops`);
  lines.push(``);
  lines.push(`ops.wipe()`);
  lines.push(`ops.model('basic', '-ndm', 3, '-ndf', 6)`);
  lines.push(``);

  // Nodes
  lines.push(`# --- Nodes ---`);
  nodes.forEach((n, i) => {
    lines.push(`ops.node(${i + 1}, ${n[0]}, ${n[1]}, ${n[2]})`);
  });
  lines.push(``);

  // Fixities
  lines.push(`# --- Boundary Conditions ---`);
  nodeInputs.supports?.forEach((sup, nodeIdx) => {
    const fix = sup.map(b => b ? 1 : 0).join(", ");
    lines.push(`ops.fix(${nodeIdx + 1}, ${fix})`);
  });
  lines.push(``);

  // Geometric transformation
  lines.push(`# --- Geometric Transformations ---`);
  lines.push(`ops.geomTransf('Linear', 1, 0.0, 0.0, 1.0)  # beams (vecxz = Z)`);
  lines.push(`ops.geomTransf('Linear', 2, -1.0, 0.0, 0.0)  # columns (vecxz = -X)`);
  lines.push(``);

  // Elements
  lines.push(`# --- Elements (elasticBeamColumn) ---`);
  elements.forEach((el, i) => {
    if (el.length !== 2) return;
    const n0 = nodes[el[0]], n1 = nodes[el[1]];
    const isCol = Math.abs(n1[2] - n0[2]) > Math.max(Math.abs(n1[0] - n0[0]), Math.abs(n1[1] - n0[1]));
    const transf = isCol ? 2 : 1;

    const A = elementInputs.areas?.get(i) ?? 1;
    const E = elementInputs.elasticities?.get(i) ?? 200000;
    const G = elementInputs.shearModuli?.get(i) ?? 80000;
    const J = elementInputs.torsionalConstants?.get(i) ?? 1;
    // OJO con los ejes: OpenSees define su z con el vecxz de la geomTransf y su
    // y = z x x. Con vecxz (0,0,1) para vigas y (-1,0,0) para columnas, su z cae
    // sobre el eje 2 de CSI y su y sobre el 3 (salvo signo, que no afecta a una
    // inercia). O sea que su Iz es I22 y su Iy es I33 — al reves de como se
    // llaman aqui. Con la triada vieja de Hekatan coincidian y por eso iba
    // directo; ahora hay que cruzarlos.
    const Iy = elementInputs.momentsOfInertiaZ?.get(i) ?? 1;   // I33
    const Iz = elementInputs.momentsOfInertiaY?.get(i) ?? 1;   // I22

    lines.push(`ops.element('elasticBeamColumn', ${i + 1}, ${el[0] + 1}, ${el[1] + 1}, ${A}, ${E}, ${G}, ${J}, ${Iy}, ${Iz}, ${transf})`);
  });
  lines.push(``);

  // Loads
  if (nodeInputs.loads && nodeInputs.loads.size > 0) {
    lines.push(`# --- Loads ---`);
    lines.push(`ops.timeSeries('Linear', 1)`);
    lines.push(`ops.pattern('Plain', 1, 1)`);
    nodeInputs.loads.forEach((load, nodeIdx) => {
      const vals = load.map(v => v).join(", ");
      lines.push(`ops.load(${nodeIdx + 1}, ${vals})`);
    });
    lines.push(``);
  }

  // Analysis
  lines.push(`# --- Analysis ---`);
  lines.push(`ops.system('BandGeneral')`);
  lines.push(`ops.numberer('RCM')`);
  lines.push(`ops.constraints('Plain')`);
  lines.push(`ops.integrator('LoadControl', 1.0)`);
  lines.push(`ops.algorithm('Linear')`);
  lines.push(`ops.analysis('Static')`);
  lines.push(`ops.analyze(1)`);
  lines.push(``);

  // Print results
  lines.push(`# --- Results ---`);
  lines.push(`print("\\n=== Displacements ===")`);
  nodes.forEach((_, i) => {
    lines.push(`print(f"Node {${i + 1}}: {ops.nodeDisp(${i + 1})}")`);
  });
  lines.push(``);
  lines.push(`print("\\n=== Reactions ===")`);
  lines.push(`ops.reactions()`);
  nodeInputs.supports?.forEach((_, nodeIdx) => {
    lines.push(`print(f"Node {${nodeIdx + 1}}: {ops.nodeReaction(${nodeIdx + 1})}")`);
  });

  return lines.join("\n");
}

// ═══════════════════════════════════════════════
// EXPORT OpenSees Tcl (.tcl)
// ═══════════════════════════════════════════════
export function exportOpenSeesTcl(input: OpenseesModel): string {
  const { nodes, elements, nodeInputs, elementInputs } = input;
  const lines: string[] = [];

  lines.push(`# OpenSees Tcl model exported from Hekatan Struct`);
  lines.push(`# ${nodes.length} nodes, ${elements.length} elements`);
  lines.push(``);
  lines.push(`wipe`);
  lines.push(`model basic -ndm 3 -ndf 6`);
  lines.push(``);

  // Nodes
  lines.push(`# --- Nodes ---`);
  nodes.forEach((n, i) => {
    lines.push(`node ${i + 1} ${n[0]} ${n[1]} ${n[2]}`);
  });
  lines.push(``);

  // Fixities
  lines.push(`# --- Boundary Conditions ---`);
  nodeInputs.supports?.forEach((sup, nodeIdx) => {
    const fix = sup.map(b => b ? 1 : 0).join(" ");
    lines.push(`fix ${nodeIdx + 1} ${fix}`);
  });
  lines.push(``);

  // Geometric transformation
  lines.push(`# --- Geometric Transformations ---`);
  lines.push(`geomTransf Linear 1 0.0 0.0 1.0`);
  lines.push(`geomTransf Linear 2 -1.0 0.0 0.0`);
  lines.push(``);

  // Elements
  lines.push(`# --- Elements ---`);
  elements.forEach((el, i) => {
    if (el.length !== 2) return;
    const n0 = nodes[el[0]], n1 = nodes[el[1]];
    const isCol = Math.abs(n1[2] - n0[2]) > Math.max(Math.abs(n1[0] - n0[0]), Math.abs(n1[1] - n0[1]));
    const transf = isCol ? 2 : 1;

    const A = elementInputs.areas?.get(i) ?? 1;
    const E = elementInputs.elasticities?.get(i) ?? 200000;
    const G = elementInputs.shearModuli?.get(i) ?? 80000;
    const J = elementInputs.torsionalConstants?.get(i) ?? 1;
    // OJO con los ejes: OpenSees define su z con el vecxz de la geomTransf y su
    // y = z x x. Con vecxz (0,0,1) para vigas y (-1,0,0) para columnas, su z cae
    // sobre el eje 2 de CSI y su y sobre el 3 (salvo signo, que no afecta a una
    // inercia). O sea que su Iz es I22 y su Iy es I33 — al reves de como se
    // llaman aqui. Con la triada vieja de Hekatan coincidian y por eso iba
    // directo; ahora hay que cruzarlos.
    const Iy = elementInputs.momentsOfInertiaZ?.get(i) ?? 1;   // I33
    const Iz = elementInputs.momentsOfInertiaY?.get(i) ?? 1;   // I22

    lines.push(`element elasticBeamColumn ${i + 1} ${el[0] + 1} ${el[1] + 1} ${A} ${E} ${G} ${J} ${Iy} ${Iz} ${transf}`);
  });
  lines.push(``);

  // Loads
  if (nodeInputs.loads && nodeInputs.loads.size > 0) {
    lines.push(`# --- Loads ---`);
    lines.push(`timeSeries Linear 1`);
    lines.push(`pattern Plain 1 1 {`);
    nodeInputs.loads.forEach((load, nodeIdx) => {
      const vals = load.map(v => v).join(" ");
      lines.push(`  load ${nodeIdx + 1} ${vals}`);
    });
    lines.push(`}`);
    lines.push(``);
  }

  // Analysis
  lines.push(`# --- Analysis ---`);
  lines.push(`system BandGeneral`);
  lines.push(`numberer RCM`);
  lines.push(`constraints Plain`);
  lines.push(`integrator LoadControl 1.0`);
  lines.push(`algorithm Linear`);
  lines.push(`analysis Static`);
  lines.push(`analyze 1`);
  lines.push(``);
  lines.push(`# --- Results ---`);
  lines.push(`puts "\\n=== Displacements ==="`);
  nodes.forEach((_, i) => {
    lines.push(`puts "Node ${i + 1}: [nodeDisp ${i + 1}]"`);
  });
  lines.push(`puts "\\n=== Reactions ==="`);
  lines.push(`reactions`);
  nodeInputs.supports?.forEach((_, nodeIdx) => {
    lines.push(`puts "Node ${nodeIdx + 1}: [nodeReaction ${nodeIdx + 1}]"`);
  });

  return lines.join("\n");
}

// ═══════════════════════════════════════════════
// IMPORT OpenSeesPy (.py)
// ═══════════════════════════════════════════════
export function importOpenSeesPy(text: string): OpenseesModel {
  const nodes: Node[] = [];
  const elements: Element[] = [];
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  const loads = new Map<number, [number, number, number, number, number, number]>();
  const elasticities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const areas = new Map<number, number>();
  const momentsOfInertiaY = new Map<number, number>();
  const momentsOfInertiaZ = new Map<number, number>();
  const torsionalConstants = new Map<number, number>();

  const nodeMap = new Map<number, number>(); // opensees tag → array index
  const elemMap = new Map<number, number>();

  for (const line of text.split(/\r?\n/)) {
    const l = line.trim();

    // ops.node(tag, x, y, z)
    const nm = l.match(/ops\.node\(\s*(\d+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)/);
    if (nm) {
      const tag = parseInt(nm[1]);
      const idx = nodes.length;
      nodes.push([parseFloat(nm[2]), parseFloat(nm[3]), parseFloat(nm[4])]);
      nodeMap.set(tag, idx);
      continue;
    }

    // ops.fix(tag, fx, fy, fz, rx, ry, rz)
    const fm = l.match(/ops\.fix\(\s*(\d+)\s*,\s*(\d)\s*,\s*(\d)\s*,\s*(\d)\s*,\s*(\d)\s*,\s*(\d)\s*,\s*(\d)/);
    if (fm) {
      const tag = parseInt(fm[1]);
      const idx = nodeMap.get(tag);
      if (idx !== undefined) {
        supports.set(idx, [fm[2]==="1", fm[3]==="1", fm[4]==="1", fm[5]==="1", fm[6]==="1", fm[7]==="1"]);
      }
      continue;
    }

    // ops.element('elasticBeamColumn', tag, n1, n2, A, E, G, J, Iy, Iz, transf)
    const em = l.match(/ops\.element\(\s*'elasticBeamColumn'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)/);
    if (em) {
      const tag = parseInt(em[1]);
      const n1 = nodeMap.get(parseInt(em[2]));
      const n2 = nodeMap.get(parseInt(em[3]));
      if (n1 !== undefined && n2 !== undefined) {
        const idx = elements.length;
        elements.push([n1, n2]);
        elemMap.set(tag, idx);
        areas.set(idx, parseFloat(em[4]));
        elasticities.set(idx, parseFloat(em[5]));
        shearModuli.set(idx, parseFloat(em[6]));
        torsionalConstants.set(idx, parseFloat(em[7]));
        // em[8] = Iy de OpenSees = I33 ; em[9] = Iz de OpenSees = I22
        momentsOfInertiaZ.set(idx, parseFloat(em[8]));
        momentsOfInertiaY.set(idx, parseFloat(em[9]));
      }
      continue;
    }

    // ops.load(tag, fx, fy, fz, mx, my, mz)
    const lm = l.match(/ops\.load\(\s*(\d+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)\s*,\s*([-\d.eE+]+)/);
    if (lm) {
      const idx = nodeMap.get(parseInt(lm[1]));
      if (idx !== undefined) {
        loads.set(idx, [parseFloat(lm[2]), parseFloat(lm[3]), parseFloat(lm[4]), parseFloat(lm[5]), parseFloat(lm[6]), parseFloat(lm[7])]);
      }
    }
  }

  return {
    nodes, elements,
    nodeInputs: { supports, loads },
    elementInputs: { elasticities, shearModuli, areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants },
  };
}

// ═══════════════════════════════════════════════
// IMPORT OpenSees Tcl (.tcl)
// ═══════════════════════════════════════════════
export function importOpenSeesTcl(text: string): OpenseesModel {
  const nodes: Node[] = [];
  const elements: Element[] = [];
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  const loads = new Map<number, [number, number, number, number, number, number]>();
  const elasticities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const areas = new Map<number, number>();
  const momentsOfInertiaY = new Map<number, number>();
  const momentsOfInertiaZ = new Map<number, number>();
  const torsionalConstants = new Map<number, number>();

  const nodeMap = new Map<number, number>();
  const elemMap = new Map<number, number>();

  for (const line of text.split(/\r?\n/)) {
    const l = line.trim();
    if (l.startsWith("#") || l.startsWith("//")) continue;
    const parts = l.split(/\s+/);

    // node tag x y z
    if (parts[0] === "node" && parts.length >= 5) {
      const tag = parseInt(parts[1]);
      const idx = nodes.length;
      nodes.push([parseFloat(parts[2]), parseFloat(parts[3]), parseFloat(parts[4])]);
      nodeMap.set(tag, idx);
      continue;
    }

    // fix tag fx fy fz rx ry rz
    if (parts[0] === "fix" && parts.length >= 8) {
      const idx = nodeMap.get(parseInt(parts[1]));
      if (idx !== undefined) {
        supports.set(idx, [parts[2]==="1", parts[3]==="1", parts[4]==="1", parts[5]==="1", parts[6]==="1", parts[7]==="1"]);
      }
      continue;
    }

    // element elasticBeamColumn tag n1 n2 A E G J Iy Iz transf
    if (parts[0] === "element" && parts[1] === "elasticBeamColumn" && parts.length >= 12) {
      const n1 = nodeMap.get(parseInt(parts[3]));
      const n2 = nodeMap.get(parseInt(parts[4]));
      if (n1 !== undefined && n2 !== undefined) {
        const idx = elements.length;
        elements.push([n1, n2]);
        areas.set(idx, parseFloat(parts[5]));
        elasticities.set(idx, parseFloat(parts[6]));
        shearModuli.set(idx, parseFloat(parts[7]));
        torsionalConstants.set(idx, parseFloat(parts[8]));
        momentsOfInertiaY.set(idx, parseFloat(parts[9]));
        momentsOfInertiaZ.set(idx, parseFloat(parts[10]));
      }
      continue;
    }

    // load tag fx fy fz mx my mz
    if (parts[0] === "load" && parts.length >= 8) {
      const idx = nodeMap.get(parseInt(parts[1]));
      if (idx !== undefined) {
        loads.set(idx, [parseFloat(parts[2]), parseFloat(parts[3]), parseFloat(parts[4]), parseFloat(parts[5]), parseFloat(parts[6]), parseFloat(parts[7])]);
      }
    }
  }

  return {
    nodes, elements,
    nodeInputs: { supports, loads },
    elementInputs: { elasticities, shearModuli, areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants },
  };
}
