/**
 * Viga cantilever Q4 — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=viga-q4` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Viga Q4 cantiléver */
export const vigaQ4 = makeSimpleExample({
  id: "viga-q4",
  name: "Viga Q4 (cantiléver)",
  category: "2️⃣ Shells · 🕸 Membranas",
  params: {
    L:  P("Geometría", "L (m)", 4, 1, 10, 0.5),
    H:  P("Geometría", "H (m)", 0.6, 0.2, 2, 0.1),
    t:  P("Sección", "espesor (m)", 0.25, 0.1, 0.5, 0.05),
    nx: P("Malla", "nx", 20, 4, 40, 1),
    ny: P("Malla", "ny", 6, 2, 16, 1),
    F:  P("Cargas", "F punta (kN)", 10, -100, 100, 1),
  },
  gen: (p) => {
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nodes: Node[] = [];
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) nodes.push([(i * p.L) / nx, 0, (j * p.H) / ny]);
    const elements: Element[] = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const n0 = j * (nx + 1) + i;
      elements.push([n0, n0 + 1, n0 + 1 + (nx + 1), n0 + (nx + 1)]);
    }
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let j = 0; j <= ny; j++) supports.set(j * (nx + 1), [true, true, true, true, true, true]);
    for (let i = 0; i < nodes.length; i++) if (!supports.has(i)) supports.set(i, [false, true, false, true, true, true]);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    for (let j = 0; j <= ny; j++) loads.set(j * (nx + 1) + nx, [0, 0, p.F / (ny + 1), 0, 0, 0]);
    return { nodes, elements, supports, loads, material: "hormigon", thickness: p.t };
  },
  hasShellResults: true,
});
