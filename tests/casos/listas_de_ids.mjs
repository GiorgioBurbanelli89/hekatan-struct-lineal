/**
 * TODO VIVE EN EL WORKSPACE, Y LAS LISTAS DE IDS DICEN LO MISMO.
 *
 * Regla de Jorge (28-sep-2026): «todo debe estar en el workspace, nada en otro lado».
 * Hasta ese día el build sacaba una página por ejemplo (154) y este caso comprobaba que
 * registro, vite, carpetas y `_ids.txt` coincidieran. Ahora comprueba lo contrario: que NO
 * haya páginas sueltas.
 *
 *   1. `examples/src/workspace/exampleRegistry.ts` — lo que ofrece el selector y carga `?t=<id>`.
 *   2. `examples/vite.config.ts` — se compila el workspace y, además, solo los ejemplos que
 *      todavía traen su propio panel (`standaloneUrl`). Las direcciones de antes son
 *      redirecciones (`PAGINAS_DE_ANTES`) y tienen que apuntar a un ejemplo que exista.
 *   3. `examples/src/<carpeta>/index.html` — solo puede haberlo en esas mismas carpetas.
 *   4. `cli/shots/deploy/_ids.txt` — lo que barre el chequeo del deploy.
 *
 * Historia (18-sep-2026, medido): 21 ejemplos vivían en un fichero que no importaba nadie;
 * tenían carpeta y página compilada pero `?t=arco` no cargaba nada. Y `_ids.txt` llevaba 20
 * ids que no existían. Nada de eso daba error en ningún sitio.
 *
 * No abre el navegador ni resuelve nada: lee los ficheros y carga el registro en seco.
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
  "todo en el workspace: una sola página compilada, redirecciones que llegan, y registro = _ids.txt";

// El MISMO arranque en seco que usa `categorias-arbol`: el registro arrastra el visor entero,
// que pide `window`, `document` y `localStorage`. Se los damos de mentira para leer los ids de
// verdad (nada de adivinarlos con una regex: un fichero puede exportar varios ExampleDef).
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
export const ejemplos = examplesRegistry.map((e) => ({
  id: e.id, embebido: !!e.standaloneUrl, conBuild: typeof e.build === "function",
}));
`;

/**
 * Carpetas que ya estaban sin usar el 28-sep-2026, con lo que hay dentro. No se borraron ni se
 * registraron porque eso lo decide Jorge. Una carpeta NUEVA sin usar sí hace fallar el caso.
 */
const HUERFANAS_DECLARADAS = {
  "benchmark-steel-beam": "un ExampleDef (viga de acero biempotrada) que nunca se registró",
  "plate-thick-validacion": "un ExampleDef de validación de placa gruesa, fuera del registro",
  "tutorials": "un panel de tutoriales (tutorialPanel.ts) que no importa nadie; el que se usa es shared/tutoriales.ts",
};

/** Todos los .ts bajo una carpeta. */
function ficherosTs(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) ficherosTs(f, out);
    else if (e.name.endsWith(".ts")) out.push(f);
  }
  return out;
}

export async function correr() {
  const { ejemplos } = await empaquetar(FUENTE, "listas-de-ids");
  const registry = ejemplos.map((e) => e.id);
  const registrySet = new Set(registry);
  const embebidos = new Set(ejemplos.filter((e) => e.embebido).map((e) => e.id));
  const sinCorrer = ejemplos.filter((e) => !e.embebido && !e.conBuild).map((e) => e.id);

  const vite = readFileSync(join(RAIZ, "examples", "vite.config.ts"), "utf-8");
  // lo que se COMPILA: las claves de `input`
  const bloque = /input:\s*\{([\s\S]*?)\n\s*\},/.exec(vite)?.[1] ?? "";
  const compiladas = new Set();
  for (const m of bloque.matchAll(/(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:\s*"src\/([^"]+)\/index\.html"/g))
    compiladas.add(m[1] ?? m[2]);
  // las REDIRECCIONES: carpeta de antes → id
  const redir = new Map();
  const bloqueR = /const PAGINAS_DE_ANTES[^=]*=\s*\{([\s\S]*?)\n\};/.exec(vite)?.[1] ?? "";
  for (const m of bloqueR.matchAll(/"([^"]+)"\s*:\s*"([^"]*)"/g)) redir.set(m[1], m[2]);

  const conPagina = new Set(
    readdirSync(SRC, { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(join(SRC, d.name, "index.html")))
      .map((d) => d.name));

  const idsTxt = new Set(
    readFileSync(join(RAIZ, "cli", "shots", "deploy", "_ids.txt"), "utf-8")
      .split(/\r?\n/).map((s) => s.trim()).filter(Boolean));

  // carpetas de `examples/src` que NADIE importa: código que no llega al producto
  const importadas = new Set(["workspace"]);
  for (const f of ficherosTs(SRC))
    for (const m of readFileSync(f, "utf-8").matchAll(/(?:from|import)\s*\(?\s*"\.\.\/([^"\/]+)\//g)) importadas.add(m[1]);
  const carpetas = readdirSync(SRC, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  const huerfanasTodas = carpetas.filter((c) => !importadas.has(c) && !embebidos.has(c));
  const huerfanas = huerfanasTodas.filter((c) => !(c in HUERFANAS_DECLARADAS));
  const yaNoHuerfanas = Object.keys(HUERFANAS_DECLARADAS).filter((c) => !huerfanasTodas.includes(c));

  const menos = (a, b) => [...a].filter((x) => !b.has(x));
  const lista = (a) => (a.length ? a.slice(0, 8).join(", ") + (a.length > 8 ? ` (+${a.length - 8})` : "") : "—");
  const vistos = new Set(), dup = [];
  for (const id of registry) { if (vistos.has(id)) dup.push(id); vistos.add(id); }

  const debenCompilarse = new Set(["workspace", ...embebidos]);
  const redirRotas = [...redir].filter(([, id]) => id !== "" && !registrySet.has(id)).map(([c, id]) => `${c} → ${id}`);
  const redirPisan = [...redir.keys()].filter((c) => compiladas.has(c));

  const fila = (que, arr, detalle) => ({
    que, medido: arr.length, limite: 0, ok: arr.length === 0,
    detalle: `${lista(arr)} — ${detalle}`, crudo: true,
  });

  return [
    fila("ids repetidos en el registro", dup, "el segundo nunca se puede abrir"),
    fila("ejemplos que no corren dentro del workspace", sinCorrer, "ni tienen build ni van embebidos: el selector los ofrece y no hacen nada"),
    { que: "ejemplos todavía embebidos en un marco", medido: `${embebidos.size}: ${lista([...embebidos])}`, limite: "quedan por graduar", ok: true, crudo: true,
      detalle: "traen su propio panel" },
    fila("páginas que se compilan de más", menos(compiladas, debenCompilarse), "solo el workspace y los embebidos tienen página"),
    fila("embebidos sin página compilada", menos(debenCompilarse, compiladas), "el marco abriría un 404"),
    fila("carpetas con index.html que no se compila", menos(conPagina, compiladas), "página suelta, fuera del workspace"),
    fila("redirecciones a un ejemplo que no existe", redirRotas, "la dirección de antes llegaría a un workspace vacío"),
    fila("redirecciones que pisan una página compilada", redirPisan, "la redirección se escribe encima de la página"),
    fila("carpetas de ejemplo que nadie importa", huerfanas, "código que no llega al producto"),
    { que: "carpetas sin usar, DECLARADAS", medido: `${huerfanasTodas.length - huerfanas.length}: ${lista(Object.keys(HUERFANAS_DECLARADAS))}`,
      limite: "decidir: registrar o borrar", ok: yaNoHuerfanas.length === 0, crudo: true,
      detalle: yaNoHuerfanas.length ? `ya se usan, sacar de la lista: ${lista(yaNoHuerfanas)}` : "siguen sin usarse" },
    fila("_ids.txt con ids que no existen", menos(idsTxt, registrySet), "el barrido del deploy los da por buenos"),
    fila("ejemplos que el barrido NO mira", menos(registrySet, idsTxt), "faltan en _ids.txt"),
    { que: "total de ExampleDef", medido: registry.length, limite: registry.length, ok: true,
      detalle: `${compiladas.size} páginas compiladas · ${redir.size} redirecciones · ${idsTxt.size} en _ids.txt`, crudo: true },
  ];
}
