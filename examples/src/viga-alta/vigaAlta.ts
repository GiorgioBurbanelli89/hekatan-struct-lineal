/**
 * Viga alta Q4 — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=viga-alta` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Viga alta (deep beam) — Q4 con carga distribuida arriba */
export const vigaAlta = makeSimpleExample({
  id: "viga-alta",
  name: "Viga alta (Deep Beam)",
  category: "2️⃣ Shells · 🕸 Membranas",
  params: {
    L:  P("Geometría", "Luz (m)", 4, 1, 10, 0.5),
    H:  P("Geometría", "Altura (m)", 2, 0.5, 5, 0.1),
    t:  P("Sección", "espesor (m)", 0.20, 0.05, 0.50, 0.01),
    nx: P("Malla", "nx", 16, 4, 30, 1),
    ny: P("Malla", "ny", 8, 4, 20, 1),
    CM: P("Cargas", "q arriba (kN/m)", -100, -500, 0, 5),
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
    // Apoyos en los 2 extremos inferiores
    supports.set(0, [true, true, true, true, true, true]);
    supports.set(nx, [true, true, true, true, true, true]);
    // Todo bloqueado en Y (plane stress en X-Z)
    for (let i = 0; i < nodes.length; i++) {
      if (supports.has(i)) continue;
      supports.set(i, [false, true, false, true, true, true]);
    }
    const topBase = ny * (nx + 1);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    const F = p.CM * (p.L / nx);
    for (let i = 0; i <= nx; i++) {
      const corner = (i === 0 || i === nx);
      loads.set(topBase + i, [0, 0, corner ? F * 0.5 : F, 0, 0, 0]);
    }
    return { nodes, elements, supports, loads, material: "hormigon", thickness: p.t };
  },
  hasShellResults: true,
});
