/**
 * Rectangular Slab FEA — Thick plate (Mindlin-Reissner)
 * Validation example mirroring the Calcpad Symbolic file:
 *   "Rectangular Slab FEA - Thick.cpd"
 * Exact same inputs:
 *   a = 6 m, b = 4 m, t = 0.10 m
 *   q = 10 kN/m² uniform pressure
 *   E = 35000 MPa, ν = 0.15
 *   Simply supported along all four edges
 * Purpose: allow direct comparison between Hekatan Struct Lineal and Calcpad FEM.
 */
// El paquete se renombro a `hekatan-fem`; `awatif-fem` ya no existe y el build
// de produccion fallaba entero por esta linea.
import { plateQ4Solve, modalAnalysis, type Node } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

export const plateThickValidacion: ExampleDef = {
  id: "plate-thick-validacion",
  name: "Rectangular Slab — Mindlin (Calcpad validation)",
  category: "2️⃣ Shells · 🧱 Placas",
  defaultShellResult: "displacementZ",
  availableShellResults: ["displacementZ", "bendingXX", "bendingYY", "bendingXY", "shearX", "shearY"],
  hasModal: false,
  params: {
    // ── Geometry (Calcpad case: 6 × 4 × 0.10 m) ──
    a:  { default: 6.0,  min: 1, max: 12, step: 0.5,  label: "a — length X (m)" },
    b:  { default: 4.0,  min: 1, max: 12, step: 0.5,  label: "b — length Y (m)" },
    t:  { default: 0.10, min: 0.05, max: 0.8, step: 0.02, label: "t — thickness (m)" },
    // ── Load ──
    q:  { default: 10,   min: 1, max: 50, step: 1,    label: "q — uniform pressure (kN/m²)" },
    // ── Material (Calcpad: E=35000 MPa, ν=0.15) ──
    E_MPa: { default: 35000, min: 5000, max: 210000, step: 1000, label: "E (MPa)" },
    nu:    { default: 0.15, min: 0.10, max: 0.40, step: 0.01,    label: "ν (Poisson)" },
    // ── Mesh ──
    nx: { default: 12, min: 4, max: 24, step: 1, label: "nx (elements in X)" },
    ny: { default: 8,  min: 4, max: 24, step: 1, label: "ny (elements in Y)" },
  },
  inlineComputed: [
    {
      after: "nu",
      label: "D (plate rigidity, kN·m)",
      compute: (p) => {
        const E = (p.E_MPa ?? 35000) * 1000;
        const nu = p.nu ?? 0.15;
        const t = p.t ?? 0.10;
        const D = E * Math.pow(t, 3) / (12 * (1 - nu * nu));
        return D.toFixed(1);
      },
    },
    {
      after: "t",
      label: "t/min(a,b) (thick if ≥ 0.05)",
      compute: (p) => {
        const t = p.t ?? 0.10;
        const Lmin = Math.min(p.a ?? 6, p.b ?? 4);
        const ratio = t / Lmin;
        return ratio.toFixed(4) + (ratio >= 0.05 ? " THICK ✓" : " THIN");
      },
    },
  ],
  computedLabels(p, states) {
    const E = (p.E_MPa ?? 35000) * 1000;
    const nu = p.nu ?? 0.15;
    const t = p.t ?? 0.10;
    const a = p.a ?? 6;
    const b = p.b ?? 4;
    const q = p.q ?? 10;
    const D = E * Math.pow(t, 3) / (12 * (1 - nu * nu));
    const alpha = 0.00772; // a/b ≈ 1.5 simply supported
    const wKirchhoff_mm = alpha * q * Math.pow(b, 4) / D * 1000;
    let wFEM_mm = 0;
    try {
      const def = (states.deformOutputs.rawVal as any)?.deformations as Map<number, number[]> | undefined;
      if (def && def.size) {
        for (const d of def.values()) if (Math.abs(d[2]) > Math.abs(wFEM_mm / 1000)) wFEM_mm = d[2] * 1000;
      }
    } catch { /* no-op */ }
    const ratio = wKirchhoff_mm !== 0 ? Math.abs(wFEM_mm / wKirchhoff_mm) : 0;
    return {
      "a × b × t (m)":      `${a.toFixed(1)} × ${b.toFixed(1)} × ${t.toFixed(2)}`,
      "E (MPa)":            (E / 1000).toFixed(0),
      "D (kN·m)":           D.toFixed(1),
      "q (kN/m²)":          q.toFixed(1),
      "w_Kirchhoff (mm)":   wKirchhoff_mm.toFixed(3),
      "w_FEM Mindlin (mm)": Math.abs(wFEM_mm).toFixed(3),
      "Mindlin/Kirchhoff":  ratio.toFixed(3) + (ratio > 1 ? " ✓ (FEM > Kirchhoff, as expected)" : " ⚠"),
    };
  },
  build(p, states) {
    const E = p.E_MPa * 1000;
    const out = plateQ4Solve({
      E: E, nu: p.nu, thickness: p.t,
      theoryType: 0,            // 0 = Mindlin (thick)
      meshLx: p.a, meshLy: p.b,
      meshNx: Math.round(p.nx), meshNy: Math.round(p.ny),
      bcType: "simply-supported",
      pressure: -p.q,
    });
    const nodes: Node[] = out.nodeResults.map((n) => [n.x, n.y, 0]);
    const elems = out.elementResults.map((e) => e.nodes);
    states.nodes.val = nodes;
    states.elements.val = elems as number[][];
    const thicknesses = new Map<number, number>();
    elems.forEach((_, i) => thicknesses.set(i, p.t));

    // Supports & visual loads
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const A_trib_full = (p.a / Math.round(p.nx)) * (p.b / Math.round(p.ny));
    nodes.forEach((n, i) => {
      const onEdge = Math.abs(n[0]) < 1e-6 || Math.abs(n[0] - p.a) < 1e-6 ||
                     Math.abs(n[1]) < 1e-6 || Math.abs(n[1] - p.b) < 1e-6;
      if (onEdge) supports.set(i, [true, true, true, false, false, false]);
      const corner = (Math.abs(n[0]) < 1e-6 || Math.abs(n[0] - p.a) < 1e-6) &&
                     (Math.abs(n[1]) < 1e-6 || Math.abs(n[1] - p.b) < 1e-6);
      const factor = corner ? 0.25 : onEdge ? 0.5 : 1.0;
      loads.set(i, [0, 0, -p.q * A_trib_full * factor, 0, 0, 0]);
    });

    states.nodeInputs.val = { supports, loads };

    const deformations = new Map<number, [number, number, number, number, number, number]>();
    out.nodeResults.forEach((n, i) => {
      deformations.set(i, [0, 0, n.w, n.bx, n.by, 0]);
    });
    states.deformOutputs.val = { deformations };

    const bendingXX = new Map<number, number[]>();
    const bendingYY = new Map<number, number[]>();
    const bendingXY = new Map<number, number[]>();
    out.elementResults.forEach((er, i) => {
      bendingXX.set(i, [er.Mxx, er.Mxx, er.Mxx, er.Mxx]);
      bendingYY.set(i, [er.Myy, er.Myy, er.Myy, er.Myy]);
      bendingXY.set(i, [er.Mxy, er.Mxy, er.Mxy, er.Mxy]);
    });
    states.analyzeOutputs.val = { bendingXX, bendingYY, bendingXY };

    const elasticities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const densities = new Map<number, number>();
    elems.forEach((_, i) => { elasticities.set(i, E); poissons.set(i, p.nu); densities.set(i, 24); });
    states.elementInputs.val = { thicknesses, elasticities, poissonsRatios: poissons, densities };
    states.objects3D.val = [];

    // Log for verification
    let wMax_mm = 0;
    for (const d of deformations.values()) if (Math.abs(d[2]) > wMax_mm) wMax_mm = Math.abs(d[2]);
    wMax_mm *= 1000;
    const D = E * Math.pow(p.t, 3) / (12 * (1 - p.nu * p.nu));
    const alpha = 0.00772;
    const wKirchhoff_mm = alpha * p.q * Math.pow(p.b, 4) / D * 1000;
    console.log(
      `[Plate Thick — Calcpad validation]\n` +
      `  Geometry: ${p.a} × ${p.b} × ${p.t} m\n` +
      `  Material: E = ${(E/1000).toFixed(0)} MPa, ν = ${p.nu}\n` +
      `  Load:     q = ${p.q} kN/m²\n` +
      `  D plate = ${D.toFixed(1)} kN·m\n` +
      `  ─── Results ───\n` +
      `  w_FEM Mindlin    = ${wMax_mm.toFixed(3)} mm\n` +
      `  w_Kirchhoff (Navier, α=0.00772) = ${wKirchhoff_mm.toFixed(3)} mm\n` +
      `  Ratio Mindlin/Kirchhoff = ${(wMax_mm / wKirchhoff_mm).toFixed(3)} (expected > 1)`
    );
  },
};
