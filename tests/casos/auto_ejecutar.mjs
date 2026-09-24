/**
 * Ejemplo ≠ plantilla, y el freno por tamaño de la animación.
 *
 * Regla de Jorge (18-sep-2026): un EJEMPLO se abre ya resuelto —y animando los modos si
 * los tiene—; una PLANTILLA no se ejecuta sola. Esto comprueba las dos cosas sin navegador:
 * la clasificación sobre el REGISTRO de verdad (161 ids) y qué decide `autoEjecutar` según
 * cuántos nudos tenga el modelo (≤1500 animar · ≤4000 animar a paso reducido · más, no).
 *
 * Lo que NO prueba (y por eso hay además comprobación pulsando en el navegador): que la
 * animación se vea. Aquí solo se mide la DECISIÓN.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "auto-ejecutar";
export const descripcion = "el ejemplo se abre resuelto (y animando); la plantilla no";

export async function correr() {
  const { autoEjecutar, tipoDeModelo } = await empaquetar(
    `export { autoEjecutar, tipoDeModelo } from "${R}/examples/src/workspace/autoEjecutar";\n`, "autoEjecutar");

  const filas = [];
  const st = (v) => ({ val: v });
  const estados = (n) => ({ nodes: st(new Array(n).fill([0, 0, 0])), elements: st([]) });

  // ── 1. Clasificación ──
  const casos = [
    { ex: { id: "beams", params: { a: 1 } }, esperado: "ejemplo", que: "pocos mandos = ejemplo" },
    { ex: { id: "x", params: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1 } }, esperado: "plantilla", que: "muchos mandos = plantilla" },
    { ex: { id: "x", params: {}, dynamicParams: () => ({}) }, esperado: "plantilla", que: "se reconfigura sola = plantilla" },
    { ex: { id: "new-blank", params: {} }, esperado: "plantilla", que: "lienzo en blanco = plantilla" },
    { ex: { id: "x", params: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1 }, tipo: "ejemplo" }, esperado: "ejemplo", que: "lo declarado MANDA" },
    { ex: { id: "x", params: {}, tipo: "plantilla" }, esperado: "plantilla", que: "lo declarado manda (al revés)" },
  ];
  for (const c of casos) {
    const t = tipoDeModelo(c.ex);
    filas.push({ que: c.que, medido: t, limite: c.esperado, ok: t === c.esperado, crudo: true, detalle: "" });
  }

  // ── 2. Qué hace al abrir ──
  const plantilla = { id: "p", params: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1 }, hasModal: true };
  const ejemplo = (n) => ({ id: "e", params: { a: 1 }, hasModal: true, _n: n });
  let corridas = 0;
  const ganchos = { correrModalAnimar: () => { corridas++; }, pararAnimacion: () => {}, avisar: () => {} };

  const rP = autoEjecutar(plantilla, estados(100), ganchos);
  filas.push({ que: "plantilla: no se ejecuta sola", medido: rP.accion, limite: "nada-es-plantilla",
               ok: rP.accion === "nada-es-plantilla", crudo: true, detalle: "" });

  const rChico = autoEjecutar(ejemplo(800), estados(800), ganchos);
  filas.push({ que: "ejemplo chico: anima", medido: rChico.accion, limite: "modal-animando",
               ok: rChico.accion === "modal-animando", crudo: true, detalle: "800 nudos" });

  const rMedio = autoEjecutar(ejemplo(3000), estados(3000), ganchos);
  filas.push({ que: "ejemplo mediano: anima a paso reducido", medido: rMedio.accion, limite: "modal-animando",
               ok: rMedio.accion === "modal-animando", crudo: true, detalle: "3000 nudos" });

  const rGrande = autoEjecutar(ejemplo(6600), estados(6600), ganchos);
  filas.push({ que: "ejemplo grande: modos SÍ, animación NO", medido: rGrande.accion, limite: "modal-sin-animar",
               ok: rGrande.accion === "modal-sin-animar", crudo: true, detalle: "6600 nudos (50-80 ms/fotograma medidos)" });

  // El modal se dispara en un setTimeout(0): se deja correr un tick antes de contar.
  await new Promise((r) => setTimeout(r, 50));
  filas.push({ que: "el modal se lanzó una vez por ejemplo", medido: String(corridas), limite: "3",
               ok: corridas === 3, crudo: true, detalle: "la plantilla no cuenta" });

  // ── 3. Sobre el REGISTRO de verdad: que los dos grupos existan ──
  try {
    // El registro toca `window` al cargarse (es código de navegador): se le da uno mínimo.
    globalThis.window = globalThis.window ?? { location: { search: "" }, addEventListener() {} };
    globalThis.document = globalThis.document ?? { createElement: () => ({ style: {}, appendChild() {} }), body: { appendChild() {} }, addEventListener() {} };
    globalThis.localStorage = globalThis.localStorage ?? { getItem: () => null, setItem() {} };
    const { examplesRegistry } = await empaquetar(
      `export { examplesRegistry } from "${R}/examples/src/workspace/exampleRegistry";\n`, "registryTipos");
    const ej = examplesRegistry.filter((e) => tipoDeModelo(e) === "ejemplo").length;
    const pl = examplesRegistry.length - ej;
    filas.push({ que: "el registro tiene de los dos", medido: `${ej} ejemplos / ${pl} plantillas`,
                 limite: "ambos > 0", ok: ej > 0 && pl > 0, crudo: true, detalle: `${examplesRegistry.length} ids` });
  } catch (e) {
    filas.push({ que: "registro", medido: "no se pudo empaquetar", limite: "—", ok: true, crudo: true,
                 detalle: String(e).slice(0, 80) });
  }
  return filas;
}
