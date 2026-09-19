/**
 * Muro de contención Q4 — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=muro-contencion` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Muro de contención cantiléver */
export const muroContencion = makeSimpleExample({
  id: "muro-contencion",
  name: "Muro de contención",
  category: "2️⃣ Shells · 🕸 Membranas",
  params: {
    H:  P("Geometría", "H (m)", 4, 2, 10, 0.25),
    W:  P("Geometría", "Ancho base (m)", 3, 1, 8, 0.25),
    t:  P("Sección", "espesor muro (m)", 0.30, 0.15, 0.80, 0.05),
    nx: P("Malla", "nx", 8, 4, 20, 1),
    nz: P("Malla", "nz", 12, 4, 30, 1),
    qSuelo: P("Cargas", "q suelo (kN/m²)", 30, 5, 100, 2),
  },
  gen: (p) => {
    const nx = Math.round(p.nx), nz = Math.round(p.nz);
    const nodes: Node[] = [];
    for (let k = 0; k <= nz; k++) for (let i = 0; i <= nx; i++) nodes.push([(i * p.W) / nx, 0, (k * p.H) / nz]);
    const elements: Element[] = [];
    for (let k = 0; k < nz; k++) for (let i = 0; i < nx; i++) {
      const n0 = k * (nx + 1) + i;
      elements.push([n0, n0 + 1, n0 + 1 + (nx + 1), n0 + (nx + 1)]);
    }
    // Base empotrada
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let i = 0; i <= nx; i++) supports.set(i, [true, true, true, true, true, true]);
    // Resto bloquea Y
    for (let i = 0; i < nodes.length; i++) if (!supports.has(i)) supports.set(i, [false, true, false, true, true, true]);
    // Carga horizontal lateral (presión del suelo, triangular)
    const loads = new Map<number, [number,number,number,number,number,number]>();
    const dz = p.H / nz;
    for (let k = 1; k <= nz; k++) {
      const z = (p.H * k) / nz;
      const q = p.qSuelo * (p.H - z) / p.H;  // triangular
      const Fx = q * dz;
      const idx = k * (nx + 1); // cara X=0
      loads.set(idx, [Fx, 0, 0, 0, 0, 0]);
    }
    return { nodes, elements, supports, loads, material: "hormigon", thickness: p.t };
  },
  hasShellResults: true,
});
