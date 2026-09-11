/**
 * Capítulo 7 — Armar una zapata desde el ejemplo parametrizado: dimensiones,
 * CARGAS, y ver la presión de contacto suelo con el cursor (hover).
 * Se usa la zapata de Guerra Ej.1 (parametrizada). Se muestran los parámetros,
 * se cambian las cargas P y M, y se lee la presión en el cursor.
 */
export const titulo = "Hekatan Struct · zapata: cargas y presión con el cursor";
export const ruta = "workspace/?t=guerra-ej1-zapata-cuadrada";

const hover = async (a, px, py, n = 8) => {
  await a.pag.mouse.move(px, py, { steps: 16 });
  await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x: px, y: py });
  await a.quieto(n, 320);
};

export const pasos = [
  {
    rotulo: "Portada",
    hacer: async (a) => { await a.portada("Zapata: cargas y presión", "Capítulo 7", 16); },
  },
  {
    rotulo: "1 · La zapata parametrizada",
    hacer: async (a) => {
      await a.general(); await a.quieto(3, 300);
      await hover(a, 640, 360, 6);   // presión con la carga por defecto (P=91)
    },
  },
  {
    rotulo: "2 · Subimos las cargas de la columna",
    hacer: async (a) => {
      // clave REAL del parámetro (no la etiqueta): P_dead / M_dead.
      await a.param("P_D", "P_dead", 160, 3500);    // carga muerta 91 → 160 tonf
      await a.param("M_D", "M_dead", 25, 3500);     // momento 12 → 25 tonf·m
      await a.quieto(2, 300); await a.sinCuadro();
    },
  },
  {
    rotulo: "3 · La presión SUBE — leída en el cursor",
    hacer: async (a) => {
      await a.general(); await a.quieto(2, 300);
      await hover(a, 640, 360, 8);   // pico bajo la columna, ahora mayor
    },
  },
  {
    rotulo: "4 · Otro punto: la presión de contacto baja",
    hacer: async (a) => {
      await hover(a, 540, 430, 8);   // hacia el borde
    },
  },
];
