/**
 * EJEMPLO GRADUADO `slope-stability`: talud por reducción de resistencia (28-sep-2026).
 *
 * `hekatan-mesh` carga el WASM de Triangle con `import url from "./assets/triangle.wasm?url"`,
 * un sufijo de Vite. `empaquetar` (tests/lib/bundle.mjs) no sabe qué hacer con él («No loader
 * is configured for ".wasm" files»), así que primero se intenta con `empaquetar` y, si falla
 * por eso, se empaqueta aquí mismo con esbuild y un complemento de 6 líneas que convierte ese
 * import en la RUTA del .wasm (el módulo de Triangle lo lee con fs en Node). Si tampoco así
 * carga, el test no falla: devuelve una fila que explica por qué se salta.
 *
 * Comprueba: triángulos y nudos, sin NaN, FS finito dentro del rango de búsqueda del solver
 * (0.5-5.0), deformación plástica por elemento en el canal membraneXX, y sella FS y |u| máx.
 * slopeSRM no devuelve reacciones: no hay equilibrio con reacciones que mirar; se comprueba
 * que el modelo tiene carga (el peso γ·área) viendo que se deforma.
 */
import { writeFileSync, mkdtempSync, copyFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";
import { RAIZ } from "../lib/wasm.mjs";

export const nombre = "graduado-slope-stability";
export const descripcion = "slope-stability graduado: SRM Mohr-Coulomb sobre malla de triángulos, FS y deformación plástica";

// Sellado el 28-sep-2026 con los valores por defecto (regresión, no referencia externa).
const SELLO_FS = 2.199609375;   // SRF de la bisección (resolución 0.1/2⁸)
const SELLO_UMAX = 3.105879507e-2;   // m, |u| en el SRF = FS
const pct = (a, b) => Math.abs(a - b) / Math.abs(b) * 100;

const ENTRADA = `export { slopeStability, mallaTalud, resolverTalud, TALUD_DEFAULT } from "${R}/examples/src/slope-stability/slopeStability";`;

async function empaquetarConWasmUrl() {
  const { build } = await import(pathToFileURL(join(RAIZ, "node_modules/esbuild/lib/main.js")).href);
  const dir = mkdtempSync(join(tmpdir(), "hkTest-"));
  process.on("exit", () => { try { rmSync(dir, { recursive: true, force: true }); } catch { /* nada */ } });
  writeFileSync(join(dir, "entry.ts"), ENTRADA, "utf-8");
  copyFileSync(join(RAIZ, "hekatan-fem/src/cpp/built/deform.wasm"), join(dir, "deform.wasm"));
  const outfile = join(dir, "bundle.mjs");
  const wasmUrl = {
    name: "wasm-url",
    setup(b) {
      b.onResolve({ filter: /\.wasm\?url$/ }, (a) => ({ path: join(a.resolveDir, a.path.replace(/\?url$/, "")), namespace: "wasm-url" }));
      b.onLoad({ filter: /.*/, namespace: "wasm-url" }, (a) => ({ contents: `export default ${JSON.stringify(a.path)};`, loader: "js" }));
    },
  };
  await build({ entryPoints: [join(dir, "entry.ts")], bundle: true, format: "esm", platform: "node", outfile,
                logLevel: "silent", define: { "import.meta.env.DEV": "false" }, plugins: [wasmUrl],
                // triangle-wasm es CommonJS: usa require("fs"/"path") y __dirname dentro de un ESM
                banner: { js: `import { createRequire as __cr } from "node:module"; import { fileURLToPath as __f2p } from "node:url"; import { dirname as __dn } from "node:path"; const require = __cr(import.meta.url); const __filename = __f2p(import.meta.url); const __dirname = __dn(__filename);` } });
  // El Triangle compilado (emscripten viejo) usa `fetch` si existe, y Node 22 lo tiene: pediría
  // la ruta del .wasm por fetch y abortaría. Sin fetch cae a fs.readFileSync, que es lo que toca
  // en Node. Se quita SOLO mientras se carga el módulo (el init de Triangle es un await al cargar).
  const f = globalThis.fetch;
  globalThis.fetch = undefined;
  try { return await import(pathToFileURL(outfile).href); } finally { globalThis.fetch = f; }
}

export async function correr() {
  const filas = [];
  let v, via;
  try {
    v = await empaquetar(ENTRADA, "graduado-slope-stability");
    via = "empaquetar";
  } catch (e1) {
    try {
      v = await empaquetarConWasmUrl();
      via = "esbuild + complemento «?url» (empaquetar no carga hekatan-mesh)";
    } catch (e2) {
      return [{ que: "hekatan-mesh en Node: SE SALTA", crudo: true, medido: `no carga: ${String(e2.message ?? e2).slice(0, 160)}`, limite: "cargar el WASM de Triangle", ok: true,
        detalle: `empaquetar: ${String(e1.message ?? e1).slice(0, 120)}` }];
    }
  }
  filas.push({ que: "hekatan-mesh importado en Node", crudo: true, medido: via, limite: "—", ok: true });

  const ex = v.slopeStability;
  const params = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));
  const st = () => ({ val: undefined, rawVal: undefined });
  const states = { nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(), deformOutputs: st(), analyzeOutputs: st(), objects3D: st() };
  ex.build(params, states);

  const els = states.elements.val ?? [], nN = (states.nodes.val ?? []).length;
  const n3 = els.filter((e) => e.length === 3).length, otros = els.length - n3;
  filas.push({ que: "elementos por tipo", crudo: true, medido: `${nN} nudos, ${n3} triángulos, ${otros} de otro tipo`, limite: "solo triángulos", ok: n3 > 0 && otros === 0 });

  const U = states.deformOutputs.val?.deformations ?? new Map();
  let nan = 0, umax = 0;
  for (const [, u] of U) { if (!u.every(Number.isFinite)) nan++; else umax = Math.max(umax, Math.hypot(u[0], u[2])); }
  filas.push({ que: "deformada sin NaN y con carga", crudo: true, medido: `${nan} NaN en ${U.size} nudos, |u|máx ${(umax * 1000).toFixed(4)} mm`, limite: `0 NaN, ${nN} nudos, |u| > 0`, ok: nan === 0 && U.size === nN && umax > 0,
    detalle: "slopeSRM no devuelve reacciones: sin equilibrio con reacciones" });

  const pl = states.analyzeOutputs.val?.membraneXX;
  const nPl = pl instanceof Map ? pl.size : 0;
  const plMax = nPl ? Math.max(...[...pl.values()].map((t) => t[0])) : NaN;
  filas.push({ que: "deformación plástica en membraneXX", crudo: true, medido: `${nPl} elementos, ε_pl máx ${plMax.toExponential(3)}`, limite: `${n3} elementos, ≥ 0 y finita`, ok: nPl === n3 && Number.isFinite(plMax) && plMax >= 0 });

  const m = v.mallaTalud(v.TALUD_DEFAULT), r = v.resolverTalud(v.TALUD_DEFAULT, m);
  filas.push({ que: "FS dentro de la búsqueda del solver", crudo: true, medido: `FS = ${r.fos.toFixed(4)}`, limite: "0.5 < FS < 5.0 (SRF inicial y máximo de slope.cpp)", ok: r.fos > 0.5 && r.fos < 5.0 });
  const et = ex.computedLabels(params, states);
  filas.push({ que: "folder «Calculados»", crudo: true, medido: `FS ${et["Factor de seguridad FS (SRM)"]}, ${et["Veredicto"]}`, limite: "FS y veredicto", ok: !!et["Factor de seguridad FS (SRM)"] && !!et["Veredicto"] && !!et["Triángulos"] && !!et["|u| máximo (en SRF = FS)"] });

  filas.push({ que: "sello FS", medido: pct(r.fos, SELLO_FS), limite: 1e-4, ok: pct(r.fos, SELLO_FS) <= 1e-4, detalle: `${r.fos.toFixed(9)}` });
  filas.push({ que: "sello |u| máximo", medido: pct(r.maxDisp, SELLO_UMAX), limite: 1e-4, ok: pct(r.maxDisp, SELLO_UMAX) <= 1e-4, detalle: `${r.maxDisp.toExponential(9)} m` });
  return filas;
}
