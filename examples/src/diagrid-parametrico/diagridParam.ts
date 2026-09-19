/**
 * Diagrid — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=diagrid` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Diagrid — tubo externo en patrón X triangular (Gherkin/30 St Mary Axe) */
export const diagridParam = makeSimpleExample({
  id: "diagrid",
  name: "Diagrid (Gherkin)",
  category: "1️⃣ Frames · 🎯 6 GDL Espacial",
  params: {
    H:      P("Geometría", "Altura (m)", 60, 20, 150, 5),
    R:      P("Geometría", "Radio base (m)", 10, 3, 30, 0.5),
    nSides: P("Geometría", "Lados", 8, 4, 16, 1),
    nLv:    P("Geometría", "Niveles", 10, 4, 30, 1),
    Ex:     P("Cargas", "Viento (kN)", 60, 0, 400, 5),
  },
  gen: (p) => {
    const nSides = Math.round(p.nSides);
    const nLv = Math.round(p.nLv);
    const dz = p.H / nLv;
    const nodes: Node[] = [];
    for (let k = 0; k <= nLv; k++) {
      const z = dz * k;
      const r = p.R * (1 - 0.15 * Math.pow(2 * (k / nLv) - 1, 2));  // estrechado tipo elipsoide
      for (let s = 0; s < nSides; s++) {
        const a = (2 * Math.PI * s) / nSides;
        nodes.push([r * Math.cos(a), r * Math.sin(a), z]);
      }
    }
    const elements: Element[] = [];
    // Anillos horizontales
    for (let k = 0; k <= nLv; k++) {
      const o = k * nSides;
      for (let s = 0; s < nSides; s++) elements.push([o + s, o + (s + 1) % nSides]);
    }
    // Diagrids (diagonales X entre niveles)
    for (let k = 0; k < nLv; k++) {
      const o = k * nSides;
      const of = (k + 1) * nSides;
      for (let s = 0; s < nSides; s++) {
        elements.push([o + s, of + (s + 1) % nSides]);
        elements.push([o + (s + 1) % nSides, of + s]);
      }
    }
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let s = 0; s < nSides; s++) supports.set(s, [true, true, true, true, true, true]);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    for (let s = 0; s < nSides; s++) loads.set(nLv * nSides + s, [p.Ex / nSides, 0, 0, 0, 0, 0]);
    return { nodes, elements, supports, loads, material: "acero", barA: 0.008 };
  },
});
