/** Portico de 1 vano espacial (6x6 m): Hekatan vs ETABS por variante de cubierta (plana, 3 %, 10 %). Reusa vano_cmp / momentos_cmp. */
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { cargarMod, key } from "./vano_cmp.mjs";
import { resolverHeks } from "./heks.mjs";
import { medirFuerzas, resumenFuerzas } from "./momentos_cmp.mjs";
export { cargarMod };
const AQUI = dirname(fileURLToPath(import.meta.url));
export const PREF = "e2k_portico1vano_";
export const VARIANTES = [["plana", "plana (0 %)"], ["P3", "pendiente 3 %"], ["P10", "pendiente 10 %"]];
const silencio = async (f) => { const l = console.log, w = console.warn, e = console.error, i = console.info; console.log = console.warn = console.error = console.info = () => {};
  try { return await f(); } finally { console.log = l; console.warn = w; console.error = e; console.info = i; } };
export const leerRef = (nom) => JSON.parse(readFileSync(join(AQUI, "..", "datos", `${PREF}${nom}_ref.json`), "utf-8"));

/** Desplazamientos y reacciones: maximo de ETABS (y nudo), Hek en ese nudo, error del peor nudo, sumas y reacciones por apoyo. */
export async function medirPortico(mod, nom, pats = ["Dead", "Live", "LATX", "LATY"]) {
  const ref = leerRef(nom), dir = mkdtempSync(join(tmpdir(), "port-"));
  const res = await silencio(() => mod.e2kAHeks(readFileSync(join(AQUI, "..", "datos", `${PREF}${nom}.e2k`), "latin1"), `${nom}.e2k`, {}));
  const fh = join(dir, `${nom}.heks`); writeFileSync(fh, res.heks);
  const out = { res, heks: fh, nElem: res.modelo.elements.length, nNodes: res.modelo.nodes.length, pat: {} };
  for (const pat of pats) {
    globalThis.__hekatanFactoresPatron = { [pat]: 1 };
    const s = await silencio(() => resolverHeks(fh));
    const idx = new Map(s.nodes.map((p, i) => [key(p), i]));
    const U = s.deformOutputs.deformations, Rn = s.deformOutputs.reactions;
    const d = { max: [], eMax: [], hAt: [], nodo: [], peor: [], nodoPeor: [], Rtot: [0, 0, 0], Etot: [0, 0, 0], apoyos: [], sinNodo: 0 };
    for (let k = 0; k < 3; k++) {
      let mx = 0, nm = "", pk = 0, np = "";
      for (const [n, v] of Object.entries(ref.JointDispl[pat])) {
        const i = idx.get(key(ref.pts[n])); if (i === undefined) { d.sinNodo++; continue; }
        const u = U.get(i) ?? [0, 0, 0];
        if (Math.abs(v[k]) > Math.abs(mx)) { mx = v[k]; nm = n; }
        const e = Math.abs(u[k] - v[k]); if (e > pk) { pk = e; np = n; }
      }
      const i = idx.get(key(ref.pts[nm])); d.eMax.push(mx * 1e3); d.hAt.push((U.get(i) ?? [0, 0, 0])[k] * 1e3);
      d.nodo.push(ref.pts[nm]); d.peor.push(pk * 1e3); d.nodoPeor.push(ref.pts[np]);
    }
    for (const [n, v] of Object.entries(ref.JointReact[pat])) {
      const h = Rn?.get(idx.get(key(ref.pts[n]))) ?? [0, 0, 0];
      for (let k = 0; k < 3; k++) { d.Rtot[k] += h[k]; d.Etot[k] += v[k]; }
      if (ref.pts[n][2] < 1e-6) d.apoyos.push({ p: ref.pts[n], e: v.slice(0, 3), h: [h[0], h[1], h[2]] });
    }
    d.apoyos.sort((a, b) => a.p[0] - b.p[0] || a.p[1] - b.p[1]);
    out.pat[pat] = d;
  }
  return out;
}

/** Pico |.| de una fuerza de barra por clase y posicion (extremos = estaciones 0 y 2, media luz = 1): ETABS y Hek. */
export function picos(lista, cls, campo) {
  const o = { eExt: 0, hExt: 0, eMid: 0, hMid: 0 }, pk = (a, b) => Math.max(a, Math.abs(b));   // magnitudes (el signo de un pico antisimetrico es ambiguo)
  for (const r of lista) if (r.cls === cls) for (let k = 0; k < 3; k++) {
    const e = r.e[campo][k], h = r.h[campo][k];
    if (k === 1) { o.eMid = pk(o.eMid, e); o.hMid = pk(o.hMid, h); } else { o.eExt = pk(o.eExt, e); o.hExt = pk(o.hExt, h); }
  }
  return o;
}
export { medirFuerzas, resumenFuerzas };
export const medirBarras = (mod, nom, pats) => medirFuerzas(mod, PREF, nom, {}, pats);
