/**
 * Triangular Plate — MITC3 Bathe (placa triangular con shear-tying).
 *
 * Demuestra el solver MITC3+ (Kim-Bathe 2014) sobre una placa rectangular
 * mallada en triángulos. Usa el módulo pure-TS `mitc3Solve` recién añadido
 * a Hekatan Struct Lineal.
 *
 * Caso: placa cuadrada empotrada en 4 bordes (clamped plate) bajo carga
 * distribuida, comparada con:
 *   - Solución analítica Timoshenko-Woinowsky §42 clamped square plate
 *   - plate-thick (Q4 MITC4) de Hekatan
 *
 * Referencias:
 *   - Kim-Bathe, Comp. Struct. 138 (2014) 12-23 [MITC3+]
 *   - Lee-Bathe, Comp. Struct. 82 (2004) 945-962 [MITC3 original]
 *   - Bathe, Finite Element Procedures 2nd Ed §5.4.2
 *   - Timoshenko & Woinowsky-Krieger, Theory of Plates and Shells §42
 */
import { mitc3Solve, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

export const triangularPlate: ExampleDef = {
  id: "triangular-plate",
  name: "Placa Triangular MITC3 (Bathe)",
  category: "2️⃣ Shells · 🧱 Placas",
  defaultShellResult: "displacementZ",
  availableShellResults: [
    "none", "pressure",
    "membraneXX", "membraneYY", "membraneXY",
    "membranePrincipalMax", "membranePrincipalMin", "vonMises",
    "tranverseShearX", "tranverseShearY", "transverseShearMax",
    "bendingXX", "bendingYY", "bendingXY",
    "bendingPrincipalMax", "bendingPrincipalMin",
    "displacementX", "displacementY", "displacementZ",
  ],
  hasModal: false,
  params: {
    // Geometría
    Lx: { default: 5.0, min: 2, max: 10, step: 0.5, label: "Lx (m)" },
    Ly: { default: 5.0, min: 2, max: 10, step: 0.5, label: "Ly (m)" },
    t:  { default: 0.15, min: 0.05, max: 0.50, step: 0.01, label: "t espesor (m)" },
    nx: { default: 8, min: 4, max: 20, step: 1, label: "nx divisiones X" },
    ny: { default: 8, min: 4, max: 20, step: 1, label: "ny divisiones Y" },
    // Material (hormigón ACI 318-22 default)
    E:  { default: 25e6, min: 5e6, max: 200e6, step: 1e6, label: "E (kN/m²)", folder: "Material" },
    nu: { default: 0.20, min: 0.10, max: 0.40, step: 0.01, label: "ν", folder: "Material" },
    // Carga
    q:  { default: -10, min: -50, max: 0, step: 1, label: "q distribuida (kN/m²)", folder: "Cargas" },
  },
  build(p, states) {
    const Lx = p.Lx, Ly = p.Ly;
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const dx = Lx / nx, dy = Ly / ny;

    // ── Generar grid de nodos 2D ──
    const nodes2D: [number, number][] = [];
    for (let j = 0; j <= ny; j++)
      for (let i = 0; i <= nx; i++)
        nodes2D.push([i * dx, j * dy]);

    // ── Triangular: 2 triángulos por cada celda cuadrada ──
    const elements2D: [number, number, number][] = [];
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const n0 = j * (nx + 1) + i;
        const n1 = n0 + 1;
        const n2 = n0 + (nx + 1);
        const n3 = n2 + 1;
        // Dos triángulos por cell (diagonal n0-n3):
        elements2D.push([n0, n1, n3]);    // triángulo inferior-derecho
        elements2D.push([n0, n3, n2]);    // triángulo superior-izquierdo
      }
    }

    // ── BCs: placa empotrada en los 4 bordes (clamped) ──
    const bcs: { node: number; dof: 0 | 1 | 2; value: number }[] = [];
    for (let j = 0; j <= ny; j++) {
      for (let i = 0; i <= nx; i++) {
        const idx = j * (nx + 1) + i;
        const isBorder = i === 0 || i === nx || j === 0 || j === ny;
        if (isBorder) {
          bcs.push({ node: idx, dof: 0, value: 0 });  // w = 0
          bcs.push({ node: idx, dof: 1, value: 0 });  // θx = 0
          bcs.push({ node: idx, dof: 2, value: 0 });  // θy = 0
        }
      }
    }

    // ── Resolver MITC3 ──
    let w_center = 0;
    try {
      const out = mitc3Solve({
        E: p.E,
        nu: p.nu,
        thickness: p.t,
        nodes: nodes2D,
        elements: elements2D,
        bcs,
        pressure: p.q,
      });

      // ── Mapear a estados del viewer (plano X-Y horizontal, Z out-of-plane) ──
      const nodes3D: Node[] = out.nodeResults.map((n) => [n.x, n.y, 0]);

      // Shell mesh: convertir triángulos MITC3 a Q4 degenerados (repeat último nodo)
      // para que hekatan-ui los renderice como shells. Alternativa: usar elementos triangulares.
      const elements3D: Element[] = out.elementResults.map((e) => e.nodes as unknown as Element);

      states.nodes.val = nodes3D;
      states.elements.val = elements3D;

      // ── Soportes visuales: los 4 bordes ──
      const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
      for (let j = 0; j <= ny; j++) {
        for (let i = 0; i <= nx; i++) {
          const idx = j * (nx + 1) + i;
          if (i === 0 || i === nx || j === 0 || j === ny) {
            supports.set(idx, [true, true, true, true, true, true]);
          }
        }
      }
      const loads = new Map<number, [number, number, number, number, number, number]>();
      states.nodeInputs.val = { supports, loads };

      // ── Element inputs (dummy thicknesses para viewer) ──
      const thicknesses = new Map<number, number>();
      const elasticities = new Map<number, number>();
      const poissons = new Map<number, number>();
      const densities = new Map<number, number>();
      elements3D.forEach((_, i) => {
        thicknesses.set(i, p.t);
        elasticities.set(i, p.E);
        poissons.set(i, p.nu);
        densities.set(i, 24 / 9.80665);
      });
      states.elementInputs.val = { thicknesses, elasticities, poissonsRatios: poissons, densities };

      // ── Deformations: (0, 0, w, thetaX, thetaY, 0) ──
      const deformations = new Map<number, [number, number, number, number, number, number]>();
      out.nodeResults.forEach((n, i) => {
        deformations.set(i, [0, 0, n.w, n.thetaX, n.thetaY, 0]);
      });
      states.deformOutputs.val = { deformations };

      // ── Bending moments por elemento (para colormap) ──
      const bendingXX = new Map<number, number[]>();
      const bendingYY = new Map<number, number[]>();
      const bendingXY = new Map<number, number[]>();
      out.elementResults.forEach((er, i) => {
        bendingXX.set(i, [er.Mxx, er.Mxx, er.Mxx]);
        bendingYY.set(i, [er.Myy, er.Myy, er.Myy]);
        bendingXY.set(i, [er.Mxy, er.Mxy, er.Mxy]);
      });
      states.analyzeOutputs.val = { bendingXX, bendingYY, bendingXY };
      states.objects3D.val = [];

      // ── Encontrar w en el centro (para comparar con solución analítica) ──
      const centerIdx = Math.floor(ny / 2) * (nx + 1) + Math.floor(nx / 2);
      w_center = Math.abs(out.nodeResults[centerIdx].w);

      // ── Log de verificación (placa cuadrada empotrada, Timoshenko §42) ──
      // w_max = α · q·a^4 / D   con α = 0.00126 para clamped square
      // D = E·t³/[12·(1-ν²)]
      const D = p.E * Math.pow(p.t, 3) / (12 * (1 - p.nu * p.nu));
      const a = Math.min(Lx, Ly);
      const alpha_clamped = 0.00126;
      const w_max_theo = alpha_clamped * Math.abs(p.q) * Math.pow(a, 4) / D;
      console.log(
        `[Triangular Plate MITC3] ${Lx}×${Ly}m, t=${p.t}m, q=${p.q}kN/m² → ` +
        `w_center FEM = ${(w_center * 1000).toFixed(3)} mm | ` +
        `teórico Timoshenko §42 (clamped a²) = ${(w_max_theo * 1000).toFixed(3)} mm | ` +
        `ratio = ${(w_center / w_max_theo).toFixed(3)}`,
      );
    } catch (e) {
      console.error("[Triangular Plate MITC3]", e);
    }
  },
  computedLabels(p, states) {
    const def = states.deformOutputs.rawVal?.deformations as Map<number, number[]> | undefined;
    if (!def) return { "w_center": "—" };
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const centerIdx = Math.floor(ny / 2) * (nx + 1) + Math.floor(nx / 2);
    const w = Math.abs(def.get(centerIdx)?.[2] ?? 0);

    // Teórico Timoshenko §42 para placa cuadrada empotrada
    const D = p.E * Math.pow(p.t, 3) / (12 * (1 - p.nu * p.nu));
    const a = Math.min(p.Lx, p.Ly);
    const w_theo = 0.00126 * Math.abs(p.q) * Math.pow(a, 4) / D;
    const ratio = w / w_theo;

    return {
      "── MITC3 (Bathe 2014) ──": "",
      "w_center FEM": `${(w * 1000).toFixed(4)} mm`,
      "w_max teórico Timoshenko §42": `${(w_theo * 1000).toFixed(4)} mm`,
      "Ratio FEM/teórico": `${ratio.toFixed(3)}`,
      "Elementos triangulares": `${(2 * nx * ny)}`,
      "Rigidez flexural D": `${(D / 1000).toFixed(1)} kN·m²`,
    };
  },
};
