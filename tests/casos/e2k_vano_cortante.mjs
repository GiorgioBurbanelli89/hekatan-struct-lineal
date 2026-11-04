/**
 * E2K: UN VANO (6 x 6 m) con CORTANTE EN EL PLANO del techo contra ETABS 22 (OAPI). Mismo modelo que `e2k_vano_simple` (columnas CC 1 200x6,
 * VP I530, correas 1G articuladas cada 1 m, membrana A36 4 mm ONEWAYLOADDIST, pendiente 3 %) pero las columnas de y=6 NO son empotradas: base "UZ RX RY"
 * (deslizan en X/Y, giro impedido). Las de y=0 siguen empotradas. El techo solo se ata a y=0, asi la carga lateral de y=6 llega al apoyo POR CORTANTE de la membrana.
 * (Con base "UZ" solo el modelo era un MECANISMO: la columna es una barra que gira rigida con su base deslizando -> Uy ~1e9 m. Hace falta impedir el giro
 * o la traslacion de la base en cada plano.) Datos `tests/datos/e2k_vano_cortante_{E,F,G,H}.e2k` + `_ref.json` (generador `..._genera_etabs.py` + ext.py).
 *   E: 6 panos 1x6 (sin nudos colgados con panos de otra longitud) · F: x 3..6 sobrecubierta 1x4 (y 1..5) + Tubo 50 (nudos colgados en x=3, borde y=1/5)
 *   G: F con ADDRESTRAINT "Yes" · H: F con CARDINALPOINT "TOP" en las areas.
 * HALLAZGOS: ETABS no cambia NADA con ADDRESTRAINT ni CARDINALPOINT aqui (F = G = H a 1e-9 m); Hekatan con 1 Q4 por pano, membranaEnNudos o tamMembrana 1.25
 * da los desplazamientos a 1-2 %.
 *   Eent: E con las correas ENTERAS (sin nudos intermedios; 7 barras de 6 m). ETABS da el MISMO axil de correa que E (4.53 kN) => ETABS no ata los nudos
 *   intermedios de la correa al borde del paño cuando el area trae LINECONSTRAINT "No" (edge constraint apagado). CAUSA del axil distinto: Hekatan partia
 *   el paño en esos nudos (los ataba) y repartia el cortante de la membrana a todos; ETABS solo en las esquinas del paño. Arreglo: `colgadosSueltos`
 *   (defecto: se lee del e2k, suelto si todos los AREAASSIGN traen LINECONSTRAINT "No"; galpon1.e2k no lo trae = defecto de ETABS = atado, y ahi si ata).
 */
import { cargarMod, medir } from "../lib/vano_cmp.mjs";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const AQUI = dirname(fileURLToPath(import.meta.url));
const PREF = "e2k_vano_cortante_";
export const nombre = "e2k-vano-cortante";
export const descripcion = "e2k: vano 6x6 con cortante en el plano (base y=6 UZ RX RY) vs ETABS 22: E/F/G/H, mallas 1Q4 / tamMembrana 1.25, ADDRESTRAINT y CARDINALPOINT";

export async function correr() {
  const mod = await cargarMod();
  const filas = [];
  const fila = (que, medido, limite, ok, detalle = "") => filas.push({ que, crudo: true, medido, limite, ok, detalle });
  const f = (x, n = 4) => x.toFixed(n);
  const refs = {};
  for (const v of ["E", "F", "G", "H", "Eent"]) refs[v] = JSON.parse(readFileSync(join(AQUI, "..", "datos", `${PREF}${v}_ref.json`), "utf-8"));
  // 1) ETABS no esta en mecanismo: ningun desplazamiento > 1 m
  for (const v of ["E", "F", "G", "H"]) {
    let mx = 0; for (const pat of Object.values(refs[v].JointDispl)) for (const u of Object.values(pat)) for (let k = 0; k < 3; k++) mx = Math.max(mx, Math.abs(u[k]));
    fila(`ETABS ${v}: mayor |Ux|,|Uy|,|Uz| de todos los patrones`, `${f(mx * 1e3, 1)} mm`, "< 1000 mm", mx < 1, "base y=6 UZ RX RY: sin mecanismo (antes 3e8 m)");
  }
  // 2) ETABS: F = G = H (ADDRESTRAINT y CARDINALPOINT TOP no cambian nada)
  { const k3 = (p) => p.map((v) => Math.round(v * 1000)).join("|"), mapa = (r) => new Map(Object.entries(r.pts).map(([n, p]) => [k3(p), n]));
    for (const o of ["G", "H"]) { const pa = mapa(refs[o]); let w = 0;
      for (const pat of ["Dead", "Live", "LATX", "LATY"]) for (const [n, u] of Object.entries(refs.F.JointDispl[pat])) { const q = refs[o].JointDispl[pat][pa.get(k3(refs.F.pts[n]))]; for (let i = 0; i < 3; i++) w = Math.max(w, Math.abs(u[i] - q[i])); }
      fila(`ETABS: ${o} vs F, peor |dU| de todos los nudos y patrones`, `${w.toExponential(1)} m`, "<= 1e-7 m", w <= 1e-7, o === "G" ? "ADDRESTRAINT Yes = No" : "CARDINALPOINT TOP = MIDDLE (membrana)"); } }
  // 3) Hekatan vs ETABS, E y F con 3 mallas (G y H: iguales a F, se miden tambien con 1 Q4)
  const mallas = [["1 Q4 por pano", { membranaEnNudos: false }], ["membranaEnNudos (defecto)", {}], ["tamMembrana 1.25", { tamMembrana: 1.25 }], ["atado a los colgados (colgadosSueltos:false)", { colgadosSueltos: false }]];
  const M = {};
  for (const v of ["E", "F", "G", "H", "Eent"]) for (const [mn, opc] of (v === "E" || v === "F" ? mallas : mallas.slice(0, 1))) {
    const m = await medir(mod, v, opc, ["Dead", "Live", "LATX", "LATY"], PREF); M[`${v}|${mn}`] = m;
    for (const pat of ["Dead", "Live", "LATX", "LATY"]) {
      const d = m.pat[pat], lat = pat.startsWith("LAT"), nom = `${v} ${mn} ${pat}`;
      // peor nudo (mm) en los 3 ejes; en LATY el Ux/Uz son ruido (<0.5 mm) -> se mira Uy
      const lim = pat === "LATX" ? [4.5, 1.5, 0.03] : pat === "LATY" ? [0.6, 0.3, 0.01] : [0.01, 0.03, 0.06];
      fila(`${nom}: peor nudo |dUx|/|dUy|/|dUz| (mm)`, `${f(d.peor[0])} / ${f(d.peor[1])} / ${f(d.peor[2])}  (max ETABS ${f(d.max[0], 2)} / ${f(d.max[1], 2)} / ${f(d.max[2], 2)}; rms ${f(d.U[0], 2)} / ${f(d.U[1], 2)} / ${f(d.U[2], 2)} %)`,
        `<= ${lim.join(" / ")} mm`, d.peor.every((x, k) => x <= lim[k]), m.nodoPeor ? "" : "");
      fila(`${nom}: suma de reacciones Fx/Fy/Fz Hek vs ETABS`, `${d.Rtot.map((x) => f(x, 3)).join(" / ")} vs ${d.Etot.map((x) => f(x, 3)).join(" / ")} kN`, "|dif| <= 0.02 kN", d.Rtot.every((x, k) => Math.abs(x - d.Etot[k]) <= 0.02));
    }
    if (lat0(v)) { const d = m.pat.LATX; fila(`${v} ${mn} LATX: rms Ux/Uy relativo (%)`, `${f(d.U[0], 2)} / ${f(d.U[1], 2)}`, "<= 3 %", d.U[0] <= 3 && d.U[1] <= 3); }
  }
  function lat0(v) { return v === "E" || v === "F" || v === "Eent"; }
  // 4) G y H en Hekatan = F (el importador no usa ADDRESTRAINT ni CARDINALPOINT de la membrana)
  for (const o of ["G", "H"]) { const a = M["F|1 Q4 por pano"].pat.LATX, b = M[`${o}|1 Q4 por pano`].pat.LATX;
    fila(`Hek: ${o} igual a F (LATX peor Ux)`, `${f(a.peor[0], 5)} / ${f(b.peor[0], 5)} mm`, "dif <= 1e-6 mm", Math.abs(a.peor[0] - b.peor[0]) <= 1e-6); }
  // 5) AXIL de las barras en LATX contra ETABS. Defecto (colgados sueltos, LINECONSTRAINT "No") casa; atado (lo de antes) no.
  const on = (q, x) => Math.abs(q.p1[0] - x) < 1e-6 && Math.abs(q.p2[0] - x) < 1e-6, oy = (q, y) => Math.abs(q.p1[1] - y) < 1e-6 && Math.abs(q.p2[1] - y) < 1e-6;
  for (const [v, mn, eti] of [["E", "1 Q4 por pano", "defecto"], ["F", "1 Q4 por pano", "defecto"], ["Eent", "1 Q4 por pano", "correas enteras"]]) {
    const ax = M[`${v}|${mn}`].pat.LATX.axil, a = ax.filter((q) => on(q, 0) && q.sec.startsWith("1G"));
    const e = a.map((q) => q.etabs), h = a.map((q) => q.hek), cte = Math.max(...h) - Math.min(...h);
    fila(`${v} (${eti}) LATX: correa x=0, axil Hek constante en sus ${a.length} tramos`, `variacion ${f(cte, 3)} kN (${f(h[0], 2)} vs ETABS ${f(e[0], 2)} kN)`, "variacion <= 0.05 kN y dentro de 3 % de ETABS", cte <= 0.05 && Math.abs(h[0] - e[0]) <= 0.03 * e[0]);
    const vp = ax.filter((q) => oy(q, 0) && q.sec.startsWith("VP")), dv = Math.max(...vp.map((q) => Math.abs(q.hek - q.etabs)));
    fila(`${v} (${eti}) LATX: VP de y=0, peor |dP| de ${vp.length} tramos`, `${f(dv, 2)} kN (max ETABS ${f(Math.max(...vp.map((q) => q.etabs)), 2)})`, "<= 0.6 kN (antes 4.3)", dv <= 0.6);
    const tb = ax.filter((q) => q.sec.startsWith("Tubo"));
    if (tb.length) { const dt = Math.max(...tb.map((q) => Math.abs(q.hek - q.etabs))); fila(`${v} LATX: Tubo 50, peor |dP| de ${tb.length} tubos y correa x=3`, `${f(dt, 3)} kN`, "<= 0.1 kN (antes 1.1)", dt <= 0.1); }
  }
  // ETABS: correas enteras = correas partidas (no ata los nudos intermedios)
  { const g = (r) => r.barras && Object.values(r.barras).filter((b) => b.sec.startsWith("1G") && b.p1[0] === 0 && b.p2[0] === 0 && b.LATX).map((b) => Math.max(...b.LATX.P.map(Math.abs)));
    const a = g(refs.E), b = g(refs.Eent);
    fila("ETABS: axil de la correa x=0 en LATX, E (6 tramos) vs Eent (1 barra entera)", `${f(a[0], 3)} vs ${f(b[0], 3)} kN`, "dif <= 0.01 kN", Math.abs(a[0] - b[0]) <= 0.01, "ETABS no reparte cortante a los nudos intermedios de la correa"); }
  // atado a los colgados (lo de antes): documenta que NO casaba
  for (const v of ["E", "F"]) { const a = M[`${v}|atado a los colgados (colgadosSueltos:false)`].pat.LATX.axil.filter((q) => on(q, 0) && q.sec.startsWith("1G")).map((q) => q.hek);
    fila(`${v} atado a los colgados: axil de la correa x=0 decrece (informativo)`, `${f(Math.max(...a), 2)} -> ${f(Math.min(...a), 2)} kN`, "variacion > 1 kN (no casa con ETABS; ya no es el defecto)", Math.max(...a) - Math.min(...a) > 1); }
  return filas;
}
