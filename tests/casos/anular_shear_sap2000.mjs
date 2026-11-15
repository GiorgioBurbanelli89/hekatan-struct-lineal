/**
 * EL banco del Shell-THICK — Ejemplo 2-012 del manual de verificación de
 * SAP2000 24 (`Manuals\Verification\Analysis\Shells\Problem 2-012.pdf`):
 * *«PLATE BENDING WHEN SHEAR DEFORMATIONS ARE SIGNIFICANT»*.
 *
 * ## Por qué este caso
 *
 * Es el único de los 20 de cáscara que está montado **para el Thick**, y el
 * único que da la flexión y el cortante **por separado** con fuente
 * independiente: Roark & Young 1975, p. 376.
 *
 *     flexión   -0.00521 in
 *     cortante  -0.000125 in
 *     suma      -0.00534 in
 *
 * Placa anular, radio interior 1.4", exterior 2", **espesor 0.5"** — o sea
 * `t/(R_o−R_i) = 0.83`, gruesa de verdad, que es el único sitio donde el
 * cortante transversal pesa. Apoyo simple en el borde interior, libre en el
 * exterior, carga lineal de 800 lb/in en r=1.8". Malla 6×96 (radial ×
 * tangencial), la del manual.
 *
 * SAP2000 monta **tres** modelos, y aquí se reproducen los tres:
 *
 * | modelo | qué mide | referencia | SAP2000 |
 * |---|---|---|---|
 * | A thin | solo flexión (Kirchhoff no tiene cortante) | -0.00521 | +0.2 % |
 * | A thick | flexión + cortante | -0.00534 | 0 % |
 * | B thick con `v13=v23=1000` | solo flexión (el cortante se hace 1000× rígido) | -0.00521 | 0 % |
 *
 * La gracia del tercero: **aísla el cortante por resta**, `A − B`, y lo compara
 * con el -0.000125 publicado. Es la única medida directa que hay del término de
 * cortante transversal contra una fuente externa.
 *
 * ## Lo que mide, medido el 31-ago-2026
 *
 *     malla        thin      thick   thick+v13   cortante
 *     3x48       +0.30 %    +0.30 %   +0.40 %    -0.01 %
 *     6x96       +0.15 %    +0.09 %   +0.18 %    +0.20 %     <- la del manual
 *     12x192     +0.12 %    +0.04 %   +0.13 %    +0.25 %
 *
 * Y en el thin **le ganamos a SAP2000**, que publica +0.2 %.
 *
 * ⚠️ Con malla gruesa (1×12, 2×24) el error es del 20–50 %, pero eso **no es
 * del elemento**: con 12 divisiones tangenciales el anillo es un dodecágono, no
 * un círculo. Es error de geometría y por eso el caso no las incluye.
 *
 * ## Por qué importa que este caso pase
 *
 * La celda 12×12 del Shell-Thick **no** coincide con la de ETABS/SAP (43–83 %,
 * ver `validation/02-placas/celda-12x12-vs-csi/`). Este caso dice que aun así
 * el resultado **físico** cierra al 0.09 % contra teoría publicada: son dos
 * elementos distintos que convergen a la misma solución. Que la matriz difiera
 * no es lo mismo que estar roto, y este caso es el que lo separa.
 */
import { cargarFem } from "../lib/bundle.mjs";

const RI = 1.4, RO = 2.0, RL = 1.8, T = 0.5, E = 18e6, NU = 0.3, Q = 800;
// Roark & Young 1975, p.376
const REF = { flexion: -0.00521, cortante: -0.000125, suma: -0.00534 };

function malla(NR, NT) {
  const nodes = [], idx = [], elements = [];
  for (let i = 0; i <= NR; i++) {
    idx.push([]);
    const r = RI + (RO - RI) * i / NR;
    for (let j = 0; j < NT; j++) {
      const a = 2 * Math.PI * j / NT;
      idx[i].push(nodes.length);
      nodes.push([r * Math.cos(a), r * Math.sin(a), 0]);
    }
  }
  for (let i = 0; i < NR; i++)
    for (let j = 0; j < NT; j++) {
      const k = (j + 1) % NT;
      elements.push([idx[i][j], idx[i][k], idx[i + 1][k], idx[i + 1][j]]);
    }
  return { nodes, elements, idx,
           iL: Math.round((RL - RI) / (RO - RI) * NR),   // anillo de la carga
           P: -Q * (2 * Math.PI * RL / NT) };            // arco por nudo, hacia abajo
}

export const nombre = "anular-shear-sap2000";
export const descripcion =
  "Ej.2-012 de SAP2000: placa anular gruesa, flexion y cortante POR SEPARADO (Roark & Young 1975)";

export async function correr() {
  const { deform } = await cargarFem();

  function flecha(m, pf, v13) {
    const { nodes, elements, idx, iL, P } = m;
    const supports = new Map(), loads = new Map();
    // placa pura: los GDL del plano se sujetan siempre (si no, singular)
    for (let n = 0; n < nodes.length; n++)
      supports.set(n, [true, true, false, false, false, true]);
    // apoyo SIMPLE en el borde interior: solo Uz, los giros libres
    for (const n of idx[0]) supports.set(n, [true, true, true, false, false, true]);
    for (const n of idx[iL]) loads.set(n, [0, 0, P, 0, 0, 0]);
    const mp = (v) => new Map(elements.map((_, k) => [k, v]));
    const inp = { thicknesses: mp(T), elasticities: mp(E), poissonsRatios: mp(NU),
                  densities: mp(0), plateFormulations: mp(pf) };
    if (v13) inp.shellModifiers = mp([1, 1, 1, 1, 1, 1, v13, v13]);
    const d = deform(nodes, elements, { supports, loads }, inp);
    // borde EXTERIOR, media de los nudos del anillo (si hay asimetria, se ve)
    let s = 0;
    for (const n of idx[idx.length - 1]) s += d.deformations?.get(n)?.[2] ?? NaN;
    return s / idx[idx.length - 1].length;
  }

  const m = malla(6, 96);                       // la malla del manual
  const wThin = flecha(m, 1);
  const wThick = flecha(m, 0);
  const wThickV = flecha(m, 0, 1000);
  const dif = (a, b) => Math.abs(a / b - 1) * 100;

  const extra = [];
  const NOMBRES_PF = { 1: "Thin (DKE+ITW)", 6: "DKE libro (Wilson)", 0: "Thick (MITC4)", 4: "DSE (Wilson)", 8: "Thick CSI", 3: "DKMQ (Katili)", 5: "Auricchio-Taylor" };
  if (process.env.PFS) for (const pf of process.env.PFS.split(",").map(Number)) {
    const thin = pf === 1 || pf === 6, wA = flecha(m, pf), wB = flecha(m, pf, 1000);
    extra.push({ que: `${NOMBRES_PF[pf]} · A (${thin ? "flexion" : "flexion + cortante"})`, medido: dif(wA, thin ? REF.flexion : REF.suma), limite: 100, ok: true,
      detalle: `${wA.toExponential(6)} vs ${thin ? REF.flexion : REF.suma}` });
    if (!thin) extra.push({ que: `${NOMBRES_PF[pf]} · B v13=v23=1000 (solo flexion) y cortante A-B`, medido: dif(wB, REF.flexion), limite: 100, ok: true,
      detalle: `B ${wB.toExponential(6)} vs ${REF.flexion} · cortante ${(wA - wB).toExponential(4)} vs ${REF.cortante} (${dif(wA - wB, REF.cortante).toFixed(2)} %)` });
  }
  return [
    ...extra,
    { que: "A thin · solo flexion", medido: dif(wThin, REF.flexion), limite: 0.5,
      ok: dif(wThin, REF.flexion) <= 0.5,
      detalle: `${wThin.toExponential(6)} vs ${REF.flexion} (Roark & Young)` +
               `   — SAP2000 publica +0.2 %` },
    { que: "A thick · flexion + cortante", medido: dif(wThick, REF.suma), limite: 0.5,
      ok: dif(wThick, REF.suma) <= 0.5,
      detalle: `${wThick.toExponential(6)} vs ${REF.suma}   — el banco del Shell-Thick` },
    { que: "B thick v13=v23=1000 · solo flexion", medido: dif(wThickV, REF.flexion),
      limite: 0.5, ok: dif(wThickV, REF.flexion) <= 0.5,
      detalle: `${wThickV.toExponential(6)} vs ${REF.flexion}` +
               `   — el cortante hecho 1000x rigido` },
    { // Esta es la unica medida DIRECTA del cortante transversal contra una
      // fuente externa: sale por resta de los dos modelos thick.
      que: "el CORTANTE aislado (A - B)", medido: dif(wThick - wThickV, REF.cortante),
      limite: 1.0, ok: dif(wThick - wThickV, REF.cortante) <= 1.0,
      detalle: `${(wThick - wThickV).toExponential(6)} vs ${REF.cortante}` },
  ];
}
