/**
 * Capítulo 6 — El VALOR en el cursor (hover) sobre el mapa de presión.
 * Se carga la zapata de Guerra Ej.1 y se pasa el cursor por el mapa: el visor
 * muestra el valor de la presión EN EL PUNTO del cursor, no solo en la barra.
 */
export const titulo = "Hekatan Struct · el valor en el cursor";
export const ruta = "workspace/?t=guerra-ej1-zapata-cuadrada";

// Mueve el ratón REAL a (px,py) en CSS (dispara el hover nativo del visor) y
// dibuja el cursor de tutorial; luego se queda quieto para que se vea el valor.
const hover = async (a, px, py, n = 7) => {
  await a.pag.mouse.move(px, py, { steps: 16 });
  await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x: px, y: py });
  await a.quieto(n, 320);
};

export const pasos = [
  {
    rotulo: "Portada",
    hacer: async (a) => { await a.portada("El valor en el cursor", "Capítulo 6", 16); },
  },
  {
    rotulo: "1 · El mapa de presión de la zapata",
    hacer: async (a) => {
      await a.general(); await a.quieto(3, 300);
      await a.marcarSel("#legend", "La barra da el rango; el valor exacto, en el cursor.");
      await a.quieto(3, 300); await a.sinCuadro();
    },
  },
  {
    rotulo: "2 · Cursor sobre la columna: presión alta",
    hacer: async (a) => {
      await hover(a, 640, 360, 8);   // centro-columna: presión pico
    },
  },
  {
    rotulo: "3 · Cursor hacia el borde: presión menor",
    hacer: async (a) => {
      await hover(a, 540, 430, 8);   // borde: baja la presión
    },
  },
  {
    rotulo: "4 · Otro punto",
    hacer: async (a) => {
      await hover(a, 720, 400, 8);
    },
  },
];
