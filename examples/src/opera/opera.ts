/**
 * Ópera de Sídney — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=opera` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Opera de Sydney — conchas reticulares (esquemático, 3 arcos) */
export const opera = makeSimpleExample({
  id: "opera",
  name: "Opera Sydney (esquemático)",
  category: "1️⃣ Frames · 🎯 6 GDL Espacial",
  params: {
    span:    P("Geometría", "Luz concha (m)", 30, 10, 60, 2),
    rise:    P("Geometría", "Altura concha (m)", 20, 5, 40, 1),
    nArcs:   P("Geometría", "N° conchas", 3, 1, 6, 1),
    nDiv:    P("Geometría", "Div. por arco", 12, 6, 30, 1),
    CM:      P("Cargas", "CM techo (kN)", -30, -200, 0, 5),
  },
  gen: (p) => {
    const nA = Math.round(p.nArcs);
    const nD = Math.round(p.nDiv);
    const nodes: Node[] = [];
    const elements: Element[] = [];
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    const loads = new Map<number, [number,number,number,number,number,number]>();
    for (let a = 0; a < nA; a++) {
      const y0 = a * p.span * 1.2;
      const base = nodes.length;
      for (let i = 0; i <= nD; i++) {
        const t = i / nD;
        const x = p.span * t;
        const z = p.rise * Math.sin(Math.PI * t);
        nodes.push([x, y0, z]);
      }
      for (let i = 0; i < nD; i++) elements.push([base + i, base + i + 1]);
      supports.set(base, [true, true, true, true, true, true]);
      supports.set(base + nD, [true, true, true, true, true, true]);
      loads.set(base + Math.round(nD / 2), [0, 0, p.CM, 0, 0, 0]);
    }
    return { nodes, elements, supports, loads, material: "acero", barA: 0.025 };
  },
});
