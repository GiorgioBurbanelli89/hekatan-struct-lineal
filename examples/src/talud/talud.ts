/**
 * Talud Q4 — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=talud` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Talud — malla Q4 inclinada (slope analysis simplificado) */
export const talud = makeSimpleExample({
  id: "talud",
  name: "Talud (slope)",
  category: "2️⃣ Shells · 🕸 Membranas",
  params: {
    L:  P("Geometría", "Longitud (m)", 20, 5, 50, 1),
    H:  P("Geometría", "Altura (m)", 10, 2, 30, 0.5),
    angle: P("Geometría", "Pendiente (°)", 30, 15, 60, 1),
    t:  P("Sección", "espesor slab (m)", 0.30, 0.1, 1.0, 0.05),
    nx: P("Malla", "nx", 12, 4, 24, 1),
    ny: P("Malla", "ny", 4, 2, 10, 1),
    CM: P("Cargas", "q (kN/m²)", -20, -100, 0, 2),
  },
  gen: (p) => {
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nodes: Node[] = [];
    const aRad = p.angle * Math.PI / 180;
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
      const s = p.L * (i / nx);
      nodes.push([s * Math.cos(aRad), (j * 5) / ny, s * Math.sin(aRad)]);
    }
    const elements: Element[] = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const n0 = j * (nx + 1) + i;
      elements.push([n0, n0 + 1, n0 + 1 + (nx + 1), n0 + (nx + 1)]);
    }
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    // Base (i=0) empotrada
    for (let j = 0; j <= ny; j++) supports.set(j * (nx + 1), [true, true, true, true, true, true]);
    const A = (p.L / nx) * (5 / ny);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
      const idx = j * (nx + 1) + i;
      loads.set(idx, [0, 0, p.CM * A, 0, 0, 0]);
    }
    return { nodes, elements, supports, loads, material: "hormigon", thickness: p.t };
  },
  hasShellResults: true,
});
