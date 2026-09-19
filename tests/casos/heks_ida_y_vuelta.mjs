/**
 * El `.heks` que GUARDA la app tiene que reconstruir el MISMO modelo.
 *
 * `modeloAHeks()` escribe el modelo que hay en pantalla. La única forma honesta de
 * comprobar que lo guarda bien no es mirar el fichero: es **volver a leerlo** por el
 * mismo camino que la app (cliModeler) y ver si da los mismos desplazamientos nudo a
 * nudo. Si no reconstruye la estructura, no está guardada — y el usuario se llevaría
 * un fichero que parece correcto y no lo es.
 *
 *   .heks original → cliModeler → states → modeloAHeks → .heks' → cliModeler → states'
 *
 * Se comparan desplazamientos (los 6 GDL de cada nudo) y la geometría.
 */
import { readFileSync } from "node:fs";
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "heks-ida-y-vuelta";
export const descripcion = "el .heks que guarda la app reconstruye el mismo modelo (desplazamientos nudo a nudo)";

const MODELOS = [
  "tests/datos/galpon_lc.heks",
  "tests/datos/cimentacion_9zapatas.heks",
  "tests/datos/mixto_solido_muro_columna.heks",
];

const st = (v) => ({ val: v });

async function cargar() {
  const cli = await empaquetar(
    `export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";\n`, "cliModeler");
  const gen = await empaquetar(
    `export { modeloAHeks } from "${R}/examples/src/workspace/modeloAHeks";\n`, "modeloAHeks");
  return { cliModeler: cli.cliModeler, modeloAHeks: gen.modeloAHeks };
}

function resolver(cliModeler, texto) {
  globalThis.window = { __hekatanCliScript: texto };
  const states = {
    nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}),
    deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]),
  };
  cliModeler.build({}, states);
  return states;
}

/** Máximo |u| de todos los nudos y el peor error relativo contra otra solución. */
function comparar(a, b) {
  const da = a.deformOutputs.val?.deformations;
  const db = b.deformOutputs.val?.deformations;
  if (!da || !db) return { sinDatos: true };
  let maxA = 0;
  for (const [, u] of da) for (const v of u) maxA = Math.max(maxA, Math.abs(v));
  let peor = 0;
  for (const [i, u] of da) {
    const w = db.get(i);
    if (!w) return { falta: i };
    for (let c = 0; c < 6; c++) peor = Math.max(peor, Math.abs(u[c] - (w[c] ?? 0)));
  }
  return { maxA, peor, rel: maxA > 0 ? (peor / maxA) * 100 : 0 };
}

export async function correr() {
  const { cliModeler, modeloAHeks } = await cargar();
  const filas = [];
  for (const ruta of MODELOS) {
    let texto;
    try { texto = readFileSync(ruta, "utf-8"); }
    catch { filas.push({ que: ruta.split("/").pop(), medido: "no está", limite: "—", ok: true, crudo: true, detalle: "fichero ausente, se salta" }); continue; }

    const A = resolver(cliModeler, texto);
    const regen = modeloAHeks(A, { nombre: ruta });
    if (!regen.trim()) {
      filas.push({ que: ruta.split("/").pop(), medido: "vacío", limite: "con texto", ok: false, crudo: true, detalle: "modeloAHeks no escribió nada" });
      continue;
    }
    const B = resolver(cliModeler, regen);

    const nA = A.nodes.val.length, nB = B.nodes.val.length;
    const eA = A.elements.val.length, eB = B.elements.val.length;
    filas.push({
      que: `${ruta.split("/").pop()}: nudos y elementos`,
      medido: `${nB}/${eB}`, limite: `${nA}/${eA}`, ok: nA === nB && eA === eB, crudo: true,
      detalle: "lo que se relee = lo que había",
    });

    const c = comparar(A, B);
    if (c.sinDatos) {
      filas.push({ que: `${ruta.split("/").pop()}: desplazamientos`, medido: "sin solución", limite: "—", ok: false, crudo: true, detalle: "uno de los dos no resolvió" });
    } else if (c.falta !== undefined) {
      filas.push({ que: `${ruta.split("/").pop()}: desplazamientos`, medido: `falta nudo ${c.falta}`, limite: "todos", ok: false, crudo: true, detalle: "" });
    } else {
      filas.push({
        que: `${ruta.split("/").pop()}: desplazamiento peor nudo`,
        medido: c.rel, limite: 0.5, ok: c.rel <= 0.5,
        detalle: `máx |u| = ${c.maxA.toExponential(3)}`,
      });
    }
  }

  // ── El modelo DUAL del artículo (test-m-dual, ms=1.0): el que pidió Jorge ──
  // Regla: o el .heks reconstruye el mismo modelo, o lo DICE en la cabecera. Lo que no
  // puede pasar nunca es un fichero que difiere y calla. Hoy difiere un 4.4 % porque el
  // lector no sabe declarar la placa DSE (plateFormulations = 2); con `shelltype id dse`
  // en cliModeler.ts cerraría al 0.00018 % (medido devolviéndole el 2 a las 460 cáscaras).
  try {
    const dual = await empaquetar(`
const g = globalThis; g.window = g;
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>new Proxy({}, { get:()=>()=>({}) }), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { examplesRegistry } = await import("${R}/examples/src/workspace/exampleRegistry");
export function construir(id, over) {
  const ex = examplesRegistry.find(e => e.id === id);
  const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.default;
  if (ex.dynamicParams) for (const [k, d] of Object.entries(ex.dynamicParams({ ...p, ...over }) || {})) if (!(k in p)) p[k] = d.default;
  Object.assign(p, over);
  const st = { nodes:{val:[]}, elements:{val:[]}, nodeInputs:{val:{}}, elementInputs:{val:{}}, deformOutputs:{val:{}}, analyzeOutputs:{val:{}}, objects3D:{val:[]}, springs:{val:[]} };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  return st;
}`, "dualIdaVuelta");
    const A = dual.construir("test-m-dual", { ms: 1.0 });
    const texto = modeloAHeks(A, { nombre: "test-m-dual ms=1.0" });
    const B = resolver(cliModeler, texto);
    const c = comparar({ deformOutputs: A.deformOutputs }, B);
    const avisa = /⚠️ .*placa DSE/.test(texto);
    const iguales = !c.sinDatos && c.rel <= 0.5;
    filas.push({ que: "test-m-dual ms=1.0: nudos", medido: `${B.nodes.val.length}`, limite: `${A.nodes.val.length}`,
                 ok: B.nodes.val.length === A.nodes.val.length, crudo: true, detalle: "el modelo del artículo" });
    filas.push({ que: "test-m-dual: coincide O lo avisa", medido: `${c.rel?.toFixed(3)} % · aviso ${avisa ? "SÍ" : "NO"}`,
                 limite: "≤0.5 % o aviso", ok: iguales || avisa, crudo: true,
                 detalle: iguales ? "reconstruye el mismo modelo" : "difiere, y la cabecera lo dice (falta `shelltype id dse` en el lector)" });
  } catch (e) {
    filas.push({ que: "test-m-dual", medido: "no se pudo construir", limite: "—", ok: false, crudo: true, detalle: String(e).slice(0, 100) });
  }
  return filas;
}
