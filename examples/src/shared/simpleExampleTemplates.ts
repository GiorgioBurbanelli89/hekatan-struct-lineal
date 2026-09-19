/**
 * Templates compactos para crear ExampleDefs simples con geometrías paramétricas.
 * Usados para los ~20 ejemplos restantes de FEM Studio (iconicos + Q4 + losas).
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef, BuildStates, ModalPanelApi } from "../workspace/exampleRegistry";

const G_GRAVITY = 9.81;
const Ec = 25e6, nu_c = 0.2, Gc = Ec / (2 * (1 + nu_c)), rho_c = 24 / G_GRAVITY;
const Es = 200e6, nu_s = 0.3, Gs = Es / (2 * (1 + nu_s)), rho_s = 78 / G_GRAVITY;

export interface SimpleGenArgs {
  id: string;
  name: string;
  category: string;
  params: Record<string, any>;
  /** Genera nodos + elementos + supports + loads. Material = acero por default. */
  gen: (p: Record<string, number>) => {
    nodes: Node[];
    elements: Element[];
    supports: Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>;
    loads: Map<number, [number, number, number, number, number, number]>;
    material?: "acero" | "hormigon";
    barA?: number;
    thickness?: number;  // para Q4 shells
  };
  hasShellResults?: boolean;  // true para Q4 placas/shells
}

export function makeSimpleExample(args: SimpleGenArgs): ExampleDef {
  const isShell = args.hasShellResults;
  return {
    id: args.id,
    name: args.name,
    category: args.category,
    defaultShellResult: isShell ? "displacementZ" : "none",
    availableShellResults: isShell ? ["bendingXX", "bendingYY", "bendingXY", "membraneXX", "vonMises", "displacementZ"] : [],
    hasModal: true,
    params: args.params,
    build(p, states) {
      const { nodes, elements, supports, loads, material = "acero", barA = 0.004, thickness = 0.15 } = args.gen(p);
      const isAcero = material === "acero";
      const E = isAcero ? Es : Ec;
      const G = isAcero ? Gs : Gc;
      const nu = isAcero ? nu_s : nu_c;
      const rho = isAcero ? rho_s : rho_c;

      const elasticities = new Map<number, number>();
      const shearModuli = new Map<number, number>();
      const areas = new Map<number, number>();
      const Iz = new Map<number, number>();
      const Iy = new Map<number, number>();
      const J = new Map<number, number>();
      const densities = new Map<number, number>();
      const poissons = new Map<number, number>();
      const thicknesses = new Map<number, number>();
      for (let i = 0; i < elements.length; i++) {
        elasticities.set(i, E); shearModuli.set(i, G); poissons.set(i, nu);
        densities.set(i, rho);
        const el = elements[i];
        if (el.length >= 3) {
          thicknesses.set(i, thickness);
        } else {
          const I = barA * barA / 12;
          areas.set(i, barA); Iz.set(i, I); Iy.set(i, I); J.set(i, 2 * I);
        }
      }
      states.nodes.val = nodes;
      states.elements.val = elements;
      states.nodeInputs.val = { supports, loads };
      states.elementInputs.val = {
        elasticities, shearModuli, areas,
        momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy, torsionalConstants: J,
        densities, poissonsRatios: poissons, thicknesses,
      };
      try {
        const dOut = deform(nodes, elements, states.nodeInputs.val, states.elementInputs.val);
        states.deformOutputs.val = dOut;
        states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, dOut);
      } catch (e) { console.warn(`${args.id} solver error:`, e); }
      states.objects3D.val = [];
    },
    runModal(p, states, modalPanel: ModalPanelApi) {
      const nodes = states.nodes.val;
      const elements = states.elements.val;
      const ni = states.nodeInputs.val;
      const ei = states.elementInputs.val;
      if (!nodes.length || !elements.length || !ni.supports?.size || !ei.densities?.size) return;
      try {
        const out = modalAnalysis(nodes, elements, ni, ei, 12);
        modalPanel.render(out, { title: args.name, properties: [] });
      } catch (e: any) { console.warn(`Modal ${args.id} error:`, e.message); }
    },
  };
}

/**
 * Clona el mapa de `params` de un ExampleDef cambiando SOLO el `default` de las
 * claves indicadas. Todo lo demas de cada parametro (min, max, step, label,
 * folder, unitType…) se conserva.
 *
 * Es el `cloneEdificioParams` que vivia dentro de `shared/moreExamples.ts`,
 * generalizado para cualquier ejemplo base. Lo usan las variantes de
 * `edificio-aporticado` (`edif-acero-diag`, `edif-mixto`, `edif-muros`…) que
 * se sacaron de ese fichero a su carpeta propia.
 */
export function clonarParamsCon<T extends Record<string, any>>(
  base: T,
  overrides: Record<string, number>,
): T {
  const out: any = {};
  for (const [k, v] of Object.entries(base)) {
    out[k] = { ...v, default: overrides[k] ?? v.default };
  }
  return out as T;
}
