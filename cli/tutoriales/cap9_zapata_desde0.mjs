/**
 * Capítulo 9 — Una zapata DESDE CERO, escribiendo el modelo en la ventana de
 * comandos: nudos, la placa, el suelo (areaspring = Winkler) y la carga. Se
 * resuelve y se ve la presión de contacto con el cursor.
 */
export const titulo = "Hekatan Struct · una zapata desde cero";
export const ruta = "workspace/?t=cli-modeler";

const MODELO = [
  "node 1 0 0 0",
  "node 2 1.725 0 0",
  "node 3 3.45 0 0",
  "node 4 0 1.725 0",
  "node 5 1.725 1.725 0",
  "node 6 3.45 1.725 0",
  "node 7 0 3.45 0",
  "node 8 1.725 3.45 0",
  "node 9 3.45 3.45 0",
  "shell 1 1 2 5 4 0.45 2.5e7 0.2 2.4",
  "shell 2 2 3 6 5 0.45 2.5e7 0.2 2.4",
  "shell 3 4 5 8 7 0.45 2.5e7 0.2 2.4",
  "shell 4 5 6 9 8 0.45 2.5e7 0.2 2.4",
  "shelltype 1 thick", "shelltype 2 thick", "shelltype 3 thick", "shelltype 4 thick",
  "areaspring 1 286490", "areaspring 2 286490", "areaspring 3 286490", "areaspring 4 286490",
  "load 5 0 0 -1187",
  "solve",
].join("\n");

const escribir = async (a, texto) => {
  await a.pag.evaluate((t) => {
    const ta = document.querySelector("textarea");
    if (ta) { ta.value = t; ta.focus(); }
    window.__hekatanCliScript = t;
    try { window.__hekatanRebuild && window.__hekatanRebuild(); } catch (e) {}
  }, texto);
};

const hover = async (a, px, py, n = 8) => {
  await a.pag.mouse.move(px, py, { steps: 16 });
  await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x: px, y: py });
  await a.quieto(n, 320);
};

export const pasos = [
  {
    rotulo: "Portada",
    hacer: async (a) => { await a.portada("Una zapata desde cero", "Capítulo 9", 16); },
  },
  {
    rotulo: "1 · Escribimos el modelo en la ventana de comandos",
    hacer: async (a) => {
      await a.general(); await a.quieto(2, 300);
      await escribir(a, MODELO);
      await a.quieto(7, 350);   // se ve el texto y aparece la placa
    },
  },
  {
    rotulo: "2 · El suelo: areaspring (Winkler)",
    hacer: async (a) => {
      // Encender el mapa de presión (ahora disponible también en la CLI).
      await a.elegir("Shell results", "Pressure", 6000);
      await a.quieto(4, 320);
    },
  },
  {
    rotulo: "3 · La presión de contacto en el cursor",
    hacer: async (a) => {
      await a.general(); await a.quieto(2, 300);
      await hover(a, 640, 380, 8);
    },
  },
  {
    rotulo: "4 · Otro punto",
    hacer: async (a) => {
      await hover(a, 560, 440, 8);
    },
  },
];
