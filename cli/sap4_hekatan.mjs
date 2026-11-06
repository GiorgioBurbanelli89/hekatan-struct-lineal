// Lado Hekatan del oraculo SAP IV: e2k -> .heks -> resuelve (patron dado) -> JSON {heks, nodes, U, normals, reactions}.
// Uso: node cli/sap4_hekatan.mjs <modelo.e2k> <salida_dir> <Patron> [opcionesJSON]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { cargarMod } from "../tests/lib/vano_cmp.mjs";
import { resolverHeks } from "../tests/lib/heks.mjs";
const [, , e2k, out, pat = "Dead", opc = "{}"] = process.argv;
const sil = async (f) => { const l = console.log, w = console.warn, e = console.error, i = console.info; console.log = console.warn = console.error = console.info = () => {};
  try { return await f(); } finally { console.log = l; console.warn = w; console.error = e; console.info = i; } };
mkdirSync(out, { recursive: true });
const mod = await cargarMod();
const res = await sil(() => mod.e2kAHeks(readFileSync(e2k, "latin1"), "m.e2k", JSON.parse(opc)));
const fh = join(out, "modelo.heks"); writeFileSync(fh, res.heks);
globalThis.__hekatanFactoresPatron = { [pat]: 1 };
const s = await sil(() => resolverHeks(fh));
const N = s.analyzeOutputs.normals, SY = s.analyzeOutputs.shearsY, SZ = s.analyzeOutputs.shearsZ;
const barras = [];
s.elements.forEach((el, i) => { if (el.length === 2) barras.push({ i, n: el, P: N.get(i) ?? null, Vy: SY?.get(i) ?? null, Vz: SZ?.get(i) ?? null }); });
const dump = { pat, nodes: s.nodes, U: Object.fromEntries(s.deformOutputs.deformations), R: Object.fromEntries(s.deformOutputs.reactions ?? []), barras };
writeFileSync(join(out, `hek_${pat}.json`), JSON.stringify(dump));
console.log("ok", s.nodes.length, "nudos", barras.length, "barras");
