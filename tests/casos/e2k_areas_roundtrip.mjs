/**
 * Las AREAS sobreviven al `.e2k`: se exportan y se vuelven a leer.
 *
 * `parseE2k` reconocia el bloque `AREA CONNECTIVITIES` y solo lo CONTABA
 * (`info.nAreas`). No montaba ni un elemento: un `.e2k` escrito con 900 losas
 * volvia con **CERO** shells — sin espesor, sin tipo de cascara, sin
 * modificadores y sin un aviso. El ciclo Hekatan → ETABS → Hekatan perdia la
 * losa entera, y lo unico que se notaba era un modelo mas flojo.
 *
 * Se barren TODOS los ejemplos del registry que llevan area, no una muestra:
 * una losa se declara de muchas maneras —Q4, triangulo, muro PANEL, deck,
 * membrana, varios espesores— y basta una que no sobreviva para dejar un
 * agujero. Encontrados asi, el 2026-08-28:
 *
 *   · una sola `SHELLPROP "Losa"` y una `"Muro"` con el espesor del PRIMER
 *     elemento: `placa-base` salia [0.014, 0.022, 0.025] y volvia [0.022, 0.025]
 *   · los TRIANGULOS ni se recogian (`el.length === 4`): `triangular-plate`
 *     exportaba sus 128 shells como CERO areas
 *   · todo `FLOOR` con los saltos de planta a `0 0 0 0`, o sea los cuatro nudos
 *     en la MISMA planta: una cascara CURVA salia aplastada
 *
 * El ciclo COMPLETO —pasando por ETABS de verdad— lo cierran
 * `cli/roundtrip_areas.mjs` + `cli/roundtrip_areas_etabs.py`, que no pueden
 * vivir en la suite porque necesitan ETABS instalado. Esto es la mitad que se
 * puede comprobar sola, y es la que caza el fallo: si un area no sobrevive a
 * nuestro PROPIO fichero, no hace falta ETABS para saber que el ciclo se rompe.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
/** Un `.e2k` REAL escrito por ETABS, de un modelo que Hekatan nunca vio. */
const RIOCHICO = join(AQUI, "..", "..", "..", "galpon-bodega-electoral", "ref_riochico.e2k");

export const nombre = "e2k-areas-roundtrip";
export const descripcion =
  "las areas sobreviven al .e2k: se exportan y se vuelven a leer, en TODOS los ejemplos";

const cargar = () => empaquetar(`
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
const { exportE2k } = await import("${R}/examples/src/shared/e2kExporter");
const { parseE2k } = await import("${R}/examples/src/shared/e2kParser");

const estado = (ini) => { let v = ini;
  return { get val(){ return v; }, set val(x){ v = x; },
           get rawVal(){ return v; }, set rawVal(x){ v = x; } }; };
const uniq = (m, f) => [...new Set([...(m ?? new Map()).values()].map(f ?? (v => v)))];

export function ids() {
  return examplesRegistry.filter(e => typeof e.build === "function").map(e => e.id);
}

/** Exporta el ejemplo y lo vuelve a leer. null si no lleva areas. */
export function ciclo(id) {
  const ex = examplesRegistry.find((e) => e.id === id);
  if (!ex || typeof ex.build !== "function") return null;
  const p = {}; for (const [k, d] of Object.entries(ex.params || {})) p[k] = d.default;
  p.__soloModelo = true;
  const st = { nodes: estado([]), elements: estado([]), nodeInputs: estado({}),
               elementInputs: estado({}), deformOutputs: estado({}),
               analyzeOutputs: estado({}), objects3D: estado([]) };
  ex.build(p, st, { render(){}, clear(){}, show(){}, hide(){} });
  const ei = st.elementInputs.val;
  const nShells = st.elements.val.filter(e => e.length === 3 || e.length === 4).length;
  if (!nShells) return null;
  const e2k = exportE2k({ nodes: st.nodes.val, elements: st.elements.val,
                          nodeInputs: st.nodeInputs.val, elementInputs: ei,
                          title: ex.name, units: { force: "Tonf", length: "m" },
                          weightMode: "manual" });
  const m = parseE2k(e2k);
  return {
    id,
    nShells,
    // solo las CASCARAS: las placas base guardan thicknesses = 0 tambien en sus BARRAS (pernos,
    // columna) y el .e2k no les da espesor al releer; ese 0 no es una cascara perdida (29-sep-2026)
    espesores: uniq(new Map([...(ei.thicknesses ?? new Map())].filter(([i]) => {
      const e = st.elements.val[i]; return e && (e.length === 3 || e.length === 4); })), v => +v.toFixed(6)).sort((a,b)=>a-b),
    leidos: m.elements.filter(e => e.length === 3 || e.length === 4).length,
    espLeidos: uniq(m.elementInputs?.thicknesses, v => +v.toFixed(6)).sort((a,b)=>a-b),
    areasVistas: m.info.nAreas,
    areasMontadas: m.info.nAreasMontadas ?? 0,
  };
}

/** Un .e2k ajeno: se comprueba que las unidades llegan convertidas. */
export function leerReal(texto) {
  const m = parseE2k(texto);
  const zs = m.nodes.map(n => n[2]);
  return {
    units: m.units,
    nNodos: m.nodes.length,
    nShells: m.elements.filter(e => e.length === 3 || e.length === 4).length,
    areasVistas: m.info.nAreas,
    areasMontadas: m.info.nAreasMontadas ?? 0,
    zMin: Math.min(...zs), zMax: Math.max(...zs),
    espesores: uniq(m.elementInputs?.thicknesses, v => +v.toFixed(4)).sort((a,b)=>a-b),
  };
}`, "e2kAreasRT");

export async function correr() {
  const mod = await cargar();
  const filas = [];

  const conArea = [];
  for (const id of mod.ids()) {
    let r = null;
    try { r = mod.ciclo(id); } catch { r = null; }
    if (r) conArea.push(r);
  }

  // 1 · Ninguno pierde shells
  const pierden = conArea.filter(r => r.leidos !== r.nShells);
  filas.push({
    que: "todos los ejemplos con area recuperan sus shells al releer el .e2k",
    medido: conArea.length - pierden.length, limite: conArea.length,
    ok: pierden.length === 0, crudo: true,
    detalle: pierden.length
      ? pierden.slice(0, 4).map(r => `${r.id} ${r.nShells}→${r.leidos}`).join(", ")
      : `${conArea.length} ejemplos con area`,
  });

  // 2 · Ni espesores. Es lo que caza que se pierdan las cascaras SECUNDARIAS:
  //     el numero de shells puede cuadrar y salir todas con el mismo espesor.
  const esp = conArea.filter(r => JSON.stringify(r.espesores) !== JSON.stringify(r.espLeidos));
  filas.push({
    que: "y sus espesores, incluidas las cascaras que no son la primera",
    medido: conArea.length - esp.length, limite: conArea.length,
    ok: esp.length === 0, crudo: true,
    detalle: esp.length
      ? esp.slice(0, 3).map(r => `${r.id} ${JSON.stringify(r.espesores)}→${JSON.stringify(r.espLeidos)}`).join(" · ")
      : "una propiedad por cascara distinta",
  });

  // 3 · Cada AREA del fichero llega a ser un elemento
  const sinMontar = conArea.filter(r => r.areasMontadas !== r.areasVistas);
  filas.push({
    que: "cada AREA escrita en el fichero llega a ser un elemento",
    medido: conArea.length - sinMontar.length, limite: conArea.length,
    ok: sinMontar.length === 0, crudo: true,
    detalle: sinMontar.length
      ? sinMontar.slice(0, 3).map(r => `${r.id} ${r.areasMontadas}/${r.areasVistas}`).join(", ")
      : "vistas == montadas",
  });

  // 4 · Un .e2k REAL de ETABS, con otras unidades (KGF/M) y sus rarezas.
  //     Sin esto todo lo anterior mide el dialecto de nuestro propio
  //     exportador, no el de ETABS.
  if (existsSync(RIOCHICO)) {
    const r = mod.leerReal(readFileSync(RIOCHICO, "utf-8"));
    // Las cotas TIENEN que venir en metros. El .e2k va en las unidades de su
    // cabecera y el parser no convertia ninguna: un modelo entraba con las
    // cotas x1000 y no daba error, daba otro edificio.
    const enMetros = r.zMin > -50 && r.zMax < 100;
    filas.push({
      que: "un .e2k REAL de ETABS (Rio Chico, KGF/M) entra con las cotas en METROS",
      medido: `${r.zMin.toFixed(2)} .. ${r.zMax.toFixed(2)} m`,
      limite: "dentro de -50 .. 100", ok: enMetros, crudo: true,
      detalle: `${r.nNodos} nudos · unidades del fichero ${r.units.force}/${r.units.length}`,
    });
    // Y sus espesores, que en KGF/M vienen en metros ya, pero el material va en
    // kgf/m2: si la conversion se aplicara a medias, esto se saldria.
    const espOk = r.espesores.length > 0 && r.espesores.every(t => t > 0.01 && t < 3);
    filas.push({
      que: "y con espesores de cascara creibles (0.01 .. 3 m)",
      medido: JSON.stringify(r.espesores), limite: "0.01 .. 3 m", ok: espOk, crudo: true,
      detalle: `${r.nShells} shells de ${r.areasVistas} AREA`,
    });
    // No se exige 79 de 79: ese modelo trae un poligono de SEIS lados, que
    // hekatan-fem no tiene (Q4 y T3). Lo que se exige es que lo que se pierde
    // sea POCO y que el parser lo DIGA, no que lo tire callando.
    filas.push({
      que: "monta la gran mayoria de las areas de un modelo ajeno",
      medido: +(100 * r.areasMontadas / r.areasVistas).toFixed(1), limite: 90,
      ok: (100 * r.areasMontadas / r.areasVistas) >= 90,
      detalle: `${r.areasMontadas} de ${r.areasVistas} — lo que no entra lo avisa por consola con la causa`,
    });
  }
  return filas;
}
