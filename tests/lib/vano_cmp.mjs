/** Comparacion Hekatan vs ETABS del modelo de UN VANO (tests/datos/e2k_vano_simple_*). Devuelve metricas por patron. */
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "./bundle.mjs";
import { resolverHeks } from "./heks.mjs";
const AQUI = dirname(fileURLToPath(import.meta.url));
export const key = (p) => p.map((v) => Math.round(v * 1000)).join("|");
export async function cargarMod() { return await empaquetar(`export { e2kAHeks } from "${R}/examples/src/shared/e2kAHeks";\n`, "e2k-vano"); }
const silencio = async (f) => { const l = console.log, w = console.warn, e = console.error, i = console.info; console.log = () => {}; console.warn = () => {}; console.error = () => {}; console.info = () => {};
  try { return await f(); } finally { console.log = l; console.warn = w; console.error = e; console.info = i; } };
export async function medir(mod, nom, opc, pats = ["Dead", "Live", "LATX", "LATY"], pref = "e2k_vano_simple_") {
  const dir = mkdtempSync(join(tmpdir(), "vano-"));
  const ref = JSON.parse(readFileSync(join(AQUI, "..", "datos", `${pref}${nom}_ref.json`), "utf-8"));
  const { extraHeks = "", ...opcE2k } = opc;   // extraHeks: lineas que se anaden al .heks (p.ej. "shelldrill todos 0")
  const res = await silencio(() => mod.e2kAHeks(readFileSync(join(AQUI, "..", "datos", `${pref}${nom}.e2k`), "latin1"), `${nom}.e2k`, opcE2k));
  const fh = join(dir, `${nom}.heks`); writeFileSync(fh, extraHeks ? res.heks + "\n" + extraHeks + "\n" : res.heks);
  const out = { nElem: res.modelo.elements.length, nNodes: res.modelo.nodes.length, pat: {} };
  for (const pat of pats) {
    globalThis.__hekatanFactoresPatron = { [pat]: 1 };
    const s = await silencio(() => resolverHeks(fh));
    const idx = new Map(s.nodes.map((p, i) => [key(p), i]));
    const U = s.deformOutputs.deformations, Rn = s.deformOutputs.reactions;
    const d = { U: [], peor: [], max: [], R: [], Rtot: [0, 0, 0], Etot: [0, 0, 0], nodoPeor: [] };
    for (let k = 0; k < 3; k++) {
      let sq = 0, sr = 0, pk = 0, mx = 0, np = "";
      for (const [nm, v] of Object.entries(ref.JointDispl[pat])) { const u = U.get(idx.get(key(ref.pts[nm]))) ?? [0, 0, 0]; const e = Math.abs(u[k] - v[k]); sq += e * e; sr += v[k] ** 2; if (e > pk) { pk = e; np = ref.pts[nm].join(","); } mx = Math.max(mx, Math.abs(v[k])); }
      d.U.push(100 * Math.sqrt(sq / (sr || 1e-30))); d.peor.push(pk * 1e3); d.max.push(mx * 1e3); d.nodoPeor.push(np);
      let sq2 = 0, sr2 = 0;
      for (const [nm, v] of Object.entries(ref.JointReact[pat])) { const h = Rn?.get(idx.get(key(ref.pts[nm]))) ?? [0, 0, 0]; sq2 += (h[k] - v[k]) ** 2; sr2 += v[k] ** 2; d.Rtot[k] += h[k]; d.Etot[k] += v[k]; }
      d.R.push(100 * Math.sqrt(sq2 / (sr2 || 1e-30)));
    }
    // axil de barras con muestra en ETABS (cordones Tubo 50 y todas las demas): P de ETABS en extremo I (estacion 0), signo + traccion
    const el = new Map(); s.elements.forEach((e, i) => { if (e.length === 2) el.set(key(s.nodes[e[0]]) + ">" + key(s.nodes[e[1]]), i); });
    const N = s.analyzeOutputs.normals; d.axil = [];
    for (const b of Object.values(ref.barras)) {
      if (!b[pat]) continue;
      let i = el.get(key(b.p1) + ">" + key(b.p2)); if (i === undefined) i = el.get(key(b.p2) + ">" + key(b.p1));
      if (i === undefined) continue;
      const pe = Math.max(...b[pat].P.map(Math.abs)), ph = N?.get(i); if (!ph) continue;
      d.axil.push({ sec: b.sec, p1: b.p1, p2: b.p2, etabs: pe, hek: Math.max(Math.abs(ph[0]), Math.abs(ph[1])) });
    }
    out.pat[pat] = d;
  }
  return out;
}
