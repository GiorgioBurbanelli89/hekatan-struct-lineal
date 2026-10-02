import { empaquetar, R } from "../tests/lib/bundle.mjs";
globalThis.window = globalThis; globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
const m = await empaquetar(`export { examplesRegistry } from "${R}/examples/src/workspace/exampleRegistry";\n`, "reg2" + Date.now());
const cnt = {}, ej = {};
for (const ex of m.examplesRegistry) for (const [k, p] of Object.entries(ex.params ?? {})) {
  if (p.unitType || p.options || p.boolean || typeof p.default !== "number") continue;
  const u = (p.label ?? "").match(/\(([^()]*(?:kN|tonf|kip|kgf|MPa|GPa|kPa|psi|ksi|m|cm|mm|in|ft)[^()]*)\)\s*$/)?.[1];
  if (!u) continue;
  cnt[u] = (cnt[u] ?? 0) + 1; (ej[u] ??= new Set()).add(ex.id);
}
for (const [u, n] of Object.entries(cnt).sort((a, b) => b[1] - a[1])) console.log(String(n).padStart(4), u.padEnd(14), [...ej[u]].length, "ejemplos");
