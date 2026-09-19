/**
 * Placa con orificios Q4 — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=placa-orificios` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Placa con orificios (placa base) */
export const placaOrificios = makeSimpleExample({
  id: "placa-orificios",
  name: "Placa con orificios",
  category: "2️⃣ Shells · 🧱 Placas",
  params: {
    Lx: P("Geometría", "Lx (m)", 0.50, 0.2, 1.5, 0.05),
    Ly: P("Geometría", "Ly (m)", 0.50, 0.2, 1.5, 0.05),
    t:  P("Sección", "espesor (m)", 0.025, 0.010, 0.05, 0.005),
    nx: P("Malla", "nx", 10, 4, 20, 1),
    ny: P("Malla", "ny", 10, 4, 20, 1),
    CM: P("Cargas", "q presión (kN/m²)", -10, -100, 0, 1),
  },
  gen: (p) => {
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nodes: Node[] = [];
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) nodes.push([(i * p.Lx) / nx, (j * p.Ly) / ny, 0]);
    const elements: Element[] = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      // Saltar la celda central (orificio)
      if (i === Math.floor(nx / 2) && j === Math.floor(ny / 2)) continue;
      const n0 = j * (nx + 1) + i;
      elements.push([n0, n0 + 1, n0 + 1 + (nx + 1), n0 + (nx + 1)]);
    }
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    // 4 esquinas ancladas (para pernos)
    supports.set(0, [true, true, true, true, true, true]);
    supports.set(nx, [true, true, true, true, true, true]);
    supports.set(ny * (nx + 1), [true, true, true, true, true, true]);
    supports.set(ny * (nx + 1) + nx, [true, true, true, true, true, true]);
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
