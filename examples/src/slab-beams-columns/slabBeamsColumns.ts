/**
 * Slab + Vigas perimetrales + Columnas en esquinas
 * Hekatan Struct — equivalente a un edificio de 1 piso completo.
 *
 * Geometria:
 *   Losa horizontal Lx x Ly a elevacion h (Z = h)
 *   Vigas perimetrales horizontales en Z = h, conectadas a esquinas y nodos del borde de la losa
 *   4 columnas verticales en las esquinas, desde Z=0 hasta Z=h
 *   Empotrado en la base de las 4 columnas (Z=0)
 *
 * Carga: q uniforme sobre la losa (kN/m^2)
 */
import { deform, analyze, type Node } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

export const slabBeamsColumns: ExampleDef = {
  id: "slab-beams-columns",
  name: "Slab + Vigas + Columnas (1 piso completo)",
  category: "🏁 Benchmarks · 2️⃣ Áreas",
  benchmark: true,
  defaultShellResult: "bendingXX",
  availableShellResults: ["bendingXX", "bendingYY", "bendingXY",
                          "shearX", "shearY", "vonMises", "displacementZ"],
  params: {
    Lx: { default: 6.0, min: 2, max: 12, step: 0.5, label: "Lx (m)" },
    Ly: { default: 4.0, min: 2, max: 12, step: 0.5, label: "Ly (m)" },
    h:  { default: 3.0, min: 2, max: 6, step: 0.25, label: "h piso (m)" },
    t:  { default: 0.1, min: 0.05, max: 0.4, step: 0.01, label: "t losa (m)" },
    bW: { default: 0.30, min: 0.15, max: 0.6, step: 0.05, label: "viga b (m)" },
    bH: { default: 0.50, min: 0.20, max: 1.0, step: 0.05, label: "viga h (m)" },
    cS: { default: 0.30, min: 0.20, max: 0.6, step: 0.05, label: "col □ (m)" },
    E:  { default: 35e6, min: 1e6, max: 200e6, step: 1e6, label: "E (kN/m²)" },
    nu: { default: 0.15, min: 0.1, max: 0.4, step: 0.01, label: "ν" },
    q:  { default: 10, min: 1, max: 30, step: 1, label: "q ↓ (kN/m²)" },
    nx: { default: 6, min: 2, max: 12, step: 1, label: "nx" },
    ny: { default: 4, min: 2, max: 12, step: 1, label: "ny" },
    nz: { default: 3, min: 1, max: 8, step: 1, label: "nz col (segmentos)" },
  },
  build(p, states) {
    const Nx = Math.round(p.nx), Ny = Math.round(p.ny), Nz = Math.round(p.nz);
    const dx = p.Lx / Nx, dy = p.Ly / Ny, dz = p.h / Nz;

    // ── Nodos: grid de losa en Z=h + nodos intermedios de columnas (Z=0..h-dz) ──
    const nodes: Node[] = [];
    // (1) Grid losa en Z = h
    const slabNodeId = (i: number, j: number) => j * (Nx + 1) + i;
    for (let j = 0; j <= Ny; j++) {
      for (let i = 0; i <= Nx; i++) {
        nodes.push([i*dx, j*dy, p.h]);
      }
    }
    const nSlabNodes = nodes.length;   // (Nx+1)(Ny+1)

    // (2) Nodos de columnas (intermedios + base) en cada esquina
    // Cada columna: Nz segmentos → Nz nodos extra (intermedios + base), el top reusa slab corner
    const cornerSlabIdxs = [slabNodeId(0, 0), slabNodeId(Nx, 0),
                            slabNodeId(0, Ny), slabNodeId(Nx, Ny)];
    const cornerXY = [[0, 0], [p.Lx, 0], [0, p.Ly], [p.Lx, p.Ly]];
    // Para cada columna almacenamos la lista de nodos (desde top=slab corner hasta base Z=0)
    const colNodeIdsPerCol: number[][] = [[], [], [], []];
    for (let c = 0; c < 4; c++) {
      colNodeIdsPerCol[c].push(cornerSlabIdxs[c]);  // top
      const [xc, yc] = cornerXY[c];
      for (let k = 1; k <= Nz; k++) {
        const z = p.h - k * dz;
        nodes.push([xc, yc, z]);
        colNodeIdsPerCol[c].push(nodes.length - 1);
      }
    }

    // ── Elementos shell Q4 (losa) ──
    const shellElems: number[][] = [];
    for (let j = 0; j < Ny; j++) {
      for (let i = 0; i < Nx; i++) {
        shellElems.push([slabNodeId(i, j), slabNodeId(i+1, j),
                          slabNodeId(i+1, j+1), slabNodeId(i, j+1)]);
      }
    }
    const nShells = shellElems.length;

    // ── Elementos frame: vigas perimetrales (en Z=h) ──
    const beamElems: number[][] = [];
    // inf y=0
    for (let i = 0; i < Nx; i++) beamElems.push([slabNodeId(i, 0), slabNodeId(i+1, 0)]);
    // sup y=Ly
    for (let i = 0; i < Nx; i++) beamElems.push([slabNodeId(i, Ny), slabNodeId(i+1, Ny)]);
    // izq x=0
    for (let j = 0; j < Ny; j++) beamElems.push([slabNodeId(0, j), slabNodeId(0, j+1)]);
    // der x=Lx
    for (let j = 0; j < Ny; j++) beamElems.push([slabNodeId(Nx, j), slabNodeId(Nx, j+1)]);
    const nBeams = beamElems.length;

    // ── Elementos frame: columnas (verticales, Nz segmentos por columna × 4) ──
    const colElems: number[][] = [];
    for (let c = 0; c < 4; c++) {
      const ids = colNodeIdsPerCol[c]; // [top, k=1, k=2, ..., base]
      for (let k = 0; k < ids.length - 1; k++) {
        colElems.push([ids[k], ids[k+1]]);
      }
    }
    const nCols = colElems.length;

    const elements: number[][] = [...shellElems, ...beamElems, ...colElems];
    states.nodes.val = nodes;
    states.elements.val = elements;

    // ── elementInputs ──
    const thicknesses        = new Map<number, number>();
    const plateFormulations  = new Map<number, number>();  // 2 = DKMQ Katili (match SAP/PyNite)
    const elasticities       = new Map<number, number>();
    const poissons           = new Map<number, number>();
    const densities          = new Map<number, number>();
    const areas              = new Map<number, number>();
    const momentsOfInertiaY  = new Map<number, number>();
    const momentsOfInertiaZ  = new Map<number, number>();
    const torsionalConstants = new Map<number, number>();
    const orientations       = new Map<number, [number, number, number]>();
    const shearModuli        = new Map<number, number>();
    const sections           = new Map<number, [number, number]>();

    const G = p.E / (2 * (1 + p.nu));

    // (a) Shells (losa) — DKMQ Katili (match SAP/PyNite)
    for (let i = 0; i < nShells; i++) {
      thicknesses.set(i, p.t);
      elasticities.set(i, p.E);
      poissons.set(i, p.nu);
      densities.set(i, 24);
      plateFormulations.set(i, 2);   // 2 = DKMQ Katili
    }

    // (b) Vigas horizontales (Iy = strong para flexion vertical, orientations [0,0,1])
    const A_b = p.bW * p.bH;
    const Iy_b = p.bW * p.bH**3 / 12;       // strong (resist flexion vertical)
    const Iz_b = p.bH * p.bW**3 / 12;       // weak
    const J_b  = Iy_b + Iz_b;
    for (let i = 0; i < nBeams; i++) {
      const idx = nShells + i;
      elasticities.set(idx, p.E);
      poissons.set(idx, p.nu);
      densities.set(idx, 24);
      areas.set(idx, A_b);
      momentsOfInertiaY.set(idx, Iy_b);
      momentsOfInertiaZ.set(idx, Iz_b);
      torsionalConstants.set(idx, J_b);
      shearModuli.set(idx, G);
      sections.set(idx, [p.bH, p.bW]);
      orientations.set(idx, [0, 0, 1]);     // eje local Z = +Z global
    }

    // (c) Columnas verticales (cuadradas: Iy=Iz, sin orientations explícitas)
    const A_c = p.cS * p.cS;
    const I_c = p.cS**4 / 12;       // I cuadrada
    const J_c = 0.141 * p.cS**4;    // torsional cuadrada
    for (let i = 0; i < nCols; i++) {
      const idx = nShells + nBeams + i;
      elasticities.set(idx, p.E);
      poissons.set(idx, p.nu);
      densities.set(idx, 24);
      areas.set(idx, A_c);
      momentsOfInertiaY.set(idx, I_c);
      momentsOfInertiaZ.set(idx, I_c);
      torsionalConstants.set(idx, J_c);
      shearModuli.set(idx, G);
      sections.set(idx, [p.cS, p.cS]);
      // Columnas verticales: defaults OK (no orientations)
    }

    states.elementInputs.val = {
      thicknesses, elasticities, poissonsRatios: poissons, densities,
      areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants,
      orientations, sections, shearModuli, plateFormulations,
    };

    // ── BCs: bases de columnas empotradas (4 nodos de base, Z=0) ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (let c = 0; c < 4; c++) {
      const baseId = colNodeIdsPerCol[c][colNodeIdsPerCol[c].length - 1];
      supports.set(baseId, [true, true, true, true, true, true]);
    }

    // ── Carga q distribuida sobre losa: tributaria por nodo ──
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const Ftrib = p.q * dx * dy;
    for (let j = 0; j <= Ny; j++) {
      for (let i = 0; i <= Nx; i++) {
        const onX = (i === 0 || i === Nx);
        const onY = (j === 0 || j === Ny);
        const factor = (onX && onY) ? 0.25 : (onX || onY) ? 0.5 : 1.0;
        loads.set(slabNodeId(i, j), [0, 0, -Ftrib * factor, 0, 0, 0]);
      }
    }

    states.nodeInputs.val = { supports, loads };

    // ── Resolver ──
    try {
      states.deformOutputs.val = deform(nodes, elements, states.nodeInputs.val, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);

      const deforms = states.deformOutputs.val.deformations;
      let wMax = 0;
      deforms?.forEach((d) => { if (Math.abs(d[2]) > Math.abs(wMax)) wMax = d[2]; });

      // Capture para puppeteer/automation
      (window as any).__lastHekatanResult = {
        example: "slab-beams-columns",
        params: { ...p },
        n_nodes: nodes.length,
        n_shells: nShells, n_beams: nBeams, n_cols: nCols,
        w_max_m: wMax, w_max_mm: wMax * 1000,
        ranges: {
          shells:  { start: 0, end: nShells - 1 },
          beams:   { start: nShells, end: nShells + nBeams - 1 },
          columns: { start: nShells + nBeams, end: nShells + nBeams + nCols - 1 },
        },
      };
      console.log("HEKATAN_RESULT:", JSON.stringify((window as any).__lastHekatanResult));
    } catch (e: any) {
      console.error("slab-beams-columns build error:", e?.message);
    }

    states.objects3D.val = [];
  },
};
