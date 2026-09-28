/**
 * Un modelo de SÓLIDOS H8 dentro del workspace.
 *
 * POR QUÉ (28-sep-2026, Jorge: «los sólidos parece que tienen algo raro… todo debe estar en
 * el workspace»): cada ejemplo de sólidos era una página aparte metida en un marco. Para
 * pintarse convertía las caras de sus hexaedros en cáscaras falsas de 1 mm y escribía el campo
 * elegido en `analyzeOutputs.vonMises`, así que el visor dibujaba «cáscaras» que no existían y
 * el desplegable «Resultados de sólido» enseñaba lo mismo eligieras lo que eligieras.
 *
 * Aquí el modelo entra al workspace COMO ES: nudos, hexaedros de 8 nudos, apoyos y cargas.
 * El visor pinta la piel del sólido y saca el campo de `analyzeOutputs.solidStress`.
 */
import { hex8Solve, type Vec3, type Hex8 } from "hekatan-fem";
import type { Node, Element } from "hekatan-fem";
import type { BuildStates } from "../workspace/exampleRegistry";

export interface ModeloSolido {
  nodes: Vec3[];
  elements: Hex8[];
  /** Módulo de elasticidad (kN/m²) y Poisson, iguales para todo el modelo. */
  E: number;
  nu: number;
  /** nudo → [fija ux, fija uy, fija uz] */
  supports: Map<number, [boolean, boolean, boolean]>;
  /** nudo → [Fx, Fy, Fz] en kN */
  loads: Map<number, [number, number, number]>;
  /** Modos incompatibles de Wilson-Taylor (defecto true, como SAP2000). */
  incompatible?: boolean;
  /** Densidad (t/m³), solo para la masa si luego se corre un modal. */
  rho?: number;
}

export interface SolucionSolido {
  ok: boolean;
  error?: string;
  desplazamientos: Map<number, Vec3>;
  /** Tensiones por elemento en sus 8 puntos de Gauss: [σxx, σyy, σzz, τxy, τyz, τxz] */
  tensiones: Map<number, number[][]>;
  vonMises: Map<number, number[]>;
  ms: number;
}

/** Resuelve el modelo y lo deja en los estados del workspace. */
export function resolverSolidoEnWorkspace(states: BuildStates, m: ModeloSolido): SolucionSolido {
  const sol: SolucionSolido = {
    ok: false, desplazamientos: new Map(), tensiones: new Map(), vonMises: new Map(), ms: 0,
  };
  try {
    const r = hex8Solve({
      nodes: m.nodes, elements: m.elements, E: m.E, nu: m.nu,
      supports: m.supports, loads: m.loads, incompatible: m.incompatible !== false,
    });
    sol.ok = true;
    sol.desplazamientos = r.displacements;
    sol.tensiones = r.stressPerElement;
    sol.vonMises = r.vonMisesPerElement;
    sol.ms = r.elapsedMs;
  } catch (e: any) {
    sol.error = e?.message ?? String(e);
    console.warn("[sólidos H8]", sol.error);
  }

  const elasticities = new Map<number, number>();
  const poissonsRatios = new Map<number, number>();
  const densities = new Map<number, number>();
  m.elements.forEach((_, i) => {
    elasticities.set(i, m.E);
    poissonsRatios.set(i, m.nu);
    if (m.rho !== undefined) densities.set(i, m.rho);
  });

  // Un nudo de sólido no tiene giros: el apoyo fija solo desplazamientos.
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  m.supports.forEach((v, n) => supports.set(n, [v[0], v[1], v[2], false, false, false]));
  const loads = new Map<number, [number, number, number, number, number, number]>();
  m.loads.forEach((v, n) => loads.set(n, [v[0], v[1], v[2], 0, 0, 0]));

  const deformations = new Map<number, [number, number, number, number, number, number]>();
  sol.desplazamientos.forEach(([ux, uy, uz], n) => deformations.set(n, [ux, uy, uz, 0, 0, 0]));

  states.nodes.val = m.nodes.map((p) => [p[0], p[1], p[2]] as Node);
  states.elements.val = m.elements.map((e) => [...e] as Element);
  states.nodeInputs.val = { supports, loads };
  states.elementInputs.val = {
    elasticities, poissonsRatios, densities,
    solidIncompatible: m.incompatible !== false,
  } as any;
  states.deformOutputs.val = { deformations, reactions: new Map() };
  states.analyzeOutputs.val = sol.ok
    ? { solidStress: sol.tensiones, solidVonMises: sol.vonMises }
    : {};
  return sol;
}

/** Mínimo y máximo de una componente de tensión sobre todos los puntos de Gauss. */
export function rangoDeTension(tensiones: Map<number, number[][]>, componente: number): [number, number] {
  let mn = Infinity, mx = -Infinity;
  tensiones.forEach((g) => g.forEach((s) => {
    const v = s[componente];
    if (Number.isFinite(v)) { if (v < mn) mn = v; if (v > mx) mx = v; }
  }));
  return Number.isFinite(mn) ? [mn, mx] : [0, 0];
}
