/**
 * Capítulo 0 — La pantalla de entrada: DÓNDE SE ELIGE con qué trabajar.
 *
 * Es lo primero que hay que contar. Antes de tocar un mando, el que abre Hekatan
 * Struct tiene tres caminos, y elegir mal cuesta media hora: empezar de cero, abrir
 * algo que ya existe, o mirar el catálogo de ejemplos.
 */
export const titulo = "Hekatan Struct · la pantalla de entrada";
export const ruta = "inicio/index.html";

export const pasos = [
  {
    rotulo: "1 · La pantalla de entrada: tres caminos",
    hacer: async (a) => { await a.general(); await a.quieto(12, 300); },
  },
  {
    rotulo: "2 · Modelo nuevo — empezar de cero",
    hacer: async (a) => {
      await a.cercaSel("a.card");
      await a.marcarSel("a.card",
        "Empezar de cero: se dibuja o se escribe con comandos, y se guarda como .heks");
      await a.quieto(11, 300);
    },
  },
  {
    rotulo: "3 · Modelo existente — abrir lo que ya hay",
    hacer: async (a) => {
      await a.cercaSel("#abrir");
      await a.marcarSel("#abrir",
        "Abrir un modelo guardado. También es la puerta para lo que viene de ETABS o SAP2000.");
      await a.quieto(11, 300);
    },
  },
  {
    rotulo: "4 · Ejemplos — el catálogo por categorías",
    hacer: async (a) => {
      await a.cercaSel("a.card.sec");
      await a.marcarSel("a.card.sec",
        "Zapatas, placas, cáscaras, pórticos: modelos ya montados, para mirar y comparar.");
      await a.quieto(11, 300);
    },
  },
  {
    rotulo: "5 · Y de ahí se entra al programa",
    hacer: async (a) => {
      await a.sinCuadro(); await a.general(); await a.quieto(8, 300);
    },
  },
];
