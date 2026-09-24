/**
 * Losa rectangular Q4 — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=losa-rect` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Losa rectangular simplemente apoyada */
export const losaRect = makeSimpleExample({
  id: "losa-rect",
  name: "Losa Rectangular",
  category: "2️⃣ Shells · 🧱 Placas",
  params: {
    Lx: P("Geometría", "Lx (m)", 6, 2, 15, 0.5),
    Ly: P("Geometría", "Ly (m)", 4, 2, 15, 0.5),
    t:  P("Sección", "espesor (m)", 0.15, 0.08, 0.40, 0.01),
    nx: P("Malla", "nx", 10, 4, 20, 1),
    ny: P("Malla", "ny", 8, 4, 20, 1),
    CM: P("Cargas", "CM (kN/m²)", -5, -30, 0, 0.5),
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
    for (let i = 0; i <= nx; i++) {
      supports.set(i, [true, true, true, false, false, false]);
      supports.set(ny * (nx + 1) + i, [true, true, true, false, false, false]);
    }
    for (let j = 0; j <= ny; j++) {
      supports.set(j * (nx + 1), [true, true, true, false, false, false]);
      supports.set(j * (nx + 1) + nx, [true, true, true, false, false, false]);
    }
    const A_trib = (p.Lx / nx) * (p.Ly / ny);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
      const idx = j * (nx + 1) + i;
      const corner = (i === 0 || i === nx) && (j === 0 || j === ny);
      const edge = (i === 0 || i === nx || j === 0 || j === ny);
      const f = corner ? 0.25 : edge ? 0.5 : 1.0;
      loads.set(idx, [0, 0, p.CM * A_trib * f, 0, 0, 0]);
    }
    return { nodes, elements, supports, loads, material: "hormigon", thickness: p.t };
  },
  hasShellResults: true,
});
