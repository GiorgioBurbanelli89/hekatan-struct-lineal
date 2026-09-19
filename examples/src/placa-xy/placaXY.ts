/**
 * Placa cantilever XY Q4 — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=placa-xy` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Placa XY — cantiléver (un borde empotrado, otro libre) */
export const placaXY = makeSimpleExample({
  id: "placa-xy",
  name: "Placa XY (cantiléver)",
  category: "2️⃣ Shells · 🧱 Placas",
  params: {
    Lx: P("Geometría", "Lx (m)", 4, 1, 10, 0.5),
    Ly: P("Geometría", "Ly (m)", 2, 1, 6, 0.25),
    t:  P("Sección", "espesor (m)", 0.15, 0.08, 0.40, 0.01),
    nx: P("Malla", "nx", 10, 4, 20, 1),
    ny: P("Malla", "ny", 6, 4, 16, 1),
    CM: P("Cargas", "q (kN/m²)", -5, -30, 0, 0.5),
  },
  gen: (p) => {
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nodes: Node[] = [];
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) nodes.push([(i * p.Lx) / nx, (j * p.Ly) / ny, 0]);
    const elements: Element[] = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const n0 = j * (nx + 1) + i;
      elements.push([n0, n0 + 1, n0 + 1 + (nx + 1), n0 + (nx + 1)]);
    }
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    // Empotrado solo en x=0
    for (let j = 0; j <= ny; j++) supports.set(j * (nx + 1), [true, true, true, true, true, true]);
    const A = (p.Lx / nx) * (p.Ly / ny);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
      const idx = j * (nx + 1) + i;
      loads.set(idx, [0, 0, p.CM * A, 0, 0, 0]);
    }
    return { nodes, elements, supports, loads, material: "hormigon", thickness: p.t };
  },
  hasShellResults: true,
});
