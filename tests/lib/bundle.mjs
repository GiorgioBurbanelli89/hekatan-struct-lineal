/**
 * Empaqueta un trozo de TypeScript del repo con esbuild y lo importa, para
 * poder llamar al motor desde Node sin navegador. El .wasm se copia al lado del
 * bundle porque el modulo de emscripten lo busca junto a si mismo.
 */
import { writeFileSync, mkdtempSync, copyFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { RAIZ } from "./wasm.mjs";

/** Ruta del repo en el formato que entiende un import de esbuild. */
export const R = RAIZ.replace(/\\/g, "/");

const cache = new Map();

export async function empaquetar(fuenteEntry, llave = fuenteEntry) {
  if (cache.has(llave)) return cache.get(llave);
  const { build } = await import(pathToFileURL(join(RAIZ, "node_modules/esbuild/lib/main.js")).href);
  const dir = mkdtempSync(join(tmpdir(), "hkTest-"));
  // Se borra al salir: sin esto quedaron 2073 carpetas hkTest-* (4.7 GB) y el disco se lleno
  // a mitad de una suite (5-sep-2026). ENOSPC hace fallar los tests sin que el codigo este mal.
  process.on("exit", () => { try { rmSync(dir, { recursive: true, force: true }); } catch { /* nada */ } });
  writeFileSync(join(dir, "entry.ts"), fuenteEntry, "utf-8");
  const wasm = join(RAIZ, "hekatan-fem/src/cpp/built/deform.wasm");
  if (!existsSync(wasm)) throw new Error("falta " + wasm + " — compilar el WASM primero");
  copyFileSync(wasm, join(dir, "deform.wasm"));
  const outfile = join(dir, "bundle.mjs");
  // `hekatan-mesh` carga el WASM de Triangle con `import url from "./assets/triangle.wasm?url"`,
  // un sufijo de Vite que esbuild no conoce («No loader is configured for ".wasm" files»). Se
  // convierte en la RUTA del fichero, que en Node el módulo lee con fs. Hace falta desde que el
  // talud (`slope-stability`) está en el registro: sin esto no cargaba ningún test que lo lea.
  const wasmUrl = {
    name: "wasm-url",
    setup(b) {
      b.onResolve({ filter: /\.wasm\?url$/ }, (a) => ({ path: join(a.resolveDir, a.path.replace(/\?url$/, "")), namespace: "wasm-url" }));
      b.onLoad({ filter: /.*/, namespace: "wasm-url" }, (a) => ({ contents: `export default ${JSON.stringify(a.path)};`, loader: "js" }));
    },
  };
  await build({ entryPoints: [join(dir, "entry.ts")], bundle: true, format: "esm",
                platform: "node", outfile, logLevel: "error", plugins: [wasmUrl],
                // triangle-wasm es CommonJS: usa require("fs") y __dirname dentro de un ESM
                banner: { js: `import { createRequire as __hkCr } from "node:module"; import { fileURLToPath as __hkF2p } from "node:url"; import { dirname as __hkDn } from "node:path"; const require = __hkCr(import.meta.url); const __filename = __hkF2p(import.meta.url); const __dirname = __hkDn(__filename);` },
                // En Node no hay `import.meta.env` (lo define Vite): sin esto cualquier modulo
                // del registro revienta con «reading 'DEV'» (13 casos de la suite, 28-sep-2026).
                // false = como en el build: fuera el ejemplo que solo existe en `npm run dev`.
                define: { "import.meta.env.DEV": "false" } });
  // El Triangle compilado usa `fetch` si existe, y Node 22 lo tiene: pediría el .wasm por fetch
  // y abortaría. Sin él cae a fs. Se quita SOLO mientras carga el módulo.
  const f = globalThis.fetch;
  globalThis.fetch = undefined;
  let mod;
  try { mod = await import(pathToFileURL(outfile).href); } finally { globalThis.fetch = f; }
  cache.set(llave, mod);
  return mod;
}

/** El paquete hekatan-fem entero (plateQ4Solve, deform, analyze, modalAnalysis...). */
export const cargarFem = () => empaquetar(`export * from "${R}/hekatan-fem/src/index";\n`, "fem");
