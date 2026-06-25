/**
 * Benchmark SAFE Verification Example 4 — Rectangular Plate on Elastic Beams
 *
 * Ref:  C:\Program Files\Computers and Structures\SAFE 20\Manuals\Verification\
 *       Analysis\Example 04.pdf  (Timoshenko-Woinowsky 1959 + ACI 318-95 DDM)
 *
 * Geometría:  a × b × t  =  360" × 240" × 8"  (9.144 × 6.096 × 0.2032 m)
 * Material:   E = 3000 ksi (20.684 GPa),  ν = 0.3
 *
 * BCs:
 *   - X = 0 y X = a:    Simply supported  (w = 0, rotaciones libres)
 *   - Y = 0 y Y = b:    Vigas elásticas con flexión vertical (Iz = Ib), SIN torsión (J ≈ 0)
 *
 * Carga UL:   q = 100 psf = 4.7880 kN/m²  (uniforme descendente)
 *
 * Rigidez relativa:  λ = E·Ib / (a·D)   con D = E·h³/12(1-ν²)
 *   λ = 4 → vigas relativamente rígidas (PDF Tabla 4-1 reference)
 *
 * Resultados teóricos SAFE Tabla 4-1 (en X=180 = centro X):
 *   P1  Y=120  (centro)         = 0.18572 in
 *   P2  Y=60   (cuadrante)      = 0.15349 in
 *   P3  Y=0    (sobre la viga)  = 0.07365 in
 *
 * Comparativa SAFE 8×8 Thin: P1=0.1848 (-0.5%), P3=0.0722 (-2.0%)
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

// ── Conversiones ──
const IN_TO_M = 0.0254;
const FT_TO_M = 0.3048;
const PSF_TO_KPA = 4.7880e-2;
const KSI_TO_KPA = 6.89476e3;

// ── Geometría (fija, benchmark) ──
const A_FT = 30, B_FT = 20, T_IN = 8;
const Lx = A_FT * FT_TO_M;        // 9.144 m
const Ly = B_FT * FT_TO_M;        // 6.096 m
const t  = T_IN * IN_TO_M;        // 0.2032 m
const E  = 3000 * KSI_TO_KPA;     // 20,684,280 kN/m²
const nu = 0.3;
const D  = E * t**3 / (12 * (1 - nu**2));      // 15,880 kN·m (plate flexural rigidity)
const q_kPa = 100 * PSF_TO_KPA;   // 4.7880 kN/m²

// ── Puntos de referencia SAFE Tabla 4-1 ──
const REF_POINTS_IN = [
  { x: 180, y: 120, label: "P1 (180,120) — CENTRO de placa" },
  { x: 180, y: 60,  label: "P2 (180,60) — cuadrante" },
  { x: 180, y: 0,   label: "P3 (180,0) — sobre la viga elástica" },
];

const TEORICO_W = { "P1": 0.18572, "P2": 0.15349, "P3": 0.07365 };
const SAFE_8x8_THIN = { "P1": 0.1848, "P2": 0.1523, "P3": 0.0722 };

export const benchmarkSafeEx04PlateBeams: ExampleDef = {
  id: "benchmark-safe-ex04-plate-beams",
  name: "SAFE Ex.4 · Placa SS + vigas elásticas (Timoshenko, λ=4)",
  category: "🏁 Benchmarks · 2️⃣ Áreas · 📘 SAFE",
  benchmark: true,
  defaultShellResult: "displacementZ",
  availableShellResults: ["displacementZ", "bendingXX", "bendingYY", "bendingXY",
                          "shearX", "shearY", "vonMises"],
  hasModal: true,
  params: {
    lambda: {
      default: 4, min: 0.5, max: 20, step: 0.5,
      label: "λ rigidez relativa viga/losa",
    },
    mesh: {
      default: 8,
      label: "Mesh (nx = ny)",
      options: { "4×4": 4, "8×8": 8, "12×12": 12, "16×16": 16 },
    },
  },
  build(p, states) {
    const lambda = p.lambda;
    const Ib = lambda * Lx * D / E;   // Iz_viga derivado de λ
    const meshN = Math.round(p.mesh);
    const nx = meshN, ny = meshN;
    const dx = Lx / nx, dy = Ly / ny;

    // ── Mesh: nodes uniformes (nx+1) × (ny+1) ──
    const nodes: Node[] = [];
    for (let j = 0; j <= ny; j++)
      for (let i = 0; i <= nx; i++)
        nodes.push([i * dx, j * dy, 0]);

    // ── Shell Q4 elements ──
    const elements: Element[] = [];
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) {
        const n0 = j * (nx + 1) + i;
        elements.push([n0, n0 + 1, n0 + 1 + (nx + 1), n0 + (nx + 1)]);
      }
    const nShells = elements.length;

    // ── Edge beam frames: bordes Y=0 e Y=b ──
    for (let i = 0; i < nx; i++) {
      elements.push([i, i + 1]);                           // Y=0
    }
    for (let i = 0; i < nx; i++) {
      const off = ny * (nx + 1);
      elements.push([off + i, off + i + 1]);               // Y=b
    }

    // ── Supports: SS en X=0 y X=a (sólo w=0; rotaciones y in-plane libres) ──
    // PDF: "modeled as line supports with a large vertical stiffness and zero
    // rotational stiffness". NO fijar Ux/Uy (sino over-constrain in-plane).
    // Para anti-singularidad rigid body in-plane, fijamos Ux,Uy SOLO en 1 esquina.
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (let j = 0; j <= ny; j++) {
      const nLeft  = j * (nx + 1);
      const nRight = j * (nx + 1) + nx;
      supports.set(nLeft,  [false, false, true, false, false, false]);
      supports.set(nRight, [false, false, true, false, false, false]);
    }
    // Anti-RBM in-plane: anchor 1 corner en Ux,Uy + otra esquina en Uy
    supports.set(0,  [true, true, true, false, false, false]);
    supports.set(nx, [false, true, true, false, false, false]);

    // ── Loads: q uniforme descendente, tributarias por nodo (corner 0.25, edge 0.5, int 1.0) ──
    const loads = new Map<number, [number, number, number, number, number, number]>();
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        const onEdgeX = (i === 0 || i === nx);
        const onEdgeY = (j === 0 || j === ny);
        const factor = (onEdgeX && onEdgeY) ? 0.25 : (onEdgeX || onEdgeY) ? 0.5 : 1.0;
        const idx = j * (nx + 1) + i;
        loads.set(idx, [0, 0, -q_kPa * dx * dy * factor, 0, 0, 0]);
      }
    }

    // ── Element properties ──
    const thicknesses = new Map<number, number>();
    const elasticities = new Map<number, number>();
    const poissons     = new Map<number, number>();
    const areas        = new Map<number, number>();
    const Iz           = new Map<number, number>();
    const Iy           = new Map<number, number>();
    const J            = new Map<number, number>();
    const Gm           = new Map<number, number>();
    const densities    = new Map<number, number>();
    const sectionShapes = new Map<number, any>();
    const orientations = new Map<number, [number, number, number]>();

    // Shells (índices 0 .. nShells-1)
    for (let i = 0; i < nShells; i++) {
      thicknesses.set(i, t);
      elasticities.set(i, E);
      poissons.set(i, nu);
      densities.set(i, 0);       // PDF: self weight is NOT included
    }

    // Edge beams (índices nShells .. end).
    // PDF: vigas resisten flexión vertical (Ib about horizontal axis perpendicular),
    // NO torsional rigidity (J ≈ 0).
    //
    // Convención Hekatan con orientations=[0,0,1] (local Z = global +Z vertical):
    //   local X = global X (a lo largo del frame)
    //   local Y = horizontal perpendicular al frame
    //   local Z = vertical
    //   → flexión vertical (en plano XZ) controlada por Iy (about local Y axis)
    //   → flexión horizontal (en plano XY) controlada por Iz (about local Z axis)
    //
    // Sección visualización: bw=0.40 m fijo, hw derivado de Iy = bw·hw³/12 = Ib.
    const bw_VIGA = 0.40;
    const hw_VIGA = Math.pow(12 * Ib / bw_VIGA, 1/3);
    const A_VIGA = bw_VIGA * hw_VIGA;
    const Iz_VIGA_horiz = hw_VIGA * Math.pow(bw_VIGA, 3) / 12;   // weak axis (horiz bending)
    const J_VIGA = 1e-8;                                          // PDF: NO torsional
    const G_mod = E / (2 * (1 + nu));
    for (let e = nShells; e < elements.length; e++) {
      elasticities.set(e, E);
      poissons.set(e, nu);
      Gm.set(e, G_mod);
      areas.set(e, A_VIGA);
      Iy.set(e, Ib);                  // ← VERTICAL BENDING control (this is Ib of PDF)
      Iz.set(e, Iz_VIGA_horiz);       // ← horizontal bending (weak axis)
      J.set(e, J_VIGA);
      densities.set(e, 0);
      sectionShapes.set(e, { type: "rect", b: bw_VIGA, h: hw_VIGA });
      orientations.set(e, [0, 0, 1]);  // local Z = vertical → local Y controls vertical bending
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      elasticities, poissonsRatios: poissons,
      areas, momentsOfInertiaZ: Iz, momentsOfInertiaY: Iy,
      torsionalConstants: J, shearModuli: Gm,
      thicknesses, densities, sectionShapes, orientations,
    };

    try {
      states.deformOutputs.val = deform(
        states.nodes.val, states.elements.val,
        states.nodeInputs.val, states.elementInputs.val,
      );
      states.analyzeOutputs.val = analyze(
        states.nodes.val, states.elements.val,
        states.elementInputs.val, states.deformOutputs.val,
      );

      // ── Interpolación bilineal w(x,y) ──
      const deformations = states.deformOutputs.val.deformations;
      function bilinearW(xt: number, yt: number): number {
        const ix = Math.min(nx - 1, Math.max(0, Math.floor(xt / dx)));
        const jy = Math.min(ny - 1, Math.max(0, Math.floor(yt / dy)));
        const xi = (xt - ix * dx) / dx;
        const et = (yt - jy * dy) / dy;
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

      // ── Log table ──
      console.log(`\n[SAFE Ex.4 · ${nx}×${ny}]  Geom ${A_FT}'×${B_FT}'×${T_IN}"  E=${(E/1e6).toFixed(1)} GPa  ν=${nu}`);
      console.log(`  q = ${q_kPa.toFixed(3)} kN/m² (= 100 psf)`);
      console.log(`  λ = ${lambda} → Ib = ${(Ib*1e6).toFixed(2)} × 10⁻⁶ m⁴ → viga ${(bw_VIGA*100).toFixed(1)}cm × ${(hw_VIGA*100).toFixed(0)}cm (J≈0)`);
      console.log(`  Punto                          X(in) Y(in) w_Hek(in)  w_Teor(in) Δ%`);
      for (const rp of REF_POINTS_IN) {
        const xm = rp.x * IN_TO_M, ym = rp.y * IN_TO_M;
        const w_m = bilinearW(xm, ym);
        const w_in_hek = Math.abs(w_m) / IN_TO_M;
        const key = rp.label.split(" ")[0] as "P1"|"P2"|"P3";
        const w_teor = (TEORICO_W as any)[key];
        const diff = (w_in_hek / w_teor - 1) * 100;
        console.log(`  ${rp.label.padEnd(40)} ${rp.x.toString().padStart(3)} ${rp.y.toString().padStart(3)}  ${w_in_hek.toFixed(4)}     ${w_teor.toFixed(4)}    ${diff >= 0 ? "+" : ""}${diff.toFixed(2)}%`);
      }
    } catch (err) {
      console.error("[SAFE Ex.4 solver error]:", err);
    }
    states.objects3D.val = [];
  },
  computedLabels: (p, states) => {
    const out: Record<string, string> = {};
    const deformations = states.deformOutputs.val?.deformations;
    if (!deformations) return out;
    const meshN = Math.round(p.mesh);
    const nx = meshN, ny = meshN;
    const dx = Lx / nx, dy = Ly / ny;
    function bilinearW(xt: number, yt: number): number {
      const ix = Math.min(nx - 1, Math.max(0, Math.floor(xt / dx)));
      const jy = Math.min(ny - 1, Math.max(0, Math.floor(yt / dy)));
      const xi = (xt - ix * dx) / dx;
      const et = (yt - jy * dy) / dy;
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
      const key = rp.label.split(" ")[0] as "P1"|"P2"|"P3";
      const w_teor = (TEORICO_W as any)[key];
      const diff = (w_in / w_teor - 1) * 100;
      out[`${key} w_Hek/teor`] = `${w_in.toFixed(4)} / ${w_teor.toFixed(4)} in (${diff >= 0 ? "+" : ""}${diff.toFixed(2)}%)`;
    }
    return out;
  },
  runModal(p, states, modalPanel) {
    const nodes = states.nodes.val;
    const elements = states.elements.val;
    const ni = states.nodeInputs.val;
    const ei = states.elementInputs.val;
    if (!nodes.length || !elements.length || !ni.supports?.size || !ei.densities?.size) return;
    // Modal requires mass. Re-set densidades para análisis dinámico.
    const dens = new Map<number, number>(ei.densities);
    for (const [k, _] of dens) dens.set(k, 24);
    try {
      const out = modalAnalysis(nodes, elements, ni, { ...ei, densities: dens }, 12);
      modalPanel.render(out, {
        title: `SAFE Ex.4 Placa+Vigas ${A_FT}'×${B_FT}'×${T_IN}"  λ=${p.lambda}`,
        properties: [`E=20.7 GPa  ν=0.3`],
      });
      console.log(`[SAFE Ex.4 Modal] f₁=${out.frequencies[0]?.toFixed(4)} Hz, T₁=${(1/out.frequencies[0]).toFixed(4)} s`);
    } catch (e: any) {
      console.warn("Modal SAFE Ex.4 error:", e.message);
    }
  },
};
