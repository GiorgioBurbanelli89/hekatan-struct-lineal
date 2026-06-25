/**
 * Benchmark SAFE Verification Example 1 — Simply Supported Rectangular Plate
 *
 * Ref:  C:\Program Files\Computers and Structures\SAFE 20\Manuals\Verification\
 *       Analysis\Example 01.pdf  (Timoshenko-Woinowsky 1959, Navier double series)
 *
 * Geometría:  a × b × t  =  360" × 240" × 8"  (9.144 × 6.096 × 0.2032 m)
 * Material:   E = 3000 ksi (20.684 GPa),  ν = 0.3
 * BCs:        Simply supported en los 4 bordes (w=0, rotaciones libres)
 * Carga UL:   q = 100 psf = 4.7880 kN/m²  (presión uniforme descendente)
 *
 * Puntos de referencia SAFE Tabla 1-1:
 *   (X=60,  Y=60)   (1.524 m, 1.524 m) — cuadrante interior
 *   (X=60,  Y=120)  (1.524 m, 3.048 m) — borde corto centro
 *   (X=180, Y=60)   (4.572 m, 1.524 m) — borde largo centro
 *   (X=180, Y=120)  (4.572 m, 3.048 m) — CENTRO de la placa
 *
 * Resultados teóricos Navier (UL):
 *   w(60, 60)    = 0.04930 in = 1.252 mm
 *   w(60, 120)   = 0.06844 in = 1.738 mm
 *   w(180, 60)   = 0.09060 in = 2.301 mm
 *   w(180, 120)  = 0.12652 in = 3.214 mm  (máximo, centro)
 *
 * SAFE 8×8 Thin Plate (UL):
 *   w(60, 60)    = 0.0492 in   (Δ = -0.2%)
 *   w(180, 120)  = 0.1270 in   (Δ = +0.4%)
 */
import { plateQ4Solve, modalAnalysis, type Node } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

// ── Unidades del libro SAFE PDF (imperial → SI) ──
const IN_TO_M = 0.0254;            // 1 in = 0.0254 m
const FT_TO_M = 0.3048;            // 1 ft = 0.3048 m
const PSF_TO_KPA = 4.7880e-2;      // 1 psf = 0.04788 kPa = 0.04788 kN/m²
const KSI_TO_KPA = 6.89476e3;      // 1 ksi = 6894.76 kN/m²

// ── Geometría libro (fija; benchmark) ──
const A_FT = 30, B_FT = 20, T_IN = 8;
const Lx = A_FT * FT_TO_M;         // 9.144 m
const Ly = B_FT * FT_TO_M;         // 6.096 m
const t  = T_IN * IN_TO_M;         // 0.2032 m
const E  = 3000 * KSI_TO_KPA;      // 20,684,280 kN/m² ≈ 20.7 GPa
const nu = 0.3;

// ── 4 puntos de referencia SAFE Tabla 1-1 (in → m) ──
const REF_POINTS_IN = [
  { x: 60,  y: 60,  label: "P1 (60,60) — cuadrante" },
  { x: 60,  y: 120, label: "P2 (60,120) — borde corto centro" },
  { x: 180, y: 60,  label: "P3 (180,60) — borde largo centro" },
  { x: 180, y: 120, label: "P4 (180,120) — CENTRO" },
];

// ── Valores teóricos Navier para UL (de PDF Tabla 1-1) ──
const NAVIER_UL = {
  "P1": 0.0492961,   // in
  "P2": 0.0684443,
  "P3": 0.0906034,
  "P4": 0.1265195,
};

export const benchmarkSafeEx01Plate: ExampleDef = {
  id: "benchmark-safe-ex01-plate",
  name: "SAFE Ex.1 · Placa SS rectangular (Timoshenko)",
  category: "🏁 Benchmarks · 2️⃣ Áreas · 📘 SAFE",
  benchmark: true,
  defaultShellResult: "displacementZ",
  availableShellResults: ["displacementZ", "bendingXX", "bendingYY", "bendingXY",
                          "shearX", "shearY", "vonMises"],
  hasModal: true,
  params: {
    // Solo UL (uniform load) implementado en V1; PL/LL en futuro
    loadCase: {
      default: 1,
      label: "Load case",
      options: { "UL Uniform (q=100 psf)": 1 },
    },
    theoryType: {
      default: 1,
      label: "Plate theory",
      options: { "Thin (Kirchhoff)": 1, "Thick (Mindlin)": 0 },
    },
    mesh: {
      default: 8,
      label: "Mesh (n×n_b proportion)",
      options: { "4×4": 4, "8×8": 8, "12×12": 12 },
    },
  },
  build(p, states) {
    const theoryType = Math.round(p.theoryType);   // 1=thin, 0=thick
    const meshN = Math.round(p.mesh);
    // SAFE PDF Figura 1-2 usa nx=ny (4×4 / 8×8 / 12×12) con elementos rectangulares
    // (relación a/b = 1.5). Match: usar mismo número de segs en ambos ejes.
    // El PDF usa además malla NO uniforme con bordes finos; aquí simplificamos a
    // uniforme — los resultados convergen al teórico pero con ratio levemente
    // distinto al PDF (típicamente 1-3% peor para mallas gruesas).
    const nx = meshN, ny = meshN;

    // Load UL: q = 100 psf
    const q_kPa = 100 * PSF_TO_KPA;   // 4.7880 kN/m²

    const out = plateQ4Solve({
      E, nu, thickness: t,
      theoryType,
      meshLx: Lx, meshLy: Ly,
      meshNx: nx, meshNy: ny,
      bcType: "simply-supported",
      pressure: -q_kPa,    // descendente
    });

    const nodes: Node[] = out.nodeResults.map((n) => [n.x, n.y, 0]);
    const elems = out.elementResults.map((e) => e.nodes);
    states.nodes.val = nodes;
    states.elements.val = elems as number[][];
    const thicknesses = new Map<number, number>();
    elems.forEach((_, i) => thicknesses.set(i, t));
    const elasticities = new Map<number, number>();
    const poissons     = new Map<number, number>();
    const densities    = new Map<number, number>();
    elems.forEach((_, i) => {
      elasticities.set(i, E); poissons.set(i, nu); densities.set(i, 24);
    });

    // ── Supports/loads para visualización ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const dxAvg = Lx / nx, dyAvg = Ly / ny;
    const A_trib_full = dxAvg * dyAvg;
    nodes.forEach((n, i) => {
      const onEdgeX = Math.abs(n[0]) < 1e-6 || Math.abs(n[0] - Lx) < 1e-6;
      const onEdgeY = Math.abs(n[1]) < 1e-6 || Math.abs(n[1] - Ly) < 1e-6;
      if (onEdgeX || onEdgeY) supports.set(i, [true, true, true, false, false, false]);
      const factor = (onEdgeX && onEdgeY) ? 0.25 : (onEdgeX || onEdgeY) ? 0.5 : 1.0;
      loads.set(i, [0, 0, -q_kPa * A_trib_full * factor, 0, 0, 0]);
    });

    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = { thicknesses, elasticities, poissonsRatios: poissons, densities };

    // ── deformations Map (para colormap displacementZ) ──
    const deformations = new Map<number, [number, number, number, number, number, number]>();
    out.nodeResults.forEach((n, i) => {
      deformations.set(i, [0, 0, n.w, n.bx, n.by, 0]);
    });
    states.deformOutputs.val = { deformations };

    // ── analyzeOutputs (momentos + shears) ──
    const bendingXX = new Map<number, number[]>();
    const bendingYY = new Map<number, number[]>();
    const bendingXY = new Map<number, number[]>();
    const shearX    = new Map<number, number[]>();
    const shearY    = new Map<number, number[]>();
    const vonMises  = new Map<number, number[]>();
    const S = t * t / 6;
    out.elementResults.forEach((er, i) => {
      bendingXX.set(i, [er.Mxx, er.Mxx, er.Mxx, er.Mxx]);
      bendingYY.set(i, [er.Myy, er.Myy, er.Myy, er.Myy]);
      bendingXY.set(i, [er.Mxy, er.Mxy, er.Mxy, er.Mxy]);
      shearX.set(i,    [er.Qx,  er.Qx,  er.Qx,  er.Qx]);
      shearY.set(i,    [er.Qy,  er.Qy,  er.Qy,  er.Qy]);
      const sxx = er.Mxx / S, syy = er.Myy / S, sxy = er.Mxy / S;
      const vm = Math.sqrt(sxx*sxx - sxx*syy + syy*syy + 3*sxy*sxy);
      vonMises.set(i, [vm, vm, vm, vm]);
    });
    states.analyzeOutputs.val = { bendingXX, bendingYY, bendingXY, shearX, shearY, vonMises };

    // ── Interpolación bilineal dentro del Q4 que contiene el target ──
    // Crítico: la malla uniforme NO siempre tiene nodos en X=60,120,180 (SAFE points),
    // así que samplear "nearest node" da error grande. Bilineal recupera el valor
    // exacto en cualquier punto del dominio.
    const dxMesh = Lx / nx, dyMesh = Ly / ny;
    function bilinearW(xt: number, yt: number): number {
      const ix = Math.min(nx - 1, Math.max(0, Math.floor(xt / dxMesh)));
      const jy = Math.min(ny - 1, Math.max(0, Math.floor(yt / dyMesh)));
      const xi = (xt - ix * dxMesh) / dxMesh;   // [0, 1]
      const et = (yt - jy * dyMesh) / dyMesh;   // [0, 1]
      const i00 = jy * (nx + 1) + ix;
      const i10 = jy * (nx + 1) + ix + 1;
      const i11 = (jy + 1) * (nx + 1) + ix + 1;
      const i01 = (jy + 1) * (nx + 1) + ix;
      const w00 = deformations.get(i00)?.[2] ?? 0;
      const w10 = deformations.get(i10)?.[2] ?? 0;
      const w11 = deformations.get(i11)?.[2] ?? 0;
      const w01 = deformations.get(i01)?.[2] ?? 0;
      return (1-xi)*(1-et)*w00 + xi*(1-et)*w10 + xi*et*w11 + (1-xi)*et*w01;
    }
    const theoryStr = theoryType === 1 ? "Thin (Kirchhoff)" : "Thick (Mindlin)";
    console.log(`\n[SAFE Ex.1 · ${nx}×${ny} ${theoryStr}]  Geom ${A_FT}'×${B_FT}'×${T_IN}\"  E=${(E/1e6).toFixed(1)} GPa  ν=${nu}`);
    console.log(`              UL = ${q_kPa.toFixed(3)} kN/m² (= 100 psf)`);
    console.log(`  Punto             X (in)  Y (in)  w_Hek (in)   w_Navier (in)  Δ%   (bilineal)`);
    for (const rp of REF_POINTS_IN) {
      const xm = rp.x * IN_TO_M, ym = rp.y * IN_TO_M;
      const w_m = bilinearW(xm, ym);
      const w_in_hek = Math.abs(w_m) / IN_TO_M;
      const key = rp.label.split(" ")[0] as "P1"|"P2"|"P3"|"P4";
      const w_in_nav = (NAVIER_UL as any)[key] as number;
      const diff = (w_in_hek / w_in_nav - 1) * 100;
      console.log(`  ${rp.label.padEnd(36)}  ${rp.x.toString().padStart(3)}  ${rp.y.toString().padStart(3)}   ${w_in_hek.toFixed(4)}        ${w_in_nav.toFixed(4)}     ${diff >= 0 ? "+" : ""}${diff.toFixed(2)}%`);
    }
    states.objects3D.val = [];
  },
  computedLabels: (p, states) => {
    const out: Record<string, string> = {};
    const deformations = states.deformOutputs.val?.deformations;
    if (!deformations) return out;
    const meshN = Math.round(p.mesh);
    const nx = meshN, ny = meshN;
    const dxMesh = Lx / nx, dyMesh = Ly / ny;
    function bilinearW(xt: number, yt: number): number {
      const ix = Math.min(nx - 1, Math.max(0, Math.floor(xt / dxMesh)));
      const jy = Math.min(ny - 1, Math.max(0, Math.floor(yt / dyMesh)));
      const xi = (xt - ix * dxMesh) / dxMesh;
      const et = (yt - jy * dyMesh) / dyMesh;
      const i00 = jy * (nx + 1) + ix;
      const i10 = jy * (nx + 1) + ix + 1;
      const i11 = (jy + 1) * (nx + 1) + ix + 1;
      const i01 = (jy + 1) * (nx + 1) + ix;
      const w00 = deformations.get(i00)?.[2] ?? 0;
      const w10 = deformations.get(i10)?.[2] ?? 0;
      const w11 = deformations.get(i11)?.[2] ?? 0;
      const w01 = deformations.get(i01)?.[2] ?? 0;
      return (1-xi)*(1-et)*w00 + xi*(1-et)*w10 + xi*et*w11 + (1-xi)*et*w01;
    }
    for (const rp of REF_POINTS_IN) {
      const xm = rp.x * IN_TO_M, ym = rp.y * IN_TO_M;
      const w_m = bilinearW(xm, ym);
      const w_in = Math.abs(w_m) / IN_TO_M;
      const key = rp.label.split(" ")[0] as "P1"|"P2"|"P3"|"P4";
      const w_nav = (NAVIER_UL as any)[key] as number;
      const diff = (w_in / w_nav - 1) * 100;
      out[`${key} w_Hek/w_Navier`] = `${w_in.toFixed(4)} in / ${w_nav.toFixed(4)} in (${diff >= 0 ? "+" : ""}${diff.toFixed(2)}%)`;
    }
    return out;
  },
  runModal(p, states, modalPanel) {
    const nodes = states.nodes.val;
    const elements = states.elements.val;
    const ni = states.nodeInputs.val;
    const ei = states.elementInputs.val;
    if (!nodes.length || !elements.length || !ni.supports?.size || !ei.densities?.size) return;
    try {
      const out = modalAnalysis(nodes, elements, ni, ei, 12);
      modalPanel.render(out, {
        title: `SAFE Ex.1 SS Plate ${A_FT}'×${B_FT}'×${T_IN}"`,
        properties: [`E=20.7 GPa  ν=0.3  ρ=24 kN/m³`],
      });
      console.log(`[SAFE Ex.1 Modal] f₁=${out.frequencies[0]?.toFixed(4)} Hz, T₁=${(1/out.frequencies[0]).toFixed(4)} s`);
    } catch (e: any) {
      console.warn("Modal SAFE Ex.1 error:", e.message);
    }
  },
};
