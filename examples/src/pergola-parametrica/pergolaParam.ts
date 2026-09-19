/**
 * Pérgola — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=pergola` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Pérgola simple — marco con techo inclinado */
export const pergolaParam = makeSimpleExample({
  id: "pergola",
  name: "Pérgola",
  category: "1️⃣ Frames · 🎯 6 GDL Espacial",
  params: {
    W:  P("Geometría", "Ancho (m)", 4, 2, 10, 0.25),
    L:  P("Geometría", "Largo (m)", 5, 2, 12, 0.5),
    H1: P("Geometría", "H frontal (m)", 3, 2, 5, 0.1),
    H2: P("Geometría", "H trasera (m)", 4, 2, 6, 0.1),
    nSub: P("Geometría", "Div. vigas", 2, 1, 6, 1),
    CM: P("Cargas", "CM techo (kN)", -5, -30, 0, 0.5),
  },
  gen: (p) => {
    const nodes: Node[] = [
      [0, 0, 0], [p.W, 0, 0], [p.W, p.L, 0], [0, p.L, 0],       // base 0-3
      [0, 0, p.H1], [p.W, 0, p.H1], [p.W, p.L, p.H2], [0, p.L, p.H2], // tope 4-7
    ];
    const elements: Element[] = [];
    // Columnas
    for (let c = 0; c < 4; c++) elements.push([c, c + 4]);
    // Vigas perimetrales techo
    elements.push([4, 5], [5, 6], [6, 7], [7, 4]);
    // Vigas cruzadas (para rigidez)
    elements.push([4, 6]);
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let c = 0; c < 4; c++) supports.set(c, [true, true, true, true, true, true]);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    for (let c = 4; c < 8; c++) loads.set(c, [0, 0, p.CM / 4, 0, 0, 0]);
    return { nodes, elements, supports, loads, material: "hormigon", barA: 0.16 };
  },
});
