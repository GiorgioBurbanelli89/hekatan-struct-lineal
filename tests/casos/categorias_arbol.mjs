/**
 * EL ÁRBOL DE CATEGORÍAS dice la verdad sobre lo que es cada ejemplo.
 *
 * El primer nivel es el TIPO DE ELEMENTO —1️⃣ Frames, 2️⃣ Shells, 3️⃣ Sólidos,
 * 4️⃣ Mixtos— y eso no es una etiqueta de estilo: se puede COMPROBAR. Se
 * construye cada ExampleDef y se cuentan sus elementos por número de nodos
 * (2 = frame, 3-4 = shell, 8 = sólido). Si un ejemplo dice "1️⃣ Frames" y trae
 * cáscaras, el test lo canta.
 *
 * Antes el primer nivel era la PROCEDENCIA (Benchmarks, Libros, Icónicos,
 * Edificios…): de dónde salía el ejemplo, no qué era. Un mismo voladizo de
 * acero vivía en tres cajones según quién lo hubiera metido, y no había forma
 * de comprobar nada porque no había nada que comprobar. Ahora sí.
 *
 * Se mantiene con `python ordenar_categorias.py --aplicar`.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

const RAICES = ["1️⃣ Frames", "2️⃣ Shells", "3️⃣ Sólidos", "4️⃣ Mixtos",
                "🧪 Utilidades", "🗄 Legacy"];

/** Las hojas válidas de cada raíz. Una categoría fuera de aquí es un cajón nuevo
 *  inventado a mano, que es exactamente como empezó el desorden anterior. */
const HOJAS = {
  "1️⃣ Frames": ["🎯 1 GDL Axial", "🎯 2 GDL Flexión", "🎯 3 GDL Pórtico plano",
                 "🎯 6 GDL Espacial", "🎯 n GDL Sistemas"],
  // 🌀 Drilling ITW sale en las DOS raices a proposito: los cuatro TESTS son
  // membrana pura (Shells) y los dos MUROS llevan viga, o sea barras + cascaras
  // (Mixtos). El caso de abajo cuenta los elementos y no deja mentir.
  "2️⃣ Shells": ["🧱 Placas", "🕸 Membranas", "🌀 Drilling ITW", "🐚 Cáscaras",
                 "🥞 Layered", "🧰 Cimentaciones", "🔩 Conexiones",
                 // pedido de Jorge (22-sep-2026): los ejemplos que se validan contra ETABS,
                 // SAP2000, OpenSees y numpy sobre la MISMA malla, juntos y a la vista
                 "✅ Validación CSI"],
  "3️⃣ Sólidos": [],
  "4️⃣ Mixtos": ["🏢 Edificios", "🧰 Cimentaciones", "🔩 Conexiones",
                 "🔀 Losas con vigas", "🌉 Puentes e icónicos", "🌀 Drilling ITW"],
  "🧪 Utilidades": [],
  "🗄 Legacy": [],
};

const FUENTE = `
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}),
  createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) },
  { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){},
  addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false},
  getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){},
  cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(),
  documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[],
  addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} };
g.addEventListener = () => {};
g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");

export function barrer() {
  const out = [];
  for (const ex of examplesRegistry) {
    let frames = 0, shells = 0, solidos = 0, medible = false;
    if (typeof ex.build === "function") {
      const p = {}; for (const [k,d] of Object.entries(ex.params||{})) p[k] = d.default;
      const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}},
                   deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]} };
      try {
        ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
        for (const e of (st.elements.val || [])) {
          if (e.length === 2) frames++;
          else if (e.length === 3 || e.length === 4) shells++;
          else if (e.length === 8) solidos++;
        }
        medible = frames + shells + solidos > 0;
      } catch (e) { /* el que no construye no se puede medir: se dice, no se inventa */ }
    }
    out.push({ id: ex.id, cat: ex.category, frames, shells, solidos, medible });
  }
  return out;
}`;

export const nombre = "categorias-arbol";
export const descripcion =
  "el árbol de categorías es el tipo de elemento MEDIDO, no una etiqueta puesta a mano";

export async function correr() {
  const mod = await empaquetar(FUENTE, "categorias-arbol");
  const filas = [];
  const ejemplos = mod.barrer();

  // 1) toda categoría pertenece al árbol
  const fuera = ejemplos.filter((e) => !RAICES.some(
    (r) => e.cat === r || e.cat?.startsWith(r + " · ")));
  filas.push({
    que: "categorías dentro del árbol (Frames/Shells/Sólidos/Mixtos/Utilidades/Legacy)",
    medido: fuera.length, limite: 0, ok: fuera.length === 0,
    detalle: fuera.length ? fuera.slice(0, 6).map((e) => `${e.id}="${e.cat}"`).join(" · ")
                          : `los ${ejemplos.length} del registry`,
  });

  // 2) la hoja existe en su raíz
  const hojaMala = ejemplos.filter((e) => {
    const raiz = RAICES.find((r) => e.cat === r || e.cat?.startsWith(r + " · "));
    if (!raiz || e.cat === raiz) return false;
    return !HOJAS[raiz].includes(e.cat.slice(raiz.length + 3));
  });
  filas.push({
    que: "sub-categorías de la lista (nadie se inventa un cajón)",
    medido: hojaMala.length, limite: 0, ok: hojaMala.length === 0,
    detalle: hojaMala.length ? hojaMala.slice(0, 6).map((e) => `${e.id}="${e.cat}"`).join(" · ")
                             : "sin cajones nuevos",
  });

  // 3) LO IMPORTANTE: el tipo declarado es el tipo medido
  const mienten = [];
  for (const e of ejemplos) {
    if (!e.medible) continue;
    // 🧪 Utilidades y 🗄 Legacy no se juzgan por el tipo de elemento: el
    // modelador CLI trae 3 barras de demostración y no por eso es un ejemplo
    // de frames. Están fuera del árbol de cálculo a propósito.
    if (e.cat?.startsWith("🧪") || e.cat?.startsWith("🗄")) continue;
    const esperado = e.solidos ? "3️⃣ Sólidos"
      : (e.frames && e.shells) ? "4️⃣ Mixtos"
      : e.shells ? "2️⃣ Shells" : "1️⃣ Frames";
    if (!e.cat?.startsWith(esperado))
      mienten.push(`${e.id}: dice "${(e.cat || "").split(" · ")[0]}" y tiene ` +
                   `${e.frames} barras / ${e.shells} cáscaras / ${e.solidos} sólidos → ${esperado}`);
  }
  const medibles = ejemplos.filter((e) => e.medible).length;
  filas.push({
    que: "el tipo de elemento declarado = el MEDIDO",
    medido: mienten.length, limite: 0, ok: mienten.length === 0,
    detalle: mienten.length ? mienten.slice(0, 4).join(" | ")
                            : `${medibles} ejemplos construidos y contados`,
  });

  return filas;
}
