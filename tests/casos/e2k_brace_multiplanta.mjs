/**
 * E2K: BRACE que abarca varias plantas (`LINE "D399" BRACE "584" "732" 2`) con pt1 != pt2: una DIAGONAL recta de
 * (pt1, planta de abajo) a (pt2, planta de arriba). El importador la partía en la planta de en medio por el punto pt1
 * (vertical + tramo roto) porque otro objeto usaba esa clave: las cerchas del mercado quedaban 4-5 veces mas blandas en Uz.
 * Ventana x 36..54, y 12..24 del mercado (174 nudos, 370 barras, 36 panos) vs ETABS 22 por OAPI (hacer_galpon.py 4 --v 36 54 12 24).
 * Antes del arreglo: Uz rms 118 %, Ux 304 %. Despues: 1.5 % / 2.7 %.
 */
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "e2k-brace-multiplanta";
export const descripcion = "e2k: diagonal BRACE de 2 plantas (pt1 != pt2) recta, no partida en la planta de en medio; ventana del mercado vs ETABS 22";

export async function correr() {
  const mod = await empaquetar(
    `export { e2kAHeks } from "${R}/examples/src/shared/e2kAHeks";\nexport { parseE2k } from "${R}/examples/src/shared/e2kParser";\n`, "e2k-brace-multiplanta");
  const texto = readFileSync(join(AQUI, "..", "datos", "e2k_brace_multiplanta.e2k"), "latin1");
  const ref = JSON.parse(readFileSync(join(AQUI, "..", "datos", "e2k_brace_multiplanta_ref.json"), "utf-8"));
  const log = console.log, warn = console.warn, info = console.info; console.log = () => {}; console.warn = () => {}; console.info = () => {};
  let res, m; try { m = mod.parseE2k(texto, { brazosAuto: true, pesoBarrasAparte: true, losaUnaDireccion: true, metodoDirecto: true }); res = mod.e2kAHeks(texto, "brace.e2k", {}); }
  finally { console.log = log; console.warn = warn; console.info = info; }
  const filas = [];
  // 1. mecanica: la diagonal D399 es UNA barra recta (42,18,11.94) -> (43,18,12.663)
  const tr = m.elementNames.map((n, i) => [n, i]).filter(([n]) => n.startsWith("D399"));
  const p = (q) => m.nodes[q].map((v) => +v.toFixed(3));
  const ok1 = tr.length === 1 && JSON.stringify(p(m.elements[tr[0][1]][0])) === "[42,18,11.94]" && JSON.stringify(p(m.elements[tr[0][1]][1])) === "[43,18,12.663]";
  filas.push({ que: "BRACE D399 (2 plantas, pt1 != pt2): una sola barra recta", crudo: true, medido: tr.map(([n, i]) => `${n} ${p(m.elements[i][0])}->${p(m.elements[i][1])}`).join(" | "), limite: "1 tramo (42,18,11.94)->(43,18,12.663)", ok: ok1, detalle: "antes: D399-1 vertical + D399-2 roto" });
  // las COLUMNAS de varias plantas (pt1 = pt2) siguen partidas por la planta que atraviesan: ninguna regresion
  const col = m.elementNames.filter((n) => /^C\d+-\d+$/.test(n)).length;
  filas.push({ que: "columnas multiplanta (pt1 = pt2) siguen partidas por planta", crudo: true, medido: `${col} tramos`, limite: ">= 1", ok: col >= 1, detalle: "" });
  const dir = mkdtempSync(join(tmpdir(), "brace-")), fh = join(dir, "g.heks"); writeFileSync(fh, res.heks);
  const key = (q) => q.map((v) => Math.round(v * 1000)).join("|");
  for (const pat of ["Dead", "Live"]) {
    globalThis.__hekatanFactoresPatron = { [pat]: 1 };
    const l = console.log, w = console.warn, e = console.error; console.log = () => {}; console.warn = () => {}; console.error = () => {};
    let s; try { s = await resolverHeks(fh); } finally { console.log = l; console.warn = w; console.error = e; }
    const idx = new Map(s.nodes.map((q, i) => [key(q), i]));
    const U = s.deformOutputs.deformations, Rn = s.deformOutputs.reactions;
    const sq = [0, 0, 0], sr = [0, 0, 0], pk = [0, 0, 0]; let n = 0, sin = 0;
    for (const [nm, d] of Object.entries(ref[pat])) {
      const i = idx.get(key(ref.pts[nm])); if (i === undefined) { sin++; continue; }
      const u = U.get(i) ?? [0, 0, 0]; n++;
      for (let k = 0; k < 3; k++) { const er = u[k] - d[k]; sq[k] += er * er; sr[k] += d[k] * d[k]; pk[k] = Math.max(pk[k], Math.abs(er)); }
    }
    const rel = (k) => 100 * Math.sqrt(sq[k] / (sr[k] || 1));
    filas.push({ que: `${pat}: nudos casados`, crudo: true, medido: `${n} (${sin} sin casar)`, limite: "174 de 174", ok: n === 174 && sin === 0, detalle: "" });
    filas.push({ que: `${pat}: Uz rms relativo`, crudo: true, medido: `${rel(2).toFixed(2)} % (peor ${(pk[2] * 1000).toFixed(4)} mm)`, limite: "<= 3 %", ok: rel(2) <= 3, detalle: "antes 118 %" });
    filas.push({ que: `${pat}: Ux rms relativo`, crudo: true, medido: `${rel(0).toFixed(2)} % (peor ${(pk[0] * 1000).toFixed(4)} mm)`, limite: "<= 5 %", ok: rel(0) <= 5, detalle: "antes 304 %" });
    let fz = 0; for (const [, v] of Rn ?? []) fz += v[2];
    const ef = Math.abs(fz - ref.Fz[pat]) / Math.abs(ref.Fz[pat]) * 100;
    filas.push({ que: `${pat}: reaccion total Fz`, crudo: true, medido: `${fz.toFixed(3)} vs ${ref.Fz[pat].toFixed(3)} (${ef.toFixed(2)} %)`, limite: "<= 0.5 %", ok: ef <= 0.5, detalle: "peso propio +0.2 %" });
  }
  return filas;
}
