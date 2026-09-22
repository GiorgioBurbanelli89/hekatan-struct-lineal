/**
 * Plane Element — Plane Stress 2D puro (CSi-style Plane Q4)
 *
 * Solver: `planeQ4Solve` nativo (TS puro, 2 DOFs/nodo: ux, uy, sin drilling).
 *   - Formulación Q4 isoparamétrica + 2×2 Gauss integration
 *   - Constitutiva plane stress: D = E/(1-ν²) · [[1,ν,0],[ν,1,0],[0,0,(1-ν)/2]]
 *   - BCs via penalización (1e12 × max diag K)
 *   - Solver LU denso (suficiente para mallas ≤ 500 DOFs)
 *
 * Caso: cantiléver vertical rectangular bajo carga concentrada en la punta
 * (muro de contención, sección de presa, pared de tanque).
 *
 * Para análisis modal usa `deform` + `modalAnalysis` (shell Q4 MITC4 con masa
 * consistente) bloqueando DOFs fuera-de-plano — el solver modal nativo del
 * shellQ4 incluye membrana+flexión+drilling, pero al bloquear Uy, Rx, Ry, Rz
 * quedan sólo los modos plane-stress.
 *
 * Verificación analítica (cantiléver con F en la punta):
 *   δ_top ≈ F·H³/(3·E·I) + κ·F·H/(G·A)
 * con I = t·W³/12, A = t·W, G = E/(2(1+ν)), κ=1.2.
 *
 * CSI Analysis Reference Manual: "Plane Element" — quadrilateral 2D element
 * for plane-stress or plane-strain analysis.
 */
import {
  planeQ4Solve,
  deform,
  modalAnalysis,
  type Node,
  type Element,
} from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

export const plane: ExampleDef = {
  id: "plane",
  name: "Plane Element (Q4 plane stress)",
  category: "2️⃣ Shells · 🕸 Membranas",
  defaultShellResult: "vonMises",
  availableShellResults: [
    "none", "pressure",
    "membraneXX", "membraneYY", "membraneXY",
    "membranePrincipalMax", "membranePrincipalMin", "vonMises",
    "tranverseShearX", "tranverseShearY", "transverseShearMax",
    "bendingXX", "bendingYY", "bendingXY",
    "bendingPrincipalMax", "bendingPrincipalMin",
    "displacementX", "displacementY", "displacementZ",
  ],
  hasModal: true,
  params: {
    // Plano vertical X-Z: X horizontal, Z vertical (altura). Y = normal (espesor).
    // Todos los rangos tienen el default CENTRADO entre min y max para que el
    // usuario pueda bajar hasta cero (o cerca) o subir hasta el máximo con la barra.
    W:  { default: 3.0,  min: 1,    max: 6,    step: 0.25, label: "W ancho X (m)" },
    H:  { default: 6.0,  min: 2,    max: 12,   step: 0.25, label: "H altura Z (m)" },
    t:  { default: 0.30, min: 0.05, max: 0.60, step: 0.05, label: "t espesor (m)" },
    E:  { default: 25e6, min: 10e6, max: 50e6, step: 1e6,  label: "E (kN/m²)" },
    nu: { default: 0.20, min: 0.10, max: 0.40, step: 0.01, label: "ν" },
    // F lateral realista: viento/sísmico en muro de 3×6m = ~200 kN → rango 0-400 centrado.
    // unitType:"force" → el workspace convierte entre kN/tonf/kip automáticamente
    // y el label se actualiza a "F lateral tope (kN)" / "(tonf)" / "(kip)" según la unidad.
    F:  { default: 200,  min: 0,    max: 400,  step: 10,   label: "F lateral tope", unitType: "force" },
    nx: { default: 8,    min: 4,    max: 20,   step: 1,    label: "nx elem X" },
    nz: { default: 16,   min: 6,    max: 30,   step: 1,    label: "nz elem Z" },
  },
  build(p, states) {
    const nx = Math.round(p.nx), nz = Math.round(p.nz);

    // ── 1. Resolver plane stress con planeQ4Solve (2 DOFs/nodo) ─────
    // El solver trabaja en plano (x,y). Luego remapeo (x,y) → (X, 0, Z) global.
    const topRightNode2D = nz * (nx + 1) + nx;  // esquina (x=W, y=H) = fila nz, col nx
    const plane2D = planeQ4Solve({
      E: p.E,
      nu: p.nu,
      thickness: p.t,
      meshLx: p.W,
      meshLy: p.H,
      meshNx: nx,
      meshNy: nz,
      bcType: "cantilever-bottom",
      pointLoads: [{ node: topRightNode2D, fx: p.F, fy: 0 }],
    });

    // ── 2. Remap nodos 2D → 3D global (plano X-Z, Y=0) ──────────────
    const nodes: Node[] = plane2D.nodeResults.map((n) => [n.x, 0, n.y]);
    const elements: Element[] = plane2D.elementResults.map((e) => e.nodes);
    states.nodes.val = nodes;
    states.elements.val = elements;

    // ── 3. Supports FÍSICOS: solo la base empotrada (cantiléver vertical) ──
    // Como usamos `planeQ4Solve` (2 DOFs/nodo reales, sin out-of-plane), no
    // necesitamos locks artificiales en los demás nodos — la formulación Q4
    // plane stress no tiene Uy/Rx/Ry/Rz como variables.
    // Para el modal analysis (que sí usa shell Q4 6-DOF), los locks
    // out-of-plane se aplican DENTRO de runModal() sin contaminar el display.
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    nodes.forEach((n, i) => {
      if (Math.abs(n[2]) < 1e-6) {
        supports.set(i, [true, true, true, true, true, true]);   // base empotrada
      }
    });
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const topRightIdx = nodes.findIndex(
      (n) => Math.abs(n[0] - p.W) < 1e-6 && Math.abs(n[2] - p.H) < 1e-6,
    );
    if (topRightIdx >= 0) loads.set(topRightIdx, [p.F, 0, 0, 0, 0, 0]);
    states.nodeInputs.val = { supports, loads };

    // ── 4. Element inputs (para viewer + modal) ─────────────────────
    const thicknesses = new Map<number, number>();
    const elasticities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const densities = new Map<number, number>();
    elements.forEach((_, i) => {
      thicknesses.set(i, p.t);
      elasticities.set(i, p.E);
      poissons.set(i, p.nu);
      densities.set(i, 24 / 9.81);   // t/m3 de MASA, no kN/m3
    });
    states.elementInputs.val = { thicknesses, elasticities, poissonsRatios: poissons, densities };

    // ── 5. Mapear deformaciones (ux, uy) → (Ux, 0, Uz) global ───────
    const deformations = new Map<number, [number, number, number, number, number, number]>();
    plane2D.nodeResults.forEach((n, i) => {
      deformations.set(i, [n.ux, 0, n.uy, 0, 0, 0]);   // ux→Ux, uy(local)→Uz(global)
    });
    states.deformOutputs.val = { deformations };

    // ── 6. Esfuerzos in-plane (σxx, σyy, τxy) → membrane* del viewer ─
    const membraneXX = new Map<number, number[]>();
    const membraneYY = new Map<number, number[]>();
    const membraneXY = new Map<number, number[]>();
    const vonMises   = new Map<number, number[]>();
    plane2D.elementResults.forEach((er, i) => {
      membraneXX.set(i, [er.sigma_xx, er.sigma_xx, er.sigma_xx, er.sigma_xx]);
      membraneYY.set(i, [er.sigma_yy, er.sigma_yy, er.sigma_yy, er.sigma_yy]);
      membraneXY.set(i, [er.tau_xy,   er.tau_xy,   er.tau_xy,   er.tau_xy]);
      vonMises.set(i,   [er.vonMises, er.vonMises, er.vonMises, er.vonMises]);
    });
    states.analyzeOutputs.val = { membraneXX, membraneYY, membraneXY, vonMises };
    states.objects3D.val = [];

    // ── 7. Log de verificación analítica ─────────────────────────────
    const I = p.t * Math.pow(p.W, 3) / 12;
    const A = p.t * p.W;
    const G = p.E / (2 * (1 + p.nu));
    const delta_flex = p.F * Math.pow(p.H, 3) / (3 * p.E * I);
    const delta_shear = 1.2 * p.F * p.H / (G * A);
    const delta_teo = delta_flex + delta_shear;
    const ux_fem = topRightIdx >= 0 ? (deformations.get(topRightIdx)?.[0] ?? 0) : 0;
    console.log(
      `[Plane Q4] W=${p.W}m H=${p.H}m t=${p.t}m F=${p.F}kN → ` +
      `δ_top FEM=${(ux_fem * 1000).toFixed(3)} mm | ` +
      `teórico flex+shear=${(delta_teo * 1000).toFixed(3)} mm ` +
      `(flex=${(delta_flex * 1000).toFixed(3)}, shear=${(delta_shear * 1000).toFixed(3)}) | ` +
      `max σvm=${plane2D.maxVonMises.toFixed(1)} kN/m² | nDOF=${plane2D.nDOF}`,
    );
  },
  runModal(p, states, modalPanel) {
    // Modal usa shell Q4 (tiene masa consistente). Para obtener modos plane-stress
    // LIMPIOS (sin fantasmas out-of-plane ni torsión), construimos aquí un mapa de
    // supports EXTENDIDO — base empotrada + Uy/Rx/Ry/Rz bloqueados en todos los
    // nodos libres. Este mapa NO se guarda en states.nodeInputs, así el viewer
    // sigue mostrando solo los apoyos físicos reales (base).
    const nodes = states.nodes.val;
    const elements = states.elements.val;
    const ni = states.nodeInputs.val;
    const ei = states.elementInputs.val;
    if (!nodes.length || !elements.length || !ei.densities?.size) return;

    const modalSupports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    nodes.forEach((n, i) => {
      if (Math.abs(n[2]) < 1e-6) {
        modalSupports.set(i, [true, true, true, true, true, true]);   // base 6DOF
      } else {
        modalSupports.set(i, [false, true, false, true, true, true]); // lock Uy, Rx, Ry, Rz
      }
    });
    const modalNi = { ...ni, supports: modalSupports };

    try {
      const out = modalAnalysis(nodes, elements, modalNi, ei, 12);
      modalPanel.render(out, {
        title: `Plane Q4 ${p.W}×${p.H}m t=${p.t}m`,
        properties: [`E=${(p.E / 1e6).toFixed(1)} GPa  ν=${p.nu}  ρ=24 kN/m³`],
      });
      console.log(`[Plane Q4 Modal] f₁ = ${out.frequencies[0]?.toFixed(4)} Hz`);
    } catch (e: any) {
      console.warn("Modal plane error:", e.message);
    }
    void deform;
  },
};
