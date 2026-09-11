/**
 * Rectángulo (CSS) de una barra del alzado 2D, para señalarla y pulsarla en un vídeo.
 *
 *   tipo "viga"    → la horizontal más larga (la de más arriba si empatan)
 *   tipo "columna" → la vertical más a la izquierda, la de abajo
 *
 * Las barras son líneas de SVG: su caja mide 0 de alto (o de ancho), así que se
 * engorda 8 px a cada lado — lo que mide la línea invisible que recibe el clic.
 */
export const barra2d = (pag, tipo = "viga") => pag.evaluate((t) => {
  const ls = [...document.querySelectorAll("#hk-diagrama-2d line")]
    .filter((l) => l.getAttribute("stroke") === "transparent")
    .map((l) => l.getBoundingClientRect());
  const hs = ls.filter((r) => (t === "viga" ? r.height < 1 && r.width > 20 : r.width < 1 && r.height > 20));
  if (!hs.length) return null;
  hs.sort(t === "viga"
    ? (a, b) => b.width - a.width || a.top - b.top
    : (a, b) => a.left - b.left || b.bottom - a.bottom);
  const r = hs[0];
  return t === "viga"
    ? { x: r.left, y: r.top - 8, w: r.width, h: 16 }
    : { x: r.left - 8, y: r.top, w: 16, h: r.height };
}, tipo);
