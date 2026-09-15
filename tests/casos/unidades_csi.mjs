/**
 * LAS UNIDADES, contra las de CSI.
 *
 * En ETABS, SAP2000 y SAFE un sistema de unidades se llama literalmente
 * `<Fuerza>, <Longitud>, <Temperatura>` — `Kip, in, F` · `Kip, ft, F` ·
 * `KN, m, C` · `N, mm, C`— (los `eUnits` de la OAPI). De ahi sale
 * la regla que hay que cumplir, y es una sola:
 *
 *     el MOMENTO no es una unidad aparte: es FUERZA x LONGITUD del sistema
 *
 * Hekatan lo tenia en una tabla a mano (`kip -> 1.3558179`, o sea kip*ft) que
 * coincidia con ETABS mientras nadie tocara la longitud. Al cambiarla dejaba de
 * coincidir: `Kip, in, F` da kip*in, DOCE veces distinto, y sin avisar.
 *
 * Los numeros de referencia son las definiciones exactas, que no son de nadie:
 *   1 tonf = 9.80665 kN          1 kip = 4.4482216 kN
 *   1 in = 0.0254 m              1 ft = 0.3048 m
 *   1 kgf/cm2 = 98.0665 kPa      1 psi = 6.894757 kPa
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "unidades-csi";
export const descripcion =
  "el momento es fuerza x longitud del sistema, como en ETABS/SAP/SAFE";

export async function correr() {
  // ⚠️ `export * from` se evalua ANTES que las lineas de arriba (los imports de
  // ESM se izan), asi que el modulo veria un `localStorage` que aun no existe.
  // Con `await import` se cargan en orden.
  const U = await empaquetar(`
    const g = globalThis; g.window = g;
    g.localStorage = { _d:{}, getItem(k){return this._d[k]??null;},
                       setItem(k,v){this._d[k]=String(v);}, removeItem(k){delete this._d[k];} };
    g.document = { createElement: () => ({ style:{} }), body:{}, head:{} };
    const m = await import("${R}/examples/src/workspace/units");
    export const {
      forceUnit, lengthStructureUnit, toKnm, toKn, dispToM,
      etiquetaMomento, sistemaCSI, stressFactors, applyConsistentUnits,
    } = m;
  `, "unidades");

  const filas = [];
  const rel = (a, b) => (Math.abs(b) > 1e-14 ? Math.abs(a - b) / Math.abs(b) * 100 : Math.abs(a) * 100);
  const comprobar = (que, medido, exacto, limite, detalle) =>
    filas.push({ que, medido: +rel(medido, exacto).toFixed(6), limite,
                 ok: rel(medido, exacto) < limite, detalle });

  // ── el momento, sistema a sistema ──
  const casos = [
    { f: "kN",   l: "m",  knm: 1,                       nombre: "KN, m, C" },
    { f: "tonf", l: "m",  knm: 9.80665,                 nombre: "Tonf, m, C" },
    { f: "kip",  l: "ft", knm: 4.4482216 * 0.3048,      nombre: "Kip, ft, F" },
    { f: "kip",  l: "in", knm: 4.4482216 * 0.0254,      nombre: "Kip, in, F" },
    { f: "kN",   l: "mm", knm: 1 * 0.001,               nombre: "KN, mm, C" },
    { f: "tonf", l: "cm", knm: 9.80665 * 0.01,          nombre: "Tonf, cm, C" },
  ];
  for (const c of casos) {
    U.forceUnit.val = c.f;
    U.lengthStructureUnit.val = c.l;
    comprobar(`momento de «${c.nombre}» = 1 ${c.f}·${c.l}`,
      U.toKnm(1), c.knm, 0.001,
      `${U.toKnm(1).toExponential(6)} kN·m vs ${c.knm.toExponential(6)} — y la etiqueta sale «${U.etiquetaMomento()}»`);
  }

  // El que estaba mal: kip con la longitud en pulgadas.
  U.forceUnit.val = "kip"; U.lengthStructureUnit.val = "in";
  filas.push({ que: "kip + in NO puede dar kip·ft (era el fallo)", crudo: true,
    medido: U.etiquetaMomento(), limite: "kip·in", ok: U.etiquetaMomento() === "kip·in",
    detalle: "la tabla a mano daba kip·ft pasara lo que pasara con la longitud" });

  // ── fuerza y longitud, contra las definiciones exactas ──
  comprobar("1 tonf = 9.80665 kN", U.toKn(1, "tonf"), 9.80665, 1e-9, "definicion");
  comprobar("1 kip = 4.4482216 kN", U.toKn(1, "kip"), 4.4482216, 1e-6, "definicion");
  comprobar("1 in = 0.0254 m", U.dispToM(1, "in"), 0.0254, 1e-6, "definicion");

  // ── tensiones: las tres que se usan de verdad ──
  comprobar("1 kgf/cm² = 98.0665 kPa", 1 / U.stressFactors["kgf/cm²"], 98.0665, 1e-6, "definicion");
  comprobar("1 MPa = 1000 kPa", 1 / U.stressFactors["MPa"], 1000, 1e-9, "definicion");
  comprobar("1 psi = 6.894757 kPa", 1 / U.stressFactors["psi"], 6.894757, 0.001, "definicion");

  // ── los presets tienen que ser sistemas de CSI de verdad ──
  for (const n of ["Metric MKS", "Metric SI", "U.S. Imperial"]) {
    U.applyConsistentUnits(n);
    const s = U.sistemaCSI();
    filas.push({ que: `el preset «${n}» es un sistema de CSI`, crudo: true,
      medido: s, limite: "F, L, T", ok: /^(KN|Tonf|Kip), (mm|cm|m|in|ft), [CF]$/.test(s),
      detalle: `momento en ${U.etiquetaMomento()}` });
  }
  return filas;
}
