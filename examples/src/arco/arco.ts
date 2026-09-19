/**
 * Arco (Gateway) — ejemplo paramétrico de FEM Studio.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=arco` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { Node, Element } from "hekatan-fem";
import { makeSimpleExample } from "../shared/simpleExampleTemplates";

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

/** Arco parabólico (Gateway Arch-like) */
export const arco = makeSimpleExample({
  id: "arco",
  name: "Arco (Gateway)",
  // ⚠️ Decía "4️⃣ Mixtos · 🌉 Puentes e icónicos" y el caso `categorias-arbol` lo cazó al
  // registrarlo (18-sep-2026): son 20 BARRAS y 0 cáscaras, o sea Frames, y además todas
  // en el plano XZ → pórtico plano. La raíz del árbol es el TIPO DE ELEMENTO, no el tema.
  // Los otros 20 que venían del mismo sitio llevaban raíces ya muertas ("🗽 Icónicos",
  // "🧱 Losas y cáscaras") y se revisaron una a una al repartirlos.
  category: "1️⃣ Frames · 🎯 3 GDL Pórtico plano",
  params: {
    span:  P("Geometría", "Luz (m)", 40, 10, 100, 2),
    rise:  P("Geometría", "Flecha (m)", 20, 5, 60, 1),
    nDiv:  P("Geometría", "Divisiones arco", 20, 8, 60, 1),
    CM:    P("Cargas", "CM centro (kN)", -200, -2000, 0, 10),
  },
  gen: (p) => {
    const n = Math.round(p.nDiv);
    const nodes: Node[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = -p.span / 2 + p.span * t;
      const z = p.rise * (1 - Math.pow(2 * t - 1, 2));
      nodes.push([x, 0, z]);
    }
    const elements: Element[] = [];
    for (let i = 0; i < n; i++) elements.push([i, i + 1]);
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>([
      [0, [true, true, true, true, true, true]],
      [n, [true, true, true, true, true, true]],
    ]);
    const loads = new Map<number, [number,number,number,number,number,number]>();
    loads.set(Math.round(n / 2), [0, 0, p.CM, 0, 0, 0]);
    return { nodes, elements, supports, loads, material: "acero", barA: 0.05 };
  },
});
