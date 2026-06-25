/**
 * 🎓 Test M · Edificio aporticado PARAMÉTRICO — solo frame (columnas + vigas).
 * SIN aporte de losa (sin diafragma) ni muros de corte. Carga lateral = fuerzas
 * sísmicas NEC-SE-DS por piso (Módulo 3, computeCortanteBasal). Análisis estático.
 *
 * Objetivo de tesis (OE3): tipología estructural representativa de Manabí para
 * validar fuerzas internas / desplazamientos / cortante basal vs ETABS/SAP.
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import { computeCortanteBasal } from "../espectro-nec/espectroNec";

const Ec = 24.9e6, nu_c = 0.2, Gc = Ec / (2 * (1 + nu_c)), rho_c = 24; // HA f'c=24, kN/m

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export const edificioFrameNec: ExampleDef = {
  id: "edificio-frame-nec",
  name: "Edificio pórtico · carga lateral NEC",
  category: "🎓 Test M",
  defaultShellResult: "none",
  availableShellResults: [],
  hasModal: true,
  params: {
    pisos:  P("Geometría", "N° pisos", 5, 1, 15, 1),
    vanosX: P("Geometría", "Vanos X", 3, 1, 6, 1),
    vanosY: P("Geometría", "Vanos Y", 2, 1, 6, 1),
    Lx:     P("Geometría", "Luz X (m)", 5, 3, 8, 0.5),
    Ly:     P("Geometría", "Luz Y (m)", 5, 3, 8, 0.5),
    he:     P("Geometría", "Entrepiso (m)", 3, 2.5, 4, 0.1),
    colB:   P("Secciones", "b columna (m)", 0.45, 0.25, 0.9, 0.05),
    colH:   P("Secciones", "h columna (m)", 0.45, 0.25, 0.9, 0.05),
    vigaB:  P("Secciones", "b viga (m)", 0.30, 0.2, 0.6, 0.05),
    vigaH:  P("Secciones", "h viga (m)", 0.50, 0.3, 0.9, 0.05),
    Z:      P("Sismo NEC", "Factor Z (g)", 0.4, 0.1, 0.5, 0.05),
    R:      P("Sismo NEC", "R", 8, 1, 8, 0.5),
    wPiso:  P("Sismo NEC", "Peso/piso W (kN)", 1500, 200, 5000, 50),
  },
  build(p, states) {
    const pisos = Math.round(p.pisos), vx = Math.round(p.vanosX), vy = Math.round(p.vanosY);
    const nx = vx + 1, ny = vy + 1, nz = pisos + 1;
    const idx = (i: number, j: number, k: number) => k * (nx * ny) + j * nx + i;

    const nodes: Node[] = [];
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++)
      nodes.push([i * p.Lx, j * p.Ly, k * p.he]);

    const elements: Element[] = [];
    const colIdx = new Set<number>();
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++)
      for (let k = 0; k < nz - 1; k++) { colIdx.add(elements.length); elements.push([idx(i, j, k), idx(i, j, k + 1)]); }
    for (let k = 1; k < nz; k++) {
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx - 1; i++) elements.push([idx(i, j, k), idx(i + 1, j, k)]);
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny - 1; j++) elements.push([idx(i, j, k), idx(i, j + 1, k)]);
    }

    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++)
      supports.set(idx(i, j, 0), [true, true, true, true, true, true]);

    // Carga lateral sísmica NEC (Módulo 3) + gravedad
    const cb = computeCortanteBasal({
      norma: "NEC15", Z: p.Z, suelo: "D", region: "Costa", R: p.R, I: 1, phiP: 1, phiE: 1,
      N: pisos, he: p.he, wPiso: p.wPiso, tipoTa: "Hormigón sin muros",
    });
    const nPP = nx * ny;
    const loads = new Map<number, [number, number, number, number, number, number]>();
    for (let k = 1; k < nz; k++) {
      const Fx = cb.pisos[k - 1].Fx / nPP;
      const Pz = -p.wPiso / nPP;
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++)
        loads.set(idx(i, j, k), [Fx, 0, Pz, 0, 0, 0]);
    }

    // Secciones
    const cA = p.colB * p.colH, cIz = p.colB * p.colH ** 3 / 12, cIy = p.colH * p.colB ** 3 / 12;
    const cJ = 0.14 * Math.pow(Math.min(p.colB, p.colH), 4);
    const vA = p.vigaB * p.vigaH, vIz = p.vigaB * p.vigaH ** 3 / 12, vIy = p.vigaH * p.vigaB ** 3 / 12;
    const vJ = 0.21 * Math.pow(Math.min(p.vigaB, p.vigaH), 3) * Math.max(p.vigaB, p.vigaH);

    const E = new Map<number, number>(), G = new Map<number, number>(), A = new Map<number, number>();
    const Iz = new Map<number, number>(), Iy = new Map<number, number>(), J = new Map<number, number>();
    const dens = new Map<number, number>(), nu = new Map<number, number>();
    for (let e = 0; e < elements.length; e++) {
      E.set(e, Ec); G.set(e, Gc); nu.set(e, nu_c); dens.set(e, rho_c);
      if (colIdx.has(e)) { A.set(e, cA); Iz.set(e, cIz); Iy.set(e, cIy); J.set(e, cJ); }
      else { A.set(e, vA); Iz.set(e, vIz); Iy.set(e, vIy); J.set(e, vJ); }
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      elasticities: E, shearModuli: G, areas: A,
      momentsOfInertiaZ: Iz, momentsOfInertiaY: Iy, torsionalConstants: J,
      densities: dens, poissonsRatios: nu,
    };
    const deformOut = deform(nodes, elements, states.nodeInputs.val, states.elementInputs.val);
    states.deformOutputs.val = deformOut;
    states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, deformOut);
    states.objects3D.val = [];

    console.log(`[Test M · edificio-frame-nec] V=${cb.V.toFixed(1)} kN  W=${cb.W} kN  Ta=${cb.Ta.toFixed(3)}s  Sa(Ta)=${cb.SaTa.toFixed(3)}g`);
  },
  runModal(p, states, modalPanel) {
    const { nodes, elements } = { nodes: states.nodes.val, elements: states.elements.val };
    const ni = states.nodeInputs.val, ei = states.elementInputs.val;
    if (!nodes.length || !ei.densities?.size) return;
    try {
      const out = modalAnalysis(nodes, elements, ni, ei, 12);
      modalPanel.render(out, {
        title: `Edificio pórtico ${Math.round(p.pisos)} pisos`,
        properties: [`Vanos ${Math.round(p.vanosX)}×${Math.round(p.vanosY)}  ·  col ${p.colB}×${p.colH}  viga ${p.vigaB}×${p.vigaH}`],
      });
    } catch (e: any) { console.warn("Modal edificio-frame-nec error:", e.message); }
  },
};
