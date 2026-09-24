/**
 * Puente reticular — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=puente` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Puente de vigas reticulares 2D (simple) */
export const puenteReticular = makeSimpleExample({
  id: "puente",
  name: "Puente reticular",
  category: "1️⃣ Frames · 🎯 3 GDL Pórtico plano",
  params: {
    span:   P("Geometría", "Luz (m)", 30, 10, 80, 2),
    height: P("Geometría", "Canto (m)", 4, 1, 10, 0.5),
    nDiv:   P("Geometría", "Paneles", 8, 4, 20, 1),
    CM:     P("Cargas", "CM tablero (kN)", -50, -300, 0, 5),
  },
  gen: (p) => {
    const n = Math.round(p.nDiv);
    const dx = p.span / n;
    const nodes: Node[] = [];
    for (let i = 0; i <= n; i++) nodes.push([dx * i, 0, 0]);            // tablero inferior
    for (let i = 0; i <= n; i++) nodes.push([dx * i, 0, p.height]);     // cuerda superior
    const b = n + 1;
    const elements: Element[] = [];
    for (let i = 0; i < n; i++) elements.push([i, i + 1]);
    for (let i = 0; i < n; i++) elements.push([b + i, b + i + 1]);
    for (let i = 0; i <= n; i++) elements.push([i, b + i]);
    // Diagonales Warren
    for (let i = 0; i < n; i++) {
      if (i < n / 2) elements.push([i, b + i + 1]); else elements.push([b + i, i + 1]);
    }
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>([
      [0, [true, true, true, true, true, true]],
      [n, [true, true, true, true, true, true]],
    ]);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    for (let i = 0; i <= n; i++) loads.set(i, [0, 0, p.CM, 0, 0, 0]);
    return { nodes, elements, supports, loads, material: "acero", barA: 0.008 };
  },
});
