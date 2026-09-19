/**
 * Columna + placa base Q4 — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=col-placa` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Columna con placa base */
export const colPlaca = makeSimpleExample({
  id: "col-placa",
  name: "Columna + Placa Base",
  // Medido por `categorias-arbol`: 1 barra (la columna) + 36 cáscaras (la placa) →
  // barras Y cáscaras es 4️⃣ Mixtos, no 2️⃣ Shells. La raíz es el TIPO DE ELEMENTO.
  category: "4️⃣ Mixtos · 🔩 Conexiones",
  params: {
    Lx: P("Geometría", "Lx placa (m)", 0.40, 0.20, 1.0, 0.05),
    Ly: P("Geometría", "Ly placa (m)", 0.40, 0.20, 1.0, 0.05),
    t:  P("Sección", "espesor placa (m)", 0.025, 0.010, 0.05, 0.005),
    Hc: P("Geometría", "Altura columna (m)", 3, 1, 8, 0.5),
    nx: P("Malla", "nx", 6, 4, 16, 1),
    ny: P("Malla", "ny", 6, 4, 16, 1),
    P:  P("Cargas", "P axial tope (kN)", -100, -1000, 100, 10),
  },
  gen: (p) => {
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nodes: Node[] = [];
    // Placa base (z=0)
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) nodes.push([(i * p.Lx) / nx - p.Lx / 2, (j * p.Ly) / ny - p.Ly / 2, 0]);
    // Nodo tope columna
    const topIdx = nodes.length;
    nodes.push([0, 0, p.Hc]);
    // Nodo centro placa
    const centerIdx = nodes.length;
    nodes.push([0, 0, 0]);
    // Elements: placa Q4 + columna
    const elements: Element[] = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const n0 = j * (nx + 1) + i;
      elements.push([n0, n0 + 1, n0 + 1 + (nx + 1), n0 + (nx + 1)]);
    }
    elements.push([centerIdx, topIdx]);
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    // Anclajes en esquinas de la placa
    supports.set(0, [true, true, true, true, true, true]);
    supports.set(nx, [true, true, true, true, true, true]);
    supports.set(ny * (nx + 1), [true, true, true, true, true, true]);
    supports.set(ny * (nx + 1) + nx, [true, true, true, true, true, true]);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    loads.set(topIdx, [0, 0, p.P, 0, 0, 0]);
    return { nodes, elements, supports, loads, material: "hormigon", thickness: p.t, barA: 0.01 };
  },
  hasShellResults: true,
});
