/**
 * Torre Eiffel — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=eiffel` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Torre Eiffel — 4 patas que convergen hacia el tope */
export const eiffel = makeSimpleExample({
  id: "eiffel",
  name: "Torre Eiffel",
  category: "1️⃣ Frames · 🎯 6 GDL Espacial",
  params: {
    H:     P("Geometría", "Altura total (m)", 30, 10, 80, 1),
    baseW: P("Geometría", "Base (m)", 15, 5, 30, 1),
    topW:  P("Geometría", "Tope (m)", 2, 0.5, 8, 0.5),
    nLv:   P("Geometría", "Niveles", 8, 4, 20, 1),
    CM:    P("Cargas", "CM tope (kN)", -100, -1000, 0, 10),
  },
  gen: (p) => {
    const nLv = Math.round(p.nLv);
    const nodes: Node[] = [];
    for (let k = 0; k <= nLv; k++) {
      const t = k / nLv;
      const w = p.baseW + (p.topW - p.baseW) * t;
      const z = p.H * t;
      const h = w / 2;
      nodes.push([-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]);
    }
    const elements: Element[] = [];
    // Columnas (4 patas) + diagonales por piso
    for (let k = 0; k < nLv; k++) {
      const o = k * 4;
      for (let c = 0; c < 4; c++) elements.push([o + c, o + 4 + c]);
      // Diagonales
      elements.push([o, o + 5], [o + 1, o + 6], [o + 2, o + 7], [o + 3, o + 4]);
      // Vigas horizontales (marco) cada piso
      const of = o + 4;
      elements.push([of, of + 1], [of + 1, of + 2], [of + 2, of + 3], [of + 3, of]);
    }
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let c = 0; c < 4; c++) supports.set(c, [true, true, true, true, true, true]);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    const topStart = nLv * 4;
    for (let c = 0; c < 4; c++) loads.set(topStart + c, [0, 0, p.CM / 4, 0, 0, 0]);
    return { nodes, elements, supports, loads, material: "acero" };
  },
});
