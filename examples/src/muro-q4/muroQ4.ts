/**
 * Muro de corte Q4 — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=muro-q4` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Muro Q4 cantiléver (shear wall) */
export const muroQ4 = makeSimpleExample({
  id: "muro-q4",
  name: "Muro Q4 (cantiléver)",
  category: "2️⃣ Shells · 🕸 Membranas",
  params: {
    W:  P("Geometría", "Ancho (m)", 3, 1, 8, 0.25),
    H:  P("Geometría", "Altura (m)", 5, 2, 15, 0.5),
    t:  P("Sección", "espesor (m)", 0.25, 0.1, 0.5, 0.05),
    nx: P("Malla", "nx", 6, 4, 16, 1),
    nz: P("Malla", "nz", 12, 4, 30, 1),
    F:  P("Cargas", "F lateral (kN)", 200, 0, 2000, 20),
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
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let i = 0; i <= nx; i++) supports.set(i, [true, true, true, true, true, true]);
    for (let i = 0; i < nodes.length; i++) if (!supports.has(i)) supports.set(i, [false, true, false, true, true, true]);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    const topBase = nz * (nx + 1);
    const Fint = p.F / nx;
    for (let i = 0; i <= nx; i++) {
      const corner = (i === 0 || i === nx);
      loads.set(topBase + i, [corner ? Fint * 0.5 : Fint, 0, 0, 0, 0, 0]);
    }
    return { nodes, elements, supports, loads, material: "hormigon", thickness: p.t };
  },
  hasShellResults: true,
});
