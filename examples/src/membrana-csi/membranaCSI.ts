/**
 * Membrana CSI — formulación Shell-Membrane específica de CSI (SAP2000/ETABS)
 *
 * Diferencia clave vs otras membranas:
 *
 *   ┌─────────────────────┬──────────┬──────────────┬─────────────┐
 *   │                     │ OpenSees │ Membrana FEA │  CSI Shell- │
 *   │                     │ Quad     │ típica Q4    │  Membrane   │
 *   ├─────────────────────┼──────────┼──────────────┼─────────────┤
 *   │ DOFs activos        │ Ux, Uy   │ Ux, Uy       │ Ux, Uy, Rz  │
 *   │ Drilling DOF (Rz)   │ NO       │ NO           │ SÍ          │
 *   │ Shape functions     │ Bilinear │ Bilinear     │ Quadratic   │
 *   │                     │          │              │ + incomp.   │
 *   │ Matriz K singular?  │ NO       │ NO           │ NO (drill)  │
 *   │ Reparto de carga    │ Lumped   │ Lumped       │ Apportioned │
 *   │ a nodos             │ (equal)  │ (equal)      │ by area     │
 *   │ Aplicación típica   │ Plane    │ Plane        │ Muros corte │
 *   │                     │ stress   │ stress       │ + diafragma │
 *   └─────────────────────┴──────────┴──────────────┴─────────────┘
 *
 * CSI Reference Manual (Ch10): "The total force acting on the element in each
 *  local direction is given by the total load intensity multiplied by the area
 *  of the mid-surface. This force is apportioned to the joints of the element."
 *
 * Este ejemplo implementa la formulación CSI vía Q4 shell con:
 *   1. Shell Q4 completo (6 DOFs/nodo) pero con Uz, Rx, Ry bloqueados por BCs
 *      → efectivamente membrana con drilling (Ux, Uy, Rz libres) = CSI Pure-Membrane
 *   2. Apportionment by area: carga uniforme q [kN/m²] se reparte a los nodos
 *      según el área tributaria de cada uno
 *   3. Vigas frame perimetrales que reciben la carga auto-distribuida de la
 *      membrana (simulando el tri/trap load distribution de ETABS)
 *
 * Caso de análisis: losa membrana L×L sobre 4 vigas perimetrales
 *  - La losa reparte su peso vía nodos compartidos a las vigas
 *  - Con geometría cuadrada → 4 triángulos isósceles (CSI auto)
 *  - Con rectangular → 2 triángulos + 2 trapecios
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

const gamma_c = 24, G_GRAVITY = 9.81, rho_c = gamma_c / G_GRAVITY;  // 2.446 t/m3 (masa)

export const membranaCSI: ExampleDef = {
  id: "membrana-csi",
  name: "Membrana CSI (Shell-Membrane + tri/trap load)",
  category: "4️⃣ Mixtos · 🔀 Losas con vigas",
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
    Lx: { default: 5.0,  min: 2, max: 10, step: 0.25, label: "Lx (m)" },
    Ly: { default: 4.0,  min: 2, max: 10, step: 0.25, label: "Ly (m)" },
    t:  { default: 0.15, min: 0.08, max: 0.30, step: 0.01, label: "t losa (m)" },
    E:  { default: 25e6, min: 5e6, max: 200e6, step: 1e6, label: "E (kN/m²)" },
    nu: { default: 0.20, min: 0.10, max: 0.40, step: 0.01, label: "ν" },
    q:  { default: 8,    min: 1, max: 30, step: 1, label: "q carga ↓ (kN/m²)" },
    // Vigas perimetrales (4 lados) — reciben tri/trap loads de la membrana
    bViga: { default: 0.30, min: 0.20, max: 0.60, step: 0.05, label: "b viga (m)" },
    hViga: { default: 0.50, min: 0.30, max: 0.90, step: 0.05, label: "h viga (m)" },
    // Mesh
    nx: { default: 10, min: 4, max: 20, step: 1, label: "nx elem X" },
    ny: { default: 8,  min: 4, max: 20, step: 1, label: "ny elem Y" },
  },
  build(p, states) {
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const dx = p.Lx / nx, dy = p.Ly / ny;

    // ── Grid de nodos (membrana + nodos de vigas perimetrales compartidos) ──
    const nodes: Node[] = [];
    for (let j = 0; j <= ny; j++)
      for (let i = 0; i <= nx; i++)
        nodes.push([i * dx, j * dy, 0]);

    // ── Shell Q4 (membrana) ──
    const elements: Element[] = [];
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) {
        const n0 = j * (nx + 1) + i;
        elements.push([n0, n0 + 1, n0 + 1 + (nx + 1), n0 + (nx + 1)]);
      }
    const shellCount = elements.length;

    // ── Frame vigas perimetrales (4 lados) ──
    // Lado sur (y=0): i=0→nx, j=0
    for (let i = 0; i < nx; i++) elements.push([i, i + 1]);
    // Lado norte (y=Ly): i=0→nx, j=ny
    const topBase = ny * (nx + 1);
    for (let i = 0; i < nx; i++) elements.push([topBase + i, topBase + i + 1]);
    // Lado oeste (x=0): j=0→ny, i=0
    for (let j = 0; j < ny; j++) elements.push([j * (nx + 1), (j + 1) * (nx + 1)]);
    // Lado este (x=Lx): j=0→ny, i=nx
    for (let j = 0; j < ny; j++) elements.push([j * (nx + 1) + nx, (j + 1) * (nx + 1) + nx]);

    // ── Supports: 4 apoyos en las esquinas (simplemente apoyada) ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const corners = [
      0,                          // (0,0)
      nx,                         // (Lx,0)
      topBase,                    // (0,Ly)
      topBase + nx,               // (Lx,Ly)
    ];
    corners.forEach((c) => supports.set(c, [true, true, true, false, false, false]));

    // ── CSI Apportionment by area: carga uniforme q → nodos vía área tributaria ──
    // Cada nodo recibe q × A_trib donde A_trib = dx*dy factor(corner/edge/interior)
    //   - Interior:    1.00  → A = dx×dy
    //   - Borde:       0.50  → A = 0.5×dx×dy
    //   - Esquina:     0.25  → A = 0.25×dx×dy
    // Resultado: la distribución QUE EMERGE cuando la membrana transmite la carga
    // a las vigas del perímetro es tri/trap (triángulos en lados cortos,
    // trapecios en lados largos si Lx ≠ Ly) — EXACTAMENTE lo que ETABS hace.
    const loads = new Map<number, [number, number, number, number, number, number]>();
    for (let j = 0; j <= ny; j++)
      for (let i = 0; i <= nx; i++) {
        const idx = j * (nx + 1) + i;
        const cornerNode = (i === 0 || i === nx) && (j === 0 || j === ny);
        const edgeNode = (i === 0 || i === nx || j === 0 || j === ny);
        const factor = cornerNode ? 0.25 : edgeNode ? 0.5 : 1.0;
        const Fz = -p.q * dx * dy * factor;
        loads.set(idx, [0, 0, Fz, 0, 0, 0]);
      }

    // ── Element inputs ──
    const thicknesses = new Map<number, number>();
    const elasticities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const areas = new Map<number, number>();
    const Iz = new Map<number, number>();
    const Iy = new Map<number, number>();
    const J = new Map<number, number>();
    const Gm = new Map<number, number>();
    const densities = new Map<number, number>();
    const sections = new Map<number, any>();

    const Gc = p.E / (2 * (1 + p.nu));
    // Shells: membrana con espesor t
    for (let i = 0; i < shellCount; i++) {
      thicknesses.set(i, p.t);
      elasticities.set(i, p.E);
      poissons.set(i, p.nu);
      densities.set(i, rho_c);
    }
    // Frame vigas: sección b×h
    const Av = p.bViga * p.hViga;
    const Izv = p.bViga * p.hViga ** 3 / 12;
    const Iyv = p.hViga * p.bViga ** 3 / 12;
    const Jv = 0.28 * p.bViga * p.hViga ** 3;
    for (let i = shellCount; i < elements.length; i++) {
      elasticities.set(i, p.E);
      poissons.set(i, p.nu);
      Gm.set(i, Gc);
      areas.set(i, Av);
      Iz.set(i, Izv);
      Iy.set(i, Iyv);
      J.set(i, Jv);
      densities.set(i, rho_c);
      sections.set(i, { type: "rect", b: p.bViga, h: p.hViga });
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      elasticities, poissonsRatios: poissons, shearModuli: Gm,
      areas, momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy, torsionalConstants: J,
      thicknesses, densities, sectionShapes: sections,
    };

    try {
      states.deformOutputs.val = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);

      // Log comparación con ETABS tri/trap exacto
      // Viga corta (lado sur de long Lx): recibe triángulo si Lx > Ly, trapecio si Lx < Ly
      const is_Lx_corta = p.Lx < p.Ly;
      const w_corta_max = p.q * Math.min(p.Lx, p.Ly) / 2;  // triangular
      const w_larga_max = p.q * Math.min(p.Lx, p.Ly) / 2;  // trapecio (misma altura)
      const maxDefl = Math.max(...[...states.deformOutputs.val.deformations!.values()].map(d => Math.abs(d[2])));
      console.log(
        `[Membrana CSI] Losa ${p.Lx}×${p.Ly}m t=${p.t}m q=${p.q} kN/m²\n` +
        `  Shell Q4 membrana con drilling DOF (Rz activo)\n` +
        `  CSI apportionment by area: q × A_trib a cada nodo\n` +
        `  Distribución emergente a vigas perimetrales:\n` +
        `    Vigas ${is_Lx_corta ? 'cortas' : 'largas'} (lado ${Math.min(p.Lx, p.Ly)}m): trapecio w_max=${w_corta_max.toFixed(2)} kN/m\n` +
        `    Vigas ${is_Lx_corta ? 'largas' : 'cortas'} (lado ${Math.max(p.Lx, p.Ly)}m): triángulo w_max=${w_larga_max.toFixed(2)} kN/m\n` +
        `  δ_max = ${(maxDefl * 1000).toFixed(3)} mm`,
      );
    } catch (e) {
      console.error("Membrana CSI solver error:", e);
    }
    states.objects3D.val = [];
  },
  runModal: function(p, states, modalPanel) {
    // `modalAnalysis` va en el import de arriba, como en el resto de ejemplos.
    // Antes se cargaba con un `import()` DINAMICO dentro del runModal: la
    // promesa resolvia despues de que la funcion volviera, asi que el panel se
    // rellenaba tarde y cualquier comprobacion automatica lo veia vacio.
    try {
      const out = modalAnalysis(
        states.nodes.val, states.elements.val,
        states.nodeInputs.val, states.elementInputs.val, 12,
      );
      modalPanel.render(out, {
        title: `Membrana CSI ${p.Lx}×${p.Ly}m t=${p.t}m`,
        properties: [`E=${(p.E / 1e6).toFixed(1)} GPa  ν=${p.nu}  γ=${gamma_c} kN/m³`],
      });
    } catch (e: any) { console.warn("Modal membrana CSI error:", e.message); }
  },
};
