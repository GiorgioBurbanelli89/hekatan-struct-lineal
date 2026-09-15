/**
 * El SECTION DESIGNER: secciones compuestas, contra fórmulas exactas.
 *
 * `examples/src/shared/sectionDesigner.ts`:
 * cada forma se convierte en POLIGONO y las propiedades salen de integrar. Una
 * fórmula por forma es una lista que siempre se queda corta, y ya se quedó: 54
 * barras de un modelo real entraban con área CERO porque su forma no estaba.
 *
 * Aquí se comprueba contra lo que se sabe de memoria: un rectángulo, un
 * círculo, un tubo, una I. Si la integración estuviera mal, estas cuatro lo
 * dicen antes de que nadie modele nada.
 *
 * Y las dos cosas que solo tiene una sección COMPUESTA:
 *   · el hueco resta (un tubo no es un rectángulo macizo)
 *   · con dos materiales manda la seccion TRANSFORMADA, no la suma de áreas
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "section-designer";
export const descripcion =
  "secciones compuestas por polígonos: área e inercia contra fórmula exacta";

const cargar = () => empaquetar(
  `export * from "${R}/examples/src/shared/sectionDesigner";\n`, "sd");

export async function correr() {
  const SD = await cargar();
  const filas = [];
  const rel = (a, b) => (Math.abs(b) > 1e-14 ? Math.abs(a - b) / Math.abs(b) * 100 : Math.abs(a) * 100);

  // ── 1 · rectángulo: A = b·d, I = b·d³/12 ──
  {
    const p = SD.propiedadesSD([{ forma: { tipo: "rect", d: 0.6, b: 0.3 } }], 2e7);
    filas.push({ que: "rectángulo 0.30×0.60 — área", medido: +rel(p.A, 0.18).toFixed(4),
      limite: 0.01, ok: rel(p.A, 0.18) < 0.01, detalle: `${p.A.toFixed(6)} vs 0.180000 m²` });
    const Iex = 0.3 * 0.6 ** 3 / 12;
    filas.push({ que: "rectángulo — inercia fuerte b·d³/12", medido: +rel(p.Iz, Iex).toFixed(4),
      limite: 0.01, ok: rel(p.Iz, Iex) < 0.01, detalle: `${p.Iz.toExponential(4)} vs ${Iex.toExponential(4)}` });
  }

  // ── 2 · círculo: A = πd²/4, I = πd⁴/64 ──
  // Se integra como polígono de 32 lados, así que no da exacto: el área de un
  // polígono inscrito es menor. Lo que se comprueba es que el error sea el que
  // toca (~0.3 %) y no cualquier cosa.
  {
    const p = SD.propiedadesSD([{ forma: { tipo: "circle", d: 0.4 } }], 2e7);
    const Aex = Math.PI * 0.4 ** 2 / 4, Iex = Math.PI * 0.4 ** 4 / 64;
    filas.push({ que: "círculo Ø0.40 — área (polígono de 64 lados)",
      medido: +rel(p.A, Aex).toFixed(3), limite: 0.2, ok: rel(p.A, Aex) < 0.2,
      detalle: `${p.A.toFixed(6)} vs ${Aex.toFixed(6)} m² — inscrito, sale algo menor` });
    filas.push({ que: "círculo — inercia πd⁴/64", medido: +rel(p.Iz, Iex).toFixed(3),
      limite: 0.4, ok: rel(p.Iz, Iex) < 0.4, detalle: `${p.Iz.toExponential(4)} vs ${Iex.toExponential(4)}` });
  }

  // ── 3 · EL HUECO RESTA ──
  // Un tubo 200×200×10: A = 200² − 180² = 7600 mm². Si el hueco no restara
  // saldría 40000, o sea 5 veces más: es la comprobación que caza que el
  // polígono interior va al revés.
  {
    const p = SD.propiedadesSD([{ forma: { tipo: "tube", d: 0.2, b: 0.2, tf: 0.01, tw: 0.01 } }], 2e7);
    const Aex = 0.2 * 0.2 - 0.18 * 0.18;
    filas.push({ que: "tubo 200×200×10 — el hueco RESTA", medido: +rel(p.A, Aex).toFixed(3),
      limite: 0.01, ok: rel(p.A, Aex) < 0.01,
      detalle: `${(p.A * 1e6).toFixed(0)} mm² vs ${(Aex * 1e6).toFixed(0)} — macizo serían 40000` });
    const Iex = (0.2 ** 4 - 0.18 ** 4) / 12;
    filas.push({ que: "tubo — inercia (b·d³ − bi·di³)/12", medido: +rel(p.Iz, Iex).toFixed(3),
      limite: 0.01, ok: rel(p.Iz, Iex) < 0.01, detalle: `${p.Iz.toExponential(4)} vs ${Iex.toExponential(4)}` });
  }

  // ── 4 · perfil I ──
  {
    const d = 0.4, b = 0.2, tf = 0.015, tw = 0.01;
    const p = SD.propiedadesSD([{ forma: { tipo: "isection", d, b, tf, tw } }], 2e7);
    const Aex = 2 * b * tf + (d - 2 * tf) * tw;
    const Iex = (b * d ** 3 - (b - tw) * (d - 2 * tf) ** 3) / 12;
    filas.push({ que: "perfil I 400×200×15×10 — área", medido: +rel(p.A, Aex).toFixed(3),
      limite: 0.05, ok: rel(p.A, Aex) < 0.05, detalle: `${(p.A * 1e4).toFixed(2)} cm² vs ${(Aex * 1e4).toFixed(2)}` });
    filas.push({ que: "perfil I — inercia fuerte", medido: +rel(p.Iz, Iex).toFixed(3),
      limite: 0.05, ok: rel(p.Iz, Iex) < 0.05, detalle: `${p.Iz.toExponential(4)} vs ${Iex.toExponential(4)}` });
  }

  // ── 5 · DOS MATERIALES: manda la sección transformada ──
  // Una madera (E = 1.1e7) y un acero (E = 2e8) del mismo tamaño, pegados. El
  // área transformada al acero NO es la suma de las dos: la madera cuenta
  // n = 1.1e7/2e8 = 0.055 de lo suyo. Sumarlas a pelo daría una viga 17 veces
  // más rígida de lo que es.
  {
    const Es = 2e8, Em = 1.1e7;
    const p = SD.propiedadesSD([
      { forma: { tipo: "rect", d: 0.2, b: 0.1 }, yc: 0.1, E: Es },
      { forma: { tipo: "rect", d: 0.2, b: 0.1 }, yc: -0.1, E: Em },
    ], Es);
    const Aex = 0.02 + 0.02 * (Em / Es);
    filas.push({ que: "acero + madera — área TRANSFORMADA, no la suma",
      medido: +rel(p.A, Aex).toFixed(3), limite: 0.01, ok: rel(p.A, Aex) < 0.01,
      detalle: `${(p.A * 1e4).toFixed(2)} cm² vs ${(Aex * 1e4).toFixed(2)} — sumarlas daría 400.00` });
    // Y el centroide se va hacia el acero, que es lo que hace que la sección
    // trabaje descentrada.
    filas.push({ que: "y el centroide se desplaza hacia el material rígido",
      medido: +p.cy.toFixed(4), limite: 0.05, ok: p.cy > 0.05,
      detalle: `cy = ${p.cy.toFixed(4)} m (con un solo material sería 0)` });
  }

  // ── 6 · lo que trae un .e2k de verdad ──
  {
    const f = SD.formaDesdeE2k("STEEL CHANNEL", 0.25, 0.05, 0.005, 0.005);
    const ok = f && f.tipo === "channel";
    filas.push({ que: "el SHAPETYPE del .e2k se traduce a forma", crudo: true,
      medido: f ? f.tipo : "null", limite: "channel", ok,
      detalle: "STEEL CHANNEL / STEEL ANGLE / STEEL TUBE / CONCRETE RECTANGULAR…" });
    // Una forma desconocida NO puede devolver cero: eso deja la barra sin
    // rigidez y hace singular la matriz sin decir nada.
    const g = SD.formaDesdeE2k("LO QUE SEA", 0.3, 0.2, 0, 0);
    filas.push({ que: "una forma desconocida cae al rectángulo que la envuelve, NO a cero",
      crudo: true, medido: g ? g.tipo : "null", limite: "rect", ok: !!g && g.tipo === "rect",
      detalle: "un área 0 deja la barra sin rigidez y la matriz singular" });
  }

  return filas;
}
