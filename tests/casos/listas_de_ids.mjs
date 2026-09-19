/**
 * LAS CUATRO LISTAS DE IDS TIENEN QUE DECIR LO MISMO.
 *
 * En este repo un ejemplo aparece en cuatro sitios y nadie los cruza:
 *
 *   1. `examples/src/workspace/exampleRegistry.ts` — lo que ofrece el selector
 *      y lo que carga `?t=<id>`.
 *   2. `examples/vite.config.ts` — las paginas que se COMPILAN (`/<id>/`).
 *   3. `examples/src/<id>/index.html` — la carpeta que existe en disco.
 *   4. `cli/shots/deploy/_ids.txt` — lo que barre el chequeo del deploy.
 *
 * Que se descuadren no daba error en ningun sitio, y por eso paso esto
 * (18-sep-2026, todo medido):
 *
 *   · **21 ejemplos** vivian en `shared/moreExamples.ts`, un fichero que no
 *     importaba nadie. Tenian carpeta, `index.html` y entrada en vite —o sea
 *     que se compilaban 21 paginas— pero NO estaban en el registry: `?t=arco`
 *     no cargaba nada, y sus ids estaban DUPLICADOS (carpeta + moreExamples).
 *   · `benchmark-steel-beam/` tiene carpeta entera y no esta ni en vite ni en
 *     el registry: invisible por los dos lados.
 *   · `_ids.txt` llevaba **20 ids** que no existian como ejemplo: el barrido
 *     del deploy visitaba paginas en blanco y las daba por buenas.
 *
 * Ninguno de los otros 73 casos puede ver esto: `categorias-arbol` y
 * `salud-ejemplos` solo miran lo que YA esta registrado. Lo que falta en el
 * registry es invisible por construccion.
 *
 * Este caso no abre el navegador ni resuelve nada: lee los cuatro ficheros.
 * El registry se lee ESTATICAMENTE (nada de empaquetar): su bundle arrastra el
 * visor entero y pide `window`, que en Node no existe.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { empaquetar, R } from "../lib/bundle.mjs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, "..", "..");
const SRC = join(RAIZ, "examples", "src");

export const nombre = "listas-de-ids";
export const descripcion =
  "registry = vite = carpetas = _ids.txt: un ejemplo tiene que estar en los cuatro sitios";

/** Carpetas con `index.html` que a proposito NO son un ejemplo. */
const NO_SON_EJEMPLO = new Set([
  "workspace",            // el hub
  "workspace_existent",   // variantes del hub
  "workspace_new",
  "inicio",               // la portada
]);

// El MISMO arranque en seco que usa `categorias-arbol`: el registry arrastra el
// visor entero, que pide `window`, `document` y `localStorage`. Se los damos de
// mentira para poder leer los ids de verdad (nada de adivinarlos con una regex:
// un fichero puede exportar varios ExampleDef y la regex se los come).
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
export const ids = examplesRegistry.map((e) => e.id);
`;

export async function correr() {
  const { ids: registry } = await empaquetar(FUENTE, "listas-de-ids");
  const registrySet = new Set(registry);

  const vite = readFileSync(join(RAIZ, "examples", "vite.config.ts"), "utf-8");
  const viteIds = new Set();
  // La clave puede ir con comillas ("edif-acero": ...) o sin ellas (beams: ...).
  for (const m of vite.matchAll(/(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:\s*"src\/([^"]+)\/index\.html"/g))
  {
    const id = m[1] ?? m[2];
    if (!NO_SON_EJEMPLO.has(id)) viteIds.add(id);
  }

  const carpetas = new Set(
    readdirSync(SRC, { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(join(SRC, d.name, "index.html")))
      .map((d) => d.name)
      .filter((d) => !NO_SON_EJEMPLO.has(d))
  );

  const idsTxt = new Set(
    readFileSync(join(RAIZ, "cli", "shots", "deploy", "_ids.txt"), "utf-8")
      .split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
      .filter((d) => !NO_SON_EJEMPLO.has(d))
  );

  // Las CARPETAS que el registry importa. Hace falta aparte de los ids porque la
  // convencion «id = nombre de la carpeta» no siempre se cumple:
  // `puente-reticular/` declara id `puente`, `diagrid-parametrico/` declara
  // `diagrid`… Comparar carpeta contra id daria falsos positivos.
  const regTxt = readFileSync(join(SRC, "workspace", "exampleRegistry.ts"), "utf-8");
  const carpetasRegistradas = new Set();
  for (const m of regTxt.matchAll(/from\s+"\.\.\/([^"\/]+)\//g)) carpetasRegistradas.add(m[1]);
  const panel = readFileSync(join(SRC, "workspace", "ejemplosConPanelPropio.ts"), "utf-8");
  for (const m of panel.matchAll(/legacy\(\s*"([^"]+)"/g)) carpetasRegistradas.add(m[1]);

  const menos = (a, b) => [...a].filter((x) => !b.has(x));
  const lista = (a) => (a.length ? a.slice(0, 8).join(", ") + (a.length > 8 ? ` (+${a.length - 8})` : "") : "—");

  const vistos = new Set(), dup = [];
  for (const id of registry) { if (vistos.has(id)) dup.push(id); vistos.add(id); }

  const carpetaSinRegistro = menos(carpetas, carpetasRegistradas);

  const carpetaSinVite     = menos(carpetas, viteIds);
  const viteSinCarpeta     = menos(viteIds, carpetas);
  const idsTxtFantasma     = menos(idsTxt, registrySet);
  const registroSinBarrer  = menos(registrySet, idsTxt);

  const fila = (que, arr, detalle) => ({
    que, medido: arr.length, limite: 0, ok: arr.length === 0,
    detalle: `${lista(arr)} — ${detalle}`, crudo: true,
  });

  return [
    fila("ids repetidos en el registry", dup, "el segundo nunca se puede abrir"),
    fila("carpeta con index.html sin ExampleDef", carpetaSinRegistro, "se compilan y el selector no las ofrece"),
    fila("carpeta sin entrada en vite.config", carpetaSinVite, "su /<id>/ da 404 en produccion"),
    fila("entrada en vite sin carpeta", viteSinCarpeta, "el build falla o compila vacio"),
    fila("_ids.txt con ids que no existen", idsTxtFantasma, "el barrido del deploy los da por buenos"),
    fila("ejemplos que el barrido NO mira", registroSinBarrer, "faltan en _ids.txt"),
    { que: "total de ExampleDef", medido: registry.length, limite: registry.length, ok: true,
      detalle: `${viteIds.size} en vite · ${carpetas.size} carpetas · ${idsTxt.size} en _ids.txt`, crudo: true },
  ];
}
