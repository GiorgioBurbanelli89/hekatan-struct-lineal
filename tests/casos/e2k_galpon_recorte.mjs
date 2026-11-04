/**
 * E2K: un GALPON recortado del «mercado» (ventana x 24..36 m, y 85.4..91.4 m: 212 barras de 10 secciones, 12 paños de
 * cubierta membrana, 28 nudos de corte empotrados) contra ETABS 22 por OAPI, Dead y Live, nudo a nudo.
 * Referencia y script: C:\ETABS\mercado\galpon\hacer_galpon.py (se repite con una ventana mayor para añadir pórticos).
 *
 * Tres causas del importador halladas aquí (cada una con su fila):
 *   1. ANALISIS DIRECTO (AISC): ETABS analiza con EA y EI × 0.8 en acero y CFT. Sin eso todo salia 0.817 × ETABS (18 % rms).
 *   2. Correas/tubos ARTICULADOS (RELEASE M2/M3): el peso se horneaba como barra EMPOTRADA (momentos ±wL²/12 en los nudos).
 *   3. PUNTO DE INSERCION: sin TRANSFORMSTIFF "Yes" ETABS no transforma la rigidez (CARDINALPT solo geometrico).
 */
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "e2k-galpon-recorte";
export const descripcion = "e2k: galpon recortado del mercado vs ETABS 22 (Dead/Live nudo a nudo, analisis directo, correas articuladas, TRANSFORMSTIFF)";

export async function correr() {
  const mod = await empaquetar(
    `export { e2kAHeks } from "${R}/examples/src/shared/e2kAHeks";\n` +
    `export { TAM_MEMBRANA_ETABS } from "${R}/examples/src/shared/e2kAHeks";
` +
    `export { cargaBarraConsistente, condensarCargaPorLiberaciones } from "${R}/examples/src/shared/cargaBarraConsistente";\n`, "e2k-galpon-recorte");
  const ref = JSON.parse(readFileSync(join(AQUI, "..", "datos", "e2k_galpon1_ref.json"), "utf-8"));
  const log = console.log, warn = console.warn; console.log = () => {}; console.warn = () => {};
  let res; try { res = mod.e2kAHeks(readFileSync(join(AQUI, "..", "datos", "e2k_galpon1.e2k"), "latin1"), "galpon1.e2k"); }
  finally { console.log = log; console.warn = warn; }
  const dir = mkdtempSync(join(tmpdir(), "galpon1-")), fh = join(dir, "g.heks"); writeFileSync(fh, res.heks);
  const key = (p) => p.map((v) => Math.round(v * 1000)).join("|");
  const filas = [];
  const md = res.modelo.analisis.metodoDirecto;
  filas.push({ que: "analisis directo: barras con E × 0.8 (acero + CFT; el hormigon no)", crudo: true, medido: md?.barras ?? 0, limite: "200 de 212", ok: md?.barras === 200, detalle: `acero ${md?.acero}, compuestas ${md?.compuesto}` });
  const resolver = async (pat) => {
    globalThis.__hekatanFactoresPatron = { [pat]: 1 };
    const l = console.log, w = console.warn, e = console.error; console.log = () => {}; console.warn = () => {}; console.error = () => {};
    try { return await resolverHeks(fh); } finally { console.log = l; console.warn = w; console.error = e; }
  };
  for (const pat of ["Dead", "Live"]) {
    const s = await resolver(pat);
    const idx = new Map(s.nodes.map((p, i) => [key(p), i]));
    const U = s.deformOutputs.deformations, Rn = s.deformOutputs.reactions;
    const sq = [0, 0, 0], sr = [0, 0, 0], pk = [0, 0, 0], mx = [0, 0, 0]; let n = 0, sin = 0;
    for (const [nm, d] of Object.entries(ref[pat])) {
      const i = idx.get(key(ref.pts[nm])); if (i === undefined) { sin++; continue; }
      const u = U.get(i) ?? [0, 0, 0]; n++;
      for (let k = 0; k < 3; k++) { const e = u[k] - d[k]; sq[k] += e * e; sr[k] += d[k] * d[k]; pk[k] = Math.max(pk[k], Math.abs(e)); mx[k] = Math.max(mx[k], Math.abs(d[k])); }
    }
    const umax = Math.max(...mx);
    filas.push({ que: `${pat}: nudos de ETABS casados por coordenada`, crudo: true, medido: `${n} (${sin} sin casar)`, limite: "120 de 120", ok: n === 120 && sin === 0, detalle: "" });
    const rel = (k) => 100 * Math.sqrt(sq[k] / (sr[k] || 1));
    filas.push({ que: `${pat}: Uz rms relativo`, crudo: true, medido: `${rel(2).toFixed(2)} % (max ETABS ${(mx[2] * 1000).toFixed(4)} mm, peor ${(pk[2] * 1000).toFixed(4)} mm)`, limite: "<= 5 %", ok: rel(2) <= 5, detalle: "antes del arreglo 17 %" });
    // Ux/Uy: del orden de 0.1-0.25 mm (cubierta membrana + correas articuladas); cota provisional, ≤ 20 % del desplazamiento maximo
    for (const k of [0, 1]) {
      const p = 100 * pk[k] / umax;
      filas.push({ que: `${pat}: U${"xy"[k]} peor nudo / desplazamiento maximo`, crudo: true, medido: `${p.toFixed(1)} % (${(pk[k] * 1000).toFixed(3)} mm)`, limite: "<= 5 %", ok: p <= 5, detalle: "antes 15 %: la membrana ignoraba los nudos que cuelgan de su borde (edge constraint de ETABS), ver bitacora" });
    }
    // 4. CUBIERTA INCLINADA: las vigas de un paño se buscaban a la cota de su primer nudo; en un tejado con pendiente
    //    se descartaban las del lado alto y toda la carga caía en la del lado bajo (esquinas x = 24: 8.06 y 2.46 kN contra 7.02 y 1.42 de ETABS).
    for (const [c, eFz] of Object.entries(ref.esquinasFz?.[pat] ?? {})) {
      const i = idx.get(key(c.split(",").map(Number))), h = Rn?.get(i)?.[2] ?? NaN, d = 100 * (h - eFz) / eFz;
      filas.push({ que: `${pat}: reaccion Fz del apoyo de cubierta (${c})`, crudo: true, medido: `${h.toFixed(3)} kN (${d >= 0 ? "+" : ""}${d.toFixed(2)} %)`, limite: `ETABS ${eFz.toFixed(3)} ±3 %`,
        ok: Math.abs(d) <= 3, detalle: "reparto de la losa en una dirección sobre vigas a distinta cota (plano del paño)" });
    }
    let fz = 0; for (const [, v] of Rn ?? []) fz += v[2];
    const e = ref.base[pat].Fz, dif = 100 * (fz - e) / e, tol = pat === "Dead" ? 0.8 : 0.05;
    filas.push({ que: `${pat}: reaccion vertical total`, crudo: true, medido: `${fz.toFixed(3)} kN (${dif >= 0 ? "+" : ""}${dif.toFixed(2)} %)`, limite: `ETABS ${e.toFixed(3)} ±${tol} %`,
      ok: Math.abs(dif) <= tol, detalle: pat === "Dead" ? "+0.5 % = peso: ETABS descuenta mas longitud de brazos automaticos en vigas y el area poligonal de los CFT" : "" });
  }
  // 5. MEMBRANA DE CUBIERTA partida en los nudos de su borde (`membranaEnNudos`, defecto; ya no hace falta `tamMembrana`): cada paño de 1×6 m es UN Q4 de relacion 6:1, demasiado rigido en el plano.
  //    Subdividido a 1.25 m (= FLOORMESHMAXSIZE por defecto) el empuje horizontal casa con ETABS (cordones inferiores y Fx de
  //    los apoyos) y Ux/Uy rms bajan de 69 %/50 % a 13 %/11 %. Sin la opcion, el comportamiento anterior no cambia (filas de arriba).
  {
    const log2 = console.log, warn2 = console.warn, info2 = console.info; console.log = () => {}; console.warn = () => {}; console.info = () => {};
    let r2; try { r2 = mod.e2kAHeks(readFileSync(join(AQUI, "..", "datos", "e2k_galpon1.e2k"), "latin1"), "galpon1.e2k", {}); }
    finally { console.log = log2; console.warn = warn2; console.info = info2; }
    const f2 = join(dir, "g_mem.heks"); writeFileSync(f2, r2.heks);
    const resolver2 = async (pat) => {
      globalThis.__hekatanFactoresPatron = { [pat]: 1 };
      const l = console.log, w = console.warn, e = console.error; console.log = () => {}; console.warn = () => {}; console.error = () => {};
      try { return await resolverHeks(f2); } finally { console.log = l; console.warn = w; console.error = e; }
    };
    for (const pat of ["Dead", "Live"]) {
      const s = await resolver2(pat), idx = new Map(s.nodes.map((p, i) => [key(p), i]));
      const U = s.deformOutputs.deformations;
      const sq = [0, 0, 0], sr = [0, 0, 0];
      for (const [nm, d] of Object.entries(ref[pat])) {
        const i = idx.get(key(ref.pts[nm])); if (i === undefined) continue;
        const u = U.get(i) ?? [0, 0, 0];
        for (let k = 0; k < 3; k++) { sq[k] += (u[k] - d[k]) ** 2; sr[k] += d[k] ** 2; }
      }
      for (const k of [0, 1]) {
        const rel = 100 * Math.sqrt(sq[k] / (sr[k] || 1));
        filas.push({ que: `${pat}: U${"xy"[k]} rms relativo con la membrana partida en los nudos del borde`, crudo: true, medido: `${rel.toFixed(1)} %`, limite: "<= 12 % (sin partir: 48-70 %)", ok: rel <= 12, detalle: "membranaEnNudos (defecto): edge constraint de ETABS" });
      }
      if (pat === "Live") {
        const A = s.analyzeOutputs, el = new Map();
        s.elements.forEach((e, i) => { if (e.length === 2) el.set(key(s.nodes[e[0]]) + ">" + key(s.nodes[e[1]]), i); });
        // cordon inferior Tubo 50 (y=90.4, x=30..34), P de ETABS Live (OAPI)
        const cord = [[30, 12.53, 31, 12.56, 2.2413], [31, 12.56, 32, 12.59, 4.3103], [32, 12.59, 33, 12.62, 4.5263], [33, 12.62, 34, 12.65, 2.9239]];
        for (const [x1, z1, x2, z2, pe] of cord) {
          const i = el.get(key([x1, 90.4, z1]) + ">" + key([x2, 90.4, z2])), P = Math.abs(A.normals.get(i)?.[1] ?? NaN), d = 100 * (P - pe) / pe;
          filas.push({ que: `Live: axil del cordon Tubo 50 x=${x1}..${x2}, y=90.4`, crudo: true, medido: `${P.toFixed(3)} kN (${d >= 0 ? "+" : ""}${d.toFixed(1)} %)`, limite: `ETABS ${pe.toFixed(3)} ±3 %`, ok: Math.abs(d) <= 3, detalle: "1 elemento por paño: +10..+40 %" });
        }
        const ni = s.nodes.findIndex((p) => key(p) === key([36, 90.4, 13.46])), fx = s.deformOutputs.reactions.get(ni)?.[0] ?? NaN, dfx = 100 * (fx - 5.6592) / 5.6592;
        filas.push({ que: "Live: Fx del apoyo de corte (36,90.4,13.46)", crudo: true, medido: `${fx.toFixed(3)} kN (${dfx >= 0 ? "+" : ""}${dfx.toFixed(1)} %)`, limite: "ETABS 5.659 ±3 %", ok: Math.abs(dfx) <= 3, detalle: "1 elemento por paño: 6.64 (+17 %)" });
      }
    }
  }
  // condensacion del vector de empotramiento por los giros liberados (viga horizontal L = 6, w = 2 kN/m hacia abajo)
  const Lb = 6, w = 2, a = [0, 0, 0], b = [Lb, 0, 0];
  const base = mod.cargaBarraConsistente(a, b, 0, Lb, w, w, [0, 0, -1]);
  const near = (x, y) => Math.abs(x - y) < 1e-9;
  const aa = mod.condensarCargaPorLiberaciones(base, a, b, [false, false, false, false, true, true, false, false, false, false, true, true]);
  filas.push({ que: "correa articulada en I y J: sin momentos de empotramiento, F = wL/2", crudo: true,
    medido: `M=[${aa.slice(3, 6).map((v) => v.toFixed(3))}|${aa.slice(9, 12).map((v) => v.toFixed(3))}] Fz=${aa[2].toFixed(3)}/${aa[8].toFixed(3)}`, limite: "M=0, Fz=-6 (hacia abajo)",
    ok: aa.slice(3, 6).concat(aa.slice(9, 12)).every((v) => near(v, 0)) && near(aa[2], -w * Lb / 2) && near(aa[8], -w * Lb / 2), detalle: "" });
  const bb = mod.condensarCargaPorLiberaciones(base, a, b, [false, false, false, false, false, false, false, false, false, false, true, true]);
  filas.push({ que: "empotrada-articulada (J liberado): M_i = wL²/8, Fz_i = 5wL/8, Fz_j = 3wL/8", crudo: true,
    medido: `|M_i|=${Math.hypot(...bb.slice(3, 6)).toFixed(4)} Fz=${bb[2].toFixed(4)}/${bb[8].toFixed(4)}`, limite: `${(w * Lb * Lb / 8).toFixed(4)}, -${(5 * w * Lb / 8).toFixed(4)}/-${(3 * w * Lb / 8).toFixed(4)}`,
    ok: near(Math.hypot(...bb.slice(3, 6)), w * Lb * Lb / 8) && near(bb[2], -5 * w * Lb / 8) && near(bb[8], -3 * w * Lb / 8) && near(Math.hypot(...bb.slice(9, 12)), 0), detalle: "" });
  return filas;
}
