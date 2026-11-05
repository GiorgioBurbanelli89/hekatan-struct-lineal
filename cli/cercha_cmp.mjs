// Compara el recorte de cercha (tests/datos/e2k_cercha*) Hekatan vs ETABS: axiles y Uy. Uso: node cli/cercha_cmp.mjs [opcionesJSON]
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os"; import { join } from "node:path";
import { cargarMod, key } from "../tests/lib/vano_cmp.mjs";
import { resolverHeks } from "../tests/lib/heks.mjs";
import { fileURLToPath } from "node:url"; import { dirname } from "node:path";
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const sil = async (f) => { const l = console.log, w = console.warn, e = console.error, i = console.info; console.log = console.warn = console.error = console.info = () => {};
  try { return await f(); } finally { console.log = l; console.warn = w; console.error = e; console.info = i; } };
export async function medirCercha(opc = {}, extraHeks = "") {
  const mod = await cargarMod();
  const D = join(RAIZ, "tests", "datos", "e2k_cercha");
  const ref = JSON.parse(readFileSync(D + "_ref.json", "utf-8"));
  let txt = readFileSync(D + ".e2k", "latin1"); for (const [a, b] of JSON.parse(process.env.E2K_SUST || "[]")) txt = txt.split(a).join(b);
  const res = await sil(() => mod.e2kAHeks(txt, "cercha.e2k", opc));
  const fh = join(mkdtempSync(join(tmpdir(), "cercha-")), "c.heks"); const K1 = +(process.env.SHELLK1 || process.env.SHELLK || 1), K2 = +(process.env.SHELLK2 || process.env.SHELLK || 1), K = K1 * K2 === 1 ? 1 : 2, K12 = +(process.env.SHELLK12 || process.env.SHELLK || 1); const NL = String.fromCharCode(10);
  const hk = K === 1 && K12 === 1 ? res.heks : res.heks.split(NL).map((l) => { const m = l.match(/^shellmod (\d+) (\S+) (\S+) (\S+)(.*)$/); return m ? `shellmod ${m[1]} ${m[2] * K1} ${m[3] * K2} ${m[4] * K12}${m[5]}` : l; }).join(NL);
  const hk2 = process.env.OFF0 ? hk.split(NL).map((l) => l.replace(/^(endoffset \d+ \S+ \S+) 1$/, '$1 0')).join(NL) : hk;
  writeFileSync(fh, hk2 + (extraHeks ? "\n" + extraHeks + "\n" : ""));
  const out = {};
  for (const pat of ["Dead", "Live"]) {
    globalThis.__hekatanFactoresPatron = { [pat]: 1 };
    const s = await sil(() => resolverHeks(fh));
    const idx = new Map(s.nodes.map((p, i) => [key(p), i]));
    const U = s.deformOutputs.deformations;
    const el = new Map(); s.elements.forEach((e, i) => { if (e.length === 2) el.set(key(s.nodes[e[0]]) + ">" + key(s.nodes[e[1]]), i); });
    const N = s.analyzeOutputs.normals;
    const barras = [];
    for (const [nm, b] of Object.entries(ref.barras)) {
      if (!b[pat]) continue;
      let i = el.get(key(b.p1) + ">" + key(b.p2)), inv = false; if (i === undefined) { i = el.get(key(b.p2) + ">" + key(b.p1)); inv = true; }
      if (i === undefined) continue;
      const ph = N.get(i); if (!ph) continue;
      const sy = s.analyzeOutputs.shearsY?.get(i) ?? [0,0], sz = s.analyzeOutputs.shearsZ?.get(i) ?? [0,0];
      const eo = s.elementInputs.endOffsets?.get(i), ho = eo ? (inv ? [eo[1], eo[0], eo[2]] : [eo[0], eo[1], eo[2]]) : [0, 0, -1];
      barras.push({ ho, eo: b.off, vh: Math.hypot(sy[0], sz[0]), vh2: Math.hypot(sy[1], sz[1]), nm, sec: b.sec, p1: b.p1, p2: b.p2, eV: Math.hypot(b[pat].V2[0], b[pat].V3[0]), eV2: Math.hypot(b[pat].V2[1], b[pat].V3[1]), eI: b[pat].P[0], eJ: b[pat].P[1], hI: inv ? ph[1] : ph[0], hJ: inv ? ph[0] : ph[1] });
    }
    const nodos = [];
    for (const [nm, d] of Object.entries(ref[pat])) { const i = idx.get(key(ref.pts[nm])); if (i === undefined) continue; nodos.push({ p: ref.pts[nm], e: d, h: U.get(i) ?? [0, 0, 0] }); }
    out[pat] = { barras, nodos };
  }
  return out;
}
if ((process.argv[1] ?? "").endsWith("cercha_cmp.mjs")) {
  const o = await medirCercha(JSON.parse(process.argv[2] || "{}"));
  for (const pat of ["Dead", "Live"]) {
    const { barras, nodos } = o[pat];
    let sq = [0, 0, 0], sr = [0, 0, 0];
    for (const n of nodos) for (let k = 0; k < 3; k++) { sq[k] += (n.h[k] - n.e[k]) ** 2; sr[k] += n.e[k] ** 2; }
    console.log(pat, "nodos", nodos.length, "U rms % x/y/z", sq.map((v, k) => (100 * Math.sqrt(v / sr[k])).toFixed(2)).join(" / "));
    const tub = barras.filter((b) => b.sec.startsWith("Tubo 50") && Math.abs(b.p1[1] - 29) < 1e-3 && Math.abs(b.p2[1] - 29) < 1e-3 && b.p1[0] > 78 && b.p2[0] < 85 + 1e-3 || false);
    console.log(" cercha y=29 x 78.7-84.7:", tub.length, "barras");
    for (const b of tub.sort((a, c) => a.p1[0] - c.p1[0] || a.p1[2] - c.p1[2])) console.log("  ", b.nm, b.p1.join(","), ">", b.p2.join(","), "ETABS Pi/Pj", b.eI.toFixed(3), b.eJ.toFixed(3), " Hek", b.hI.toFixed(3), b.hJ.toFixed(3));
  }
}
