import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os"; import { join } from "node:path";
import { cargarMod, key } from "../tests/lib/vano_cmp.mjs";
import { resolverHeks } from "../tests/lib/heks.mjs";
const sil = async (f) => { const l = console.log, w = console.warn, e = console.error, i = console.info; console.log = console.warn = console.error = console.info = () => {};
  try { return await f(); } finally { console.log = l; console.warn = w; console.error = e; console.info = i; } };
const mod = await cargarMod();
const ref = JSON.parse(readFileSync("tests/datos/e2k_cercha_ref.json", "utf-8"));
const R5 = JSON.parse(readFileSync("C:/ETABS/mercado/galpon/ref_galpon5.json", "utf-8"));
const res = await sil(() => mod.e2kAHeks(readFileSync("tests/datos/e2k_cercha.e2k", "latin1"), "cercha.e2k", JSON.parse(process.argv[2] || "{}")));
const fh = join(mkdtempSync(join(tmpdir(), "cercha-")), "c.heks"); writeFileSync(fh, res.heks);
globalThis.__hekatanFactoresPatron = { Dead: 1 };
const s = await sil(() => resolverHeks(fh));
const idx = new Map(s.nodes.map((p, i) => [key(p), i]));
const Rn = s.deformOutputs.reactions; let tE = 0, tH = 0; const rows = [];
for (const [nm, v] of Object.entries(R5.JointReact.Dead)) { const p = ref.pts[nm]; const h = Rn.get(idx.get(key(p))) ?? [0, 0, 0]; tE += v[2]; tH += h[2]; if (Math.abs(h[2] - v[2]) > 0.05) rows.push([p.join(","), v[2].toFixed(3), h[2].toFixed(3), (h[2] - v[2]).toFixed(3)]); }
rows.sort(); console.log("Fz ETABS", tE.toFixed(3), "Hek", tH.toFixed(3)); for (const r of rows) console.log(r.join("  "));
