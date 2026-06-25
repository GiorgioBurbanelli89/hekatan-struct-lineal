/**
 * Plate with Perimeter Beams — Hekatan Struct
 * Placa horizontal Lx x Ly con vigas perimetrales (sin columnas).
 * 4 esquinas empotradas. Carga q uniforme.
 *
 * Equivalente al benchmark SAP2000: validacion/.../benchmark_plate_with_beams/
 */
import { deform, analyze, type Node } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

export const plateWithBeams: ExampleDef = {
  id: "plate-with-beams",
  name: "Plate + Perimeter Beams (vs SAP)",
  category: "🏁 Benchmarks · 2️⃣ Áreas",
  benchmark: true,
  defaultShellResult: "bendingXX",
  availableShellResults: ["bendingXX", "bendingYY", "bendingXY",
                          "shearX", "shearY", "vonMises", "displacementZ"],
  params: {
    Lx: { default: 6.0, min: 2, max: 12, step: 0.5, label: "Lx (m)" },
    Ly: { default: 4.0, min: 2, max: 12, step: 0.5, label: "Ly (m)" },
    t:  { default: 0.1, min: 0.05, max: 0.4, step: 0.01, label: "t placa (m)" },
    bW: { default: 0.30, min: 0.15, max: 0.6, step: 0.05, label: "viga b (m)" },
    bH: { default: 0.50, min: 0.20, max: 1.0, step: 0.05, label: "viga h (m)" },
    E:  { default: 35e6, min: 1e6, max: 200e6, step: 1e6, label: "E (kN/m²)" },
    nu: { default: 0.15, min: 0.1, max: 0.4, step: 0.01, label: "ν" },
    q:  { default: 10, min: 1, max: 30, step: 1, label: "q ↓ (kN/m²)" },
    nx: { default: 6, min: 2, max: 12, step: 1, label: "nx" },
    ny: { default: 4, min: 2, max: 12, step: 1, label: "ny" },
  },
  build(p, states) {
    const Nx = Math.round(p.nx), Ny = Math.round(p.ny);
    const dx = p.Lx / Nx, dy = p.Ly / Ny;

    // ── Nodos del grid (placa) ──
    const nodes: Node[] = [];
    const nodeId = (i: number, j: number) => j * (Nx + 1) + i;
    for (let j = 0; j <= Ny; j++) {
      for (let i = 0; i <= Nx; i++) {
        nodes.push([i*dx, j*dy, 0]);
      }
    }

    // ── Elementos shell Q4 (placa) ──
    const shellElems: number[][] = [];
    for (let j = 0; j < Ny; j++) {
      for (let i = 0; i < Nx; i++) {
        shellElems.push([nodeId(i, j), nodeId(i+1, j),
                          nodeId(i+1, j+1), nodeId(i, j+1)]);
      }
    }
    const nShells = shellElems.length;

    // ── Elementos frame perimetrales ──
    const frameElems: number[][] = [];
    // Borde inferior y=0: (0,0)→(1,0)→...
    for (let i = 0; i < Nx; i++) frameElems.push([nodeId(i, 0), nodeId(i+1, 0)]);
    // Borde superior y=Ly
    for (let i = 0; i < Nx; i++) frameElems.push([nodeId(i, Ny), nodeId(i+1, Ny)]);
    // Borde izquierdo x=0
    for (let j = 0; j < Ny; j++) frameElems.push([nodeId(0, j), nodeId(0, j+1)]);
    // Borde derecho x=Lx
    for (let j = 0; j < Ny; j++) frameElems.push([nodeId(Nx, j), nodeId(Nx, j+1)]);
    const nFrames = frameElems.length;

    const elements: number[][] = [...shellElems, ...frameElems];
    states.nodes.val = nodes;
    states.elements.val = elements;

    // ── elementInputs ──
    // shells: 0..nShells-1  | frames: nShells..nShells+nFrames-1
    const thicknesses = new Map<number, number>();
    const elasticities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const densities = new Map<number, number>();
    const areas = new Map<number, number>();
    const momentsOfInertiaY = new Map<number, number>();
    const momentsOfInertiaZ = new Map<number, number>();
    const torsionalConstants = new Map<number, number>();
    const orientations = new Map<number, [number, number, number]>();
    const sections = new Map<number, [number, number]>();
    const plateFormulations = new Map<number, number>();   // 2 = DKMQ Katili

    for (let i = 0; i < nShells; i++) {
      thicknesses.set(i, p.t);
      elasticities.set(i, p.E);
      poissons.set(i, p.nu);
      densities.set(i, 24);
      plateFormulations.set(i, 2);   // DKMQ Katili para match SAP/PyNite
    }
    // Frame section bW (width horizontal) x bH (height vertical) — viga horizontal en XY.
    // Convencion Hekatan-FEM frame horizontal (eje local x a lo largo, sin orientations):
    //   default eje local y = horizontal perpendicular, eje local z = vertical (+Z global)
    //   momentsOfInertiaY (alrededor de eje y local, horizontal) → controla FLEXION VERTICAL (fuerte)
    //   momentsOfInertiaZ (alrededor de eje z local, vertical)   → controla flexion horizontal (debil)
    // Para una viga rectangular bW x bH acostada con altura bH:
    //   I respecto eje horizontal perpendicular: bW * bH^3 / 12  (FUERTE → vertical)
    //   I respecto eje vertical:                  bH * bW^3 / 12  (debil)
    const A_b = p.bW * p.bH;
    const Iy_b = p.bW * p.bH**3 / 12;       // FUERTE: resiste flexion vertical (la importante)
    const Iz_b = p.bH * p.bW**3 / 12;       // debil: resiste flexion horizontal
    const J_b  = Iy_b + Iz_b;
    // Orientations explicitas: vector "up" del eje local 2 del frame.
    // Para viga horizontal: queremos eje local 2 (Y) horizontal perpendicular a la viga,
    // y eje local 3 (Z) = vertical (+Z global). Asi Iy controla flexion vertical.
    // El "orientations" en hekatan-fem suele ser un vector que define eje local Z
    // (perpendicular al frame, para distinguir entre los infinitos planos posibles).
    // Convencion segura: pasar (0,0,1) para frames horizontales → eje Z local = +Z global.
    // PERO si el frame ya es horizontal, el solver debe poder inferir esto.
    // Si NO funciona, probar con shearModuli explicito.
    const G_b = p.E / (2 * (1 + p.nu));
    const shearModuli = new Map<number, number>();
    for (let i = 0; i < nFrames; i++) {
      const idx = nShells + i;
      elasticities.set(idx, p.E);
      poissons.set(idx, p.nu);
      densities.set(idx, 24);
      areas.set(idx, A_b);
      momentsOfInertiaY.set(idx, Iy_b);
      momentsOfInertiaZ.set(idx, Iz_b);
      torsionalConstants.set(idx, J_b);
      shearModuli.set(idx, G_b);              // necesario para Timoshenko correction
      sections.set(idx, [p.bH, p.bW]);
      orientations.set(idx, [0, 0, 1]);       // eje local Z = +Z global → Iy controla flex vertical
    }

    states.elementInputs.val = {
      thicknesses, elasticities, poissonsRatios: poissons, densities,
      areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants,
      orientations, sections, shearModuli, plateFormulations,
    };

    // ── BC: 4 esquinas empotradas (todos los DOFs) ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const corners = [nodeId(0, 0), nodeId(Nx, 0), nodeId(0, Ny), nodeId(Nx, Ny)];
    for (const c of corners) supports.set(c, [true, true, true, true, true, true]);

    // ── Carga q uniforme: tributaria por nodo ──
    // factor: esquina 1/4, borde 1/2, interior 1
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const Ftrib = p.q * dx * dy;
    for (let j = 0; j <= Ny; j++) {
      for (let i = 0; i <= Nx; i++) {
        const onX = (i === 0 || i === Nx);
        const onY = (j === 0 || j === Ny);
        const factor = (onX && onY) ? 0.25 : (onX || onY) ? 0.5 : 1.0;
        loads.set(nodeId(i, j), [0, 0, -Ftrib * factor, 0, 0, 0]);
      }
    }

    states.nodeInputs.val = { supports, loads };

    // ── Resolver con deform + analyze (combina shells + frames) ──
    try {
      states.deformOutputs.val = deform(nodes, elements, states.nodeInputs.val, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);

      // Exponer al window para captura puppeteer/comparativa
      const deforms = states.deformOutputs.val.deformations;
      let wMax = 0;
      deforms?.forEach((d) => { if (Math.abs(d[2]) > Math.abs(wMax)) wMax = d[2]; });

      // Esfuerzos en frames (M3 = momento flector fuerte, V2 = corte)
      const frameForces: any = { inf: [], sup: [], izq: [], der: [] };
      const ao = states.analyzeOutputs.val;
      // ao.framesData o similar puede tener axial/moment per frame — ajustar segun API real
      (window as any).__lastHekatanResult = {
        example: "plate-with-beams",
        params: { ...p },
        n_nodes: nodes.length, n_shells: nShells, n_frames: nFrames,
        w_max_m: wMax, w_max_mm: wMax * 1000,
        frameElemsRange: { start: nShells, end: nShells + nFrames - 1 },
      };
      console.log("HEKATAN_RESULT:", JSON.stringify((window as any).__lastHekatanResult));
    } catch (e: any) {
      console.error("plate-with-beams build error:", e?.message);
    }

    states.objects3D.val = [];
  },
};
