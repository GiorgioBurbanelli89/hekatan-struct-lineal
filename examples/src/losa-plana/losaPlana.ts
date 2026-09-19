/**
 * Losa plana Q4 — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=losa-plana` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Losa plana (similar a losa-rect pero con 2 apoyos internos tipo columna) */
export const losaPlana = makeSimpleExample({
  id: "losa-plana",
  name: "Losa plana (con columnas internas)",
  category: "2️⃣ Shells · 🧱 Placas",
  params: {
    Lx: P("Geometría", "Lx (m)", 8, 3, 16, 0.5),
    Ly: P("Geometría", "Ly (m)", 6, 3, 16, 0.5),
    t:  P("Sección", "espesor (m)", 0.20, 0.10, 0.40, 0.01),
    nx: P("Malla", "nx", 12, 4, 24, 1),
    ny: P("Malla", "ny", 8, 4, 20, 1),
    CM: P("Cargas", "q (kN/m²)", -8, -30, 0, 0.5),
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
    // Columnas: 4 interiores (puntos) + bordes de 4 lados simplemente apoyados
    // Bordes: apoyo simple (solo Z)
    for (let i = 0; i <= nx; i++) {
      supports.set(i, [false, false, true, false, false, false]);
      supports.set(ny * (nx + 1) + i, [false, false, true, false, false, false]);
    }
    for (let j = 0; j <= ny; j++) {
      supports.set(j * (nx + 1), [false, false, true, false, false, false]);
      supports.set(j * (nx + 1) + nx, [false, false, true, false, false, false]);
    }
    // 2 columnas interiores (fijas en X,Y,Z)
    supports.set(Math.round(ny / 3) * (nx + 1) + Math.round(nx / 3), [true, true, true, false, false, false]);
    supports.set(Math.round(2 * ny / 3) * (nx + 1) + Math.round(2 * nx / 3), [true, true, true, false, false, false]);
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
