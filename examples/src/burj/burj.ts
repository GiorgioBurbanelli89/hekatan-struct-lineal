/**
 * Burj Khalifa — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=burj` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Torre Burj — esbelta con diagonales */
export const burj = makeSimpleExample({
  id: "burj",
  name: "Burj (torre esbelta)",
  category: "1️⃣ Frames · 🎯 6 GDL Espacial",
  params: {
    H:       P("Geometría", "Altura (m)", 100, 30, 300, 5),
    baseW:   P("Geometría", "Base (m)", 20, 5, 40, 1),
    nLv:     P("Geometría", "Pisos", 20, 5, 50, 1),
    taper:   P("Geometría", "Estrechamiento (%)", 40, 0, 80, 5),
    Ex:      P("Cargas", "Viento (kN)", 100, 0, 1000, 10),
  },
  gen: (p) => {
    const nLv = Math.round(p.nLv);
    const nodes: Node[] = [];
    for (let k = 0; k <= nLv; k++) {
      const t = k / nLv;
      const w = p.baseW * (1 - p.taper / 100 * t);
      const z = (p.H / nLv) * k;
      const h = w / 2;
      nodes.push([-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]);
    }
    const elements: Element[] = [];
    for (let k = 0; k < nLv; k++) {
      const o = k * 4;
      for (let c = 0; c < 4; c++) elements.push([o + c, o + 4 + c]);
      const of = o + 4;
      elements.push([of, of + 1], [of + 1, of + 2], [of + 2, of + 3], [of + 3, of]);
      // X-braces cada 3 pisos para rigidez
      if (k % 3 === 0) elements.push([o, o + 5], [o + 2, o + 7]);
    }
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let c = 0; c < 4; c++) supports.set(c, [true, true, true, true, true, true]);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    const topStart = nLv * 4;
    loads.set(topStart, [p.Ex, 0, 0, 0, 0, 0]);
    return { nodes, elements, supports, loads, material: "acero", barA: 0.015 };
  },
});
