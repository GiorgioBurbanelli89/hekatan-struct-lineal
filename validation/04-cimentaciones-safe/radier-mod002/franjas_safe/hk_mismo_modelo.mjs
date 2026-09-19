#!/usr/bin/env node
/**
 * Lado Hekatan del careo MISMO MODELO contra SAFE 20 (radier con DNE, combo DISEÑO).
 *   node hk_mismo_modelo.mjs modelo.heks salida_prefijo
 * Escribe: <pref>_SAFE20.f2k (el f2k que exporta la app, patrones + combos) y <pref>_hk.json
 * (nudos, elementos y fuerzas por nudo de elemento M11 M22 M12 F11 F22 F12 V13 V23 para DISEÑO).
 * Usa el árbol COMMITEADO (HEAD): los ficheros con cambios sin commit de otros agentes que tocan la
 * recuperación de fuerzas (`git diff --name-only HEAD` dentro de hekatan-fem/ y examples/) se
 * sustituyen al empaquetar por su versión de HEAD (plugin de esbuild), sin tocar el árbol de trabajo.
 */
import { writeFileSync, readFileSync, mkdtempSync, copyFileSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL, fileURLToPath } from "node:url";
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const R = RAIZ.replace(/\\/g, "/");
const [heks, pref] = process.argv.slice(2);
const sucios = process.env.HK_ARBOL_TRABAJO === "1" ? [] : execSync("git diff --name-only HEAD -- hekatan-fem examples", { cwd: RAIZ, encoding: "utf-8" }).split("\n").filter(Boolean);
const head = execSync("git rev-parse HEAD", { cwd: RAIZ, encoding: "utf-8" }).trim();
const mapa = new Map(sucios.map(p => [resolve(RAIZ, p).toLowerCase(), execSync(`git show HEAD:${p}`, { cwd: RAIZ, encoding: "utf-8", maxBuffer: 1 << 26 })]));
console.log("HEAD", head, "| sustituidos por HEAD:", sucios.join(", ") || "ninguno");
const plugin = { name: "head", setup(b) {
  b.onLoad({ filter: /\.(ts|tsx|js|mjs)$/ }, a => {
    const t = mapa.get(resolve(a.path).toLowerCase());
    return t == null ? undefined : { contents: t, loader: a.path.endsWith(".ts") ? "ts" : "js", resolveDir: dirname(a.path) };
  });
} };
const entry = `
const g = globalThis; g.window = g;
const ctx2d = () => new Proxy({ font:"", measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop(){}}), getImageData:()=>({data:new Uint8ClampedArray(4)}) }, { get:(t,k)=> k in t ? t[k] : (()=>{}) });
const nodo = () => ({ style:{}, width:300, height:150, appendChild(){}, setAttribute(){}, addEventListener(){}, removeEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>ctx2d(), querySelector:()=>null, querySelectorAll:()=>[], remove(){}, insertBefore(){}, cloneNode:()=>nodo(), toDataURL:()=>"", getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) });
g.document = { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
g.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} }; g.addEventListener = () => {}; g.matchMedia = () => ({ matches:false, addEventListener(){}, addListener(){} });
const { cliModeler } = await import("${R}/examples/src/cli-modeler/cliModeler");
const { exportF2k } = await import("${R}/examples/src/shared/f2kExporter");
export function correr(texto, factores) {
  const st = (v) => ({ val: v });
  const states = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  globalThis.window = { __hekatanCliScript: texto };
  globalThis.__hekatanFactoresPatron = factores;
  cliModeler.build({}, states);
  return states;
}
export function f2k20(texto) {
  const st = (v) => ({ val: v });
  const states = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  globalThis.window = { __hekatanCliScript: texto }; globalThis.__hekatanFactoresPatron = undefined;
  cliModeler.build({}, states);
  return exportF2k({ nodes: states.nodes.val, elements: states.elements.val, nodeInputs: states.nodeInputs.val, elementInputs: states.elementInputs.val, title: "Hekatan heks", patrones: true, versionSafe: 20 });
}`;
const { build } = await import(pathToFileURL(join(RAIZ, "node_modules/esbuild/lib/main.js")).href);
const dir = mkdtempSync(join(tmpdir(), "hkTest-"));
process.on("exit", () => { try { rmSync(dir, { recursive: true, force: true }); } catch {} });
writeFileSync(join(dir, "entry.ts"), entry);
copyFileSync(join(RAIZ, "hekatan-fem/src/cpp/built/deform.wasm"), join(dir, "deform.wasm"));
await build({ entryPoints: [join(dir, "entry.ts")], bundle: true, format: "esm", platform: "node", outfile: join(dir, "b.mjs"), logLevel: "error", plugins: [plugin] });
const mod = await import(pathToFileURL(join(dir, "b.mjs")).href);
const texto = readFileSync(heks, "utf-8");
writeFileSync(pref + "_SAFE20.f2k", mod.f2k20(texto));
const FACT = JSON.parse(process.env.HK_FACT || '{"Dead":1.2,"DNE":1.2,"Live":1.6}');
const s = mod.correr(texto, FACT);
let Pz = 0; s.nodeInputs.val.loads?.forEach?.(v => Pz += v[2]); console.log("Fz de nodeInputs.loads (patrón Dead, SIN factores)", Pz.toFixed(2), JSON.stringify(FACT));
const a = s.analyzeOutputs.val, K = ["bendingXXjoint", "bendingYYjoint", "bendingXYjoint", "membraneXXjoint", "membraneYYjoint", "membraneXYjoint", "tranverseShearX", "tranverseShearY"];
const els = {};
s.elements.val.forEach((e, i) => { if (e.length === 4 && a.bendingXXjoint?.get(i)) els[i] = { n: e, f: e.map((_, j) => K.map(k => a[k]?.get(i)?.[j] ?? null)), h: s.elementInputs.val.thicknesses?.get?.(i), bm: s.elementInputs.val.bendingModifiers?.get?.(i) ?? 1 }; });
let Fz = 0; s.deformOutputs.val.reactions?.forEach?.(r => Fz += r[2]);
writeFileSync(pref + "_hk.json", JSON.stringify({ head, sustituidos: sucios, combo: "DISEÑO 1.2D+1.2DNE+1.6L", campos: "M11 M22 M12 F11 F22 F12 V13 V23 (kN, m)", nodes: s.nodes.val, els, U: Object.fromEntries(s.deformOutputs.val.deformations ?? []) }));
console.log(`nudos ${s.nodes.val.length}, cáscaras ${Object.keys(els).length}, ΣRz ${Fz.toFixed(2)} kN -> ${pref}_SAFE20.f2k, ${pref}_hk.json`);
