/**
 * Torre retorcida — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=twisted` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Twisted tower (Turning Torso) — cada piso rotado */
export const twisted = makeSimpleExample({
  id: "twisted",
  name: "Twisted (Turning Torso)",
  category: "1️⃣ Frames · 🎯 6 GDL Espacial",
  params: {
    H:         P("Geometría", "Altura (m)", 80, 20, 200, 5),
    baseW:     P("Geometría", "Lado (m)", 15, 5, 30, 1),
    nLv:       P("Geometría", "Pisos", 20, 5, 40, 1),
    totalTwist: P("Geometría", "Giro total (°)", 90, 0, 180, 5),
    Ex:        P("Cargas", "Viento (kN)", 80, 0, 500, 5),
  },
  gen: (p) => {
    const nLv = Math.round(p.nLv);
    const dz = p.H / nLv;
    const h = p.baseW / 2;
    const nodes: Node[] = [];
    for (let k = 0; k <= nLv; k++) {
      const t = k / nLv;
      const ang = (p.totalTwist * Math.PI / 180) * t;
      const c = Math.cos(ang), s = Math.sin(ang);
      const z = dz * k;
      const rot = (x: number, y: number): [number, number] => [x * c - y * s, x * s + y * c];
      const [x1, y1] = rot(-h, -h); nodes.push([x1, y1, z]);
      const [x2, y2] = rot(h, -h); nodes.push([x2, y2, z]);
      const [x3, y3] = rot(h, h);  nodes.push([x3, y3, z]);
      const [x4, y4] = rot(-h, h); nodes.push([x4, y4, z]);
    }
    const elements: Element[] = [];
    for (let k = 0; k < nLv; k++) {
      const o = k * 4;
      for (let c = 0; c < 4; c++) elements.push([o + c, o + 4 + c]);
      const of = o + 4;
      elements.push([of, of + 1], [of + 1, of + 2], [of + 2, of + 3], [of + 3, of]);
    }
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let c = 0; c < 4; c++) supports.set(c, [true, true, true, true, true, true]);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    loads.set(nLv * 4, [p.Ex, 0, 0, 0, 0, 0]);
    return { nodes, elements, supports, loads, material: "acero", barA: 0.012 };
  },
});
