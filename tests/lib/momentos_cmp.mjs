/**
 * Fuerzas de BARRA (P, V2, V3, M2, M3) Hekatan vs ETABS en extremos y a media luz, de las barras que sostienen la membrana.
 * Hekatan: `analyze()` da fuerzas de EXTREMO (con `fixedend` del vano ya sumado); el diagrama en el nudo i es el negativo,
 * en el j coincide (comparar.mjs), M2 con signo CSI. A media luz: la carga de vano es uniforme (tributaria de la losa o peso
 * propio): V lineal y M cuadratico con dM/dx = -V; se evalua en las estaciones de ETABS (absolutas desde el nudo i).
 */
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { cargarMod, key } from "./vano_cmp.mjs";
import { resolverHeks } from "./heks.mjs";
export { cargarMod };
const AQUI = dirname(fileURLToPath(import.meta.url));
const silencio = async (f) => { const l = console.log, w = console.warn, e = console.error, i = console.info; console.log = console.warn = console.error = console.info = () => {};
  try { return await f(); } finally { console.log = l; console.warn = w; console.error = e; console.info = i; } };
export const clase = (sec) => sec.startsWith("1G") ? "correa" : sec.startsWith("VP") ? "VP" : sec.startsWith("CC") ? "col" : sec.startsWith("Tubo") ? "tubo" : "otra";

/** Devuelve { pat: [ {sec, cls, L, p1, p2, e:{P,V2,V3,M2,M3:[i,mid,j]}, h:{...mismo}} ] } */
export async function medirFuerzas(mod, pref, nom, opc = {}, pats = ["Dead", "Live"], datos = null) {
  const dir = mkdtempSync(join(tmpdir(), "mom-"));
  const ref = JSON.parse(readFileSync(join(AQUI, "..", "datos", `${datos ?? pref}${nom}_ref.json`), "utf-8"));
  const { extraHeks = "", sinFixedEnd = false, ...opcE2k } = opc;   // sinFixedEnd: quita las lineas `fixedend` (el comportamiento de antes)
  const res = await silencio(() => mod.e2kAHeks(readFileSync(join(AQUI, "..", "datos", `${pref}${nom}.e2k`), "latin1"), `${nom}.e2k`, opcE2k));
  const fh = join(dir, `${nom}.heks`); const txt = sinFixedEnd ? res.heks.split("\n").filter((l) => !l.startsWith("fixedend ")).join("\n") : res.heks;
  writeFileSync(fh, extraHeks ? txt + "\n" + extraHeks + "\n" : txt);
  const out = {};
  for (const pat of pats) {
    globalThis.__hekatanFactoresPatron = { [pat]: 1 };
    const s = await silencio(() => resolverHeks(fh));
    const el = new Map(); s.elements.forEach((e, i) => { if (e.length === 2) el.set(key(s.nodes[e[0]]) + ">" + key(s.nodes[e[1]]), i); });
    const a = s.analyzeOutputs, lista = [];
    for (const b of Object.values(ref.barras)) {
      if (!b[pat]) continue;
      let i = el.get(key(b.p1) + ">" + key(b.p2)), inv = false;
      if (i === undefined) { i = el.get(key(b.p2) + ">" + key(b.p1)); inv = true; }
      if (i === undefined) continue;
      const g = (m) => m?.get?.(i) ?? [0, 0];
      const f = { P: g(a.normals), V2: g(a.shearsY), V3: g(a.shearsZ), M2: g(a.bendingsY), M3: g(a.bendingsZ) };
      const L = Math.hypot(b.p2[0] - b.p1[0], b.p2[1] - b.p1[1], b.p2[2] - b.p1[2]);
      // ETABS da las estaciones en la CARA del brazo rigido (loc absoluta desde el nudo i); el diagrama de Hekatan se evalua ahi
      const eo = s.elementInputs.endOffsets?.get(i), oi0 = eo ? eo[0] * eo[2] : 0, oj0 = eo ? eo[1] * eo[2] : 0;
      const [oi, oj] = inv ? [oj0, oi0] : [oi0, oj0];
      const xs = b[pat].loc;   // absolutas desde el nudo i (ETABS: estaciones desde el nudo; la primera cae en la cara del brazo)
      const h = {};
      for (const c of Object.keys(f)) {
        const [fi, fj] = inv ? [f[c][1], f[c][0]] : f[c];
        let di = -fi, dj = fj; if (c === "M2") { di = -di; dj = -dj; }
        h[c] = { i: di, j: dj };
      }
      // V y P lineales en x; M cuadratico con dM/dx = -V (diagrama CSI: M3 con V2, M2 con V3; signo comprobado contra ETABS)
      // la carga de vano solo actua entre las caras (luz libre Lc): en los brazos rigidos V es constante
      const Lc = Math.max(L - oi - oj, 1e-9), xe = (x) => Math.min(Math.max(x - oi, 0), Lc);
      const lin = (c, x) => h[c].i + (h[c].j - h[c].i) * xe(x) / Lc;
      const mom = (m, v, x) => h[m].i - h[v].i * (Math.min(x, oi) + xe(x)) - (h[v].j - h[v].i) * xe(x) ** 2 / (2 * Lc);
      const H = {
        P: xs.map((x) => lin("P", x)), V2: xs.map((x) => lin("V2", x)), V3: xs.map((x) => lin("V3", x)),
        M3: xs.map((x) => mom("M3", "V2", x)), M2: xs.map((x) => mom("M2", "V3", x)),
        // extremos en el NUDO (sin brazo) por si se quieren
        M3n: [h.M3.i, h.M3.j],
      };
      lista.push({ sec: b.sec, cls: clase(b.sec), L, p1: b.p1, p2: b.p2, inv, e: Object.fromEntries(["P", "V2", "V3", "M2", "M3"].map((c) => [c, b[pat][c]])), h: H });
    }
    out[pat] = lista;
  }
  return out;
}

/** Resumen por clase y campo: pico de ETABS y error maximo absoluto Hek-ETABS en extremos (estaciones 0 y 2) y a media luz (1). */
export function resumenFuerzas(lista, campos = ["M3", "M2", "V2", "V3", "P"]) {
  const o = {};
  for (const r of lista) for (const c of campos) {
    const q = ((o[r.cls] ??= {})[c] ??= { n: 0, pico: 0, errExt: 0, errMid: 0, pExt: 0, pMid: 0 });
    q.n++;
    for (let k = 0; k < 3; k++) {
      const e = r.e[c][k], h = r.h[c][k], d = Math.abs(e - h);
      q.pico = Math.max(q.pico, Math.abs(e));
      if (k === 1) { if (d > q.errMid) { q.errMid = d; q.pMid = e; } } else if (d > q.errExt) { q.errExt = d; q.pExt = e; }
    }
  }
  for (const cl of Object.values(o)) for (const q of Object.values(cl)) { q.pctExt = 100 * q.errExt / (q.pico || 1e-30); q.pctMid = 100 * q.errMid / (q.pico || 1e-30); }
  return o;
}
