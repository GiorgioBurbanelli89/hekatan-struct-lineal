/**
 * DISEÑO DE LOSAS POR FRANJAS CONTRA SAFE 20.3 (radier MOD_002 corregido, ACI 318-19).
 * Referencia: SAFE corriendo por OAPI sobre una COPIA de MOD_002_CORREGIDO_diseno.FDB
 * (validation/04-cimentaciones-safe/radier-mod002/franjas_safe/safe_extract.py, 18-sep-2026):
 * las fuerzas de cáscara por nudo de elemento que SAFE calculó, y lo que SAFE sacó de ellas:
 * Strip Forces (1542 filas), GetFlexureAndShear (257 estaciones) y el resumen Start/Middle/End
 * (264 filas = acero_por_franja_SAFE.csv). Los tres se reproducen con
 * examples/src/shared/stripDesign.ts a partir SOLO de las fuerzas de cáscara y la geometría.
 * Datos: tests/datos/radier_franjas_safe.json (gen_franjas_safe_ref.py). Unidades kgf-mm.
 * Tolerancia: 1e-4 relativo (4 cifras) o 0.05 kgf·m / 0.05 kgf / 1e-3 mm² absoluto.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "franjas-vs-safe";
export const descripcion = "diseño de losa vs SAFE 20.3 (ACI 318-19): franjas (fuerzas, estaciones, Start/Middle/End, n varillas) y elementos finitos (acero por nudo)";

export async function correr() {
  const D = JSON.parse(readFileSync(join(AQUI, "..", "datos", "radier_franjas_safe.json"), "utf-8"));
  const mod = await empaquetar(`export * from "${R}/examples/src/shared/stripDesign";\n`, "stripDesign");
  const K = ["F11", "F22", "F12", "M11", "M22", "M12", "V13", "V23"];
  const toF = a => Object.fromEntries(K.map((k, i) => [k, a[i]]));
  const elems = D.elems.map(e => ({ id: e.id, xy: e.xy, h: e.h, design: e.design, footing: e.footing,
    byCase: Object.fromEntries(Object.entries(e.forces).map(([c, arr]) => [c, arr.map(toF)])),
    forces: e.forces.Dead.map((_, k) => toF(K.map((_, i) => Object.entries(D.combo).reduce((s, [c, f]) => s + f * e.forces[c][k][i], 0)))) }));
  const cut = new mod.StripCutter(elems, D.prefs);
  const S = Object.fromEntries(D.strips.map(s => [s.name, s]));
  const rel = (a, b, ab) => Math.abs(a - b) <= Math.max(1e-4 * Math.abs(b), ab);
  const filas = [];

  // 1. Strip Forces por caso
  let peor = 0, dondeP = "", malas = 0;
  for (const r of D.stripForces) {
    const f = cut.stripForce(S[r.strip], r.station, r.loc === "Before" ? -1 : 1, (e, k) => e.byCase[r.case][k]);
    for (const [k, ab] of [["P", 0.05], ["V2", 0.05], ["T", 50], ["M3", 50]]) {
      const e = Math.abs(f[k] - r[k]) / Math.max(Math.abs(r[k]), 1);
      if (!rel(f[k], r[k], ab)) malas++;
      if (e > peor && Math.abs(r[k]) > (k === "T" || k === "M3" ? 1e5 : 100)) { peor = e; dondeP = `${r.strip} ${r.station / 1000} ${r.loc} ${r.case} ${k}: ${f[k].toFixed(2)} vs ${r[k]}`; }
    }
  }
  filas.push({ que: "Strip Forces P/V2/T/M3", crudo: true, medido: `${D.stripForces.length * 4 - malas}/${D.stripForces.length * 4}`, limite: "4 cifras", ok: malas === 0, detalle: `peor rel ${(peor * 100).toExponential(2)} % (${dondeP})` });

  // 2. estaciones (GetFlexureAndShear)
  const est = {}; malas = 0; let peorE = 0, dondeE = "";
  for (const r of D.stations) {
    const st = cut.designStation(S[r.strip], r.station);
    (est[r.strip] ??= []).push(st);
    const chk = [["AsTop", st.AsTop, r.AsTop, 1e-3], ["AsBot", st.AsBot, r.AsBot, 1e-3], ["MTop", -Math.abs(st.MTop), r.MTop, 50],
                 ["MBot", Math.abs(st.MBot), r.MBot, 50], ["AminTop", st.AminTop, r.AminTop, 1e-3], ["AminBot", st.AminBot, r.AminBot, 1e-3],
                 ["V", st.V, r.V, 0.05], ["Av/s", st.Av_s, r.Av_s, 1e-6], ["ancho", st.width, r.width, 0.01]];
    let bad = false;
    for (const [k, a, b, ab] of chk) {
      if (!rel(a, b, ab)) { bad = true; if (!dondeE) dondeE = `${r.strip} ${r.station / 1000} ${k}: ${a} vs ${b}`; }
      if (Math.abs(b) > 1) peorE = Math.max(peorE, Math.abs(a - b) / Math.abs(b));
    }
    if (bad) malas++;
  }
  filas.push({ que: "estaciones As/M/Amin/V/Av", crudo: true, medido: `${D.stations.length - malas}/${D.stations.length}`, limite: "4 cifras", ok: malas === 0, detalle: `peor rel ${(peorE * 100).toExponential(2)} %${dondeE ? "  " + dondeE : ""}` });

  // 3. resumen Start/Middle/End (acero_por_franja_SAFE.csv)
  const sum = {};
  for (const name of Object.keys(est)) {
    const sp = D.spans.filter(s => s.strip === name);
    for (const z of mod.summarizeSpans(est[name], sp, 0.1)) sum[`${name}|${z.span}|${z.location}`] = z;
  }
  malas = 0; let peorS = 0, dondeS = "";
  for (const r of D.acero) {
    const z = sum[`${r.strip}|${r.span}|${r.loc}`];
    if (!z) { malas++; dondeS ||= `falta ${r.strip} ${r.span} ${r.loc}`; continue; }
    const chk = [["FTopMoment", z.MTop, r.MTop, 50], ["FTopArea", z.AsTop, r.AsTop, 1e-3], ["FBotMoment", z.MBot, r.MBot, 50],
                 ["FBotArea", z.AsBot, r.AsBot, 1e-3], ["VForce", z.V, r.V, 0.05], ["VArea", z.Av_s, r.Av_s, 1e-6]];
    let bad = false;
    for (const [k, a, b, ab] of chk) {
      if (!rel(a, b, ab)) { bad = true; dondeS ||= `${r.strip} ${r.span} ${r.loc} ${k}: ${a} vs ${b}`; }
      if (Math.abs(b) > 1) peorS = Math.max(peorS, Math.abs(a - b) / Math.abs(b));
    }
    if (bad) malas++;
  }
  // 4. número de varillas Ø12 (regla de SAFE Display→Strip Design: n = ⌈As/Ab⌉, Ab de la lista de barras del modelo)
  //    captura de SAFE: CSA1 máx. sup. As = 0.002434 m² → «22-12»
  let nOk = 0, nTot = 0;
  const Ab12 = 113.099998474121;   // mm², REINFORCING BAR SIZES del modelo
  for (const r of D.acero) for (const k of ["AsTop", "AsBot"]) {
    const z = sum[`${r.strip}|${r.span}|${r.loc}`]; if (!z) continue;
    const nH = mod.armado(z[k] / 1e6, 1, 12).n, nS = r[k] > 0 ? Math.ceil(r[k] / Ab12 - 1e-9) : 0;
    const nHs = z[k] > 0 ? Math.ceil(z[k] / Ab12 - 1e-9) : 0;   // misma área de barra que SAFE
    nTot++; if (nHs === nS) nOk++;
  }
  filas.push({ que: "n varillas Ø12 (⌈As/Ab⌉)", crudo: true, medido: `${nOk}/${nTot}`, limite: "exacto", ok: nOk === nTot, detalle: "SAFE CSA1 sup. máx «22-12» = ⌈0.002434/1.131e-4⌉" });
  filas.push({ que: "Start/Middle/End acero", crudo: true, medido: `${D.acero.length - malas}/${D.acero.length}`, limite: "4 cifras", ok: malas === 0, detalle: `peor rel ${(peorS * 100).toExponential(2)} %${dondeS ? "  " + dondeS : ""}` });
  // 5. DISEÑO POR ELEMENTOS FINITOS: acero por nudo de cada elemento (arrays «Slab Design Data» del FDB de SAFE)
  const FE = JSON.parse(readFileSync(join(AQUI, "..", "datos", "radier_fe_safe.json"), "utf-8")).elems;
  let feN = 0, feBad = 0, fePeor = 0, feDonde = "", minBad = 0;
  for (const e of elems) {
    const ref = FE[e.id]; if (!ref) continue;
    for (let k = 0; k < 4; k++) {
      const r = cut.feNode(e.forces[k], e.h);
      for (const c of ["top1", "bot1", "top2", "bot2"]) {
        const a = r[c], b = ref[c][k]; feN++;
        if (!(Math.abs(a - b) <= Math.max(1e-4 * Math.abs(b), 1e-9))) { feBad++; feDonde ||= `${e.id} nudo ${k + 1} ${c}: ${a} vs ${b}`; }
        if (b > 1e-6) fePeor = Math.max(fePeor, Math.abs(a - b) / b);
      }
      for (const d of [1, 2]) {
        const [t, bo] = mod.feConMinimo(r["top" + d], r["bot" + d], r.amin);
        if (Math.abs(t - ref[`top${d}min`][k]) > 1e-4 * Math.max(ref[`top${d}min`][k], 1e-6) ||
            Math.abs(bo - ref[`bot${d}min`][k]) > 1e-4 * Math.max(ref[`bot${d}min`][k], 1e-6)) minBad++;
      }
    }
  }
  filas.push({ que: "FE: As por nudo (4 dir/cara)", crudo: true, medido: `${feN - feBad}/${feN}`, limite: "4 cifras", ok: feBad === 0 && feN === 3616, detalle: `peor rel ${(fePeor * 100).toExponential(2)} %${feDonde ? "  " + feDonde : ""}` });
  filas.push({ que: "FE: As con mínimo", crudo: true, medido: `${feN - 2 * minBad}/${feN}`, limite: "4 cifras", ok: minBad === 0, detalle: "ρmin·h en la cara con más acero" });
  return filas;
}
