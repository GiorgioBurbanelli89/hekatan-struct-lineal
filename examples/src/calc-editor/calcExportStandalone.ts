/**
 * calcExportStandalone.ts — Export full standalone FEM scripts
 *
 * Generates complete MATLAB/Octave (.m) or Python/NumPy (.py) scripts
 * with ALL FEM functions implemented (no awatif dependency).
 * The exported script is independently verifiable.
 *
 * Includes: beam_stiffness_3d, transform_3d, assemble, apply_bcs, solve
 */

import type { ModelData } from "./calcTemplates";

// ═══════════════════════════════════════════════════════
// MAIN EXPORT FUNCTION
// ═══════════════════════════════════════════════════════

export function exportStandalone(
  modelData: ModelData,
  calcCode: string,
  target: "matlab" | "python"
): void {
  const content = target === "matlab"
    ? generateMatlab(modelData, calcCode)
    : generatePython(modelData, calcCode);

  const ext = target === "matlab" ? "m" : "py";
  const filename = `fem_standalone.${ext}`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Generate standalone MATLAB script string (for editor display) */
export function generateMatlabScript(md: ModelData): string {
  return generateMatlab(md, "");
}

/** Generate standalone Python script string (for editor display) */
export function generatePythonScript(md: ModelData): string {
  return generatePython(md, "");
}

/** Generate Hekatan .hcalc script string */
export function generateHekatanScript(md: ModelData): string {
  return generateHekatan(md);
}

// ═══════════════════════════════════════════════════════
// MATLAB / OCTAVE GENERATOR
// ═══════════════════════════════════════════════════════

function generateMatlab(md: ModelData, _calcCode: string): string {
  const lines: string[] = [];
  const L = (s: string) => lines.push(s);

  L("% ═══════════════════════════════════════════════════════════════");
  L("% FEM Standalone — Generado por Hekatan Struct");
  L("% Compatible con MATLAB R2019+ y GNU Octave 6+");
  L("% Ejecutar sin dependencias externas");
  L("% ═══════════════════════════════════════════════════════════════");
  L("clear; clc; close all;");
  L("");

  // --- Model data ---
  L("% ═══════ DATOS DEL MODELO ═══════");
  L(`nnodes = ${md.nodes.length};`);
  L(`nelem = ${md.elements.length};`);

  // Nodes (1-based for MATLAB)
  L("nodes = [");
  for (const n of md.nodes) {
    L(`  ${n[0]}, ${n[1]}, ${n[2]};`);
  }
  L("];");
  L("");

  // Elements (1-based!)
  L("elem = [");
  for (const e of md.elements) {
    L(`  ${e.map(i => i + 1).join(", ")};`);
  }
  L("];");
  L("");

  // Properties
  L("% Propiedades por elemento");
  emitMatlabPropArray(lines, "E_vec", md.elementInputs.elasticities, md.elements.length);
  emitMatlabPropArray(lines, "A_vec", md.elementInputs.areas, md.elements.length);
  emitMatlabPropArray(lines, "Iz_vec", md.elementInputs.momentsOfInertiaZ, md.elements.length);
  emitMatlabPropArray(lines, "Iy_vec", md.elementInputs.momentsOfInertiaY, md.elements.length);
  emitMatlabPropArray(lines, "G_vec", md.elementInputs.shearModuli, md.elements.length);
  emitMatlabPropArray(lines, "J_vec", md.elementInputs.torsionalConstants, md.elements.length);
  if (md.elementInputs.thicknesses && md.elementInputs.thicknesses.size > 0) {
    emitMatlabPropArray(lines, "t_vec", md.elementInputs.thicknesses, md.elements.length);
  }
  if (md.elementInputs.poissonsRatios && md.elementInputs.poissonsRatios.size > 0) {
    emitMatlabPropArray(lines, "nu_vec", md.elementInputs.poissonsRatios, md.elements.length);
  }
  L("");

  // Supports
  L("% Apoyos (1=fijo, 0=libre) [Fx Fy Fz Mx My Mz]");
  L("supports = zeros(nnodes, 6);");
  if (md.nodeInputs.supports) {
    md.nodeInputs.supports.forEach((vals, nodeIdx) => {
      const bools = vals.map(v => v ? 1 : 0);
      L(`supports(${nodeIdx + 1}, :) = [${bools.join(" ")}];`);
    });
  }
  L("");

  // Loads
  L("% Cargas nodales [Fx Fy Fz Mx My Mz]");
  L("loads = zeros(nnodes, 6);");
  if (md.nodeInputs.loads) {
    md.nodeInputs.loads.forEach((vals, nodeIdx) => {
      L(`loads(${nodeIdx + 1}, :) = [${vals.join(" ")}];`);
    });
  }
  L("");

  // --- FEM Algorithm ---
  L("% ═══════ ALGORITMO FEM ═══════");
  L("ndof = nnodes * 6;");
  L("K_global = zeros(ndof, ndof);");
  L("F_global = zeros(ndof, 1);");
  L("");

  L("% Vector de fuerzas");
  L("for n = 1:nnodes");
  L("  dofs = (n-1)*6+1 : n*6;");
  L("  F_global(dofs) = loads(n, :)';");
  L("end");
  L("");

  L("% Ensamblaje");
  L("fprintf('Ensamblando %d elementos...\\n', nelem);");
  L("for e = 1:nelem");
  L("  el_nodes = elem(e, :);");
  L("  n_en = length(el_nodes);  % 2=frame, 4=shell");
  L("  coords = nodes(el_nodes, :);");
  L("");
  L("  if n_en == 2");
  L("    % Frame element");
  L("    K_loc = beam_stiffness_3d(E_vec(e), A_vec(e), Iz_vec(e), Iy_vec(e), G_vec(e), J_vec(e), coords);");
  L("    T = transform_3d(coords);");
  L("    K_glob = T' * K_loc * T;");
  L("  else");
  L("    % Shell Q4 — placeholder (implementar si se necesita)");
  L("    K_glob = zeros(n_en*6);");
  L("    warning('Shell Q4 no implementado en esta exportación');");
  L("  end");
  L("");
  L("  % Ensamblar en K_global");
  L("  dof_map = [];");
  L("  for ni = 1:n_en");
  L("    node_id = el_nodes(ni);");
  L("    dof_map = [dof_map, (node_id-1)*6+1 : node_id*6];");
  L("  end");
  L("  K_global(dof_map, dof_map) = K_global(dof_map, dof_map) + K_glob;");
  L("end");
  L("");

  L("% Condiciones de contorno");
  L("fixed_dofs = [];");
  L("for n = 1:nnodes");
  L("  for d = 1:6");
  L("    if supports(n, d) == 1");
  L("      fixed_dofs = [fixed_dofs, (n-1)*6 + d];");
  L("    end");
  L("  end");
  L("end");
  L("free_dofs = setdiff(1:ndof, fixed_dofs);");
  L("");

  L("% Resolver");
  L("fprintf('Resolviendo %d DOFs libres...\\n', length(free_dofs));");
  L("U = zeros(ndof, 1);");
  L("U(free_dofs) = K_global(free_dofs, free_dofs) \\ F_global(free_dofs);");
  L("");
  L("% Reacciones");
  L("R = K_global * U - F_global;");
  L("");

  L("% ═══════ RESULTADOS ═══════");
  L("fprintf('\\n=== RESULTADOS ===\\n');");
  L("fprintf('Desplazamiento max: %.6e\\n', max(abs(U)));");
  L("");
  L("% Desplazamientos por nodo");
  L("for n = 1:nnodes");
  L("  dofs = (n-1)*6+1 : n*6;");
  L("  u_n = U(dofs);");
  L("  if norm(u_n) > 1e-15");
  L("    fprintf('Nodo %d: ux=%.4e uy=%.4e uz=%.4e\\n', n, u_n(1), u_n(2), u_n(3));");
  L("  end");
  L("end");
  L("");
  L("% Reacciones en apoyos");
  L("fprintf('\\n=== REACCIONES ===\\n');");
  L("for n = 1:nnodes");
  L("  if any(supports(n, :))");
  L("    dofs = (n-1)*6+1 : n*6;");
  L("    r_n = R(dofs);");
  L("    fprintf('Nodo %d: Fx=%.4f Fy=%.4f Fz=%.4f Mx=%.4f My=%.4f Mz=%.4f\\n', n, r_n(1), r_n(2), r_n(3), r_n(4), r_n(5), r_n(6));");
  L("  end");
  L("end");
  L("");

  // --- FEM Functions ---
  L("% ═══════════════════════════════════════════════════════════════");
  L("% FUNCIONES FEM");
  L("% ═══════════════════════════════════════════════════════════════");
  L("");

  // beam_stiffness_3d — Timoshenko 12x12
  L("function K = beam_stiffness_3d(E, A, Iz, Iy, G, J, coords)");
  L("  % Timoshenko beam 3D — 12x12 local stiffness matrix");
  L("  % Dr. Aguiar, Análisis Matricial de Estructuras");
  L("  n0 = coords(1,:); n1 = coords(2,:);");
  L("  L = norm(n1 - n0);");
  L("  if L < 1e-12; K = zeros(12); return; end");
  L("");
  L("  % Shear areas (5/6*A for rectangular default)");
  L("  AsY = 5/6 * A;");
  L("  AsZ = 5/6 * A;");
  L("  phiZ = 0; phiY = 0;");
  L("  if AsZ > 0 && G > 0; phiZ = 12*E*Iz/(G*AsZ*L^2); end");
  L("  if AsY > 0 && G > 0; phiY = 12*E*Iy/(G*AsY*L^2); end");
  L("");
  L("  EA_L = E*A/L;");
  L("  GJ_L = G*J/L;");
  L("");
  L("  % Timoshenko coefficients");
  L("  tz = 12*E*Iz/(L^3*(1+phiZ));");
  L("  bz = 6*E*Iz/(L^2*(1+phiZ));");
  L("  kz = 4*E*Iz/L*(1+phiZ/4)/(1+phiZ);");
  L("  az = 2*E*Iz/L*(1-phiZ/2)/(1+phiZ);");
  L("");
  L("  ty = 12*E*Iy/(L^3*(1+phiY));");
  L("  by = 6*E*Iy/(L^2*(1+phiY));");
  L("  ky = 4*E*Iy/L*(1+phiY/4)/(1+phiY);");
  L("  ay = 2*E*Iy/L*(1-phiY/2)/(1+phiY);");
  L("");
  L("  K = [");
  L("    EA_L  0    0    0    0    0   -EA_L  0    0    0    0    0;");
  L("    0     tz   0    0    0    bz   0    -tz   0    0    0    bz;");
  L("    0     0    ty   0   -by   0    0     0   -ty   0   -by   0;");
  L("    0     0    0    GJ_L 0    0    0     0    0   -GJ_L 0    0;");
  L("    0     0   -by   0    ky   0    0     0    by   0    ay   0;");
  L("    0     bz   0    0    0    kz   0    -bz   0    0    0    az;");
  L("   -EA_L  0    0    0    0    0    EA_L  0    0    0    0    0;");
  L("    0    -tz   0    0    0   -bz   0     tz   0    0    0   -bz;");
  L("    0     0   -ty   0    by   0    0     0    ty   0    by   0;");
  L("    0     0    0   -GJ_L 0    0    0     0    0    GJ_L 0    0;");
  L("    0     0   -by   0    ay   0    0     0    by   0    ky   0;");
  L("    0     bz   0    0    0    az   0    -bz   0    0    0    kz;");
  L("  ];");
  L("end");
  L("");

  // transform_3d — 12x12 transformation matrix
  L("function T = transform_3d(coords)");
  L("  % 3D transformation matrix (12x12) — local to global");
  L("  n0 = coords(1,:); n1 = coords(2,:);");
  L("  dx = n1 - n0;");
  L("  L = norm(dx);");
  L("  ex = dx / L;  % local x = element axis");
  L("");
  L("  % Local y, z via cross products");
  L("  % If element is vertical, use global X as reference");
  L("  if abs(ex(1)) < 0.001 && abs(ex(2)) < 0.001");
  L("    ref = [1, 0, 0];  % global X");
  L("  else");
  L("    ref = [0, 0, 1];  % global Z (default up)");
  L("  end");
  L("");
  L("  ey = cross(ref, ex);");
  L("  ey = ey / norm(ey);");
  L("  ez = cross(ex, ey);");
  L("");
  L("  lambda = [ex; ey; ez];  % 3x3 rotation");
  L("  T = zeros(12, 12);");
  L("  T(1:3, 1:3) = lambda;");
  L("  T(4:6, 4:6) = lambda;");
  L("  T(7:9, 7:9) = lambda;");
  L("  T(10:12, 10:12) = lambda;");
  L("end");
  L("");

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════
// PYTHON / NUMPY GENERATOR
// ═══════════════════════════════════════════════════════

function generatePython(md: ModelData, _calcCode: string): string {
  const lines: string[] = [];
  const L = (s: string) => lines.push(s);

  L('"""');
  L("FEM Standalone — Generado por Hekatan Struct");
  L("Compatible con Python 3.8+ y NumPy 1.20+");
  L("Ejecutar: python fem_standalone.py");
  L('"""');
  L("import numpy as np");
  L("from numpy.linalg import norm");
  L("");

  // --- Functions first (Python needs them before use) ---
  L("# ═══════════════════════════════════════════════════════════════");
  L("# FUNCIONES FEM");
  L("# ═══════════════════════════════════════════════════════════════");
  L("");

  L("def beam_stiffness_3d(E, A, Iz, Iy, G, J, coords):");
  L('    """Timoshenko beam 3D — 12x12 local stiffness matrix"""');
  L("    n0, n1 = coords[0], coords[1]");
  L("    L = norm(n1 - n0)");
  L("    if L < 1e-12: return np.zeros((12, 12))");
  L("");
  L("    AsY = AsZ = 5/6 * A  # rectangular default");
  L("    phiZ = 12*E*Iz/(G*AsZ*L**2) if (AsZ > 0 and G > 0) else 0");
  L("    phiY = 12*E*Iy/(G*AsY*L**2) if (AsY > 0 and G > 0) else 0");
  L("");
  L("    EA_L = E*A/L");
  L("    GJ_L = G*J/L");
  L("");
  L("    tz = 12*E*Iz/(L**3*(1+phiZ))");
  L("    bz = 6*E*Iz/(L**2*(1+phiZ))");
  L("    kz = 4*E*Iz/L*(1+phiZ/4)/(1+phiZ)");
  L("    az = 2*E*Iz/L*(1-phiZ/2)/(1+phiZ)");
  L("");
  L("    ty = 12*E*Iy/(L**3*(1+phiY))");
  L("    by = 6*E*Iy/(L**2*(1+phiY))");
  L("    ky = 4*E*Iy/L*(1+phiY/4)/(1+phiY)");
  L("    ay = 2*E*Iy/L*(1-phiY/2)/(1+phiY)");
  L("");
  L("    K = np.array([");
  L("        [ EA_L, 0,   0,   0,    0,   0,  -EA_L, 0,   0,   0,    0,   0  ],");
  L("        [ 0,    tz,  0,   0,    0,   bz,  0,   -tz,  0,   0,    0,   bz ],");
  L("        [ 0,    0,   ty,  0,   -by,  0,   0,    0,  -ty,  0,   -by,  0  ],");
  L("        [ 0,    0,   0,   GJ_L, 0,   0,   0,    0,   0,  -GJ_L, 0,   0  ],");
  L("        [ 0,    0,  -by,  0,    ky,  0,   0,    0,   by,  0,    ay,  0  ],");
  L("        [ 0,    bz,  0,   0,    0,   kz,  0,   -bz,  0,   0,    0,   az ],");
  L("        [-EA_L, 0,   0,   0,    0,   0,   EA_L, 0,   0,   0,    0,   0  ],");
  L("        [ 0,   -tz,  0,   0,    0,  -bz,  0,    tz,  0,   0,    0,  -bz ],");
  L("        [ 0,    0,  -ty,  0,    by,  0,   0,    0,   ty,  0,    by,  0  ],");
  L("        [ 0,    0,   0,  -GJ_L, 0,   0,   0,    0,   0,   GJ_L, 0,   0  ],");
  L("        [ 0,    0,  -by,  0,    ay,  0,   0,    0,   by,  0,    ky,  0  ],");
  L("        [ 0,    bz,  0,   0,    0,   az,  0,   -bz,  0,   0,    0,   kz ],");
  L("    ])");
  L("    return K");
  L("");

  L("def transform_3d(coords):");
  L('    """3D transformation matrix (12x12)"""');
  L("    n0, n1 = coords[0], coords[1]");
  L("    dx = n1 - n0");
  L("    L = norm(dx)");
  L("    ex = dx / L");
  L("");
  L("    if abs(ex[0]) < 0.001 and abs(ex[1]) < 0.001:");
  L("        ref = np.array([1, 0, 0])");
  L("    else:");
  L("        ref = np.array([0, 0, 1])");
  L("");
  L("    ey = np.cross(ref, ex)");
  L("    ey = ey / norm(ey)");
  L("    ez = np.cross(ex, ey)");
  L("");
  L("    lam = np.array([ex, ey, ez])");
  L("    T = np.zeros((12, 12))");
  L("    T[0:3, 0:3] = lam");
  L("    T[3:6, 3:6] = lam");
  L("    T[6:9, 6:9] = lam");
  L("    T[9:12, 9:12] = lam");
  L("    return T");
  L("");

  // --- Model data ---
  L("# ═══════════════════════════════════════════════════════════════");
  L("# DATOS DEL MODELO");
  L("# ═══════════════════════════════════════════════════════════════");
  L("");
  L(`nnodes = ${md.nodes.length}`);
  L(`nelem = ${md.elements.length}`);
  L("");

  // Nodes
  L("nodes = np.array([");
  for (const n of md.nodes) {
    L(`    [${n[0]}, ${n[1]}, ${n[2]}],`);
  }
  L("])");
  L("");

  // Elements (0-based for Python)
  L("elem = [");
  for (const e of md.elements) {
    L(`    [${e.join(", ")}],`);
  }
  L("]");
  L("");

  // Properties
  emitPythonPropArray(lines, "E_vec", md.elementInputs.elasticities, md.elements.length);
  emitPythonPropArray(lines, "A_vec", md.elementInputs.areas, md.elements.length);
  emitPythonPropArray(lines, "Iz_vec", md.elementInputs.momentsOfInertiaZ, md.elements.length);
  emitPythonPropArray(lines, "Iy_vec", md.elementInputs.momentsOfInertiaY, md.elements.length);
  emitPythonPropArray(lines, "G_vec", md.elementInputs.shearModuli, md.elements.length);
  emitPythonPropArray(lines, "J_vec", md.elementInputs.torsionalConstants, md.elements.length);
  L("");

  // Supports
  L("supports = np.zeros((nnodes, 6), dtype=bool)");
  if (md.nodeInputs.supports) {
    md.nodeInputs.supports.forEach((vals, nodeIdx) => {
      const bools = vals.map(v => v ? "True" : "False");
      L(`supports[${nodeIdx}] = [${bools.join(", ")}]`);
    });
  }
  L("");

  // Loads
  L("loads = np.zeros((nnodes, 6))");
  if (md.nodeInputs.loads) {
    md.nodeInputs.loads.forEach((vals, nodeIdx) => {
      L(`loads[${nodeIdx}] = [${vals.join(", ")}]`);
    });
  }
  L("");

  // --- FEM Algorithm ---
  L("# ═══════════════════════════════════════════════════════════════");
  L("# ALGORITMO FEM");
  L("# ═══════════════════════════════════════════════════════════════");
  L("");
  L("ndof = nnodes * 6");
  L("K_global = np.zeros((ndof, ndof))");
  L("F_global = np.zeros(ndof)");
  L("");
  L("# Vector de fuerzas");
  L("for n in range(nnodes):");
  L("    F_global[n*6:(n+1)*6] = loads[n]");
  L("");

  L("# Ensamblaje");
  L('print(f"Ensamblando {nelem} elementos...")');
  L("for e in range(nelem):");
  L("    el_nodes = elem[e]");
  L("    n_en = len(el_nodes)");
  L("    coords = nodes[el_nodes]");
  L("");
  L("    if n_en == 2:");
  L("        K_loc = beam_stiffness_3d(E_vec[e], A_vec[e], Iz_vec[e], Iy_vec[e], G_vec[e], J_vec[e], coords)");
  L("        T = transform_3d(coords)");
  L("        K_glob = T.T @ K_loc @ T");
  L("    else:");
  L("        K_glob = np.zeros((n_en*6, n_en*6))");
  L('        print(f"  Warning: Shell Q4 element {e} not implemented")');
  L("");
  L("    # Ensamblar");
  L("    dof_map = []");
  L("    for ni in el_nodes:");
  L("        dof_map.extend(range(ni*6, ni*6+6))");
  L("    ix = np.ix_(dof_map, dof_map)");
  L("    K_global[ix] += K_glob");
  L("");

  L("# Condiciones de contorno");
  L("fixed_dofs = []");
  L("for n in range(nnodes):");
  L("    for d in range(6):");
  L("        if supports[n, d]:");
  L("            fixed_dofs.append(n*6 + d)");
  L("free_dofs = [i for i in range(ndof) if i not in fixed_dofs]");
  L("");

  L("# Resolver");
  L('print(f"Resolviendo {len(free_dofs)} DOFs libres...")');
  L("U = np.zeros(ndof)");
  L("K_ff = K_global[np.ix_(free_dofs, free_dofs)]");
  L("F_ff = F_global[free_dofs]");
  L("U[free_dofs] = np.linalg.solve(K_ff, F_ff)");
  L("");
  L("# Reacciones");
  L("R = K_global @ U - F_global");
  L("");

  L("# ═══════════════════════════════════════════════════════════════");
  L("# RESULTADOS");
  L("# ═══════════════════════════════════════════════════════════════");
  L('print(f"\\n=== RESULTADOS ===")');
  L('print(f"Desplazamiento max: {np.max(np.abs(U)):.6e}")');
  L("");
  L("for n in range(nnodes):");
  L("    u_n = U[n*6:(n+1)*6]");
  L("    if norm(u_n) > 1e-15:");
  L('        print(f"Nodo {n+1}: ux={u_n[0]:.4e} uy={u_n[1]:.4e} uz={u_n[2]:.4e}")');
  L("");
  L('print(f"\\n=== REACCIONES ===")');
  L("for n in range(nnodes):");
  L("    if any(supports[n]):");
  L("        r_n = R[n*6:(n+1)*6]");
  L('        print(f"Nodo {n+1}: Fx={r_n[0]:.4f} Fy={r_n[1]:.4f} Fz={r_n[2]:.4f}")');
  L("");

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

function emitMatlabPropArray(
  lines: string[], name: string,
  map: Map<number, number> | undefined, nelem: number
): void {
  if (!map || map.size === 0) {
    lines.push(`${name} = zeros(1, ${nelem});`);
    return;
  }
  const vals: number[] = [];
  for (let i = 0; i < nelem; i++) vals.push(map.get(i) || 0);
  // Check if all same
  if (vals.every(v => v === vals[0])) {
    lines.push(`${name} = ${vals[0]} * ones(1, ${nelem});`);
  } else {
    lines.push(`${name} = [${vals.join(", ")}];`);
  }
}

function emitPythonPropArray(
  lines: string[], name: string,
  map: Map<number, number> | undefined, nelem: number
): void {
  if (!map || map.size === 0) {
    lines.push(`${name} = np.zeros(${nelem})`);
    return;
  }
  const vals: number[] = [];
  for (let i = 0; i < nelem; i++) vals.push(map.get(i) || 0);
  if (vals.every(v => v === vals[0])) {
    lines.push(`${name} = np.full(${nelem}, ${vals[0]})`);
  } else {
    lines.push(`${name} = np.array([${vals.join(", ")}])`);
  }
}

// ═══════════════════════════════════════════════════════
// HEKATAN .hcalc GENERATOR
// ═══════════════════════════════════════════════════════

function generateHekatan(md: ModelData): string {
  const lines: string[] = [];
  const L = (s: string) => lines.push(s);

  L("# Análisis FEM — Generado por Hekatan Struct");
  L("# Abrir en Hekatan Calc 1.0.0");
  L("");
  L("## Datos del modelo");
  L("");
  L(`n_nodos = ${md.nodes.length}`);
  L(`n_elem = ${md.elements.length}`);
  L(`n_gdl = n_nodos*6`);
  L("");

  // Properties as scalars or first value
  const E0 = md.elementInputs.elasticities?.values().next().value || 0;
  const A0 = md.elementInputs.areas?.values().next().value || 0;
  const Iz0 = md.elementInputs.momentsOfInertiaZ?.values().next().value || 0;
  const Iy0 = md.elementInputs.momentsOfInertiaY?.values().next().value || 0;
  const G0 = md.elementInputs.shearModuli?.values().next().value || 0;
  const J0 = md.elementInputs.torsionalConstants?.values().next().value || 0;

  L("> Propiedades de la sección");
  L(`E = ${E0}`);
  L(`A = ${A0}`);
  L(`I_z = ${Iz0}`);
  L(`I_y = ${Iy0}`);
  L(`G = ${G0}`);
  L(`J = ${J0}`);
  L("");

  // Example element calculation
  L("## Rigidez local — Timoshenko");
  L("");
  L("> Elemento 1 (columna vertical, L = 3 m)");
  L("L = 3");
  L("");

  L("> Áreas de corte (rectangular 5/6·A)");
  L("A_s = 5/6*A");
  L("");

  L("> Parámetro de Timoshenko");
  L("φ_z = 12*E*I_z/(G*A_s*L^2)");
  L("φ_y = 12*E*I_y/(G*A_s*L^2)");
  L("");

  L("> Coeficientes de rigidez");
  L("t_z = 12*E*I_z/(L^3*(1 + φ_z))");
  L("b_z = 6*E*I_z/(L^2*(1 + φ_z))");
  L("k_z = 4*E*I_z/L*(1 + φ_z/4)/(1 + φ_z)");
  L("a_z = 2*E*I_z/L*(1 - φ_z/2)/(1 + φ_z)");
  L("");

  L("t_y = 12*E*I_y/(L^3*(1 + φ_y))");
  L("b_y = 6*E*I_y/(L^2*(1 + φ_y))");
  L("k_y = 4*E*I_y/L*(1 + φ_y/4)/(1 + φ_y)");
  L("a_y = 2*E*I_y/L*(1 - φ_y/2)/(1 + φ_y)");
  L("");

  L("@{eq}");
  L("K_{local} = [EA/L, 0, 0, 0, 0, 0; 0, t_z, 0, 0, 0, b_z; 0, 0, t_y, 0, -b_y, 0; 0, 0, 0, GJ/L, 0, 0; 0, 0, -b_y, 0, k_y, 0; 0, b_z, 0, 0, 0, k_z]");
  L("@{eq}");
  L("");

  L("## Verificación");
  L("");
  L("> Rigidez axial");
  L("k_axial = E*A/L");
  L("");
  L("> Rigidez a torsión");
  L("k_torsion = G*J/L");
  L("");
  L("> Rigidez a flexión (Euler-Bernoulli, φ=0)");
  L("k_flex_z = 12*E*I_z/L^3");
  L("k_flex_y = 12*E*I_y/L^3");
  L("");

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════
// DOWNLOAD HELPER
// ═══════════════════════════════════════════════════════

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
